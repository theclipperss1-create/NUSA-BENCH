/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        midnight: '#ffffff',
        cardbg: '#fafafa',
        primary: {
          DEFAULT: '#ea580c',
          glow: 'rgba(234, 88, 12, 0.1)',
        },
        secondary: {
          DEFAULT: '#ea580c',
          glow: 'rgba(234, 88, 12, 0.15)',
        },
        accent: '#f4f4f5',
        ice: '#18181b',
        mutedslate: '#71717a',
        borderglow: '#e4e4e7',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        heading: ['Outfit', 'sans-serif'],
      },
      boxShadow: {
        glow: 'none',
        glowsec: 'none',
      },
      transitionTimingFunction: {
        spring: 'cubic-bezier(0.25, 0.8, 0.25, 1)',
      }
    },
  },
  plugins: [],
}
