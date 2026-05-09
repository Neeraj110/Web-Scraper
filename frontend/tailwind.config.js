/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#13222f",
        paper: "#f4efe8",
        ember: "#d44c2d",
        deep: "#0f4c5c",
        gold: "#d6a531",
      },
      boxShadow: {
        soft: "0 24px 60px rgba(15, 23, 42, 0.12)",
      },
    },
  },
  plugins: [],
};
