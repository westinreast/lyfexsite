import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Relative base so the static bundle works at any Cloudflare Pages path.
export default defineConfig({
  base: './',
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
})
