'use strict';
var mongoose = require('mongoose');

class MongooseRepository {
    constructor(mongooseModel) {
        this.Model = mongoose.model(mongooseModel);
    }

    static wrapQueryInPromise(query) {
        return new Promise(function (resolve, reject) {
            query.exec((err, entity) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(entity);
                }
            });
        });
    }

    getBy(id) {
        return MongooseRepository.wrapQueryInPromise(thiss.Model.findById(id).populate('registrant'));
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
