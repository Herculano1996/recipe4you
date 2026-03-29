export interface GeneratedRecipe {
  title: string;
  description: string;
  ingredients: Array<{
    name: string;
    quantity: string;
    unit: string;
    notes?: string;
  }>;
  steps: Array<{
    stepNumber: number;
    title?: string;
    description: string;
    duration?: number;
  }>;
  prepTime: number;
  cookTime: number;
  servings: number;
  difficulty: "EASY" | "MEDIUM" | "HARD" | "EXPERT";
  tags: string[];
  estimatedCalories?: number;
}

export interface NutritionInfo {
  calories: number;
  protein: number; // grams
  carbohydrates: number;
  fat: number;
  fiber: number;
  sugar: number;
  sodium: number; // milligrams
  servingSize: string;
}

export interface MealPlanDay {
  day:
    | "Monday"
    | "Tuesday"
    | "Wednesday"
    | "Thursday"
    | "Friday"
    | "Saturday"
    | "Sunday";
  breakfast: MealPlanSlot;
  lunch: MealPlanSlot;
  dinner: MealPlanSlot;
  snacks?: MealPlanSlot[];
}

export interface MealPlanSlot {
  title: string;
  description: string;
  estimatedCalories: number;
  prepTime: number;
  tags: string[];
}

export interface WeeklyMealPlan {
  goal: string;
  totalDailyCalories: number;
  days: MealPlanDay[];
}

export interface RecipeImprovements {
  suggestions: string[];
  improvedDescription?: string;
  substitutions?: Array<{
    original: string;
    substitute: string;
    reason: string;
  }>;
  techniqueTips: string[];
}
