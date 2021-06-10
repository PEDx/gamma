import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import reactRefresh from '@vitejs/plugin-react-refresh';
const path = require('path');

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [reactRefresh(), vue()],
  resolve: {
    alias: [{ find: '@', replacement: path.resolve(__dirname, 'src') }],
  },
  esbuild: {
    jsxInject: `import React from 'react'`,
  },
  build: {
    outDir: 'build',
  },
  clearScreen: false,
});
