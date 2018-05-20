const EventEmitter = require('events')
const save_full_content = require('./save_full_content')
class MyEmitter extends EventEmitter {}
const my_emitter = new MyEmitter()
my_emitter.on('new_article', () => {
  save_full_content()
})

module.exports = my_emitter