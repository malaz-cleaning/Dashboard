import { defineConfig } from 'vite';

export default defineConfig({
  base: '/Dashboard/',
  server: {
    port: 5173,
    open: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
  define: {
    __DEV__: JSON.stringify(true),
  },
});
