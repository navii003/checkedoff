/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      './app/**/*.{js,ts,jsx,tsx}',
      './components/**/*.{js,ts,jsx,tsx}',
    ],
    theme: {
      extend: {
        colors: {
          navy: {
            light: '#2c3e50',
            dark: '#222831',
          },
        },
      },
    },
    plugins: [],
  };
 