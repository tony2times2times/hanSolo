console.log("JS");

var togetherApp = angular.module('togetherApp', ["ngRoute"]);

togetherApp.config(["$routeProvider", function($routeProvider) {
    $routeProvider
        .when("/home", {
            templateUrl: '../views/home.html',
            controller: 'homeController'
        })
        .otherwise({
            redirectTo: "/home"
        });


}]);
togetherApp.factory("flix", function() {
    var flix = {
        found: []
    };

    return flix;
});

togetherApp.controller('homeController', ["$scope", "$http", "flix", function($scope, $http, flix) {
    console.log("Home Controller loaded.");
    $scope.flix = [];


    $scope.neflixSearch = function(title) {
        console.log(title);
        $http({
            method: 'GET',
            url: 'http://netflixroulette.net/api/api.php?title=Attack%20on%20titan'
        }).then(function successCallback(response) {
            console.log(response);
        }, function errorCallback(error) {
            console.log('error', error);
        });
    };
    $scope.theMovieDBSearch = function(title) {
        $http({
            method: 'GET',
            url: '/theMovieDB/' + title
        }).then(function successCallback(response) {
            console.log(response);
            flix.found = response.data.results;
            $scope.flix = flix.found;
            $scope.poster();
        }, function errorCallback(error) {
            console.log('error', error);
        });
    };

    $scope.search = function() {
        //pull title off the DOM
        var title = $scope.title;
        console.log('User entered: ' + title);
        //url encode the title and remove leading and trailing white space
        title = encodeURIComponent(title.trim());
        console.log('encoded to: ' + title);
        $scope.theMovieDBSearch(title);
    };
    $scope.poster = function() {
        for (var i = 0; i < $scope.flix.length; i++) {
            if ($scope.flix[i].poster_path === null) {
              $scope.flix[i].poster = '../images/black.jpg';
            } else {
                $scope.flix[i].poster = 'https://image.tmdb.org/t/p/w500' + $scope.flix[i].poster_path;
            }
        }
    };
}]);

//https://api.themoviedb.org/3/search/movie?api_key=661fc8b62286cda55f62d1ec5979c828&query=
//Posters https://image.tmdb.org/t/p/w300_and_h450_bestv2/POSTERURL
