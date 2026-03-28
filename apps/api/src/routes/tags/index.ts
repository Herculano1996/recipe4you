import type { FastifyInstance } from "fastify";
import { prisma } from "../../lib/prisma.js";

export async function tagsRoutes(app: FastifyInstance): Promise<void> {
  // GET /tags — all tags grouped by category
  app.get("/tags", async (_request, reply) => {
    const tags = await prisma.tag.findMany({ orderBy: { name: "asc" } });

    type Tag = (typeof tags)[number];
    const grouped = tags.reduce<Record<string, Tag[]>>((acc, tag) => {
      if (!acc[tag.category]) acc[tag.category] = [];
      acc[tag.category].push(tag);
      return acc;
    }, {});

    return reply.send({ data: grouped });
  });

  // GET /tags/:slug — tag detail
  app.get<{ Params: { slug: string } }>(
    "/tags/:slug",
    async (request, reply) => {
      const tag = await prisma.tag.findUnique({
        where: { slug: request.params.slug },
      });

      if (!tag) {
        return reply
          .status(404)
          .send({ error: { code: "NOT_FOUND", message: "Tag not found" } });
      }

      return reply.send({ data: tag });
    },
  );
}
