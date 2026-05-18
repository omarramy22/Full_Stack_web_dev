import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import NewBlog from './components/new_blog'
import blogService from './services/blogs'
import Notification from './components/Notification'
import loginService from './services/login'
import Login from './components/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [newUser, setNewUser] = useState({
    username: '',
    password: ''
  })
  const [newBlog, setNewBlog] = useState({
    title: '',
    url: '', 
  })
  const [message, setmessage] = useState(null)
  const [isError, setisError] = useState(false)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
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
  const handleSubmit = async (event) => {
  event.preventDefault()
  try {
    const blogObject = {
      title: newBlog.title,
      url: newBlog.url,
      likes: 0
    }
    const returnedBlog =
      await blogService.create(blogObject)

    setBlogs(blogs.concat(returnedBlog))

    setNewBlog({
      title: '',
      url: ''
    })

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
            <Blog key={blog.id} blog={blog} />
          )}
          <h2>create new</h2>
          <NewBlog newBlog={newBlog} setNewBlog={setNewBlog} handleSubmit={handleSubmit} />
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