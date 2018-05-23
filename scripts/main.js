var connection = require('./connection')
var save_RSS_article_list = require('./save_RSS_article_list')
var countdownInterval, time_per_round = 60
url_array = [
    "http://news.163.com/special/00011K6L/rss_newstop.xml", //163 rss 源
    "http://www.ftchinese.com/rss/news",                    // FT 中文 RSS 源 ------今日焦点
    "http://www.ftchinese.com/rss/feed",                    // FT 中文 RSS 源 ------每日更新
    "http://www.ftchinese.com/rss/hotstoryby7day",          // FT 中文 RSS 源 ------十大热门文章
]

connection.connect()

function countdown(time_per_round) {
    console.log('time remain: ', time_per_round, ' seconds')
    countdownInterval = setInterval(()=>{
        console.log('time remain: ', --time_per_round, ' seconds')
        if (time_per_round == 0) {
            clearInterval(countdownInterval)
        }
    }, 1000)
}

function new_around() {
    console.log('\n ================= \n    new around    \n ================= \n')
    clearInterval(countdownInterval)
    countdown(time_per_round)
    save_RSS_article_list(url_array)
}

console.log('start running...')
new_around()
setInterval(new_around, time_per_round*1000)