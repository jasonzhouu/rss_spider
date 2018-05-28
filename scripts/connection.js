const setting = require('./setting.json')
var mysql      = require('mysql')
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : setting.password,
  database : 'rss'
})

module.exports = connection
