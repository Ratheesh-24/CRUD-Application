import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      external: ['react-icons/fi'],
    },
    outDir: 'dist',
    emptyOutDir: true
  },
  server: {
    proxy: {
      '/api': {
        target: process.env.NODE_ENV === 'production' 
          ? 'https://crud-application-a3g2.onrender.com' 
          : 'http://localhost:4000',
        changeOrigin: true,
        secure: false
      }
    }
  }
})
