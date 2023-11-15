/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    fontFamily: {sans:['Kanit'], oswald: ['Kanit'] },
    extend: {
      colors: {
        'onramp-green': '#a0dd1d',
        'card-bg': '#D9D9D9',
        'gulçin-pink': '#e952de'
      },
      height: { 120: '28rem' },
      scale: { 101: '1.01' },
    },
  },
  daisyui: {
    themes: [
      {
        default: {
          orange: '#f97316',
          primary: '#f97316',
          secondary: '#e952de',
          accent: '#140d4f',
          neutral: '#6b7280',
          'base-100': '#ffffff',
          info: '#0284c7',
          success: '#16a34a',
          warning: '#facc15',
          error: '#ef4444',
        },
      },
    ],
  },
  plugins: [require('daisyui')],
}
