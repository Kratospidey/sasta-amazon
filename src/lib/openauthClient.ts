import { createClient, type Client } from "@openauthjs/openauth/client";

const issuer = import.meta.env.VITE_OPENAUTH_ISSUER as string | undefined;
const clientID = import.meta.env.VITE_OPENAUTH_CLIENT_ID as string | undefined;

let client: Client | null = null;

if (issuer && clientID) {
  client = createClient({
    issuer,
    clientID,
  });
} else if (import.meta.env.DEV) {
  console.warn(
    "OpenAuth client is not configured. Set VITE_OPENAUTH_ISSUER and VITE_OPENAUTH_CLIENT_ID to enable OpenAuth flows.",
  );
}

export const openAuthClient = client;
export const isOpenAuthConfigured = client !== null;
