/*
 * 进行数据库操作
 * input: content
 * 保存
*/

var connection = require('./connection')
connection.connect()

function saveContent(id, content) {
    connection.query('UPDATE articles SET content = ? WHERE id = ?', [content, id], (err, res)=>{
        console.log(content.length)
        if(err) throw err;
        console.log('Last insert ID:', res.insertId);
    })
}

// saveContent(1, "你好")

module.exports = saveContent