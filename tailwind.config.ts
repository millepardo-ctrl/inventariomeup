import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: { "2xl": "1400px" },
    },
    extend: {
      fontFamily: {
        sans: ["'DM Sans'", "-apple-system", "sans-serif"],
        mono: ["'DM Mono'", "monospace"],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
        header: {
          DEFAULT: "hsl(var(--header-bg))",
          foreground: "hsl(var(--header-foreground))",
          muted: "hsl(var(--header-muted))",
        },
        landing: {
          DEFAULT: "hsl(var(--landing-bg))",
          card: "hsl(var(--landing-card))",
          border: "hsl(var(--landing-border))",
        },
        cat: {
          marmol: "hsl(var(--cat-marmol))",
          "marmol-bg": "hsl(var(--cat-marmol-bg))",
          "marmol-label": "hsl(var(--cat-marmol-label))",
          travertino: "hsl(var(--cat-travertino))",
          "travertino-bg": "hsl(var(--cat-travertino-bg))",
          "travertino-label": "hsl(var(--cat-travertino-label))",
          bali: "hsl(var(--cat-bali))",
          "bali-bg": "hsl(var(--cat-bali-bg))",
          "bali-label": "hsl(var(--cat-bali-label))",
          splitface: "hsl(var(--cat-splitface))",
          "splitface-bg": "hsl(var(--cat-splitface-bg))",
          "splitface-label": "hsl(var(--cat-splitface-label))",
          pizarra: "hsl(var(--cat-pizarra))",
          "pizarra-bg": "hsl(var(--cat-pizarra-bg))",
          "pizarra-label": "hsl(var(--cat-pizarra-label))",
          complementarios: "hsl(var(--cat-complementarios))",
          "complementarios-bg": "hsl(var(--cat-complementarios-bg))",
          "complementarios-label": "hsl(var(--cat-complementarios-label))",
        },
        transit: {
          bg: "hsl(var(--transit-bg))",
          border: "hsl(var(--transit-border))",
          value: "hsl(var(--transit-value))",
          label: "hsl(var(--transit-label))",
        },
        reserved: {
          bg: "hsl(var(--reserved-bg))",
          border: "hsl(var(--reserved-border))",
          value: "hsl(var(--reserved-value))",
          label: "hsl(var(--reserved-label))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
