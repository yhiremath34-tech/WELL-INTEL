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
        navy: {
          950: '#030B12',
          900: '#06131F',
          850: '#071A2B',
          800: '#0B233A',
          700: '#113554',
          600: '#1B4A72',
        },
        water: {
          50: '#F0F9FF',
          100: '#E0F2FE',
          200: '#BAE6FD',
          300: '#7DD3FC',
          400: '#38BDF8',
          500: '#168AAD',
          600: '#0E7490',
          700: '#0369A1',
          800: '#075985',
          900: '#083344',
        },
        teal: {
          400: '#2DD4BF',
          500: '#14B8A6',
          600: '#0D9488',
        },
        cyan: {
          300: '#67E8F9',
          400: '#38BDF8',
          500: '#06B6D4',
        },
        surface: {
          light: '#F7FBFF',
          dark: '#06131F',
          cardLight: 'rgba(255, 255, 255, 0.85)',
          cardDark: 'rgba(7, 26, 43, 0.75)',
        }
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(135deg, #06131F 0%, #083344 50%, #075985 100%)',
        'ocean-depth': 'linear-gradient(180deg, #071A2B 0%, #06131F 100%)',
        'card-gradient-dark': 'linear-gradient(145deg, rgba(11, 35, 58, 0.7) 0%, rgba(7, 26, 43, 0.4) 100%)',
        'glow-radial': 'radial-gradient(circle at center, rgba(56, 189, 248, 0.15) 0%, transparent 70%)',
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'wave': 'wave 8s linear infinite',
        'wave-slow': 'wave 12s linear infinite',
        'ripple': 'ripple 3s cubic-bezier(0, 0.2, 0.8, 1) infinite',
        'shimmer': 'shimmer 2.5s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        wave: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        ripple: {
          '0%': { transform: 'scale(0.8)', opacity: '1' },
          '100%': { transform: 'scale(2.4)', opacity: '0' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
}
