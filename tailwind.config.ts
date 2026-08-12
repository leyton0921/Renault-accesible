import type { Config } from "tailwindcss"

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        renault: {
          black: "#111111",
          gray: {
            50: "#F7F7F7",
            100: "#EFEFEF",
            200: "#E2E2E2",
            400: "#9B9B9B",
            600: "#5C5C5C",
            800: "#2B2B2B",
          },
          yellow: "#FFD100",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.5rem",
      },
      boxShadow: {
        card: "0 2px 20px rgba(0,0,0,0.06)",
        cardHover: "0 8px 30px rgba(0,0,0,0.10)",
      },
    },
  },
  plugins: [],
}

export default config
