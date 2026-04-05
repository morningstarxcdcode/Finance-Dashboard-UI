import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/Finance-Dashboard-UI/',
  plugins: [react()],
  build: {
    outDir: 'docs',
    emptyOutDir: true,
  },
});