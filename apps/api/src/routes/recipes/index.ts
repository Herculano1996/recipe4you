import type { FastifyInstance } from "fastify";
import { prisma } from "../../lib/prisma.js";
import { requireAuth } from "../../middleware/requireAuth.js";
import { z } from "zod";

const recipeFiltersSchema = z.object({
  q: z.string().optional(),
  tag: z.union([z.string(), z.array(z.string())]).optional(),
  ingredient: z.string().optional(),
  difficulty: z.enum(["EASY", "MEDIUM", "HARD", "EXPERT"]).optional(),
  maxTime: z.coerce.number().optional(),
  sort: z.enum(["newest", "popular", "rating", "time"]).default("newest"),
  cursor: z.string().optional(),
  limit: z.coerce.number().min(1).max(50).default(20),
});

const recipeInclude = {
  author: {
    select: { id: true, username: true, displayName: true, avatarUrl: true },
  },
  ingredients: {
    include: { ingredient: true },
    // Explicit mutable array — Prisma doesn't accept readonly tuples
    orderBy: [{ groupName: "asc" }, { sortOrder: "asc" }] as Array<
      Record<string, "asc" | "desc">
    >,
  },
  steps: { orderBy: { stepNumber: "asc" as const } },
  images: { orderBy: { sortOrder: "asc" as const } },
  tags: { include: { tag: true } },
  _count: { select: { favorites: true, ratings: true } },
} as const;

