import legacy from '@vitejs/plugin-legacy'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import { readdirSync } from 'fs'
import { defineConfig } from 'vite'

const PICTURES_DIR = path.join(process.cwd(), 'public/pictures')
const IMAGE_RE = /\.(png|jpe?g|gif|webp|avif|svg)$/i

function listPictures() {
  try {
    return readdirSync(PICTURES_DIR).filter(f => IMAGE_RE.test(f))
  } catch {
    return []
  }
}

const picturesPlugin = () => ({
  name: 'pictures-manifest',
  // Dev: serve /pictures/manifest.json dynamically — always fresh
  configureServer(server) {
    server.middlewares.use('/pictures/manifest.json', (_req, res) => {
      res.setHeader('Content-Type', 'application/json')
      res.setHeader('Cache-Control', 'no-store')
      res.end(JSON.stringify(listPictures()))
    })
  },
  // Build: emit manifest.json as a static asset
  generateBundle() {
    this.emitFile({
      type: 'asset',
      fileName: 'pictures/manifest.json',
      source: JSON.stringify(listPictures())
    })
  }
})

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    legacy(),
    picturesPlugin()
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom'
  }
})
