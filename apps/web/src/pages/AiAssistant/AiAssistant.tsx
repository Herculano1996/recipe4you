import AddIcon from "@mui/icons-material/Add";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import CloseIcon from "@mui/icons-material/Close";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import Paper from "@mui/material/Paper";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { api } from "../../lib/api.js";
import { PremiumGate } from "../../components/premium/PremiumGate/PremiumGate.js";
import { AppAlert } from "../../components/ui/index.js";
import {
  PageHeader,
  GradientText,
  AiIconBox,
  ResultCard,
  StepCircle,
  GenerateButton,
  AddButton,
} from "./AiAssistant.styled.js";
import type { GeneratedRecipe, WeeklyMealPlan } from "@recipe4you/types";

function RecipeGeneratorTab() {
  const [ingredientInput, setIngredientInput] = useState("");
  const [ingredients, setIngredients] = useState<string[]>([]);

  const { mutate, isPending, data, error, reset } = useMutation({
    mutationFn: () =>
      api.post<{ data: GeneratedRecipe }, { ingredients: string[] }>(
        "/ai/generate-recipe",
        { ingredients },
      ),
  });

  function addIngredient() {
    const val = ingredientInput.trim();
    if (val && !ingredients.includes(val)) {
      setIngredients((prev) => [...prev, val]);
    }
    setIngredientInput("");
    reset();
  }

  function removeIngredient(name: string) {
    setIngredients((prev) => prev.filter((i) => i !== name));
    reset();
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") {
      e.preventDefault();
      addIngredient();
    }
  }

  const recipe = data?.data;

  return (
    <Box>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
        Enter the ingredients you have and Claude will create a recipe for you.
      </Typography>

      <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
        <TextField
          fullWidth
          size="small"
          placeholder="e.g. chicken, garlic, lemon..."
          value={ingredientInput}
          onChange={(e) => setIngredientInput(e.target.value)}
          onKeyDown={handleKeyDown}
          slotProps={{ htmlInput: { "aria-label": "Add ingredient" } }}
        />
        <AddButton
          variant="outlined"
          onClick={addIngredient}
          startIcon={<AddIcon />}
        >
          Add
        </AddButton>
      </Box>

      {ingredients.length > 0 && (
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 3 }}>
          {ingredients.map((ing) => (
            <Chip
              key={ing}
              label={ing}
              onDelete={() => removeIngredient(ing)}
              deleteIcon={<CloseIcon />}
              size="small"
              sx={{ borderRadius: 2 }}
            />
          ))}
        </Box>
      )}

      <GenerateButton
        variant="contained"
        disableElevation
        disabled={ingredients.length === 0 || isPending}
        onClick={() => mutate()}
        startIcon={
          isPending ? (
            <CircularProgress size={18} sx={{ color: "#fff" }} />
          ) : (
            <AutoAwesomeIcon />
          )
        }
      >
        {isPending ? "Generating..." : "Generate Recipe"}
      </GenerateButton>

      {error && (
        <AppAlert severity="error" sx={{ mt: 2 }}>
          Something went wrong. Please try again.
        </AppAlert>
      )}

      {recipe && (
        <ResultCard elevation={0}>
          <Typography variant="h5" fontWeight={800} gutterBottom>
            {recipe.title}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {recipe.description}
          </Typography>

          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 3 }}>
            <Chip
              label={`${recipe.prepTime + recipe.cookTime} min`}
              size="small"
              icon={<RestaurantIcon />}
            />
            <Chip label={`${recipe.servings} servings`} size="small" />
            <Chip label={recipe.difficulty} size="small" />
            {recipe.estimatedCalories && (
              <Chip label={`~${recipe.estimatedCalories} kcal`} size="small" />
            )}
          </Box>

          <Typography variant="subtitle1" fontWeight={700} gutterBottom>
            Ingredients
          </Typography>
          <Box component="ul" sx={{ pl: 2, mb: 2 }}>
            {recipe.ingredients.map((ing, i) => (
              <li key={i}>
                <Typography variant="body2">
                  {ing.quantity} {ing.unit} {ing.name}
                  {ing.notes ? ` (${ing.notes})` : ""}
                </Typography>
              </li>
            ))}
          </Box>

          <Divider sx={{ my: 2 }} />

          <Typography variant="subtitle1" fontWeight={700} gutterBottom>
            Instructions
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
            {recipe.steps.map((step) => (
              <Box
                key={step.stepNumber}
                sx={{ display: "flex", gap: 1.5, alignItems: "flex-start" }}
              >
                <StepCircle>{step.stepNumber}</StepCircle>
                <Typography variant="body2" sx={{ pt: 0.5, lineHeight: 1.7 }}>
                  {step.description}
                </Typography>
              </Box>
            ))}
          </Box>
        </ResultCard>
      )}
    </Box>
  );
}

