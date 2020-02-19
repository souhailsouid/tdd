const path = require('path')
const { writeFile, readFile, unlink: rmFile } = require('fs').promises

const testJSONFile = path.join(__dirname, 'test.json')

const ToDoManager = require(`./ToDoManager.js`)
const { ToDo, Item } = require(`./ToDo.js`)

describe(`ToDoManager.from helper`, () => {
  test(`ToDoManager.from(<array>)`, () => {
    const data = [
      42,
      `Meaow`,
      new Item(`Prrrrr`),
      {content: 'NianNianNian…', checked: true, id: 'a3F4dfro'},
      {content: 'Human must die!', checked: true},
      {content: 'Cats Rulez!'},
      {}
    ]

    const todo = ToDoManager.from(data)

    expect(todo).toBeInstanceOf(ToDo)
    expect(todo).toHaveLength(5)

    expect(todo[0]).toBeInstanceOf(Item)
    expect(todo[0].content).toBe(data[1])
    expect(todo[1]).toStrictEqual(data[2])
    expect(todo[2]).toBeInstanceOf(Item)
    expect(todo[2].content).toBe(data[3].content)
    expect(todo[2].checked).toBe(data[3].checked)
    expect(todo[2].is).toBe(data[3].is)
    expect(todo[3]).toBeInstanceOf(Item)
    expect(todo[3].content).toBe(data[4].content)
    expect(todo[3].checked).toBe(data[4].checked)
    expect(todo[4]).toBeInstanceOf(Item)
    expect(todo[4].content).toBe(data[5].content)
  })

  test(`ToDoManager.from(<Iterator>)`, () => {
    const item = new Item(`Prrrrr`)
    function* data () {
      yield 42
      yield `Meaow`
      yield item
      yield {content: 'NianNianNian…', checked: true, id: 'a3F4dfro'}
      yield {content: 'Human must die!', checked: true}
      yield {content: 'Cats Rulez!'}
      yield {}
    }

    const items = Array.from(data())
    const todo = ToDoManager.from(data())

    expect(todo).toBeInstanceOf(ToDo)
    expect(todo).toHaveLength(5)

    expect(todo[0]).toBeInstanceOf(Item)
    expect(todo[0].content).toBe(items[1])
    expect(todo[1]).toStrictEqual(items[2])
    expect(todo[2]).toBeInstanceOf(Item)
    expect(todo[2].content).toBe(items[3].content)
    expect(todo[2].checked).toBe(items[3].checked)
    expect(todo[2].is).toBe(items[3].is)
    expect(todo[3]).toBeInstanceOf(Item)
    expect(todo[3].content).toBe(items[4].content)
    expect(todo[3].checked).toBe(items[4].checked)
    expect(todo[4]).toBeInstanceOf(Item)
    expect(todo[4].content).toBe(items[5].content)
  })

  test(`ToDoManager.from(<string>)`, () => {
    const todo = ToDoManager.from(`Meaow`)

    expect(todo).toBeInstanceOf(ToDo)
    expect(todo).toHaveLength(1)
    expect(todo[0]).toBeInstanceOf(Item)
    expect(todo[0].content).toBe(`Meaow`)
  })

  test(`ToDoManager.from(<Item>)`, () => {
    const item = new Item(`Meaow`)
    const todo = ToDoManager.from(item)

    expect(todo).toBeInstanceOf(ToDo)
    expect(todo).toHaveLength(1)
    expect(todo[0]).toStrictEqual(item)
  })

  test(`ToDoManager.from({content})`, () => {
    const tests = [
      {content: 'NianNianNian…', checked: true, id: 'a3F4dfro'},
      {content: 'Human must die!', checked: true},
      {content: 'Cats Rulez!'}
    ]

    tests.forEach(obj => {
      const todo = ToDoManager.from(obj)

      expect(todo).toBeInstanceOf(ToDo)
      expect(todo).toHaveLength(1)
      expect(todo[0]).toBeInstanceOf(Item)
      expect(todo[0].content).toBe(obj.content)

      if ('checked' in obj) {
        expect(todo[0].checked).toBe(obj.checked)
      }

      if ('id' in obj) {
        expect(todo[0].id).toBe(obj.id)
      }
    })
  })

  test(`ToDoManager.from(<any>)`, () => {
    const tests = [
      42, {}, undefined, null, true, () => {}
    ]

    tests.forEach(value => {
      const todo = ToDoManager.from(value)

      expect(todo).toBeInstanceOf(ToDo)
      expect(todo).toHaveLength(0)
    })
  })
})

describe(`ToDoManager.load helper`, () => {
  afterAll(async () => {
    await rmFile(testJSONFile)
  })

  test(`ToDoManager.load(<path>) :: <array<string>>`, async () => {
    const data = [
      `Meaow`,
      `Cats rulez!`,
      `Human must die!`
    ]

    await writeFile(testJSONFile, JSON.stringify(data))
    const todo = await ToDoManager.load(testJSONFile)

    expect(todo).toBeInstanceOf(ToDo)
    expect(todo).toHaveLength(data.length)
    todo.forEach((item, index) => {
      expect(item).toBeInstanceOf(Item)
      expect(item.content).toBe(data[index])
    })
  })

  test(`ToDoManager.load(<path>) :: <array<{content}>>`, async () => {
    const data = [
      { content: `Meaow`, checked: true, id:`aZ34efr2` },
      { content: `Cats rulez!`, checked: true },
      { content: `Human must die!` }
    ]

    await writeFile(testJSONFile, JSON.stringify(data))
    const todo = await ToDoManager.load(testJSONFile)

    expect(todo).toBeInstanceOf(ToDo)
    expect(todo).toHaveLength(data.length)
    todo.forEach((item, index) => {
      expect(item).toBeInstanceOf(Item)
      expect(item.content).toBe(data[index].content)

      if ('checked' in data[index]) {
        expect(item.checked).toBe(data[index].checked)
      }

      if ('id' in data[index]) {
        expect(item.id).toBe(data[index].id)
      }
    })
  })

  test(`ToDoManager.load(<path>) :: <ToDo>`, async () => {
    const data = new ToDo('CAN I HAZ CHEESEBURGER!', [
      `Meaow`,
      `Cats rulez!`,
      `Human must die!`
    ])

    await writeFile(testJSONFile, JSON.stringify(data))
    const todo = await ToDoManager.load(testJSONFile)

    expect(todo).toBeInstanceOf(ToDo)
    expect(todo).toHaveLength(data.length)
    todo.forEach((item, index) => {
      expect(item).toBeInstanceOf(Item)
      expect(item.content).toBe(data[index].content)

      if ('checked' in data[index]) {
        expect(item.checked).toBe(data[index].checked)
      }

      if ('id' in data[index]) {
        expect(item.id).toBe(data[index].id)
      }
    })
  })
})

describe(`ToDoManager.save helper`, () => {
  afterAll(async () => {
    await rmFile(testJSONFile)
  })

  test(`ToDoManager.save(<ToDo>, <path>)`, async () => {
    const todo = new ToDo('CAN I HAZ CHEESEBURGER!', [
      `Meaow`,
      `Cats rulez!`,
      `Human must die!`
    ])

    await ToDoManager.save(todo, testJSONFile)
    const data = String(await readFile(testJSONFile))

    expect(data).toBe(JSON.stringify(todo))
  })
})
