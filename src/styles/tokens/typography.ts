// Auto-generated from design-tokens/text.styles.tokens.json
// DO NOT EDIT MANUALLY

export const typography = {
  fontFamily: {
    inter: "Inter, system-ui, -apple-system, sans-serif",
  },

  // Headings
  h1: {
    fontSize: "96px",
    fontWeight: 500,
    letterSpacing: "-1.5px",
    lineHeight: "112.03px",
  },
  h2: {
    fontSize: "60px",
    fontWeight: 500,
    letterSpacing: "-0.5px",
    lineHeight: "72px",
  },
  h3: {
    fontSize: "48px",
    fontWeight: 500,
    letterSpacing: "0px",
    lineHeight: "56px",
  },
  h4: {
    fontSize: "32px",
    fontWeight: 500,
    letterSpacing: "0.25px",
    lineHeight: "40px",
  },
  h5: {
    fontSize: "24px",
    fontWeight: 500,
    letterSpacing: "0px",
    lineHeight: "133.4%",
  },
  h6: {
    fontSize: "20px",
    fontWeight: 500,
    letterSpacing: "0.15px",
    lineHeight: "32px",
  },

  // Body text
  body1: {
    fontSize: "16px",
    fontWeight: 400,
    letterSpacing: "0.15px",
    lineHeight: "24px",
  },
  body1Semibold: {
    fontSize: "16px",
    fontWeight: 600,
    letterSpacing: "0.15px",
    lineHeight: "24px",
  },
  body2: {
    fontSize: "14px",
    fontWeight: 400,
    letterSpacing: "0.15px",
    lineHeight: "20px",
  },
  body2Semibold: {
    fontSize: "14px",
    fontWeight: 600,
    letterSpacing: "0.15px",
    lineHeight: "20px",
  },

  // Subtitles
  subtitle1: {
    fontSize: "16px",
    fontWeight: 400,
    letterSpacing: "0.15px",
    lineHeight: "175%",
  },
  subtitle2: {
    fontSize: "14px",
    fontWeight: 500,
    letterSpacing: "0.1px",
    lineHeight: "157%",
  },

  // Others
  overline: {
    fontSize: "12px",
    fontWeight: 400,
    letterSpacing: "1px",
    lineHeight: "15px",
    textTransform: "uppercase" as const,
  },
  caption: {
    fontSize: "12px",
    fontWeight: 400,
    letterSpacing: "0.4px",
    lineHeight: "15px",
  },
  toast: {
    fontSize: "16px",
    fontWeight: 400,
    letterSpacing: "0.14px",
    lineHeight: "21px",
  },
};

// Component typography
export const componentTypography = {
  buttonLg: {
    fontSize: "15px",
    fontWeight: 500,
    letterSpacing: "0.46px",
    lineHeight: "26px",
    textTransform: "uppercase" as const,
  },
  buttonMd: {
    fontSize: "14px",
    fontWeight: 500,
    letterSpacing: "0.4px",
    lineHeight: "24px",
    textTransform: "uppercase" as const,
  },
  buttonSm: {
    fontSize: "13px",
    fontWeight: 500,
    letterSpacing: "0.46px",
    lineHeight: "22px",
    textTransform: "uppercase" as const,
  },
  inputLabel: {
    fontSize: "12px",
    fontWeight: 400,
    letterSpacing: "0.15px",
    lineHeight: "12px",
  },
  inputText: {
    fontSize: "16px",
    fontWeight: 400,
    letterSpacing: "0.15px",
    lineHeight: "24px",
  },
  helperText: {
    fontSize: "12px",
    fontWeight: 400,
    letterSpacing: "0.4px",
    lineHeight: "20px",
  },
  chip: {
    fontSize: "13px",
    fontWeight: 400,
    letterSpacing: "0.16px",
    lineHeight: "18px",
  },
  tooltip: {
    fontSize: "11px",
    fontWeight: 500,
    letterSpacing: "0px",
    lineHeight: "16px",
  },
  alertTitle: {
    fontSize: "16px",
    fontWeight: 500,
    letterSpacing: "0.15px",
    lineHeight: "150%",
  },
  tableHeader: {
    fontSize: "12px",
    fontWeight: 500,
    letterSpacing: "0.17px",
    lineHeight: "24px",
    textTransform: "uppercase" as const,
  },
  badgeLabel: {
    fontSize: "12px",
    fontWeight: 500,
    letterSpacing: "0.14px",
    lineHeight: "20px",
  },
  avatarInitials: {
    fontSize: "18px",
    fontWeight: 400,
    letterSpacing: "0.14px",
    lineHeight: "20px",
  },
};

// Tailwind-compatible font sizes
export const fontSize = {
  // Typography
  h1: [
    "96px",
    { lineHeight: "112px", letterSpacing: "-1.5px", fontWeight: "500" },
  ],
  h2: [
    "60px",
    { lineHeight: "72px", letterSpacing: "-0.5px", fontWeight: "500" },
  ],
  h3: ["48px", { lineHeight: "56px", letterSpacing: "0px", fontWeight: "500" }],
  h4: [
    "32px",
    { lineHeight: "40px", letterSpacing: "0.25px", fontWeight: "500" },
  ],
  h5: [
    "24px",
    { lineHeight: "1.334", letterSpacing: "0px", fontWeight: "500" },
  ],
  h6: [
    "20px",
    { lineHeight: "32px", letterSpacing: "0.15px", fontWeight: "500" },
  ],
  body1: ["16px", { lineHeight: "24px", letterSpacing: "0.15px" }],
  body2: ["14px", { lineHeight: "20px", letterSpacing: "0.15px" }],
  subtitle1: ["16px", { lineHeight: "1.75", letterSpacing: "0.15px" }],
  subtitle2: [
    "14px",
    { lineHeight: "1.57", letterSpacing: "0.1px", fontWeight: "500" },
  ],
  caption: ["12px", { lineHeight: "15px", letterSpacing: "0.4px" }],
  overline: ["12px", { lineHeight: "15px", letterSpacing: "1px" }],

  // Components
  "btn-lg": [
    "15px",
    { lineHeight: "26px", letterSpacing: "0.46px", fontWeight: "500" },
  ],
  "btn-md": [
    "14px",
    { lineHeight: "24px", letterSpacing: "0.4px", fontWeight: "500" },
  ],
  "btn-sm": [
    "13px",
    { lineHeight: "22px", letterSpacing: "0.46px", fontWeight: "500" },
  ],
  "input-label": ["12px", { lineHeight: "12px", letterSpacing: "0.15px" }],
  "input-text": ["16px", { lineHeight: "24px", letterSpacing: "0.15px" }],
  "helper-text": ["12px", { lineHeight: "20px", letterSpacing: "0.4px" }],
  chip: ["13px", { lineHeight: "18px", letterSpacing: "0.16px" }],
  tooltip: [
    "11px",
    { lineHeight: "16px", letterSpacing: "0px", fontWeight: "500" },
  ],
  "alert-title": [
    "16px",
    { lineHeight: "1.5", letterSpacing: "0.15px", fontWeight: "500" },
  ],
  "table-header": [
    "12px",
    { lineHeight: "24px", letterSpacing: "0.17px", fontWeight: "500" },
  ],
  badge: [
    "12px",
    { lineHeight: "20px", letterSpacing: "0.14px", fontWeight: "500" },
  ],
} as const;
