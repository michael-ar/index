const path = require('path');

module.exports = {
  webpack: config => {
    config.resolve.alias.index = path.resolve('./');
    return config;
  },
};
