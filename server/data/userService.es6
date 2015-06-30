var MongooseRepository = require("./MongooseRepository"),
    q = require('q');

class UserService extends MongooseRepository {
    constructor() {
        super("User");
    }

    getAllVisible() {
        return MongooseRepository.wrapQueryInPromise(this.model.find({visible: true}));
    }

    getUser(username) {
        return MongooseRepository.wrapQueryInPromise(this.model.findOne({username: username}));
    }

    deleteAllNonAdmins() {
        return MongooseRepository.wrapQueryInPromise(this.model.remove({roles: []}));
    }

    findOrCreate(userData, resolve) {
        User.findOne({username: userData.username})
            .exec(function (err, user) {
                if (err) {
                    resolve(err, false);
                }

                if (user) {
                    resolve(null, user);
                } else {
                    var newUser = new User(userData);
                    newUser.save(function () {
                        resolve(null, newUser);
                    });
                }
            });
    }
}

module.exports = new UserService();