/*
 * 从 rss 源获取最新的文章列表和 guid
*/

var FeedParser = require('feedparser');
var request = require('request'); // for fetching the feed
var save_article_to_database = require('./save_article_to_database');

var url ='http://news.163.com/special/00011K6L/rss_newstop.xml' //有效

function rss_spider (url) {
  var req = request(url)
  var feedparser = new FeedParser();
  
  req.on('error', function (error) {
    // handle any request errors
  });
  
  req.on('response', function (res) {
    var stream = this; // `this` is `req`, which is a stream
  
    if (res.statusCode !== 200) {
      this.emit('error', new Error('Bad status code'));
    }
    else {
      stream.pipe(feedparser);
    }
  });
  
  feedparser.on('error', function (error) {
    // always handle errors
  });
  
  feedparser.on('readable', function () {
    console.log('data get ***')
    var stream = this; // `this` is `feedparser`, which is a stream
    var item;
  
    while (item = stream.read()) {
      console.log('while')
      let newDate = new Date()
      let timestamp = newDate.toLocaleDateString()
      
      //  article object 是数据库存数据的配置
      let article = {
        title: item.title,
        description: item.description,
        content: null,
        publish_time: item.pubdate,
        publish_source: item.source,
        guid: item.guid,
        created_at: timestamp,
      }
      
      save_article_to_database(article)
    }
    console.log('data get ===')
  })
}
rss_spider(url)
module.exports = rss_spider