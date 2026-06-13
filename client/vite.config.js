import { defineConfig } from 'vite';
export default defineConfig({
  server: {
    port: 5173,
    proxy: {
      // Proxy OAuth redirect through Vite dev server so /api/auth/github works locally
      '/api': { target: 'http://localhost:3000', changeOrigin: true },
    },
  },
  build: { outDir: '../dist', emptyOutDir: true },
});
