const { ToDo, Item } = require('./ToDo.js')
const { writeFile, readFile } = require('fs').promises

// UTILITIES ------------------------------------------------------------------

/**
 * Check if an object has a given property
 *
 * @param {any} obj The object to check.
 * @param {string} property The property to look for.
 * @returns {boolean}
 */
function hasProperty (obj, property) {
  return Boolean(obj) && Object.prototype.hasOwnProperty.call(obj, property)
}

/**
 * Check if an object is an Iterator
 *
 * @param {Object} obj The object to check
 * @returns {boolean}
 */
function isObjectIterator (obj) {
  if(typeof obj === 'object' && obj) {
    return Boolean(obj[Symbol.iterator])
  }

  return false
}

// API ------------------------------------------------------------------------

/**
 * The `from` function is a factory to create to `ToDo` objects.
 *
 * As an extra feature compared to the `ToDo` constructor, the `from` function
 * is able to parse JSON representation of `Item` objects to turn them into
 * proper `Item` instances.
 *
 * FIXME: The `from` function should be able to create a `ToDo` object from the
 *        JSON representation of `ToDo` objects, which is currently not the
 *        case.
 *
 * FIXME: The `from` function should be a static method from the `ToDo`class.
 *
 * @param {any} input The input data from which we must try to create a ToDo
 * @returns {ToDo} A `ToDo` containing all valid values
 */
function from (input) {
  const data = isObjectIterator(input) ? Array.from(input) : [input]

  return new ToDo('', data.map(obj => {
    if (hasProperty(obj, 'content')) {
      const item = new Item(obj.content)
      item.checked = Boolean(obj.checked)
      item.id = obj.id || item.id

      return item
    }

    return obj
  }))
}

/**
 * The load function try to read and parse JSON file to produce a `ToDo` object
 *
 * Because reading a file can take time, this function is asynchrouns and will
 * return a `Promise` which will provide the expected `ToDo` object once
 * fulfilled.
 *
 * @param {string} path The path to the JSON file containing some data to load
 * @returns {Promise<ToDo>} The expected `ToDo` once the file has been read.
 */
async function load (path) {
  const data = JSON.parse(await readFile(path))

  if (hasProperty(data, 'title') && hasProperty(data, 'items')) {
    const todo = from(data.items)
    todo.title = data.title
    return todo
  }

  return from(data)
}

/**
 * The `save` function write a JSON representation of a `ToDo` within a file
 *
 * Because writing a file can take time, this function is asynchrouns and will
 * return a `Promise` which will be fulfilled once the writing is done.
 *
 * @param {ToDo} todo The `ToDo` object to save
 * @param {string} path The path to the file where to store the `ToDo` object
 */
async function save (todo, path) {
  return writeFile(path, JSON.stringify(todo))
}

// FIXME: It could be cool if we had the opportunity to save and load from
//        sources other than the file system (i.e. A database or a REST API)

// EXPOSE PUBLIC API ----------------------------------------------------------

module.exports = { from, load, save }
