import { useState } from "react"
import blogService from '../services/blogs'

const Blog = ({ blog, updateLikes, user, deleteBlog }) => {

  const [visible, setVisible] = useState(false)

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  const handleClick = () => {

    const updatedBlog = {
      ...blog,
      user: blog.user.id,
      likes: blog.likes + 1
    }

    updateLikes(blog.id, updatedBlog)
  }

  const confirmDelete = () => {
    const result = window.confirm(`Remove ${blog.title} by ${blog.author}`)
    if (result)
      deleteBlog(blog)
  }

  const deleteButton = (user.username === blog.user.username)

  return (
    <div className="blog">
      {blog.title}
      <button onClick={toggleVisibility}>
        {visible ? 'hide' : 'view'}
      </button>
      {
        visible && (
          <div>
            <div>
              Author: {blog.author}
            </div>
            <div>
              <a href={blog.url} target="_blank" rel="noreferrer">
                {blog.url}
              </a>
            </div>
            <div>
              Likes: {blog.likes} <button onClick={handleClick}>like</button>
            </div>
            {
              deleteButton && (
                <button onClick={confirmDelete}>remove</button>
              )
            }
          </div>
        )
      }

    </div>
  )
}

export default Blog