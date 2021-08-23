const path = require('path');
const typescript = require('rollup-plugin-typescript2');

const distDir = 'dist';

export default {
  input: path.resolve(__dirname, 'index.ts'),
  external: [],
  plugins: [
    typescript({
      check: true,
      tsconfig: path.resolve(__dirname, '../../tsconfig.json'),
      cacheRoot: path.resolve(__dirname, '../../node_modules/.rts2_cache'),
      tsconfigOverride: {
        compilerOptions: {
          declaration: true, // 生成类型声明文件
        },
        include: [path.resolve(__dirname, 'src')],
      },
    }),
  ],
  output: {
    name: 'runtime',
    file: path.resolve(__dirname, distDir, 'index.js'),
    format: 'umd',
  },
};
