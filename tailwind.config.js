/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#080B12',
        secondary: '#0E131D',
        card: '#121925',
        border: '#202938',
        primary: '#38BDF8',
        success: '#22C55E',
        warning: '#F59E0B',
        danger: '#EF4444',
        critical: '#DC2626',
        textPrimary: '#F8FAFC',
        textSecondary: '#94A3B8',
      },
    },
  },
  plugins: [],
}
