import { colors } from "./src/styles/tokens/colors.ts";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: colors.primary,
        },
        secondary: {
          DEFAULT: colors.secondary,
        },
        accent: {
          DEFAULT: colors.accent,
        },
        neutral: colors.neutral, 
      },
      textColor: {
        main: colors.text.main,
        muted: colors.text.muted,
        disabled: colors.text.disabled,
      }
    },
  },
  plugins: [],
};
