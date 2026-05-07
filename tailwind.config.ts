import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          bg: '#0a0a0f',
          surface: '#13131a',
          card: '#1c1c27',
          border: '#2a2a3d',
          primary: '#4F6EF7',
          primaryHover: '#3d5ce0',
          success: '#00d9a3',
          failed: '#ff4d6d',
          timeout: '#ff9f43',
          text: '#e2e2f0',
          muted: '#6b6b8a',
        },
      },
      backgroundImage: {
        'card-visa': 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
        'card-mastercard': 'linear-gradient(135deg, #1a0a0a 0%, #2d1515 50%, #8b0000 100%)',
        'card-amex': 'linear-gradient(135deg, #0a1628 0%, #1a3a5c 50%, #2d6a9f 100%)',
        'card-unknown': 'linear-gradient(135deg, #1a1a2e 0%, #2d2d44 50%, #3d3d5c 100%)',
      },
      animation: {
        'card-flip': 'flip 0.6s ease-in-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'fade-in': 'fadeIn 0.3s ease-out',
        shake: 'shake 0.4s ease-in-out',
        'pulse-glow': 'pulseGlow 2s infinite',
        'success-pop': 'successPop 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        float: 'float 3s infinite ease-in-out',
        'check-draw': 'checkDraw 0.8s ease-out forwards',
        confetti: 'confettiFall 3s linear forwards',
      },
      keyframes: {
        flip: {
          '0%': { transform: 'rotateY(0deg)' },
          '100%': { transform: 'rotateY(180deg)' },
        },
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
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(79, 110, 247, 0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(79, 110, 247, 0.7)' },
        },
        successPop: {
          '0%': { transform: 'scale(0)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        checkDraw: {
          '0%': { strokeDashoffset: '24' },
          '100%': { strokeDashoffset: '0' },
        },
        confettiFall: {
          '0%': { transform: 'translateY(-10%) rotate(0deg)', opacity: '1' },
          '100%': { transform: 'translateY(100vh) rotate(720deg)', opacity: '0' },
        },
      },
    },
  },
  plugins: [],
}

export default config
