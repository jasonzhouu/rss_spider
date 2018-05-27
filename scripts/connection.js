var mysql      = require('mysql')
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'xiaoyu2698355',
  database : 'rss'
})

module.exports = connection
