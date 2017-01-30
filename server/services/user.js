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

    createGoogleUser: function(id, token, givenName, familyName, email, picture, callback) {
        var user = new User();
        user.google.id = id;
        user.google.token = token;
        user.google.givenName = givenName;
        user.google.familyName = familyName;
        user.google.email = email;
        user.google.picture = picture;
        user.favorites = [];
        user.save(function(err) {
            if (err) {
                return callback(err, null);
            }
            return callback(null, user);
        });
    },

    updateFavoritesById: function(id, favorites, callback) {
        User.update({_id:id}, {favorites:favorites}, function(err, user) {
            if (err) {
                return callback(err, null);
            }

            return callback(null, user);
        });
    },
};

module.exports = UserService;
