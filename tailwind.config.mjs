/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      fontFamily: {
        rubik: ['Rubik', 'sans'], // 'Rubik' is the font name
      }
    },
  },
  plugins: [require('@tailwindcss/typography')],
}
