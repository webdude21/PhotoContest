/*eslint-disable */
var MongooseRepository = require('./MongooseRepository');

class ContestService extends MongooseRepository {
    constructor() {
        super('ContestModel');
    }

    getAllVisible() {
        return MongooseRepository.wrapQueryInPromise(this.Model.find({visible: true}));
    }
}

module.exports = new ContestService();