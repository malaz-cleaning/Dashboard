import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  base: '/Dashboard/',
  server: {
    port: 5173,
    open: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      input: {
        index: resolve(__dirname, 'index.html'),
        login: resolve(__dirname, 'login.html'),
        analytics: resolve(__dirname, 'analytics.html'),
        chalets: resolve(__dirname, 'chalets.html'),
        clients: resolve(__dirname, 'clients.html'),
        orders: resolve(__dirname, 'orders.html'),
        settings: resolve(__dirname, 'settings.html'),
      },
    },
  },
  define: {
    __DEV__: JSON.stringify(true),
  },
});
