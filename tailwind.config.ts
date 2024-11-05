import type { Config } from "tailwindcss";
import forms from "@tailwindcss/forms";
import typography from "@tailwindcss/typography";
import aspectRatio from "@tailwindcss/aspect-ratio";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    // Añade otros directorios si usas Tailwind en otras partes
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)", // Color de fondo usando una variable CSS
        foreground: "var(--foreground)", // Color de primer plano usando una variable CSS
        primary: "#1d4ed8", // Azul personalizado como color primario
        secondary: "#f97316", // Naranja personalizado como color secundario
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"], // Fuente personalizada "Inter"
        mono: ["Fira Code", "monospace"], // Fuente para texto monoespaciado
      },
      spacing: {
        72: "18rem",
        84: "21rem",
        96: "24rem",
      },
    },
  },
  plugins: [forms, typography, aspectRatio],
};

export default config;
