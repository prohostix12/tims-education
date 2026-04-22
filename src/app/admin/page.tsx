'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { FiBook, FiBookOpen, FiFileText, FiUsers, FiArrowRight, FiPlus, FiStar } from 'react-icons/fi'

interface Stats { universities: number; courses: number; blogs: number; contacts: number; directors: number }

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({ universities: 0, courses: 0, blogs: 0, contacts: 0, directors: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/admin/stats')
      .then((r) => r.json())
      .then((d) => { setStats(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const cards = [
    { label: 'Directors',    value: stats.directors,    icon: FiStar,     href: '/admin/directors',    color: 'bg-yellow-50 text-yellow-600', border: 'border-yellow-100' },
    { label: 'Universities', value: stats.universities, icon: FiBook,     href: '/admin/universities', color: 'bg-blue-50 text-blue-600',  border: 'border-blue-100' },
    { label: 'Courses',      value: stats.courses,      icon: FiBookOpen, href: '/admin/courses',      color: 'bg-purple-50 text-purple-600', border: 'border-purple-100' },
    { label: 'Blog Posts',   value: stats.blogs,        icon: FiFileText, href: '/admin/blogs',        color: 'bg-green-50 text-green-600',   border: 'border-green-100' },
  ]

  const quickLinks = [
    { label: 'Add University', href: '/admin/universities?new=1', icon: FiBook },
    { label: 'Add Course',     href: '/admin/courses?new=1',      icon: FiBookOpen },
    { label: 'Add Blog Post',  href: '/admin/blogs?new=1',        icon: FiFileText },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800 font-heading">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Welcome back! Here's an overview of your content.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map(({ label, value, icon: Icon, href, color, border }) => (
          <Link key={label} href={href}
            className={`bg-white rounded-2xl border ${border} p-5 flex flex-col gap-3 hover:shadow-md transition-shadow`}>
            <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center`}>
              <Icon size={18} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">
                {loading ? <span className="inline-block w-8 h-6 bg-gray-100 rounded animate-pulse" /> : value}
              </p>
              <p className="text-xs text-gray-500 mt-0.5">{label}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick actions */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <h2 className="text-base font-semibold text-gray-800 mb-4">Quick Actions</h2>
        <div className="grid sm:grid-cols-3 gap-3">
          {quickLinks.map(({ label, href, icon: Icon }) => (
            <Link key={label} href={href}
              className="flex items-center justify-between gap-3 px-4 py-3.5 border border-gray-200 rounded-xl hover:border-primary-400 hover:bg-primary-50 transition-all group">
              <div className="flex items-center gap-2.5 text-sm font-medium text-gray-700 group-hover:text-primary-700">
                <Icon size={16} />
                {label}
              </div>
              <FiPlus size={16} className="text-gray-400 group-hover:text-primary-600" />
            </Link>
          ))}
        </div>
      </div>

      {/* Manage sections */}
      <div className="grid md:grid-cols-3 gap-4">
        {[
          { title: 'Universities', desc: 'Add and edit university listings', href: '/admin/universities', icon: FiBook, color: 'text-blue-600' },
          { title: 'Courses',      desc: 'Manage course catalog',            href: '/admin/courses',      icon: FiBookOpen, color: 'text-purple-600' },
          { title: 'Blog Posts',   desc: 'Create and edit blog content',     href: '/admin/blogs',        icon: FiFileText, color: 'text-green-600' },
        ].map(({ title, desc, href, icon: Icon, color }) => (
          <Link key={title} href={href}
            className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-md transition-shadow group">
            <Icon size={24} className={`${color} mb-3`} />
            <h3 className="font-semibold text-gray-800 mb-1">{title}</h3>
            <p className="text-xs text-gray-500 mb-3">{desc}</p>
            <span className="text-xs text-primary-600 font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
              Manage <FiArrowRight size={12} />
            </span>
          </Link>
        ))}
      </div>
    </div>
  )
}
