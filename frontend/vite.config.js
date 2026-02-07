import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'


// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './tests/setup.js',
  },
  server: {
    host: true,           // Listen on 0.0.0.0 inside the container
    port: 5173,
    strictPort: true,     // Fail if 5173 is taken (so port mapping stays valid)
    hmr: {
      host: 'localhost',  // HMR connects via the host published port
      port: 5173
    },
    watch: {
      usePolling: true,   // Improve file watching reliability in Docker/WSL/Windows
      interval: 100
    }
  }
})
