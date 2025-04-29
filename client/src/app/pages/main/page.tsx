'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function HomePage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
      {/* Nagłówek */}
      <header className="px-6 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Note<span className="text-blue-400">Flow</span></h1>
        <div className="flex space-x-4">
          <button 
            onClick={() => router.push('/pages/login')}
            className="px-4 py-2 text-sm text-gray-300 hover:text-white transition-colors cursor-pointer"
          >
            Zaloguj się
          </button>
          <button
            onClick={() => router.push('/pages/register')}
            className="px-4 py-2 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600 transition-colors cursor-pointer"
          >
            Załóż konto
          </button>
        </div>
      </header>

      {/* Hero section */}
      <main className="container mx-auto px-6 py-16 max-w-4xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">Organizuj swoje projekty w jednym miejscu</h2>
          <p className="text-xl text-gray-300 mb-8">
            Notatki, dokumenty i współpraca - wszystko czego potrzebujesz do efektywnej pracy
          </p>
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => router.push('/pages/register')}
              className="px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors cursor-pointer"
            >
              Rozpocznij teraz
            </button>
          </div>
        </div>

        {/* Funkcje */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <FeatureCard 
            icon="📝" 
            title="Notatki" 
            description="Twórz i organizuj notatki w chmurze" 
          />
          <FeatureCard 
            icon="📂" 
            title="Projekty" 
            description="Zarządzaj swoimi projektami efektywnie" 
          />
          <FeatureCard 
            icon="🔗" 
            title="Współpraca" 
            description="Współpracuj z zespołem w czasie rzeczywistym" 
          />
        </div>

        {/* CTA */}
        <div className="bg-gray-800 p-8 rounded-xl shadow-2xl text-center border border-gray-700">
          <h3 className="text-2xl font-semibold text-white mb-4">Gotów do rozpoczęcia?</h3>
          <p className="text-gray-300 mb-6">Dołącz do tysięcy zadowolonych użytkowników</p>
          <button
            onClick={() => router.push('/pages/register')}
            className="px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors cursor-pointer"
          >
            Załóż darmowe konto
          </button>
        </div>
      </main>

      {/* Stopka */}
      <footer className="py-8 text-center text-gray-400 text-sm">
        <p>© {new Date().getFullYear()} NoteFlow. Wszystkie prawa zastrzeżone.</p>
      </footer>
    </div>
  )
}

type FeatureCardProps = {
  icon: string
  title: string
  description: string
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="bg-gray-800 p-6 rounded-xl shadow-2xl hover:shadow-lg transition-shadow border border-gray-700">
      <div className="text-3xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
      <p className="text-gray-300">{description}</p>
    </div>
  )
}