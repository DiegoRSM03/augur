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
        // Background layers - using CSS variables for theme support
        bg: {
          root: 'var(--color-bg)',
          surface: 'var(--color-surface)',
          elevated: 'var(--color-elevated)',
          card: 'var(--color-card)',
          'card-hover': 'var(--color-card-hover)',
          modal: 'var(--color-modal-bg)',
          'modal-overlay': 'var(--color-overlay)',
          sidebar: 'var(--color-sidebar-bg)',
          'sidebar-active': 'var(--color-sidebar-active)',
          input: 'var(--color-input)',
        },
        // Border colors
        border: {
          subtle: 'var(--color-border-subtle)',
          DEFAULT: 'var(--color-border)',
          hover: 'var(--color-border-hover)',
          active: 'var(--color-border-hover)',
          focus: 'var(--color-border-focus)',
        },
        // Text hierarchy
        text: {
          primary: 'var(--color-text-primary)',
          secondary: 'var(--color-text-secondary)',
          tertiary: 'var(--color-text-tertiary)',
          muted: 'var(--color-text-muted)',
          inverse: 'var(--color-bg)',
        },
        // Brand
        augur: {
          blue: 'var(--color-accent)',
          'blue-dim': 'var(--color-accent-bg)',
        },
        // Severity system
        severity: {
          critical: 'var(--color-critical)',
          'critical-bg': 'var(--color-critical-bg)',
          'critical-border': 'var(--color-critical-border)',
          high: 'var(--color-high)',
          'high-bg': 'var(--color-high-bg)',
          'high-border': 'var(--color-high-border)',
          medium: 'var(--color-medium)',
          'medium-bg': 'var(--color-medium-bg)',
          'medium-border': 'var(--color-medium-border)',
          low: 'var(--color-low)',
          'low-bg': 'var(--color-low-bg)',
          'low-border': 'var(--color-low-border)',
        },
        // Status / accent
        status: {
          active: 'var(--color-status-active)',
          warning: 'var(--color-medium)',
          error: 'var(--color-critical)',
          info: 'var(--color-accent)',
        },
        accent: {
          orange: '#e87a35',
          teal: '#3dd9c4',
        },
        // Tag colors - keeping these as-is since they're decorative
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
        card: '0 1px 3px rgba(0, 0, 0, 0.4), 0 0 0 1px var(--color-border-subtle)',
        elevated: '0 4px 16px rgba(0, 0, 0, 0.5), 0 0 0 1px var(--color-border-subtle)',
        modal: '0 12px 48px rgba(0, 0, 0, 0.7), 0 0 0 1px var(--color-border)',
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
