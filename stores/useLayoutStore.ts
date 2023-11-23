import { create } from "zustand";
import { devtools } from "zustand/middleware";

type LayoutStore = {
  isMenuOpen: boolean;
  isSmallScreen: boolean;
  toggleMenu: (open?: boolean) => void;
};

export const useLayoutStore = create(
  devtools<LayoutStore>(
    (set) => ({
      isMenuOpen: false,
      isSmallScreen: true,
      toggleMenu: (open) =>
        set((state) => ({
          isMenuOpen: open ?? !state.isMenuOpen,
        })),
    }),
    {
      name: "Layout Store",
    }
  )
);
