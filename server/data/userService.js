'use strict';
var MongooseRepository = require('./MongooseRepository');

class UserService extends MongooseRepository {
  constructor() {
    super('User');
  }

  getUser(username) {
    return this.Model.findOne({ username: username });
  }

  deleteAllNonAdmins() {
    return this.Model.remove({ roles: [] });
  }

  findOrCreate(userData, resolve) {
    var that = this;

    this.getUser(userData.username)
      .then(function (user) {
        resolve(user ? user : that.add(userData));
      }, function () {
        resolve(that.add(userData));
      });
  }
}

module.exports = new UserService();
