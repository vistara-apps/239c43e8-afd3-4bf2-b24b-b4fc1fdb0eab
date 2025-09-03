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
        bg: 'hsl(220, 15%, 96%)',
        text: 'hsl(220, 13%, 18%)',
        accent: 'hsl(140, 69%, 49%)',
        primary: 'hsl(203, 92%, 48%)',
        surface: 'hsl(220, 15%, 100%)',
        'secondary-text': 'hsl(220, 13%, 36%)',
        dark: {
          bg: 'hsl(220, 15%, 8%)',
          surface: 'hsl(220, 15%, 12%)',
          text: 'hsl(220, 15%, 85%)',
        }
      },
      borderRadius: {
        'lg': '12px',
        'md': '8px',
        'sm': '4px',
      },
      boxShadow: {
        'card': '0 4px 12px hsla(220, 13%, 18%, 0.1)',
      },
      spacing: {
        'lg': '16px',
        'md': '8px',
        'sm': '4px',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-crypto': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      },
    },
  },
  plugins: [],
  darkMode: 'class',
}
