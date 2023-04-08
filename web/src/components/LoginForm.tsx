import React, { useState } from 'react'
import { useCookies } from 'react-cookie'

interface Props {}

const LoginForm: React.FC<Props> = () => {
  const [, setCookie] = useCookies(['token'])

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch('/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      })

      const data = await response.json()
      return data.token
    } catch (error) {
      console.error('Login error', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const token = await login(email, password)
      if (!!token) {
        setCookie('token', token, { path: '/' })
        console.log('Logged in successfully')
      }
      // Redirect to the protected route or reload the page
    } catch (error) {
      console.error('Login failed:', error)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="w-full max-w-md bg-gray-800 shadow-md p-6 rounded-lg">
        <h1 className="text-2xl font-bold mb-5 text-center text-purple-400">
          Login
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block mb-1 text-gray-200">
              Email:
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-2 border border-gray-700 bg-gray-700 text-white rounded"
            />
          </div>
          <div>
            <label htmlFor="password" className="block mb-1 text-gray-200">
              Password:
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-2 border border-gray-700 bg-gray-700 text-white rounded"
            />
          </div>
          <div className="flex justify-center">
            <button
              type="submit"
              className="py-2 px-4 bg-purple-600 text-white rounded hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-opacity-50"
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default LoginForm
