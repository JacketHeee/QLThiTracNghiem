import { colors } from "./src/styles/tokens/colors.ts";
import { fontSize } from "./src/styles/tokens/typography.ts";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // ============================================
        // BRAND COLORS (không đổi theo theme)
        // ============================================
        primary: colors.primary,
        secondary: colors.secondary,
        error: colors.error,
        warning: colors.warning,
        info: colors.info,
        success: colors.success,
        grey: colors.grey,
        common: colors.common,

        // States colors
        states: colors.states,

        // Alert colors
        alert: colors.alert,

        // ============================================
        // SEMANTIC COLORS (tự động đổi theo theme)
        // ============================================

        // Text
        "text-primary": "var(--color-text-primary)",
        "text-secondary": "var(--color-text-secondary)",
        "text-disabled": "var(--color-text-disabled)",

        // Background
        body: "var(--color-bg-body)",
        paper: "var(--color-bg-paper)",
        "page-header": "var(--color-bg-page-header)",
        extra: "var(--color-bg-extra)",

        // Action
        "action-active": "var(--color-action-active)",
        "action-hover": "var(--color-action-hover)",
        "action-selected": "var(--color-action-selected)",
        "action-disabled": "var(--color-action-disabled)",
        "action-disabled-bg": "var(--color-action-disabled-bg)",
        "action-focus": "var(--color-action-focus)",

        // Border & Divider
        border: "var(--color-bg-border)",
        "border-outlined": "var(--color-outlined-border)",
        "border-input": "var(--color-input-border)",
        divider: "var(--color-divider)",

        // Other
        backdrop: "var(--color-backdrop)",
        tooltip: "var(--color-tooltip)",
        snackbar: "var(--color-snackbar)",
        chip: "var(--color-chip-bg)",
        "input-filled": "var(--color-filled-input-bg)",
        rating: "var(--color-rating-active)",
      },

      // ============================================
      // BOX SHADOWS (tự động đổi theo theme)
      // ============================================
      boxShadow: {
        sm: "var(--shadow-sm)",
        DEFAULT: "var(--shadow-sm)",
        md: "var(--shadow-md)",
        lg: "var(--shadow-lg)",
        xl: "var(--shadow-xl)",
        "2xl": "var(--shadow-2xl)",
      },

      // ============================================
      // TYPOGRAPHY
      // ============================================
      fontSize,
      fontFamily: {
        inter: ["Inter", "system-ui", "-apple-system", "sans-serif"],
      },

      // ============================================
      // GRID SYSTEM
      // ============================================
      gridTemplateColumns: {
        layout: "repeat(12, minmax(0, 1fr))",
      },
      gap: {
        gutter: "24px",
      },
    },
  },
  plugins: [],
};
