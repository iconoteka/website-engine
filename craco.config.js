const path = require('path');
const config = require('./iconoteka.config.js');

const cwd = process.env.ICONOTEKA_ORIGINAL_CWD;
const craPathsPath = path.resolve(`${cwd}/node_modules/react-scripts/config/paths.js`);
const craPaths = require(craPathsPath);


module.exports = {
  webpack: {
    configure: webpackConfig => {

      // Set correct output dir 
      // Note that we have to override cra paths in order to get successful build
      craPaths.appBuild = path.join(cwd, 'build');
      webpackConfig.output.path = craPaths.appBuild
      require.cache[craPathsPath].exports = craPaths;

      // Remove ModuleScopePlugin to allow importing files outside of src dir
      const scopePluginIndex = webpackConfig.resolve.plugins.findIndex(
        ({ constructor }) => constructor && constructor.name === 'ModuleScopePlugin'
      );

      webpackConfig.resolve.plugins.splice(scopePluginIndex, 1);

      // Remove exclusive inclusion of /src from babel loader 

      delete webpackConfig.module.rules[2].oneOf[1].include;

      // Do not process node_modules by babel loader
      webpackConfig.module.rules[2].oneOf[1].exclude = /node_modules\/(?!\@iconoteka).*/;
      
      // Map components overrides to webpack aliases
      if (config.componentsOverrides) {
        Object.keys(config.componentsOverrides).forEach(componentName => {
          webpackConfig.resolve.alias[`components/${componentName}`] = config.componentsOverrides[componentName];
        });
      }
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

