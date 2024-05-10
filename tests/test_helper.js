const Blog = require('../models/blog')
const User = require('../models/user')

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

const singleBlog = {
  title: 'Unraveling the Mysteries of Dinosaurs: A Journey Through Prehistory',
  author: 'David Johnson',
  url: 'https://www.example.com/dinosaur-mysteries',
  likes: 342,
}

const initialUser = [
  {
    username: 'root',
    password: 'root123',
  },
  {
    name: 'Eren Yeager',
    username: 'eren.aot',
    password: 'eren123',
  },
]

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map((b) => b.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map((u) => u.toJSON())
}

module.exports = {
  initialBlog,
  singleBlog,
  blogsInDb,
  initialUser,
  usersInDb,
}
