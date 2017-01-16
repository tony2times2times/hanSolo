var movies = [];

$(document).ready(function functionName() {
    $("#search_button").click(function() {
        var title = $('#movieTitle').val();
        console.log('Now searching for ' + title);
        search(title);
    });

    var search = function(movieTitle) {
        $.ajax({
            url: 'http://www.omdbapi.com/?s=' + movieTitle,
            dataType: 'JSON',
            success: function(data) {
                console.log(data);
                for (var i = 0; i < data.Search.length; i++) {
                    movies[i] = data.Search[i];
                }
                console.log('Found ' + movies.length + " movies with that title.");
                printToDom();
            }
        });
    };
});

function printToDom() {
    console.log('Now printing: ' + movies);
    for (var i = 0; i < (movies.length-1) ; i++) {
      $('#displayMovies').append('<div id="title"> Movie Title: ' + movies[i].Title +' (' +movies[i].Year + ') </div> <br>');
      $('#displayMovies').append('<img class="img-responsive center-block" src="'+ movies[i].Poster + '"></img>"' + '<br>');
    }
}

// http://netflixroulette.net/api/api.php?title=Attack%20on%20titan
