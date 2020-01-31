// UTILITIES ------------------------------------------------------------------



/**
 * Create a valid ID for Items
 *
 * All IDs are 8 caracters long and start with a letter. Otherwise, they are a
 * combination of numbers, lowercase letters and uppercase letters.
 *
 * FIXME: We could make this a static function of `Item`
 * FIXME: Make sure that all produced IDs are unique.
 */
function id () {
  return  'A' + Math.random().toString(36).substr(2, 7)
}


/**
 * Test if a value is a valid value to create an Item from
 *
 * @param {any} value The value to check
 */
function isValideItemValue(value) {
  return typeof value === 'string' || value instanceof Item
}

// API ------------------------------------------------------------------------

// Class definition fot `Item` objects
//
// An `Item` object has 3 properties:
//  - `content` {string} The desription of the Item,
//  - `checked` {boolean} The flag indicating if the Item is
//    fullfilled (true) or not (false)
//  - `id` {string} THe unique ID of the item. It match the
//    following Regular Expression: `/[a-z][0-9a-z]{7}/i`
//
// An `Item` also has a methode:
//  - `toggle(<boolean>?)` : Toogle the fullfilled state of the Item. If not
//    argument is provided, the new fullfilled value is the opposite of the
//    previous fullfilled value. If an argument is provides, the new fullfilled
//    value is equal to the Boolean casting of the argument.
//
// Each time an Item is cast to a string, it will be turned into it's current
// content.
//
// FIXME: The name of the properties `content` and `checked` are not very
//        clear, they should have a more meaningfull name. For example,
//        `content` could become `description` or `value` and `checked` could
//        become `done` or `fullfilled`.
//
// FIXME: The `id` property should be readonly
//
// FIXME: When a Truthy/Falsy value is set to the `checked` property, that
//        value should be cast into a real Boolean.
class Item {
  /**
   * Create a new Item object
   *
   * FIXME: The Error message is wrong as it is possible to create an `Item`
   *        object from an empty string as well as from another `Item` object.
   *        We should either update the error message or change the
   *        implementation to have them matching.
   *
   * @constructor
   * @param {string} content The initial value for the content property.
   */
  constructor(content) {
    if (!isValideItemValue(content)) {
      throw new Error('Item must be created with a non empty string')
    }

    this.content = content.content || content
    this.checked = content.checked || false
    this.id = id()
  }

  /**
   * Toogle the fullfilled state of the Item.
   *
   * If not argument is provided, the new fullfilled value is the opposite of
   * the previous fullfilled value. If an argument is provides, the new
   * fullfilled value is equal to the Boolean casting of the argument.
   *
   * @param {boolean} flag (Optional) An optional truthy or falsy flag
   * @returns {boolean} The new fullfilled state of the Item
   */
  toggle(...flag) {
    if (flag.length > 0) {
      this.checked = Boolean(flag[0])
    } else {
      this.checked = !this.checked
    }

    return this.checked
  }

  /**
   * Overload the inherited toString method from Object
   *
   * When turn into a string an Item must be turn into the value
   * of its `content`property
   *
   * @returns {string} The string representation of the Item
   */
  toString() {
    return this.content
  }
}

// Class definition fot ToDo objects
//
// A `ToDo` object is a special kind of `Array` that can contain only `Item`s.
// It also carry a `title` property that can be used as human definition of the
// list.
//
// A `ToDo` object has 1 property:
//  - `title` {string} The title/description of the list
//
// A `ToDo` object overload some of the Array methods:
//  - `concat` : We filter out invalid values while doing the concatenation
//  - `fill` : We can fill the list only with valid values
//  - `push` : We filter out invalid values while pushing
//  - `splice` : We filter out invalid values while inserting new values
//  - `unshift` : We filter out invalid values while unshifting
//
// A `ToDo` object has 3 specific methods:
//  - `add(<Item|string>)` Add a new original Item to the list
//  - `remove(<Item|string>)` Remove a given Item from the list
//  - `toJSON()` Provide the proper JSON representation of the list
//
// NOTE: The JSON representation of a ToDo object is the following:
// {
//   title: {string},
//   items: {Array<Object>}
// }
//
// FIXME: Because it makes no sens to have duplicated `Item`s within a `ToDo`,
// It would be smarter to have `ToDo` extending `Set` instead of `Array`.
class ToDo extends Array {
  /**
   * Create a new ToDo object
   *
   * @constructor
   * @param {string} title The title/description of the list
   * @param {array} data (Optional) Some optional values to insert in the list
   */
  constructor (title, data) {
    super()

    if (typeof title === 'string') {
      this.title = title
    } else {
      this.title = ''
    }

    if (data && Array.isArray(data)) {
      this.push(...data)
    }
  }

