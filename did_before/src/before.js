class ToDo extends Array {
  constructor(title, data) {

    super()
    if (arguments.length > 1) {
      for (let i = 0; i < data.length; i++) {
        if (typeof data[i] === "string") {
          this.push(new Item(data[i]))
        } else if (typeof data[i] === "object") {
          this.push(data[i])
        }
      }
    }
    this.title = title === undefined || title === null || typeof title !== "string" ? this.title = '' : this.title = title
  }

}
class Item {
  constructor(content) {
    if (
      content === undefined ||
      content === null ||
      (typeof content !== 'string' && typeof content.content !== 'string')
    ) {
      throw new Error(`Item must be created with a non empty string`)
    } else {
      this.content = typeof content === 'object' ? content.content : content
      this.checked = content.checked ? true : false
      this.id = 'A' + Math.random().toString(36).substr(2, 7)
      this.val = `Cats rulez!`
    }
  }
  toString() {
    return this.content
  }

  toggle() {
    if (arguments.length === 0) {
      return (this.checked = !this.checked)
    }
    if (arguments[0]) {
      return (this.checked = true)
    } else if (!arguments[0]) {
      return (this.checked = false)
    }
  }
}

module.exports = { ToDo, Item }
