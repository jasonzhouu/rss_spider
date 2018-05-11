/*
 * 从 rss 源获取最新的文章列表和 guid
*/

var FeedParser = require('feedparser');
var request = require('request'); // for fetching the feed
var query = require('./database_connect');

// url ='http://36kr.com/feed'
// url ='http://news.163.com/special/00011K6L/rss_gn.xml' //无效
// url='http://news.qq.com/newsgn/rss_newsgn.xml' //有效
// url = 'http://news.baidu.com/n?cmd=1&class=civilnews&tn=rss' //无效
// url = "http://tech.163.com/special/00091JPQ/techimportant.xml" //有效
// url="http://news.ifeng.com/rss/index.xml" //无效

module.exports = function(url) {
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
    // This is where the action is!
    var stream = this; // `this` is `feedparser`, which is a stream
    var meta = this.meta; // **NOTE** the "meta" is always available in the context of the feedparser instance
    var item;
  
    while (item = stream.read()) {
      for (var i in item) {
        // console.log(i)
          console.log(item.guid)
      }
      // console.log(item)


      //  article object 是数据库存数据的配置
      let article = {
          title: item.title,
          content: item.description,
          publish_time: item.pubdate,
          publish_source: item.source,
          guid: item.guid
      }

      
      //插入数据
      query('INSERT INTO articles SET ?', article, (err, res) => {
        if(err) throw err;
        //输出插入结果
        console.log('Last insert ID:', res.insertId);
      });

    }

  });
}