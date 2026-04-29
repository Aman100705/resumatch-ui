import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        mono: ["var(--font-mono)", "monospace"],
        sans: ["var(--font-sans)", "sans-serif"],
      },
      colors: {
        // Deep space blues
        abyss: {
          950: "#050810",
          900: "#0b0f1a",
          850: "#0f1523",
          800: "#131a2c",
          700: "#1a2238",
          600: "#242d48",
          500: "#3a4560",
          400: "#5a6885",
          300: "#8b97b3",
          200: "#b4bdd1",
          100: "#d8dde9",
          50:  "#eef0f6",
        },
        // Electric cyan — the "scanner" color
        signal: {
          900: "#003831",
          700: "#006b5b",
          500: "#00b894",
          400: "#00e0b7",
          DEFAULT: "#00ffc6",
          300: "#47ffd3",
          200: "#9affe6",
          100: "#d1fff3",
        },
        // Status colors
        alert: {
          amber: "#ffb347",
          red:   "#ff5b6b",
        },
      },
      animation: {
        "scan-line": "scanLine 4s linear infinite",
        "pulse-ring": "pulseRing 2s ease-out infinite",
        "blink": "blink 1.2s step-end infinite",
        "marquee": "marquee 40s linear infinite",
        "fade-up": "fadeUp 0.6s ease-out forwards",
      },
      keyframes: {
        scanLine: {
          "0%":   { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100vh)" },
        },
        pulseRing: {
          "0%":   { transform: "scale(0.95)", opacity: "1" },
          "100%": { transform: "scale(1.6)", opacity: "0" },
        },
        blink: {
          "50%": { opacity: "0" },
        },
        marquee: {
          "0%":   { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        fadeUp: {
          "0%":   { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      backgroundImage: {
        "grid-faint":
          "linear-gradient(to right, rgba(0,255,198,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,255,198,0.04) 1px, transparent 1px)",
      },
    },
  },
  plugins: [],
};

export default config;
