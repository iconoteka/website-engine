## Iconoteka website engine

Use it by adding @iconoteka/engine dependency and configure by creating iconoteka.config.js into your project.

Sample config:
```js
const path = require('path');

module.exports = {

    componentsOverrides: 
        {
          // REQUIRED: path to iconoteka.json file
          iconotekaJson: path.join(__dirname, 'iconoteka.json'),
          // REQUIRED: directory contaning icons files
          iconotekaFilesPath: path.join(__dirname, 'iconoteka.json'),
          // Add custom footer
          Footer: path.join(__dirname, 'Footer.jsx'),
          // Or just override footer styles
          'Footer/Footer.scss': path.join(__dirname, 'Footer.scss'),
        },
};
```
