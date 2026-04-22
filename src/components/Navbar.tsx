'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { FiMenu, FiX, FiPhone, FiMail, FiChevronDown, FiUser } from 'react-icons/fi'
import { FaFacebook, FaInstagram, FaYoutube } from 'react-icons/fa'

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Programs', href: '/courses' },
  { label: 'Universities', href: '/universities' },
  { label: 'Course Finder', href: '/course-finder' },
  {
    label: 'Services',
    href: null, // no direct navigation — dropdown only
    children: [
      { label: 'Attestation', href: '/services/attestation' },
      { label: 'Credit Transfer', href: '/services/credit-transfer' },
    ],
  },
  {
    label: 'Students',
    href: '/students',
    children: [
      { label: 'Syllabus', href: '/students' },
      { label: 'News', href: '/blog' },
    ],
  },
  { label: 'Contact', href: '/contact' },
  { label: 'About', href: '/about' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [dropdown, setDropdown] = useState<string | null>(null)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className="w-full z-50 fixed top-0 left-0">
      {/* Top Bar */}
      <div className="bg-primary-600 text-white text-xs py-2 px-4 hidden md:flex items-center justify-between">
        <div className="flex items-center gap-6">
          <a href="tel:+917736111588" className="flex items-center gap-1 hover:text-accent transition-colors">
            <FiPhone size={12} /> +91 7736 1115 88
          </a>
          <a href="mailto:info@timseducation.com" className="flex items-center gap-1 hover:text-accent transition-colors">
            <FiMail size={12} /> info@timseducation.com
          </a>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-white/60">Follow us:</span>
          <a href="#" className="hover:text-accent transition-colors"><FaFacebook size={13} /></a>
          <a href="#" className="hover:text-accent transition-colors"><FaInstagram size={13} /></a>
          <a href="#" className="hover:text-accent transition-colors"><FaYoutube size={13} /></a>
        </div>
      </div>

      {/* Main Nav */}
      <nav className={`transition-all duration-300 ${scrolled ? 'bg-white shadow-lg py-2' : 'bg-white/95 backdrop-blur-sm py-3'}`}>
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <svg width="44" height="36" viewBox="0 0 44 36" fill="none" xmlns="http://www.w3.org/2000/svg">
              <polygon points="0,4 28,0 20,12" fill="#CC2229" />
              <polygon points="8,14 28,0 44,22 20,26" fill="#2B3488" />
              <polygon points="20,12 28,0 20,26" fill="#CC2229" opacity="0.7" />
            </svg>
            <div>
              <div className="flex items-baseline gap-0">
                <span className="text-accent font-extrabold text-xl font-heading leading-tight tracking-tight">TIMS</span>
                <span className="text-primary-600 font-bold text-xl font-heading leading-tight">Online</span>
              </div>
              <p className="text-gray-400 text-[10px] leading-tight tracking-wide">Learn Without Boundaries</p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <ul className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <li key={link.label} className="relative group"
                onMouseEnter={() => link.children && setDropdown(link.label)}
                onMouseLeave={() => setDropdown(null)}>

                {link.href === null ? (
                  /* No-navigate parent (Services) — button only */
                  <button
                    className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-700 hover:text-primary-600 rounded-lg hover:bg-primary-50 transition-all">
                    {link.label}
                    <FiChevronDown size={14} className={`transition-transform ${dropdown === link.label ? 'rotate-180' : ''}`} />
                  </button>
                ) : (
                  <Link href={link.href}
                    className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-700 hover:text-primary-600 rounded-lg hover:bg-primary-50 transition-all">
                    {link.label}
                    {link.children && <FiChevronDown size={14} className={`transition-transform ${dropdown === link.label ? 'rotate-180' : ''}`} />}
                  </Link>
                )}

                {link.children && dropdown === link.label && (
                  <div className="absolute top-full left-0 mt-1 w-52 bg-white rounded-xl shadow-xl border border-gray-100 py-2 animate-fade-in">
                    {link.children.map((child) => (
                      <Link key={child.label} href={child.href}
                        className="block px-4 py-2 text-sm text-gray-600 hover:text-primary-600 hover:bg-primary-50 transition-colors">
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </li>
            ))}
          </ul>

          {/* CTA — Login + Enquire */}
          <div className="hidden lg:flex items-center gap-2">
            <Link href="/login"
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-gray-600 hover:text-primary-600 rounded-lg hover:bg-gray-100 transition-all">
              <FiUser size={15} /> Login
            </Link>
            <Link href="/contact"
              className="px-4 py-2 text-sm font-semibold text-white bg-accent rounded-lg hover:bg-accent-dark transition-all shadow-md hover:shadow-lg">
              Enquire Now
            </Link>
          </div>

          {/* Mobile toggle */}
          <button onClick={() => setOpen(!open)} className="lg:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100">
            {open ? <FiX size={22} /> : <FiMenu size={22} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {open && (
          <div className="lg:hidden bg-white border-t border-gray-100 px-4 pb-4 mt-1 animate-fade-in">
            {navLinks.map((link) => (
              <div key={link.label}>
                {link.href === null ? (
                  <span className="block py-3 text-sm font-medium text-gray-500 border-b border-gray-50">
                    {link.label}
                  </span>
                ) : (
                  <Link href={link.href} onClick={() => setOpen(false)}
                    className="block py-3 text-sm font-medium text-gray-700 border-b border-gray-50 hover:text-primary-600">
                    {link.label}
                  </Link>
                )}
                {link.children && (
                  <div className="pl-4 bg-gray-50 rounded-lg mb-1">
                    {link.children.map((child) => (
                      <Link key={child.label} href={child.href} onClick={() => setOpen(false)}
                        className="block py-2 text-xs text-gray-600 hover:text-primary-600">
                        → {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div className="flex flex-col gap-2 mt-4">
              <Link href="/login" onClick={() => setOpen(false)}
                className="text-center py-2.5 text-sm font-semibold text-gray-600 border border-gray-200 rounded-lg flex items-center justify-center gap-1.5">
                <FiUser size={14} /> Login
              </Link>
              <Link href="/contact" onClick={() => setOpen(false)}
                className="text-center py-2.5 text-sm font-semibold text-white bg-accent rounded-lg">
                Enquire Now
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}
