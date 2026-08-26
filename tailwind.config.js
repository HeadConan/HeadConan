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
        background: '#090a0f',
        canvas: '#0d0f17',
        card: '#131622',
        border: 'rgba(255, 255, 255, 0.08)',
        subtle: 'rgba(255, 255, 255, 0.03)',
        accent: {
          DEFAULT: '#6366f1',
          gold: '#d97706',
          cyan: '#06b6d4',
          emerald: '#10b981',
          rose: '#f43f5e'
        }
      },
      fontFamily: {
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
        serif: ['"Playfair Display"', '"Cinzel"', 'Georgia', 'serif'],
        mono: ['"JetBrains Mono"', 'monospace']
      }
    },
  },
  plugins: [],
}
