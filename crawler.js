var request = require('request')
var cheerio = require('cheerio')
var fs = require('fs')

var url = 'http://news.163.com/14/0513/08/9S453V5B00014JB6.html'
function crawler (url) {
    url = url.slice(0, -5).concat('_all.html')

    return new Promise(resolve => {
        request(url, function(err, res, body) {
            // console.log(body)
            if(!err && res.statusCode == 200){
                $ = cheerio.load(body)
                
                let content = $('#endText').html()
                
                // 写入 txt 文件中
                // fs.writeFile(__dirname + '/test.txt', content, function (err) {
                //     if(err) {
                //      console.error(err);
                //      } else {
                //         console.log('写入成功');
                //      }
                //  })
                // console.log('content: ', content)

                // 异步返回结果
                resolve(content)
            }
        })
    })

}

// 调用返回的 Promise
crawler(url).then((result)=>{
    console.log(result)
})

module.exports = crawler