  // Overloaded Array API

  concat (...args) {
    const arr = Array.from(this).concat(...args)
    return new ToDo('', arr)
  }

  // FIXME: The `fill` method currently fill the list with the same `Item`,
  // we should make sure that each Item in the list is unique.
  fill (...args) {
    if (!isValideItemValue(args[0])) {
      return this
    }

    if (typeof args[0] === 'string') {
      args[0] = new Item(args[0])
    }

    return super.fill(...args)
  }

  push (...args) {
    return super.push(...args
      .filter(isValideItemValue)
      .map(val => typeof val === 'string' ? new Item(val) : val))
  }

  // FIXME: We do not test what happen if we try to insert an `Item` object to
  //        the list. Should we add the Item as it is (like `concat`, `push`
  //        and `unshift` are doing) or should we duplicate it (like `add` is
  //        doing) ? In this implementation we assume the former to be
  //        consistent with all other overloaded methods.
  splice (...args) {
    if (args.length > 2) {
      const data = args.splice(2)
        .filter(isValideItemValue)
        .map(val => typeof val === 'string' ? new Item(val) : val)

      args = args.concat(data)
    }

    return super.splice(...args)
  }

  unshift (...args) {
    return super.unshift(...args
      .filter(isValideItemValue)
      .map(val => typeof val === 'string' ? new Item(val) : val))
  }

  // Custom API

  /**
   * Add a new Item to the list
   *
   * The specificity of the `add` method compare to `push` is that it can add
   * only add one Item at a time and that it creates a new instance of any
   * provided Item (it's a true duplication, not a simple reference to the
   * previous Item). That newly created `Item` is return by the method.
   *
   * NOTE: Any invalide values will throw an Error (where `push` will just
   * ignore invalide values)
   *
   * @param {Item|string} item A new Item to insert in the list
   * @returns {Item} The newly inserted Item
   */
  add (item) {
    if (!isValideItemValue(item)) {
      throw new Error('ToDo can be filled only with `string`s or `Item`s')
    }

    // Exemple de syntaxe "degueulasse"
    return this[this.push(new Item(item)) - 1]

    // Ce serait beaucoup plus claire d'écrire :
    //
    // const myNewItem = new Item(item)
    // this.push(myNewItem)
    // return myNewItem
  }

  /**
   * Remove a given Item from the list
   *
   * FIXME: We should named that method `delete` to match the `Set` API.
   *
   * FIXME: This method does not remove all instance of an Item if it has
   *        been duplicated within the list
   *
   * @param {Item|string} item The Item or ID of the Item to remove
   * @returns {boolean} Indicates if the remove operation has been done.
   */
  remove (item) {
    const id = (item instanceof Item && item.id)
      || (typeof item === 'string' && item)
      || undefined

    // Without ID, there is nothing to remove
    if (!id) { return false }

    const pos = this.findIndex((i) => i.id === id)

    // Without any Item matching the id, there is nothing to remove
    if (pos === -1) { return false }

    this.splice(pos, 1)

    return true
  }

  /**
   * Return the JSON representation of the ToDo instance
   *
   * The JSON representation of a ToDo instance is:
   * {
   *   title: {string},
   *   items: {Array<Object>}
   * }
   */
  toJSON () {
    return {
      title: this.title,
      items: Array.from(this)
    }
  }
}

// EXPOSE PUBLIC API ----------------------------------------------------------

module.exports = { Item, ToDo }
