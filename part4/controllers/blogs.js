const Blog = require('../models/blog')
const blogRouter = require('express').Router()

blogRouter.get('/', (req, res, next) => {
    Blog.find({}).then(result => {
        res.json(result)
    }).catch(error => {
        next(error)
    })
})

blogRouter.get('/:id', (request, response, next) => {
    const id = request.params.id
    Blog.findById(id).then(blog => {
        if (blog) {
            response.json(blog)
        } else {
            response.status(404).end()
        }
    }).catch(error => {
        next(error)
    })
}
)

blogRouter.post('/', (request, response, next) => {
  const body = request.body
  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes
  })
  blog.save().then(savedBlog => {
    response.status(201).json(savedBlog)
  }).catch(error => {
    next(error)
  })
})

module.exports = blogRouter