const EventEmitter = require('events')
const save_all_full_content = require('./save_all_full_content')
class MyEmitter extends EventEmitter {}
const my_emitter = new MyEmitter()
my_emitter.on('enought_data', () => {
  save_all_full_content()
})

module.exports = my_emitter