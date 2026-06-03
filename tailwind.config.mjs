/** @type {import('tailwindcss').Config} */
// Force refresh after color change to #B3CD1D

export default {
 content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
 theme: {
  extend: {
   colors: {
    nexo: {
     p: 'var(--nexo-p)',
     s: 'var(--nexo-s)',
     'bg-base': 'var(--nexo-bg-base)',
     'bg-surface': 'var(--nexo-bg-surface)',
     'bg-elevated': 'var(--nexo-bg-elevated)',
     border: 'var(--nexo-border)',
     text: {
      DEFAULT: 'var(--nexo-text)',
      muted: 'var(--nexo-text-muted)',
     },
     primary: '#B3CD1D',
     dark: {
      DEFAULT: '#0D2E34',
      50: '#F8FAFB',
      100: '#F1F5F7',
      200: '#E2E8F0',
      300: '#CBD5E1',
      400: '#94A3B8',
      500: '#0D2E34', // Base Brand Dark
      600: '#0A252A',
      700: '#081D21',
      800: '#061619',
      900: '#040E10',
     },
     accent: '#9AAD1C',
     success: '#B3CD1D',
    }
   },
   fontFamily: {
    sans: ['"Inter"', 'system-ui', 'sans-serif'],
    display: ['"Inter"', 'system-ui', 'sans-serif'], // In case we want to differentiate later
   },
   borderRadius: {
    '4xl': '2rem',
    '5xl': '3rem',
   },
   animation: {
     'blob': 'blob 7s infinite',
     'float': 'float 6s ease-in-out infinite',
     'pulse-soft': 'pulse-soft 3s ease-in-out infinite',
   },
   keyframes: {
     blob: {
       '0%': { transform: 'translate(0px, 0px) scale(1)' },
       '33%': { transform: 'translate(30px, -50px) scale(1.1)' },
       '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
       '100%': { transform: 'translate(0px, 0px) scale(1)' },
     },
     float: {
       '0%, 100%': { transform: 'translateY(0)' },
       '50%': { transform: 'translateY(-20px)' },
     },
     'pulse-soft': {
       '0%, 100%': { opacity: 1 },
       '50%': { opacity: 0.7 },
     }
   }
  },
 },
 plugins: [],
};
