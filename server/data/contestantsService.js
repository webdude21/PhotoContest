/*eslint-disable */
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var MongooseRepository = require('./MongooseRepository'),
    paging = require('../utilities/paging');

var ContestantsService = (function (_MongooseRepository) {
    _inherits(ContestantsService, _MongooseRepository);

    function ContestantsService() {
        _classCallCheck(this, ContestantsService);

        _get(Object.getPrototypeOf(ContestantsService.prototype), 'constructor', this).call(this, 'Contestant');
    }

    _createClass(ContestantsService, [{
        key: 'getAllVisible',
        value: function getAllVisible() {
            return MongooseRepository.wrapQueryInPromise(this.Model.find().populate('pictures'));
        }
    }, {
        key: 'getAllApproved',
        value: function getAllApproved() {
            return MongooseRepository.wrapQueryInPromise(this.Model.find().where('approved', true).populate('pictures'));
        }
    }, {
        key: 'getQuery',
        value: function getQuery(err, success, baseQueryObject, pageSize) {
            paging.populateResponse(err, success, paging.buildQueryObject(baseQueryObject), this.Model, 'pictures', pageSize);
        }
    }, {
        key: 'getAdminQuery',
        value: function getAdminQuery(err, success, baseQueryObject, pageSize) {
            paging.populateResponse(err, success, paging.buildAdminQueryObject(baseQueryObject), this.Model, 'pictures', pageSize);
        }
    }]);

    return ContestantsService;
})(MongooseRepository);

module.exports = new ContestantsService();
