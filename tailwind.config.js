/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        landsafe: {
          bg: '#F6F8FA',
          card: '#FFFFFF',
          sidebar: '#FFFFFF',
          topbar: '#FFFFFF',
          border: '#E2E8F0',
          text: '#111827',
          secondary: '#4B5563',
          muted: '#6B7280',
          accent: '#0F766E',
          accentLight: '#F0FDFA',
          accentBorder: '#CCFBF1',
          dataBlue: '#2563EB',
          normal: '#16A34A',
          warning: '#D97706',
          critical: '#DC2626',
        },
        darkSurface: {
          bg: '#09090b',
          surface: '#111116',
          card: '#121217',
          border: '#27272a',
          text: '#f4f4f5',
          subtext: '#a1a1aa',
          muted: '#71717a',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Menlo', 'Consolas', 'monospace'],
      },
      boxShadow: {
        'card-light': '0 1px 2px 0 rgba(0, 0, 0, 0.04)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'ping-slow': 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite',
      }
    },
  },
  plugins: [],
}
