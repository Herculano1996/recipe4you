import type { FastifyInstance } from "fastify";
import fastifyJwt from "@fastify/jwt";

export async function authPlugin(app: FastifyInstance): Promise<void> {
  if (!process.env.JWT_SECRET) {
    throw new Error("Missing JWT_SECRET environment variable");
  }

  await app.register(fastifyJwt, {
    secret: process.env.JWT_SECRET,
  });
}
