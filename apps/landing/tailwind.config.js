const { createGlobPatternsForDependencies } = require("@nx/react/tailwind");
const { join } = require("path");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    join(
      __dirname,
      "{src,pages,components,app}/**/*!(*.stories|*.spec).{ts,tsx,html}",
    ),
    ...createGlobPatternsForDependencies(__dirname),
  ],
  theme: {
    extend: {
      fontFamily: {
        comba: ["Comba", "sans-serif"],
        futura: ["Futura", "sans-serif"],
        sfpro: ["sfpro", "sans-serif"],
        basteleur: ["basteleur", "serif"],
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-5%)" },
        },
      },
      colors: {
        purple: "#735fff",
        yellow: "#f2dc00",
        red: "#E41A56",
        blue: "#1028f1",
        black: "#1B1818",
      },
      backgroundImage: {
        'gradient': 'linear-gradient(180deg, #0B3B48 50%, #062128 100%)',
      },
    },
  },
  plugins: [],
};