function MealPlannerTab() {
  const [goal, setGoal] = useState("");

  const { mutate, isPending, data, error } = useMutation({
    mutationFn: () =>
      api.post<{ data: WeeklyMealPlan }, { goal: string }>("/ai/meal-plan", {
        goal,
      }),
  });

  const plan = data?.data;

  return (
    <Box>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
        Describe your nutrition goal and Claude will plan your whole week.
      </Typography>

      <TextField
        fullWidth
        placeholder="e.g. Lose weight with high-protein meals under 1800 kcal/day"
        value={goal}
        onChange={(e) => setGoal(e.target.value)}
        multiline
        rows={2}
        sx={{ mb: 2 }}
      />

      <GenerateButton
        variant="contained"
        disableElevation
        disabled={!goal.trim() || isPending}
        onClick={() => mutate()}
        startIcon={
          isPending ? (
            <CircularProgress size={18} sx={{ color: "#fff" }} />
          ) : (
            <AutoAwesomeIcon />
          )
        }
      >
        {isPending ? "Planning..." : "Generate Meal Plan"}
      </GenerateButton>

      {error && (
        <AppAlert severity="error" sx={{ mt: 2 }}>
          Something went wrong. Please try again.
        </AppAlert>
      )}

      {plan && (
        <ResultCard elevation={0}>
          <Typography variant="h6" fontWeight={700} gutterBottom>
            Your 7-Day Plan — {plan.totalDailyCalories} kcal/day
          </Typography>
          {plan.days.map((day) => (
            <Box key={day.day} sx={{ mb: 2 }}>
              <Typography
                variant="subtitle2"
                fontWeight={700}
                sx={{ color: "#ff6b35", mb: 0.5 }}
              >
                {day.day}
              </Typography>
              {[
                { label: "Breakfast", slot: day.breakfast },
                { label: "Lunch", slot: day.lunch },
                { label: "Dinner", slot: day.dinner },
              ].map(({ label, slot }) => (
                <Box key={label} sx={{ pl: 1.5, mb: 0.5 }}>
                  <Typography variant="body2">
                    <strong>{label}:</strong> {slot.title} —{" "}
                    {slot.estimatedCalories} kcal
                  </Typography>
                </Box>
              ))}
              <Divider sx={{ mt: 1.5 }} />
            </Box>
          ))}
        </ResultCard>
      )}
    </Box>
  );
}

export default function AiAssistantPage() {
  const [tab, setTab] = useState(0);

  return (
    <Container maxWidth="md">
      <PageHeader>
        <AiIconBox>
          <AutoAwesomeIcon sx={{ color: "#fff", fontSize: 28 }} />
        </AiIconBox>
        <Typography
          variant="h3"
          fontWeight={800}
          letterSpacing="-0.5px"
          gutterBottom
        >
          AI <GradientText>Assistant</GradientText>
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Powered by Claude — your personal culinary AI.
        </Typography>
      </PageHeader>

      <PremiumGate
        featureName="AI Assistant"
        description="Unlock recipe generation, meal planning, and more with Premium."
      >
        <Paper
          elevation={0}
          sx={{
            borderRadius: 4,
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.08)",
            overflow: "hidden",
            mb: 6,
          }}
        >
          <Tabs
            value={tab}
            onChange={(_, v: number) => setTab(v)}
            sx={{ borderBottom: "1px solid rgba(255,255,255,0.08)", px: 2 }}
          >
            <Tab
              label="Recipe Generator"
              icon={<AutoAwesomeIcon fontSize="small" />}
              iconPosition="start"
              sx={{ textTransform: "none", fontWeight: 600 }}
            />
            <Tab
              label="Meal Planner"
              icon={<RestaurantIcon fontSize="small" />}
              iconPosition="start"
              sx={{ textTransform: "none", fontWeight: 600 }}
            />
          </Tabs>

          <Box sx={{ p: 3 }}>
            {tab === 0 && <RecipeGeneratorTab />}
            {tab === 1 && <MealPlannerTab />}
          </Box>
        </Paper>
      </PremiumGate>
    </Container>
  );
}
