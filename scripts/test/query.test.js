var connection = require('../connection')
connection.connect()

connection.query('select title from articles where content is null', (err, res)=>{
    console.log(res)
})

connection.end()