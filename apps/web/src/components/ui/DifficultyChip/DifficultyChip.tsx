import { StyledChip } from "./DifficultyChip.styled.js";
import type { DifficultyChipProps } from "./DifficultyChip.types.js";

const COLOR_MAP = {
  EASY: "#2D6A4F",
  MEDIUM: "#B7791F",
  HARD: "#C53030",
  EXPERT: "#6B21A8",
};

const LABEL_MAP = {
  EASY: "Easy",
  MEDIUM: "Medium",
  HARD: "Hard",
  EXPERT: "Expert",
};

export function DifficultyChip({
  difficulty,
  overlay = false,
}: DifficultyChipProps) {
  return (
    <StyledChip
      $color={COLOR_MAP[difficulty]}
      $overlay={overlay}
      label={LABEL_MAP[difficulty]}
      size="small"
    />
  );
}
