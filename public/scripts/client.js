console.log("JS");

var togetherApp = angular.module('togetherApp', ["ngRoute"]);

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

//define the flix factory.
togetherApp.factory("flix", function() {
    var flix = {};
    flix.loggedIn = false;
    flix.found = [];
    flix.favorites = [];
    flix.selectedFlick = {};
    return flix;
});

togetherApp.controller('homeController', ["$scope", "$location", "$http", "flix",
    function($scope, $location, $http, flix) {
        console.log("homeController standing by.");
        //controller variables -- sourced in from flix controller
        $scope.flix = flix.found;
        $scope.favorites = flix.favorites;

        //sets display/info for all flix on the DOM
        $scope.showInfo = function(index) {
            //default
            for (var i = 0; i < $scope.flix.length; i++) {
                $scope.flix[i].info = false;
            }
            //change view for selected movie hide the poster show thier info
            $scope.flix[index].info = true;
            flix.found = $scope.flix;
        };
        $scope.favorite = function(index) {
            flix.found[index].favorite = true;
            flix.favorites.push(flix.found[index]);
            $http({
                method: 'PUT',
                url: '/auth/favorites',
                data: flix.favorites
            }).then(function successCallback(response) {
                console.log(response);
            }, function errorCallback(error) {
                console.log('error', error);
            });
            $scope.found = flix.found;
        };

        $scope.unfavorite = function(index) {
            flix.found[index].favorite = false;
            /*search threw the favorites array and find where the title and year
            both match and delete that movie.*/
            for (var j = 0; j < flix.favorites.length; j++) {
                if ($scope.flix[index].title === flix.favorites[j].title &&
                    $scope.flix[index].release_date === flix.favorites[j].release_date) {
                    flix.favorites.splice(j, 1);
                    break;
                }
            }
            $http({
                method: 'PUT',
                url: '/auth/favorites',
                data: flix.favorites
            }).then(function successCallback(response) {
                console.log(response);
            }, function errorCallback(error) {
                console.log('error', error);
            });
            $scope.favorites = flix.favorites;
        };

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
                //check each movie to see if it is in favorites array
                for (var j = 0; j < flix.favorites.length; j++) {
                    if ($scope.flix[i].title === flix.favorites[j].title &&
                        $scope.flix[i].release_date === flix.favorites[j].release_date) {
                        $scope.flix[i].favorite = true;
                    }
                }
                //search the netflix api to see if movie is avalible
                var title = $scope.flix[i].title;
                var year = ($scope.flix[i].release_date.split(/-/))[0];
                $scope.netflixSearch(title, year, i);
                //if no poster is avaible set default poster
                if ($scope.flix[i].poster_path === null) {
                    $scope.flix[i].poster = '../images/black.jpg';
                } else {
                    //this creates a full link to display the poster to the DOM
                    $scope.flix[i].poster = ('https://image.tmdb.org/t/p/w1280' +
                        $scope.flix[i].poster_path);
                }
            }
            //update the factory with found flix and thier properties
            flix.found = $scope.flix;
            console.log('flix found', flix.found);
        };

        $scope.watchTogetherEmail = function(index) {
          //console.log($scope.flix[index]);

          //console.log('sending email to: ' + $scope.watchWith);
            $http({
                method: 'PUT',
                url: '/auth/watchTogether',
                data: 'stringy'
            }).then(function successCallback(response) {
                console.log(response);
            }, function errorCallback(error) {
                console.log('error', error);
            });

        };

        $scope.selectFlick = function(index){
          console.log("changing to view flick");
          flix.selectedFlick = $scope.flix[index];
          $location.path('/selected');
        };
    }
]);

togetherApp.controller('favoritesController', ["$scope", "$http", "flix",
    function($scope, $http, flix) {
        console.log('favoritesController standing by.');
        $scope.favorites = flix.favorites;
        $scope.favorite = function(index) {
            flix.favorites.push(flix.favorites[index]);
            $http({
                method: 'PUT',
                url: '/auth/favorites',
                data: flix.favorites
            }).then(function successCallback(response) {
                console.log(response);
            }, function errorCallback(error) {
                console.log('error', error);
            });
            $scope.favorites = flix.favorites;
        };

        $scope.unfavorite = function(index) {
            flix.favorites.splice(flix.favorites[index], 1);
            $http({
                method: 'PUT',
                url: '/auth/favorites',
                data: flix.favorites
            }).then(function successCallback(response) {
                console.log(response);
            }, function errorCallback(error) {
                console.log('error', error);
            });
            $scope.favorites = flix.favorites;
        };

        $scope.showInfo = function(index) {
            for (var i = 0; i < $scope.favorites.length; i++) {
                $scope.favorites[i].info = false;
            }
            //change view for selected movie hide the poster show thier info
            $scope.favorites[index].info = true;
            flix.favorites = $scope.favorites;
        };
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
                if (response.data.status) {
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

togetherApp.controller('selectedController', ["$scope", "$http", "flix",
    function($scope, $http, flix) {
        console.log('selectedController standing by.');
        $scope.selectedFlick = flix.selectedFlick;

    }
]);
