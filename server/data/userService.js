const MongooseRepository = require('./MongooseRepository');

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
    this.getUser(userData.username)
      .then(
        (user) => resolve(user ? user : this.add(userData)),
        () => resolve(this.add(userData)));
  }
}

module.exports = new UserService();
