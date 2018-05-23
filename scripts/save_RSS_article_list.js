/*
 * 从 rss 源获取最新的文章列表和 guid
*/

var FeedParser = require('feedparser')
var request = require('request')
var my_emitter = require('./my_emitter')
var connection = require('./connection')

function save_article_to_database(article) {
  connection.query('INSERT INTO articles SET ?', article, (err, res) => {
    if(err) throw err;
    //输出插入结果
    console.log('Last insert item ID:', res.insertId)
    console.clear()
    // my_emitter.emit('new_article')
  })
}

function check_and_save(article) {
  connection.query('select id from articles where guid = ?', article.guid, (err, res)=>{
    // if exists
    if(res[0]) {
      // console.log(`${res[0].id} article already exists`)
    }
    // if not exists
    else save_article_to_database(article)
  })  
}

// 先检查文章是否已经存在，然后再确定是否保存到数据库
function save_RSS_article_list (url) {
  var req = request(url)
  var feedparser = new FeedParser()
  
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
      
      check_and_save(article)
    }
  })
}

function iteralte_all_rss(url_array) {
  url_array.forEach((url, index, array) => {
    save_RSS_article_list(url)
  })
}

url_array = [
  "http://news.163.com/special/00011K6L/rss_newstop.xml", //163 rss 源
  "http://www.ftchinese.com/rss/news",                    // FT 中文 RSS 源 ------今日焦点
  "http://www.ftchinese.com/rss/feed",                    // FT 中文 RSS 源 ------每日更新
  "http://www.ftchinese.com/rss/hotstoryby7day",          // FT 中文 RSS 源 ------十大热门文章
]

iteralte_all_rss(url_array)

module.exports = save_RSS_article_list