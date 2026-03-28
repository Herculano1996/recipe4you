import type { FastifyInstance } from "fastify";
import { prisma } from "../../lib/prisma.js";
import { requireAuth } from "../../middleware/requireAuth.js";

export async function usersRoutes(app: FastifyInstance): Promise<void> {
  // GET /users/me — own full profile
  app.get(
    "/users/me",
    { preHandler: [requireAuth] },
    async (request, reply) => {
      const userId = (request.user as { id: string }).id;
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          _count: {
            select: { recipes: true, favorites: true, collections: true },
          },
        },
      });

      if (!user) {
        return reply
          .status(404)
          .send({ error: { code: "NOT_FOUND", message: "User not found" } });
      }

      return reply.send({ data: user });
    },
  );

  // PATCH /users/me — update own profile
  app.patch(
    "/users/me",
    { preHandler: [requireAuth] },
    async (request, reply) => {
      const userId = (request.user as { id: string }).id;
      const body = request.body as {
        username?: string;
        displayName?: string;
        bio?: string;
        avatarUrl?: string;
      };

      const user = await prisma.user.update({
        where: { id: userId },
        data: body,
      });

      return reply.send({ data: user });
    },
  );

  // GET /users/:username — public profile
  app.get<{ Params: { username: string } }>(
    "/users/:username",
    async (request, reply) => {
      const user = await prisma.user.findUnique({
        where: { username: request.params.username },
        include: { _count: { select: { recipes: true } } },
      });

      if (!user) {
        return reply
          .status(404)
          .send({ error: { code: "NOT_FOUND", message: "User not found" } });
      }

      // Omit sensitive fields for public profile
      const { email: _email, ...publicUser } = user;
      return reply.send({ data: publicUser });
    },
  );
}
