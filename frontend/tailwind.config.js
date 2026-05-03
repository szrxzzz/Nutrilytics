/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        primary: {
          light: '#60a5fa',
          DEFAULT: '#2563eb',
          dark: '#1e40af',
        },
        healthy: '#22c55e',
        urgent: '#ef4444',
        warning: '#f59e0b',
      },
      backgroundColor: {
        'app-cream': '#f8fafc',
      }
    },
  },
  plugins: [],
}
