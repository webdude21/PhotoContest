'use strict';
module.exports = function (applicationConfig) {
    require('./express')(applicationConfig);
    require('./mongoose')(applicationConfig);
    require('./passport')();
    require('./routes')(applicationConfig);
};
