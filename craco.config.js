const path = require('path');
const config = require('./iconoteka.config.js');

const craPathsPath = path.resolve(`${config.cwd}/node_modules/react-scripts/config/paths.js`);
const craPaths = require(craPathsPath);


module.exports = {
  webpack: {
    configure: webpackConfig => {

      // Set correct output dir 
      // Note that we have to override cra paths in order to get successful build
      craPaths.appBuild = path.join(config.cwd, 'build');
      webpackConfig.output.path = craPaths.appBuild
      require.cache[craPathsPath].exports = craPaths;

      // Remove ModuleScopePlugin to allow importing files outside of src dir
      const scopePluginIndex = webpackConfig.resolve.plugins.findIndex(
        ({ constructor }) => constructor && constructor.name === 'ModuleScopePlugin'
      );

      webpackConfig.resolve.plugins.splice(scopePluginIndex, 1);

      // Remove exclusive inclusion of /src from babel loader 

      delete webpackConfig.module.rules[2].oneOf[1].include;

      // Do not process node_modules by babel loader, but keep processing this module
      webpackConfig.module.rules[2].oneOf[1].exclude = /node_modules\/(?!\@iconoteka).*/;
      
      // Map components overrides to webpack aliases
      if (config.componentsOverrides) {
        Object.keys(config.componentsOverrides).forEach(componentName => {
          webpackConfig.resolve.alias[`components/${componentName}`] = config.componentsOverrides[componentName];
        });
      }
      
      // Map common styles overrides to webpack aliases
      if (config.commonStyles) {
        Object.keys(config.commonStyles).forEach(fileName => {
          webpackConfig.resolve.alias[`common-styles/${fileName}`] = config.commonStyles[fileName];
        });
      }

      // Set base common-styles alias (must come after custom overrides)
      webpackConfig.resolve.alias['common-styles'] = path.join(__dirname, 'src', 'common-styles');

      // Set iconoteka.json alias
      webpackConfig.resolve.alias['iconoteka.json'] = config.iconotekaJson;

      // Set iconoteka files alias
      webpackConfig.resolve.alias['iconoteka-files'] = config.iconotekaFilesPath;

      // Set components alias (must come after all custom overrides)
      webpackConfig.resolve.alias['components'] = path.join(__dirname, 'src', 'components');


      return webpackConfig;
    }
  }
};

