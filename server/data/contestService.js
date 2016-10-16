var MongooseRepository = require('./MongooseRepository');

class ContestService extends MongooseRepository {
  constructor() {
    super('ContestModel');
  }

  getAllVisible() {
    return this.Model.find({ visible: true });
  }
}

module.exports = new ContestService();
