console.log("JS");

var togetherApp = angular.module('togetherApp', ["ngRoute"]);

togetherApp.config(["$routeProvider", function($routeProvider) {
    $routeProvider
        .when("/home", {
            templateUrl: '../views/home.html',
            controller: 'home'
        })
        .otherwise({
            redirectTo: "/home"
        });


}]);
togetherApp.factory("flix", function() {
    var flix = {};

    return flix;
});

togetherApp.controller('home', ["$scope", "$http", "flix", function($scope, $http, flix) {
    //$scope.wins = theFivery.gValue;
    console.log("Angular loaded.");
}]);
