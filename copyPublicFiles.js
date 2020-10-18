const { exists } = require('find-up');
const config = require('./iconoteka.config');
const cpx = require('cpx');
const path = require('path');

if (!config.publicFiles || !config.publicFiles.length) {
    process.exit(0);
}

const public = path.join(__dirname, 'public');

console.log('Copying public files');
config.publicFiles.forEach(item => {
    console.log(`Copy ${item} to ${public}`);
    cpx.copySync(item, public);
});

