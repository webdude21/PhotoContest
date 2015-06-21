var MongooseRepository = require("./MongooseRepository");

class ContestService extends MongooseRepository {
    constructor() {
        super("Contest");
    }

    getAllVisible() {
        return super.wrapQueryInPromise(super.model.find({visible: true}));
    }
}

module.exports = new ContestService();