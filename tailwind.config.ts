import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        sans: ["var(--font-body)", "system-ui", "sans-serif"],
        serif: ["var(--font-serif)", "Georgia", "serif"],
      },
      colors: {
        ink: {
          DEFAULT: "#050B1A",
          900: "#050B1A",
          800: "#0A1430",
          700: "#0E1F44",
          600: "#16295A",
        },
        electric: {
          DEFAULT: "#2F6BFF",
          50: "#EEF3FF",
          100: "#DCE6FF",
          300: "#8DB0FF",
          400: "#5C8DFF",
          500: "#2F6BFF",
          600: "#1F55E6",
          700: "#1842B8",
        },
        glow: "#38BDF8",
        mist: "#F3F5FA",
        warm: { stone: "#F4F0EA", sand: "#EBE5DC", linen: "#FBF9F6" },
        border: "hsl(var(--border, 214.3 31.8% 91.4%))",
        input: "hsl(var(--input, 214.3 31.8% 91.4%))",
        ring: "hsl(var(--ring, 222.2 84% 4.9%))",
        background: "hsl(var(--background, 0 0% 100%))",
        foreground: "hsl(var(--foreground, 222.2 84% 4.9%))",
        primary: {
          DEFAULT: "var(--color-primary, #2F6BFF)",
          foreground: "#ffffff",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary, 210 40% 96.1%))",
          foreground: "hsl(var(--secondary-foreground, 222.2 47.4% 11.2%))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted, 210 40% 96.1%))",
          foreground: "hsl(var(--muted-foreground, 215.4 16.3% 46.9%))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent, 210 40% 96.1%))",
          foreground: "hsl(var(--accent-foreground, 222.2 47.4% 11.2%))",
        },
      },
      borderRadius: {
        lg: "var(--radius, 0.5rem)",
        md: "calc(var(--radius, 0.5rem) - 2px)",
        sm: "calc(var(--radius, 0.5rem) - 4px)",
      },
      keyframes: {
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
        floaty: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        spinslow: {
          to: { transform: "rotate(360deg)" },
        },
        shine: {
          from: { backgroundPosition: "200% 0" },
          to: { backgroundPosition: "-200% 0" },
        },
      },
      animation: {
        marquee: "marquee 38s linear infinite",
        "marquee-fast": "marquee 26s linear infinite",
        floaty: "floaty 6s ease-in-out infinite",
        spinslow: "spinslow 24s linear infinite",
        shine: "shine 6s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
