'use strict';

var exports = {};
require('../utilities/helpers').autoRequireFiles(__dirname,
    function (keyName, transformedFileName) {
        exports[keyName.charAt(0).toUpperCase() + keyName.slice(1)] = require('./' + transformedFileName);
    });

module.exports = exports;
