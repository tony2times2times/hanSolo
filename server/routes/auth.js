var express = require('express');
var router = express.Router();
var passport = require('../config/passport.js');

router.get('/google', passport.authenticate('google',
  {
    scope: ['openid', 'email', 'https://www.googleapis.com/auth/calendar'],
    //prompt: 'select_account',
  })
);

  // IMPORTANT: URL--the first parameter below--must match
  // callbackUrl in {@link config/auth}.

router.get('/google/callback', passport.authenticate('google',
  {
    successRedirect: '/', // take them to their private data
    failureRedirect: '/', // take them back home to try again
  })
);

///////////////// Help me Dev you're my only hope ///////////////////////////////
router.get('/', function (req, res) {
  if (req.isAuthenticated()) {
    res.json({ status: true, name: req.user.googleName });
  } else {
    res.json({ status: false });
  }

});

router.get('/logout', function (req, res) {
  req.logout();
  res.sendStatus(200); // they made it!
});

module.exports = router;
