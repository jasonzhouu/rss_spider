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
        console.log('Last insert full content ID:', res.insertId);
    })
}

function deleteItem(id) {
    connection.query('DELETE FROM articles WHERE id = ?', id, (err, res)=>{
        if(err) console.log(err)
        // console.log('delete item whose content is null, id: ', id)
    })
}

function save_full_content () {
    connection.query('SELECT id, guid FROM articles WHERE content IS NULL', function(err, res){
        if(err) {
            console.log("select err", err)
        }
        for (var key in res) {
            let id = res[key].id
            let guid = res[key].guid
            get_full_content(guid).then((content)=>{
                // resolve result
                // if content.length is too short, it means the content is not proper or is empty
                if(content.length<1000) {
                    deleteItem(id)
                } else {
                    // if conten.lenght is long enough, then save content to database
                    saveContent(id, content)
                }
            }).catch((reason)=>{
                deleteItem(id)
                // console.log(reason)
            })
        }
    })
}

module.exports = save_full_content