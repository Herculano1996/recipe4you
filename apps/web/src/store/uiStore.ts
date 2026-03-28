import { create } from "zustand";

interface UIState {
  sidebarOpen: boolean;
  colorMode: "light" | "dark" | "system";
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  setColorMode: (mode: "light" | "dark" | "system") => void;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: false,
  colorMode: "system",
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  setColorMode: (colorMode) => set({ colorMode }),
}));
