// Auto-generated from design-tokens/effect.styles.tokens.json
// DO NOT EDIT MANUALLY

export const shadows = {
  // Light mode elevations (1-24)
  light: {
    elevation1:
      "0px 1px 3px 0px #4c4e641f, 0px 1px 1px 0px #4c4e6424, 0px 2px 1px -1px #4c4e6433",
    elevation2:
      "0px 1px 5px 0px #4c4e641f, 0px 2px 2px 0px #4c4e6424, 0px 3px 1px -2px #4c4e6433",
    elevation3: "0px 4px 8px -4px #4c4e646b",
    elevation4: "0px 6px 18px -8px #4c4e648f",
    elevation5:
      "0px 1px 14px 0px #4c4e641f, 0px 5px 8px 0px #4c4e6424, 0px 3px 5px -1px #4c4e6433",
    elevation6: "0px 2px 10px 0px #4c4e6438",
    elevation7:
      "0px 2px 16px 1px #4c4e641f, 0px 7px 10px 1px #4c4e6424, 0px 4px 5px -2px #4c4e6433",
    elevation8:
      "0px 3px 14px 2px #4c4e641f, 0px 8px 10px 1px #4c4e6424, 0px 5px 5px -3px #4c4e6433",
    elevation9:
      "0px 3px 16px 2px #4c4e641f, 0px 9px 12px 1px #4c4e6424, 0px 5px 6px -3px #4c4e6433",
    elevation10:
      "0px 4px 18px 3px #4c4e641f, 0px 10px 14px 1px #4c4e6424, 0px 6px 6px -3px #4c4e6433",
  },

  // Dark mode elevations (1-24)
  dark: {
    elevation1:
      "0px 1px 3px 0px #1011211f, 0px 1px 1px 0px #10112124, 0px 2px 1px -1px #10112133",
    elevation2:
      "0px 1px 5px 0px #1011211f, 0px 2px 2px 0px #10112124, 0px 3px 1px -2px #10112133",
    elevation3: "0px 4px 8px -4px #1011216b",
    elevation4: "0px 6px 18px -8px #1011218f",
    elevation5:
      "0px 1px 14px 0px #1011211f, 0px 5px 8px 0px #10112124, 0px 3px 5px -1px #10112133",
    elevation6: "0px 2px 10px 0px #10112138",
    elevation7:
      "0px 2px 16px 1px #1011211f, 0px 7px 10px 1px #10112124, 0px 4px 5px -2px #10112133",
    elevation8:
      "0px 3px 14px 2px #1011211f, 0px 8px 10px 1px #10112124, 0px 5px 5px -3px #10112133",
    elevation9:
      "0px 3px 16px 2px #1011211f, 0px 9px 12px 1px #10112124, 0px 5px 6px -3px #10112133",
    elevation10:
      "0px 4px 18px 3px #1011211f, 0px 10px 14px 1px #10112124, 0px 6px 6px -3px #10112133",
  },
};

// Tailwind-compatible box shadows (sử dụng CSS variables để switch dark/light)
export const boxShadow = {
  sm: shadows.light.elevation1,
  DEFAULT: shadows.light.elevation2,
  md: shadows.light.elevation3,
  lg: shadows.light.elevation4,
  xl: shadows.light.elevation5,
  "2xl": shadows.light.elevation6,
  "3xl": shadows.light.elevation8,
  "4xl": shadows.light.elevation10,
};
