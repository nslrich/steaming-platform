/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      spacing: {
        '68': '17rem',
        '104': '25rem',
        '108': '26rem',
        '116': '28rem',
        '128': '32rem',
        '130': '34rem',
        '132': '36rem',
        '134': '38rem',
        '136': '40rem',
        '475': '475px'
      }
    },
  },
  plugins: [],
  darkMode: 'class',
}

