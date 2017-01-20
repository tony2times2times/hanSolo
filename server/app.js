//global variables and imported software
var express = require('express');
var app = express();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var router = require('./routes/index.js');
var theMovieDBRouter = require('./routes/theMovieDB.js');
var mongoURI = "mongodb://localhost:27017/togetherflix";
var MongoDB = mongoose.connect(mongoURI).connection;
var util = require('util');


//console.log(util.inspect(myObject, false, null))
//use bodyParser to read incoming json objects
app.use(bodyParser.json());

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

//make the public foulder accessable to clients
app.use(express.static('public'));
