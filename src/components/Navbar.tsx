'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { FiMenu, FiX, FiChevronDown, FiUser, FiSearch } from 'react-icons/fi'

function useSiteSettings() {
  const [logoIcon, setLogoIcon] = useState('')

  useEffect(() => {
    // Apply cached value immediately — eliminates visible lag on refresh
    try {
      const cached = sessionStorage.getItem('tims_logoIcon')
      if (cached) setLogoIcon(cached)
    } catch {}

    // Fetch fresh in background and update cache
    fetch(`/api/settings?t=${Date.now()}`, { cache: 'no-store' })
      .then(r => r.json())
      .then(d => {
        const val = d.logoIcon || ''
        setLogoIcon(val)
        try { sessionStorage.setItem('tims_logoIcon', val) } catch {}
      })
      .catch(() => {})
  }, [])

  return { logoIcon }
}

type NavLink = { label: string; href: string | null; children?: { label: string; href: string }[] }

const navLinks: NavLink[] = [
  { label: 'Home', href: '/' },
  { label: 'Programs', href: '/courses' },
  { label: 'Universities', href: '/universities' },
  { label: 'Course Finder', href: '/course-finder' },
  {
    label: 'Services',
    href: null,
    children: [
      { label: 'Attestation', href: '/services/attestation' },
      { label: 'Credit Transfer', href: '/services/credit-transfer' },
    ],
  },
  {
    label: 'Students',
    href: null,
    children: [
      { label: 'Syllabus', href: '/students' },
      { label: 'News', href: '/blog' },
    ],
  },
  { label: 'Contact', href: '/contact' },
  { label: 'About', href: '/about' },
]

function DropdownItem({ link, pathname, onClose }: {
  link: NavLink
  pathname: string | null
  onClose: () => void
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLLIElement>(null)

  // Close when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  if (!link.children) {
    return (
      <li>
        {(() => {
          const isFinder = link.label === 'Course Finder'
          if (isFinder) {
            return (
              <Link
                href={link.href!}
                onClick={onClose}
                className={`inline-flex items-center gap-2 px-4 py-2 text-[15px] font-semibold transition-all rounded-full shadow-sm ${
                  pathname === link.href ? 'bg-[#CC2229] text-white' : 'bg-[#fff3f3] text-[#CC2229] hover:bg-[#ffd6d6]'
                }`}
              >
                <FiSearch size={14} />
                {link.label}
              </Link>
            )
          }

          return (
            <Link
              href={link.href!}
              onClick={onClose}
              className={`flex items-center px-3.5 py-2 text-[15px] font-medium transition-colors rounded-lg ${
                pathname === link.href ? 'text-[#CC2229]' : 'text-gray-700 hover:text-[#CC2229]'
              }`}
            >
              {link.label}
            </Link>
          )
        })()}
      </li>
    )
  }

  return (
    <li ref={ref} className="relative">
      <button
        onClick={() => setOpen(v => !v)}
        className={`flex items-center gap-1 px-3.5 py-2 text-[15px] font-medium transition-colors rounded-lg select-none ${
          open ? 'text-[#CC2229]' : 'text-gray-700 hover:text-[#CC2229]'
        }`}
      >
        {link.label}
        <FiChevronDown
          size={13}
          className="transition-transform duration-300 text-gray-400"
          style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
        />
      </button>

      {/* Dropdown panel */}
      <div
        className="absolute top-full left-0 w-52 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 z-50 origin-top"
        style={{
          marginTop: 4,
          transition: 'opacity 0.18s ease, transform 0.18s ease',
          opacity: open ? 1 : 0,
          transform: open ? 'scaleY(1) translateY(0)' : 'scaleY(0.85) translateY(-8px)',
          pointerEvents: open ? 'auto' : 'none',
        }}
      >
        {link.children.map((child) => (
          <Link
            key={child.label}
            href={child.href}
            onClick={() => { setOpen(false); onClose() }}
            className="block px-4 py-3 text-[15px] text-gray-600 hover:text-[#CC2229] hover:bg-red-50/60 transition-colors"
          >
            {child.label}
          </Link>
        ))}
      </div>
    </li>
  )
}

