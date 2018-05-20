/*
 * 获取单篇文章的全文
 * 步骤：
 * 1. 使用 request 向 guid 发起请求
 * 2. 使用 cheerio 将返回的 html 解析成对象
 * 3. 只留文章那部分 html
 */

var request = require('request')
var iconv = require('iconv-lite')
var cheerio = require('cheerio')
var headers = {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_4) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/11.1 Safari/605.1.15'
}
/*
 * 作用: 请求并解析全文
 * param: guid
 * 返回 Promise(content)
 */
function get_full_content (guid) {
    uri = guid.slice(0, -5).concat('_all.html')

    return new Promise((resolve, reject) => {

        // 向 guid 发起 http 请求
        request({
            uri: uri,
            encoding: null,
            headers: headers
        }, function(err, res, body) {
            if(!err && res.statusCode == 200){
                // 解析返回的 html
                html = iconv.decode(body, 'gb2312')
                $ = cheerio.load(html, {decodeEntities: false})
                
                let content = $('#endText').html().trim()
                // save_content_to_database(1, content)
                resolve(content)
            } else {
                let errReason = 'reject full content request, guid: ' + guid + ' err: ' + err
                reject(errReason)
            }
        })
    })

}

// var guid = 'http://news.163.com/14/0513/08/9S453V5B00014JB6.html'
// // 调用返回的 Promise
// get_full_content(guid).then((content)=>{
//     save_content_to_database(1, content)
// })

module.exports = get_full_content