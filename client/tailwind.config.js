/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  plugins: [import('flowbite/plugin')],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        openSans: `'Open Sans', sans-serif`,
        Roboto: `'Roboto', sans-serif`,
      },
    },
  
  },
};
