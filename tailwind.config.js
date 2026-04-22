/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2B3488',
          50:  '#eef0fb',
          100: '#d4d8f5',
          200: '#a9b1eb',
          300: '#7e8ae0',
          400: '#5463d6',
          500: '#3a4ac0',
          600: '#2B3488',
          700: '#21286b',
          800: '#161b4e',
          900: '#0b0e31',
        },
        accent: {
          DEFAULT: '#CC2229',
          light: '#f87171',
          dark:  '#991b1b',
        },
        sky: {
          brand: '#2B3488',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'ui-sans-serif', 'system-ui'],
        heading: ['var(--font-poppins)', 'ui-sans-serif', 'system-ui'],
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(135deg, #2B3488 0%, #1a2060 100%)',
        'cta-gradient':  'linear-gradient(135deg, #CC2229 0%, #2B3488 100%)',
        'card-gradient': 'linear-gradient(180deg, rgba(43,52,136,0.05) 0%, rgba(204,34,41,0.08) 100%)',
      },
      animation: {
        'fade-up':   'fadeUp 0.6s ease-out',
        'fade-in':   'fadeIn 0.5s ease-out',
        'slide-in':  'slideIn 0.5s ease-out',
        'bounce-sm': 'bounceSm 2s infinite',
      },
      keyframes: {
        fadeUp:   { '0%': { opacity: '0', transform: 'translateY(20px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        fadeIn:   { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideIn:  { '0%': { opacity: '0', transform: 'translateX(-20px)' }, '100%': { opacity: '1', transform: 'translateX(0)' } },
        bounceSm: { '0%,100%': { transform: 'translateY(-4px)' }, '50%': { transform: 'translateY(0)' } },
      },
    },
  },
  plugins: [],
}
