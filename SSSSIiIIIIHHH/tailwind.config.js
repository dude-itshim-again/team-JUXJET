/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#F0F4F8',
          100: '#D9E2EC',
          200: '#BCCCDC',
          300: '#9FB3C8',
          400: '#627D98',
          500: '#334E68',
          600: '#243B53',
          700: '#173B65', // Primary Brand Navy
          800: '#102A43',
          900: '#0B1D30',
        },
        teal: {
          50: '#E6F6F5',
          100: '#C3ECE9',
          200: '#9CE0DC',
          300: '#66CCC6',
          400: '#38B2AC',
          500: '#238E8B',
          600: '#176B68', // Secondary Brand Teal
          700: '#105351',
          800: '#0B3A38',
          900: '#062423',
        },
        saffron: {
          50: '#FDF8EC',
          100: '#FCEECC',
          200: '#F8DFA1',
          300: '#F3CE6E',
          400: '#EDB747',
          500: '#E7A23B', // Accent Saffron
          600: '#C78322',
          700: '#9E6414',
          800: '#75470C',
          900: '#4D2C06',
        },
        surface: {
          50: '#F8FAFC',
          100: '#F1F5F9',
          200: '#E2E8F0',
          300: '#CBD5E1',
          400: '#94A3B8',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'subtle': '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px -1px rgba(0, 0, 0, 0.05)',
        'card': '0 2px 6px 0 rgba(23, 59, 101, 0.06), 0 1px 3px 0 rgba(0, 0, 0, 0.04)',
        'elevated': '0 10px 25px -5px rgba(23, 59, 101, 0.1), 0 8px 10px -6px rgba(23, 59, 101, 0.05)',
      }
    },
  },
  plugins: [],
}
