import type { ApiResult } from "@recipe4you/types";

const BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

class ApiError extends Error {
  code: string;
  status: number;

  constructor(code: string, message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.code = code;
    this.status = status;
  }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem("auth_token");

  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  });

  const json = (await response.json()) as ApiResult<T>;

  if (!response.ok || "error" in json) {
    const err =
      "error" in json ? json.error : { code: "T", message: "Request failed" };
    throw new ApiError(
      err?.code ?? "T",
      err?.message ?? "Request failed",
      response.status,
    );
  }

  return (json as { data: T }).data;
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body: T) =>
    request<T>(path, { method: "POST", body: JSON.stringify(body) }),
  patch: <T>(path: string, body: T) =>
    request<T>(path, { method: "PATCH", body: JSON.stringify(body) }),
  delete: <T>(path: string) => request<T>(path, { method: "DELETE" }),
};
