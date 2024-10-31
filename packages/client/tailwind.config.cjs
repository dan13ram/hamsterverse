/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        blackAlpha: "rgba(0, 0, 0, 0.5)",
      },
      animation: {
        battle: "battle 2s linear 1",
        win: "win 2s linear 1",
      },
      keyframes: {
        win: {
          "100%": {
            width: "200%",
            height: "200%",
            backgroundColor: "transparent",
          },
          "92%": {
            backgroundColor: "white",
          },
          "84%": {
            backgroundColor: "transparent",
          },
          "76%": {
            width: "200%",
            height: "200%",
            transform: "rotate(0deg)",
            backgroundColor: "white",
          },
          "68%": {
            backgroundColor: "transparent",
          },
          "0%": {
            transform: "rotate(360deg)",
          },
        },
        battle: {
          "0%": {
            width: "200%",
            height: "200%",
            backgroundColor: "transparent",
          },
          "8%": {
            backgroundColor: "white",
          },
          "16%": {
            backgroundColor: "transparent",
          },
          "24%": {
            width: "200%",
            height: "200%",
            transform: "rotate(0deg)",
            backgroundColor: "white",
          },
          "32%": {
            backgroundColor: "transparent",
          },
          "100%": {
            width: 0,
            height: 0,
            transform: "rotate(360deg)",
          },
        },
      },
    },
  },
  plugins: [],
};
