/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["'DM Sans'", 'system-ui', 'sans-serif'],
        mono: ["'JetBrains Mono'", 'monospace'],
      },
      colors: {
        // Background layers
        bg: {
          root: '#0a0c10',
          surface: '#0f1117',
          elevated: '#161a23',
          card: '#1a1e28',
          'card-hover': '#1e2230',
          modal: '#141820',
          'modal-overlay': 'rgba(0, 0, 0, 0.7)',
          sidebar: '#0d0f14',
          'sidebar-active': 'rgba(99, 131, 255, 0.12)',
          input: '#12151c',
        },
        // Border colors
        border: {
          subtle: '#1e2230',
          DEFAULT: '#262b38',
          hover: '#353b4d',
          active: '#4a5270',
          focus: '#6383ff',
        },
        // Text hierarchy
        text: {
          primary: '#e8eaf0',
          secondary: '#8b90a0',
          tertiary: '#5c6170',
          muted: '#3e4352',
          inverse: '#0a0c10',
        },
        // Brand
        augur: {
          blue: '#6383ff',
          'blue-dim': 'rgba(99, 131, 255, 0.15)',
        },
        // Severity system
        severity: {
          critical: '#ff4757',
          'critical-bg': 'rgba(255, 71, 87, 0.12)',
          'critical-border': 'rgba(255, 71, 87, 0.3)',
          high: '#ff8c42',
          'high-bg': 'rgba(255, 140, 66, 0.12)',
          'high-border': 'rgba(255, 140, 66, 0.3)',
          medium: '#ffc542',
          'medium-bg': 'rgba(255, 197, 66, 0.12)',
          'medium-border': 'rgba(255, 197, 66, 0.3)',
          low: '#48c774',
          'low-bg': 'rgba(72, 199, 116, 0.12)',
          'low-border': 'rgba(72, 199, 116, 0.3)',
        },
        // Status / accent
        status: {
          active: '#48c774',
          warning: '#ffc542',
          error: '#ff4757',
          info: '#6383ff',
        },
        accent: {
          orange: '#e87a35',
          teal: '#3dd9c4',
        },
        // Tag colors
        tag: {
          red: 'rgba(255, 71, 87, 0.15)',
          'red-text': '#ff6b7a',
          'red-border': 'rgba(255, 71, 87, 0.3)',
          blue: 'rgba(99, 131, 255, 0.15)',
          'blue-text': '#8ba3ff',
          'blue-border': 'rgba(99, 131, 255, 0.3)',
          purple: 'rgba(168, 130, 255, 0.15)',
          'purple-text': '#b89eff',
          'purple-border': 'rgba(168, 130, 255, 0.3)',
          teal: 'rgba(61, 217, 196, 0.15)',
          'teal-text': '#5ee8d2',
          'teal-border': 'rgba(61, 217, 196, 0.3)',
          gray: 'rgba(139, 144, 160, 0.12)',
          'gray-text': '#8b90a0',
          'gray-border': 'rgba(139, 144, 160, 0.2)',
        },
      },
      borderRadius: {
        sm: '4px',
        md: '6px',
        lg: '8px',
        xl: '12px',
        pill: '999px',
      },
      spacing: {
        'sidebar': '220px',
        'header': '56px',
        'detail': '400px',
      },
      boxShadow: {
        card: '0 1px 3px rgba(0, 0, 0, 0.4), 0 0 0 1px #1e2230',
        elevated: '0 4px 16px rgba(0, 0, 0, 0.5), 0 0 0 1px #1e2230',
        modal: '0 12px 48px rgba(0, 0, 0, 0.7), 0 0 0 1px #262b38',
      },
      fontSize: {
        '2xs': ['10px', { lineHeight: '1.4' }],
        xs: ['11px', { lineHeight: '1.4' }],
        sm: ['12.5px', { lineHeight: '1.5' }],
        base: ['13px', { lineHeight: '1.5' }],
        lg: ['14px', { lineHeight: '1.5' }],
        xl: ['16px', { lineHeight: '1.4' }],
        '2xl': ['20px', { lineHeight: '1.3' }],
        '3xl': ['26px', { lineHeight: '1.1' }],
      },
      animation: {
        shimmer: 'shimmer 1.5s infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
};
