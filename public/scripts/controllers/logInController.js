togetherApp.controller('logInController', ["$scope", "$location", "$http", "flix",
function($scope, $location, $http, flix) {
  console.log('logInController standing by.');

  $scope.signOut = function() {
    $http({
      method: 'GET',
      url: '/auth/logout'
    }).then(function successCallback(response) {
      console.log(response);
      $scope.loggedIn = false;
      flix.loggedIn = false;
    });
  };

  $scope.goToFavorites = function(){
    if (flix.loggedIn === true) {
      $location.path('/favorites');
    }else {
      swal('You are not logged in.' ,
      'You must be logged into view favorites.', 'error');
    }
  };
  //When a user signs in or opens the web page.
  $scope.authenticateUser = function () {
    $http({
      method: 'POST',
      url: '/auth'
    }).then(function successCallback(response) {
      console.log(response);
      var auth = response.data.status;
      var favorites = response.data.favorites;
      if (auth) {
        console.log('user is authenticated');
        $scope.loggedIn = true;
        flix.loggedIn = true;
        flix.favorites = favorites;

      } else {
        console.log('user is NOT authenticated');
        flix.loggedIn = false;
      }
    }, function errorCallback(error) {
      console.log('error', error);
    });
  };
  $scope.authenticateUser();
}]);
