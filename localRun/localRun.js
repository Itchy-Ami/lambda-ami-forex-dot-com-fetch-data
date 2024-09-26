const handler = require('../src/app').handler;


handler({})
    .then(r => console.log(r))
    .catch(e => console.error(e));