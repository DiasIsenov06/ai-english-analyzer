import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      animation: {
        marquee: "marquee 25s linear infinite",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      colors: {
        accent: {
          start: "#4F7CFF",
          end: "#6AE3FF",
        },
        bg: {
          light: "#f8f8ff",
        },
      },
      backgroundImage: {
        "gradient-accent": "linear-gradient(135deg, #4F7CFF 0%, #6AE3FF 100%)",
      },
    },
  },
  plugins: [],
};
export default config;
