import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      textColor: {
        primary: '#352A7C',
        primarytwo: '#FFFFFF',
        secondary: '#6F87A4',
        secondarytwo: '#768383',
      },
      backgroundColor: {
        primary: '#FCFCFC',
        secondary: '#E3F0FF',
        tertiary: '#E8C2FF',
      },
  		colors: {
        primary: '#FCFCFC',
        secondary: '#E3F0FF',
        tertiary: '#E8C2FF',
        border: 'hsl(var(--border))',
        buttons: {
          primary: '#917AE5',
          secondary: '#CBCDFB',
          secondarytwo: '#352A7C',
          secondarythree: '#CBFBF9',
        },
        labels: {
          primary: '#CBCDFB',
          secondary: '1AD670',
        },
        bubbles: {
          companion: '#917AE5',
          freetype: '#FFFFFF',
          mutliselect: '#F3F0FF',
          mutliselecttwo: '#D8CEFF',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      }
    }
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
