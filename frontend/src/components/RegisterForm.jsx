import { useState } from 'react'

const RegisterForm = ({ handleRegister }) => {
    const [newUser, setNewUser] = useState({
        username: '', name: '', password: '', confirmPassword: ''
    })

    const onSubmit = (event) => {
        event.preventDefault()
        handleRegister(newUser)
    }

    return (
        <form onSubmit={onSubmit} className="space-y-3">
            <input
                className="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm shadow-sm placeholder-gray-400 focus:ring-green-500 focus:border-green-500"
                placeholder="Full Name"
                type="text"
                value={newUser.name}
                onChange={({ target }) => setNewUser({ ...newUser, name: target.value })}
            />
            <input
                className="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm shadow-sm placeholder-gray-400 focus:ring-green-500 focus:border-green-500"
                placeholder="Username"
                type="text"
                value={newUser.username}
                onChange={({ target }) => setNewUser({ ...newUser, username: target.value })}
            />
            <input
                className="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm shadow-sm placeholder-gray-400 focus:ring-green-500 focus:border-green-500"
                placeholder="Password"
                type="password"
                value={newUser.password}
                autoComplete="on"
                onChange={({ target }) => setNewUser({ ...newUser, password: target.value })}
            />
            <input
                className="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm shadow-sm placeholder-gray-400 focus:ring-green-500 focus:border-green-500"
                placeholder="Confirm Password"
                type="password"
                value={newUser.confirmPassword}
                autoComplete="on"
                onChange={({ target }) => setNewUser({ ...newUser, confirmPassword: target.value })}
            />

            <button
                type="submit"
                className="w-full py-2 px-4 bg-green-500 text-white rounded-md text-sm font-medium hover:bg-green-600 transition duration-150"
            >
                Register
            </button>
        </form>
    )
}
export default RegisterForm