import { useState } from "react"
import blogService from '../services/blogs'

const Blog = ({ blog, updateLikes }) => {

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
          </div>
        )
      }
    </div>
  )
}

export default Blog