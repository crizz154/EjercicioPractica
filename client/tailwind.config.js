/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{html,js,jsx,ts,tsx}', // Busca en todos los archivos .html, .js, .jsx, .ts, .tsx dentro de la carpeta src
    './public/index.html',  // Si tienes archivos HTML dentro de la carpeta public
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
