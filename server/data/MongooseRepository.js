'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var q = require('q'),
    mongoose = require('mongoose');

var MongooseRepository = (function () {
    function MongooseRepository(mongooseModel) {
        _classCallCheck(this, MongooseRepository);

        this.model = mongoose.model(mongooseModel);
    }

    _createClass(MongooseRepository, [{
        key: 'getBy',
        value: function getBy(id) {
            return MongooseRepository.wrapQueryInPromise(this.model.findById(id));
        }
    }, {
        key: 'getAll',
        value: function getAll() {
            return MongooseRepository.wrapQueryInPromise(this.model.find());
        }
    }, {
        key: 'deleteBy',
        value: function deleteBy(id) {
            return MongooseRepository.wrapQueryInPromise(this.model.findByIdAndRemove(id));
        }
    }, {
        key: 'getCount',
        value: function getCount() {
            return MongooseRepository.wrapQueryInPromise(this.model.count());
        }
    }, {
        key: 'add',
        value: function add(entity) {
            var dbEntity = new this.model(entity);
            dbEntity.save();
            return dbEntity;
        }
    }, {
        key: 'deleteAll',
        value: function deleteAll() {
            return MongooseRepository.wrapQueryInPromise(this.model.remove({}));
        }
    }], [{
        key: 'wrapQueryInPromise',
        value: function wrapQueryInPromise(query) {
            var deferred = q.defer();

            query.exec(function (err, entity) {
                if (err) {
                    deferred.reject(err);
                } else {
                    deferred.resolve(entity);
                }
            });

            return deferred.promise;
        }
    }]);

    return MongooseRepository;
})();

module.exports = MongooseRepository;
