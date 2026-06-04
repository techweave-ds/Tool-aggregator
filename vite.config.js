import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { '@': resolve(__dirname, 'src') }
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor:    ['react', 'react-dom', 'react-router-dom'],
          motion:    ['framer-motion'],
          icons:     ['lucide-react'],
        }
      }
    },
    // Cloudflare Workers/Pages edge runtime target
    target: 'es2020',
  },
  // Ensure base is root for Cloudflare Pages
  base: '/',
})
