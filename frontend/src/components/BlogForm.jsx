import { useState } from 'react'

const BlogForm = ({ createBlog }) => {
    const [newBlog, setNewBlog] = useState({
        title: '',
        author: '',
        url: '',
        likes: 0
    })

    const addBlog = (event) => {
        event.preventDefault()
        createBlog(newBlog)
        setNewBlog({ title: '', author: '', url: '', likes: 0 })
    }

    const handleInputChange = (event) => {
        const { name, value } = event.target
        setNewBlog({
            ...newBlog,
            [name]: value
        })
    }

    return (
        <div>
            <h2>Create a new Blog</h2>
            <form onSubmit={addBlog}>
                <div>
                    title:
                    <input
                        name='title'
                        value={newBlog.title}
                        onChange={handleInputChange}
                    />

                </div>

                <div>
                    url:
                    <input
                        name='url'
                        value={newBlog.url}
                        onChange={handleInputChange}
                    />
                </div>

                <div>
                    author:
                    <input
                        name='author'
                        value={newBlog.author}
                        onChange={handleInputChange}
                    />
                </div>

                <div>
                    likes:
                    <input
                        name='likes'
                        value={newBlog.likes}
                        onChange={handleInputChange}
                    />
                </div>

                <button type="submit">save</button>
            </form>
        </div>
    )
}

export default BlogForm