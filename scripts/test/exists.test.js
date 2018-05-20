var connection = require('../connection')
connection.connect()
let guid = 'http://news.163.com/14/0724/13/A1U1R1OP0001124J.html'

connection.query('SELECT id FROM articles WHERE guid = ?', guid, (err, res) => {
    // 存在
    if(res[0]) console.log(res[0].id)
    // 不存在
    else console.log(false)
    
    
    

    // if(res[0][1] == 1) {
    //     consolelog(exit)
    // }
})
connection.end()