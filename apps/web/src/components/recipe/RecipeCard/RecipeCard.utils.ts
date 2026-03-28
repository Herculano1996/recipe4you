import type { Difficulty } from "@recipe4you/types";

export function formatTotalTime(prepTime: number, cookTime: number): string {
  const total = prepTime + cookTime;
  if (total < 60) return `${total} min`;
  const h = Math.floor(total / 60);
  const m = total % 60;
  return m === 0 ? `${h}h` : `${h}h ${m}m`;
}

export function formatRating(rating: number): string {
  return rating.toFixed(1);
}

export function getDifficultyColor(difficulty: Difficulty): string {
  const map: Record<Difficulty, string> = {
    EASY: "#2D6A4F",
    MEDIUM: "#B7791F",
    HARD: "#C53030",
    EXPERT: "#6B21A8",
  };
  return map[difficulty];
}

export function getDifficultyLabel(difficulty: Difficulty): string {
  const map: Record<Difficulty, string> = {
    EASY: "Easy",
    MEDIUM: "Medium",
    HARD: "Hard",
    EXPERT: "Expert",
  };
  return map[difficulty];
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + "…";
}
