var User = require('../models/user.js');

var UserService = {
    findUserById: function(id, callback) {
        User.findById(id, function(err, user) {
            if (err) {
                return callback(err, null);
            }

            return callback(null, user);
        });
    },

    findUserByGoogleId: function(id, callback) {
        console.log('id: ' + id);
        console.log(typeof id);
        User.findOne({
            'google.id': id
        }, function(err, user) {

            if (err) {
                return callback(err, null);
            }

            return callback(null, user);
        });
    },

    createGoogleUser: function(id, token, name, email, callback) {
        var user = new User();
        user.google.id = id;
        user.google.token = token;
        user.google.name = name;
        user.google.email = email;
        user.favorites = [];
        user.save(function(err) {
            if (err) {
                return callback(err, null);
            }
            return callback(null, user);
        });
    },
};

module.exports = UserService;
