/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./views/**/*.hbs",
    "./src/**/*.ts"
  ],
  theme: {
    extend: {
      colors: {
        'concrete': '#f3f3f3',
        'cold-gray': '#0d0d0d',
        'yellow-sea': '#eea404',
        'red-orange': '#fe3b25',
        'cold-gray': '#84dadb',
      }
    },
  },
  plugins: [require('tw-elements/dist/plugin.cjs')],
  darkMode: 'class'
}

