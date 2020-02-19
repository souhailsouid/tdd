const { Item, ToDo } = require(`./ToDo.js`)

const ID_RGX = /^[a-z][a-z0-9]{7}$/i
const ITEM_ERR = new Error(`Item must be created with a non empty string`)
const TODO_ERR = new Error('ToDo can be filled only with `string`s or `Item`s')

describe(`Test the Item class`, () => {
  test(`Item::constructor(<string>)`, () => {
    const item = new Item(`Buy some banananananas`)

    expect(item).toBeInstanceOf(Item)
    expect(item).toHaveProperty(`content`, `Buy some banananananas`)
    expect(item).toHaveProperty(`checked`, false)
    expect(item).toHaveProperty(`id`)
    expect(item.id).toMatch(ID_RGX)
  })

  test(`Item::constructor(<Item>)`, () => {
    const item1 = new Item(`Buy some banananananas`)
    item1.toggle(true)

    const item2 = new Item(item1)

    expect(item2).toBeInstanceOf(Item)
    expect(item2).not.toBe(item1)
    expect(item2).toHaveProperty(`content`, item1.content)
    expect(item2).toHaveProperty(`checked`, item1.checked)
    expect(item2).toHaveProperty(`id`)
    expect(item2.id).not.toBe(item1.id)
    expect(item2.id).toMatch(ID_RGX)
  })

  test(`Item::constructor(<any>) // throw Error`, () => {
    expect(() => { new Item()          }).toThrow(ITEM_ERR)
    expect(() => { new Item(undefined) }).toThrow(ITEM_ERR)
    expect(() => { new Item(null)      }).toThrow(ITEM_ERR)
    expect(() => { new Item(1)         }).toThrow(ITEM_ERR)
    expect(() => { new Item(NaN)       }).toThrow(ITEM_ERR)
    expect(() => { new Item([])        }).toThrow(ITEM_ERR)
    expect(() => { new Item({})        }).toThrow(ITEM_ERR)
    expect(() => { new Item(() => {})  }).toThrow(ITEM_ERR)
  })

  test(`item.checked`, () => {
    const item = new Item(`Buy some banananananas`)

    expect(item.checked).toBe(false)
    item.checked = true
    expect(item.checked).toBe(true)
    item.checked = false
    expect(item.checked).toBe(false)
  })

  test(`item.toggle()`, () => {
    const item = new Item(`Buy some banananananas`)
    expect(item.checked).toBe(false)

    expect(item.toggle()).toBe(true)
    expect(item.checked).toBe(true)

    expect(item.toggle()).toBe(false)
    expect(item.checked).toBe(false)
  })

  test(`item.toggle(<any>)`, () => {
    const item = new Item(`Buy some banananananas`)
    expect(item.checked).toBe(false)

    const falsy = [false, '', null, undefined, 0, NaN]
    const truthy = [true, '0', 1, {}, [], [0], () => {}]

    falsy.forEach(value => {
      item.checked = true
      expect(item.toggle(value)).toBe(false)
      expect(item.checked).toBe(false)

      item.checked = false
      expect(item.toggle(value)).toBe(false)
      expect(item.checked).toBe(false)
    })

    truthy.forEach(value => {
      item.checked = false
      expect(item.toggle(value)).toBe(true)
      expect(item.checked).toBe(true)

      item.checked = true
      expect(item.toggle(value)).toBe(true)
      expect(item.checked).toBe(true)
    })
  })

  test(`item.id is robust enough`, () => {
    const ids = Array(100)
      .fill(`Buy some banananananas`)
      .map(str => (new Item(str)).id)

    ids.forEach(id => expect(id).toMatch(ID_RGX))

    expect(ids.some(id => /[A-Z]/.test(id))).toBe(true)
    expect(ids.some(id => /[a-z]/.test(id))).toBe(true)
    expect(ids.some(id => /[0-9]/.test(id))).toBe(true)

    expect((new Set(ids)).size).toBe(100)
  })

  test(`String(item) === item.content`, () => {
    const item = new Item(`Buy some banananananas`)

    expect(String(item)).toBe(item.content)
    expect(`${item}`).toBe(item.content)
    expect(item.toString()).toBe(item.content)
  })
})

