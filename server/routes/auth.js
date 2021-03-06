var express = require('express');
var app = express();
var express = require('express');
var router = express.Router();
var passport = require('../config/passport.js');
var UserService = require('../services/user.js');
var bodyParser = require('body-parser');
var nodemailer = require('nodemailer');
var schedule = require('node-schedule');
var now = new Date();
var email = require('../utils/email.js');

//Parses the bodys
app.use(bodyParser.json());

router.get('/google', passport.authenticate('google', {
  scope: ['openid', 'email' ],
  prompt: 'select_account',
}));

// IMPORTANT: URL--the first parameter below--must match
// callbackUrl in {@link config/auth}.

router.get('/google/callback', passport.authenticate('google', {
  successRedirect: '/',
  failureRedirect: '/',
}));

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
  if (req.isAuthenticated()) {
    // a = 'varname';
    // str = a+' = '+'123';
    // eval(str)
    var sender = req.user.google.givenName + ' ' + req.user.google.familyName;
    if (req.user.google.givenName === undefined) {
      sender = req.user.email;
    }
    var partner = req.body.partner;
    var poster = req.body.flick.poster;
    var title = req.body.flick.title;
    var mailOptions = {
      from: 'officialtogetherflix@gmail.com',
      to: partner,
      subject: 'Watch a movie with '+ sender,
      html: email.watchTogether(sender, partner, poster, title)
    };
    var transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: 'officialtogetherflix@gmail.com',
        pass: '31DdcH7WxvqMdTIxcUUv'
      }
    });

    var startTime = new Date(Date.now() + 1); //1800000
    var endTime = new Date(startTime.getTime() + 1000);
    var j = schedule.scheduleJob({
      start: startTime,
      end: endTime,
      rule: '*/1 * * * * *'
    }, function() {
      transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log('Message sent: ' + info.response);
        }
      });
    });
    //j.cancel();
    res.json({
      status: "Your message will be sent in 30 minutes"
    });
  }else {
    res.json({
      status: true,
      favorites: user.favorites
    });
  }
}

//export module
module.exports = router;
