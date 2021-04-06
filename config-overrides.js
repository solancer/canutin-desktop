const { override, addWebpackAlias } = require('customize-cra');
const path = require('path');

function addRendererTarget(config) {
  config.target = 'electron-renderer';

  return config;
}

module.exports = override(
  addRendererTarget,
  // add an alias for "ag-grid-react" imports
  addWebpackAlias({
    ['@app']: path.resolve(__dirname, './src/app'),
    ['@appConstants']: path.resolve(__dirname, './src/app/constants'),
    ['@components']: path.resolve(__dirname, './src/app/components'),
    ['@pages']: path.resolve(__dirname, './src/app/pages'),
    ['@constants']: path.resolve(__dirname, './src/constants'),
    ['@assets']: path.resolve(__dirname, './src/app/assets'),
    ['@routes']: path.resolve(__dirname, './src/app/routes'),
    ['@database']: path.resolve(__dirname, './src/database'),
    ['@tests']: path.resolve(__dirname, './src/__tests__'),
  })
);
