import type { FastifyInstance } from "fastify";
import { prisma } from "../../lib/prisma.js";
import { requireAuth } from "../../middleware/requireAuth.js";

const collectionInclude = {
  owner: {
    select: { id: true, username: true, displayName: true, avatarUrl: true },
  },
  _count: { select: { recipes: true } },
} as const;

export async function collectionsRoutes(app: FastifyInstance): Promise<void> {
  // GET /collections — auth user's collections
  app.get(
    "/collections",
    { preHandler: [requireAuth] },
    async (request, reply) => {
      const userId = (request.user as { id: string }).id;
      const collections = await prisma.collection.findMany({
        where: { ownerId: userId },
        orderBy: { updatedAt: "desc" },
        include: collectionInclude,
      });
      return reply.send({ data: collections.map(formatCollection) });
    },
  );

  // POST /collections — create
  app.post(
    "/collections",
    { preHandler: [requireAuth] },
    async (request, reply) => {
      const userId = (request.user as { id: string }).id;
      const body = request.body as {
        name: string;
        description?: string;
        isPublic?: boolean;
      };

      const collection = await prisma.collection.create({
        data: {
          name: body.name,
          description: body.description,
          isPublic: body.isPublic ?? false,
          ownerId: userId,
        },
        include: collectionInclude,
      });

      return reply.status(201).send({ data: formatCollection(collection) });
    },
  );

  // GET /collections/:id
  app.get<{ Params: { id: string } }>(
    "/collections/:id",
    async (request, reply) => {
      const collection = await prisma.collection.findUnique({
        where: { id: request.params.id },
        include: {
          ...collectionInclude,
          recipes: {
            orderBy: { sortOrder: "asc" },
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
          },
        },
      });

      if (!collection) {
        return reply.status(404).send({
          error: { code: "NOT_FOUND", message: "Collection not found" },
        });
      }

      return reply.send({
        data: {
          ...formatCollection(collection),
          recipes:
            "recipes" in collection
              ? collection.recipes.map((cr: Record<string, unknown>) => ({
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  ...(cr as any).recipe,
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  tags: (cr as any).recipe.tags.map(
                    (rt: { tag: unknown }) => rt.tag,
                  ),
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  sortOrder: (cr as any).sortOrder,
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  addedAt: (cr as any).addedAt,
                }))
              : [],
        },
      });
    },
  );

  // PATCH /collections/:id
  app.patch<{ Params: { id: string } }>(
    "/collections/:id",
    { preHandler: [requireAuth] },
    async (request, reply) => {
      const userId = (request.user as { id: string }).id;
      const existing = await prisma.collection.findUnique({
        where: { id: request.params.id },
      });

      if (!existing)
        return reply
          .status(404)
          .send({ error: { code: "NOT_FOUND", message: "Not found" } });
      if (existing.ownerId !== userId)
        return reply
          .status(403)
          .send({ error: { code: "FORBIDDEN", message: "Not the owner" } });

      const body = request.body as {
        name?: string;
        description?: string;
        isPublic?: boolean;
      };
      const collection = await prisma.collection.update({
        where: { id: request.params.id },
        data: body,
        include: collectionInclude,
      });

      return reply.send({ data: formatCollection(collection) });
    },
  );

  // DELETE /collections/:id
  app.delete<{ Params: { id: string } }>(
    "/collections/:id",
    { preHandler: [requireAuth] },
    async (request, reply) => {
      const userId = (request.user as { id: string }).id;
      const existing = await prisma.collection.findUnique({
        where: { id: request.params.id },
      });

      if (!existing)
        return reply
          .status(404)
          .send({ error: { code: "NOT_FOUND", message: "Not found" } });
      if (existing.ownerId !== userId)
        return reply
          .status(403)
          .send({ error: { code: "FORBIDDEN", message: "Not the owner" } });

      await prisma.collection.delete({ where: { id: request.params.id } });
      return reply.status(204).send();
    },
  );

  // POST /collections/:id/recipes — add recipe
  app.post<{ Params: { id: string } }>(
    "/collections/:id/recipes",
    { preHandler: [requireAuth] },
    async (request, reply) => {
      const userId = (request.user as { id: string }).id;
      const body = request.body as { recipeId: string; sortOrder?: number };
      const collection = await prisma.collection.findUnique({
        where: { id: request.params.id },
      });

      if (!collection || collection.ownerId !== userId) {
        return reply
          .status(403)
          .send({ error: { code: "FORBIDDEN", message: "Not authorized" } });
      }

      await prisma.collectionRecipe.upsert({
        where: {
          collectionId_recipeId: {
            collectionId: request.params.id,
            recipeId: body.recipeId,
          },
        },
        create: {
          collectionId: request.params.id,
          recipeId: body.recipeId,
          sortOrder: body.sortOrder ?? 0,
        },
        update: {},
      });

      return reply.status(201).send({
        data: { collectionId: request.params.id, recipeId: body.recipeId },
      });
    },
  );

  // DELETE /collections/:id/recipes/:recipeId
  app.delete<{ Params: { id: string; recipeId: string } }>(
    "/collections/:id/recipes/:recipeId",
    { preHandler: [requireAuth] },
    async (request, reply) => {
      const userId = (request.user as { id: string }).id;
      const collection = await prisma.collection.findUnique({
        where: { id: request.params.id },
      });

      if (!collection || collection.ownerId !== userId) {
        return reply
          .status(403)
          .send({ error: { code: "FORBIDDEN", message: "Not authorized" } });
      }

      await prisma.collectionRecipe.deleteMany({
        where: {
          collectionId: request.params.id,
          recipeId: request.params.recipeId,
        },
      });

      return reply.status(204).send();
    },
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function formatCollection(collection: any) {
  return {
    ...collection,
    recipeCount: collection._count?.recipes ?? 0,
    _count: undefined,
  };
}
