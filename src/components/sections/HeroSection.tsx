'use client'
import Link from 'next/link'
import { FiArrowRight, FiCheckCircle } from 'react-icons/fi'

const floatingCards = [
  { icon: '🎓', label: '10,000+', sub: 'Alumni', color: 'bg-white', delay: '0s', pos: 'top-4 left-4' },
  { icon: '🏆', label: '15+', sub: 'Years', color: 'bg-white', delay: '0.4s', pos: 'top-4 right-4' },
  { icon: '⭐', label: '98%', sub: 'Satisfaction', color: 'bg-white', delay: '0.8s', pos: 'bottom-20 left-0' },
  { icon: '🏛️', label: '9+', sub: 'Universities', color: 'bg-white', delay: '1.2s', pos: 'bottom-4 right-4' },
]

export default function HeroSection() {
  return (
    <section className="relative min-h-screen bg-hero-gradient overflow-hidden flex items-center pt-28 pb-16">

      {/* ── Background decorations ── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0"
          style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.18) 1.5px, transparent 1.5px)', backgroundSize: '36px 36px' }} />
        <div className="absolute top-10 right-0 w-[520px] h-[520px] bg-accent/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-white/8 rounded-full blur-[100px]" />
        <div className="absolute top-1/2 left-1/3 w-[300px] h-[300px] bg-blue-400/10 rounded-full blur-[80px]" />
        <div className="absolute top-0 right-1/4 w-px h-full bg-gradient-to-b from-transparent via-white/10 to-transparent" />
        <div className="absolute top-0 left-1/3 w-px h-full bg-gradient-to-b from-transparent via-white/8 to-transparent" />
        <div className="absolute top-32 left-[55%] w-8 h-8 rounded-lg bg-white/8 rotate-12 border border-white/15" />
        <div className="absolute top-48 right-[30%] w-5 h-5 rounded-full bg-accent/40" />
        <div className="absolute bottom-40 left-[20%] w-6 h-6 rounded-lg bg-white/10 rotate-45 border border-white/15" />
        <div className="absolute top-[30%] left-[10%] w-4 h-4 bg-accent/30 rounded-full" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 grid lg:grid-cols-2 gap-20 items-center">

        {/* ── Left Content ── */}
        <div className="animate-fade-up">
          <p className="text-accent font-semibold text-sm uppercase tracking-widest mb-3">
            Learn Without Boundaries
          </p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white font-heading leading-tight mb-5">
            Transform Your
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-accent to-red-300">
              Career With
            </span>
            Online Degrees
          </h1>
          <p className="text-white/80 text-base leading-relaxed mb-7 max-w-md">
            Established in 2009, TIMS has been Kerala's most trusted centre for distance & online education.
            Learning made <strong className="text-white">easy</strong> and <strong className="text-white">affordable</strong> for everyone.
          </p>
          <div className="flex flex-wrap gap-3 mb-8">
            <Link href="/courses"
              className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-white font-bold text-sm rounded-xl shadow-lg hover:bg-accent-dark transition-all hover:scale-105">
              Explore Programs <FiArrowRight size={14} />
            </Link>
            <Link href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white/15 text-white font-semibold text-sm rounded-xl border border-white/30 hover:bg-white/25 transition-all backdrop-blur-sm">
              Get Free Counselling
            </Link>
          </div>
          <div className="flex flex-wrap gap-6">
            {[
              { n: '15+', l: 'Years Experience' },
              { n: '10,000+', l: 'Alumni' },
              { n: '9+', l: 'Universities' },
            ].map((s) => (
              <div key={s.l} className="text-center">
                <p className="text-xl font-bold text-white font-heading">{s.n}</p>
                <p className="text-white/60 text-xs">{s.l}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Right — Animated Visual ── */}
        <div className="hidden lg:flex items-center justify-center animate-fade-in">
          <div className="relative w-[420px] h-[420px]">

            {/* Outer spinning ring */}
            <div className="absolute inset-0 rounded-full border-2 border-dashed border-white/15 animate-spin-slow" />
            {/* Mid ring */}
            <div className="absolute inset-8 rounded-full border border-white/10 animate-spin-slow-reverse" />

            {/* Center graduation cap */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-36 h-36 rounded-[2.5rem] bg-white/10 backdrop-blur-md border border-white/25 flex flex-col items-center justify-center shadow-2xl">
                <span className="text-6xl">🎓</span>
                <p className="text-white/70 text-xs mt-2 font-semibold tracking-wide">TIMS Online</p>
              </div>
            </div>

            {/* Orbiting dots */}
            {[0, 72, 144, 216, 288].map((deg, i) => (
              <div key={i}
                className="absolute w-3 h-3 rounded-full bg-accent/70"
                style={{
                  top: '50%',
                  left: '50%',
                  transform: `rotate(${deg}deg) translateX(185px) translateY(-50%)`,
                }} />
            ))}

            {/* Floating stat cards */}
            {floatingCards.map((card) => (
              <div key={card.label}
                className={`absolute ${card.pos} ${card.color} rounded-2xl px-4 py-2.5 shadow-xl flex items-center gap-2.5`}
                style={{ animation: `floatY 3s ease-in-out infinite`, animationDelay: card.delay }}>
                <span className="text-xl">{card.icon}</span>
                <div>
                  <p className="text-primary-800 font-extrabold text-sm font-heading leading-none">{card.label}</p>
                  <p className="text-gray-500 text-[10px] leading-none mt-0.5">{card.sub}</p>
                </div>
              </div>
            ))}

            {/* UGC badge */}
            <div className="absolute top-1/2 -right-6 -translate-y-1/2 bg-accent rounded-2xl px-4 py-3 shadow-xl text-center"
              style={{ animation: 'floatY 3.5s ease-in-out infinite', animationDelay: '0.6s' }}>
              <p className="text-white font-bold text-sm leading-none">UGC</p>
              <p className="text-white/70 text-[10px] mt-0.5">Approved</p>
            </div>

            {/* Programs chip */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 bg-white/15 backdrop-blur-md border border-white/25 rounded-full px-5 py-2 flex items-center gap-2"
              style={{ animation: 'floatY 4s ease-in-out infinite', animationDelay: '1s' }}>
              <FiCheckCircle className="text-accent" size={14} />
              <span className="text-white text-xs font-semibold">200+ Programs</span>
            </div>

          </div>
        </div>
      </div>

      {/* Wave divider */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z" fill="#f8fafc" />
        </svg>
      </div>

      {/* Inline keyframes via a real <style> tag — styled-jsx not available in App Router */}
      <style>{`
        @keyframes floatY {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-10px); }
        }
        @keyframes spinSlow {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes spinSlowReverse {
          from { transform: rotate(0deg); }
          to   { transform: rotate(-360deg); }
        }
        .animate-spin-slow         { animation: spinSlow 30s linear infinite; }
        .animate-spin-slow-reverse { animation: spinSlowReverse 20s linear infinite; }
      `}</style>
    </section>
  )
}
