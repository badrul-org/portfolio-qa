/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#051424',
        primary: '#adc6ff',
        secondary: '#c4abff',
        tertiary: '#4ae176',
        surface: '#122131',
        'surface-high': '#1c2b3c',
        'on-surface': '#d4e4fa',
        'on-surface-variant': '#c2c6d6',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Space Grotesk', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
