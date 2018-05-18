var express = require('express');
var app = express();
var feed_new_article = require('./rssspider');

var url ='http://news.163.com/special/00011K6L/rss_newstop.xml' //有效

app.get('/', function(req, res) {
  feed_new_article(url);
  res.json({
    test: 'test'
  })
});

var server = app.listen(3000, function() {
  console.log('listening at 3000');
});