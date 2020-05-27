const path = require('path');
const cwd = process.env.ICONOTEKA_ORIGINAL_CWD || process.env.INIT_CWD;
const config = {
    cwd,
    componentsOverrides: 
        {
            
        },
    iconotekaJson: path.join(cwd, 'iconoteka', 'iconoteka.json'),
    iconotekaFilesPath: path.join(cwd, 'iconoteka')
};

module.exports = config;
