/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        blackAlpha: "rgba(0, 0, 0, 0.5)",
      },
      animation: {
        battle: "battle 4s linear 1",
        win: "win 1s linear infinite",
        scroll: "scroll-bg-left 30s ease-in-out infinite",
        "scroll-right": "scroll-bg-right 30s ease-in-out infinite",
      },
      keyframes: {
        'scroll-bg-left': {
          '0': {
            'background-position': '0 0',
          },
          '50%': {
            'background-position': '-200vw 0',
          },
          '100%': {
            'background-position': '0 0',
          },
        },
        "scroll-bg-right": {
          '0': {
            'background-position': '0 0',
          },
          '50%': {
            'background-position': '200vw 0',
          },
          '100%': {
            'background-position': '0 0',
          },
        },
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
