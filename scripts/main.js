var connection = require('./connection')
connection.connect()
var save_RSS_article_list = require('./save_RSS_article_list')

var url ='http://news.163.com/special/00011K6L/rss_newstop.xml' //163 rss 源

// 10分钟执行一次
setInterval(()=>{
    save_RSS_article_list(url)
}, 600000)