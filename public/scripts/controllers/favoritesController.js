togetherApp.controller('favoritesController', ["$scope", '$location', "$http", "flix",
function($scope, $location, $http, flix) {
  console.log('favoritesController standing by.');
  $scope.favorites = flix.favorites;

  //if the user has no favorites tell them how to add them
  if ($scope.favorites.length<= 0) {
    $scope.noFav = true;
  }

  //reset display for all movies
  for (var i = 0; i < $scope.favorites.length; i++) {
    $scope.favorites[i].info = false;
  }


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
    flix.favorites.splice(index, 1);
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
    //  }
  };

  $scope.selectFlick = function(index) {
    console.log("changing to view flick");
    flix.selectedFlick = $scope.favorites[index];
    $location.path('/selected');
  };

}
]);
