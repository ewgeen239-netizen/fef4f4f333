import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Deep warm black bg, off-white text, brass accent
        ink: "#1a1714",
        "ink-soft": "#241f1b",
        bone: "#EDE9E3",
        "bone-dim": "#9a958c",
        brass: "#B8A88F",
        "brass-dim": "#8f8168",
      },
      fontFamily: {
        serif: ["var(--font-fraunces)", "Georgia", "serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      fontSize: {
        // Editorial display scale
        display: ["clamp(3rem, 9vw, 9rem)", { lineHeight: "0.95", letterSpacing: "-0.03em" }],
        headline: ["clamp(2rem, 5vw, 4.5rem)", { lineHeight: "1.0", letterSpacing: "-0.02em" }],
      },
      letterSpacing: {
        editorial: "0.18em",
      },
      transitionTimingFunction: {
        editorial: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
      screens: {
        xs: "480px",
      },
    },
  },
  plugins: [],
};

export default config;
