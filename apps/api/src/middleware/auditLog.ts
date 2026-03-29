import type { FastifyRequest, FastifyReply } from "fastify";
import { logger } from "../lib/logger.js";
import { prisma } from "../lib/prisma.js";

export type AuditAction =
  | "AUTH_LOGIN"
  | "AUTH_LOGOUT"
  | "AUTH_REGISTER"
  | "AUTH_PASSWORD_RESET"
  | "RECIPE_CREATE"
  | "RECIPE_UPDATE"
  | "RECIPE_DELETE"
  | "AI_GENERATE"
  | "BILLING_CHECKOUT"
  | "BILLING_PORTAL"
  | "BILLING_WEBHOOK"
  | "ADMIN_ACTION";

interface AuditPayload {
  action: AuditAction;
  userId?: string;
  targetId?: string;
  targetType?: string;
  metadata?: Record<string, unknown>;
  request?: FastifyRequest;
  reply?: FastifyReply;
}

/**
 * Logs an audit event to the structured Pino logger and, for critical actions,
 * persists a record to the audit_logs DB table.
 */
export async function logAuditEvent(payload: AuditPayload): Promise<void> {
  const { action, userId, targetId, targetType, metadata, request } = payload;

  const ipAddress =
    request?.headers["x-forwarded-for"]?.toString().split(",")[0].trim() ??
    request?.socket.remoteAddress ??
    null;

  logger.info(
    {
      audit: true,
      action,
      userId,
      targetId,
      targetType,
      ipAddress,
      userAgent: request?.headers["user-agent"] ?? null,
      ...metadata,
    },
    `AUDIT: ${action}`,
  );

  const criticalActions: AuditAction[] = [
    "AUTH_LOGIN",
    "AUTH_PASSWORD_RESET",
    "RECIPE_DELETE",
    "AI_GENERATE",
    "BILLING_WEBHOOK",
    "ADMIN_ACTION",
  ];

  if (criticalActions.includes(action)) {
    await prisma.auditLog.create({
      data: {
        action,
        userId: userId ?? null,
        targetId: targetId ?? null,
        targetType: targetType ?? null,
        ipAddress,
        userAgent: request?.headers["user-agent"] ?? null,
        metadata: metadata ? JSON.parse(JSON.stringify(metadata)) : undefined,
      },
    });
  }
}
