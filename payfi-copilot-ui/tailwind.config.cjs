module.exports = {
  darkMode: 'class',
  content: [
    './src/**/*.{html,js,svelte,ts}',
    './static/**/*.svg'
  ],
  theme: {
    extend: {},
  },
  plugins: [require('@tailwindcss/typography')],
};
