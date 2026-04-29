'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { FiMenu, FiX, FiSearch, FiArrowRight, FiUser } from 'react-icons/fi'

function useSiteSettings() {
  const [logoIcon, setLogoIcon] = useState('')
  useEffect(() => {
    try {
      const cached = sessionStorage.getItem('tims_logoIcon')
      if (cached) setLogoIcon(cached)
    } catch {}
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

const navLinks = [
  { label: 'Home',          href: '/' },
  { label: 'Course Finder', href: '/course-finder' },
  { label: 'About',         href: '/about' },
]

export default function Navbar() {
  const pathname = usePathname()
  const [open, setOpen]         = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { logoIcon } = useSiteSettings()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => { setOpen(false) }, [pathname])

  if (pathname?.startsWith('/admin') || pathname === '/login') return null

  return (
    <>
      {/* ── Floating navbar wrapper ── */}
      <div
        className="fixed top-0 left-0 w-full z-50 transition-all duration-300"
        style={{ padding: scrolled ? '8px 16px' : '12px 16px', pointerEvents: 'none' }}
      >
        <div
          className="max-w-5xl mx-auto flex items-center justify-between transition-all duration-300"
          style={{
            background: 'rgba(247,247,245,0.97)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            borderRadius: 14,
            height: scrolled ? 54 : 60,
            padding: '0 20px',
            boxShadow: scrolled
              ? '0 8px 40px rgba(0,0,0,0.13), 0 1px 0 rgba(0,0,0,0.04)'
              : '0 4px 24px rgba(0,0,0,0.08), 0 1px 0 rgba(0,0,0,0.03)',
            border: '1px solid rgba(0,0,0,0.07)',
            pointerEvents: 'auto',
          }}
        >

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0">
            {logoIcon ? (
              <img src={logoIcon} alt="TIMS Logo" className="h-8 w-auto object-contain" />
            ) : (
              <>
                <svg width="36" height="27" viewBox="0 0 58 42" fill="none">
                  <polygon points="0,7 46,0 40,16 0,16" fill="#CC2229"/>
                  <polygon points="10,20 38,11 56,28 26,37" fill="#2B3488"/>
                </svg>
                <div className="flex flex-col leading-none">
                  <div className="flex items-baseline">
                    <span className="text-[#CC2229] font-extrabold text-[18px] font-heading tracking-tight">TIMS</span>
                    <span className="text-[#2B3488] font-bold text-[18px] font-heading">Online</span>
                  </div>
                  <p className="text-gray-400 text-[7px] tracking-[0.2em] uppercase mt-[1px]">Learn Without Boundaries</p>
                </div>
              </>
            )}
          </Link>

          {/* Desktop links */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map(({ label, href }) => {
              const active   = pathname === href
              const isFinder = label === 'Course Finder'

              if (isFinder) {
                return (
                  <Link
                    key={href}
                    href={href}
                    className="inline-flex items-center gap-1.5 text-[13.5px] font-semibold rounded-full transition-all duration-200"
                    style={{
                      padding: '6px 16px',
                      background: active ? '#CC2229' : '#fff3f3',
                      color: active ? '#fff' : '#CC2229',
                      border: `1.5px solid ${active ? '#CC2229' : '#fecaca'}`,
                    }}
                  >
                    <FiSearch size={12} />
                    {label}
                  </Link>
                )
              }

              return (
                <Link
                  key={href}
                  href={href}
                  className="relative text-[13.5px] font-medium rounded-lg transition-all duration-200 px-3.5 py-2"
                  style={{
                    color: active ? '#2B3488' : '#4b5563',
                    background: active ? '#eef0fb' : 'transparent',
                    fontWeight: active ? 600 : 500,
                  }}
                >
                  {label}
                </Link>
              )
            })}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-2">
            <Link
              href="/login"
              className="flex items-center justify-center w-9 h-9 rounded-xl transition-all duration-200 hover:bg-gray-100"
              title="Login"
            >
              <FiUser size={17} color="#4b5563" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-1.5 text-[13px] font-bold text-white rounded-full transition-all duration-200 hover:opacity-90 active:scale-95"
              style={{
                background: 'linear-gradient(135deg, #CC2229 0%, #a51b21 100%)',
                padding: '7px 20px',
                boxShadow: '0 2px 10px rgba(204,34,41,0.3)',
              }}
            >
              Enquire Now
              <FiArrowRight size={12} />
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setOpen(v => !v)}
            className="md:hidden flex items-center justify-center w-9 h-9 rounded-lg transition-colors duration-200"
            style={{ background: open ? '#f3f4f6' : 'transparent' }}
            aria-label="Toggle menu"
          >
            {open
              ? <FiX size={19} color="#374151" />
              : <FiMenu size={19} color="#374151" />
            }
          </button>
        </div>

        {/* Mobile dropdown panel */}
        <div
          className="md:hidden max-w-5xl mx-auto overflow-hidden transition-all duration-300 ease-in-out"
          style={{
            maxHeight: open ? 340 : 0,
            opacity: open ? 1 : 0,
            marginTop: open ? 8 : 0,
          }}
        >
          <div
            style={{
              background: 'rgba(247,247,245,0.98)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              borderRadius: 14,
              border: '1px solid rgba(0,0,0,0.07)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
              padding: '12px',
              pointerEvents: 'auto',
            }}
          >
            <div className="flex flex-col gap-1 mb-3">
              {navLinks.map(({ label, href }) => {
                const active   = pathname === href
                const isFinder = label === 'Course Finder'

                if (isFinder) {
                  return (
                    <Link
                      key={href}
                      href={href}
                      className="flex items-center gap-2 px-4 py-3 rounded-xl text-[14px] font-semibold transition-all"
                      style={{
                        background: active ? '#CC2229' : '#fff3f3',
                        color: active ? '#fff' : '#CC2229',
                        border: `1px solid ${active ? '#CC2229' : '#fecaca'}`,
                      }}
                    >
                      <FiSearch size={14} /> {label}
                    </Link>
                  )
                }

                return (
                  <Link
                    key={href}
                    href={href}
                    className="flex items-center px-4 py-3 rounded-xl text-[14px] font-medium transition-all"
                    style={{
                      color: active ? '#2B3488' : '#374151',
                      background: active ? '#eef0fb' : 'transparent',
                      fontWeight: active ? 600 : 500,
                    }}
                  >
                    {label}
                  </Link>
                )
              })}
            </div>

            <div
              className="pt-3 flex flex-col gap-2"
              style={{ borderTop: '1px solid #f3f4f6' }}
            >
              <Link
                href="/login"
                className="flex items-center justify-center gap-2 py-2.5 rounded-xl text-[13.5px] font-semibold transition-all"
                style={{ color: '#4b5563', background: '#f3f4f6' }}
              >
                <FiUser size={14} /> Login
              </Link>
              <Link
                href="/contact"
                className="flex items-center justify-center gap-2 py-3 rounded-xl text-[14px] font-bold text-white transition-all"
                style={{
                  background: 'linear-gradient(135deg, #CC2229 0%, #a51b21 100%)',
                  boxShadow: '0 2px 10px rgba(204,34,41,0.25)',
                }}
              >
                Enquire Now <FiArrowRight size={13} />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Page spacer */}
      <div style={{ height: 84 }} />
    </>
  )
}
