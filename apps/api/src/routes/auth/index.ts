import { randomUUID } from "crypto";
import type { FastifyInstance } from "fastify";
import { prisma } from "../../lib/prisma.js";
import { supabaseAdmin } from "../../lib/supabase.js";
import { revokeToken, isRevoked } from "../../security/tokenRevocation.js";
import { logAuditEvent } from "../../middleware/auditLog.js";

function signAccessToken(
  app: FastifyInstance,
  payload: { id: string; email: string },
): string {
  const jti = randomUUID();
  return app.jwt.sign(
    { ...payload, jti },
    { expiresIn: process.env.JWT_EXPIRES_IN ?? "15m" },
  );
}

function signRefreshToken(
  app: FastifyInstance,
  payload: { id: string },
): string {
  const jti = randomUUID();
  return app.jwt.sign(
    { ...payload, jti, type: "refresh" },
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN ?? "7d" },
  );
}

export async function authRoutes(app: FastifyInstance): Promise<void> {
  // POST /auth/register — create Supabase user + User profile row
  app.post("/auth/register", async (request, reply) => {
    const body = request.body as {
      email: string;
      password: string;
      username: string;
      displayName?: string;
    };

    // Check username availability
    const existing = await prisma.user.findUnique({
      where: { username: body.username },
    });
    if (existing) {
      return reply.status(409).send({
        error: { code: "USERNAME_TAKEN", message: "Username already taken" },
      });
    }

    // Create Supabase auth user
    const { data: authData, error: authError } =
      await supabaseAdmin.auth.admin.createUser({
        email: body.email,
        password: body.password,
        email_confirm: true,
      });

    if (authError || !authData.user) {
      return reply.status(400).send({
        error: {
          code: "AUTH_ERROR",
          message: authError?.message ?? "Registration failed",
        },
      });
    }

    // Create profile row
    const user = await prisma.user.create({
      data: {
        id: authData.user.id,
        email: body.email,
        username: body.username,
        displayName: body.displayName ?? null,
      },
    });

    const token = signAccessToken(app, { id: user.id, email: user.email });
    const refreshToken = signRefreshToken(app, { id: user.id });

    await logAuditEvent({ action: "AUTH_REGISTER", userId: user.id, request });

    return reply.status(201).send({ data: { user, token, refreshToken } });
  });

  // POST /auth/login
  app.post("/auth/login", async (request, reply) => {
    const body = request.body as { email: string; password: string };

    const { data, error } = await supabaseAdmin.auth.signInWithPassword({
      email: body.email,
      password: body.password,
    });

    if (error || !data.user) {
      return reply.status(401).send({
        error: {
          code: "INVALID_CREDENTIALS",
          message: "Invalid email or password",
        },
      });
    }

    const user = await prisma.user.findUnique({ where: { id: data.user.id } });
    if (!user) {
      return reply.status(404).send({
        error: { code: "USER_NOT_FOUND", message: "User profile not found" },
      });
    }

    const token = signAccessToken(app, { id: user.id, email: user.email });
    const refreshToken = signRefreshToken(app, { id: user.id });

    await logAuditEvent({ action: "AUTH_LOGIN", userId: user.id, request });

    return reply.send({
      data: { user, token, refreshToken, session: data.session },
    });
  });

  // POST /auth/refresh — issue new access token using refresh token
  app.post("/auth/refresh", async (request, reply) => {
    const body = request.body as { refreshToken?: string };
    if (!body.refreshToken) {
      return reply.status(400).send({
        error: {
          code: "MISSING_REFRESH_TOKEN",
          message: "refreshToken is required",
        },
      });
    }

    let payload: { id: string; jti: string; type: string; exp: number };
    try {
      payload = app.jwt.verify(body.refreshToken) as typeof payload;
    } catch {
      return reply.status(401).send({
        error: {
          code: "INVALID_REFRESH_TOKEN",
          message: "Invalid or expired refresh token",
        },
      });
    }

    if (payload.type !== "refresh") {
      return reply.status(401).send({
        error: { code: "INVALID_TOKEN_TYPE", message: "Not a refresh token" },
      });
    }

    if (await isRevoked(payload.jti)) {
      return reply.status(401).send({
        error: {
          code: "TOKEN_REVOKED",
          message: "Refresh token has been revoked",
        },
      });
    }

    const user = await prisma.user.findUnique({ where: { id: payload.id } });
    if (!user) {
      return reply.status(404).send({
        error: { code: "USER_NOT_FOUND", message: "User not found" },
      });
    }

    // Rotate: revoke old refresh token, issue new pair
    await revokeToken(payload.jti, payload.exp);
    const token = signAccessToken(app, { id: user.id, email: user.email });
    const refreshToken = signRefreshToken(app, { id: user.id });

    return reply.send({ data: { token, refreshToken } });
  });

  // POST /auth/logout
  app.post("/auth/logout", async (request, reply) => {
    try {
      await request.jwtVerify();
      const payload = request.user as { jti?: string; exp?: number };
      if (payload.jti && payload.exp) {
        await revokeToken(payload.jti, payload.exp);
      }
    } catch {
      // Token already invalid — logout is still successful
    }
    await logAuditEvent({ action: "AUTH_LOGOUT", request });
    return reply.status(204).send();
  });
}
