import { defineConfig } from 'vite';
import reactRefresh from '@vitejs/plugin-react-refresh';
import viteSvgIcons from 'vite-plugin-svg-icons';
const path = require('path');

// https://vitejs.dev/config/

export default defineConfig({
  plugins: [
    reactRefresh(),
    viteSvgIcons({
      iconDirs: [path.resolve(process.cwd(), 'src/icons')],
      symbolId: 'icon-[dir]-[name]',
    }),
  ],
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
