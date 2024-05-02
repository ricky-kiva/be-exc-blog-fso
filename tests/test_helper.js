const Blog = require('../models/blog')

const initialBlog = [
  {
    title: 'Exploring the Wonders of Wildlife Photography',
    author: 'Emily Johnson',
    url: 'https://www.example.com/wildlife-photography',
    likes: 120,
  },
  {
    title: 'The Art of Vegan Cooking: A Delicious Journey',
    author: 'Alexandra Green',
    url: 'https://www.example.com/vegan-cooking',
    likes: 98,
  },
]

const blogsInDb = async () => {
  const blogs = await Blog.find({})

  return blogs.map((b) => b.toJSON())
}

module.exports = {
  initialBlog,
  blogsInDb,
}
