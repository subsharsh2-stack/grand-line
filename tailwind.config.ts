import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        // Grand Line Brand Colors
        gold: {
          50:  "#fffbeb",
          100: "#fef3c7",
          200: "#fde68a",
          300: "#fcd34d",
          400: "#fbbf24",
          500: "#f5a623",
          600: "#d97706",
          700: "#b45309",
          800: "#92400e",
          900: "#78350f",
        },
        ocean: {
          50:  "#f0f9ff",
          100: "#e0f2fe",
          200: "#bae6fd",
          300: "#7dd3fc",
          400: "#38bdf8",
          500: "#0ea5e9",
          600: "#0284c7",
          700: "#0369a1",
          800: "#075985",
          900: "#0c4a6e",
          950: "#082f49",
        },
        void: {
          50:  "#f8fafc",
          100: "#f1f5f9",
          200: "#e2e8f0",
          300: "#cbd5e1",
          400: "#94a3b8",
          500: "#64748b",
          600: "#475569",
          700: "#334155",
          800: "#1e293b",
          900: "#0f172a",
          950: "#080c14",
        },
        // Status colors
        "devil-fruit": "#c084fc",
        "haki": "#34d399",
        "marine": "#60a5fa",
        "pirate": "#f87171",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-cinzel)", "serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      backgroundImage: {
        "grand-line": "radial-gradient(ellipse at top, #0c4a6e 0%, #080c14 50%, #0a0e1a 100%)",
        "gold-shine": "linear-gradient(135deg, #f5a623 0%, #fcd34d 50%, #f5a623 100%)",
        "ocean-depth": "linear-gradient(180deg, #082f49 0%, #080c14 100%)",
        "wanted-poster": "linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)",
      },
      animation: {
        "float": "float 6s ease-in-out infinite",
        "glow-pulse": "glowPulse 2s ease-in-out infinite",
        "bounty-rise": "bountyRise 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
        "shimmer": "shimmer 2s linear infinite",
        "shake": "shake 0.5s cubic-bezier(.36,.07,.19,.97) both",
        "spin-slow": "spin 8s linear infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        glowPulse: {
          "0%, 100%": { boxShadow: "0 0 15px rgba(245,166,35,0.3)" },
          "50%": { boxShadow: "0 0 30px rgba(245,166,35,0.7)" },
        },
        bountyRise: {
          "0%": { transform: "scale(0) translateY(20px)", opacity: "0" },
          "100%": { transform: "scale(1) translateY(0)", opacity: "1" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        shake: {
          "10%, 90%": { transform: "translate3d(-1px, 0, 0)" },
          "20%, 80%": { transform: "translate3d(2px, 0, 0)" },
          "30%, 50%, 70%": { transform: "translate3d(-4px, 0, 0)" },
          "40%, 60%": { transform: "translate3d(4px, 0, 0)" },
        },
      },
      boxShadow: {
        "gold-glow": "0 0 20px rgba(245, 166, 35, 0.4)",
        "gold-glow-lg": "0 0 40px rgba(245, 166, 35, 0.6)",
        "ocean-glow": "0 0 20px rgba(14, 165, 233, 0.4)",
        "devil-glow": "0 0 20px rgba(192, 132, 252, 0.4)",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};

export default config;
