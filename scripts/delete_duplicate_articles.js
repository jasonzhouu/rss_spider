var connection = require('./connection')
connection.connect()

connection.query('select id, guid from articles', (err, res)=>{
    var res_array = []
    for(var key in res) {
        res_array.push(res[key])
    }

    // console.log(res_array.length)

    res_array.forEach((value, index)=>{
        console.log(
            res_array.slice(index+1).filter(value2 => value2.guid == value.guid).length
        )
    })
})


connection.end()