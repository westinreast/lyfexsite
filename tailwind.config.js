/** @type {import('tailwindcss').Config} */
// Aurora tokens copied 1:1 from lib/theme/aurora_colors.dart so the site
// matches the LyfeX app's color language exactly.
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        aurora: {
          bg: '#0A0314',
          surfaceLow: '#14091E',
          surfaceMid: '#1F1230',
          surfaceHigh: '#251A3D',
          surfaceMuted: '#130A1E',
          glassTop: '#170B2C',
          glassBottom: '#120822',
          violet: '#9A4DFF',
          violetBright: '#B98BFF',
          violetDeep: '#5B2BD6',
          violetDim: '#7B3ACC',
          coach: '#FF2EA0',
          cyan: '#7DE3FF',
          irisCyan: '#4DC3FF',
          aliveCyan: '#5BE7E6',
          mint: '#46E5B5',
          amber: '#F3C969',
          rose: '#FF6E8E',
          activity: '#FFA94D',
          textPrimary: '#F2EAFA',
          textSecondary: '#A89AC4',
          textTertiary: '#6A5599',
          borderHair: '#2A1A42',
          borderSubtle: '#3F2A60',
        },
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Inter', 'Segoe UI', 'sans-serif'],
        serif: ['Gelasio', 'Georgia', 'serif'], // the app's "LyfeX Serif" brand font
        mono: ['"SF Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      boxShadow: {
        glow: '0 0 48px 0 rgba(154,77,255,0.28)',
        float: '0 18px 48px -12px rgba(0,0,0,0.6)',
      },
      backgroundImage: {
        iris: 'linear-gradient(135deg, #FF2EA0 0%, #9A4DFF 46%, #4DC3FF 100%)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'drift': {
          '0%,100%': { transform: 'translate(0,0)' },
          '50%': { transform: 'translate(2%, -3%)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.7s cubic-bezier(0.22,1,0.36,1) both',
        'drift-slow': 'drift 24s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
