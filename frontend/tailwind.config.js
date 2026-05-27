/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8B5CF6',
          600: '#7c3aed',
          700: '#6d28d9',
        },
        neon: {
          pink:  '#EC4899',
          cyan:  '#06B6D4',
          green: '#10B981',
        },
        dark: {
          700: '#1a1a2e',
          800: '#0f0f1a',
          900: '#080810',
        },
      },
      fontFamily: {
        sans:    ['Inter', 'sans-serif'],
        display: ['Syne', 'sans-serif'],
        mono:    ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'neon-purple': '0 0 20px rgba(139,92,246,0.4)',
        'neon-pink':   '0 0 20px rgba(236,72,153,0.4)',
        glass:         '0 8px 32px rgba(0,0,0,0.4)',
      },
      animation: {
        shimmer: 'shimmer 2s linear infinite',
        float:   'float 3s ease-in-out infinite',
      },
      keyframes: {
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%':      { transform: 'translateY(-8px)' },
        },
      },
      backgroundSize: {
        '200%': '200%',
      },
    },
  },
  plugins: [],
};
