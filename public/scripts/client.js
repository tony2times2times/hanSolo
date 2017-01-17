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

togetherApp.controller('homeController', ["$scope", "$http", "flix",
    function($scope, $http, flix) {
        console.log("Home Controller loaded.");
        $scope.flix = [];

        $scope.netflixSearch = function(title, year, index) {
            $http({
                method: 'GET',
                url: ('http://netflixroulette.net/api/api.php?title=' +
                    title + '&year=' + year)
            }).then(function successCallback(response) {
                console.log(response);
                $scope.flix[index].netflix = true;
            }, function errorCallback(error) {
                //console.log('error', error);
            });
        };
        $scope.theMovieDBSearch = function(title) {
            $http({
                method: 'GET',
                url: '/theMovieDB/' + title
            }).then(function successCallback(response) {
                console.log(response);
                //saves found movies to the factory
                $scope.flix = response.data.results;
                $scope.getInfo();
            }, function errorCallback(error) {
                console.log('error', error);
            });
        };

        //search for a title
        $scope.search = function() {
            //pull title off the DOM
            var title = $scope.title;
            console.log('User entered: ' + title);
            //url encode the title and remove leading and trailing
            //white space
            title = encodeURIComponent(title.trim());
            console.log('encoded to: ' + title);
            $scope.theMovieDBSearch(title);
        };

        //processes the flix completing the poster url and thier
        //steaming info and display properties
        $scope.getInfo = function() {
            for (var i = 0; i < $scope.flix.length; i++) {
                $scope.flix[i].netflix = false;
                $scope.flix[i].viewPoster = true;
                $scope.flix[i].info = false;
                var title = $scope.flix[i].title;
                var year = ($scope.flix[i].release_date.split(/-/))[0];
                $scope.netflixSearch(title, year, i);
                if ($scope.flix[i].poster_path === null) {
                    $scope.flix[i].poster = '../images/black.jpg';
                } else {
                    $scope.flix[i].poster = ('https://image.tmdb.org/t/p/w500' +
                        $scope.flix[i].poster_path);
                }
            }
        };

        $scope.showInfo = function(index) {
            for (var i = 0; i < $scope.flix.length; i++) {
                $scope.flix[i].viewPoster = true;
                $scope.flix[i].info = false;
            }
            console.log('changeing view for index: ' + index);
            $scope.flix[index].viewPoster = false;
            $scope.flix[index].info = true;
        };
    }
]);

//     setTimeout(function() {
//     console.log('first function finished');
//     //angular is stupid and does nto refresh the DOM after the delay...stupid
//     $scope.$apply();
// }, 1000);

//link to netflix https://www.netflix.com/title/ + id
//https://api.themoviedb.org/3/search/movie?api_key=661fc8b62286cda55f62d1ec5979c828&query=
//Posters https://image.tmdb.org/t/p/w300_and_h450_bestv2/POSTERURL
