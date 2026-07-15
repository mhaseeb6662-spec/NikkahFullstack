/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["'Playfair Display'", "serif"],
        body: ["'Inter'", "sans-serif"],
      },
      colors: {
        maroon: {
          50: "#fbeef1",
          100: "#f6d7dd",
          200: "#eaacb9",
          300: "#dc7f95",
          400: "#cf5678",
          500: "#B8375A",
          600: "#9c2a48",
          700: "#7d213a",
          800: "#601a2d",
          900: "#451422",
        },
        rose: {
          400: "#e46b8c",
          500: "#d64d75",
          600: "#b53960",
        },
        gold: {
          300: "#e0c07f",
          400: "#cda75c",
          500: "#B8924A",
          600: "#9a7638",
          700: "#7c5d2c",
        },
        blush: {
          50: "#fdf6f4",
          100: "#faeae7",
          200: "#f3d9d4",
        },
        ink: {
          400: "#9a8f8c",
          600: "#5f5350",
          800: "#2f2624",
          900: "#1c1513",
        },
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
      },
    },
  },
  plugins: [],
};
