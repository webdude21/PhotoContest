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

    getById(id) {
        return wrapQueryInPromise(this.model.findById(id));
    }

    getAll() {
        return wrapQueryInPromise(this.model.find());
    }
}

module.exports = MongooseRepository;