import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0a0a0d",
        panel: "#111114",
        accent: {
          DEFAULT: "#6c4cf5",
          light: "#8b6ff9",
          dark: "#4a2fd6",
        },
        muted: "#9a9aa4",
        line: "#26262c",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Helvetica", "Arial", "sans-serif"],
      },
      backgroundImage: {
        "accent-gradient": "linear-gradient(135deg, #4a2fd6 0%, #0a0a0d 100%)",
      },
      letterSpacing: {
        widest2: "0.2em",
      },
    },
  },
  plugins: [],
};
export default config;
