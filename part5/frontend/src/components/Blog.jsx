const Blog = ({ blog }) => (
  <div>
    The {blog.title} was written by {blog.user.username} and has {blog.likes} likes
  </div>  
)

export default Blog