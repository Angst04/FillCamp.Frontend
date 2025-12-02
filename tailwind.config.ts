import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "var(--color-primary)",
        secondary: "var(--color-secondary)",
        background: {
          DEFAULT: "var(--color-background)",
          dark: "var(--color-background-dark)",
        },
        surface: {
          DEFAULT: "var(--color-surface)",
          light: "var(--color-surface-light)",
          lighter: "var(--color-surface-lighter)",
        },
        foreground: "var(--color-foreground)",
        "text-gray": "var(--color-text-gray)",
        border: "var(--color-border)",
      },
      fontFamily: {
        heading: "var(--font-heading)",
        body: "var(--font-body)",
      },
    },
  },
  plugins: [],
};

export default config;

