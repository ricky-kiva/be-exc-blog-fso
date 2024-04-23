const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

const blogs = [
  {
    _id: '5a422a851b54a676234d17f7',
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
    __v: 0,
  },
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    __v: 0,
  },
  {
    _id: '5a422b3a1b54a676234d17f9',
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12,
    __v: 0,
  },
  {
    _id: '5a422b891b54a676234d17fa',
    title: 'First class tests',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
    likes: 10,
    __v: 0,
  },
  {
    _id: '5a422ba71b54a676234d17fb',
    title: 'TDD harms architecture',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
    likes: 0,
    __v: 0,
  },
  {
    _id: '5a422bc61b54a676234d17fc',
    title: 'Type wars',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    likes: 2,
    __v: 0,
  },
]

test('dummy returns one', () => {
  const result = listHelper.dummy([])
  assert.strictEqual(result, 1)
})

describe('total likes', () => {
  test('of empty list is zero', () => {
    assert.strictEqual(listHelper.totalLikes([]), 0)
  })

  test('when list has only one blog equals the likes of that', () => {
    assert.strictEqual(listHelper.totalLikes([blogs[0]]), blogs[0].likes)
  })

  test('of a bigger list is calculated right', () => {
    let result = 0
    for (let i = 0; i < blogs.length; i++) { result += blogs[i].likes }

    assert.strictEqual(listHelper.totalLikes(blogs), result)
  })
})

describe('favorite blog', () => {
  const favorite = {
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    likes: 12,
  }

  test('of empty list is null', () => {
    assert.deepStrictEqual(listHelper.favoriteBlog([]), null)
  })

  test('when list has only one most likes', () => {
    assert.deepStrictEqual(listHelper.favoriteBlog(blogs), favorite)
  })

  test('when list has multiple same amount of most likes', () => {
    const myBlog = {
      _id: '3c422a851b54a676234d17r8',
      title: 'Rickyslash Project',
      author: 'Rickyslash',
      url: 'https://rickyslash.my.id/',
      likes: 12,
      __v: 0,
    }

    const newBlogs = blogs
    newBlogs.push(myBlog)

    assert.deepStrictEqual(listHelper.favoriteBlog(newBlogs), {
      title: myBlog.title,
      author: myBlog.author,
      likes: myBlog.likes,
    })
  })
})
