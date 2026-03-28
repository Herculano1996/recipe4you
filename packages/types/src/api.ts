/** Standard API response envelope */
export interface ApiResponse<T> {
  data: T;
  meta?: ApiMeta;
  error?: never;
}

export interface ApiError {
  data?: never;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}

export interface ApiMeta {
  nextCursor?: string | null;
  hasMore?: boolean;
  total?: number;
  page?: number;
  limit?: number;
}

export type ApiResult<T> = ApiResponse<T> | ApiError;

/** Auth */
export interface AuthSession {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
  user: {
    id: string;
    email: string;
  };
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  email: string;
  password: string;
  username: string;
  displayName?: string;
}
