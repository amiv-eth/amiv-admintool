// Start with prod config
const config = require('./webpack.config.prod.js');
// Replace prod with dev config
config.resolve.alias.networkConfig = `${__dirname}/src/networkConfig.dev.json`;

console.log(config.resolve.alias.networkConfig);

module.exports = config;
