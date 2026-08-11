import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname),
    },
  },
  plugins: [
    react(),
    tailwindcss(),
  ],
  build: {
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui': ['@radix-ui/react-checkbox', '@radix-ui/react-slot', '@radix-ui/react-toast'],
          'data': ['@tanstack/react-query', '@supabase/supabase-js'],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
  define: {
    // Remove console.log in production builds
    __DEV__: JSON.stringify(process.env.NODE_ENV !== 'production'),
  },
})