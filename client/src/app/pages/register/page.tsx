'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import axios from '@/app/lib/api'

export default function RegisterPage() {
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: ''
  })

  const router = useRouter()

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await axios.post('/auth/register', form)
      alert('Rejestracja zakończona sukcesem!')
      router.push('/login')
    } catch (error) {
      alert('Błąd rejestracji')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-green-900 via-black to-green-900 text-white">
      <form
        onSubmit={handleRegister}
        className="bg-black p-8 rounded-lg shadow-2xl w-96 space-y-6"
      >
        <h2 className="text-4xl font-extrabold text-center text-green-400">Rejestracja</h2>
        <input
          type="text"
          placeholder="Nazwa użytkownika"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
          className="bg-gray-800 text-white border border-gray-700 px-4 py-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 font-medium text-lg"
        />
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="bg-gray-800 text-white border border-gray-700 px-4 py-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 font-medium text-lg"
        />
        <input
          type="password"
          placeholder="Hasło"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="bg-gray-800 text-white border border-gray-700 px-4 py-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 font-medium text-lg"
        />
        <button
          type="submit"
          className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 rounded-md text-lg transition duration-300"
        >
          Zarejestruj się
        </button>
        <div className="text-center">
          <span className="text-sm text-gray-400">Masz już konto? </span>
          <a href="/pages/login" className="text-green-400 hover:underline font-medium">Zaloguj się</a>
        </div>
      </form>
    </div>
  )
}
