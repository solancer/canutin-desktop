const path = require('path');

module.exports = {
  stories: ['../src/**/*.stories.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/preset-create-react-app',
  ],
  webpackFinal: async config => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, '../src/'),
      '@app': path.resolve(__dirname, '../src/app'),
      '@appConstants': path.resolve(__dirname, '../src/app/constants'),
      '@components': path.resolve(__dirname, '../src/app/components'),
      '@pages': path.resolve(__dirname, '../src/app/pages'),
      '@constants': path.resolve(__dirname, '../src/constants'),
      '@assets': path.resolve(__dirname, '../src/app/assets'),
      '@routes': path.resolve(__dirname, '../src/app/routes'),
      '@database': path.resolve(__dirname, '../src/database'),
      '@enums': path.resolve(__dirname, '../src/enums'),
      '@appTypes': path.resolve(__dirname, '../src/types'),
    };
    // keep this if you're doing typescript
    config.resolve.extensions.push('.ts', '.tsx');
    return config;
  },
};
