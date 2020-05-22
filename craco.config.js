const path = require('path');
const config = require('./iconoteka.config.js');

module.exports = {
  webpack: {
    configure: webpackConfig => {
      
      // Remove ModuleScopePlugin to allow importing files outside of src dir
      const scopePluginIndex = webpackConfig.resolve.plugins.findIndex(
        ({ constructor }) => constructor && constructor.name === 'ModuleScopePlugin'
      );

      webpackConfig.resolve.plugins.splice(scopePluginIndex, 1);

      // Remove exclusive inclusion of /src from babel loader 

      delete webpackConfig.module.rules[2].oneOf[1].include;

      // Do not process node_modules by babel loader
      webpackConfig.module.rules[2].oneOf[1].exclude = /node_modules/;
      
      // Map components overrides to webpack aliases
      if (config.componentsOverrides) {
        Object.keys(config.componentsOverrides).forEach(componentName => {
          webpackConfig.resolve.alias[`components/${componentName}`] = config.componentsOverrides[componentName];
        });
      }
      // Set components alias (must come after all custom overrides)
      webpackConfig.resolve.alias['components'] = path.join(__dirname, 'src', 'components');

      return webpackConfig;
    }
  }
};

