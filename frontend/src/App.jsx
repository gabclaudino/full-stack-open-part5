import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'
import RegisterForm from './components/RegisterForm'
import Togglable from './components/Togglable'
import Error from './components/Error'
import blogService from './services/blogs'
import loginService from './services/login'
import userService from './services/users'

const App = () => {
  const [blogs, setBlogs] = useState([])

  const [user, setUser] = useState(null)

  const [errorMessage, setErrorMessage] = useState(null)

  const [notificationMessage, setNotificationMessage] = useState(null)

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
    <Togglable ref={blogFormRef}>
      <BlogForm createBlog={addBlog} />
    </Togglable>
  )

  const addBlog = async (blogObject) => {
    try {
      const returnedBlog = await blogService.create(blogObject)

      blogFormRef.current.toggleVisibility()

      setBlogs(blogs.concat(returnedBlog))
      setNotificationMessage(`A new blog ${returnedBlog.title} by ${returnedBlog.author} added`)
      setTimeout(() => setNotificationMessage(null), 5000)
    }
    catch (exception) {
      console.log(exception)

      const message = exception.response?.data?.error || 'Something went Worng'
      setErrorMessage(`${message}`)
      setTimeout(() => setErrorMessage(null), 5000)
    }
  }

  const handleRegister = async (newUserObject) => {
    try {

      if (newUserObject.password !== newUserObject.confirmPassword) {
        setErrorMessage("The passwords does't match!")
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)

        return
      }

      const newUser = {
        name: newUserObject.name,
        username: newUserObject.username,
        password: newUserObject.password,
      }

      await userService.create(newUserObject)

      const userLoggedIn = await loginService.login({
        username: newUser.username,
        password: newUser.password,
      })

      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(userLoggedIn)
      )
      blogService.setToken(userLoggedIn.token)
      setUser(userLoggedIn)

      setNotificationMessage(`Welcome, ${userLoggedIn.name}! Account created!`)
      setTimeout(() => setNotificationMessage(null), 5000)

    } catch (exception) {
      const message = exception.response?.data?.error || 'Error during registration'
      setErrorMessage(message)
      setTimeout(() => setErrorMessage(null), 5000)
    }
  }

  const handleLogin = async (username, password) => {

    try {
      const user = await loginService.login({
        username, password,
      })

      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )

      blogService.setToken(user.token)
      setUser(user)

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

  const logout = () => {
    window.localStorage.clear()
    setUser(null)
  }

  const logoutButton = () => (
    <button
      onClick={() => logout()}
      className="px-4 py-2 bg-white text-red-600 font-medium rounded-lg border border-red-200 hover:bg-red-50 hover:border-red-300 transition-all shadow-sm">
      logout
    </button>
  )

  if (user == null) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Notification message={notificationMessage} />
          <Error message={errorMessage} />

          <div className="bg-white p-8 rounded-xl shadow-lg space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-center text-gray-800">Welcome Back</h2>
              <LoginForm handleLogin={handleLogin} />
            </div>

            <div className="border-t pt-8">
              <h2 className="text-xl font-semibold text-center text-gray-700 mb-4">Create Account</h2>
              <RegisterForm handleRegister={handleRegister} />
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-10 text-gray-900">
      <div className="max-w-6xl mx-auto">

        <header className="flex flex-col sm:flex-row justify-between items-center mb-10 pb-6 border-b border-gray-200">
          <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight">
            <span className="text-blue-600">Blogs</span>
          </h2>

          <div className="mt-4 sm:mt-0 flex items-center gap-4">
            <p className="text-sm text-gray-600 italic">
              Logged in as <span className="font-semibold text-gray-800">{user.name}</span>
            </p>
            {logoutButton()}
          </div>
        </header>

        <Notification message={notificationMessage} />
        <Error message={errorMessage} />

        <section className="mb-12 flex justify-center">
          <div className="w-full max-w-xl">
            {blogForm()}
          </div>
        </section>

        <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...blogs]
            .sort((a, b) => b.likes - a.likes)
            .map(blog => (
              <Blog
                key={blog.id}
                blog={blog}
                updateLikes={handleLikes}
                user={user}
                deleteBlog={deleteBlog}
              />
            ))
          }
        </main>

      </div>
    </div>
  )
}

export default App