$(function() {

  var $movieForm = $(".movie-form");
  var $movieArea = $(".jumbotron");
  var $compareMovies = $("#compare-movies");
  var $movie1Weekly = $("#movie1-weekly");
  var $movie2Weekly = $("#movie2-weekly");
  var $movie1Title = $("#movie1-title");
  var $movie2Title = $("#movie2-title");
  var $summary = $("#summary");
  var movies = [{
    title: '',
    urlTitle: ''
  }, {
    title: '',
    urlTitle: ''
  }];

  $movieForm.on("submit", function(e) {
    e.preventDefault();
    var $form = $(this);
    var movieData = $form.find('input').val();
    var $results = $form.parent().siblings().eq(0);
    var idx = $form.data('idx');

    $.get("/movie?movie=" + encodeURIComponent(movieData), function(res) {
      $results.empty();
      if (res.err) { return $results.append(res.err); }
      $results.append("<div>Please select your film:</div>");
      res.forEach(function(movie) {
        $results.append("<div><input type='radio' name='movie"+idx+"' value='"+movie.urlTitle+"'>"+movie.title+"</div>");
      });
    });
  });

  $movieArea.on("click", "input[type='radio']", function() {
    var idx = $(this).parents(".jumbotron").find("form").data("idx");
    movies[idx].urlTitle = this.value;
    movies[idx].title = $(this).parent().text();
  });

  $compareMovies.on("click", function() {
    if (movies[0].urlTitle && movies[1].urlTitle) {
      $.get("/movies?movie1=" + encodeURIComponent(movies[0].urlTitle) + "&movie2=" + encodeURIComponent(movies[1].urlTitle), function(res) {
        $movie1Weekly.empty();
        $movie2Weekly.empty();
        $movie1Title.text(movies[0].title);
        $movie2Title.text(movies[1].title);
        res.movie1.forEach(function(week) {
          $movie1Weekly.append("<li>"+week+"</li>");
        });
        res.movie2.forEach(function(week) {
          $movie2Weekly.append("<li>"+week+"</li>");
        });
        var total1 = res.movie1.reduce(function(prev, cur) {
          return prev + parseInt(cur.replace(/\$|,/g,''));
        },0);
        var total2 = res.movie2.reduce(function(prev, cur) {
          return prev + parseInt(cur.replace(/\$|,/g,''));
        },0);
        var summaryText = '';
        summaryText += movies[0].title + " earned $" + total1.toLocaleString() + " over " + res.movie1.length + " weeks.  ";
        summaryText += movies[1].title + " earned $" + total2.toLocaleString() + " over " + res.movie2.length + " weeks.";
        $summary.text(summaryText);
      });
    }
    
  });

});