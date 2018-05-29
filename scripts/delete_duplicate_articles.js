var connection = require('./connection')
connection.connect()

connection.query('select id, guid from articles', (err, res)=>{
    var res_array = []
    for(var key in res) {
        res_array.push(res[key])
    }

    res_array.forEach((value, index)=>{
        let duplicate_article = res_array.slice(index+1).filter(value2 => value2.guid == value.guid)
        if(duplicate_article.length != 0) {
            console.log(duplicate_article[0].guid)
            duplicate_article.forEach((value, index)=>{
                connection.query('delelte from articles where id=?', value.id, (err, res)=>{
                    //console.log(err, res)
                    console.log('删除重复文章 id = ', value.id)
                })
            })
        }
    })
})


connection.end()
