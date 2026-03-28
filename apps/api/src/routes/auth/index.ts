import type { FastifyInstance } from "fastify";
import { prisma } from "../../lib/prisma.js";
import { supabaseAdmin } from "../../lib/supabase.js";

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

    const token = app.jwt.sign(
      { id: user.id, email: user.email },
      { expiresIn: "7d" },
    );

    return reply.status(201).send({ data: { user, token } });
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

    const token = app.jwt.sign(
      { id: user.id, email: user.email },
      { expiresIn: "7d" },
    );

    return reply.send({ data: { user, token, session: data.session } });
  });

  // POST /auth/logout
  app.post("/auth/logout", async (_request, reply) => {
    return reply.status(204).send();
  });
}
