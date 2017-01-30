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
    if (flix.loggedIn === true) {
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
    }else {
      swal('You are not logged in.' ,
      'You must be logged into favorite movies.', 'error');
    }

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
