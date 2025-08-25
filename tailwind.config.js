/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        gray: {
          25: '#fafafa',
        }
      },
      animation: {
        'progress-fill': 'progress-fill 0.7s ease-out',
      },
      keyframes: {
        'progress-fill': {
          '0%': { width: '0%' },
          '100%': { width: 'var(--progress-width)' },
        }
      }
    },
  },
  plugins: [],
};
