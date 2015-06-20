var MongooseRepository = require("./MongooseRepository"),
    paging = require('../utilities/paging');

class ContestantsService extends MongooseRepository {
    constructor() {
        super("Contestant");
    }

    getAllVisible() {
        return super.wrapQueryInPromise(super.model.find().populate('pictures'));
    }

    getAllApproved() {
        return super.wrapQueryInPromise(super.model.find().where('approved', true).populate('pictures'));
    }

    getQuery(err, success, baseQueryObject, pageSize) {
        paging.populateResponse(err, success, paging.buildQueryObject(baseQueryObject), this.model, 'pictures', pageSize);
    }

    getAdminQuery(err, success, baseQueryObject, pageSize) {
        paging.populateResponse(err, success, paging.buildAdminQueryObject(baseQueryObject), this.model, 'pictures', pageSize);
    }
}

module.exports = new ContestantsService();