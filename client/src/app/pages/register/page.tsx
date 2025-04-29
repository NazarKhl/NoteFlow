'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import axios from '@/app/lib/api'

export default function RegisterPage() {
  const [form, setForm] = useState({
    username: '',
    email: '',
    firstName: '',
    lastName: '',
    password: '',
    confirmPassword: ''
  })

  const router = useRouter()

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()

    if (form.password !== form.confirmPassword) {
      alert('Hasła nie są zgodne!')
      return
    }

    const { confirmPassword, ...payload } = form

    try {
      await axios.post('/auth/register', payload)
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
        <h2 className="text-3xl font-bold text-center text-green-400">Rejestracja</h2>

        <input
          type="text"
          placeholder="Imię"
          value={form.firstName}
          onChange={(e) => setForm({ ...form, firstName: e.target.value })}
          className="bg-gray-800 text-white border border-gray-700 px-4 py-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
        />

        <input
          type="text"
          placeholder="Nazwisko"
          value={form.lastName}
          onChange={(e) => setForm({ ...form, lastName: e.target.value })}
          className="bg-gray-800 text-white border border-gray-700 px-4 py-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
        />

        <input
          type="text"
          placeholder="Nazwa użytkownika"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
          className="bg-gray-800 text-white border border-gray-700 px-4 py-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
        />

        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="bg-gray-800 text-white border border-gray-700 px-4 py-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
        />

        <input
          type="password"
          placeholder="Hasło"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="bg-gray-800 text-white border border-gray-700 px-4 py-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
        />

        <input
          type="password"
          placeholder="Potwierdź hasło"
          value={form.confirmPassword}
          onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
          className="bg-gray-800 text-white border border-gray-700 px-4 py-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
        />

        <button
          type="submit"
          className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 rounded-md cursor-pointer"
        >
          Zarejestruj się
        </button>

        <div className="text-center">
          <span className="text-sm text-gray-400">Masz już konto? </span>
          <a href="/pages/login" className="text-green-400 hover:underline">Zaloguj się</a>
        </div>
        <div className="text-center">
          <a href="/pages/main" className="text-green-400 hover:underline">Strona główna</a>
        </div>
      </form>
    </div>
  )
}
