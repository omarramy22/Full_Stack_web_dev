const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

test('dummy returns one', () => {
  const blogs = []

  const result = listHelper.dummy(blogs)
  assert.strictEqual(result, 1)
})

test('total likes of empty list is zero', () => {
    const blogs = []
    const result = listHelper.totalLikes(blogs)
    assert.strictEqual(result, 0)
})

test('total likes of a list with one blog equals the likes of that', () => {
    const blogs = [
        {
            title: 'Test Blog',
            author: 'Test Author',
            url: 'https://test.com',
            likes: 5
        }
    ]
    const result = listHelper.totalLikes(blogs)
    assert.strictEqual(result, 5)
})

test('total likes of a list with multiple blogs is calculated correctly', () => {
    const blogs = [
        {
            title: 'Test Blog 1',
            author: 'Test Author 1',
            url: 'https://test1.com',
            likes: 5
        },
        {
            title: 'Test Blog 2',
            author: 'Test Author 2',
            url: 'https://test2.com',
            likes: 10
        }
    ]
    const result = listHelper.totalLikes(blogs)
    assert.strictEqual(result, 15)
})

test('favorite blog of empty list is null', () => {
    const blogs = []
    const result = listHelper.favoriteBlog(blogs)
    assert.deepStrictEqual(result, null)
})

test('favorite blog of a list with one blog is that blog', () => {
    const blogs = [
        {
            title: 'Test Blog',
            author: 'Test Author',
            url: 'https://test.com',
            likes: 5
        }
    ]
    const result = listHelper.favoriteBlog(blogs)
    assert.deepStrictEqual(result, blogs[0])
})

test('favorite blog of a list with multiple blogs is the one with most likes', () => {
    const blogs = [
        {
            title: 'Test Blog 1',
            author: 'Test Author 1',
            url: 'https://test1.com',
            likes: 5
        },
        {
            title: 'Test Blog 2',
            author: 'Test Author 2',
            url: 'https://test2.com',
            likes: 10
        }
    ]
    const result = listHelper.favoriteBlog(blogs)
    assert.deepStrictEqual(result, blogs[1])
})

test('most blogs of empty list is null', () => {
    const blogs = []
    const result = listHelper.mostBlogs(blogs)
    assert.deepStrictEqual(result, null)
})

test('most blogs of a list with one blog is the author of that blog with 1 blog', () => {
    const blogs = [
        {
            title: 'Test Blog',
            author: 'Test Author',
            url: 'https://test.com',
            likes: 5
        }
    ]
    const result = listHelper.mostBlogs(blogs)
    assert.deepStrictEqual(result, { author: 'Test Author', blogs: 1 })
})

test('most blogs of a list with multiple blogs is the author with most blogs and the count', () => {
    const blogs = [
        {
            title: 'Test Blog 1',
            author: 'Test Author 1',
            url: 'https://test1.com',
            likes: 5
        },
        {
            title: 'Test Blog 2',
            author: 'Test Author 1',
            url: 'https://test2.com',
            likes: 10
        }
    ]
    const result = listHelper.mostBlogs(blogs)
    assert.deepStrictEqual(result, { author: 'Test Author 1', blogs: 2 })
})

test('most blogs of a list with multiple blogs and multiple authors is the author with most blogs and the count', () => {
    const blogs = [
        {
            title: 'Test Blog 1',
            author: 'Test Author 1',
            url: 'https://test1.com',
            likes: 5
        },
        {
            title: 'Test Blog 1.1',
            author: 'Test Author 1',
            url: 'https://test1.1.com',
            likes: 3
        },
        {
            title: 'Test Blog 2',
            author: 'Test Author 2',
            url: 'https://test2.com',
            likes: 10
        }
    ]
    const result = listHelper.mostBlogs(blogs)
    assert.deepStrictEqual(result, { author: 'Test Author 1', blogs: 2 })
})

test('most likes of empty list is null', () => {
    const blogs = []
    const result = listHelper.mostLikes(blogs)
    assert.deepStrictEqual(result, null)
})

test('most likes of a list with one blog is the author of that blog with the likes of that blog', () => {
    const blogs = [
        {
            title: 'Test Blog',
            author: 'Test Author',
            url: 'https://test.com',
            likes: 5
        }
    ]
    const result = listHelper.mostLikes(blogs)
    assert.deepStrictEqual(result, { author: 'Test Author', likes: 5 })
})

test('most likes of a list with multiple blogs is the author with most likes and the total likes', () => {
    const blogs = [
        {
            title: 'Test Blog 1',
            author: 'Test Author 1',
            url: 'https://test1.com',
            likes: 5
        },
        {
            title: 'Test Blog 2',
            author: 'Test Author 2',
            url: 'https://test2.com',
            likes: 10
        }
    ]
    const result = listHelper.mostLikes(blogs)
    assert.deepStrictEqual(result, { author: 'Test Author 2', likes: 10 })
})

test('most likes of a list with multiple blogs and multiple authors is the author with most likes and the total likes', () => {
    const blogs = [
        {
            title: 'Test Blog 1',
            author: 'Test Author 1',
            url: 'https://test1.com',
            likes: 5
        },
        {
            title: 'Test Blog 1.1',
            author: 'Test Author 1',
            url: 'https://test1.1.com',
            likes: 13
        },
        {
            title: 'Test Blog 2',
            author: 'Test Author 2',
            url: 'https://test2.com',
            likes: 10
        }
    ]
    const result = listHelper.mostLikes(blogs)
    assert.deepStrictEqual(result, { author: 'Test Author 1', likes: 18 })
})
