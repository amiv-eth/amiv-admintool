// Start with prod config
const config = require('./webpack.config.prod.js');
// Replace development with production config
config.resolve.alias.networkConfig = `${__dirname}/src/networkConfig.dev.json`;
module.exports = config;
