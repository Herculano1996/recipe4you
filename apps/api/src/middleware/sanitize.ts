import DOMPurify from "isomorphic-dompurify";
import type { FastifyRequest, FastifyReply } from "fastify";

function sanitizeValue(value: unknown): unknown {
  if (typeof value === "string") {
    return DOMPurify.sanitize(value);
  }
  if (Array.isArray(value)) {
    return value.map(sanitizeValue);
  }
  if (value !== null && typeof value === "object") {
    return sanitizeObject(value as Record<string, unknown>);
  }
  return value;
}

function sanitizeObject(obj: Record<string, unknown>): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const key of Object.keys(obj)) {
    result[key] = sanitizeValue(obj[key]);
  }
  return result;
}

/**
 * Fastify preHandler hook — recursively DOMPurify-sanitizes all string fields
 * in the request body to prevent stored XSS.
 */
export async function sanitizeBody(
  request: FastifyRequest,
  _reply: FastifyReply,
): Promise<void> {
  if (request.body !== null && typeof request.body === "object") {
    request.body = sanitizeObject(request.body as Record<string, unknown>);
  }
}
