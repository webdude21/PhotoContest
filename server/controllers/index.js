'use strict';

var exports = {};
require('../utilities/helpers').autoRequireFiles(__dirname, function (keyName, transformedFileName) {
    exports[keyName] = require('./' + transformedFileName);
});

module.exports = exports;
