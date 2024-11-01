/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        mono: ["Courier Prime"],
        heading: ["Creepster"],
      },
      colors: {
        blackAlpha: "rgba(0, 0, 0, 0.5)",
      },
      animation: {
        up: "up 2s ease-in-out",
        pulse: 'pulse 1s linear infinite',
        win: "win 1s linear infinite",
        scroll: "appear 2s linear, scroll-bg-left 30s 1s ease-in-out infinite",
        "scroll-right": "appear 2s linear, scroll-bg-right 30s 1s ease-in-out infinite",
      },
      keyframes: {
        appear: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 }
        },
        disappear: {
          '0%': { opacity: 1 },
          '100%': { opacity: 0 }
        },
        up: {
          'from': { transform: 'translateY(100%)' },
          'to': { transform: 'translateY(0px)' }
        },
        pulse: {
          '0%, 60%, 100%': { opacity: 1 },
          '20%': { opacity: 0 },
          '40%': { opacity: 0 }
        },
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
      },
    },
  },
  plugins: [],
};
