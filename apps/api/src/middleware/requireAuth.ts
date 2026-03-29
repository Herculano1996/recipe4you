import type { FastifyRequest, FastifyReply } from "fastify";
import { isRevoked } from "../security/tokenRevocation.js";

export async function requireAuth(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  try {
    await request.jwtVerify();
  } catch {
    await reply.status(401).send({
      error: {
        code: "UNAUTHORIZED",
        message: "Authentication required",
      },
    });
    return;
  }

  const payload = request.user as { jti?: string };
  if (payload.jti && (await isRevoked(payload.jti))) {
    await reply.status(401).send({
      error: {
        code: "TOKEN_REVOKED",
        message: "Token has been revoked. Please log in again.",
      },
    });
  }
}
