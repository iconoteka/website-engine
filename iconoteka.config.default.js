const path = require('path');
const cwd = process.env.ICONOTEKA_ORIGINAL_CWD || process.cwd();
const config = {
    cwd,
    componentsOverrides: 
        {
            
        },
    iconotekaJson: path.join(cwd, 'iconoteka', 'iconoteka.json'),
    iconotekaFilesPath: path.join(cwd, 'iconoteka')
};

module.exports = config;
