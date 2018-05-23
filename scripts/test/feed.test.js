var FeedParser = require('feedparser')
var request = require('request')

function save_RSS_article_list (url) {
    console.log('start feeding')
    var req = request(url)
    var feedparser = new FeedParser()
    var count = 0
    
    req.on('error', function (error) {
      // handle any request errors
      console.log('error', error)
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
      console.log('error', error)
    });
    
    feedparser.on('readable', function () {
        console.log("第 ", ++count, " 篇文章")
        var stream = this; // `this` is `feedparser`, which is a stream
        var item;
        
        while (item = stream.read()) {
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
            console.log("\n\n =============================================================== \n\n")
            console.log("全文链接: ", item.guid)
            console.log("发表于: ", item.pubdate)
            console.log("article length: ", item.description.length)
        }
    })
}
url_array = [
    "http://www.ftchinese.com/rss/news",
    "http://www.ftchinese.com/rss/feed",
    "http://www.ftchinese.com/rss/hotstoryby7day"
]
save_RSS_article_list(url_array[url_array.length - 1])