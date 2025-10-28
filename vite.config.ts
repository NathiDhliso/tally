import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Enable tree-shaking and minification (esbuild is faster and built-in)
    minify: 'esbuild',
    // Enable code splitting for better caching
    rollupOptions: {
      output: {
        manualChunks: {
          // Separate vendor chunks for better caching
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'framer-motion': ['framer-motion'],
          'lucide-icons': ['lucide-react'],
        },
      },
    },
    // Increase chunk size warning limit (we're optimizing)
    chunkSizeWarningLimit: 600,
    // Enable source maps for debugging (can be disabled in production)
    sourcemap: false,
  },
})
