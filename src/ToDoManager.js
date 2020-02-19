const { ToDo, Item } = require('./ToDo.js')
const { writeFile, readFile } = require('fs').promises



function hasProperty (obj, property) {
  return Boolean(obj) && Object.prototype.hasOwnProperty.call(obj, property)
}

function isObjectIterator (obj) {
  if(typeof obj === 'object' && obj) {

    console.log(obj[Symbol.iterator])
    return Boolean(obj[Symbol.iterator])
  }

  return false
}

function from (input){
  console.log(input)
  const data = isObjectIterator(input) ? Array.from(input): [input]
  return new ToDo('',data.map(obj => {
    if(hasProperty(obj, 'content')){
      const item = new Item(obj.content)
      item.checked = Boolean(obj.checked)
      item.id = obj.id || item.id

      return item
    }
    return obj
  }))
}

async function load (path) {
  const data = JSON.parse(await readFile(path))

  if (hasProperty(data, 'title') && hasProperty(data, 'items')) {
    const todo = from(data.items)
    todo.title = data.title
    return todo
  }
  return from(data)
}
async function save (todo, path) {
  return writeFile(path, JSON.stringify(todo))

}
module.exports = { from ,  load, save}