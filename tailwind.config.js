/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        pretendard: ['Pretendard', 'sans-serif'],
      },
      colors: {
        ink: {
          950: '#0A0A0F',
          900: '#111118',
          800: '#1A1A24',
          700: '#252532',
        },
        surface: {
          DEFAULT: '#1E1E2E',
          elevated: '#252538',
          glass: 'rgba(255,255,255,0.04)',
        },
        accent: {
          DEFAULT: '#0EA5E9',
          soft: '#38BDF8',
          glow: 'rgba(14,165,233,0.15)',
        },
        muted: '#6B7280',
        border: 'rgba(255,255,255,0.08)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s ease-in-out infinite',
        'slide-up': 'slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'fade-in': 'fadeIn 0.8s ease forwards',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(24px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
