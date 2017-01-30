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
    // if ($scope.flix[index].info === true) {
    //     $scope.flix[index].info = false;
    // } else {
    for (var i = 0; i < $scope.flix.length; i++) {
      $scope.flix[i].info = false;
    }
    //change view for selected movie hide the poster show thier info
    $scope.flix[index].info = true;
    flix.found = $scope.flix;
    //}
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
        //check each movie, if it is listed as adult remove it
        while ($scope.flix[i].adult === true) {
          $scope.flix.splice(i,1);
        }
        //set default states for all movies
        $scope.flix[i].netflix = false;
        $scope.flix[i].info = false;
        $scope.flix[i].favorite = false;
        $scope.flix[i].stars = [];
        //check each movie to see if it is in favorites array
        for (var j = 0; j < flix.favorites.length; j++) {
          if ($scope.flix[i].title === flix.favorites[j].title &&
            $scope.flix[i].release_date === flix.favorites[j].release_date) {
              $scope.flix[i].favorite = true;
            }
          }
          console.log('vote avage: ' + $scope.flix[i].vote_average);
          //add star rating to each film
          for (j = 0; j<($scope.flix[i].vote_average/2) ; j++) {
            $scope.flix[i].stars.push('../images/star.jpg');
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
            $scope.flix[i].poster = ('https://image.tmdb.org/t/p/w780' +
            $scope.flix[i].poster_path);
          }
        }
        //update the factory with found flix and thier properties
        flix.found = $scope.flix;
        console.log('flix found', flix.found);
      };

      $scope.selectFlick = function(index) {
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
      // if ($scope.favorites[index].info === true) {
      //     $scope.favorites[index].info = false;
      // } else {
      for (var i = 0; i < $scope.favorites.length; i++) {
        $scope.favorites[i].info = false;
      }
      //change view for selected movie hide the poster show thier info
      $scope.favorites[index].info = true;
      flix.favorites = $scope.favorites;
      //  }
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
  }]);
  
togetherApp.controller('selectedController', ["$scope", 'vcRecaptchaService',
"$http", "flix", function($scope, vcRecaptchaService, $http, flix) {

  console.log('$selectedController standing by.');
  $scope.selectedFlick = flix.selectedFlick;
  $scope.stars = $scope.selectedFlick.stars;
  $scope.humanValidation = null;
  $scope.widgetId = null;
  $scope.model = {key: '6Ld4gxMUAAAAAASHnclfSWBIZK0ZdLCxorB4Y_vr'};
  console.log('these are the stars of the show ' + $scope.selectedFlick.star);
  //saves token from Google for captcha
  $scope.setResponse = function (response) {
    console.info('Response available');
    $scope.humanValidation = response;
  };

  //creates a new widget id after the old one expires
  $scope.setWidgetId = function (widgetId) {
    console.info('Created widget ID: %s', widgetId);
    $scope.widgetId = widgetId;
  };

  //reloads captcha after experiation
  $scope.cbExpiration = function() {
    console.info('Captcha expired. Resetting response object');
    vcRecaptchaService.reload($scope.widgetId);
    $scope.humanValidation = null;
  };

  //validates captcha and sends the email address from the user to the server
  $scope.submit = function () {
    var valid;
    console.log('sending the captcha response to the server', $scope.humanValidation);
    if (valid) {console.log('Success');
  } else {
    console.log('Failed validation');
    // In case of a failed validation you need to reload the captcha
    // because each response can be checked just once
    vcRecaptchaService.reload($scope.widgetId);
  }
};

$scope.watchTogetherEmail = function() {
  if ($scope.humanValidation === null) {
    swal('Please confirm you are not a robot' ,
    '01101000 01110101 01101101 01100001 01101110 ', 'error');
  } else{
    console.log('sending the captcha response to the server', $scope.humanValidation);
    var movieNight = {};
    movieNight.partner = $scope.watchWith;
    movieNight.flick = $scope.selectedFlick;
    movieNight.humanValidation = $scope.humanValidation;
    $http({
      method: 'PUT',
      url: '/auth/watchTogether',
      data: movieNight
    }).then(function successCallback(response) {
      console.log(response);
      swal("Email Sent", "", "success");
      $scope.watchWith = '';
    }, function errorCallback(error) {
      console.log('error', error);
    }
  );
}
};
}]);
