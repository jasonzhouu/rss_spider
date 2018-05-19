var connection = require('./connection')
var get_full_content = require('./get_full_content')

connection.connect()

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

function deleteItem(id) {
    connection.query('DELETE FROM articles WHERE id = ?', id, (err, res)=>{
        if(err) console.log(err)
        console.log('delete item whose content if null or too short', res)
    })
}

connection.query('SELECT id, guid FROM articles WHERE content IS NULL', function(err, res){
    if(err) {
        console.log("select err", err)
    }
    for (var key in res) {
        let id = res[key].id
        let guid = res[key].guid
        get_full_content(guid).then((content)=>{
            // resolve result
            console.log('length of content: ', content.length)
            // if content.length is too short, it means the content is not proper or is empty
            if(content.length<1000) {
                deleteItem(id)
            } else {
                // if conten.lenght is long enough, then save content to database
                connection.query('UPDATE articles SET content = ? WHERE id = ?', [content, id], (err, res)=>{
                    if(err) {
                        console.log("update err", err)
                        // throw err;
                    }
                    console.log('Last insert ID:', id)
                })
            }
        }).catch((reason)=>{
            deleteItem(id)
            console.log('reject reason: ', reason)
        })
    }
})