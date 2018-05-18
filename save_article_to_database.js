/*
 * 进行数据库操作
 * input: id, title, description, guid 这些数据
 * 保存
*/

var connection = require('./connection')
connection.connect()

function saveArticle (article) {
  connection.query('INSERT INTO articles SET ?', article, (err, res) => {
    if(err) throw err;
    //输出插入结果
    console.log('Last insert ID:', res.insertId);
  })
}

module.exports = saveArticle