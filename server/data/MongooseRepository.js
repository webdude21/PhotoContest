'use strict';
var q = require('q'),
    mongoose = require('mongoose');

class MongooseRepository {
    constructor(mongooseModel) {
        this.Model = mongoose.model(mongooseModel);
    }

    static wrapQueryInPromise(query) {
        var deferred = q.defer();

        query.exec((err, entity) => {
            if (err) {
                deferred.reject(err);
            } else {
                deferred.resolve(entity);
            }
        });

        return deferred.promise;
    }

    getBy(id) {
        return MongooseRepository.wrapQueryInPromise(this.Model.findById(id).populate('registrant'));
    }

    getAll() {
        return MongooseRepository.wrapQueryInPromise(this.Model.find());
    }

    deleteBy(id) {
        return MongooseRepository.wrapQueryInPromise(this.Model.findByIdAndRemove(id));
    }

    getCount() {
        return MongooseRepository.wrapQueryInPromise(this.Model.count());
    }

    add(entity) {
        var dbEntity = new this.Model(entity);
        dbEntity.save();
        return dbEntity;
    }

    deleteAll() {
        return MongooseRepository.wrapQueryInPromise(this.Model.remove({}));
    }
}

module.exports = MongooseRepository;