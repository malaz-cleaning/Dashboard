import { defineConfig } from 'vite';
import { resolve } from 'path';
import fs from 'fs';

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
      },
    },
  },
  define: {
    __DEV__: JSON.stringify(true),
  },
  plugins: [
    {
      name: 'copy-sw',
      apply: 'build',
      generateBundle() {
        const swContent = fs.readFileSync(resolve(__dirname, 'sw.js'), 'utf-8');
        this.emitFile({
          type: 'asset',
          fileName: 'sw.js',
          source: swContent,
        });
      },
    },
  ],
});
