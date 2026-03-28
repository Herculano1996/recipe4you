import type { FastifyInstance } from "fastify";
import { prisma } from "../../lib/prisma.js";
import { requireAuth } from "../../middleware/requireAuth.js";

export async function favoritesRoutes(app: FastifyInstance): Promise<void> {
  // GET /favorites — auth user's favorites
  app.get(
    "/favorites",
    { preHandler: [requireAuth] },
    async (request, reply) => {
      const userId = (request.user as { id: string }).id;
      const query = request.query as { cursor?: string; limit?: string };
      const limit = Math.min(parseInt(query.limit ?? "20", 10), 50);

      const favorites = await prisma.favorite.findMany({
        where: { userId },
        take: limit + 1,
        orderBy: { createdAt: "desc" },
        include: {
          recipe: {
            include: {
              author: {
                select: {
                  id: true,
                  username: true,
                  displayName: true,
                  avatarUrl: true,
                },
              },
              tags: { include: { tag: true } },
            },
          },
        },
        ...(query.cursor && {
          cursor: { userId_recipeId: { userId, recipeId: query.cursor } },
          skip: 1,
        }),
      });

      const hasMore = favorites.length > limit;
      const data = hasMore ? favorites.slice(0, -1) : favorites;
      const nextCursor = hasMore ? data[data.length - 1]?.recipeId : null;

      return reply.send({
        data: data.map((f) => ({
          ...f.recipe,
          tags: f.recipe.tags.map((rt: { tag: unknown }) => rt.tag),
          favoritedAt: f.createdAt,
        })),
        meta: { nextCursor, hasMore },
      });
    },
  );

  // POST /favorites/:recipeId — add favorite
  app.post<{ Params: { recipeId: string } }>(
    "/favorites/:recipeId",
    { preHandler: [requireAuth] },
    async (request, reply) => {
      const userId = (request.user as { id: string }).id;
      const { recipeId } = request.params;

      await prisma.favorite.upsert({
        where: { userId_recipeId: { userId, recipeId } },
        create: { userId, recipeId },
        update: {},
      });

      return reply.status(201).send({ data: { userId, recipeId } });
    },
  );

  // DELETE /favorites/:recipeId — remove favorite
  app.delete<{ Params: { recipeId: string } }>(
    "/favorites/:recipeId",
    { preHandler: [requireAuth] },
    async (request, reply) => {
      const userId = (request.user as { id: string }).id;
      const { recipeId } = request.params;

      await prisma.favorite.deleteMany({ where: { userId, recipeId } });
      return reply.status(204).send();
    },
  );
}
