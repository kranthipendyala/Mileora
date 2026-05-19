/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        bg: "#0b0a14",
        surface: "#1a1830",
        border: "#2a2745",
        text: "#f5f1e8",
        muted: "#a9a3b8",
        gold: {
          100: "#fbeec0",
          300: "#f1cb5b",
          500: "#d4a017",
        },
        rose: {
          200: "#fda4af",
          300: "#fb7185",
          400: "#f87171",
        },
      },
      fontFamily: {
        serif: ["Cormorant_Garamond_600SemiBold"],
      },
    },
  },
};
