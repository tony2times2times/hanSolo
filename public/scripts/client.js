console.log("JS");

var togetherApp = angular.module('togetherApp', ["ngRoute"]);

togetherApp.config(["$routeProvider", function($routeProvider) {
    $routeProvider
        .when("/home", {
            templateUrl: '../views/home.html',
            controller: 'homeController'
        })
        .when("/favorites", {
            templateUrl: '../views/favorites.html',
            controller: 'homeController'
        })
        .otherwise({
            redirectTo: "/home"
        });
}]);

togetherApp.factory("flix", function() {
    var flix = {
        loggedIn: false,
        found: [],
        favorites: []
    };

    return flix;
});

togetherApp.controller('homeController', ["$scope", "$http", "flix",
    function($scope, $http, flix) {
        console.log("homeController standing by.");
        $scope.flix = [];
        $scope.favorites = flix.favorites;

        $scope.netflixSearch = function(title, year, index) {
            $http({
                method: 'GET',
                url: ('http://netflixroulette.net/api/api.php?title=' +
                    title + '&year=' + year)
            }).then(function successCallback(response) {
                console.log(response);
                $scope.flix[index].netflix = true;
                $scope.flix[index].netflixLink =
                    'https://www.netflix.com/title/' + response.data.show_id;

            }, function errorCallback(error) {
                //console.log('error', error);
            });
        };

        $scope.guidboxSearch = function() {
            $http({
                method: 'GET',
                url: 'http://api-public.guidebox.com/v2/search?type=television&field=title&query=star%20wars&include_links=true&api_key=369b3de88e40804480e4ad25b18aa5d02e16ae22'
            }).then(function successCallback(response) {
                console.log(response);
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
                //set default states for all movies
                $scope.flix[i].netflix = false;
                $scope.flix[i].info = false;
                $scope.flix[i].favorite = false;
                //search the netflix api to see if movie is avalible
                var title = $scope.flix[i].title;
                var year = ($scope.flix[i].release_date.split(/-/))[0];
                $scope.netflixSearch(title, year, i);
                //if no poster is avaible set default poster
                if ($scope.flix[i].poster_path === null) {
                    $scope.flix[i].poster = '../images/black.jpg';
                } else {
                    //this creates a full link to display the poster to the DOM
                    $scope.flix[i].poster = ('https://image.tmdb.org/t/p/w500' +
                        $scope.flix[i].poster_path);
                }
            }
        };

        //change view for selected movie
        $scope.showInfo = function(index) {
            //reset all movies to display only thier poster
            for (var i = 0; i < $scope.flix.length; i++) {
                $scope.flix[i].info = false;
            }
            //change view for selected movie hide the poster show thier info
            $scope.flix[index].info = true;
        };

        $scope.favorite = function(index) {
            $scope.flix[index].favorite = true;
            console.log('user has favorited ' + index);
            flix.favorites.push($scope.flix[index]);
            $scope.favorites = flix.favorites;
            console.log("scope favorites" + $scope.favorites);
            $http({
                method: 'UPDATE',
                url: '/auth/favorites',
                data: $scope.flix[index]
            }).then(function successCallback(response) {
                console.log(response);
            }, function errorCallback(error) {
                console.log('error', error);
            });
        };
    }
]);

togetherApp.controller('favoritesController', ["$scope", "$http", "flix",
    function($scope, $http, flix) {
        console.log('favoritesController standing by.');
        $scope.flix = flix.favorites;
    }
]);

togetherApp.controller('logInController', ["$scope", "$http", "flix",
    function($scope, $http, flix) {
        console.log('logInController standing by.');
        $scope.loggedIn = flix.loggedIn;
        $scope.signOut = function() {
            var auth2 = gapi.auth2.getAuthInstance();
            auth2.signOut().then(function() {
                console.log('User signed out.');
                flix.loggedIn = false;
                $scope.loggedIn = flix.loggedIn;
                $scope.$apply();
            });
        };

        //When a user signs in or opens the web page.
        function onSignIn(googleUser) {
            profile = googleUser.getBasicProfile();
            console.log('Hello ' + profile.getName());
            $http({
                method: 'POST',
                url: '/auth'
            }).then(function successCallback(response) {
                console.log(response);
                var auth = response.data.status;
                var favorites = response.data.favorites;
                if (auth) {
                    flix.loggedIn = true;
                    flix.favorites = favorites;
                } else {
                    flix.loggedIn = false;
                }
            }, function errorCallback(error) {
                console.log('error', error);
            });
            $scope.loggedIn = flix.loggedIn;
            $scope.$apply();
        }
        window.onSignIn = onSignIn;
    }
]);
