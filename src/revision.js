
function id(){
  return "A" + Math.random().toString(36).substr(2, 7)
}

function isValideItemValue(value) {
  return typeof value === 'string' || value instanceof Item
}
class Item {
  constructor(content) {

    if (!isValideItemValue(content)) {
      throw new Error('Item must be created with a non empty string')
    }
    this.content = content.content || content
    this.checked = content.checked || false 
    this.id = id()
   
  }

  toggle(...flag) {
    if (flag.length > 0) {
      this.checked = Boolean(flag[0])
    } else {
      this.checked = !this.checked
    }
    return this.checked
  }
  toString() {
    return this.content
    
  }

}

class ToDo extends Array {
  constructor (title, data) {
    super()

    if (typeof title === 'string' && title.length >=2) {
      this.title = title
    } else {
      this.title = ''
    }

    if (data && Array.isArray(data)) {
      this.push(...data)
    }
  }
 

}
module.exports = { Item, ToDo }