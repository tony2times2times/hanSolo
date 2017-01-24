// global vairables and imported software
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Flick = require('../models/flix.js');
var path = require('path');
var passport = require('passport');
var configPort = require('../config/passport.js');


// base url returns index.html from public foulder
router.get('/', function(req, res) {
    console.log('Base URL reached. Returning index.html');
    res.sendFile(path.resolve('public/views/index.html'));
});

//handles get requests from clients and submits them to mongoDB
router.get('/getflix/', function(req, res) {
    console.log('getting flix');
    Flick.find({}, function(err, userResults) {
        if (err) {
            console.log(err);
            res.sendStatus(500);
        } else {
            //console.log('users: ' + userResults);
            res.send(userResults);
        }
    });
});

//handles pull requests from clients ands ubmits them to mongoDB
router.post('/postFlic', function(req, res) {
    console.log('posting data to DB!!!');
    //package new Flick fro req.body using the Flick.js schema
    var newFlick = new Flick({
        name: req.body.name,
        animal: req.body.animal,
        age: req.body.age,
        image: req.body.image
    });
    //saves new Flick to mongoDB
    newFlick.save(function(err) {
        if (err) {
            console.log("erorr: " + err);
            res.sendStatus(500);
        } else {
            console.log("New Flick posted.");
            res.sendStatus(200);
        }
    });
});

router.delete('/deleteFlick/:id', function(req, res) {
    console.log('deleting Flick from DB!!!');
    Flick.findByIdAndRemove(req.params.id, function(err) {
        if (err) {
            console.log("erorr: " + err);
            res.send(req.body);
        } else {
            console.log("Flick has been euthanized");
            res.send(req.body);
        }
    });
});

// // Google routes
// router.get('/auth/google', passport.authenticate('google', {
//     scope: ['profile', 'email']
// }));
//
// router.get('/auth/google/callback', passport.authenticate('google'),function(){
//   console.log('this is working');
// }
// );

//makes router availble to server.js
module.exports = router;
