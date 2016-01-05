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

app.listen(3002, function() {
  console.log("Listening on localhost:3002");
});