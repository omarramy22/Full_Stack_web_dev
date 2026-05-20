import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import NewBlog from './components/new_blog'
import blogService from './services/blogs'
import Notification from './components/Notification'
import loginService from './services/login'
import Login from './components/login'
import Togglable from './components/toggable'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [newUser, setNewUser] = useState({
    username: '',
    password: ''
  })

  const [message, setmessage] = useState(null)
  const [isError, setisError] = useState(false)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs.slice().sort((a, b) => b.likes - a.likes))
    )  
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService(newUser)
      if (user) {
        window.localStorage.setItem(
          'loggedBlogappUser', JSON.stringify(user)
        )
        blogService.setToken(user.token)
        setNewUser({
          username: '',
          password: ''
        })
        setUser(user)
      }
    } catch (exception) {
      setmessage('Wrong credentials')
      setisError(true)
      setTimeout(() => {
        setmessage(null)
        setisError(false)
      }, 5000)
    }
  }
  const createBlog = async (blogObject) => {
  try {
    const returnedBlog = await blogService.create(blogObject)

    setBlogs(blogs.concat(returnedBlog))

    setmessage('Blog created successfully')
    setisError(false)

    setTimeout(() => {
      setmessage(null)
    }, 5000)

  } catch (exception) {
    setmessage('Error creating blog, revise the form and try again')
    setisError(true)

    setTimeout(() => {
      setmessage(null)
    }, 5000)

    console.log(exception)
  }
}
const handleLike = async (blog) => {
  try {
    const updatedBlog = await blogService.update(blog.id, { ...blog, likes: blog.likes + 1 })
    setBlogs(blogs.slice().sort((a, b) => b.likes - a.likes).map(b => b.id === blog.id ? updatedBlog : b))
    setmessage(`You liked ${blog.title}`)
    setisError(false)
    setTimeout(() => {
      setmessage(null)
    }, 5000)
  } catch (exception) {
    console.log(exception)
    setmessage('Error liking the blog, try again later')
    setisError(true)
    setTimeout(() => {
      setmessage(null)
      setisError(false)
    }, 5000)
  }
}
const handleRemove = async (blog) => {
  if (window.confirm(`Are you sure you want to remove ${blog.title} by ${blog.user.username}?`)) {
    try {
      await blogService.remove(blog.id)
      setBlogs(blogs.filter(b => b.id !== blog.id))
      setmessage('Blog removed successfully')
      setisError(false)
      setTimeout(() => {
        setmessage(null)
      }, 5000)
    } catch (exception) {
      console.log(exception)
      setmessage('Error removing the blog, try again later')
      setisError(true)
      setTimeout(() => {
        setmessage(null)
        setisError(false)
      }, 5000)
    }
  }
}
  return (
    <div>
      <Notification message={message} isError={isError} />
      {user && (
        <>
          <p>{user.name} logged in</p>
          <button onClick={() => {
            window.localStorage.removeItem('loggedBlogappUser')
            setUser(null)
          }}>Logout</button>
          <h2>blogs</h2>
          {blogs.map(blog =>
            <Blog key={blog.id} blog={blog} handleLike={handleLike} handleRemove={handleRemove} />
          )}
          <Togglable buttonLabel='Create new blog'>
            <NewBlog createBlog={createBlog} />
          </Togglable>
        </>
      )}  {!user && (
        <>
        <Login handleLogin={handleLogin} newUser={newUser} setNewUser={setNewUser} />
        </>
      )}
    </div>
  )
}

export default App