import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
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
          // Vendor chunks - split large dependencies
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-ui': ['lucide-react'],
          'vendor-pdf': ['jspdf', 'html2canvas'],
          'vendor-supabase': ['@supabase/supabase-js'],
          'vendor-dompurify': ['dompurify'],
        },
      },
    },
    // Increase chunk size warning limit (we're optimizing anyway)
    chunkSizeWarningLimit: 600,
  },
})
