var express = require('express');
var app = express();
var request = require('request');
var cheerio = require('cheerio');
var feed_new_article = require('./rssspider');

var url ='http://news.163.com/special/00011K6L/rss_newstop.xml' //有效

app.get('/', function(req, res) {

    feed_new_article(url);
 
  request('http://www.jd.com', function(error, response, body) {
    if (!error && response.statusCode == 200) {
      $ = cheerio.load(body);
      res.json({
          cat: $('.cate_menu_item').length
      });
    }
  })
});

var server = app.listen(3000, function() {
  console.log('listening at 3000');
});

