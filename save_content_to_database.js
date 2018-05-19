/*
 * 进行数据库操作
 * input: content
 * 保存
*/

// var connection = require('./connection')
// connection.connect()

function saveContent(id, content, connection) {
    connection.query('UPDATE articles SET content = ? WHERE id = ?', [content, id], (err, res)=>{
        if(err) {
            console.log(err)
            // throw err;
        }
        // console.log('Last insert ID:', res.insertId);
        console.log('Last insert ID:', id);
    })
}

// saveContent(1, "你好")

module.exports = saveContent