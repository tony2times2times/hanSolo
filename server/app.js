//global variables and imported software
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var session = require('express-session');
var router = require('./routes/index.js');
var theMovieDBRouter = require('./routes/theMovieDB.js');
var mongoURI = "mongodb://localhost:27017/togetherflix";
var MongoDB = mongoose.connect(mongoURI).connection;
var util = require('util');
var session = require('express-session');
var configs = require('./config/auth');
var passport = require('./config/passport');
var authRouter = require('./routes/auth.js');
var private = require('./routes/private/index.js');
var isLoggedIn = require('./utils/auth.js');

//app.use('/public', express.static('public'));  // serve files from public
app.use(express.static('public'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
/** ---------- DATABASE CONNECTION HANDLING ---------- **/
//database();
/** ---------- SESSION CREATION AND STORAGE ---------- **/
/**
 * Creates session that will be stored in memory.
 * @todo Before deploying to production,
 * configure session store to save to DB instead of memory (default).
 * @see {@link https://www.npmjs.com/package/express-session}
 */
app.use(session({
  secret: configs.sessionVars.secret,
  key: 'user',
  resave: 'true',
  saveUninitialized: false,
  cookie: { maxage: 60000, secure: false },
}));
/** ---------- PASSPORT ---------- **/
app.use(passport.initialize()); // kickstart passport
/**
 * Alters request object to include user object.
 * @see {@link auth/passport}
 */
app.use(passport.session());
/////////////////////////////////////
//console.log(util.inspect(myObject, false, null))
//use bodyParser to read incoming json objects
//app.use(bodyParser.json());

//if there is a connection error with mongo log it to the terminal
MongoDB.on('error', function (err) {
    console.log('mongodb connection error:', err);
});

//start connection with MongoDB
MongoDB.once('open', function () {
  console.log('mongodb connection open!');
});

//listen on port 2305
app.listen('2305', function(){
  console.log('listening on 2305');
});


app.use('/', router);
//route movie data base requests to its own router
app.use('/theMovieDB', theMovieDBRouter);
app.use('/auth', authRouter);
app.use('/private', isLoggedIn, private);
