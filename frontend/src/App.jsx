import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'
import Error from './components/Error'
import blogService from './services/blogs'
import loginService from './services/login'
import userService from './services/users'

const App = () => {
  const [blogs, setBlogs] = useState([])

  const [username, setUsername] = useState('')

  const [password, setPassword] = useState('')

  const [user, setUser] = useState(null)

  const [errorMessage, setErrorMessage] = useState(null)

  const [notificationMessage, setNotificationMessage] = useState(null)

  const [newName, setNewName] = useState('')

  const [newUsername, setNewUsername] = useState('')

  const [newPassword, setNewPassword] = useState('')

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs)
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

  const handleLikes = async (id, blogObject) => {
    try {
      const updatedBlog = await blogService.put(blogObject, id)
      setBlogs(blogs.map(b => b.id === id ? updatedBlog : b))
    }
    catch (exception) {
      setErrorMessage('Error updating likes')
      setTimeout(() => setErrorMessage(null), 5000)
    }
  }

  const deleteBlog = async (blog) => {
    try {
      const deletedBlog = await blogService.deleteBlog(blog.id)
      setBlogs(blogs.filter(b => b.id !== blog.id))
      setNotificationMessage(`${blog.title} by ${blog.author} was removed`)
      setTimeout(() => setNotificationMessage(null), 5000)
    }
    catch (exception) {
      setErrorMessage('Error deleting Blog')
      setTimeout(() => setErrorMessage(null), 5000)
    }
  }

  const blogFormRef = useRef()

  const blogForm = () => (
    <Togglable buttonLabel1='new Blog' buttonLabel2='cancel' ref={blogFormRef}>
      <BlogForm createBlog={addBlog} />
    </Togglable>
  )

  const addBlog = (blogObject) => {
    blogFormRef.current.toggleVisibility()
    blogService
      .create(blogObject)
      .then(returnedBlog => {
        setBlogs(blogs.concat(returnedBlog))
        setNotificationMessage(`A new blog ${returnedBlog.title} by ${returnedBlog.author} added`)
        setTimeout(() => setNotificationMessage(null), 5000)
      })
      .catch(error => {
        setErrorMessage('Failed to create blog')
        setTimeout(() => setErrorMessage(null), 5000)
      })
  }

  const handleCreateAccount = async (event) => {
    event.preventDefault()

    try {
      const newUser = {
        name: newName,
        username: newUsername,
        password: newPassword,
      }

      const savedUser = await userService.create(newUser)

      setNewName('')
      setNewUsername('')
      setNewPassword('')

      setNotificationMessage(`${savedUser.name} registered!`)
      setTimeout(() => {
        setNotificationMessage(null)
      }, 5000)
    }
    catch (exception) {
      setNewName('')
      setNewUsername('')
      setNewPassword('')

      const message = exception.response?.data?.error || 'Something went Worng'

      setErrorMessage(`${message}`)
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }




  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username, password,
      })

      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )

      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')

      setNotificationMessage(`${user.name} logged in`)
      setTimeout(() => {
        setNotificationMessage(null)
      }, 5000)

    } catch (exception) {
      setErrorMessage('Wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const createAccountForm = () => (
    <form onSubmit={handleCreateAccount}>
      <div>
        Name
        <input type="text"
          value={newName}
          name='Name'
          onChange={({ target }) => setNewName(target.value)}
        />
      </div>
      <div>
        Username
        <input type="text"
          value={newUsername}
          name='Username'
          onChange={({ target }) => setNewUsername(target.value)}
        />
      </div>
      <div>
        Password
        <input type="password"
          value={newPassword}
          name='Password'
          autoComplete="on"
          onChange={({ target }) => setNewPassword(target.value)}
        />
      </div>

      <button type='submit' className='new-account-button'>Create Account</button>

    </form>
  )



  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        username
        <input
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
        <input
          type="password"
          value={password}
          name="Password"
          autoComplete="on"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit" className='login-button'>login</button>
    </form>
  )

  const logout = () => {
    window.localStorage.clear()
    setUser(null)
  }

  const logoutButton = () => (
    <button
      onClick={() => logout()}
      className='logout-button'>
      logout
    </button>
  )

  if (user == null) {
    return (
      <div>
        <Notification message={notificationMessage} />
        <div>
          <h2>Log in to application</h2>
          <Error message={errorMessage} />

          {loginForm()}
        </div>

        <div>
          <h2>Create Account</h2>
          {createAccountForm()}
        </div>
      </div>
    )
  }

  return (
    <div>
      <h2>blogs</h2>
      <Notification message={notificationMessage} />
      {logoutButton()}
      {blogForm()}
      {[...blogs].sort((a, b) => b.likes - a.likes).map(blog =>
        <Blog key={blog.id} blog={blog} updateLikes={handleLikes} user={user} deleteBlog={deleteBlog} />
      )}
    </div>
  )
}

export default App