function id() {
  return 'A' + Math.random().toString(36).substr(2,7)
}

function isValidItems(value) {
  return  typeof value === 'string' || value instanceof Item
}

class Item {

  constructor(content){
    if(!isValidItems(content)) {
      throw new Error("Item must be created with a non empty string")
    }
    this.content = content.content || content
    
    this.checked = content.checked ||  false
    this.id = id()

  }
  toggle(...flag) {
 
    if(flag.length > 0) {
      return this.checked = Boolean(flag[0])
    }else {
      this.checked = !this.checked
    }
    return this.checked
  }
  toString() {
    return this.checked  ? typeof this.checked ===  typeof this.content : this.content
  }

}
class ToDo extends Array{

  constructor(title, data){
    super()
   
    if (typeof title ==='string' ) {
      this.title= title  
    } else {
      this.title = ''
    }
    if(data && Array.isArray(data)) {
      
      this.push(...data)
    }
   
   
  }
  concat(...args) {
    console.log(args)
    const arr = Array.from(this).concat(...args)
    return new ToDo("", arr)
  }
 
  fill(...args){
  
    if (!isValidItems(args[0])) {
      return this
    }
    if(typeof args[0] === 'string' || args instanceof Item){
      args[0] = new Item(args[0])
    }

    return super.fill( ...args)
  }
  splice(...args) {
    console.log(args)
    if (args.length > 2) {
      const data = args.splice(2)
        .filter(isValidItems)
        .map(val => new Item(val))
      args = args.concat(data)
    }
    return super.splice(...args)
  }
  unshift(...args) {
    return super.unshift(...args
      .filter(isValidItems)
      .map(val => typeof val === 'string' ? new Item(val): val))
  }
  push (...args) {

    return super.push(...args
      .filter(isValidItems)
      .map(val => typeof val === 'string' ? new Item(val) : val))
  }
  add (item) {
    if(!isValidItems(item)){
      throw new Error('ToDo can be filled only with `string`s or `Item`s')
    }
    const myNewItem = new Item(item)
    this.push(myNewItem)
    
    return myNewItem
  }
  remove (item) {
  
    const id = (item instanceof Item && item.id)
      || (typeof item === 'string' && item)
      || undefined


    if(!id ) return false
    const pos = this.findIndex((i)=> i.id === id)

    // Without any Item matching the id, there is nothing to remove
    if (pos === -1) { return false }

    this.splice(pos, 1)

    return true
  }
  toJSON() {
    return {
      title: this.title,
      items: Array.from(this),
     
    }
  }
}



module.exports ={Item, ToDo}