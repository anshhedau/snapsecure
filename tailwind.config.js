/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        zentra: {
          bg: "#F9FAFB",
          card: "#FFFFFF",
          border: "#E5E7EB",
          blue: "#E68F74",
          green: "#10B981",
          orange: "#F59E0B",
          red: "#EF4444",
          accent: "#D2795E",
          text: "#111827",
          muted: "#6B7280"
        }
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
        'card': '0 10px 30px -5px rgba(0, 0, 0, 0.08)',
      },
      fontFamily: {
        sans: ["Space Grotesk", "Plus Jakarta Sans", "Inter", "sans-serif"],
        mono: ["JetBrains Mono", "Courier New", "Courier", "monospace"],
        serif: ["Playfair Display", "Georgia", "serif"]
      }
    },
  },
  plugins: [],
}
