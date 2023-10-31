/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'onramp-green': '#a0dd1d',
      },
    },
  },
  daisyui: {
    themes: [
      {
        default: {
          primary: '#3c787e',
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
