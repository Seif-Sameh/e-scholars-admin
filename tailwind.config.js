/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes:{
        "fade-in-left": {
                    "0%": {
                        opacity: 0,
                        transform: "translate3d(-100%, 0, 0)",
                        color: 'white'
                    },
                    "100%": {
                        opacity: 1,
                        transform: "translate3d(0, 0, 0)",
                        color: "#054bb4"
                    },
                },
      },
      animation:{
        fadeinleft: 'fade-in-left 1s ease-out forwards',
      }
    },
  },
  plugins: [],
}