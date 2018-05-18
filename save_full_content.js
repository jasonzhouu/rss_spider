/*
 * 获取一篇全文，然后保存到数据库
 * 步骤：
 * 1. 使用 request 向 guid 发起请求
 * 2. 使用 cheerio 将返回的 html 解析成对象
 * 3. 只留文章那部分 html
 * 4. 保存到数据库
 */

var request = require('request')
var iconv = require('iconv-lite')
var cheerio = require('cheerio')
var save_content_to_database = require('./save_content_to_database')
// var connection = require('./connection')
// connection.connect()
var url = 'http://news.163.com/14/0513/08/9S453V5B00014JB6.html'
var headers = {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_4) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/11.1 Safari/605.1.15'
}
/*
 * 作用: 请求并解析全文
 * param: url
 * 返回 Promise(content)
 */
function crawler (url) {
    url = url.slice(0, -5).concat('_all.html')

    return new Promise(resolve => {

        // 向 guid 发起 http 请求
        request({
            url: url,
            encoding: null,
            headers: headers
        }, function(err, res, body) {
            if(!err && res.statusCode == 200){

                // 解析返回的 html
                html = iconv.decode(body, 'gb2312')
                $ = cheerio.load(html, {decodeEntities: false})
                
                let content = $('#endText').html().trim()
                // save_content_to_database(1, content)
                // connection.query('UPDATE articles SET content = ? WHERE id = ?', [content, 1], (err, res)=>{
                //     if(err) throw err;
                //     console.log('Last insert ID:', res.insertId);
                // })
                // 返回 Promise
                resolve(content)
            }
        })
    })

}

// 调用返回的 Promise
crawler(url).then((content)=>{
    save_content_to_database(1, content)
})

module.exports = crawler