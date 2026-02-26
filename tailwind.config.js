/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        amber: {
          50:  'rgb(var(--accent-light) / <alpha-value>)',
          100: 'rgb(var(--accent-light) / <alpha-value>)',
          200: 'rgb(var(--accent-light) / <alpha-value>)',
          300: 'rgb(var(--accent-light) / <alpha-value>)',
          400: 'rgb(var(--accent-light) / <alpha-value>)',
          500: 'rgb(var(--accent) / <alpha-value>)',
          600: 'rgb(var(--accent-dark) / <alpha-value>)',
          700: 'rgb(var(--accent-dark) / <alpha-value>)',
          800: 'rgb(var(--accent-dark) / <alpha-value>)',
          900: 'rgb(var(--accent-dark) / <alpha-value>)',
          950: 'rgb(var(--accent-dark) / <alpha-value>)',
        },
        yellow: {
          50: '#f2f3f1',
          100: '#e0e1dd',
          200: '#c1cada',
          300: '#97a8be',
          400: '#778da9',
          500: '#5c7390',
        },
        gray: {
          50: '#f2f3f1',
          100: '#e0e1dd',
          200: '#c5c8c3',
          300: '#9ba5b0',
          400: '#778da9',
          500: '#5a6a80',
          600: '#415a77',
          700: '#1b263b',
          800: '#0d1b2a',
          900: '#091520',
          950: '#060d16',
        },
      },
      spacing: {
        '128': '32rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-in-out',
        'slide-down': 'slideDown 0.5s ease-in-out',
        'spin-slow': 'spin 3s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      boxShadow: {
        'skill': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      },
    },
  },
  plugins: [],
};