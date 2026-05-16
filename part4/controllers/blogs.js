const Blog = require('../models/blog')
const blogRouter = require('express').Router()

blogRouter.get('/', async(req, res) => {
    
    const blogs = await Blog.find({})
    res.json(blogs)
})

blogRouter.get('/:id', async (request, response) => {
    const id = request.params.id
        const blog = await Blog.findById(id)
        if (blog) {
            response.json(blog)
        } else {
            response.status(404).end()
        }
})

blogRouter.post('/', async (request, response, next) => {
  const body = request.body

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes
  })
    const savedBlog = await blog.save()
    response.status(201).json(savedBlog)
})

blogRouter.delete('/:id', async (request, response) => {
    const id = request.params.id
    await Blog.findByIdAndDelete(id)
    response.status(204).end()
})

blogRouter.put('/:id', async (request, response) => {
    const id = request.params.id
    const body = request.body

    const blog = {
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes
    }

    const updatedBlog = await Blog.findByIdAndUpdate(id, blog, { new: true })
    response.json(updatedBlog)
})

module.exports = blogRouter