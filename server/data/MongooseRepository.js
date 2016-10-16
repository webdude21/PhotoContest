var mongoose = require('mongoose');

class MongooseRepository {
  constructor(mongooseModel) {
    this.Model = mongoose.model(mongooseModel);
  }

  getBy(id) {
    return this.Model.findById(id);
  }

  getAll() {
    return this.Model.find();
  }

  deleteBy(id) {
    return this.Model.findByIdAndRemove(id);
  }

  getCount() {
    return this.Model.count();
  }

  add(entity) {
    var dbEntity = new this.Model(entity);
    dbEntity.save();
    return dbEntity;
  }

  deleteAll() {
    return this.Model.remove({});
  }
}

module.exports = MongooseRepository;
