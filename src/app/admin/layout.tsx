'use client'
import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import {
  FiHome, FiBook, FiBookOpen, FiFileText, FiUsers,
  FiLogOut, FiMenu, FiX, FiExternalLink, FiSettings,
  FiFolder, FiCalendar, FiAward, FiZap, FiHelpCircle, FiMail,
} from 'react-icons/fi'

const navItems = [
  { label: 'Dashboard',         href: '/admin',                    icon: FiHome },
  { label: 'Leads & Enquiries', href: '/admin/leads',              icon: FiZap },
  { label: 'Quiz Questions',    href: '/admin/quiz-questions',     icon: FiHelpCircle },
  { label: 'Subscriptions',     href: '/admin/subscriptions',      icon: FiMail },
  { label: 'Directors',         href: '/admin/directors',          icon: FiUsers },
  { label: 'Universities',      href: '/admin/universities',       icon: FiBook },
  { label: 'Courses',           href: '/admin/courses',            icon: FiBookOpen },
  { label: 'Study Materials',   href: '/admin/study-materials',    icon: FiFolder },
  { label: 'Examinations',      href: '/admin/examinations',       icon: FiCalendar },
  { label: 'Results',           href: '/admin/results',            icon: FiAward },
  { label: 'Blogs',             href: '/admin/blogs',              icon: FiFileText },
  { label: 'Settings',          href: '/admin/settings',           icon: FiSettings },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    const token = document.cookie.split(';').find((c) => c.trim().startsWith('admin_token='))
    if (!token) {
      router.replace('/login')
    } else {
      setChecking(false)
    }
  }, [router])

  const handleLogout = () => {
    document.cookie = 'admin_token=; max-age=0; path=/'
    router.replace('/login')
  }

  if (checking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <span className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-primary-800 text-white flex flex-col transition-transform duration-300
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:relative lg:translate-x-0`}>

        {/* Logo */}
        <div className="flex items-center justify-between p-5 border-b border-white/10">
          <div className="flex items-center gap-2">
            <svg width="32" height="26" viewBox="0 0 44 36" fill="none">
              <polygon points="0,4 28,0 20,12" fill="#CC2229" />
              <polygon points="8,14 28,0 44,22 20,26" fill="white" />
              <polygon points="20,12 28,0 20,26" fill="#CC2229" opacity="0.7" />
            </svg>
            <div>
              <div className="flex items-baseline">
                <span className="text-accent font-extrabold text-lg font-heading">TIMS</span>
                <span className="text-white font-bold text-lg font-heading">Admin</span>
              </div>
            </div>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-white/70 hover:text-white">
            <FiX size={20} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map(({ label, href, icon: Icon }) => {
            const active = pathname === href
            return (
              <Link key={href} href={href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all
                  ${active ? 'bg-white/15 text-white' : 'text-white/70 hover:text-white hover:bg-white/10'}`}>
                <Icon size={17} />
                {label}
              </Link>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 space-y-2">
          <a href="/" target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-3 px-4 py-2.5 text-sm text-white/60 hover:text-white hover:bg-white/10 rounded-xl transition-all">
            <FiExternalLink size={16} /> View Website
          </a>
          <button onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-2.5 text-sm text-white/60 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-all w-full">
            <FiLogOut size={16} /> Logout
          </button>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar */}
        <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-4 shrink-0">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
            <FiMenu size={20} />
          </button>
          <div className="flex-1">
            <p className="text-sm font-semibold text-gray-700">
              {navItems.find((n) => n.href === pathname)?.label ?? 'Admin Panel'}
            </p>
          </div>
          <span className="text-xs text-gray-400 hidden sm:block">TIMS Education Management</span>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
