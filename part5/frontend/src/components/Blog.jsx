import {useState} from 'react'
const Blog = ({ blog, handleLike, handleRemove }) => {
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
  
  if (showAll) {
    return (
      <div style={blogStyle} className='showAll'>
        {blog.title} {blog.user.username}
        <button onClick={toggleShowAll}>hide</button>
        <br />
        {blog.url}
        <br />
        {blog.likes} likes <button onClick={() => handleLike(blog)}>like</button>
        <button onClick={() => handleRemove(blog)}>remove</button>
      </div>  
    )
  }
  return (
    <div style={blogStyle} className='short'>
      {blog.title} {blog.user.username}
      <button onClick={toggleShowAll}>view</button>
    </div>
  )
}

export default Blog