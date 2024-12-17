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
        orb: "#4E38B2",
        primary: "#352A7C",
        primarytwo: "#FFFFFF",
        secondary: "#6F87A4",
        secondarytwo: "#768383",
      },
      backgroundColor: {
        primary: "#FCFCFC",
        secondary: "#E3F0FF",
        tertiary: "#E8C2FF",
        card: "ECF0FF",
      },
      colors: {
        primary: "#FCFCFC",
        secondary: "#E3F0FF",
        tertiary: "#E8C2FF",
        border: {
          border: "hsl(var(--border))",
          primary: "hsl(var(--border))",
          secondarytwo: "#768383",
        },
        buttons: {
          primary: "#917AE5",
          secondary: "#CBCDFB",
          secondarytwo: "#352A7C",
          secondarythree: "#CBFBF9",
        },
        labels: {
          primary: "#CBCDFB",
          secondary: "1AD670",
        },
        bubbles: {
          companion: "#917AE5",
          freetype: "#FFFFFF",
          mutliselect: "#F3F0FF",
          mutliselecttwo: "#D8CEFF",
        },
        card: "ECF0FF",
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        in: {
          "0%": {
            transform: "translateY(18px)",
            opacity: "0",
          },
          "100%": {
            transform: "translateY(0)",
            opacity: "1",
          },
        },
        "in-reverse": {
          "0%": {
            transform: "translateY(-18px)",
            opacity: "0",
          },
          "100%": {
            transform: "translateY(0px)",
            opacity: "1",
          },
        },
      },
      animation: {
        in: "in .6s both",
        "in-reverse": "in-reverse .6s both",
      },
    },
  },
  future: {
    hoverOnlyWhenSupported: true,
  },
};
export default config;
