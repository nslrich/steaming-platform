/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      spacing: {
        '128': '32rem',
        '130': '34rem',
        '132': '36rem',
        '134': '38rem',
        '136': '40rem',
      }
    },
  },
  plugins: [],
  darkMode: 'class',
}

