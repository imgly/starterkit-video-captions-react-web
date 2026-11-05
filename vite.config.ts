import { resolve } from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173
  },
  // Prevent duplicate React instances when using @cesdk/cesdk-js
  resolve: {
    dedupe: ['react', 'react-dom'],
    alias: {
      react: resolve(import.meta.dirname, 'node_modules/react'),
      'react-dom': resolve(import.meta.dirname, 'node_modules/react-dom')
    }
  }
});
