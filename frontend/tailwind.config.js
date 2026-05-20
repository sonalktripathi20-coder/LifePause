/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          dark: '#030712',
          deep: '#0B0F19',
          card: '#161D30',
          accent: '#6366F1', // Indigo
          neon: '#06B6D4',   // Cyan
          success: '#10B981', // Emerald
          warning: '#F59E0B', // Amber
          alert: '#EF4444',   // Rose
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif', 'system-ui'],
      },
      boxShadow: {
        'glow-cyan': '0 0 20px rgba(6, 182, 212, 0.15)',
        'glow-indigo': '0 0 20px rgba(99, 102, 241, 0.15)',
        'glow-alert': '0 0 20px rgba(239, 68, 68, 0.2)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}
