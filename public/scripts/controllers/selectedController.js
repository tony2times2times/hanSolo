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
  }else if (flix.loggedIn === false) {
    swal('You are not logged in.' ,
    'You must be logged into email friends.', 'error');
  }else{
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
