var mongoose = require('mongoose');
var encryption = require('../utilities/encryption');
var rolesConfig = require('../config/roles');

var userSchema = mongoose.Schema({
    username: { type: String, require: '{PATH} is required', unique: true },
    firstName: String,
    lastName: String,
    email: { type: String, require: '{PATH} is required', unique: true },
    facebookId: {type: String, unique: true},
    registerDate: { type: Date, default: Date.now },
    salt: String,
    hashPass: String,
    roles: [String]
});

userSchema.method({
    authenticate: function (password) {
        return encryption.generateHashedText(this.salt, password) === this.hashPass;
    },
    isInRole: function (role) {
        return this.roles.indexOf(role) > -1;
    }
});

var User = mongoose.model('User', userSchema);

module.exports.seedInitialUsers = function () {
    User.find({}).exec(function (err, collection) {
        if (err) {
            console.log('Cannot find users: ' + err);
            return;
        }

        if (collection.length === 0) {
            var salt;
            var hashedPwd;

            salt = encryption.generateSalt();
            hashedPwd = encryption.generateHashedText(salt, 'secret');
            User.create({username: 'webdude', firstName: 'Димо', email: 'webdude@webdude.eu',
                lastName: 'Петров', salt: salt, hashPass: hashedPwd, roles: [rolesConfig.identity.roles.admin]});
            console.log('Users added to database...');
        }
    });
};