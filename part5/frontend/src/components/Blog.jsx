import {useState} from 'react'
const Blog = ({ blog, handleLike, handleRemove, user }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }
  const [showAll, setShowAll] = useState(false)
  const toggleShowAll = () => {
    setShowAll(!showAll)
  }
  
  const showRemoveButton = user && blog.user && (
    (typeof blog.user === 'object' && blog.user.username === user.username) ||
    (typeof blog.user === 'string' && blog.user === user.username)
  )

  if (showAll) {
    return (
      <div style={blogStyle} className='showAll'>
        {blog.title} {blog.user && (typeof blog.user === 'object' ? blog.user.username : blog.user)}
        <button onClick={toggleShowAll}>hide</button>
        <br />
        {blog.url}
        <br />
        {blog.likes} likes <button onClick={() => handleLike(blog)}>like</button>
        {showRemoveButton && <button onClick={() => handleRemove(blog)}>remove</button>}
      </div>  
    )
  }
  return (
    <div style={blogStyle} className='short'>
      {blog.title} {blog.user && (typeof blog.user === 'object' ? blog.user.username : blog.user)}
      <button onClick={toggleShowAll}>view</button>
    </div>
  )
}

export default Blog