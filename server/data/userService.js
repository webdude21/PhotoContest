"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var MongooseRepository = require("./MongooseRepository"),
    q = require("q");

var UserService = (function (_MongooseRepository) {
    function UserService() {
        _classCallCheck(this, UserService);

        _get(Object.getPrototypeOf(UserService.prototype), "constructor", this).call(this, "User");
    }

    _inherits(UserService, _MongooseRepository);

    _createClass(UserService, [{
        key: "getAllVisible",
        value: function getAllVisible() {
            return MongooseRepository.wrapQueryInPromise(this.model.find({ visible: true }));
        }
    }, {
        key: "getUser",
        value: function getUser(username) {
            return MongooseRepository.wrapQueryInPromise(this.model.findOne({ username: username }));
        }
    }, {
        key: "deleteAllNonAdmins",
        value: function deleteAllNonAdmins() {
            return MongooseRepository.wrapQueryInPromise(this.model.remove({ roles: [] }));
        }
    }, {
        key: "findOrCreate",
        value: function findOrCreate(userData, resolve) {
            User.findOne({ username: userData.username }).exec(function (err, user) {
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
    }]);

    return UserService;
})(MongooseRepository);

module.exports = new UserService();