/** @type {import('tailwindcss').Config} */
// eslint-disable-next-line import/no-anonymous-default-export
export default {
  darkMode: 'class',
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3b82f6',
        'primary-hover': '#2563eb',
        'background-dark': '#131811',
        'card-dark': '#1e271c',
        'text-secondary': '#a3b99d',
        'border-color': '#2c3928',
        success: '#22c55e',
      },
    },
  },
  plugins: [],
}