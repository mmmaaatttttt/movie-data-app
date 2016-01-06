var express = require('express');
var request = require('request');
var fs = require('fs');
var cheerio = require('cheerio');
var app = express();

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {
  res.render('index');
});

app.get('/movie', function(req, res) {
  var url = 'http://www.boxofficemojo.com/search/?q=' + req.query.movie;

  request(url, function(error, response, html) {
    var $ = cheerio.load(html);
    var body = $("#body");
    body.find('br').remove();
    var resultSummary = body.find('form').next();
    if ((/no movies/gi).test(resultSummary.text())) {
      res.send({err: "Sorry, I didn't find any movies. Try again?"});
    } else {
      var data = [];
      resultSummary.next().children().slice(1).each(function(idx,row) {
        var movieInfo = $(row).children().eq(0).find('font a').eq(0);
        data.push({
          title: movieInfo.text(), 
          urlTitle: movieInfo[0].attribs.href.split("=")[1]
        });
      });
      res.send(data);
    }
  });
});

app.get('/movies', function(req, res) {
  var url1 = 'http://www.boxofficemojo.com/movies/?page=weekly&id=' + req.query.movie1;
  var url2 = 'http://www.boxofficemojo.com/movies/?page=weekly&id=' + req.query.movie2;

  function grabWeeklyData(html) {
    var weeklies = [];
    var $ = cheerio.load(html);
    var tables = $(".chart-wide");
    tables.each(function(idx, table) {
      $(table).children().slice(1).each(function(idx, row) {
        weeklies.push($(row).children().eq(2).text());
      });
    });
    return weeklies;
  }

  request(url1, function(error, response, html) {
    var data = {};
    data.movie1 = grabWeeklyData(html);
    request(url2, function(error, response, html) {
      data.movie2 = grabWeeklyData(html);
      res.send(data);
    });
  });
});

app.listen(3002, function() {
  console.log("Listening on localhost:3002");
});