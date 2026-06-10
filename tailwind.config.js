/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        text2: "#1a2233",
        text: "#fafafa",
        bg: "#ffffff",
        secondary: "#eef1f6",
        "secondary-2": "#2563eb",
        "hover-button": "#60a5fa",
        button1: "#00ff66",
        primary: "#1e2a3a",
        "primary-1": "#4a5568",
      },
      fontFamily: {
        Poppins: ["Poppins", "sans-serif"],
        Inter: ["Inter", "sans-serif"],
      },
      screens: {
        mq1350: { raw: "(max-width: 1350px)" },
        mq1125: { raw: "(max-width: 1125px)" },
        mq800: { raw: "(max-width: 800px)" },
        mq450: { raw: "(max-width: 450px)" },
      },
    },
  },
  plugins: [],
};