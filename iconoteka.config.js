const defaultConfig = require('./iconoteka.config.default');
const merge = require('lodash.merge');

const customConfigPath = process.env.REACT_APP_CONFIG_PATH;

let config = {};

if (customConfigPath) {
    const appConfig = require(customConfigPath);
    config = merge(defaultConfig, appConfig);
} else {
    config = defaultConfig;
}


module.exports = config;