describe(`Test the ToDo class (Custom API)`, () => {
  test(`ToDo::constructor(<string>)`, () => {
    const todo = new ToDo(`CAN I HAZ CHEESBURGER?`)

    expect(todo).toBeInstanceOf(ToDo)
    expect(todo).toBeInstanceOf(Array)
    expect(todo).toHaveProperty(`title`, `CAN I HAZ CHEESBURGER?`)
    expect(todo).toHaveLength(0)
  })

  test(`ToDo::constructor(<any>) // no title`, () => {
    expect((new ToDo()         ).title).toBe('')
    expect((new ToDo(undefined)).title).toBe('')
    expect((new ToDo(null)     ).title).toBe('')
    expect((new ToDo(1)        ).title).toBe('')
    expect((new ToDo(NaN)      ).title).toBe('')
    expect((new ToDo([])       ).title).toBe('')
    expect((new ToDo({})       ).title).toBe('')
    expect((new ToDo(() => {}) ).title).toBe('')
  })


  test(`ToDo::constructor(<string>, <array>)`, () => {
    const data = [
      42,
      `Meaow`,
      new Item(`Prrrrr`)
    ]
    const todo = new ToDo(`CAN I HAZ CHEESBURGER?`, data)

    expect(todo).toHaveLength(2)
    expect(todo[0]).toBeInstanceOf(Item)
    expect(todo[0]).toHaveProperty(`content`, data[1])
    expect(todo[1]).toBe(data[2])
  })

  test(`todo.add(<string>)`, () => {
    const todo = new ToDo(`CAN I HAZ CHEESBURGER?`)
    const val  = `Cats rulez!`
    const item = todo.add(val)

    expect(item).toBeInstanceOf(Item)
    expect(item).toHaveProperty(`content`, val)
    expect(todo).toHaveLength(1)
    expect(todo[0]).toBe(item)
  })

  test(`todo.add(<Item>)`, () => {
    const todo = new ToDo(`CAN I HAZ CHEESBURGER?`)
    const val  = new Item(`Cats rulez!`)
    const item = todo.add(val)

    expect(item).not.toBe(val)
    expect(item).toHaveProperty(`content`, val.content)
    expect(todo).toHaveLength(1)
    expect(todo[0]).toBe(item)
  })

  test(`todo.add(<any>)`, () => {
    const todo = new ToDo(`CAN I HAZ CHEESBURGER?`)

    expect(() => { todo.add() }).toThrow(TODO_ERR)
    expect(() => { todo.add(undefined) }).toThrow(TODO_ERR)
    expect(() => { todo.add(null) }).toThrow(TODO_ERR)
    expect(() => { todo.add(1) }).toThrow(TODO_ERR)
    expect(() => { todo.add(NaN) }).toThrow(TODO_ERR)
    expect(() => { todo.add({}) }).toThrow(TODO_ERR)
    expect(() => { todo.add([]) }).toThrow(TODO_ERR)
    expect(() => { todo.add(() => {}) }).toThrow(TODO_ERR)

    expect(todo).toHaveLength(0)
  })

  test(`todo.remove(<string>)`, () => {
    const data = [`Cats rulez!`, `Human must die!`]
    const todo = new ToDo(`CAN I HAZ CHEESBURGER?`, data)

    expect(todo).toHaveLength(2)
    expect(todo[0]).toHaveProperty(`content`, data[0])

    const rm = todo.remove(todo[0].id)

    expect(rm).toBe(true)
    expect(todo).toHaveLength(1)
    expect(todo[0]).toHaveProperty(`content`, data[1])
  })

  test(`todo.remove(<Item>)`, () => {
    const data = [`Cats rulez!`, `Human must die!`]
    const todo = new ToDo(`CAN I HAZ CHEESBURGER?`, data)

    expect(todo).toHaveLength(2)
    expect(todo[0]).toHaveProperty(`content`, data[0])

    const rm = todo.remove(todo[1])

    expect(rm).toBe(true)
    expect(todo).toHaveLength(1)
    expect(todo[0]).toHaveProperty(`content`, data[0])
  })

  test(`todo.remove(<any>)`, () => {
    const data = [`Cats rulez!`, `Human must die!`]
    const todo = new ToDo(`CAN I HAZ CHEESBURGER?`, data)

    expect(todo.remove()).toBe(false)
    expect(todo.remove(undefined)).toBe(false)
    expect(todo.remove(null)).toBe(false)
    expect(todo.remove(1)).toBe(false)
    expect(todo.remove(`wut!`)).toBe(false)
    expect(todo.remove(new Item(`wut!`))).toBe(false)
    expect(todo.remove({})).toBe(false)
    expect(todo.remove([])).toBe(false)
    expect(todo.remove(() => {})).toBe(false)
    expect(todo).toHaveLength(2)
  })

  test(`todo.toJSON()`, () => {
    const data = [`Cats rulez!`, `Human must die!`]
    const todo = new ToDo(`CAN I HAZ CHEESBURGER?`, data)
    const json = todo.toJSON()

    expect(json).not.toBeInstanceOf(Array)
    expect(json).toHaveProperty('title', todo.title)
    expect(json).toHaveProperty('items')
    expect(json.items).toBeInstanceOf(Array)
    expect(json.items).not.toBeInstanceOf(ToDo)
    expect(json.items).toHaveLength(todo.length)
    json.items.forEach((item, index) => {
      expect(item).toHaveProperty(`content`, todo[index].content)
      expect(item).toHaveProperty(`checked`, todo[index].checked)
      expect(item).toHaveProperty(`id`, todo[index].id)
    })
  })


  describe(`Test the ToDo class (overloaded Array method)`, () => {
    test(`todo.concat(...<any>)`, () => {
      const values = [
        [`Prrrrr`],
        new Item(`NianNianNian…`),
        `…NianNianNian`,
        42,
        true,
        undefined,
        null
      ]

      const result = [
        `Cats rulez!`,
        `Human must die!`,
        `Meaow!`,
        `Prrrrr`,
        `NianNianNian…`,
        `…NianNianNian`,
      ]

      const todo1  = new ToDo(`CAN I HAZ CHEESBURGER?`, [
        `Cats rulez!`,
        `Human must die!`,
      ])

      const todo2  = new ToDo(`HOW TO RULEZ THE WORLD.`, [
        `Meaow!`
      ])

      const res = todo1.concat(todo2, ...values)

      expect(res).toBeInstanceOf(ToDo)
      expect(res).not.toBe(todo1)
      expect(res).not.toBe(todo2)
      expect(res.title).toBe('')
      expect(res).toHaveLength(6)

      res.forEach((obj, index) => {
        expect(obj).toBeInstanceOf(Item)
        expect(obj.content).toBe(result[index])

        if (index === 0) {
          expect(obj).toBe(todo1[0])
        }
        if (index === 1) {
          expect(obj).toBe(todo1[1])
        }
        if (index === 2) {
          expect(obj).toBe(todo2[0])
        }
      })
    })
  })
  test(`todo.fill(<string>, ...<number>)`, () => {
    const tests = [
      [`Cats rulez!`],
      [`Cats rulez!`, 1],
      [`Cats rulez!`, 1, 2]
    ]

    tests.forEach(args => {
      const todo = new ToDo(`CAN I HAZ CHEESBURGER?`)
      todo.length = 3

      const res = todo.fill(...args)
      expect(res).toBe(todo)
      expect(res).toHaveLength(3)

      expect(res[1]).toBeInstanceOf(Item)
      expect(res[1].content).toBe(args[0])

      if (args.length === 1) {
        expect(res[0]).toBeInstanceOf(Item)
        expect(res[0].content).toBe(args[0])
        expect(res[2]).toBeInstanceOf(Item)
        expect(res[2].content).toBe(args[0])
      }

      if (args.length === 2) {
        expect(res[0]).toBe(undefined)
        expect(res[2]).toBeInstanceOf(Item)
        expect(res[2].content).toBe(args[0])
      }

      if (args.length === 3) {
        expect(res[0]).toBe(undefined)
        expect(res[2]).toBe(undefined)
      }
    })
  })

  test(`todo.fill(<item>, ...<number>)`, () => {
    const tests = [
      [new Item(`Cats rulez!`)],
      [new Item(`Cats rulez!`), 1],
      [new Item(`Cats rulez!`), 1, 2]
    ]

    tests.forEach(args => {
      const todo = new ToDo(`CAN I HAZ CHEESBURGER?`)
      todo.length = 3

      const res = todo.fill(...args)
      expect(res).toBe(todo)
      expect(res).toHaveLength(3)

      expect(res[1]).toBe(args[0])

      if (args.length === 1) {
        expect(res[0]).toBe(args[0])
        expect(res[2]).toBe(args[0])
      }

      if (args.length === 2) {
        expect(res[0]).toBe(undefined)
        expect(res[2]).toBe(args[0])
      }

      if (args.length === 3) {
        expect(res[0]).toBe(undefined)
        expect(res[2]).toBe(undefined)
      }
    })
  })

  test(`todo.fill(<any>, ...<number>)`, () => {
    const tests = [
      [true],
      [true, 1],
      [true, 1, 2],
      [42],
      [42, 1],
      [42, 1, 2],
      [null],
      [null, 1],
      [null, 1, 2],
      [undefined],
      [undefined, 1],
      [undefined, 1, 2],
      [{}],
      [{}, 1],
      [{}, 1, 2],
      [[]],
      [[], 1],
      [[], 1, 2],
      [() => {}],
      [() => {}, 1],
      [() => {}, 1, 2]
    ]

    tests.forEach(args => {
      const todo = new ToDo(`CAN I HAZ CHEESBURGER?`)
      todo.length = 3

      const res = todo.fill(...args)
      expect(res).toBe(todo)
      expect(res).toHaveLength(3)
      res.forEach(item => {
        expect(item).toBe(undefined)
      })
    })
  })

  test(`todo.push(...<any>)`, () => {
    const todo  = new ToDo(`CAN I HAZ CHEESBURGER?`)
    const values = [
      `Cats rulez!`,
      new Item(`Human must die!`),
      42,
      NaN,
      {},
      [],
      () => {},
      undefined,
      null
    ]

    const len = todo.push(...values)

    expect(len).toBe(2)
    expect(todo).toHaveLength(len)
    expect(todo[0]).toBeInstanceOf(Item)
    expect(todo[0].content).toBe(values[0])
    expect(todo[1]).toBe(values[1])
  })

  test(`todo.splice(...<number>, ...<any>)`, () => {
    const tests = [
      [],
      [0],
      [0, `wut`],
      [0, 1],
      [1, 1, `Meaow`],
      [1, 0, `Meaow`]
    ]

    tests.forEach(args => {
      const len = args.length
      const todo  = new ToDo(`CAN I HAZ CHEESBURGER?`, [
        `Cats rulez!`,
        `Human must die!`
      ])

      const items = Array.from(todo)
      const res = todo.splice(...args)

      expect(res).toBeInstanceOf(ToDo)
      expect(res).not.toBe(todo)
      expect(res.title).toBe('')

      if (len === 0 || (len === 2 && typeof args[1] === 'string')) {
        expect(res).toHaveLength(0)
        expect(todo).toHaveLength(2)
      }

      else if (len === 1) {
        expect(res).toHaveLength(2)
        expect(todo).toHaveLength(0)
        expect(res[0]).toBe(items[0])
        expect(res[1]).toBe(items[1])
      }

      else if (len === 2) {
        expect(res).toHaveLength(1)
        expect(todo).toHaveLength(1)
        expect(res[0]).toBe(items[0])
        expect(todo[0]).toBe(items[1])
      }

      else if (len === 3) {
        expect(res).toHaveLength(args[1])
        expect(todo).toHaveLength(3 - args[1])
        expect(todo[1]).toBeInstanceOf(Item)
        expect(todo[1].content).toBe(args[2])

        if (args[1] === 0) {
          expect(todo[2]).toBe(items[1])
        }
      }
    })
  })

  test(`todo.unshift(...<any>)`, () => {
    const todo  = new ToDo(`CAN I HAZ CHEESBURGER?`)
    const items = [
      `Cats rulez!`,
      new Item(`Human must die!`),
      42,
      NaN,
      {},
      [],
      () => {},
      undefined,
      null
    ]

    const len = todo.unshift(...items)

    expect(len).toBe(2)
    expect(todo).toHaveLength(len)
    expect(todo[0]).toBeInstanceOf(Item)
    expect(todo[0].content).toBe(items[0])
    expect(todo[1]).toBe(items[1])
  })
})
