export interface ErrorBody {
  error: {
    code: string;
    message: string;
  };
  data?: unknown;
}

export function jsonResponse(data: unknown, init: ResponseInit = {}): Response {
  return new Response(JSON.stringify({ data }), {
    headers: { "content-type": "application/json", ...init.headers },
    status: init.status ?? 200,
  });
}

export function errorResponse(code: string, message: string, status = 400, data?: unknown): Response {
  const body: ErrorBody = { error: { code, message } };
  if (data !== undefined) body.data = data;
  return new Response(JSON.stringify(body), {
    headers: { "content-type": "application/json" },
    status,
  });
}
