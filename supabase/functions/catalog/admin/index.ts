import { z } from "../../_shared/deps.ts";
import { requireSubject } from "../../_shared/jwt.ts";
import { requireAdmin } from "../../_shared/authz.ts";
import { errorResponse, jsonResponse } from "../../_shared/responses.ts";
import { createServiceClient } from "../../_shared/supabase.ts";
import { withTransaction } from "../../_shared/db.ts";

const payloadSchema = z.object({
  entity: z.enum(["game", "publisher", "platform", "category"]),
  operation: z.enum(["list", "create", "update", "delete"]),
  id: z.string().uuid().optional(),
  data: z.record(z.unknown()).optional(),
});

const gameSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().optional(),
  price_in_cents: z.number().int().nonnegative(),
  release_date: z.string().optional(),
  publisher_id: z.string().uuid().nullable().optional(),
  platform_ids: z.array(z.string().uuid()).optional(),
  category_ids: z.array(z.string().uuid()).optional(),
  stock: z.number().int().nonnegative().optional(),
  is_active: z.boolean().optional(),
});

Deno.serve(async (req: Request) => {
  if (req.method !== "POST") {
    return errorResponse("method_not_allowed", "Only POST is supported", 405);
  }

  try {
    const subject = requireSubject(req);
    await requireAdmin(subject);

    const raw = await req.json();
    const body = payloadSchema.parse(raw);

    switch (body.entity) {
      case "publisher":
      case "platform":
      case "category":
        return await handleSimpleEntity(body.entity, body.operation, body.id, body.data);
      case "game":
        return await handleGame(body.operation, body.id, body.data);
      default:
        return errorResponse("unsupported_entity", `Unsupported entity ${body.entity}`, 400);
    }
  } catch (err) {
    if (err instanceof Response) {
      return err;
    }
    console.error("catalog/admin failure", err);
    return errorResponse("internal_error", "Unexpected catalog administration error.", 500);
  }
});

const tableMap: Record<'publisher' | 'platform' | 'category', string> = {
  publisher: 'publishers',
  platform: 'platforms',
  category: 'categories',
};

async function handleSimpleEntity(
  entity: "publisher" | "platform" | "category",
  operation: "list" | "create" | "update" | "delete",
  id?: string,
  data?: Record<string, unknown>,
): Promise<Response> {
  const client = createServiceClient();
  const table = tableMap[entity];

  if (operation === "list") {
    const { data: rows, error } = await client.from(table).select("*").order("created_at", { ascending: true });
    if (error) {
      throw error;
    }
    return jsonResponse({ items: rows });
  }

  if (operation === "delete") {
    if (!id) {
      return errorResponse("validation_error", "id is required for delete", 400);
    }
    const { error } = await client.from(table).delete().eq("id", id);
    if (error) {
      throw error;
    }
    return jsonResponse({ id });
  }

  if (!data) {
    return errorResponse("validation_error", "data payload required", 400);
  }

  const parsed = z.object({ name: z.string().min(1) }).parse(data);

  if (operation === "create") {
    const { data: row, error } = await client.from(table).insert(parsed).select().single();
    if (error) throw error;
    return jsonResponse(row);
  }

  if (!id) {
    return errorResponse("validation_error", "id is required for update", 400);
  }
  const { data: row, error } = await client.from(table).update(parsed).eq("id", id).select().single();
  if (error) throw error;
  return jsonResponse(row);
}

async function handleGame(
  operation: "list" | "create" | "update" | "delete",
  id?: string,
  data?: Record<string, unknown>,
): Promise<Response> {
  if (operation === "list") {
    const client = createServiceClient();
    const { data: rows, error } = await client
      .from("games")
      .select("*, inventory(stock, is_active), game_platforms(platform_id), game_categories(category_id)")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return jsonResponse({ items: rows });
  }

  if (operation === "delete") {
    if (!id) {
      return errorResponse("validation_error", "id is required for delete", 400);
    }
    await withTransaction(async (client) => {
      await client.queryArray(`delete from public.games where id = $1`, id);
    });
    return jsonResponse({ id });
  }

  if (!data) {
    return errorResponse("validation_error", "data payload required", 400);
  }
  const parsed = gameSchema.parse(data);

  const result = await withTransaction(async (client) => {
    let gameId = id ?? null;
    if (operation === "create") {
      const insert = await client.queryObject<{ id: string }>(
        `insert into public.games (title, slug, description, price_in_cents, release_date, publisher_id)
         values ($1, $2, $3, $4, $5, $6)
         on conflict (slug) do update
         set title = excluded.title,
             description = excluded.description,
             price_in_cents = excluded.price_in_cents,
             release_date = excluded.release_date,
             publisher_id = excluded.publisher_id
         returning id`,
        parsed.title,
        parsed.slug,
        parsed.description ?? null,
        parsed.price_in_cents,
        parsed.release_date ?? null,
        parsed.publisher_id ?? null,
      );
      gameId = insert.rows[0]?.id ?? null;
    } else if (operation === "update") {
      if (!id) {
        throw errorResponse("validation_error", "id is required for update", 400);
      }
      await client.queryArray(
        `update public.games
         set title = $1,
             slug = $2,
             description = $3,
             price_in_cents = $4,
             release_date = $5,
             publisher_id = $6
         where id = $7`,
        parsed.title,
        parsed.slug,
        parsed.description ?? null,
        parsed.price_in_cents,
        parsed.release_date ?? null,
        parsed.publisher_id ?? null,
        id,
      );
      gameId = id;
    }

    if (!gameId) {
      throw new Error("Unable to resolve game id");
    }

    if (parsed.platform_ids) {
      await client.queryArray(`delete from public.game_platforms where game_id = $1`, gameId);
      for (const platformId of parsed.platform_ids) {
        await client.queryArray(
          `insert into public.game_platforms (game_id, platform_id) values ($1, $2) on conflict do nothing`,
          gameId,
          platformId,
        );
      }
    }

    if (parsed.category_ids) {
      await client.queryArray(`delete from public.game_categories where game_id = $1`, gameId);
      for (const categoryId of parsed.category_ids) {
        await client.queryArray(
          `insert into public.game_categories (game_id, category_id) values ($1, $2) on conflict do nothing`,
          gameId,
          categoryId,
        );
      }
    }

    if (parsed.stock !== undefined || parsed.is_active !== undefined) {
      await client.queryArray(
        `insert into public.inventory (game_id, stock, is_active)
         values ($1, $2, coalesce($3, true))
         on conflict (game_id) do update
         set stock = excluded.stock,
             is_active = coalesce(excluded.is_active, public.inventory.is_active)`,
        gameId,
        parsed.stock ?? 0,
        parsed.is_active ?? null,
      );
    }

    const refreshed = await client.queryObject(
      `select g.*, i.stock, i.is_active
       from public.games g
       left join public.inventory i on i.game_id = g.id
       where g.id = $1`,
      gameId,
    );

    return refreshed.rows[0];
  });

  return jsonResponse(result);
}
