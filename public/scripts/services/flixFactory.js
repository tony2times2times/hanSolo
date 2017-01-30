togetherApp.factory("flix", function() {
  var flix = {};
  flix.loggedIn = false;
  flix.found = [];
  flix.favorites = [];
  flix.selectedFlick = {};
  return flix;
});
