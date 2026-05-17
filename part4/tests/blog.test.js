const { test, after, beforeEach} = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const helper = require('./test_helper')

const initialBlogs = helper.initialBlogs

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(initialBlogs)
})

const api = supertest(app)

test.only('notes are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test.only('all blogs are returned', async () => {
  const response = await api.get('/api/blogs')

  assert.strictEqual(response.body.length, initialBlogs.length)
})

test.only('a specific Blog is within the returned blogs', async () => {
  const response = await api.get('/api/blogs')

  const contents = response.body.map(e => e.title)
  assert(contents.includes('My first blog'))
})

test.only('a valid Blog can be added', async () => {
  const newBlog = {
    title: 'My third blog',
    user: '6a08adeef5bff30967439011',
    url: 'https://example.com/blog3',
    likes: 3
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()
  assert.strictEqual(blogsAtEnd.length, initialBlogs.length + 1)

  const contents = blogsAtEnd.map(b => b.title)
  assert(contents.includes('My third blog'))
})

test.only('blog without title is not added', async () => {
  const newBlog = {
    user: '6a08adeef5bff30967439011',
    url: 'https://example.com/blog3',
    likes: 3
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)

  const blogsAtEnd = await helper.blogsInDb()
  assert.strictEqual(blogsAtEnd.length, initialBlogs.length)
})

test.only('blog without url is not added', async () => {
  const newBlog = {
    title: 'My fifth blog',
    user: '6a08adeef5bff30967439011',
    likes: 5
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)

  const blogsAtEnd = await helper.blogsInDb()
  assert.strictEqual(blogsAtEnd.length, initialBlogs.length)
})

test.only('Id property is called id', async () => {
  const response = await api.get('/api/blogs')
  assert(response.body[0].hasOwnProperty('id'))
})

test.only('A specific blog can be viewed', async () => {
  const blogsAtStart = await helper.blogsInDb()
  const blogToView = blogsAtStart[0]

  const response = await api
    .get(`/api/blogs/${blogToView.id}`)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  assert.deepStrictEqual(response.body, blogToView)
})

test.only('A blog can be deleted', async () => {
  const blogsAtStart = await helper.blogsInDb()
  const blogToDelete = blogsAtStart[0]

  await api
    .delete(`/api/blogs/${blogToDelete.id}`)
    .expect(204)

  const blogsAtEnd = await helper.blogsInDb()
  assert.strictEqual(blogsAtEnd.length, initialBlogs.length - 1)
  assert(!blogsAtEnd.map(b => b.id).includes(blogToDelete.id))
})

test.only('Deafult value of likes is 0', async () => {
  const newBlog = {
    title: 'My fourth blog',
    user: '6a08adeef5bff30967439011',
    url: 'https://example.com/blog4'
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()
  const addedBlog = blogsAtEnd.find(b => b.title === 'My fourth blog')
  assert.strictEqual(addedBlog.likes, 0)
})

test.only('A blog can be updated', async () => {
  const blogsAtStart = await helper.blogsInDb()
  const blogToUpdate = blogsAtStart[0]

  const updatedBlog = {
    title: 'Updated Blog Title',
    user: '6a08adeef5bff30967439011',
    url: 'https://example.com/updated-blog',
    likes: 10
  }

  await api
    .put(`/api/blogs/${blogToUpdate.id}`)
    .send(updatedBlog)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()
  const blog = blogsAtEnd.find(b => b.id === blogToUpdate.id)
  assert.deepStrictEqual(
    {
      ...blog,
      user: blog.user.toString()
    },
    {
      ...blogToUpdate,
      ...updatedBlog
    }
  )
})

after(async () => {
  await mongoose.connection.close()
})
