import Link from 'next/link'
import { FiPhone, FiMail, FiMapPin } from 'react-icons/fi'
import { FaFacebook, FaInstagram, FaYoutube, FaTwitter, FaTelegram } from 'react-icons/fa'

const quickLinks = [
  { label: 'Home', href: '/' },
  { label: 'About Us', href: '/about' },
  { label: 'Courses', href: '/courses' },
  { label: 'Universities', href: '/universities' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contact', href: '/contact' },
]

const programs = [
  { label: 'Online UG Degree', href: '/courses?cat=ug' },
  { label: 'Online PG Degree', href: '/courses?cat=pg' },
  { label: 'B.Tech / M.Tech', href: '/courses?cat=engineering' },
  { label: 'Diploma Programs', href: '/courses?cat=diploma' },
  { label: 'Skill Courses', href: '/courses?cat=skill' },
  { label: 'Apprenticeship', href: '/courses?cat=apprenticeship' },
]

export default function Footer() {
  return (
    <footer className="bg-primary-800 text-white">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 py-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <svg width="40" height="32" viewBox="0 0 44 36" fill="none" xmlns="http://www.w3.org/2000/svg">
              <polygon points="0,4 28,0 20,12" fill="#CC2229" />
              <polygon points="8,14 28,0 44,22 20,26" fill="#ffffff" opacity="0.9" />
              <polygon points="20,12 28,0 20,26" fill="#CC2229" opacity="0.7" />
            </svg>
            <div>
              <div className="flex items-baseline gap-0">
                <span className="text-accent font-extrabold text-xl font-heading leading-tight">TIMS</span>
                <span className="text-white font-bold text-xl font-heading leading-tight">Online</span>
              </div>
              <p className="text-white/50 text-[10px] tracking-wide">Learn Without Boundaries</p>
            </div>
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
