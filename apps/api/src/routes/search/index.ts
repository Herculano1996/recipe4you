import type { FastifyInstance } from "fastify";
import { prisma } from "../../lib/prisma.js";

export async function searchRoutes(app: FastifyInstance): Promise<void> {
  // GET /search?q= — unified search
  app.get("/search", async (request, reply) => {
    const query = request.query as { q?: string; limit?: string };
    const q = query.q ?? "";
    const limit = Math.min(parseInt(query.limit ?? "20", 10), 50);

    const [recipes, tags] = await Promise.all([
      prisma.recipe.findMany({
        where: {
          isPublished: true,
          isPublic: true,
          OR: [
            { title: { contains: q, mode: "insensitive" } },
            { description: { contains: q, mode: "insensitive" } },
          ],
        },
        take: limit,
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
        orderBy: { createdAt: "desc" },
      }),
      prisma.tag.findMany({
        where: { name: { contains: q, mode: "insensitive" } },
        take: 8,
      }),
    ]);

    return reply.send({
      data: {
        recipes: recipes.map((r) => ({
          ...r,
          tags: r.tags.map((rt: { tag: unknown }) => rt.tag),
        })),
        tags,
      },
    });
  });

  // GET /search/suggestions?q= — autocomplete top 8
  app.get("/search/suggestions", async (request, reply) => {
    const query = request.query as { q?: string };
    const q = query.q ?? "";

    const recipes = await prisma.recipe.findMany({
      where: {
        isPublished: true,
        isPublic: true,
        title: { contains: q, mode: "insensitive" },
      },
      take: 8,
      select: { id: true, title: true, slug: true, coverImage: true },
      orderBy: { createdAt: "desc" },
    });

    return reply.send({ data: recipes });
  });
}
