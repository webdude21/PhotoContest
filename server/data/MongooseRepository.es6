var q = require('q'),
    mongoose = require('mongoose');

class MongooseRepository {
    constructor(mongooseModel) {
        this.model = mongoose.model(mongooseModel);
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
        return MongooseRepository.wrapQueryInPromise(this.model.findById(id));
    }

    getAll() {
        return MongooseRepository.wrapQueryInPromise(this.model.find());
    }

    deleteBy(id) {
        return MongooseRepository.wrapQueryInPromise(this.model.findByIdAndRemove(id));
    }

    getCount() {
        return MongooseRepository.wrapQueryInPromise(this.model.count());
    }

    add(entity) {
        var dbEntity = new this.model(entity);
        dbEntity.save();
        return dbEntity;
    }

    deleteAll() {
        return MongooseRepository.wrapQueryInPromise(this.model.remove({}));
    }
}

module.exports = MongooseRepository;