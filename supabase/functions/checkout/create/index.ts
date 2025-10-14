import { z } from "../../_shared/deps.ts";
import { requireSubject } from "../../_shared/jwt.ts";
import { requireProfile } from "../../_shared/authz.ts";
import { jsonResponse, errorResponse } from "../../_shared/responses.ts";
import { withTransaction } from "../../_shared/db.ts";

const payloadSchema = z.object({
  payment_provider: z.string().optional(),
});

type CartItemRow = {
  game_id: string;
  qty: number;
  unit_price_in_cents: number;
  stock: number;
  title: string;
};

Deno.serve(async (req: Request) => {
  if (req.method !== "POST") {
    return errorResponse("method_not_allowed", "Only POST is supported", 405);
  }

  try {
    const subject = requireSubject(req);
    const profile = await requireProfile(subject);

    const raw = await req.json().catch(() => ({}));
    const body = payloadSchema.parse(raw);

    const checkoutResult = await withTransaction(async (client) => {
      const cartRow = await client.queryObject<{ id: string }>(
        `select id from public.carts where user_id = $1 order by created_at desc limit 1 for update`,
        profile.id,
      );
      if (cartRow.rows.length === 0) {
        throw errorResponse("cart_not_found", "Cart not found for user.", 404);
      }
      const cartId = cartRow.rows[0].id;

      const itemsResult = await client.queryObject<CartItemRow>(
        `select ci.game_id, ci.qty, ci.unit_price_in_cents, inv.stock, g.title
         from public.cart_items ci
         join public.inventory inv on inv.game_id = ci.game_id
         join public.games g on g.id = ci.game_id
         where ci.cart_id = $1
         for update of ci, inv`,
        cartId,
      );

      if (itemsResult.rows.length === 0) {
        throw errorResponse("cart_empty", "Cart has no items.", 400);
      }

      const insufficient: CartItemRow[] = itemsResult.rows.filter((item) => item.stock < item.qty);
      if (insufficient.length > 0) {
        throw errorResponse(
          "insufficient_stock",
          `Insufficient stock for ${insufficient.map((i) => i.title).join(", ")}.`,
          400,
        );
      }

      const total = itemsResult.rows.reduce((acc, item) => acc + item.unit_price_in_cents * item.qty, 0);
      const paymentIntent = `mock_intent_${crypto.randomUUID()}`;

      const orderInsert = await client.queryObject<{ id: string }>(
        `insert into public.orders (user_id, status, total_in_cents, payment_ref)
         values ($1, 'pending', $2, $3)
         returning id`,
        profile.id,
        total,
        paymentIntent,
      );
      const orderId = orderInsert.rows[0]?.id;
      if (!orderId) {
        throw new Error("Failed to create order");
      }

      for (const item of itemsResult.rows) {
        await client.queryArray(
          `insert into public.order_items (order_id, game_id, qty, unit_price_in_cents)
           values ($1, $2, $3, $4)`,
          orderId,
          item.game_id,
          item.qty,
          item.unit_price_in_cents,
        );
        await client.queryArray(
          `update public.inventory set stock = stock - $1 where game_id = $2`,
          item.qty,
          item.game_id,
        );
      }

      await client.queryArray(`delete from public.cart_items where cart_id = $1`, cartId);

      return { orderId, paymentIntent, totalInCents: total, provider: body.payment_provider ?? "mock" };
    });

    return jsonResponse({
      order_id: checkoutResult.orderId,
      payment_intent: checkoutResult.paymentIntent,
      total_in_cents: checkoutResult.totalInCents,
      payment_provider: checkoutResult.provider,
    });
  } catch (err) {
    if (err instanceof Response) {
      return err;
    }
    console.error("checkout/create failure", err);
    return errorResponse("internal_error", "Unexpected error creating checkout session.", 500);
  }
});
