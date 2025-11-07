import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  root: '.',               // client folder
  build: {
    outDir: 'dist',        // keep build inside client/dist
    emptyOutDir: true
  }
})
