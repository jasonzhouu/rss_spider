var connection = require('../connection')
connection.connect()
let guid = 'http://news.163.com/14/1231/11/AEPRDQ4D0001124.html'

connection.query('SELECT 1 FROM articles WHERE guid = ?', guid, (err, res) => {
    if(res[0]) console.log(true)
    else console.log(false)
    
    
    

    // if(res[0][1] == 1) {
    //     consolelog(exit)
    // }
})