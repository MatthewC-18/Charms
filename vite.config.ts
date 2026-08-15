import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Rutas relativas: el sitio funciona igual en GitHub Pages, Netlify, Vercel
// o abierto desde una carpeta local. Se usa HashRouter para evitar 404 en Pages.
export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss()],
})
