const fs = require('fs-extra')

fs.copy('build-jbuild4d-web-platform/templates', '../jbuild4d-web-root/jbuild4d-web-platform/src/main/resources/templates1')
    .then(() => console.log('success!'))
    .catch(err => console.error(err));

console.log("拷贝模版完成!");