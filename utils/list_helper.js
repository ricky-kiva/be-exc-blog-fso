const _ = require('lodash')

// eslint-disable-next-line no-unused-vars
const dummy = (blogs) => 1

const totalLikes = (blogs) => blogs
  .reduce(((acc, blog) => acc + blog.likes), 0)

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) { return null }

  let favLikes = -1
  let favIndex = -1

  blogs.forEach((blog, i) => {
    if (blog.likes >= favLikes) {
      favLikes = blog.likes
      favIndex = i
    }
  })

  const fav = blogs[favIndex]

  return {
    title: fav.title,
    author: fav.author,
    likes: fav.likes,
  }
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) { return null }

  const blogsPerAuthor = _.countBy(blogs, 'author')
  const topAuthor = _.maxBy(_.keys(blogsPerAuthor), (author) => blogsPerAuthor[author])

  return {
    author: topAuthor,
    blogs: blogsPerAuthor[topAuthor],
  }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
}
