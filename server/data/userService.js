/*eslint-disable */
var MongooseRepository = require("./MongooseRepository"),
    q = require('q');

class UserService extends MongooseRepository {
    constructor() {
        super("User");
    }

    getAllVisible() {
        return MongooseRepository.wrapQueryInPromise(this.Model.find({visible: true}));
    }

    getUser(username) {
        return MongooseRepository.wrapQueryInPromise(this.Model.findOne({username: username}));
    }

    deleteAllNonAdmins() {
        return MongooseRepository.wrapQueryInPromise(this.Model.remove({roles: []}));
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