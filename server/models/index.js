'use strict';

var exports = {};
require('../utilities/helpers').autoRequireFiles(__dirname, function (keyName, transformedFileName) {
    var upperCasedKeyName = keyName[0].toUpperCase() + keyName.slice(1);
    exports[upperCasedKeyName] = require('./' + transformedFileName);
});

module.exports = exports;
