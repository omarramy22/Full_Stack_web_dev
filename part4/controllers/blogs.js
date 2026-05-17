const Blog = require('../models/blog')
const User = require('../models/user')
const blogRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const getuserFromToken = require('../utils/middleware').getUserFromToken

blogRouter.get('/', async(req, res) => {
    
    const blogs = await Blog.find({}).populate('user', { username: 1})
    res.json(blogs)
})

blogRouter.get('/:id', async (request, response) => {
    const id = request.params.id
        const blog = await Blog.findById(id)
        if (blog) {
            response.json(blog).populate('user', { username: 1})
        } else {
            response.status(404).end()
        }
})

blogRouter.post('/', getuserFromToken, async (request, response, next) => {
  const body = request.body
    
    const user = await User.findById(request.user)
    const blog = new Blog({
    title: body.title,
    user: user._id,
    url: body.url,
    likes: body.likes
  })
    const savedBlog = await blog.save()
    user.notes = user.notes.concat(savedBlog._id)
    await user.save()
    response.status(201).json(savedBlog)
})

blogRouter.delete('/:id', getuserFromToken, async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  if (!blog) {
    return response.status(404).json({
      error: 'There is no blog with the given id'
    })
  }
  if (blog.user.toString() !== request.user.toString()) {
    return response.status(401).json({
      error: 'only the creator of the blog can delete it'
    })
  }
  await blog.deleteOne()
  response.status(204).end()
})

blogRouter.put('/:id', async (request, response) => {
    const id = request.params.id
    const body = request.body

    const blog = {
        title: body.title,
        user: body.user._id,
        url: body.url,
        likes: body.likes
    }

    const updatedBlog = await Blog.findByIdAndUpdate(id, blog, { new: true })
    body.user.notes = body.user.notes.concat(updatedBlog._id)
    await body.user.save()
    response.json(updatedBlog)
})

module.exports = blogRouter