export default function Navbar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null)
  const [scrolled, setScrolled] = useState(false)
  const { logoIcon } = useSiteSettings()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  if (pathname?.startsWith('/admin') || pathname === '/login') return null

  const shadow = scrolled ? 'shadow-md' : 'shadow-sm border-b border-gray-100'

  return (
    <header className="w-full z-50 fixed top-0 left-0">
      <nav className={`transition-all duration-300 ${shadow} bg-white`} style={{ minHeight: 70 }}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between" style={{ minHeight: 70 }}>

          {/* ── Logo ── */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0">
            {logoIcon ? (
              <img src={logoIcon} alt="TIMS Logo" className="h-9 w-auto object-contain" />
            ) : (
              <>
                <svg width="46" height="34" viewBox="0 0 58 42" fill="none">
                  <polygon points="0,7 46,0 40,16 0,16" fill="#CC2229"/>
                  <polygon points="10,20 38,11 56,28 26,37" fill="#2B3488"/>
                </svg>
                <div className="flex flex-col leading-none">
                  <div className="flex items-baseline">
                    <span className="text-[#CC2229] font-extrabold text-[21px] font-heading tracking-tight">TIMS</span>
                    <span className="text-[#2B3488] font-bold text-[21px] font-heading">Online</span>
                  </div>
                  <p className="text-gray-400 text-[8.5px] tracking-widest uppercase mt-[2px]">Learn Without Boundaries</p>
                </div>
              </>
            )}
          </Link>

          {/* ── Desktop links ── */}
          <ul className="hidden lg:flex items-center gap-0.5">
            {navLinks.map((link) => (
              <DropdownItem
                key={link.label}
                link={link}
                pathname={pathname}
                onClose={() => {}}
              />
            ))}
          </ul>

          {/* ── CTA ── */}
          <div className="hidden lg:flex items-center gap-4">
            <Link href="/login"
              className="flex items-center gap-1.5 text-[15px] font-semibold text-gray-700 hover:text-[#CC2229] transition-colors">
              <FiUser size={14} /> Login
            </Link>
            <Link href="/contact"
              className="px-6 py-2.5 text-[15px] font-bold text-white bg-[#CC2229] rounded-full hover:bg-red-700 transition-all shadow-md">
              Enquire Now
            </Link>
          </div>

          {/* Mobile toggle */}
          <button onClick={() => setOpen(!open)} className="lg:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-all">
            {open ? <FiX size={22} /> : <FiMenu size={22} />}
          </button>
        </div>

        {/* ── Mobile menu ── */}
        {open && (
          <div className="lg:hidden border-t border-gray-100 px-4 pb-5 shadow-lg bg-white">
            {navLinks.map((link) => (
              <div key={link.label}>
                {link.href === null ? (
                  <button
                    className="w-full flex items-center justify-between py-3 text-[15px] font-semibold text-gray-700 border-b border-gray-100"
                    onClick={() => setMobileExpanded(mobileExpanded === link.label ? null : link.label)}
                  >
                    {link.label}
                    <FiChevronDown
                      size={14}
                      className="transition-transform duration-300 text-gray-400"
                      style={{ transform: mobileExpanded === link.label ? 'rotate(180deg)' : 'rotate(0deg)' }}
                    />
                  </button>
                ) : (
                  <>
                    {(() => {
                      const isFinder = link.label === 'Course Finder'
                      if (isFinder) {
                        return (
                          <Link href={link.href} onClick={() => setOpen(false)}
                            className={`flex items-center gap-2 py-3 px-2 font-semibold border-b border-gray-100 transition-colors ${
                              pathname === link.href ? 'bg-[#fff3f3] text-[#CC2229]' : 'text-[#CC2229]'
                            }`}>
                            <FiSearch size={14} />
                            {link.label}
                          </Link>
                        )
                      }

                      return (
                        <Link href={link.href} onClick={() => setOpen(false)}
                          className={`block py-3 text-[15px] font-medium border-b border-gray-100 transition-colors ${
                            pathname === link.href ? 'text-[#CC2229]' : 'text-gray-700 hover:text-[#CC2229]'
                          }`}>
                          {link.label}
                        </Link>
                      )
                    })()}
                  </>
                )}
                {link.children && mobileExpanded === link.label && (
                  <div
                    className="pl-4 pb-2 overflow-hidden"
                    style={{ animation: 'slideDown 0.2s ease' }}
                  >
                    {link.children.map((child) => (
                      <Link key={child.label} href={child.href} onClick={() => { setOpen(false); setMobileExpanded(null) }}
                        className="flex items-center gap-2 py-2.5 text-[15px] text-gray-600 hover:text-[#CC2229] transition-colors">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#CC2229]" />
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div className="flex flex-col gap-2 mt-4">
              <Link href="/login" onClick={() => setOpen(false)}
                className="text-center py-2.5 text-[15px] font-semibold text-gray-700 border border-gray-200 rounded-full flex items-center justify-center gap-1.5 hover:bg-gray-50">
                <FiUser size={14} /> Login
              </Link>
              <Link href="/contact" onClick={() => setOpen(false)}
                className="text-center py-2.5 text-[15px] font-bold text-white bg-[#CC2229] rounded-full shadow-md">
                Enquire Now
              </Link>
            </div>
          </div>
        )}
      </nav>

      <style>{`
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </header>
  )
}
