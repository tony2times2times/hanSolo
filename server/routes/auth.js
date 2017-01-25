var express = require('express');
var router = express.Router();
var passport = require('../config/passport.js');
//var mongoose = require('mongoose');
//var User = require('../models/user.js');
var UserService = require('../services/user.js');
var util = require('util');

router.get('/google', passport.authenticate('google', {
    scope: ['openid', 'email'],
    //prompt: 'select_account',
}));

// IMPORTANT: URL--the first parameter below--must match
// callbackUrl in {@link config/auth}.

router.get('/google/callback', passport.authenticate('google', {
    successRedirect: '/', // take them to their private data
    failureRedirect: '/', // take them back home to try again
}));

///////////////// Help me Dev you're my only hope ///////////////////////////////
router.post('/', function(req, res) {
    if (req.isAuthenticated()) {
        var userId = req.user.id;
        console.log("user id is: " + userId);
        UserService.findUserById(userId, function(err, user) {
            if (err) {
                console.log(err);
            } else {
                res.json({
                    status: true,
                    favorites: user.favorites
                });
            }
        });
    } else {
        res.json({
            status: false
        });
    }
});

//update user favorites
router.update('/favorites', function(req, res) {
    if (req.isAuthenticated()) {
        var userId = req.user.id;
        var favorites = req.body.data;
        console.log('save to DB: ' + favorites);
        UserService.updateFavoritesById(userId, favorites, function(err, user) {
            if (err) {
                console.log(err);
                res.json({
                    status: 'user found not able to update'
                });
            } else {
                res.json({
                    status: 'successfully updated favorites',
                    user: user
                });
            }
        });
    } else {
        res.json({
            status: 'user not authenticated'
        });
    }
});

//log out User
router.get('/logout', function(req, res) {
    req.logout();
    res.sendStatus(200);
});

//export module
module.exports = router;
