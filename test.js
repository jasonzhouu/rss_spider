var crawler = require('./crawler')

var url = 'http://news.163.com/14/0513/08/9S453V5B00014JB6.html'
async function waitforresult () {
    var text = await crawler(url)
    // console.log(text)
    return text;
}

waitforresult().then(text=>{
    console.log(text)
})
