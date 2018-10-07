const path = require('path');
const withCSS = require('@zeit/next-css');

module.exports = withCSS({
  cssModules: true,
  webpack: config => {
    config.resolve.alias.index = path.resolve('./');
    return config;
  },
});
