import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#fdfcf9',
          100: '#faf7f0',
          200: '#f4ede0',
          300: '#ecdfd0',
          400: '#7a9472',
          500: '#5a7a53',
          warm: '#8c7b6e',
          dark: '#3d332a',
        },
      },
    },
  },
  plugins: [],
};

export default config;
