import type { FastifyInstance } from "fastify";
import fastifyCors from "@fastify/cors";

export async function corsPlugin(app: FastifyInstance): Promise<void> {
  const origins = (process.env.CORS_ORIGIN ?? "http://localhost:5173").split(
    ",",
  );

  await app.register(fastifyCors, {
    origin: origins.length === 1 ? origins[0] : origins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  });
}
