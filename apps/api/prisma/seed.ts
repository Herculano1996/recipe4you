/**
 * Database seed for recipe4you
 *
 * Creates: 8 users · 38 tags · 90 ingredients · 25 recipes (full detail)
 *          favorites · collections · ratings
 *
 * NOTE: User records are created directly in Prisma (profile only).
 *       Supabase auth users must be registered separately through the app
 *       if you need to log in as these users. For browsing public data the
 *       seeded content is sufficient without Supabase auth.
 *
 * Run:  pnpm --filter api db:seed
 */

// Load .env from repo root (../../ relative to apps/api/ CWD)
import { config } from "dotenv";
config({ path: "../../.env" });

import {
  PrismaClient,
  Difficulty,
  TagCategory,
  UserRole,
  SubscriptionTier,
} from "@prisma/client";

// Seed always uses the direct (non-pooler) URL — same connection migrations use.
const prisma = new PrismaClient({
  datasources: { db: { url: process.env.DIRECT_URL } },
});

// ─── Helpers ────────────────────────────────────────────────────────────────

function toSlug(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

// ─── Tag data ────────────────────────────────────────────────────────────────

const TAG_DEFS: { name: string; category: TagCategory }[] = [
  // DIETARY
  { name: "Vegan", category: TagCategory.DIETARY },
  { name: "Vegetarian", category: TagCategory.DIETARY },
  { name: "Gluten-Free", category: TagCategory.DIETARY },
  { name: "Dairy-Free", category: TagCategory.DIETARY },
  { name: "Keto", category: TagCategory.DIETARY },
  { name: "Paleo", category: TagCategory.DIETARY },
  { name: "Nut-Free", category: TagCategory.DIETARY },
  // CUISINE
  { name: "Italian", category: TagCategory.CUISINE },
  { name: "Mexican", category: TagCategory.CUISINE },
  { name: "Asian", category: TagCategory.CUISINE },
  { name: "Mediterranean", category: TagCategory.CUISINE },
  { name: "French", category: TagCategory.CUISINE },
  { name: "Indian", category: TagCategory.CUISINE },
  { name: "American", category: TagCategory.CUISINE },
  { name: "Japanese", category: TagCategory.CUISINE },
  { name: "Thai", category: TagCategory.CUISINE },
  { name: "Greek", category: TagCategory.CUISINE },
  { name: "Korean", category: TagCategory.CUISINE },
  // MEAL_TYPE
  { name: "Breakfast", category: TagCategory.MEAL_TYPE },
  { name: "Lunch", category: TagCategory.MEAL_TYPE },
  { name: "Dinner", category: TagCategory.MEAL_TYPE },
  { name: "Snack", category: TagCategory.MEAL_TYPE },
  { name: "Dessert", category: TagCategory.MEAL_TYPE },
  { name: "Brunch", category: TagCategory.MEAL_TYPE },
  // COOKING_METHOD
  { name: "Baked", category: TagCategory.COOKING_METHOD },
  { name: "Grilled", category: TagCategory.COOKING_METHOD },
  { name: "Fried", category: TagCategory.COOKING_METHOD },
  { name: "Slow-Cooker", category: TagCategory.COOKING_METHOD },
  { name: "Air-Fryer", category: TagCategory.COOKING_METHOD },
  { name: "Raw", category: TagCategory.COOKING_METHOD },
  // OCCASION
  { name: "Weeknight", category: TagCategory.OCCASION },
  { name: "Holiday", category: TagCategory.OCCASION },
  { name: "Party", category: TagCategory.OCCASION },
  { name: "Meal-Prep", category: TagCategory.OCCASION },
  // GENERAL
  { name: "Quick (< 30 min)", category: TagCategory.GENERAL },
  { name: "Budget-Friendly", category: TagCategory.GENERAL },
  { name: "High-Protein", category: TagCategory.GENERAL },
  { name: "Comfort Food", category: TagCategory.GENERAL },
];

// ─── Ingredient data ─────────────────────────────────────────────────────────

const INGREDIENT_DEFS: { name: string; category: string }[] = [
  // Produce
  { name: "garlic", category: "Produce" },
  { name: "onion", category: "Produce" },
  { name: "tomato", category: "Produce" },
  { name: "cherry tomatoes", category: "Produce" },
  { name: "lemon", category: "Produce" },
  { name: "lime", category: "Produce" },
  { name: "avocado", category: "Produce" },
  { name: "spinach", category: "Produce" },
  { name: "mushrooms", category: "Produce" },
  { name: "bell pepper", category: "Produce" },
  { name: "jalapeño", category: "Produce" },
  { name: "ginger", category: "Produce" },
  { name: "cilantro", category: "Produce" },
  { name: "basil", category: "Produce" },
  { name: "parsley", category: "Produce" },
  { name: "thyme", category: "Produce" },
  { name: "rosemary", category: "Produce" },
  { name: "scallions", category: "Produce" },
  { name: "broccoli", category: "Produce" },
  { name: "carrot", category: "Produce" },
  { name: "cucumber", category: "Produce" },
  { name: "red onion", category: "Produce" },
  { name: "banana", category: "Produce" },
  { name: "shallot", category: "Produce" },
  { name: "baby spinach", category: "Produce" },
  // Dairy
  { name: "eggs", category: "Dairy" },
  { name: "butter", category: "Dairy" },
  { name: "heavy cream", category: "Dairy" },
  { name: "milk", category: "Dairy" },
  { name: "parmesan cheese", category: "Dairy" },
  { name: "mozzarella cheese", category: "Dairy" },
  { name: "cheddar cheese", category: "Dairy" },
  { name: "feta cheese", category: "Dairy" },
  { name: "cream cheese", category: "Dairy" },
  { name: "mascarpone", category: "Dairy" },
  { name: "Greek yogurt", category: "Dairy" },
  // Meat & Seafood
  { name: "chicken breast", category: "Meat" },
  { name: "chicken thighs", category: "Meat" },
  { name: "ground beef", category: "Meat" },
  { name: "beef sirloin", category: "Meat" },
  { name: "bacon", category: "Meat" },
  { name: "pancetta", category: "Meat" },
  { name: "salmon fillet", category: "Seafood" },
  { name: "shrimp", category: "Seafood" },
  // Grains
  { name: "spaghetti", category: "Grains" },
  { name: "penne pasta", category: "Grains" },
  { name: "arborio rice", category: "Grains" },
  { name: "basmati rice", category: "Grains" },
  { name: "quinoa", category: "Grains" },
  { name: "rolled oats", category: "Grains" },
  // Baking
  { name: "all-purpose flour", category: "Baking" },
  { name: "bread flour", category: "Baking" },
  { name: "sugar", category: "Baking" },
  { name: "brown sugar", category: "Baking" },
  { name: "baking powder", category: "Baking" },
  { name: "baking soda", category: "Baking" },
  { name: "vanilla extract", category: "Baking" },
  { name: "cocoa powder", category: "Baking" },
  { name: "chocolate chips", category: "Baking" },
  // Pantry
  { name: "olive oil", category: "Pantry" },
  { name: "vegetable oil", category: "Pantry" },
  { name: "soy sauce", category: "Pantry" },
  { name: "fish sauce", category: "Pantry" },
  { name: "coconut milk", category: "Pantry" },
  { name: "tomato paste", category: "Pantry" },
  { name: "tomato sauce", category: "Pantry" },
  { name: "chicken broth", category: "Pantry" },
  { name: "dry white wine", category: "Pantry" },
  { name: "red wine", category: "Pantry" },
  { name: "honey", category: "Pantry" },
  { name: "sesame oil", category: "Pantry" },
  { name: "rice vinegar", category: "Pantry" },
  { name: "chickpeas", category: "Pantry" },
  { name: "black beans", category: "Pantry" },
  { name: "tahini", category: "Pantry" },
  { name: "peanut butter", category: "Pantry" },
  { name: "espresso", category: "Pantry" },
  { name: "ladyfinger biscuits", category: "Pantry" },
  // Spices
  { name: "salt", category: "Spices" },
  { name: "black pepper", category: "Spices" },
  { name: "cumin", category: "Spices" },
  { name: "coriander", category: "Spices" },
  { name: "paprika", category: "Spices" },
  { name: "smoked paprika", category: "Spices" },
  { name: "turmeric", category: "Spices" },
  { name: "cayenne pepper", category: "Spices" },
  { name: "chili powder", category: "Spices" },
  { name: "dried oregano", category: "Spices" },
  { name: "garam masala", category: "Spices" },
  { name: "curry powder", category: "Spices" },
  { name: "cinnamon", category: "Spices" },
  { name: "red pepper flakes", category: "Spices" },
];

// ─── User data ────────────────────────────────────────────────────────────────

const USER_DEFS = [
  {
    id: "00000000-0000-0000-0000-000000000001",
    email: "admin@recipe4you.com",
    username: "admin",
    displayName: "Recipe4You Admin",
    bio: "Managing the recipe4you community.",
    avatarUrl:
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&q=80",
    role: UserRole.ADMIN,
    subscriptionTier: SubscriptionTier.PREMIUM,
  },
  {
    id: "00000000-0000-0000-0000-000000000002",
    email: "chef.marco@example.com",
    username: "chef_marco",
    displayName: "Marco Rossi",
    bio: "Italian chef with 15 years of experience. Passionate about traditional recipes.",
    avatarUrl:
      "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=200&q=80",
    role: UserRole.PREMIUM,
    subscriptionTier: SubscriptionTier.PREMIUM,
  },
  {
    id: "00000000-0000-0000-0000-000000000003",
    email: "julia.cooks@example.com",
    username: "julia_cooks",
    displayName: "Julia Chen",
    bio: "Home cook and food blogger. I love exploring flavors from around the world.",
    avatarUrl:
      "https://images.unsplash.com/photo-1494790108755-2616b612b3fb?w=200&q=80",
    role: UserRole.PREMIUM,
    subscriptionTier: SubscriptionTier.PREMIUM,
  },
  {
    id: "00000000-0000-0000-0000-000000000004",
    email: "john.doe@example.com",
    username: "johndoe",
    displayName: "John Doe",
    bio: "Weekend chef. I make simple meals that taste great.",
    avatarUrl:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80",
    role: UserRole.USER,
    subscriptionTier: SubscriptionTier.FREE,
  },
  {
    id: "00000000-0000-0000-0000-000000000005",
    email: "emma.smith@example.com",
    username: "emma_eats",
    displayName: "Emma Smith",
    bio: "Vegan food enthusiast. Proving plant-based food is delicious.",
    avatarUrl:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80",
    role: UserRole.USER,
    subscriptionTier: SubscriptionTier.FREE,
  },
  {
    id: "00000000-0000-0000-0000-000000000006",
    email: "carlos.rivera@example.com",
    username: "carlos_cocina",
    displayName: "Carlos Rivera",
    bio: "Authentic Mexican and Latin American recipes from my abuela.",
    avatarUrl:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80",
    role: UserRole.USER,
    subscriptionTier: SubscriptionTier.FREE,
  },
  {
    id: "00000000-0000-0000-0000-000000000007",
    email: "priya.sharma@example.com",
    username: "priya_spices",
    displayName: "Priya Sharma",
    bio: "Bringing the warmth of Indian spices to your kitchen.",
    avatarUrl:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80",
    role: UserRole.USER,
    subscriptionTier: SubscriptionTier.FREE,
  },
  {
    id: "00000000-0000-0000-0000-000000000008",
    email: "sam.taylor@example.com",
    username: "sam_bakes",
    displayName: "Sam Taylor",
    bio: "Pastry chef and dessert lover. Life is sweet.",
    avatarUrl:
      "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&q=80",
    role: UserRole.USER,
    subscriptionTier: SubscriptionTier.FREE,
  },
];

// ─── Recipe definitions ──────────────────────────────────────────────────────

interface IngredientInput {
  name: string;
  quantity: number;
  unit: string;
  notes?: string;
  groupName?: string;
  sortOrder?: number;
}

interface StepInput {
  stepNumber: number;
  title?: string;
  description: string;
  duration?: number;
}

interface RecipeDef {
  title: string;
  description: string;
  difficulty: Difficulty;
  prepTime: number;
  cookTime: number;
  servings: number;
  calories: number;
  coverImage: string;
  authorUsername: string;
  tagNames: string[];
  ingredients: IngredientInput[];
  steps: StepInput[];
}

const RECIPE_DEFS: RecipeDef[] = [
  {
    title: "Classic Spaghetti Carbonara",
    description:
      "An authentic Roman pasta dish made with eggs, Pecorino Romano, guanciale, and black pepper. No cream needed — the silky sauce comes from the egg and cheese mixture.",
    difficulty: Difficulty.HARD,
    prepTime: 10,
    cookTime: 20,
    servings: 4,
    calories: 620,
    coverImage:
      "https://images.unsplash.com/photo-1546549032-9571cd6b27df?w=800&q=80",
    authorUsername: "chef_marco",
    tagNames: ["Italian", "Dinner", "Comfort Food"],
    ingredients: [
      { name: "spaghetti", quantity: 400, unit: "g", sortOrder: 0 },
      { name: "pancetta", quantity: 150, unit: "g", notes: "or guanciale, cubed", sortOrder: 1 },
      { name: "eggs", quantity: 4, unit: "large", notes: "2 whole + 2 yolks", sortOrder: 2 },
      { name: "parmesan cheese", quantity: 100, unit: "g", notes: "finely grated", sortOrder: 3 },
      { name: "black pepper", quantity: 2, unit: "tsp", notes: "freshly cracked", sortOrder: 4 },
      { name: "salt", quantity: 1, unit: "tbsp", notes: "for pasta water", sortOrder: 5 },
    ],
    steps: [
      { stepNumber: 1, title: "Cook the pasta", description: "Bring a large pot of salted water to a boil. Cook spaghetti until al dente (1 minute less than package directions). Reserve 1 cup of pasta water before draining.", duration: 10 },
      { stepNumber: 2, title: "Render the pancetta", description: "While pasta cooks, fry pancetta in a large cold pan over medium heat until crispy and fat has rendered, about 6–8 minutes. Remove from heat.", duration: 8 },
      { stepNumber: 3, title: "Make the sauce", description: "Whisk eggs, yolks, and all but 2 tbsp of Parmesan in a bowl. Season generously with cracked black pepper.", duration: 2 },
      { stepNumber: 4, title: "Combine off heat", description: "Add drained pasta to the pancetta pan (off heat). Pour egg mixture over, tossing vigorously and adding pasta water splash by splash until sauce is creamy and coats the pasta. Do not let it scramble.", duration: 3 },
      { stepNumber: 5, title: "Serve", description: "Plate immediately, top with reserved Parmesan and a generous grind of black pepper.", duration: 1 },
    ],
  },
  {
    title: "Margherita Pizza Napoletana",
    description:
      "A classic Neapolitan pizza with a chewy, blistered crust, San Marzano tomato sauce, fresh mozzarella, and basil. Simple perfection.",
    difficulty: Difficulty.MEDIUM,
    prepTime: 30,
    cookTime: 12,
    servings: 2,
    calories: 480,
    coverImage:
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&q=80",
    authorUsername: "chef_marco",
    tagNames: ["Italian", "Dinner", "Vegetarian", "Baked"],
    ingredients: [
      { name: "bread flour", quantity: 300, unit: "g", groupName: "Dough", sortOrder: 0 },
      { name: "salt", quantity: 1, unit: "tsp", groupName: "Dough", sortOrder: 1 },
      { name: "olive oil", quantity: 1, unit: "tbsp", groupName: "Dough", sortOrder: 2 },
      { name: "tomato sauce", quantity: 150, unit: "ml", groupName: "Topping", sortOrder: 3 },
      { name: "mozzarella cheese", quantity: 200, unit: "g", notes: "fresh, torn", groupName: "Topping", sortOrder: 4 },
      { name: "basil", quantity: 10, unit: "leaves", groupName: "Topping", sortOrder: 5 },
    ],
    steps: [
      { stepNumber: 1, title: "Make the dough", description: "Mix flour, salt, and a pinch of yeast. Add 200ml warm water and olive oil. Knead 10 minutes until smooth. Cover and rest 2 hours until doubled.", duration: 15 },
      { stepNumber: 2, title: "Preheat", description: "Place a baking stone or inverted baking sheet in the oven. Preheat to maximum temperature (250°C / 480°F) for at least 30 minutes.", duration: 30 },
      { stepNumber: 3, title: "Shape & top", description: "Stretch the dough ball into a 30cm circle on a floured surface. Spread tomato sauce leaving a 2cm border. Scatter mozzarella pieces. Drizzle with olive oil.", duration: 5 },
      { stepNumber: 4, title: "Bake", description: "Slide onto the hot stone and bake 10–12 minutes until crust is charred in spots and cheese is bubbling.", duration: 12 },
      { stepNumber: 5, title: "Finish", description: "Remove from oven, scatter fresh basil leaves, drizzle with olive oil. Serve immediately.", duration: 1 },
    ],
  },
  {
    title: "Chicken Tikka Masala",
    description:
      "Tender chicken in a rich, aromatic tomato-cream sauce with warming spices. A beloved British-Indian classic that's surprisingly easy to make at home.",
    difficulty: Difficulty.MEDIUM,
    prepTime: 20,
    cookTime: 35,
    servings: 4,
    calories: 520,
    coverImage:
      "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800&q=80",
    authorUsername: "priya_spices",
    tagNames: ["Indian", "Dinner", "High-Protein", "Grilled"],
    ingredients: [
      { name: "chicken breast", quantity: 700, unit: "g", notes: "cut into chunks", groupName: "Chicken", sortOrder: 0 },
      { name: "Greek yogurt", quantity: 150, unit: "g", groupName: "Marinade", sortOrder: 1 },
      { name: "garam masala", quantity: 2, unit: "tsp", groupName: "Marinade", sortOrder: 2 },
      { name: "turmeric", quantity: 1, unit: "tsp", groupName: "Marinade", sortOrder: 3 },
      { name: "onion", quantity: 2, unit: "large", notes: "finely diced", groupName: "Sauce", sortOrder: 4 },
      { name: "garlic", quantity: 4, unit: "cloves", notes: "minced", groupName: "Sauce", sortOrder: 5 },
      { name: "ginger", quantity: 1, unit: "tbsp", notes: "grated", groupName: "Sauce", sortOrder: 6 },
      { name: "tomato paste", quantity: 2, unit: "tbsp", groupName: "Sauce", sortOrder: 7 },
      { name: "tomato sauce", quantity: 400, unit: "ml", groupName: "Sauce", sortOrder: 8 },
      { name: "heavy cream", quantity: 150, unit: "ml", groupName: "Sauce", sortOrder: 9 },
      { name: "curry powder", quantity: 2, unit: "tsp", groupName: "Sauce", sortOrder: 10 },
    ],
    steps: [
      { stepNumber: 1, title: "Marinate", description: "Mix chicken with yogurt, garam masala, turmeric, salt, and half the garlic and ginger. Marinate at least 1 hour.", duration: 5 },
      { stepNumber: 2, title: "Grill chicken", description: "Thread chicken onto skewers. Grill or broil at high heat for 10–12 minutes, turning once, until charred and cooked through.", duration: 12 },
      { stepNumber: 3, title: "Build the sauce", description: "Fry onion in oil until deep golden, 12 minutes. Add remaining garlic, ginger, tomato paste, and curry powder. Cook 2 minutes.", duration: 15 },
      { stepNumber: 4, title: "Simmer", description: "Add tomato sauce, 150ml water, and simmer 15 minutes. Blend until smooth. Return to pan, stir in cream, and season.", duration: 18 },
      { stepNumber: 5, title: "Finish", description: "Add grilled chicken to the sauce and simmer 5 minutes. Garnish with cilantro. Serve with basmati rice.", duration: 5 },
    ],
  },
  {
    title: "Avocado Toast with Poached Eggs",
    description:
      "Creamy smashed avocado on crusty sourdough topped with perfectly poached eggs, red pepper flakes, and microgreens. The ultimate brunch dish.",
    difficulty: Difficulty.EASY,
    prepTime: 10,
    cookTime: 10,
    servings: 2,
    calories: 380,
    coverImage:
      "https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=800&q=80",
    authorUsername: "julia_cooks",
    tagNames: ["Breakfast", "Brunch", "Vegetarian", "Quick (< 30 min)"],
    ingredients: [
      { name: "avocado", quantity: 2, unit: "ripe", sortOrder: 0 },
      { name: "eggs", quantity: 4, unit: "large", sortOrder: 1 },
      { name: "lemon", quantity: 1, unit: "juice of", sortOrder: 2 },
      { name: "red pepper flakes", quantity: 0.5, unit: "tsp", sortOrder: 3 },
      { name: "salt", quantity: 0.5, unit: "tsp", sortOrder: 4 },
      { name: "olive oil", quantity: 1, unit: "drizzle", sortOrder: 5 },
    ],
    steps: [
      { stepNumber: 1, title: "Toast the bread", description: "Toast 4 thick slices of sourdough bread until deeply golden and crisp.", duration: 3 },
      { stepNumber: 2, title: "Smash the avocado", description: "Scoop avocado flesh into a bowl. Add lemon juice, salt, and a pinch of red pepper flakes. Smash with a fork.", duration: 3 },
      { stepNumber: 3, title: "Poach the eggs", description: "Bring a wide pan of water to a gentle simmer. Add a splash of vinegar. Create a gentle swirl. Crack each egg into the centre and poach 3 minutes for runny yolks.", duration: 5 },
      { stepNumber: 4, title: "Assemble", description: "Spread avocado on toast. Top with a poached egg. Drizzle with olive oil, season with salt and red pepper flakes.", duration: 1 },
    ],
  },
  {
    title: "Greek Salad (Horiatiki)",
    description:
      "Traditional village salad with ripe tomatoes, crunchy cucumber, kalamata olives, and a thick slab of creamy feta. No lettuce — just pure, honest ingredients.",
    difficulty: Difficulty.EASY,
    prepTime: 15,
    cookTime: 0,
    servings: 4,
    calories: 220,
    coverImage:
      "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800&q=80",
    authorUsername: "julia_cooks",
    tagNames: ["Greek", "Mediterranean", "Lunch", "Vegetarian", "Gluten-Free", "Quick (< 30 min)", "Raw"],
    ingredients: [
      { name: "tomato", quantity: 4, unit: "large", notes: "cut into wedges", sortOrder: 0 },
      { name: "cucumber", quantity: 1, unit: "large", notes: "roughly chopped", sortOrder: 1 },
      { name: "red onion", quantity: 0.5, unit: "small", notes: "thinly sliced", sortOrder: 2 },
      { name: "feta cheese", quantity: 200, unit: "g", notes: "block, not crumbled", sortOrder: 3 },
      { name: "olive oil", quantity: 4, unit: "tbsp", sortOrder: 4 },
      { name: "dried oregano", quantity: 1, unit: "tsp", sortOrder: 5 },
      { name: "black pepper", quantity: 0.5, unit: "tsp", sortOrder: 6 },
    ],
    steps: [
      { stepNumber: 1, title: "Prep the vegetables", description: "Combine tomato wedges, cucumber, red onion in a large bowl. Season lightly with salt and let sit 5 minutes.", duration: 5 },
      { stepNumber: 2, title: "Dress and top", description: "Drizzle with olive oil. Place the whole feta block on top. Scatter oregano and black pepper over everything. Toss gently at the table.", duration: 2 },
    ],
  },
  {
    title: "Crispy Beef Tacos",
    description:
      "Juicy, well-seasoned ground beef in crispy corn tortillas with all the classic toppings. Better than any fast food, ready in 30 minutes.",
    difficulty: Difficulty.EASY,
    prepTime: 10,
    cookTime: 20,
    servings: 4,
    calories: 450,
    coverImage:
      "https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=800&q=80",
    authorUsername: "carlos_cocina",
    tagNames: ["Mexican", "Dinner", "Weeknight", "Quick (< 30 min)"],
    ingredients: [
      { name: "ground beef", quantity: 500, unit: "g", sortOrder: 0 },
      { name: "onion", quantity: 1, unit: "medium", notes: "diced", sortOrder: 1 },
      { name: "garlic", quantity: 3, unit: "cloves", notes: "minced", sortOrder: 2 },
      { name: "chili powder", quantity: 1, unit: "tbsp", sortOrder: 3 },
      { name: "cumin", quantity: 1, unit: "tsp", sortOrder: 4 },
      { name: "smoked paprika", quantity: 1, unit: "tsp", sortOrder: 5 },
      { name: "tomato paste", quantity: 2, unit: "tbsp", sortOrder: 6 },
      { name: "lime", quantity: 1, unit: "juice of", sortOrder: 7 },
    ],
    steps: [
      { stepNumber: 1, description: "Brown ground beef in a large skillet over high heat, breaking it up. Drain excess fat.", duration: 5 },
      { stepNumber: 2, title: "Season the meat", description: "Reduce heat to medium. Add onion and garlic, cook 3 minutes. Stir in all spices and tomato paste. Cook 2 minutes. Add 100ml water and lime juice. Simmer 5 minutes.", duration: 10 },
      { stepNumber: 3, title: "Warm tortillas", description: "Heat corn tortillas directly over a gas flame or in a dry pan 30 seconds per side until charred and pliable.", duration: 5 },
      { stepNumber: 4, title: "Assemble", description: "Fill each tortilla with beef. Top with shredded cabbage, diced tomato, sour cream, cilantro, and a squeeze of lime.", duration: 3 },
    ],
  },
  {
    title: "Fluffy Banana Pancakes",
    description:
      "Naturally sweet, two-ingredient banana pancakes that are gluten-free and incredibly fluffy. Ready in 15 minutes with no mixers needed.",
    difficulty: Difficulty.EASY,
    prepTime: 5,
    cookTime: 10,
    servings: 2,
    calories: 290,
    coverImage:
      "https://images.unsplash.com/photo-1528207776546-365bb710ee93?w=800&q=80",
    authorUsername: "sam_bakes",
    tagNames: ["Breakfast", "Vegetarian", "Gluten-Free", "Dairy-Free", "Quick (< 30 min)", "Budget-Friendly"],
    ingredients: [
      { name: "banana", quantity: 2, unit: "ripe", sortOrder: 0 },
      { name: "eggs", quantity: 2, unit: "large", sortOrder: 1 },
      { name: "baking powder", quantity: 0.5, unit: "tsp", sortOrder: 2 },
      { name: "vanilla extract", quantity: 0.5, unit: "tsp", sortOrder: 3 },
      { name: "butter", quantity: 1, unit: "tbsp", notes: "for cooking", sortOrder: 4 },
    ],
    steps: [
      { stepNumber: 1, description: "Mash bananas thoroughly in a bowl until smooth. Add eggs, baking powder, and vanilla. Whisk until well combined.", duration: 3 },
      { stepNumber: 2, description: "Heat a non-stick pan over medium-low heat with a little butter. Pour 3–4 tbsp batter per pancake. Cook 2 minutes until bubbles form. Flip and cook 1 more minute.", duration: 8 },
      { stepNumber: 3, description: "Serve stacked with maple syrup, fresh berries, or a dollop of Greek yogurt.", duration: 1 },
    ],
  },
  {
    title: "Honey Soy Glazed Salmon",
    description:
      "Salmon fillets glazed with a sweet, sticky honey-soy sauce. Pan-seared to perfection with crispy skin and flaky flesh inside.",
    difficulty: Difficulty.EASY,
    prepTime: 10,
    cookTime: 15,
    servings: 2,
    calories: 420,
    coverImage:
      "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=800&q=80",
    authorUsername: "julia_cooks",
    tagNames: ["Japanese", "Asian", "Dinner", "Gluten-Free", "High-Protein", "Weeknight"],
    ingredients: [
      { name: "salmon fillet", quantity: 2, unit: "fillets", notes: "skin on, ~180g each", sortOrder: 0 },
      { name: "soy sauce", quantity: 3, unit: "tbsp", sortOrder: 1 },
      { name: "honey", quantity: 2, unit: "tbsp", sortOrder: 2 },
      { name: "garlic", quantity: 2, unit: "cloves", notes: "minced", sortOrder: 3 },
      { name: "ginger", quantity: 1, unit: "tsp", notes: "grated", sortOrder: 4 },
      { name: "sesame oil", quantity: 1, unit: "tsp", sortOrder: 5 },
      { name: "scallions", quantity: 2, unit: "stalks", notes: "finely sliced", sortOrder: 6 },
    ],
    steps: [
      { stepNumber: 1, title: "Make the glaze", description: "Whisk soy sauce, honey, garlic, ginger, and sesame oil together in a small bowl.", duration: 2 },
      { stepNumber: 2, title: "Sear skin-side", description: "Pat salmon dry. Heat an oven-safe pan over medium-high with oil. Place salmon skin-side down. Press lightly 30 seconds. Cook 4–5 minutes until skin is crispy.", duration: 5 },
      { stepNumber: 3, title: "Glaze and finish", description: "Flip salmon. Pour glaze over and around. Cook 2–3 more minutes, spooning glaze over the top, until barely cooked through.", duration: 4 },
      { stepNumber: 4, description: "Plate with steamed rice and vegetables. Garnish with sliced scallions and sesame seeds.", duration: 1 },
    ],
  },
  {
    title: "Thai Green Vegetable Curry",
    description:
      "A fragrant, vibrant coconut milk curry with tender vegetables. Packed with flavour from lemongrass, galangal, and kaffir lime. Naturally vegan.",
    difficulty: Difficulty.MEDIUM,
    prepTime: 15,
    cookTime: 25,
    servings: 4,
    calories: 340,
    coverImage:
      "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=800&q=80",
    authorUsername: "julia_cooks",
    tagNames: ["Thai", "Asian", "Dinner", "Vegan", "Dairy-Free", "Gluten-Free"],
    ingredients: [
      { name: "coconut milk", quantity: 400, unit: "ml", sortOrder: 0 },
      { name: "broccoli", quantity: 300, unit: "g", notes: "cut into florets", sortOrder: 1 },
      { name: "bell pepper", quantity: 2, unit: "medium", notes: "sliced", sortOrder: 2 },
      { name: "mushrooms", quantity: 200, unit: "g", sortOrder: 3 },
      { name: "garlic", quantity: 3, unit: "cloves", notes: "minced", sortOrder: 4 },
      { name: "ginger", quantity: 1, unit: "tbsp", notes: "grated", sortOrder: 5 },
      { name: "soy sauce", quantity: 2, unit: "tbsp", sortOrder: 6 },
      { name: "lime", quantity: 1, unit: "juice of", sortOrder: 7 },
      { name: "basil", quantity: 1, unit: "handful", notes: "Thai basil if available", sortOrder: 8 },
    ],
    steps: [
      { stepNumber: 1, description: "Heat oil in a wok over high heat. Fry garlic and ginger 1 minute until fragrant.", duration: 2 },
      { stepNumber: 2, title: "Add vegetables", description: "Add bell peppers and broccoli. Stir-fry 3 minutes until slightly softened but still vibrant.", duration: 4 },
      { stepNumber: 3, description: "Add 2 tbsp green curry paste and cook 1 minute. Pour in coconut milk and 100ml water. Bring to a simmer.", duration: 5 },
      { stepNumber: 4, description: "Add mushrooms and soy sauce, simmer 8 minutes until vegetables are tender. Stir in lime juice and basil. Serve with jasmine rice.", duration: 10 },
    ],
  },
  {
    title: "Classic Caesar Salad",
    description:
      "Crisp romaine lettuce, house-made Caesar dressing with anchovy depth, crunchy croutons, and shaved Parmesan. A timeless classic done properly.",
    difficulty: Difficulty.EASY,
    prepTime: 20,
    cookTime: 10,
    servings: 4,
    calories: 310,
    coverImage:
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80",
    authorUsername: "johndoe",
    tagNames: ["American", "Lunch", "Vegetarian", "Quick (< 30 min)"],
    ingredients: [
      { name: "parmesan cheese", quantity: 60, unit: "g", notes: "finely shaved", sortOrder: 0 },
      { name: "garlic", quantity: 2, unit: "cloves", notes: "minced", sortOrder: 1 },
      { name: "olive oil", quantity: 4, unit: "tbsp", sortOrder: 2 },
      { name: "lemon", quantity: 1, unit: "juice of", sortOrder: 3 },
      { name: "eggs", quantity: 2, unit: "yolks", notes: "for the dressing", sortOrder: 4 },
      { name: "black pepper", quantity: 1, unit: "tsp", sortOrder: 5 },
    ],
    steps: [
      { stepNumber: 1, title: "Make croutons", description: "Toss torn bread cubes with olive oil and garlic. Bake at 200°C for 10 minutes until golden.", duration: 12 },
      { stepNumber: 2, title: "Make dressing", description: "Whisk egg yolks, lemon juice, garlic, and 1 tsp Dijon until combined. Slowly drizzle in olive oil while whisking. Fold in half the Parmesan. Season.", duration: 5 },
      { stepNumber: 3, description: "Toss torn romaine with dressing until well coated. Add croutons and remaining Parmesan. Grind black pepper over the top.", duration: 3 },
    ],
  },
  {
    title: "Mushroom Risotto",
    description:
      "A luxuriously creamy risotto with a mix of mushrooms — silky, earthy, and deeply satisfying. The secret is constant attention and good stock.",
    difficulty: Difficulty.HARD,
    prepTime: 15,
    cookTime: 35,
    servings: 4,
    calories: 560,
    coverImage:
      "https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=800&q=80",
    authorUsername: "chef_marco",
    tagNames: ["Italian", "Dinner", "Vegetarian", "Comfort Food"],
    ingredients: [
      { name: "arborio rice", quantity: 320, unit: "g", sortOrder: 0 },
      { name: "mushrooms", quantity: 400, unit: "g", notes: "mixed — porcini, chestnut, shiitake", sortOrder: 1 },
      { name: "shallot", quantity: 2, unit: "medium", notes: "finely diced", sortOrder: 2 },
      { name: "garlic", quantity: 2, unit: "cloves", notes: "minced", sortOrder: 3 },
      { name: "dry white wine", quantity: 150, unit: "ml", sortOrder: 4 },
      { name: "chicken broth", quantity: 1200, unit: "ml", notes: "hot", sortOrder: 5 },
      { name: "butter", quantity: 60, unit: "g", notes: "cold, cubed", sortOrder: 6 },
      { name: "parmesan cheese", quantity: 80, unit: "g", notes: "finely grated", sortOrder: 7 },
      { name: "thyme", quantity: 3, unit: "sprigs", sortOrder: 8 },
    ],
    steps: [
      { stepNumber: 1, title: "Sauté mushrooms", description: "Cook mushrooms in butter over high heat until deeply golden, about 8 minutes. Season. Set aside, reserving some for garnish.", duration: 10 },
      { stepNumber: 2, title: "Start the risotto", description: "In the same pan, soften shallots and garlic. Add rice and toast 2 minutes. Pour in wine, stir until absorbed.", duration: 8 },
      { stepNumber: 3, title: "Add stock gradually", description: "Add hot stock one ladle at a time, stirring continuously. Allow each addition to absorb before adding the next. Continue about 18 minutes.", duration: 20 },
      { stepNumber: 4, title: "Finish (mantecare)", description: "When rice is al dente, fold in mushrooms. Remove from heat. Beat in cold butter and Parmesan until creamy and flowing. Adjust seasoning.", duration: 3 },
      { stepNumber: 5, description: "Serve in warm bowls, topped with reserved mushrooms and extra Parmesan. Eat immediately.", duration: 1 },
    ],
  },
  {
    title: "French Onion Soup",
    description:
      "Deeply caramelised onions in a rich beef broth, crowned with a crouton and a blanket of melted Gruyère. The ultimate cold-weather comfort food.",
    difficulty: Difficulty.MEDIUM,
    prepTime: 15,
    cookTime: 90,
    servings: 4,
    calories: 490,
    coverImage:
      "https://images.unsplash.com/photo-1547592180-85f173990554?w=800&q=80",
    authorUsername: "chef_marco",
    tagNames: ["French", "Dinner", "Comfort Food", "Weeknight"],
    ingredients: [
      { name: "onion", quantity: 6, unit: "large", notes: "thinly sliced", sortOrder: 0 },
      { name: "butter", quantity: 50, unit: "g", sortOrder: 1 },
      { name: "dry white wine", quantity: 200, unit: "ml", sortOrder: 2 },
      { name: "chicken broth", quantity: 1200, unit: "ml", sortOrder: 3 },
      { name: "thyme", quantity: 4, unit: "sprigs", sortOrder: 4 },
      { name: "garlic", quantity: 2, unit: "cloves", sortOrder: 5 },
    ],
    steps: [
      { stepNumber: 1, title: "Caramelise the onions", description: "Melt butter in a Dutch oven over medium heat. Add onions with a pinch of salt. Cook, stirring every few minutes, for 60–75 minutes until deep mahogany brown.", duration: 75 },
      { stepNumber: 2, description: "Increase heat to high. Add wine and scrape up any browned bits. Simmer until wine evaporates.", duration: 5 },
      { stepNumber: 3, description: "Add stock, thyme, and garlic. Simmer 20 minutes. Season to taste.", duration: 20 },
      { stepNumber: 4, title: "Gratinée", description: "Ladle soup into oven-safe bowls. Place a crouton on top. Cover with grated Gruyère. Broil until bubbling and golden.", duration: 5 },
    ],
  },
  {
    title: "Pad Thai",
    description:
      "The quintessential Thai stir-fried rice noodles with shrimp, egg, bean sprouts, and a tangy tamarind sauce. Ready in under 30 minutes.",
    difficulty: Difficulty.MEDIUM,
    prepTime: 20,
    cookTime: 15,
    servings: 2,
    calories: 510,
    coverImage:
      "https://images.unsplash.com/photo-1559314809-0d155014e29e?w=800&q=80",
    authorUsername: "julia_cooks",
    tagNames: ["Thai", "Asian", "Dinner", "Quick (< 30 min)"],
    ingredients: [
      { name: "shrimp", quantity: 200, unit: "g", notes: "peeled and deveined", sortOrder: 0 },
      { name: "eggs", quantity: 2, unit: "large", sortOrder: 1 },
      { name: "scallions", quantity: 3, unit: "stalks", notes: "sliced", sortOrder: 2 },
      { name: "garlic", quantity: 2, unit: "cloves", notes: "minced", sortOrder: 3 },
      { name: "fish sauce", quantity: 2, unit: "tbsp", sortOrder: 4 },
      { name: "rice vinegar", quantity: 1, unit: "tbsp", sortOrder: 5 },
      { name: "soy sauce", quantity: 1, unit: "tbsp", sortOrder: 6 },
      { name: "sugar", quantity: 2, unit: "tsp", sortOrder: 7 },
      { name: "sesame oil", quantity: 1, unit: "tsp", sortOrder: 8 },
    ],
    steps: [
      { stepNumber: 1, description: "Soak 200g flat rice noodles in boiling water 5 minutes. Drain and toss with oil to prevent sticking.", duration: 6 },
      { stepNumber: 2, title: "Mix the sauce", description: "Combine fish sauce, rice vinegar, soy sauce, sugar, and 2 tbsp tamarind paste in a bowl.", duration: 2 },
      { stepNumber: 3, title: "Cook the proteins", description: "Heat wok to very high heat. Stir-fry shrimp until pink, 2 minutes. Push to the side, scramble eggs in the centre.", duration: 4 },
      { stepNumber: 4, title: "Add noodles", description: "Add noodles and sauce. Toss everything vigorously for 2 minutes until noodles absorb the sauce.", duration: 3 },
      { stepNumber: 5, description: "Plate and top with scallions, bean sprouts, crushed peanuts, lime wedge, and dried chili.", duration: 1 },
    ],
  },
  {
    title: "Chocolate Chip Cookies",
    description:
      "The definitive chocolate chip cookie — crispy edges, chewy centre, and loaded with chocolate chips. Brown butter adds incredible depth of flavour.",
    difficulty: Difficulty.EASY,
    prepTime: 20,
    cookTime: 12,
    servings: 24,
    calories: 180,
    coverImage:
      "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=800&q=80",
    authorUsername: "sam_bakes",
    tagNames: ["Dessert", "Baked", "Vegetarian", "Comfort Food", "Party"],
    ingredients: [
      { name: "all-purpose flour", quantity: 280, unit: "g", sortOrder: 0 },
      { name: "butter", quantity: 230, unit: "g", notes: "browned and cooled", sortOrder: 1 },
      { name: "brown sugar", quantity: 200, unit: "g", notes: "packed", sortOrder: 2 },
      { name: "sugar", quantity: 100, unit: "g", sortOrder: 3 },
      { name: "eggs", quantity: 2, unit: "large", notes: "1 whole + 1 yolk", sortOrder: 4 },
      { name: "vanilla extract", quantity: 2, unit: "tsp", sortOrder: 5 },
      { name: "baking soda", quantity: 1, unit: "tsp", sortOrder: 6 },
      { name: "chocolate chips", quantity: 350, unit: "g", notes: "semi-sweet", sortOrder: 7 },
      { name: "salt", quantity: 1, unit: "tsp", sortOrder: 8 },
    ],
    steps: [
      { stepNumber: 1, title: "Brown butter", description: "Melt butter in a saucepan over medium heat. Swirl until golden-brown and nutty, about 5 minutes. Cool to room temperature.", duration: 8 },
      { stepNumber: 2, title: "Make the dough", description: "Whisk browned butter with both sugars. Beat in eggs and vanilla. Fold in flour, baking soda, and salt until just combined. Stir in chocolate chips.", duration: 8 },
      { stepNumber: 3, description: "Refrigerate dough at least 30 minutes (up to 72 hours for best flavour).", duration: 30 },
      { stepNumber: 4, title: "Bake", description: "Preheat oven to 175°C. Scoop 2-tbsp balls onto a lined tray. Bake 11–12 minutes until edges are set but centres look underdone. Cool on tray 10 minutes.", duration: 12 },
    ],
  },
  {
    title: "Classic Tiramisu",
    description:
      "The legendary Italian dessert with espresso-soaked ladyfingers, airy mascarpone cream, and a generous dusting of cocoa. No oven required.",
    difficulty: Difficulty.HARD,
    prepTime: 40,
    cookTime: 0,
    servings: 8,
    calories: 420,
    coverImage:
      "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=800&q=80",
    authorUsername: "sam_bakes",
    tagNames: ["Italian", "Dessert", "Vegetarian", "Holiday"],
    ingredients: [
      { name: "mascarpone", quantity: 500, unit: "g", sortOrder: 0 },
      { name: "eggs", quantity: 4, unit: "large", notes: "separated", sortOrder: 1 },
      { name: "sugar", quantity: 100, unit: "g", sortOrder: 2 },
      { name: "espresso", quantity: 300, unit: "ml", notes: "strong, cooled", sortOrder: 3 },
      { name: "ladyfinger biscuits", quantity: 30, unit: "pieces", sortOrder: 4 },
      { name: "cocoa powder", quantity: 3, unit: "tbsp", notes: "unsweetened, for dusting", sortOrder: 5 },
      { name: "vanilla extract", quantity: 1, unit: "tsp", sortOrder: 6 },
    ],
    steps: [
      { stepNumber: 1, title: "Make the cream", description: "Beat egg yolks and sugar until pale and tripled in volume. Fold in mascarpone. In a separate bowl, whip egg whites to stiff peaks. Gently fold into mascarpone mixture.", duration: 15 },
      { stepNumber: 2, title: "Soak ladyfingers", description: "Quickly dip each ladyfinger in cold espresso for 1 second per side. Line the bottom of a 23x33cm dish.", duration: 8 },
      { stepNumber: 3, title: "Layer", description: "Spread half the mascarpone cream over the ladyfingers. Repeat with a second layer of soaked biscuits and remaining cream.", duration: 8 },
      { stepNumber: 4, description: "Dust the top generously with cocoa powder. Cover and refrigerate at least 4 hours, preferably overnight.", duration: 5 },
    ],
  },
  {
    title: "Shakshuka",
    description:
      "Eggs poached in a spiced tomato and pepper sauce. A North African and Middle Eastern classic that's equally perfect for breakfast, brunch, or dinner.",
    difficulty: Difficulty.EASY,
    prepTime: 10,
    cookTime: 25,
    servings: 3,
    calories: 280,
    coverImage:
      "https://images.unsplash.com/photo-1510693206972-df098062cb71?w=800&q=80",
    authorUsername: "priya_spices",
    tagNames: ["Mediterranean", "Breakfast", "Brunch", "Vegetarian", "Gluten-Free", "Budget-Friendly"],
    ingredients: [
      { name: "eggs", quantity: 6, unit: "large", sortOrder: 0 },
      { name: "tomato", quantity: 400, unit: "g", notes: "canned crushed", sortOrder: 1 },
      { name: "bell pepper", quantity: 1, unit: "large", notes: "diced", sortOrder: 2 },
      { name: "onion", quantity: 1, unit: "medium", notes: "diced", sortOrder: 3 },
      { name: "garlic", quantity: 4, unit: "cloves", notes: "minced", sortOrder: 4 },
      { name: "cumin", quantity: 1, unit: "tsp", sortOrder: 5 },
      { name: "paprika", quantity: 1, unit: "tsp", notes: "sweet", sortOrder: 6 },
      { name: "cayenne pepper", quantity: 0.25, unit: "tsp", sortOrder: 7 },
      { name: "feta cheese", quantity: 80, unit: "g", notes: "crumbled, optional", sortOrder: 8 },
    ],
    steps: [
      { stepNumber: 1, description: "Heat olive oil in a wide skillet over medium heat. Cook onion and pepper until soft, 8 minutes.", duration: 8 },
      { stepNumber: 2, description: "Add garlic, cumin, paprika, and cayenne, cook 1 minute. Add tomatoes and simmer 10 minutes until sauce thickens. Season well.", duration: 12 },
      { stepNumber: 3, title: "Add the eggs", description: "Make 6 wells in the sauce. Crack an egg into each well. Cover and cook over low heat until whites are set but yolks are still runny, about 5 minutes.", duration: 6 },
      { stepNumber: 4, description: "Crumble feta over the top. Scatter parsley and serve hot from the pan with crusty bread.", duration: 1 },
    ],
  },
  {
    title: "Korean Beef Bulgogi",
    description:
      "Tender marinated beef strips that caramelise beautifully when grilled. The marinade of soy, pear, and sesame creates incredible depth of flavour.",
    difficulty: Difficulty.MEDIUM,
    prepTime: 20,
    cookTime: 10,
    servings: 4,
    calories: 480,
    coverImage:
      "https://images.unsplash.com/photo-1558030137-a56c1b004fa6?w=800&q=80",
    authorUsername: "julia_cooks",
    tagNames: ["Korean", "Asian", "Dinner", "High-Protein", "Grilled"],
    ingredients: [
      { name: "beef sirloin", quantity: 600, unit: "g", notes: "very thinly sliced", sortOrder: 0 },
      { name: "soy sauce", quantity: 4, unit: "tbsp", sortOrder: 1 },
      { name: "sugar", quantity: 2, unit: "tbsp", sortOrder: 2 },
      { name: "sesame oil", quantity: 2, unit: "tbsp", sortOrder: 3 },
      { name: "garlic", quantity: 4, unit: "cloves", notes: "minced", sortOrder: 4 },
      { name: "ginger", quantity: 1, unit: "tsp", notes: "grated", sortOrder: 5 },
      { name: "scallions", quantity: 3, unit: "stalks", notes: "finely sliced", sortOrder: 6 },
      { name: "red pepper flakes", quantity: 1, unit: "tsp", sortOrder: 7 },
    ],
    steps: [
      { stepNumber: 1, title: "Marinade", description: "Combine soy sauce, sugar, sesame oil, garlic, ginger, and chili flakes. Toss sliced beef in the marinade. Marinate at least 30 minutes.", duration: 35 },
      { stepNumber: 2, description: "Grill or sear beef over very high heat in batches. Cook 1–2 minutes per side until charred edges and caramelised. Don't crowd the pan.", duration: 8 },
      { stepNumber: 3, description: "Serve with steamed rice, kimchi, and lettuce leaves for wrapping. Garnish with scallions and sesame seeds.", duration: 2 },
    ],
  },
  {
    title: "Homemade Hummus",
    description:
      "Smooth, creamy hummus made from scratch. The blending technique with ice water creates an impossibly light texture. Infinitely better than store-bought.",
    difficulty: Difficulty.EASY,
    prepTime: 15,
    cookTime: 0,
    servings: 8,
    calories: 160,
    coverImage:
      "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=800&q=80",
    authorUsername: "emma_eats",
    tagNames: ["Mediterranean", "Snack", "Vegan", "Gluten-Free", "Dairy-Free", "Quick (< 30 min)", "Budget-Friendly", "Meal-Prep"],
    ingredients: [
      { name: "chickpeas", quantity: 400, unit: "g", notes: "canned, drained (reserve liquid)", sortOrder: 0 },
      { name: "tahini", quantity: 4, unit: "tbsp", notes: "good quality", sortOrder: 1 },
      { name: "lemon", quantity: 1, unit: "juice of", sortOrder: 2 },
      { name: "garlic", quantity: 1, unit: "clove", sortOrder: 3 },
      { name: "olive oil", quantity: 2, unit: "tbsp", notes: "plus more for serving", sortOrder: 4 },
      { name: "salt", quantity: 0.5, unit: "tsp", sortOrder: 5 },
      { name: "cumin", quantity: 0.5, unit: "tsp", sortOrder: 6 },
    ],
    steps: [
      { stepNumber: 1, description: "Remove skins from chickpeas by rubbing between your hands and rinsing. This makes the hummus much smoother.", duration: 5 },
      { stepNumber: 2, description: "In a blender, process garlic and lemon juice first. Add tahini and blend 1 minute until airy.", duration: 3 },
      { stepNumber: 3, description: "Add chickpeas, cumin, salt, and 2–3 tbsp ice water. Blend 3–4 minutes until perfectly smooth. Adjust seasoning.", duration: 5 },
      { stepNumber: 4, description: "Spread into a bowl, creating a swirl. Drizzle with olive oil, dust with paprika. Serve with warm pita.", duration: 2 },
    ],
  },
  {
    title: "Mango Overnight Oats",
    description:
      "Creamy, no-cook oats that are ready when you wake up. Loaded with tropical mango and coconut milk, naturally sweetened, and completely vegan.",
    difficulty: Difficulty.EASY,
    prepTime: 10,
    cookTime: 0,
    servings: 2,
    calories: 330,
    coverImage:
      "https://images.unsplash.com/photo-1517673132405-a56a62b18caf?w=800&q=80",
    authorUsername: "emma_eats",
    tagNames: ["Breakfast", "Vegan", "Dairy-Free", "Gluten-Free", "Meal-Prep", "Budget-Friendly"],
    ingredients: [
      { name: "rolled oats", quantity: 160, unit: "g", sortOrder: 0 },
      { name: "coconut milk", quantity: 250, unit: "ml", sortOrder: 1 },
      { name: "honey", quantity: 2, unit: "tbsp", notes: "or maple syrup", sortOrder: 2 },
      { name: "vanilla extract", quantity: 0.5, unit: "tsp", sortOrder: 3 },
      { name: "lime", quantity: 0.5, unit: "juice of", sortOrder: 4 },
    ],
    steps: [
      { stepNumber: 1, description: "In two jars, combine oats, coconut milk, honey, vanilla, and a pinch of salt. Stir well.", duration: 3 },
      { stepNumber: 2, description: "Top with diced fresh mango. Cover and refrigerate overnight, or at least 6 hours.", duration: 2 },
      { stepNumber: 3, description: "In the morning, give it a stir. Add more coconut milk if too thick. Top with more fresh mango, coconut flakes, and lime juice.", duration: 2 },
    ],
  },
  {
    title: "Vegetable Quinoa Power Bowl",
    description:
      "A nourishing bowl packed with protein-rich quinoa, roasted vegetables, and a zesty lemon-tahini dressing. Meal-prep friendly and endlessly customisable.",
    difficulty: Difficulty.EASY,
    prepTime: 15,
    cookTime: 25,
    servings: 4,
    calories: 390,
    coverImage:
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80",
    authorUsername: "emma_eats",
    tagNames: ["Lunch", "Vegan", "Gluten-Free", "Dairy-Free", "Meal-Prep", "High-Protein"],
    ingredients: [
      { name: "quinoa", quantity: 200, unit: "g", notes: "rinsed", sortOrder: 0 },
      { name: "broccoli", quantity: 300, unit: "g", notes: "florets", sortOrder: 1 },
      { name: "cherry tomatoes", quantity: 200, unit: "g", sortOrder: 2 },
      { name: "baby spinach", quantity: 100, unit: "g", sortOrder: 3 },
      { name: "chickpeas", quantity: 400, unit: "g", notes: "canned, drained", sortOrder: 4 },
      { name: "tahini", quantity: 3, unit: "tbsp", groupName: "Dressing", sortOrder: 5 },
      { name: "lemon", quantity: 1, unit: "juice of", groupName: "Dressing", sortOrder: 6 },
      { name: "garlic", quantity: 1, unit: "clove", notes: "minced", groupName: "Dressing", sortOrder: 7 },
      { name: "olive oil", quantity: 3, unit: "tbsp", sortOrder: 8 },
    ],
    steps: [
      { stepNumber: 1, description: "Cook quinoa in 400ml salted water. Bring to boil, reduce, cover, cook 15 minutes. Rest 5 minutes, fluff with a fork.", duration: 20 },
      { stepNumber: 2, description: "Toss broccoli and chickpeas in olive oil, salt, and cumin. Roast at 200°C for 20–25 minutes until golden.", duration: 25 },
      { stepNumber: 3, title: "Make the dressing", description: "Whisk tahini, lemon juice, garlic, and 3–4 tbsp cold water until creamy. Season with salt.", duration: 3 },
      { stepNumber: 4, description: "Assemble bowls: quinoa base, roasted veg, cherry tomatoes, spinach. Drizzle generously with tahini dressing.", duration: 3 },
    ],
  },
  {
    title: "Cheesecake with Berry Compote",
    description:
      "A classic New York-style baked cheesecake with a buttery graham cracker crust. Dense, creamy, and tangy — served with a vibrant berry compote.",
    difficulty: Difficulty.HARD,
    prepTime: 30,
    cookTime: 70,
    servings: 10,
    calories: 510,
    coverImage:
      "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=800&q=80",
    authorUsername: "sam_bakes",
    tagNames: ["Dessert", "Baked", "Vegetarian", "Holiday", "Party"],
    ingredients: [
      { name: "cream cheese", quantity: 800, unit: "g", notes: "full-fat, room temperature", sortOrder: 0 },
      { name: "sugar", quantity: 200, unit: "g", sortOrder: 1 },
      { name: "eggs", quantity: 4, unit: "large", notes: "room temperature", sortOrder: 2 },
      { name: "heavy cream", quantity: 200, unit: "ml", sortOrder: 3 },
      { name: "vanilla extract", quantity: 2, unit: "tsp", sortOrder: 4 },
      { name: "lemon", quantity: 1, unit: "zest and juice", sortOrder: 5 },
      { name: "all-purpose flour", quantity: 2, unit: "tbsp", sortOrder: 6 },
      { name: "butter", quantity: 100, unit: "g", notes: "melted", groupName: "Base", sortOrder: 7 },
    ],
    steps: [
      { stepNumber: 1, title: "Make the crust", description: "Mix 200g crushed graham crackers with melted butter. Press into the bottom of a lined 23cm springform tin. Refrigerate 20 minutes.", duration: 25 },
      { stepNumber: 2, title: "Make the filling", description: "Beat cream cheese and sugar until smooth. Add eggs one at a time. Mix in cream, vanilla, lemon, and flour on low speed. Don't overbeat.", duration: 10 },
      { stepNumber: 3, title: "Bake in water bath", description: "Wrap the base of the tin in foil. Pour filling in. Place in a roasting dish with 2cm of hot water. Bake at 160°C for 60–70 minutes until just set with a slight wobble.", duration: 70 },
      { stepNumber: 4, description: "Turn off oven, crack door, leave cake inside for 1 hour. Refrigerate overnight. Serve with warm berry compote.", duration: 5 },
    ],
  },
  {
    title: "Buffalo Chicken Wings",
    description:
      "Crispy baked (not fried!) chicken wings tossed in a fiery Frank's RedHot butter sauce. Perfectly sticky, spicy, and satisfying.",
    difficulty: Difficulty.MEDIUM,
    prepTime: 15,
    cookTime: 50,
    servings: 4,
    calories: 460,
    coverImage:
      "https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=800&q=80",
    authorUsername: "johndoe",
    tagNames: ["American", "Snack", "Dinner", "Party", "High-Protein", "Baked"],
    ingredients: [
      { name: "chicken thighs", quantity: 1200, unit: "g", notes: "split wings", sortOrder: 0 },
      { name: "butter", quantity: 60, unit: "g", sortOrder: 1 },
      { name: "smoked paprika", quantity: 1, unit: "tsp", sortOrder: 2 },
      { name: "garlic", quantity: 2, unit: "cloves", notes: "minced", sortOrder: 3 },
      { name: "cayenne pepper", quantity: 0.5, unit: "tsp", sortOrder: 4 },
      { name: "salt", quantity: 1, unit: "tsp", sortOrder: 5 },
      { name: "black pepper", quantity: 0.5, unit: "tsp", sortOrder: 6 },
    ],
    steps: [
      { stepNumber: 1, description: "Pat wings completely dry. Toss with baking powder (1 tsp per 500g), salt, pepper, and smoked paprika. Arrange on a wire rack over a baking sheet.", duration: 10 },
      { stepNumber: 2, description: "Bake at 120°C for 30 minutes. Increase to 220°C and bake 20 more minutes, flipping halfway, until crispy and golden.", duration: 50 },
      { stepNumber: 3, title: "Make buffalo sauce", description: "Melt butter in a saucepan. Add hot sauce, garlic, and a pinch of cayenne. Stir and keep warm.", duration: 3 },
      { stepNumber: 4, description: "Toss hot wings in buffalo sauce. Serve immediately with blue cheese dip and celery sticks.", duration: 2 },
    ],
  },
  {
    title: "Spicy Vegetarian Chili",
    description:
      "A hearty, smoky chili packed with three kinds of beans, roasted peppers, and warming spices. Proof that meat-free chili can be deeply satisfying.",
    difficulty: Difficulty.EASY,
    prepTime: 15,
    cookTime: 40,
    servings: 6,
    calories: 350,
    coverImage:
      "https://images.unsplash.com/photo-1547592180-85f173990554?w=800&q=80",
    authorUsername: "emma_eats",
    tagNames: ["American", "Dinner", "Vegan", "Gluten-Free", "Dairy-Free", "Meal-Prep", "Budget-Friendly", "Slow-Cooker"],
    ingredients: [
      { name: "black beans", quantity: 400, unit: "g", notes: "canned, drained", sortOrder: 0 },
      { name: "chickpeas", quantity: 400, unit: "g", notes: "canned, drained", sortOrder: 1 },
      { name: "tomato sauce", quantity: 800, unit: "ml", sortOrder: 2 },
      { name: "bell pepper", quantity: 2, unit: "large", notes: "diced", sortOrder: 3 },
      { name: "onion", quantity: 1, unit: "large", notes: "diced", sortOrder: 4 },
      { name: "garlic", quantity: 4, unit: "cloves", notes: "minced", sortOrder: 5 },
      { name: "cumin", quantity: 2, unit: "tsp", sortOrder: 6 },
      { name: "chili powder", quantity: 2, unit: "tbsp", sortOrder: 7 },
      { name: "smoked paprika", quantity: 1, unit: "tsp", sortOrder: 8 },
    ],
    steps: [
      { stepNumber: 1, description: "Sauté onion and peppers in oil over medium heat until soft, 8 minutes. Add garlic, cumin, and chili powder, cook 1 minute.", duration: 10 },
      { stepNumber: 2, description: "Add tomato sauce and beans. Stir to combine. Bring to a boil.", duration: 5 },
      { stepNumber: 3, description: "Reduce heat and simmer uncovered 30 minutes, stirring occasionally, until thickened. Season with salt and lime juice.", duration: 30 },
      { stepNumber: 4, description: "Serve topped with sour cream (or vegan alternative), avocado, cilantro, and tortilla chips.", duration: 2 },
    ],
  },
  {
    title: "Lemon Garlic Shrimp Pasta",
    description:
      "Plump shrimp in a bright, garlicky lemon butter sauce tossed with linguine. A restaurant-quality meal on the table in 20 minutes.",
    difficulty: Difficulty.EASY,
    prepTime: 10,
    cookTime: 15,
    servings: 4,
    calories: 440,
    coverImage:
      "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=800&q=80",
    authorUsername: "johndoe",
    tagNames: ["Italian", "Dinner", "Quick (< 30 min)", "Weeknight"],
    ingredients: [
      { name: "shrimp", quantity: 400, unit: "g", notes: "peeled and deveined", sortOrder: 0 },
      { name: "penne pasta", quantity: 350, unit: "g", sortOrder: 1 },
      { name: "garlic", quantity: 5, unit: "cloves", notes: "thinly sliced", sortOrder: 2 },
      { name: "butter", quantity: 60, unit: "g", sortOrder: 3 },
      { name: "lemon", quantity: 2, unit: "juice and zest of", sortOrder: 4 },
      { name: "red pepper flakes", quantity: 0.5, unit: "tsp", sortOrder: 5 },
      { name: "parsley", quantity: 1, unit: "small bunch", notes: "chopped", sortOrder: 6 },
      { name: "dry white wine", quantity: 100, unit: "ml", sortOrder: 7 },
    ],
    steps: [
      { stepNumber: 1, description: "Cook pasta in well-salted boiling water. Reserve 200ml pasta water before draining.", duration: 10 },
      { stepNumber: 2, description: "Season shrimp with salt and red pepper flakes. Sear in butter in a large pan over high heat, 1 minute per side. Remove and set aside.", duration: 4 },
      { stepNumber: 3, description: "In the same pan, add garlic and cook 30 seconds. Deglaze with white wine. Add lemon juice and zest. Reduce 1 minute.", duration: 3 },
      { stepNumber: 4, description: "Toss pasta in the sauce with a splash of pasta water. Return shrimp. Finish with parsley and serve immediately.", duration: 2 },
    ],
  },
  {
    title: "Beef Stir-Fry with Vegetables",
    description:
      "Quick and flavourful Asian-style beef stir-fry with crisp vegetables in a savoury sauce. A healthy weeknight dinner ready in 20 minutes.",
    difficulty: Difficulty.EASY,
    prepTime: 15,
    cookTime: 10,
    servings: 4,
    calories: 380,
    coverImage:
      "https://images.unsplash.com/photo-1547592180-85f173990554?w=800&q=80",
    authorUsername: "julia_cooks",
    tagNames: ["Asian", "Dinner", "High-Protein", "Quick (< 30 min)", "Weeknight"],
    ingredients: [
      { name: "beef sirloin", quantity: 500, unit: "g", notes: "thinly sliced against the grain", sortOrder: 0 },
      { name: "broccoli", quantity: 300, unit: "g", notes: "florets", sortOrder: 1 },
      { name: "bell pepper", quantity: 2, unit: "medium", notes: "sliced", sortOrder: 2 },
      { name: "carrot", quantity: 2, unit: "medium", notes: "julienned", sortOrder: 3 },
      { name: "garlic", quantity: 3, unit: "cloves", notes: "minced", sortOrder: 4 },
      { name: "ginger", quantity: 1, unit: "tbsp", notes: "grated", sortOrder: 5 },
      { name: "soy sauce", quantity: 3, unit: "tbsp", sortOrder: 6 },
      { name: "sesame oil", quantity: 1, unit: "tbsp", sortOrder: 7 },
      { name: "honey", quantity: 1, unit: "tbsp", sortOrder: 8 },
      { name: "rice vinegar", quantity: 1, unit: "tbsp", sortOrder: 9 },
    ],
    steps: [
      { stepNumber: 1, title: "Make the sauce", description: "Whisk soy sauce, sesame oil, honey, rice vinegar, and a splash of water in a small bowl.", duration: 2 },
      { stepNumber: 2, description: "Heat a wok over maximum heat until smoking. Add beef in a single layer — don't move it for 1 minute. Stir-fry 1 more minute. Remove.", duration: 4 },
      { stepNumber: 3, description: "Add more oil to wok. Stir-fry garlic and ginger 30 seconds. Add broccoli and carrots, stir-fry 3 minutes. Add bell peppers and cook 1 more minute.", duration: 5 },
      { stepNumber: 4, description: "Return beef to wok. Pour sauce over. Toss everything together on high heat for 1 minute until sauce coats and caramelises. Serve with rice.", duration: 2 },
    ],
  },
];

// ─── Main seed function ───────────────────────────────────────────────────────

async function main() {
  console.log("🌱 Starting seed...");

  // --- Wipe existing data (in FK-safe order) ---
  await prisma.auditLog.deleteMany();
  await prisma.collectionRecipe.deleteMany();
  await prisma.collection.deleteMany();
  await prisma.recipeRating.deleteMany();
  await prisma.favorite.deleteMany();
  await prisma.recipeTag.deleteMany();
  await prisma.recipeIngredient.deleteMany();
  await prisma.recipeStep.deleteMany();
  await prisma.recipeImage.deleteMany();
  await prisma.recipe.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.ingredient.deleteMany();
  await prisma.subscription.deleteMany();
  await prisma.user.deleteMany();
  console.log("  ✓ Cleared existing data");

  // ── Tags ──────────────────────────────────────────────────────────────────
  const tagMap = new Map<string, string>(); // name → id
  for (const t of TAG_DEFS) {
    const tag = await prisma.tag.create({
      data: { name: t.name, slug: toSlug(t.name), category: t.category },
    });
    tagMap.set(t.name, tag.id);
  }
  console.log(`  ✓ Seeded ${TAG_DEFS.length} tags`);

  // ── Ingredients ───────────────────────────────────────────────────────────
  const ingredientMap = new Map<string, string>(); // name → id
  for (const ing of INGREDIENT_DEFS) {
    const ingredient = await prisma.ingredient.create({
      data: { name: ing.name, category: ing.category },
    });
    ingredientMap.set(ing.name, ingredient.id);
  }
  console.log(`  ✓ Seeded ${INGREDIENT_DEFS.length} ingredients`);

  // ── Users ─────────────────────────────────────────────────────────────────
  const userMap = new Map<string, string>(); // username → id
  for (const u of USER_DEFS) {
    const user = await prisma.user.create({
      data: {
        id: u.id,
        email: u.email,
        username: u.username,
        displayName: u.displayName,
        bio: u.bio,
        avatarUrl: u.avatarUrl,
        role: u.role,
        subscriptionTier: u.subscriptionTier,
      },
    });
    userMap.set(u.username, user.id);
  }
  console.log(`  ✓ Seeded ${USER_DEFS.length} users`);

  // ── Subscriptions for premium users ───────────────────────────────────────
  const now = new Date();
  const premiumUsers = USER_DEFS.filter(
    (u) => u.subscriptionTier === SubscriptionTier.PREMIUM,
  );
  for (const pu of premiumUsers) {
    await prisma.subscription.create({
      data: {
        userId: pu.id,
        stripeSubscriptionId: `sub_seed_${pu.username}`,
        stripePriceId: "price_seed_premium_monthly",
        status: "active",
        tier: SubscriptionTier.PREMIUM,
        currentPeriodStart: new Date(now.getFullYear(), now.getMonth(), 1),
        currentPeriodEnd: new Date(now.getFullYear(), now.getMonth() + 1, 1),
      },
    });
  }
  console.log(`  ✓ Seeded ${premiumUsers.length} subscriptions`);

  // ── Recipes ───────────────────────────────────────────────────────────────
  const recipeMap = new Map<string, string>(); // slug → id

  for (const def of RECIPE_DEFS) {
    const authorId = userMap.get(def.authorUsername);
    if (!authorId) {
      console.warn(`  ⚠ Author not found: ${def.authorUsername}`);
      continue;
    }

    const recipeSlug = toSlug(def.title);

    const resolvedIngredients = def.ingredients
      .map((ing) => {
        const ingredientId = ingredientMap.get(ing.name);
        if (!ingredientId) {
          console.warn(`  ⚠ Ingredient not found: "${ing.name}" in "${def.title}"`);
          return null;
        }
        return { ...ing, ingredientId };
      })
      .filter(Boolean) as (IngredientInput & { ingredientId: string })[];

    const recipe = await prisma.recipe.create({
      data: {
        title: def.title,
        slug: recipeSlug,
        description: def.description,
        difficulty: def.difficulty,
        prepTime: def.prepTime,
        cookTime: def.cookTime,
        servings: def.servings,
        calories: def.calories,
        coverImage: def.coverImage,
        isPublished: true,
        isPublic: true,
        authorId,
        ingredients: {
          create: resolvedIngredients.map((ing) => ({
            ingredientId: ing.ingredientId,
            quantity: ing.quantity,
            unit: ing.unit,
            notes: ing.notes ?? null,
            groupName: ing.groupName ?? null,
            sortOrder: ing.sortOrder ?? 0,
          })),
        },
        steps: {
          create: def.steps.map((s) => ({
            stepNumber: s.stepNumber,
            title: s.title ?? null,
            description: s.description,
            duration: s.duration ?? null,
          })),
        },
        tags: {
          create: def.tagNames
            .map((name) => tagMap.get(name))
            .filter(Boolean)
            .map((tagId) => ({ tagId: tagId! })),
        },
        images: {
          create: [{ url: def.coverImage, altText: def.title, sortOrder: 0 }],
        },
      },
    });

    recipeMap.set(recipeSlug, recipe.id);
  }

  const totalRecipes = recipeMap.size;
  console.log(`  ✓ Seeded ${totalRecipes} recipes`);

  // ── Favorites ─────────────────────────────────────────────────────────────
  const recipeIds = Array.from(recipeMap.values());

  const favoritePairs: { userId: string; recipeId: string }[] = [];
  for (const [username, userId] of userMap) {
    if (username === "admin") continue;
    const count = 4 + Math.floor(Math.random() * 5);
    const shuffled = [...recipeIds].sort(() => Math.random() - 0.5);
    for (let i = 0; i < Math.min(count, shuffled.length); i++) {
      favoritePairs.push({ userId, recipeId: shuffled[i] });
    }
  }

  const seenFav = new Set<string>();
  const uniqueFavs = favoritePairs.filter((f) => {
    const key = `${f.userId}:${f.recipeId}`;
    if (seenFav.has(key)) return false;
    seenFav.add(key);
    return true;
  });

  await prisma.favorite.createMany({ data: uniqueFavs });
  console.log(`  ✓ Seeded ${uniqueFavs.length} favorites`);

  // ── Ratings ───────────────────────────────────────────────────────────────
  const COMMENTS: Record<number, string[]> = {
    5: [
      "Absolutely incredible — made this three times already!",
      "Perfect recipe. My family loved every bite.",
      "This is now my go-to dish. 10/10 would make again.",
      "Outstanding. Better than any restaurant version.",
    ],
    4: [
      "Really good, just added a bit more salt to taste.",
      "Loved it! Slightly adjusted the cooking time.",
      "Great recipe, will definitely make again.",
      "Very flavourful, followed the instructions exactly.",
    ],
    3: [
      "Decent recipe but needed some tweaks for my taste.",
      "Good base, I added extra spice.",
      "Came out well but took longer than stated.",
    ],
  };

  const ratingPairs: { recipeId: string; userId: string; score: number; comment?: string }[] = [];

  for (const recipeId of recipeIds) {
    const raterIds = Array.from(userMap.values())
      .sort(() => Math.random() - 0.5)
      .slice(0, 3 + Math.floor(Math.random() * 4));

    for (const userId of raterIds) {
      const score = Math.random() < 0.5 ? 5 : Math.random() < 0.6 ? 4 : 3;
      const commentPool = COMMENTS[score];
      const comment = Math.random() < 0.7 ? commentPool[Math.floor(Math.random() * commentPool.length)] : undefined;
      ratingPairs.push({ recipeId, userId, score, comment });
    }
  }

  const seenRating = new Set<string>();
  const uniqueRatings = ratingPairs.filter((r) => {
    const key = `${r.recipeId}:${r.userId}`;
    if (seenRating.has(key)) return false;
    seenRating.add(key);
    return true;
  });

  for (const rating of uniqueRatings) {
    await prisma.recipeRating.create({ data: rating });
  }
  console.log(`  ✓ Seeded ${uniqueRatings.length} ratings`);

  // ── Collections ───────────────────────────────────────────────────────────
  const collectionDefs = [
    {
      username: "chef_marco",
      name: "Italian Classics",
      description: "My favourite traditional Italian recipes, perfected over 15 years.",
      isPublic: true,
      recipeSlugs: ["classic-spaghetti-carbonara", "margherita-pizza-napoletana", "mushroom-risotto", "classic-tiramisu"],
    },
    {
      username: "julia_cooks",
      name: "Asian Favourites",
      description: "The best Asian-inspired dishes in my collection.",
      isPublic: true,
      recipeSlugs: ["honey-soy-glazed-salmon", "thai-green-vegetable-curry", "pad-thai", "korean-beef-bulgogi", "beef-stir-fry-with-vegetables"],
    },
    {
      username: "emma_eats",
      name: "Vegan Every Day",
      description: "Proof that plant-based eating is delicious and satisfying.",
      isPublic: true,
      recipeSlugs: ["greek-salad-horiatiki", "homemade-hummus", "mango-overnight-oats", "spicy-vegetarian-chili", "vegetable-quinoa-power-bowl"],
    },
    {
      username: "johndoe",
      name: "Quick Weeknight Dinners",
      description: "My go-to recipes when I need dinner on the table fast.",
      isPublic: false,
      recipeSlugs: ["crispy-beef-tacos", "lemon-garlic-shrimp-pasta", "honey-soy-glazed-salmon"],
    },
    {
      username: "sam_bakes",
      name: "Bakes & Desserts",
      description: "Sweet treats for every occasion.",
      isPublic: true,
      recipeSlugs: ["chocolate-chip-cookies", "classic-tiramisu", "cheesecake-with-berry-compote", "fluffy-banana-pancakes"],
    },
    {
      username: "carlos_cocina",
      name: "Latin Flavours",
      description: "Authentic recipes with roots in Mexico and Latin America.",
      isPublic: true,
      recipeSlugs: ["crispy-beef-tacos", "shakshuka"],
    },
    {
      username: "priya_spices",
      name: "Spice Route",
      description: "Bold spiced dishes from South Asia and beyond.",
      isPublic: true,
      recipeSlugs: ["chicken-tikka-masala", "shakshuka", "thai-green-vegetable-curry"],
    },
  ];

  let totalCollectionRecipes = 0;
  for (const col of collectionDefs) {
    const ownerId = userMap.get(col.username);
    if (!ownerId) continue;

    const recipes = col.recipeSlugs
      .map((s, i) => {
        const recipeId = recipeMap.get(s);
        if (!recipeId) {
          console.warn(`  ⚠ Collection recipe not found: ${s}`);
          return null;
        }
        return { recipeId, sortOrder: i };
      })
      .filter(Boolean) as { recipeId: string; sortOrder: number }[];

    await prisma.collection.create({
      data: {
        name: col.name,
        description: col.description,
        isPublic: col.isPublic,
        ownerId,
        recipes: { create: recipes },
      },
    });
    totalCollectionRecipes += recipes.length;
  }
  console.log(`  ✓ Seeded ${collectionDefs.length} collections with ${totalCollectionRecipes} entries`);

  console.log(`
✅ Seed complete!

  Users          : ${USER_DEFS.length}
  Tags           : ${TAG_DEFS.length}
  Ingredients    : ${INGREDIENT_DEFS.length}
  Recipes        : ${totalRecipes}
  Favorites      : ${uniqueFavs.length}
  Ratings        : ${uniqueRatings.length}
  Collections    : ${collectionDefs.length}

Test accounts (Supabase auth required to log in as these users):
  admin@recipe4you.com      — ADMIN + PREMIUM
  chef.marco@example.com    — PREMIUM
  julia.cooks@example.com   — PREMIUM
  john.doe@example.com      — FREE
  emma.smith@example.com    — FREE
  carlos.rivera@example.com — FREE
  priya.sharma@example.com  — FREE
  sam.taylor@example.com    — FREE
`);
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
