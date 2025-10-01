/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef8ff',
          100: '#d8edff',
          200: '#b7defe',
          300: '#84cbfd',
          400: '#47b1fa',
          500: '#1d95e6',
          600: '#0e74c4',
          700: '#0d5da0',
          800: '#104e82',
          900: '#133f69'
        }
      }
    }
  },
  plugins: []
};
