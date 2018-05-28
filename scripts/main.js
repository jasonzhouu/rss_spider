var connection = require('./connection')
var save_RSS_article_list = require('./save_RSS_article_list')
var exec_python = require('./exec_python')
var countdownInterval
const time_per_round = 60 * 10 // 10分钟抓取一次
connection.connect()

url_array = [
    "http://news.163.com/special/00011K6L/rss_newstop.xml", //163 rss 源
    "http://www.ftchinese.com/rss/news",                    // FT 中文 RSS 源 ------今日焦点
    "http://www.ftchinese.com/rss/feed",                    // FT 中文 RSS 源 ------每日更新
    "http://www.ftchinese.com/rss/hotstoryby7day",          // FT 中文 RSS 源 ------十大热门文章
    "http://www.xinhuanet.com/politics/news_politics.xml",  //新华网
]

function iterate_all_rss(url_array) {
    url_array.forEach((url, index, array) => {
        save_RSS_article_list(url)
    })
}

function countdown(cycle) {
    console.log('距离下一次 RSS 请求还有 : ', cycle, ' 秒')
    countdownInterval = setInterval(()=>{
        console.log('距离下一次 RSS 请求还有 : ', --cycle, ' 秒')
        if (cycle == 0) {
            clearInterval(countdownInterval)
        }
    }, 1000)
}

function three_oclock() {
    let now = new Date()
    let localtime = now.toLocaleTimeString()
    let hour = localtime.slice(0,2)*1 //获取当前的小时
    let minute = localtime.slice(3,5)*1 //获取当前的分钟
    if (hour == 3 && minute <=10) {
        console.log("\n==================================\n     it's time to execute python file \n==================================\n")
        exec_python()
    }
}

function new_around() {
    console.log('\n ================= \n    new around    \n ================= \n')
    three_oclock()
    clearInterval(countdownInterval)
    countdown(time_per_round)
    iterate_all_rss(url_array)
}

console.log('开始运行...')

new_around()
setInterval(new_around, time_per_round*1000)