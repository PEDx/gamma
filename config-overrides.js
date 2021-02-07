/* eslint-disable react-hooks/rules-of-hooks */
const {
  override,
  useBabelRc,
  addWebpackAlias,
  addBabelPlugins,
} = require('customize-cra');
const path = require('path');

module.exports = override(
  addBabelPlugins(['@babel/plugin-proposal-export-default-from']),
  useBabelRc(),
  addWebpackAlias({
    ['@']: path.resolve(__dirname, 'src'),
  }),
);
