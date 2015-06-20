'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var q = require('q');

var MongooseRepository = (function () {
    function MongooseRepository(mongooseModel) {
        _classCallCheck(this, MongooseRepository);

        this.model = mongooseModel;
    }

    _createClass(MongooseRepository, [{
        key: 'getById',
        value: function getById(id) {
            var promise = MongooseRepository.getPromise();
            this.model.findById(id).exec(function (err, contestant) {
                if (err) {
                    promise.reject(err);
                } else {
                    promise.resolve(contestant);
                }
            });

            return promise;
        }
    }], [{
        key: 'getPromise',
        value: function getPromise() {
            return q.defer();
        }
    }]);

    return MongooseRepository;
})();

module.exports = MongooseRepository;
