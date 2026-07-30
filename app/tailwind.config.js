/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'mgm-blue': '#1e3a5f',
        'mgm-gold': '#FDB92E',
        'mgm-dark': '#1a1a2e',
        'mgm-light': '#f2f3f5',
      },
      fontFamily: {
        'heading': ['DM Sans', 'system-ui', 'sans-serif'],
        'body': ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
