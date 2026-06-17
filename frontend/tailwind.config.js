/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
        heading: ['"Inter"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', '"Fira Code"', 'Consolas', 'monospace'],
        accent: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        background: '#e0e5ec',
        foreground: '#2d3436',
        card: '#f0f2f5',
        muted: '#d1d9e6',
        mutedForeground: '#4a5568',
        border: '#babecc',
        borderLight: '#ffffff',
        borderDark: '#a3b1c6',
        input: '#d1d9e6',
        ring: '#ff4757',
        accent: {
          DEFAULT: '#ff4757',
          secondary: '#4a5568',
          tertiary: '#a3b1c6',
        },
        destructive: '#ff4757',
      },
      transitionTimingFunction: {
        'spring': 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        'blink': 'blink 1s step-end infinite',
        'pulse-fast': 'pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(15px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        blink: {
          '50%': { opacity: '0' },
        },
      },
    },
  },
  plugins: [],
};
