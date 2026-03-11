import { colors } from "./src/styles/generated/colors"

export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],

  theme: {
    extend: {
      colors
    }
  },

  plugins: [],
}