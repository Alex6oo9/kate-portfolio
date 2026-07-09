/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        'base': '#0a0a0a',
        'base-2': '#060606',
        'gold': '#d4af37',
      },
      fontFamily: {
        display: ["'Cormorant Garamond'", "serif"],
        label: ["'DM Sans'", "sans-serif"],
        wordmark: ["'Playfair Display'", "serif"],
      },
      keyframes: {
        goldPulse: {
          '0%, 100%': { textShadow: '0 0 120px rgba(212,175,55,.12), 0 40px 80px rgba(0,0,0,.95)' },
          '50%': { textShadow: '0 0 240px rgba(212,175,55,.22), 0 40px 80px rgba(0,0,0,.95)' },
        },
        scrollDrop: {
          '0%': { transformOrigin: 'top', transform: 'scaleY(0)', opacity: '1' },
          '48%': { transformOrigin: 'top', transform: 'scaleY(1)', opacity: '1' },
          '50%': { transformOrigin: 'bottom', transform: 'scaleY(1)', opacity: '1' },
          '100%': { transformOrigin: 'bottom', transform: 'scaleY(0)', opacity: '.2' },
        },
      },
      animation: {
        goldPulse: 'goldPulse 7s ease-in-out infinite',
        scrollDrop: 'scrollDrop 2.4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
