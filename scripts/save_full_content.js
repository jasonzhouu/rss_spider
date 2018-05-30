/*
 * 将数据库中 content = null 的项目查找全文
 * 将符合要求的全文保存到数据库
 * 不符合要求的删除这一行
 */

var connection = require('./connection')
var get_full_content = require('./get_full_content')

function saveContent(id, content) {
    connection.query('UPDATE articles SET content = ? WHERE id = ?', [content, id], (err, res)=>{
        if(err) {
            console.log("update err", err)
        }
        console.log(`===========================保存 id = ${id} 的全文===========================`)
    })
}

function deleteItem(id) {
    connection.query('DELETE FROM articles WHERE id = ?', id, (err, res)=>{
        if(err) console.log(err)
        console.log(`删除 id = ${id} 的文章`)
    })
}

function save_full_content () {
    connection.query('SELECT id, guid FROM articles WHERE content IS NULL', function(err, res){
        if(err) {
            console.log("select err", err)
        }
        // 遍历所有没有 content 的行
        for (var key in res) {
            let id = res[key].id
            let guid = res[key].guid
            get_full_content(guid).then((content)=>{
                // if content.length is too short, it means the content is not proper or is empty
                if(content == null) {
                    deleteItem(id)
                    console.log("删除空文章 guid: ", guid)
                }
                else if(content.length < 700) {
                    deleteItem(id)
                    console.log("文章太短，删除 id: ", id)
                } else {
                    // if conten.lenght is long enough, then save content to database
                    saveContent(id, content)
                }
            }).catch((reason)=>{
                console.log('获取全文出错', reason)
                deleteItem(id)
            })
        }
    })
}

// save_full_content()
module.exports = save_full_content