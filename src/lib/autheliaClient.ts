const issuer = import.meta.env.VITE_AUTHELIA_ISSUER as string | undefined;
const clientID = import.meta.env.VITE_AUTHELIA_CLIENT_ID as string | undefined;
const defaultScope = (import.meta.env.VITE_AUTHELIA_SCOPE as string | undefined) ?? "openid profile email";

export type AutheliaTokens = {
  access: string;
  refresh: string;
  idToken?: string;
  expiresIn: number;
};

export type AuthorizationChallenge = {
  state: string;
  verifier: string;
  redirectURI?: string;
};

type OIDCMetadata = {
  authorization_endpoint: string;
  token_endpoint: string;
  issuer?: string;
};

const isBrowser = typeof window !== "undefined";

const base64UrlEncode = (buffer: ArrayBuffer | Uint8Array) => {
  const view = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
  let binary = "";
  view.forEach((value) => {
    binary += String.fromCharCode(value);
  });
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
};

const randomBytes = (length: number) => {
  if (!isBrowser || !window.crypto?.getRandomValues) {
    throw new Error("Authelia authentication requires a secure browser environment");
  }
  const bytes = new Uint8Array(length);
  window.crypto.getRandomValues(bytes);
  return bytes;
};

const generateState = () => base64UrlEncode(randomBytes(16));

const generateVerifier = () => base64UrlEncode(randomBytes(32));

const sha256 = async (value: string) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(value);
  if (!isBrowser || !window.crypto?.subtle) {
    throw new Error("Authelia authentication requires WebCrypto support");
  }
  return window.crypto.subtle.digest("SHA-256", data);
};

let metadataPromise: Promise<OIDCMetadata> | null = null;

const fetchMetadata = async () => {
  if (metadataPromise) {
    return metadataPromise;
  }
  if (!issuer) {
    throw new Error("Authelia issuer is not configured");
  }
  metadataPromise = fetch(`${issuer.replace(/\/$/, "")}/.well-known/openid-configuration`).then((response) => {
    if (!response.ok) {
      throw new Error(`Failed to load Authelia discovery document (${response.status})`);
    }
    return response.json() as Promise<OIDCMetadata>;
  });
  return metadataPromise;
};

const buildAuthorizationURL = async (redirectURI: string) => {
  const metadata = await fetchMetadata();
  if (!metadata.authorization_endpoint) {
    throw new Error("Authelia discovery document is missing the authorization endpoint");
  }
  const verifier = generateVerifier();
  const challengeBuffer = await sha256(verifier);
  const challenge = base64UrlEncode(challengeBuffer);
  const state = generateState();
  const url = new URL(metadata.authorization_endpoint);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("client_id", clientID!);
  url.searchParams.set("redirect_uri", redirectURI);
  url.searchParams.set("scope", defaultScope);
  url.searchParams.set("state", state);
  url.searchParams.set("code_challenge", challenge);
  url.searchParams.set("code_challenge_method", "S256");
  return { url: url.toString(), challenge: { state, verifier, redirectURI } satisfies AuthorizationChallenge };
};

type TokenResponse = {
  access_token?: string;
  refresh_token?: string;
  id_token?: string;
  expires_in?: number;
  token_type?: string;
  error?: string;
  error_description?: string;
};

const parseTokenResponse = (payload: TokenResponse, fallbackRefreshToken?: string) => {
  if (!payload.access_token) {
    const description = payload.error_description ?? payload.error ?? "Unexpected response from Authelia token endpoint";
    throw new Error(description);
  }
  const refreshToken = payload.refresh_token ?? fallbackRefreshToken;
  if (!refreshToken) {
    throw new Error("Authelia token response did not include a refresh token");
  }
  return {
    access: payload.access_token,
    refresh: refreshToken,
    idToken: payload.id_token,
    expiresIn: payload.expires_in ?? 3600,
  } satisfies AutheliaTokens;
};

const exchangeCode = async (code: string, redirectURI: string, verifier?: string) => {
  const metadata = await fetchMetadata();
  if (!metadata.token_endpoint) {
    throw new Error("Authelia discovery document is missing the token endpoint");
  }
  const params = new URLSearchParams({
    grant_type: "authorization_code",
    code,
    redirect_uri: redirectURI,
    client_id: clientID!,
  });
  if (verifier) {
    params.set("code_verifier", verifier);
  }
  const response = await fetch(metadata.token_endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params,
  });
  const payload = (await response.json()) as TokenResponse;
  if (!response.ok) {
    throw new Error(payload.error_description ?? payload.error ?? "Failed to exchange Authelia authorization code");
  }
  return parseTokenResponse(payload);
};

const refreshTokens = async (refreshToken: string) => {
  const metadata = await fetchMetadata();
  if (!metadata.token_endpoint) {
    throw new Error("Authelia discovery document is missing the token endpoint");
  }
  const params = new URLSearchParams({
    grant_type: "refresh_token",
    refresh_token: refreshToken,
    client_id: clientID!,
  });
  const response = await fetch(metadata.token_endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params,
  });
  const payload = (await response.json()) as TokenResponse;
  if (!response.ok) {
    throw new Error(payload.error_description ?? payload.error ?? "Failed to refresh Authelia session");
  }
  return parseTokenResponse(payload, refreshToken);
};

const createClient = () => {
  if (!issuer || !clientID) {
    return null;
  }
  return {
    authorize: async (redirectURI: string) => buildAuthorizationURL(redirectURI),
    exchange: async (code: string, redirectURI: string, verifier?: string) => exchangeCode(code, redirectURI, verifier),
    refresh: async (refreshToken: string) => refreshTokens(refreshToken),
  };
};

const client = createClient();

if (!client && import.meta.env.DEV) {
  console.warn(
    "Authelia client is not configured. Set VITE_AUTHELIA_ISSUER and VITE_AUTHELIA_CLIENT_ID to enable Authelia flows.",
  );
}

export const autheliaClient = client;
export const isAutheliaConfigured = client !== null;
