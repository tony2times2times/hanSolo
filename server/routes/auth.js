var express = require('express');
var app = express();
var express = require('express');
var router = express.Router();
var passport = require('../config/passport.js');
var UserService = require('../services/user.js');
var bodyParser = require('body-parser');
var nodemailer = require('nodemailer');
var schedule = require('node-schedule');

//Parses the bodys
app.use(bodyParser.json());

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
router.put('/favorites', function(req, res) {
    if (req.isAuthenticated()) {
        var userId = req.user.id;
        var favorites = req.body;
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

router.put('/watchTogether', emailFriend); // handle the route at yourdomain.com/sayHello

function emailFriend(req, res) {
// a = 'varname';
// str = a+' = '+'123';
// eval(str)

    var text = 'Hello world from TogetherFlix!';
    var mailOptions = {
        from: 'officialtogetherflix@gmail.com', // sender address
        to: 'tonyperaza86@gmail.com', // list of receivers
        subject: 'Great Success!', // Subject line
        //text: text //, // plaintext body
        html: '<b>Hello world from together flix! ✔</b>' // You can choose to send an HTML body instead
    };
    var transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'officialtogetherflix@gmail.com',
            pass: '31DdcH7WxvqMdTIxcUUv'
        }
    });

    var startTime = new Date(Date.now() + 1800000);
    var endTime = new Date(now.getTime() + 1000);
    var j = schedule.scheduleJob({
        start: startTime,
        end: endTime,
        rule: '*/1 * * * * *'
    }, function() {
      transporter.sendMail(mailOptions, function(error, info) {
          if (error) {
              console.log(error);
              res.json({
                  yo: 'error'
              });
          } else {
              console.log('Message sent: ' + info.response);
              res.json({
                  yo: info.response
              });
          }
      });
    });
    j.cancel();

}

//export module
module.exports = router;
