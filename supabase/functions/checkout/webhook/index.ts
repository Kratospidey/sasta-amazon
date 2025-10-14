import { z } from "../../_shared/deps.ts";
import { withTransaction } from "../../_shared/db.ts";
import { errorResponse, jsonResponse } from "../../_shared/responses.ts";

const payloadSchema = z.object({
  order_id: z.string().uuid(),
  status: z.enum(["paid", "failed"]),
  payment_reference: z.string().optional(),
  provider_event: z.string().optional(),
});

const WEBHOOK_SECRET = Deno.env.get("CHECKOUT_WEBHOOK_SECRET");

Deno.serve(async (req: Request) => {
  if (req.method !== "POST") {
    return errorResponse("method_not_allowed", "Only POST is supported", 405);
  }

  if (WEBHOOK_SECRET) {
    const provided = req.headers.get("x-webhook-secret");
    if (provided !== WEBHOOK_SECRET) {
      return errorResponse("unauthorized", "Webhook secret mismatch.", 401);
    }
  }

  try {
    const raw = await req.json();
    const body = payloadSchema.parse(raw);

    const result = await withTransaction(async (client) => {
      const existing = await client.queryObject<{ status: string }>(
        `select status from public.orders where id = $1 for update`,
        body.order_id,
      );
      if (existing.rows.length === 0) {
        throw errorResponse("order_not_found", "Order does not exist.", 404);
      }

      await client.queryArray(
        `update public.orders
         set status = $1,
             payment_ref = coalesce($2, payment_ref)
         where id = $3`,
        body.status,
        body.payment_reference ?? body.provider_event ?? null,
        body.order_id,
      );

      return { status: body.status };
    });

    return jsonResponse({ order_id: body.order_id, status: result.status });
  } catch (err) {
    if (err instanceof Response) {
      return err;
    }
    console.error("checkout/webhook failure", err);
    return errorResponse("internal_error", "Unable to process webhook.", 500);
  }
});
