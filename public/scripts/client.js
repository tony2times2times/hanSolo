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
    var flix = {};

    return flix;
});

togetherApp.controller('homeController', ["$scope", "$http", "flix", function($scope, $http, flix) {
    console.log("Home Controller loaded.");
    $scope.flix = [];


    $scope.neflixSearch = function() {
        $http({
            method: 'GET',
            url: 'http://netflixroulette.net/api/api.php?title=Attack%20on%20titan'
        }).then(function successCallback(response) {
            console.log(response);
        }, function errorCallback(error) {
            console.log('error', error);
        });
    };
    $scope.omdbSearch = function() {
        $http({
            method: 'GET',
            url: '/'
        }).then(function successCallback(response) {
            console.log(response);
        }, function errorCallback(error) {
            console.log('error', error);
        });
    };
    $scope.tvMazeSearch = function() {
        $http({
            method: 'GET',
            url: 'http://api.tvmaze.com/singlesearch/shows?q=galavant'
        }).then(function successCallback(response) {
            console.log(response);
        }, function errorCallback(error) {
            console.log('error', error);
        });
    };
    $scope.omdbSearch();
    $scope.tvMazeSearch();
    $scope.neflixSearch();
}]);
