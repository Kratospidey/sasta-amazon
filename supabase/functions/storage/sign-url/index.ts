import { z } from "../../_shared/deps.ts";
import { requireSubject } from "../../_shared/jwt.ts";
import { requireProfile } from "../../_shared/authz.ts";
import { createServiceClient } from "../../_shared/supabase.ts";
import { errorResponse, jsonResponse } from "../../_shared/responses.ts";

const payloadSchema = z.object({
  path: z.string().min(1),
  bucket: z.string().default("product-images"),
  expires_in: z.number().int().positive().max(60 * 60).default(60 * 5),
});

Deno.serve(async (req: Request) => {
  if (req.method !== "POST") {
    return errorResponse("method_not_allowed", "Only POST is supported", 405);
  }

  try {
    const subject = requireSubject(req);
    await requireProfile(subject);

    const raw = await req.json();
    const body = payloadSchema.parse(raw);

    const normalizedPath = body.path.replace(/^\//, "");
    if (normalizedPath.length === 0) {
      return errorResponse("validation_error", "path must not be empty", 400);
    }

    const client = createServiceClient();
    const { data, error } = await client.storage
      .from(body.bucket)
      .createSignedUrl(normalizedPath, body.expires_in);

    if (error) {
      throw error;
    }

    return jsonResponse({
      signed_url: data.signedUrl,
      expires_at: data.expiry ? new Date(data.expiry * 1000).toISOString() : null,
      path: normalizedPath,
      bucket: body.bucket,
    });
  } catch (err) {
    if (err instanceof Response) {
      return err;
    }
    console.error("storage/sign-url failure", err);
    return errorResponse("internal_error", "Unable to sign storage path.", 500);
  }
});
