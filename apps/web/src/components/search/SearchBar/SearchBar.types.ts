export interface SearchBarProps {
  value?: string;
  onChange?: (value: string) => void;
  onSearch?: (value: string) => void;
  placeholder?: string;
  size?: "sm" | "md" | "lg";
  autoFocus?: boolean;
  showButton?: boolean;
}
