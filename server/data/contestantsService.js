'use strict';
var MongooseRepository = require('./MongooseRepository'),
    paging = require('../utilities/paging'),
    approved = { approved: true };

class ContestantsService extends MongooseRepository {
    constructor() {
        super('Contestant');
    }

    getByVoteCount() {
        return MongooseRepository.wrapQueryInPromise(this
            .Model
            .find(approved)
            .sort({ votes: 'descending' }));
    }

    getAllVisible() {
        return MongooseRepository.wrapQueryInPromise(this
            .Model
            .find()
            .populate('pictures'));
    }

    getAllApproved() {
        return MongooseRepository.wrapQueryInPromise(this
            .Model
            .find(approved)
            .populate('pictures'));
    }

    getQuery(err, success, baseQueryObject, pageSize) {
        paging.populateResponse(err, success, paging
            .buildQueryObject(baseQueryObject), this.Model, 'pictures', pageSize);
    }

    getAdminQuery(err, success, baseQueryObject, pageSize) {
        paging.populateResponse(err, success, paging
            .buildAdminQueryObject(baseQueryObject), this.Model, 'pictures', pageSize);
    }

    getAllContestantsByUser(user) {
        return MongooseRepository.wrapQueryInPromise(this
            .Model
            .find({ registrant: user._id }));
    }
}

module.exports = new ContestantsService();
