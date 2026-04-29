'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { FiPhone, FiMail, FiMapPin } from 'react-icons/fi'
import { FaFacebook, FaInstagram, FaYoutube, FaTwitter, FaTelegram } from 'react-icons/fa'

const quickLinks = [
  { label: 'Home', href: '/' },
  { label: 'Course Finder', href: '/course-finder' },
  { label: 'About Us', href: '/about' },
]

const programs = [
  { label: 'Online UG Degree', href: '/course-finder' },
  { label: 'Online PG Degree', href: '/course-finder' },
  { label: 'B.Tech / M.Tech', href: '/course-finder' },
  { label: 'Diploma Programs', href: '/course-finder' },
  { label: 'Skill Courses', href: '/course-finder' },
  { label: 'Apprenticeship', href: '/course-finder' },
]

export default function Footer() {
  const pathname = usePathname()
  const [logoIcon, setLogoIcon] = useState('')

  useEffect(() => {
    fetch(`/api/settings?t=${Date.now()}`, { cache: 'no-store' })
      .then(r => r.json())
      .then(d => { setLogoIcon(d.logoIcon || '') })
      .catch(() => {})
  }, [])

  if (pathname?.startsWith('/admin') || pathname === '/login') return null
  return (
    <footer className="bg-primary-800 text-white">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 py-10 md:py-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-10">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-2.5 mb-4">
            {logoIcon ? (
              <img src={logoIcon} alt="TIMS Logo" className="h-10 w-auto object-contain" />
            ) : (
              <>
                <svg width="46" height="34" viewBox="0 0 58 42" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <polygon points="0,7 46,0 40,16 0,16" fill="#CC2229"/>
                  <polygon points="10,20 38,11 56,28 26,37" fill="#ffffff"/>
                </svg>
                <div className="flex flex-col leading-none">
                  <div className="flex items-baseline">
                    <span className="text-[#CC2229] font-extrabold text-[21px] font-heading tracking-tight">TIMS</span>
                    <span className="text-white font-bold text-[21px] font-heading">Online</span>
                  </div>
                  <p className="text-white/50 text-[8.5px] tracking-widest uppercase mt-[2px]">Learn Without Boundaries</p>
                </div>
              </>
            )}
          </div>
          <p className="text-white/60 text-sm leading-relaxed mb-5">
            Empowering minds, shaping futures with quality education since 2009. Learning made easy and affordable for everyone.
          </p>
          <p className="text-accent font-semibold text-sm italic mb-4">"Learn Without Boundaries"</p>
          <div className="flex gap-3">
            {[FaFacebook, FaInstagram, FaYoutube, FaTwitter, FaTelegram].map((Icon, i) => (
              <a key={i} href="#"
                className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center hover:bg-accent hover:text-white transition-all">
                <Icon size={15} />
              </a>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-white font-semibold text-base mb-5 font-heading">Quick Links</h4>
          <ul className="space-y-2">
            {quickLinks.map((l) => (
              <li key={l.label}>
                <Link href={l.href} className="text-white/60 text-sm hover:text-accent transition-colors flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-accent inline-block" /> {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Programs */}
        <div>
          <h4 className="text-white font-semibold text-base mb-5 font-heading">Popular Programs</h4>
          <ul className="space-y-2">
            {programs.map((p) => (
              <li key={p.label}>
                <Link href={p.href} className="text-white/60 text-sm hover:text-accent transition-colors flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-accent inline-block" /> {p.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-white font-semibold text-base mb-5 font-heading">Contact Us</h4>
          <ul className="space-y-4">
            <li className="flex items-start gap-3 text-sm text-white/60">
              <FiMapPin className="text-accent mt-0.5 shrink-0" size={16} />
              <span>2nd Floor, Pamls Tower, near Central Bank, Thazhepalam, Tirur, Kerala 676101</span>
            </li>
            <li>
              <a href="tel:+917736111588" className="flex items-center gap-3 text-sm text-white/60 hover:text-accent transition-colors">
                <FiPhone className="text-accent shrink-0" size={16} />
                +91 7736 1115 88 (Tirur)
              </a>
            </li>
            <li>
              <a href="tel:+919526387777" className="flex items-center gap-3 text-sm text-white/60 hover:text-accent transition-colors">
                <FiPhone className="text-accent shrink-0" size={16} />
                +91 9526 387 777 (Edappal)
              </a>
            </li>
            <li>
              <a href="mailto:info@timseducation.com" className="flex items-center gap-3 text-sm text-white/60 hover:text-accent transition-colors">
                <FiMail className="text-accent shrink-0" size={16} />
                info@timseducation.com
              </a>
            </li>
          </ul>

          {/* Newsletter */}
          <div className="mt-6">
            <p className="text-white/70 text-xs mb-2">Subscribe to our newsletter</p>
            <form className="flex gap-2">
              <input type="email" placeholder="Your email"
                className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm text-white placeholder-white/40 focus:outline-none focus:border-accent" />
              <button type="submit"
                className="px-3 py-2 bg-accent text-white rounded-lg text-sm font-semibold hover:bg-accent-dark transition-colors">
                Go
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10 py-4 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2 text-white/40 text-xs">
          <p>© {new Date().getFullYear()} TIMS – Tirur Institute of Management Studies. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-accent transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-accent transition-colors">Terms of Use</Link>
            <Link href="/sitemap" className="hover:text-accent transition-colors">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
