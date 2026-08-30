import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: './',
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'gsap': ['gsap'],
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'motion': ['motion'],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
})
