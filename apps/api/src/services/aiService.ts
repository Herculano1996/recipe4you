import Anthropic from "@anthropic-ai/sdk";
import type {
  GeneratedRecipe,
  NutritionInfo,
  WeeklyMealPlan,
  RecipeImprovements,
} from "@recipe4you/types";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const MODEL = "claude-opus-4-6";

// ─── Generate Recipe From Ingredients ──────────────────────────────────────

export async function generateRecipeFromIngredients(
  ingredients: string[],
  preferences?: {
    dietary?: string[];
    cuisine?: string;
    difficulty?: string;
    servings?: number;
  },
): Promise<GeneratedRecipe> {
  const prefsText = preferences
    ? [
        preferences.dietary?.length
          ? `Dietary restrictions: ${preferences.dietary.join(", ")}`
          : null,
        preferences.cuisine ? `Cuisine style: ${preferences.cuisine}` : null,
        preferences.difficulty
          ? `Difficulty level: ${preferences.difficulty}`
          : null,
        preferences.servings
          ? `Target servings: ${preferences.servings}`
          : null,
      ]
        .filter(Boolean)
        .join("\n")
    : "No specific preferences";

  const response = await anthropic.messages.create({
    model: MODEL,
    max_tokens: 4096,
    thinking: { type: "adaptive" },
    system: `You are a professional chef and recipe developer. Generate detailed, accurate, and delicious recipes.
Always respond with valid JSON matching the exact schema requested. Do not include markdown formatting.`,
    messages: [
      {
        role: "user",
        content: `Generate a recipe using these ingredients: ${ingredients.join(", ")}

${prefsText}

Respond with JSON in this exact shape:
{
  "title": "string",
  "description": "string (2-3 sentences)",
  "ingredients": [{"name": "string", "quantity": "string", "unit": "string", "notes": "string|null"}],
  "steps": [{"stepNumber": 1, "title": "string|null", "description": "string", "duration": "number|null"}],
  "prepTime": "number (minutes)",
  "cookTime": "number (minutes)",
  "servings": "number",
  "difficulty": "EASY|MEDIUM|HARD|EXPERT",
  "tags": ["string"],
  "estimatedCalories": "number|null"
}`,
      },
    ],
  });

  const textBlock = response.content.find((b) => b.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    throw new Error("AI returned no text content");
  }

  const cleaned = textBlock.text.trim().replace(/^```json\n?|\n?```$/g, "");
  return JSON.parse(cleaned) as GeneratedRecipe;
}

// ─── Estimate Nutrition ─────────────────────────────────────────────────────

export async function estimateNutrition(
  recipeTitle: string,
  ingredients: Array<{ name: string; quantity: string; unit: string }>,
  servings: number,
): Promise<NutritionInfo> {
  const ingredientList = ingredients
    .map((i) => `${i.quantity} ${i.unit} ${i.name}`)
    .join("\n");

  const response = await anthropic.messages.create({
    model: MODEL,
    max_tokens: 1024,
    system: `You are a registered dietitian. Estimate nutritional information based on ingredients.
Always respond with valid JSON. Values should be per serving.`,
    messages: [
      {
        role: "user",
        content: `Estimate nutrition per serving for "${recipeTitle}" (${servings} servings total):

Ingredients:
${ingredientList}

Respond with JSON in this exact shape:
{
  "calories": "number",
  "protein": "number (grams)",
  "carbohydrates": "number (grams)",
  "fat": "number (grams)",
  "fiber": "number (grams)",
  "sugar": "number (grams)",
  "sodium": "number (milligrams)",
  "servingSize": "string (e.g. '1 cup', '250g')"
}`,
      },
    ],
  });

  const textBlock = response.content.find((b) => b.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    throw new Error("AI returned no text content");
  }

  const cleaned = textBlock.text.trim().replace(/^```json\n?|\n?```$/g, "");
  return JSON.parse(cleaned) as NutritionInfo;
}

// ─── Generate Meal Plan ─────────────────────────────────────────────────────

export async function generateMealPlan(options: {
  goal: string;
  dailyCalories?: number;
  dietary?: string[];
  daysCount?: number;
}): Promise<WeeklyMealPlan> {
  const days = options.daysCount ?? 7;
  const dayNames = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ].slice(0, days);

  const response = await anthropic.messages.create({
    model: MODEL,
    max_tokens: 8192,
    thinking: { type: "adaptive" },
    system: `You are a professional nutritionist and meal planner. Create balanced, practical meal plans.
Always respond with valid JSON. Be specific with meal names and descriptions.`,
    messages: [
      {
        role: "user",
        content: `Create a ${days}-day meal plan with this goal: ${options.goal}
${options.dailyCalories ? `Daily calorie target: ${options.dailyCalories} kcal` : ""}
${options.dietary?.length ? `Dietary restrictions: ${options.dietary.join(", ")}` : ""}

Days to plan: ${dayNames.join(", ")}

Respond with JSON in this exact shape:
{
  "goal": "string",
  "totalDailyCalories": "number",
  "days": [
    {
      "day": "Monday",
      "breakfast": {"title": "string", "description": "string", "estimatedCalories": "number", "prepTime": "number", "tags": ["string"]},
      "lunch": {"title": "string", "description": "string", "estimatedCalories": "number", "prepTime": "number", "tags": ["string"]},
      "dinner": {"title": "string", "description": "string", "estimatedCalories": "number", "prepTime": "number", "tags": ["string"]},
      "snacks": [{"title": "string", "description": "string", "estimatedCalories": "number", "prepTime": "number", "tags": ["string"]}]
    }
  ]
}`,
      },
    ],
  });

  const textBlock = response.content.find((b) => b.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    throw new Error("AI returned no text content");
  }

  const cleaned = textBlock.text.trim().replace(/^```json\n?|\n?```$/g, "");
  return JSON.parse(cleaned) as WeeklyMealPlan;
}

// ─── Improve Recipe ─────────────────────────────────────────────────────────

export async function improveRecipe(recipe: {
  title: string;
  description?: string;
  ingredients: Array<{ name: string; quantity: string; unit: string }>;
  steps: Array<{ stepNumber: number; description: string }>;
  focus?: "taste" | "health" | "speed" | "budget";
}): Promise<RecipeImprovements> {
  const ingredientList = recipe.ingredients
    .map((i) => `${i.quantity} ${i.unit} ${i.name}`)
    .join("\n");
  const stepList = recipe.steps
    .map((s) => `${s.stepNumber}. ${s.description}`)
    .join("\n");

  const response = await anthropic.messages.create({
    model: MODEL,
    max_tokens: 2048,
    thinking: { type: "adaptive" },
    system: `You are a Michelin-starred chef providing constructive recipe improvements.
Be specific, actionable, and encouraging. Always respond with valid JSON.`,
    messages: [
      {
        role: "user",
        content: `Suggest improvements for this recipe: "${recipe.title}"
${recipe.description ? `\nDescription: ${recipe.description}` : ""}
Focus area: ${recipe.focus ?? "overall quality"}

Ingredients:
${ingredientList}

Steps:
${stepList}

Respond with JSON in this exact shape:
{
  "suggestions": ["string (specific improvement suggestion)"],
  "improvedDescription": "string|null",
  "substitutions": [{"original": "string", "substitute": "string", "reason": "string"}],
  "techniqueTips": ["string"]
}`,
      },
    ],
  });

  const textBlock = response.content.find((b) => b.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    throw new Error("AI returned no text content");
  }

  const cleaned = textBlock.text.trim().replace(/^```json\n?|\n?```$/g, "");
  return JSON.parse(cleaned) as RecipeImprovements;
}
