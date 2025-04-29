'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import axios from '@/app/lib/api'

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()

  const handleLogin = async () => {
    try {
      const response = await axios.post('/auth/login', { username, password })
      localStorage.setItem('token', response.data.token)
      router.push('/pages/dashboard')
    } catch (error) {
      alert('Błąd logowania')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-900 via-black to-indigo-900 text-white">
      <div className="bg-black p-8 rounded-lg shadow-2xl w-96 space-y-6">
        <h1 className="text-3xl font-bold text-center text-blue-400">Logowanie</h1>
        <input
          type="text"
          placeholder="Nazwa użytkownika"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="bg-gray-800 text-white border border-gray-700 px-4 py-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <input
          type="password"
          placeholder="Hasło"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="bg-gray-800 text-white border border-gray-700 px-4 py-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          onClick={handleLogin}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-md cursor-pointer"
        >
          Zaloguj się
        </button>
        <div className="text-center">
          <span className="text-sm text-gray-400">Nie masz konta? </span>
          <a href="/pages/register" className="text-blue-400 hover:underline">Zarejestruj się</a>
        </div>
        <div className="text-center">
          <a href="/pages/main" className="text-blue-400 hover:underline">Strona główna</a>
        </div>
      </div>
    </div>
  )
}
