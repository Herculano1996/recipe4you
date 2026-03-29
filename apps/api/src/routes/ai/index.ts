import type { FastifyInstance } from "fastify";
import { requireAuth } from "../../middleware/requireAuth.js";
import { requirePremium } from "../../middleware/requirePremium.js";
import { logAuditEvent } from "../../middleware/auditLog.js";
import {
  generateRecipeFromIngredients,
  estimateNutrition,
  generateMealPlan,
  improveRecipe,
} from "../../services/aiService.js";

// Stricter rate limit for AI endpoints (5 req/min per user)
const AI_RATE_LIMIT = {
  config: {
    rateLimit: { max: 5, timeWindow: "1 minute" },
  },
};

export async function aiRoutes(app: FastifyInstance): Promise<void> {
  // POST /ai/generate-recipe
  app.post(
    "/ai/generate-recipe",
    {
      preHandler: [requireAuth, requirePremium],
      ...AI_RATE_LIMIT,
    },
    async (request, reply) => {
      const body = request.body as {
        ingredients: string[];
        preferences?: {
          dietary?: string[];
          cuisine?: string;
          difficulty?: string;
          servings?: number;
        };
      };

      if (!Array.isArray(body.ingredients) || body.ingredients.length === 0) {
        return reply.status(400).send({
          error: {
            code: "INVALID_INPUT",
            message: "At least one ingredient is required",
          },
        });
      }

      const user = request.user as { id: string };

      await logAuditEvent({
        action: "AI_GENERATE",
        userId: user.id,
        targetType: "recipe",
        metadata: {
          type: "generate-recipe",
          ingredientCount: body.ingredients.length,
        },
        request,
      });

      const recipe = await generateRecipeFromIngredients(
        body.ingredients,
        body.preferences,
      );

      return reply.send({ data: recipe });
    },
  );

  // POST /ai/estimate-nutrition
  app.post(
    "/ai/estimate-nutrition",
    {
      preHandler: [requireAuth, requirePremium],
      ...AI_RATE_LIMIT,
    },
    async (request, reply) => {
      const body = request.body as {
        recipeTitle: string;
        ingredients: Array<{ name: string; quantity: string; unit: string }>;
        servings: number;
      };

      if (!body.recipeTitle || !Array.isArray(body.ingredients)) {
        return reply.status(400).send({
          error: { code: "INVALID_INPUT", message: "Missing required fields" },
        });
      }

      const nutrition = await estimateNutrition(
        body.recipeTitle,
        body.ingredients,
        body.servings ?? 1,
      );

      return reply.send({ data: nutrition });
    },
  );

  // POST /ai/meal-plan
  app.post(
    "/ai/meal-plan",
    {
      preHandler: [requireAuth, requirePremium],
      ...AI_RATE_LIMIT,
    },
    async (request, reply) => {
      const body = request.body as {
        goal: string;
        dailyCalories?: number;
        dietary?: string[];
        daysCount?: number;
      };

      if (!body.goal) {
        return reply.status(400).send({
          error: { code: "INVALID_INPUT", message: "goal is required" },
        });
      }

      const user = request.user as { id: string };

      await logAuditEvent({
        action: "AI_GENERATE",
        userId: user.id,
        targetType: "meal-plan",
        metadata: { goal: body.goal },
        request,
      });

      const plan = await generateMealPlan({
        goal: body.goal,
        dailyCalories: body.dailyCalories,
        dietary: body.dietary,
        daysCount: body.daysCount,
      });

      return reply.send({ data: plan });
    },
  );

  // POST /ai/improve-recipe
  app.post(
    "/ai/improve-recipe",
    {
      preHandler: [requireAuth, requirePremium],
      ...AI_RATE_LIMIT,
    },
    async (request, reply) => {
      const body = request.body as {
        title: string;
        description?: string;
        ingredients: Array<{ name: string; quantity: string; unit: string }>;
        steps: Array<{ stepNumber: number; description: string }>;
        focus?: "taste" | "health" | "speed" | "budget";
      };

      if (
        !body.title ||
        !Array.isArray(body.ingredients) ||
        !Array.isArray(body.steps)
      ) {
        return reply.status(400).send({
          error: { code: "INVALID_INPUT", message: "Missing required fields" },
        });
      }

      const improvements = await improveRecipe(body);

      return reply.send({ data: improvements });
    },
  );
}
