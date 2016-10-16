var MongooseRepository = require('./MongooseRepository');

class PageService extends MongooseRepository {
  constructor() {
    super('Page');
  }

  getFirstPage() {
    return this.Model.findOne();
  }
}

module.exports = new PageService();
