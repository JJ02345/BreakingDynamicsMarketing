import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@/command': resolve(__dirname, 'src/command'),
      '@/squads': resolve(__dirname, 'src/squads'),
      '@/shared': resolve(__dirname, 'src/shared'),
    },
  },
  server: {
    historyApiFallback: true,
  },
  preview: {
    historyApiFallback: true,
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-ui': ['lucide-react'],
          'vendor-pdf': ['jspdf', 'html2canvas'],
          'vendor-supabase': ['@supabase/supabase-js'],
          'vendor-validation': ['zod', 'dompurify'],
        },
      },
    },
    chunkSizeWarningLimit: 600,
  },
})