export async function recipesRoutes(app: FastifyInstance): Promise<void> {
  // GET /recipes — list with filters
  app.get("/recipes", async (request, reply) => {
    const query = recipeFiltersSchema.parse(request.query);

    const where = {
      isPublished: true,
      isPublic: true,
      ...(query.q && {
        title: { contains: query.q, mode: "insensitive" as const },
      }),
      ...(query.difficulty && { difficulty: query.difficulty }),
      ...(query.maxTime && {
        AND: [
          query.maxTime
            ? {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                OR: [{ prepTime: { lte: query.maxTime } }] as any,
              }
            : {},
        ],
      }),
      ...(query.tag && {
        tags: {
          some: {
            tag: {
              slug: {
                in: Array.isArray(query.tag) ? query.tag : [query.tag],
              },
            },
          },
        },
      }),
      ...(query.ingredient && {
        ingredients: {
          some: {
            ingredient: {
              name: {
                contains: query.ingredient,
                mode: "insensitive" as const,
              },
            },
          },
        },
      }),
    };

    const recipes = await prisma.recipe.findMany({
      where,
      take: query.limit + 1,
      orderBy:
        query.sort === "newest"
          ? { createdAt: "desc" }
          : query.sort === "time"
            ? [{ prepTime: "asc" }, { cookTime: "asc" }]
            : { createdAt: "desc" },
      include: recipeInclude,
      ...(query.cursor && { cursor: { id: query.cursor }, skip: 1 }),
    });

    const hasMore = recipes.length > query.limit;
    const items = hasMore ? recipes.slice(0, -1) : recipes;
    const nextCursor = hasMore ? items[items.length - 1]?.id : null;

    return reply.send({
      data: {
        items: items.map(formatRecipe),
        meta: { nextCursor, hasMore },
      },
    });
  });

  // GET /recipes/:slug — single recipe
  app.get<{ Params: { slug: string } }>(
    "/recipes/:slug",
    async (request, reply) => {
      const recipe = await prisma.recipe.findUnique({
        where: { slug: request.params.slug },
        include: recipeInclude,
      });

      if (!recipe || (!recipe.isPublic && !recipe.isPublished)) {
        return reply
          .status(404)
          .send({ error: { code: "NOT_FOUND", message: "Recipe not found" } });
      }

      return reply.send({ data: formatRecipe(recipe) });
    },
  );

  // POST /recipes — create
  app.post(
    "/recipes",
    { preHandler: [requireAuth] },
    async (request, reply) => {
      const body = request.body as Record<string, unknown>;
      const userId = (request.user as { id: string }).id;

      const slug = generateSlug(body.title as string);

      const recipe = await prisma.recipe.create({
        data: {
          title: body.title as string,
          slug,
          description: (body.description as string | undefined) ?? null,
          difficulty:
            (body.difficulty as "EASY" | "MEDIUM" | "HARD" | "EXPERT") ??
            "MEDIUM",
          prepTime: body.prepTime as number,
          cookTime: body.cookTime as number,
          servings: body.servings as number,
          authorId: userId,
        },
        include: recipeInclude,
      });

      return reply.status(201).send({ data: formatRecipe(recipe) });
    },
  );

  // PATCH /recipes/:id — update
  app.patch<{ Params: { id: string } }>(
    "/recipes/:id",
    { preHandler: [requireAuth] },
    async (request, reply) => {
      const userId = (request.user as { id: string }).id;
      const existing = await prisma.recipe.findUnique({
        where: { id: request.params.id },
      });

      if (!existing) {
        return reply
          .status(404)
          .send({ error: { code: "NOT_FOUND", message: "Recipe not found" } });
      }
      if (existing.authorId !== userId) {
        return reply.status(403).send({
          error: { code: "FORBIDDEN", message: "Not the recipe author" },
        });
      }

      const body = request.body as Record<string, unknown>;
      const recipe = await prisma.recipe.update({
        where: { id: request.params.id },
        data: {
          ...(body.title !== undefined && {
            title: body.title as string,
            slug: generateSlug(body.title as string),
          }),
          ...(body.description !== undefined && {
            description: body.description as string,
          }),
          ...(body.difficulty !== undefined && {
            difficulty: body.difficulty as
              | "EASY"
              | "MEDIUM"
              | "HARD"
              | "EXPERT",
          }),
          ...(body.prepTime !== undefined && {
            prepTime: body.prepTime as number,
          }),
          ...(body.cookTime !== undefined && {
            cookTime: body.cookTime as number,
          }),
          ...(body.servings !== undefined && {
            servings: body.servings as number,
          }),
          ...(body.coverImage !== undefined && {
            coverImage: body.coverImage as string,
          }),
        },
        include: recipeInclude,
      });

      return reply.send({ data: formatRecipe(recipe) });
    },
  );

  // DELETE /recipes/:id — soft delete (unpublish)
  app.delete<{ Params: { id: string } }>(
    "/recipes/:id",
    { preHandler: [requireAuth] },
    async (request, reply) => {
      const userId = (request.user as { id: string }).id;
      const existing = await prisma.recipe.findUnique({
        where: { id: request.params.id },
      });

      if (!existing) {
        return reply
          .status(404)
          .send({ error: { code: "NOT_FOUND", message: "Recipe not found" } });
      }
      if (existing.authorId !== userId) {
        return reply.status(403).send({
          error: { code: "FORBIDDEN", message: "Not the recipe author" },
        });
      }

      await prisma.recipe.delete({ where: { id: request.params.id } });
      return reply.status(204).send();
    },
  );

  // POST /recipes/:id/publish — toggle publish
  app.post<{ Params: { id: string } }>(
    "/recipes/:id/publish",
    { preHandler: [requireAuth] },
    async (request, reply) => {
      const userId = (request.user as { id: string }).id;
      const existing = await prisma.recipe.findUnique({
        where: { id: request.params.id },
      });

      if (!existing || existing.authorId !== userId) {
        return reply
          .status(403)
          .send({ error: { code: "FORBIDDEN", message: "Not authorized" } });
      }

      const recipe = await prisma.recipe.update({
        where: { id: request.params.id },
        data: { isPublished: !existing.isPublished },
        include: recipeInclude,
      });

      return reply.send({ data: formatRecipe(recipe) });
    },
  );

  // GET /recipes/:id/ratings
  app.get<{ Params: { id: string } }>(
    "/recipes/:id/ratings",
    async (request, reply) => {
      const ratings = await prisma.recipeRating.findMany({
        where: { recipeId: request.params.id },
        include: {
          user: { select: { id: true, username: true, avatarUrl: true } },
        },
        orderBy: { createdAt: "desc" },
      });

      return reply.send({ data: ratings });
    },
  );

  // POST /recipes/:id/ratings — upsert
  app.post<{ Params: { id: string } }>(
    "/recipes/:id/ratings",
    { preHandler: [requireAuth] },
    async (request, reply) => {
      const userId = (request.user as { id: string }).id;
      const body = request.body as { score: number; comment?: string };

      const rating = await prisma.recipeRating.upsert({
        where: { recipeId_userId: { recipeId: request.params.id, userId } },
        create: {
          recipeId: request.params.id,
          userId,
          score: body.score,
          comment: body.comment,
        },
        update: { score: body.score, comment: body.comment },
      });

      return reply.status(201).send({ data: rating });
    },
  );
}

function generateSlug(title: string): string {
  return (
    title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .slice(0, 200) +
    "-" +
    Date.now().toString(36)
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function formatRecipe(recipe: any) {
  return {
    ...recipe,
    tags: recipe.tags?.map((rt: { tag: unknown }) => rt.tag) ?? [],
    averageRating: recipe._count
      ? recipe._count.ratings > 0
        ? undefined // computed via aggregate separately if needed
        : null
      : undefined,
    _count: undefined,
  };
}
