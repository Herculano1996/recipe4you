/**
 * External Recipe API clients.
 * All three sources are normalized to the internal ExternalRecipe shape
 * so consumers work with a single interface.
 */

import { withCache } from "./cacheService.js";

const CACHE_TTL = 60 * 60; // 1 hour

/* ─── Internal shape ─────────────────────────────────────────────────────── */
export interface ExternalRecipe {
  externalId: string;
  source: "themealdb" | "spoonacular" | "edamam";
  title: string;
  description?: string;
  coverImage?: string;
  prepTime?: number; // minutes
  cookTime?: number; // minutes
  servings?: number;
  calories?: number;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  tags: string[];
  sourceUrl?: string;
  ingredients: { name: string; quantity: string; unit: string }[];
  steps: { stepNumber: number; description: string }[];
}

/* ─── Validation helpers ─────────────────────────────────────────────────── */
const ALLOWED_EXTERNAL_HOSTS = [
  "www.themealdb.com",
  "api.spoonacular.com",
  "api.edamam.com",
];

function validateExternalUrl(rawUrl: string): string {
  const parsed = new URL(rawUrl);
  if (parsed.protocol !== "https:") throw new Error("SSRF: only HTTPS allowed");
  if (!ALLOWED_EXTERNAL_HOSTS.includes(parsed.hostname)) {
    throw new Error(`SSRF: host ${parsed.hostname} not allowed`);
  }
  return rawUrl;
}

async function safeFetch(url: string): Promise<unknown> {
  validateExternalUrl(url);
  const res = await fetch(url, {
    headers: { "User-Agent": "recipe4you/1.0" },
    signal: AbortSignal.timeout(10_000),
  });
  if (!res.ok) throw new Error(`External API error: ${res.status}`);
  return res.json();
}

/* ─── TheMealDB ──────────────────────────────────────────────────────────── */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalizeMeal(meal: any): ExternalRecipe {
  // Extract up to 20 ingredients from parallel arrays
  const ingredients: ExternalRecipe["ingredients"] = [];
  for (let i = 1; i <= 20; i++) {
    const name = meal[`strIngredient${i}`];
    const measure = meal[`strMeasure${i}`];
    if (name?.trim()) {
      ingredients.push({
        name: name.trim(),
        quantity: measure?.trim() ?? "1",
        unit: "",
      });
    }
  }

  // Split instructions into steps
  const steps: ExternalRecipe["steps"] = (meal.strInstructions as string)
    .split(/\r?\n/)
    .map((s: string) => s.trim())
    .filter((s: string) => s.length > 10)
    .map((desc: string, idx: number) => ({
      stepNumber: idx + 1,
      description: desc,
    }));

  return {
    externalId: meal.idMeal as string,
    source: "themealdb",
    title: meal.strMeal as string,
    coverImage: meal.strMealThumb as string | undefined,
    sourceUrl: meal.strSource as string | undefined,
    difficulty: "MEDIUM",
    tags: [meal.strCategory, meal.strArea].filter(Boolean) as string[],
    ingredients,
    steps,
  };
}

export async function searchTheMealDB(q: string): Promise<ExternalRecipe[]> {
  return withCache(`themealdb:search:${q}`, CACHE_TTL, async () => {
    const url = `https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(q)}`;
    const data = (await safeFetch(url)) as { meals: unknown[] | null };
    return (data.meals ?? []).map(normalizeMeal);
  });
}

