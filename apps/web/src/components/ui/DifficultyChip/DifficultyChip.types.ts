export type Difficulty = "EASY" | "MEDIUM" | "HARD" | "EXPERT";

export interface DifficultyChipProps {
  readonly difficulty: Difficulty;
  /** Absolutely positions the chip in the top-left corner (for card image overlays) */
  readonly overlay?: boolean;
}
