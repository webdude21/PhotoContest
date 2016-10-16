var MongooseRepository = require('./MongooseRepository'),
  paging = require('../utilities/paging'),
  approved = { approved: true };

class ContestantsService extends MongooseRepository {
  constructor() {
    super('Contestant');
  }

  getBy(id) {
    return this
      .Model
      .findById(id)
      .populate('registrant');
  }

  getByVoteCount() {
    return this
      .Model
      .find(approved)
      .sort({ votes: 'descending' });
  }

  getAllVisible() {
    return this
      .Model
      .find()
      .populate('pictures');
  }

  getAllApproved() {
    return this
      .Model
      .find(approved)
      .populate('pictures');
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
    return this
      .Model
      .find({ registrant: user._id });
  }
}

module.exports = new ContestantsService();
