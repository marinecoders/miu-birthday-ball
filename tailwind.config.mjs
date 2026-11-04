/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        rubik: ["Rubik", "system-ui", "sans-serif"],
        serif: ['"Cormorant Garamond"', "Georgia", "serif"],
      },
      colors: {
        "usmc-yellow": "#FFC755",
        // Marine Corps scarlet and gold, on a deep night-navy background.
        scarlet: { DEFAULT: "#BA0C2F", dark: "#8E0A24", light: "#E0294F" },
        gold: { DEFAULT: "#FFC72C", soft: "#E9C46A", muted: "#B8954A" },
        ink: { DEFAULT: "#0B0F17", 800: "#121826", 700: "#1A2233", 600: "#263046" },
      },
      boxShadow: {
        glow: "0 0 0 1px rgb(255 199 44 / 0.25), 0 10px 40px -10px rgb(186 12 47 / 0.45)",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
