/// <reference types="vitest" />

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import wasm from 'vite-plugin-wasm';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

export default defineConfig({
  plugins: [
    react(),
    wasm(),
    nodePolyfills({
      include: ['buffer', 'process', 'util', 'assert'],
      globals: {
        Buffer: true,
        global: true,
        process: true,
      },
    }),
  ],

  build: {
    target: 'esnext',
  },

  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './tests/setup.ts',
  },

  server: {
    port: 3000,
  },
});
