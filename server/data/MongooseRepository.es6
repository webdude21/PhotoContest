var q = require('q'),
    mongoose = require('mongoose');

class MongooseRepository {
    constructor(mongooseModel) {
        this.model = mongoose.model(mongooseModel);
    }

    static wrapQueryInPromise(query) {
        var promise = q.defer();

        query.exec((err, entity) => {
            if (err) {
                promise.reject(err);
            } else {
                promise.resolve(entity);
            }
        });

        return promise;
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

    addContestant(entity) {
        return new this.model(entity).save();
    }

    deleteAll() {
        return MongooseRepository.wrapQueryInPromise(this.model.remove({}))
    }
}

module.exports = MongooseRepository;