export async function getTheMealDBById(
  id: string,
): Promise<ExternalRecipe | null> {
  return withCache(`themealdb:id:${id}`, CACHE_TTL, async () => {
    const url = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${encodeURIComponent(id)}`;
    const data = (await safeFetch(url)) as { meals: unknown[] | null };
    if (!data.meals?.[0]) return null;
    return normalizeMeal(data.meals[0]);
  });
}

/* ─── Spoonacular ────────────────────────────────────────────────────────── */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalizeSpoonacular(r: any): ExternalRecipe {
  const steps: ExternalRecipe["steps"] = [];
  const analyzedInstructions = r.analyzedInstructions as {
    steps: { number: number; step: string }[];
  }[];
  if (analyzedInstructions?.[0]?.steps) {
    for (const s of analyzedInstructions[0].steps) {
      steps.push({ stepNumber: s.number, description: s.step });
    }
  }

  return {
    externalId: String(r.id as number),
    source: "spoonacular",
    title: r.title as string,
    coverImage: r.image as string | undefined,
    prepTime: r.preparationMinutes as number | undefined,
    cookTime: r.cookingMinutes ?? (r.readyInMinutes as number) ?? undefined,
    servings: r.servings as number | undefined,
    calories: r.nutrition?.nutrients?.find(
      (n: { name: string }) => n.name === "Calories",
    )?.amount as number | undefined,
    difficulty: (r.readyInMinutes as number) <= 30 ? "EASY" : "MEDIUM",
    tags: (r.dishTypes ?? []) as string[],
    sourceUrl: r.sourceUrl as string | undefined,
    ingredients: (
      (r.extendedIngredients ?? []) as {
        nameClean: string;
        amount: number;
        unit: string;
      }[]
    ).map((i) => ({
      name: i.nameClean,
      quantity: String(i.amount),
      unit: i.unit,
    })),
    steps,
  };
}

export async function searchSpoonacular(q: string): Promise<ExternalRecipe[]> {
  const apiKey = process.env.SPOONACULAR_API_KEY;
  if (!apiKey) return [];

  return withCache(`spoonacular:search:${q}`, CACHE_TTL, async () => {
    const url = `https://api.spoonacular.com/recipes/complexSearch?query=${encodeURIComponent(q)}&addRecipeInformation=true&number=8&apiKey=${apiKey}`;
    const data = (await safeFetch(url)) as { results: unknown[] };
    return (data.results ?? []).map(normalizeSpoonacular);
  });
}

/* ─── Edamam ─────────────────────────────────────────────────────────────── */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalizeEdamam(hit: any): ExternalRecipe {
  const r = hit.recipe;
  return {
    externalId: encodeURIComponent(
      hit._links?.self?.href ?? (r.label as string),
    ),
    source: "edamam",
    title: r.label as string,
    coverImage: r.image as string | undefined,
    cookTime: r.totalTime as number | undefined,
    servings: r.yield as number | undefined,
    calories: Math.round((r.calories as number) / (r.yield as number)),
    difficulty: (r.totalTime as number) <= 30 ? "EASY" : "MEDIUM",
    tags: (r.cuisineType ?? []).concat(r.mealType ?? []) as string[],
    sourceUrl: r.url as string,
    ingredients: (
      (r.ingredients ?? []) as {
        food: string;
        quantity: number;
        measure: string;
      }[]
    ).map((i) => ({
      name: i.food,
      quantity: String(i.quantity),
      unit: i.measure ?? "",
    })),
    steps: [], // Edamam free tier doesn't return step-by-step instructions
  };
}

export async function searchEdamam(q: string): Promise<ExternalRecipe[]> {
  const appId = process.env.EDAMAM_APP_ID;
  const appKey = process.env.EDAMAM_APP_KEY;
  if (!appId || !appKey) return [];

  return withCache(`edamam:search:${q}`, CACHE_TTL, async () => {
    const url = `https://api.edamam.com/api/recipes/v2?type=public&q=${encodeURIComponent(q)}&app_id=${appId}&app_key=${appKey}&field=label&field=image&field=yield&field=calories&field=totalTime&field=cuisineType&field=mealType&field=ingredients&field=url`;
    const data = (await safeFetch(url)) as { hits: unknown[] };
    return (data.hits ?? []).map(normalizeEdamam);
  });
}

/* ─── Fan-out search ─────────────────────────────────────────────────────── */
export async function searchAllExternal(q: string): Promise<ExternalRecipe[]> {
  const [mealdb, spoonacular, edamam] = await Promise.allSettled([
    searchTheMealDB(q),
    searchSpoonacular(q),
    searchEdamam(q),
  ]);

  const results: ExternalRecipe[] = [];
  for (const r of [mealdb, spoonacular, edamam]) {
    if (r.status === "fulfilled") results.push(...r.value);
  }

  // Deduplicate by normalized title
  const seen = new Set<string>();
  return results.filter((r) => {
    const key = r.title.toLowerCase().replace(/\s+/g, "");
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
