import type { FastifyInstance } from "fastify";
import { prisma } from "../../lib/prisma.js";

export async function ingredientsRoutes(app: FastifyInstance): Promise<void> {
  // GET /ingredients?q= — autocomplete
  app.get("/ingredients", async (request, reply) => {
    const query = request.query as { q?: string };

    const ingredients = await prisma.ingredient.findMany({
      where: query.q
        ? { name: { contains: query.q, mode: "insensitive" } }
        : undefined,
      take: 20,
      orderBy: { name: "asc" },
    });

    return reply.send({ data: ingredients });
  });
}
