/*
 * 从 rss 源获取最新的文章列表和 guid
*/

var FeedParser = require('feedparser')
var request = require('request')
var my_emitter = require('./my_emitter')
var connection = require('./connection')
// connection.connect()

function save_article_to_database(article, count) {
  connection.query('INSERT INTO articles SET ?', article, (err, res) => {
    if(err) throw err;
    console.log(`\n\n ============================  保存到数据库：获取到的第 ${count} RSS 文章 =============================== \n\n`)
      console.log('插入行 ID:', res.insertId)
      if(article.guid.slice(0,15) == 'http://36kr.com') return
    my_emitter.emit('new_article')
  })
}

function check_and_save(article, count) {
  connection.query('select id from articles where guid = ?', article.guid, (err, res)=>{
    // if exists
    if(res[0]) {
      // console.log(`${res[0].id} article already exists`)
    }
    // if not exists
    else save_article_to_database(article, count)
  })  
}

// 先检查文章是否已经存在，然后再确定是否保存到数据库
function save_RSS_article_list (url) {
  var req = request(url)
  var feedparser = new FeedParser()
  let count = 0
  
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
      let timestamp = newDate.toLocaleString()

      console.log(`============= 获取到第 ${++count} 篇 RSS 文章: ${item.guid} =============`)

      // for(var key in item) console.log(key)

      if(item.description == null) return

      //  article object 是数据库存数据的配置
      let article = {
        title: item.title,
        description: item.description,
        content: item.content,
        publish_time: item.pubdate || '****/**/**',
        publish_source: item.source,
        guid: item.guid,
        created_at: timestamp,
      }

        if(url == "http://36kr.com/feed") {
            article.content = item.description
        }
      
      check_and_save(article, count)
    }
  })
}

// url = "http://www.xinhuanet.com/politics/news_politics.xml",  //新华网

// save_RSS_article_list(url)

module.exports = save_RSS_article_list
