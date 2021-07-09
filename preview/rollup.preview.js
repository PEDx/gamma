import typescript from 'rollup-plugin-typescript';
import postcss from 'rollup-plugin-postcss';

export default {
  input: './preview/index.ts',
  plugins: [
    typescript({
      exclude: 'node_modules/**',
      typescript: require('typescript'),
    }),
    postcss(),
  ],
  output: {
    dir: 'preview/build',
  },
};
