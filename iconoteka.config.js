const findUp = require('find-up');
const path = require('path');
const merge = require('lodash.merge');

const defaultConfig = require('./iconoteka.config.default');

const configFilename = 'iconoteka.config.js';
const customConfigPath = findUp.sync(configFilename, {
    cwd: path.resolve(path.join(process.cwd(), '..'))
});

let config = {};

if (customConfigPath) {
    const appConfig = require(customConfigPath);
    console.log(`Iconoteka engine: using config "${customConfigPath}" `);
    config = merge(defaultConfig, appConfig);
} else {
    console.error('Iconoteka engine: no iconoteka.config.js found');
    process.exit(1);
}


module.exports = config;

