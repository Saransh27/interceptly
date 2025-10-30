import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import fs from 'fs'

const __dirname = path.resolve()

// Custom plugin to copy manifest.json
const copyManifestPlugin = {
  name: 'copy-manifest',
  apply: 'build' as const,
  enforce: 'post' as const,
  generateBundle() {
    try {
      const src = path.resolve(__dirname, 'manifest.json')
      
      if (fs.existsSync(src)) {
        const content = fs.readFileSync(src, 'utf-8')
        this.emitFile({
          type: 'asset',
          fileName: 'manifest.json',
          source: content,
        })
        console.log('✓ manifest.json will be emitted')
      }
    } catch (err) {
      console.error('✗ Error preparing manifest:', err)
    }
  },
  writeBundle() {
    try {
      const src = path.resolve(__dirname, 'manifest.json')
      const dest = path.resolve(__dirname, 'dist/manifest.json')
      if (fs.existsSync(src)) {
        fs.copyFileSync(src, dest)
        console.log('✓ manifest.json copied to dist/')
      }
    } catch (err) {
      console.error('✗ Error copying manifest:', err)
    }
  },
}

export default defineConfig({
  plugins: [react(), copyManifestPlugin],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        dev: path.resolve(__dirname, 'src/dev.html'),
        popup: path.resolve(__dirname, 'src/popup/popup.html'),
        options: path.resolve(__dirname, 'src/options/options.html'),
        'background/service-worker': path.resolve(__dirname, 'src/background/service-worker.ts'),
        'content/content-script': path.resolve(__dirname, 'src/content/content-script.ts'),
      },
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: '[name].js',
        assetFileNames: '[name].[ext]',
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  ssr: {
    noExternal: true,
  },
})
