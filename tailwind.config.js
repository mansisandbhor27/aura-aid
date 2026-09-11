/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        midnight: {
          50: '#f0f4ff',
          100: '#dbe4ff',
          200: '#bac9ff',
          300: '#8ca6ff',
          400: '#5c7aff',
          500: '#3b55f6',
          600: '#253be8',
          700: '#1d2cc4',
          800: '#1a259e',
          900: '#141c6d',
          950: '#0a0e3b',
        },
      },
    },
  },
  plugins: [],
}
