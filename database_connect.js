var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'root',
  database : 'rss'
});

connection.connect();

function saveArticle (article) {
  query('INSERT INTO articles SET ?', article, (err, res) => {
    if(err) throw err;
    //输出插入结果
    console.log('Last insert ID:', res.insertId);
  })
}

module.exports = saveArticle
