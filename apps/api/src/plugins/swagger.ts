import type { FastifyInstance } from "fastify";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";

export async function swaggerPlugin(app: FastifyInstance): Promise<void> {
  await app.register(fastifySwagger, {
    openapi: {
      info: {
        title: "recipe4you API",
        description: "REST API for the recipe4you application",
        version: "1.0.0",
      },
      servers: [
        {
          url: process.env.API_BASE_URL ?? "http://localhost:3001",
          description:
            process.env.NODE_ENV === "production"
              ? "Production"
              : "Development",
        },
      ],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT",
          },
        },
      },
    },
  });

  await app.register(fastifySwaggerUi, {
    routePrefix: "/documentation",
    uiConfig: {
      docExpansion: "list",
      deepLinking: false,
    },
  });
}
