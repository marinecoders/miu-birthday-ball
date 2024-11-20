/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        rubik: ["Rubik", "sans"], // 'Rubik' is the font name
      },
      colors: {
        "usmc-yellow": "#FFC755",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
