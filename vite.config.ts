import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { mkdirSync, writeFileSync } from 'node:fs'

/**
 * Utilidad de desarrollo: recibe capturas del canvas 3D y las guarda en
 * `capturas/`. Sirve para revisar el modelado sin depender de una captura de
 * pantalla manual. No se incluye en el sitio publicado.
 */
function capturas(): Plugin {
  return {
    name: 'charms-capturas',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use('/__captura', (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405
          return res.end()
        }
        let cuerpo = ''
        req.on('data', (c) => (cuerpo += c))
        req.on('end', () => {
          try {
            const { nombre, dataUrl } = JSON.parse(cuerpo)
            const base64 = String(dataUrl).split(',')[1]
            mkdirSync('capturas', { recursive: true })
            writeFileSync(`capturas/${nombre}.png`, Buffer.from(base64, 'base64'))
            res.end('ok')
          } catch (e) {
            res.statusCode = 400
            res.end(String(e))
          }
        })
      })
    },
  }
}

// Rutas relativas: el sitio funciona igual en GitHub Pages, Netlify, Vercel
// o abierto desde una carpeta local. Se usa HashRouter para evitar 404 en Pages.
export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss(), capturas()],
})
