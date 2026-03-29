import type { ApiResult } from "@recipe4you/types";

const BASE_URL = import.meta.env.VITE_API_BASE_URL as string;
const REFRESH_TOKEN_KEY = "refresh_token";

export class ApiError extends Error {
  code: string;
  status: number;

  constructor(code: string, message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.code = code;
    this.status = status;
  }
}

// Queue of callbacks waiting for a refresh to complete
let isRefreshing = false;
let refreshQueue: Array<(token: string) => void> = [];

function flushQueue(newToken: string) {
  refreshQueue.forEach((cb) => cb(newToken));
  refreshQueue = [];
}

async function attemptRefresh(): Promise<string | null> {
  const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
  if (!refreshToken) return null;

  try {
    const res = await fetch(`${BASE_URL}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });

    if (!res.ok) return null;

    const json = (await res.json()) as {
      data: { token: string; refreshToken: string };
    };
    const { token, refreshToken: newRefresh } = json.data;
    localStorage.setItem("auth_token", token);
    localStorage.setItem(REFRESH_TOKEN_KEY, newRefresh);
    return token;
  } catch {
    return null;
  }
}

const NO_REFRESH_PATHS = ["/auth/refresh", "/auth/login", "/auth/register"];

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

  // --- 401 handling: refresh then retry ---
  if (
    response.status === 401 &&
    !NO_REFRESH_PATHS.some((p) => path.startsWith(p))
  ) {
    if (isRefreshing) {
      // Queue this request — it will retry once the current refresh finishes
      return new Promise<T>((resolve, reject) => {
        refreshQueue.push((newToken) => {
          void request<T>(path, {
            ...options,
            headers: {
              ...options.headers,
              Authorization: `Bearer ${newToken}`,
            },
          })
            .then(resolve)
            .catch(reject);
        });
      });
    }

    isRefreshing = true;
    const newToken = await attemptRefresh();
    isRefreshing = false;

    if (newToken) {
      flushQueue(newToken);
      return request<T>(path, options); // retry with new token now in localStorage
    }

    // Refresh failed — evict session
    refreshQueue = [];
    localStorage.removeItem("auth_token");
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    window.dispatchEvent(new CustomEvent("auth:logout"));
    throw new ApiError(
      "UNAUTHORIZED",
      "Session expired. Please log in again.",
      401,
    );
  }

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
  get: <TRes>(path: string) => request<TRes>(path),
  post: <TRes, TBody = unknown>(path: string, body: TBody) =>
    request<TRes>(path, { method: "POST", body: JSON.stringify(body) }),
  patch: <TRes, TBody = unknown>(path: string, body: TBody) =>
    request<TRes>(path, { method: "PATCH", body: JSON.stringify(body) }),
  delete: <TRes>(path: string) => request<TRes>(path, { method: "DELETE" }),
};
