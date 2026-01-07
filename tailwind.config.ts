import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        burgundy: {
          50: '#fdf2f4',
          100: '#fce7eb',
          200: '#f9d0d9',
          300: '#f4a9ba',
          400: '#ec7694',
          500: '#df4770',
          600: '#cb285a',
          700: '#ab1d49',
          800: '#8f1b42',
          900: '#722040', // Main burgundy
          950: '#450a1f',
        },
        cream: {
          50: '#fefdfb',
          100: '#fcf9f3',
          200: '#f8f1e4',
          300: '#f2e6d0',
          400: '#e9d5b3',
        },
        charcoal: {
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
        }
      },
      fontFamily: {
        display: ['Playfair Display', 'serif'],
        sans: ['Lato', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
export default config
