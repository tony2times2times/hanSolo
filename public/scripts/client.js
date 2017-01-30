console.log("JS");

var togetherApp = angular.module('togetherApp', ["ngRoute", 'vcRecaptcha']);

//handle angular routing within the application
togetherApp.config(["$routeProvider", function($routeProvider) {
  $routeProvider
  .when("/home", {
    templateUrl: '../views/home.html',
    controller: 'homeController'
  })
  .when("/favorites", {
    templateUrl: '../views/favorites.html',
    controller: 'favoritesController'
  })
  .when("/selected", {
    templateUrl: '../views/selected.html',
    controller: 'selectedController'
  })
  .otherwise({
    redirectTo: "/home"
  });
}]);
