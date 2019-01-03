const fs = require('fs-extra')

fs.copy('demolib', 'demolib1')
    .then(() => console.log('success!'))
    .catch(err => console.error(err));

console.log("脑白金?");