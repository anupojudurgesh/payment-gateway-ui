/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          bg: 'rgb(var(--brand-bg) / <alpha-value>)',
          surface: 'rgb(var(--brand-surface) / <alpha-value>)',
          card: 'rgb(var(--brand-card) / <alpha-value>)',
          border: 'rgb(var(--brand-border) / <alpha-value>)',
          primary: 'rgb(var(--brand-primary) / <alpha-value>)',
          primaryHover: 'rgb(var(--brand-primary-hover) / <alpha-value>)',
          success: 'rgb(var(--brand-success) / <alpha-value>)',
          failed: 'rgb(var(--brand-failed) / <alpha-value>)',
          timeout: 'rgb(var(--brand-timeout) / <alpha-value>)',
          text: 'rgb(var(--brand-text) / <alpha-value>)',
          muted: 'rgb(var(--brand-muted) / <alpha-value>)',
        },
      },
      animation: {
        'slide-up': 'slideUp 0.4s ease-out',
        'fade-in': 'fadeIn 0.3s ease-out',
        'shake': 'shake 0.4s ease-in-out',
        'success-pop': 'successPop 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        'pulse-glow': 'pulseGlow 2s infinite',
        'float': 'float 3s infinite ease-in-out',
        'bounce-dot': 'bounceDot 1s infinite',
      },
      keyframes: {
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '20%': { transform: 'translateX(-8px)' },
          '40%': { transform: 'translateX(8px)' },
          '60%': { transform: 'translateX(-4px)' },
          '80%': { transform: 'translateX(4px)' },
        },
        successPop: {
          '0%': { transform: 'scale(0)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(79,110,247,0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(79,110,247,0.7)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        bounceDot: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
      },
    },
  },
  plugins: [],
}