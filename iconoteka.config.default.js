const path = require('path');

const config = {
    componentsOverrides: 
        {
            
        },
    iconotekaJson: path.join(process.cwd(), 'iconoteka', 'iconoteka.json'),
    iconotekaFilesPath: path.join(process.cwd(), 'iconoteka')
};

module.exports = config;
