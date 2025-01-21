/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Roboto", "sans-serif"],
      },
      fontSize: {
        sm: "0.75rem",
        md: "0.875rem",
        lg: "1rem",
        xl: "1.25rem",
        "2xl": "1.5rem",
        "3xl": "1.875rem",
        "4xl": "2.25rem",
      },
      borderRadius: {
        "25px": "25px",
      },
    },
  },
  variants: {
    extend: {
      animation: ["motion-reduce"],
      transitionProperty: ["motion-reduce"],
      transitionDuration: ["motion-reduce"],
      transitionTimingFunction: ["motion-reduce"],
      transitionDelay: ["motion-reduce"],
    },
  },
  plugins: [],
};
