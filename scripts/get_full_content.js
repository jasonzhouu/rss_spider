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
    // console.log(`\n\n ===========================开始抓取全文 ${guid}==================================== \n\n`)
    var uri = full_content_uri(guid)

    return new Promise((resolve, reject) => {

        // 向 guid 发起 http 请求
        request({
            uri: uri,
            encoding: null,
            headers: headers
        }, function(err, res, body) {
            if(!err && res.statusCode == 200){
                // 解析返回的 html
                console.log("获取到全文 uri = ", uri)
                let content = pick_content(guid, body)
                resolve(content)
            } else {
                let errReason = '访问网页请求被拒, uri: ' + uri + ' err: ' + err
                reject(errReason)
            }
        })
    })
}

function ft_or_163(guid) {
    if(guid.slice(0, 25) == 'http://www.ftchinese.com/')
        return 'ft'
    else if(guid.slice(0, 20) == 'http://news.163.com/')
        return '163'
    else if(guid.slice(0, 25) == 'http://www.xinhuanet.com/')
        return 'xinhua'
    else return false
}

function full_content_uri(guid) {
    let uri
    switch (ft_or_163(guid)) {
        case 'ft':
            uri = guid.concat('?full=y')
            break
        case '163':
            uri = guid.slice(0, -5).concat('_all.html')
            break
        case 'xinhua':
            uri = guid
            break
        default:
            console.log('guid error')
            break
    }
    return uri
}

function pick_content(guid, body) {
    let content, html
    switch (ft_or_163(guid)) {
        case 'ft':
            $ = cheerio.load(body, {decodeEntities: false})
            content = $('#story-body-container').html()
            break
        case '163':
            html = iconv.decode(body, 'gb2312')
            $ = cheerio.load(html, {decodeEntities: false})
            content = $('#endText').html()
            break
        case 'xinhua':
            $ = cheerio.load(body, {decodeEntities: false})
            content = $('#p-detail').html()
            break
        default:
            console.log('pick content error')
            break
    }
    if(content != null) {
        content = content.trim()
    return content
    }
}

// guid =
// "http://www.xinhuanet.com/politics/2018-05/23/c_1122876162.htm"

// get_full_content(guid).then((content)=>{
//     console.log("content: ", content)
// })

module.exports = get_full_content
