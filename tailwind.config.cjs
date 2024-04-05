/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        customBlue: "#2A5D84",
        primary: "#BDEB00",
        secondary: {
          100: "#1E1F25",
          900: "#131517",
        },
      },
      width: {
        'table': '1800px', 
      },
    },
  },
  plugins: [require("@headlessui/tailwindcss")],
};
