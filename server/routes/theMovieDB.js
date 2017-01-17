// global vairables and imported software
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var path = require('path');
var https = require('https');

router.get('/:id', function(req, res) {
  console.log("req.params:" , req.params);
    var title=req.params.id;
    var url = ('https://api.themoviedb.org/3/search/movie?api_key=661fc8b62286cda55f62d1ec5979c828&query=' + title);

    https.get(url, function(response) {
        var body = '';

        response.on('data', function(chunk) {
            body += chunk;
        });

        response.on('end', function() {
            var flix = JSON.parse(body);
            console.log('The following has been found:', flix);
            res.send(flix);
        });
    }).on('error', function(e) {
        console.log("Got an error: ", e);
    });

});
///////////////
// $http({
//     method: 'GET',
//     url: ' https://api.themoviedb.org/3/search/movie?api_key=661fc8b62286cda55f62d1ec5979c828&query=.' + title
// }).then(function successCallback(response) {
//     console.log(response);
// }, function errorCallback(error) {
//     console.log('error', error);
// });
// };


module.exports = router;

// var options = {
//   host: 'https://api.themoviedb.org',
//   //port: '80',
//   path: '/3/search/movie?api_key=661fc8b62286cda55f62d1ec5979c828&query=star%20wars',
//   method: 'GET',
//   // headers: {
//   //   'Content-Type': 'application/x-www-form-urlencoded',
//   //   'Content-Length': post_data.length
//   // }
// };
//
// var request = http.request(options, function(response) {
//   console.log('from the movie DB:', response);
//   res.send(response);
//   // response is here
// });
//
// // write the request parameters
// //request.write('post=data&is=specified&like=this');
// request.end();
