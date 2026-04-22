'use client'
import { useEffect, useState } from 'react'
import { FiLinkedin } from 'react-icons/fi'

interface Director {
  _id: string
  name: string
  role: string
  bio: string
  photo: string
  order: number
}

export default function DirectorsSection() {
  const [directors, setDirectors] = useState<Director[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/directors')
      .then((r) => r.json())
      .then((d) => { setDirectors(Array.isArray(d) ? d : []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-gray-100 rounded-3xl h-96 animate-pulse" />
        ))}
      </div>
    )
  }

  if (directors.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400 text-sm">
        Director profiles will appear here once added from the admin panel.
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {directors.map((d, i) => (
        <div key={d._id}
          className={`relative rounded-3xl overflow-hidden group transition-all hover:-translate-y-2 hover:shadow-2xl
            ${i === 0 ? 'md:col-span-2 lg:col-span-1' : ''}`}>

          {/* Photo or placeholder */}
          <div className="relative h-72 bg-hero-gradient overflow-hidden">
            {d.photo ? (
              <img src={d.photo} alt={d.name}
                className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-8xl font-extrabold text-white/20 font-heading select-none">
                  {d.name.charAt(0)}
                </span>
              </div>
            )}

            {/* Gradient overlay at bottom */}
            <div className="absolute inset-0 bg-gradient-to-t from-primary-900/90 via-primary-900/20 to-transparent" />

            {/* Name over photo */}
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <h3 className="text-white font-bold font-heading text-xl leading-tight">{d.name}</h3>
              <p className="text-accent text-sm font-semibold mt-0.5">{d.role}</p>
            </div>
          </div>

          {/* Bio card */}
          <div className="bg-white border border-gray-100 rounded-b-3xl p-6">
            <p className="text-gray-500 text-sm leading-relaxed line-clamp-4">{d.bio}</p>

            <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
              <div className="flex gap-1">
                <span className="w-2 h-2 rounded-full bg-accent" />
                <span className="w-2 h-2 rounded-full bg-primary-600/50" />
                <span className="w-2 h-2 rounded-full bg-primary-600/25" />
              </div>
              <span className="text-xs text-gray-400 font-medium">TIMS Education</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
