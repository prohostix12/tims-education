'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { FiArrowRight } from 'react-icons/fi'

const pills = [
  { label: 'MBA / MCA Online', active: true  },
  { label: 'BBA / B.Com',      active: false },
  { label: 'B.Tech / M.Tech',  active: false },
  { label: 'UG Degrees',       active: false },
]

export default function HeroSection() {
  const [imgError, setImgError]   = useState(false)
  const [heroImage, setHeroImage] = useState('')
  const [fetchDone, setFetchDone] = useState(false)

  useEffect(() => {
    try {
      const cached = sessionStorage.getItem('tims_heroImage')
      if (cached !== null) { setHeroImage(cached); setFetchDone(true) }
    } catch {}

    fetch(`/api/settings?t=${Date.now()}`, { cache: 'no-store' })
      .then(r => r.json())
      .then(d => {
        const img = d.heroStudentImage || ''
        setHeroImage(img)
        setImgError(false)
        try { sessionStorage.setItem('tims_heroImage', img) } catch {}
      })
      .catch(() => {})
      .finally(() => setFetchDone(true))
  }, [])

  return (
    <section
      className="relative overflow-hidden"
      style={{ backgroundColor: '#f7f7f5', minHeight: 'calc(100vh - 84px)' }}
    >
      {/* dot grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, #d1d5db 1px, transparent 1px)',
          backgroundSize: '30px 30px',
          opacity: 0.4,
        }}
      />

      <div className="relative w-full max-w-6xl mx-auto px-5 sm:px-8 lg:px-12 py-12 lg:py-0
                      flex items-center" style={{ minHeight: 'calc(100vh - 84px)' }}>

        <div className="w-full grid lg:items-center lg:gap-0"
          style={{ gridTemplateColumns: 'repeat(1, 1fr)' }}
        >
          {/* Desktop 3-col wrapper — only kicks in at lg */}
          <div className="lg:grid lg:items-center" style={{ gridTemplateColumns: '1fr auto 190px' }}>

            {/* ── Col 1: Headline + badges + CTA ── */}
            <div className="flex flex-col items-center text-center lg:items-start lg:text-left lg:pr-8 pb-8 lg:pb-0 lg:py-6">

              <h1
                className="font-black text-gray-950 font-heading leading-[0.94] tracking-tight mb-5"
                style={{ fontSize: 'clamp(2.4rem, 5vw, 2.6rem)' }}
              >
                Inspiring<br />
                Education<br />
                <span style={{ color: '#CC2229' }}>Exploration</span>
              </h1>

              {/* Badges */}
              <div className="flex flex-wrap justify-center lg:justify-start items-center gap-2 mb-5">
                <span className="bg-gray-900 text-white text-xs font-bold px-4 py-1.5 rounded-full">
                  UGC Approved
                </span>
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: '#CC2229' }} />
                <span className="text-white text-xs font-bold px-3.5 py-1.5 rounded-full"
                  style={{ background: '#2B3488' }}>
                  9+ Universities
                </span>
                <span className="text-white text-xs font-bold px-3.5 py-1.5 rounded-full"
                  style={{ background: '#CC2229' }}>
                  100% Online
                </span>
              </div>

              <p className="text-gray-500 text-[14.5px] leading-relaxed mb-7 max-w-sm lg:max-w-[300px]">
                Fostering ambition and career growth through trusted online and distance education —
                affordable, flexible, and nationally recognised.
              </p>

              <Link
                href="/course-finder"
                className="inline-flex items-center gap-2 text-white font-bold text-sm rounded-full shadow-lg
                           transition-all hover:opacity-90"
                style={{ background: '#CC2229', padding: '12px 28px' }}
              >
                Getting Started <FiArrowRight size={13} />
              </Link>
            </div>

            {/* ── Col 2: Student image — desktop only ── */}
            <div
              className="hidden lg:block relative shrink-0"
              style={{ width: 'clamp(300px, 36vw, 480px)', height: 'clamp(330px, 58vh, 520px)' }}
            >
              {/* Large navy circle */}
              <div className="absolute rounded-full" style={{
                width: '68%', height: '68%',
                top: '50%', left: '50%',
                transform: 'translate(-58%, -52%)',
                background: '#2B3488', zIndex: 0,
              }} />
              {/* Red circle */}
              <div className="absolute rounded-full" style={{
                width: '46%', height: '46%',
                top: '50%', left: '50%',
                transform: 'translate(-5%, -60%)',
                background: '#CC2229', opacity: 0.9, zIndex: 0,
              }} />

              {heroImage && !imgError ? (
                <img src={heroImage} alt="Student"
                  style={{
                    position: 'absolute', bottom: 0, left: '50%',
                    transform: 'translateX(-50%)',
                    height: '96%', width: 'auto',
                    objectFit: 'contain', objectPosition: 'bottom',
                    zIndex: 10, animation: 'fadeInUp 0.5s ease',
                  }}
                  onError={() => setImgError(true)}
                />
              ) : fetchDone && !heroImage ? (
                <div className="absolute inset-0 flex items-end justify-center pb-4" style={{ zIndex: 10 }}>
                  <div className="flex flex-col items-center justify-center gap-4 rounded-t-[80px] border-2 border-dashed"
                    style={{
                      width: '55%', height: '80%',
                      borderColor: 'rgba(43,52,136,0.3)',
                      background: 'linear-gradient(to bottom, rgba(43,52,136,0.1), rgba(43,52,136,0.02))',
                    }}>
                    <span style={{ fontSize: 64 }}>🎓</span>
                    <p className="text-center text-xs font-semibold px-4 opacity-60" style={{ color: '#2B3488' }}>
                      Upload via<br />Admin → Settings
                    </p>
                  </div>
                </div>
              ) : null}

              <style>{`
                @keyframes fadeInUp {
                  from { opacity:0; transform:translateX(-50%) translateY(20px); }
                  to   { opacity:1; transform:translateX(-50%) translateY(0); }
                }
              `}</style>

              {/* Alumni floating badge */}
              <div className="absolute bg-white rounded-xl flex items-center gap-2 border border-gray-100"
                style={{
                  top: '6%', left: '2%', zIndex: 20,
                  padding: '8px 12px',
                  boxShadow: '0 6px 24px rgba(0,0,0,0.10)',
                  animation: 'floatUp 3.5s ease-in-out infinite',
                }}>
                <span style={{ fontSize: 16 }}>🎓</span>
                <div>
                  <p className="font-extrabold text-sm font-heading leading-none text-gray-900">10,000+</p>
                  <p className="text-gray-400 mt-0.5 text-[11px]">Alumni</p>
                </div>
              </div>

              {/* UGC floating card */}
              <div className="absolute bg-white rounded-xl border border-gray-100"
                style={{
                  bottom: '8%', right: '0%', zIndex: 20,
                  width: 155, padding: 10,
                  boxShadow: '0 6px 24px rgba(0,0,0,0.10)',
                  animation: 'floatDown 4s ease-in-out infinite',
                }}>
                <div className="flex items-start gap-2">
                  <div className="rounded-lg flex items-center justify-center shrink-0 text-sm"
                    style={{ width: 28, height: 28, background: 'rgba(204,34,41,0.1)', border: '1px solid rgba(204,34,41,0.2)' }}>
                    🏛️
                  </div>
                  <div>
                    <p className="font-bold text-gray-800 text-xs leading-tight">UGC Recognised</p>
                    <p className="text-gray-400 mt-0.5 leading-relaxed text-[11px]">
                      Nationally approved programs for jobs & higher studies.
                    </p>
                  </div>
                </div>
              </div>

              <style>{`
                @keyframes floatUp   { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
                @keyframes floatDown { 0%,100%{transform:translateY(0)} 50%{transform:translateY(10px)} }
              `}</style>
            </div>

            {/* ── Col 3: Program pills — desktop only ── */}
            <div className="hidden lg:flex flex-col gap-2.5 pl-5 py-6">
              {pills.map((pill) => (
                <div key={pill.label}
                  className="rounded-full text-[13px] font-semibold border whitespace-nowrap text-center transition-all cursor-pointer"
                  style={pill.active
                    ? { background: '#CC2229', color: '#fff', borderColor: '#CC2229', padding: '8px 18px' }
                    : { background: '#fff', color: '#1a1a1a', borderColor: '#e5e7eb', padding: '8px 18px' }
                  }
                >
                  {pill.label}
                </div>
              ))}
            </div>

          </div>

          {/* ── Mobile-only: pill scroll row ── */}
          <div className="flex lg:hidden items-center gap-2 overflow-x-auto pb-1 pt-2 -mx-1 px-1 no-scrollbar">
            {pills.map((pill) => (
              <div key={pill.label}
                className="rounded-full text-[12px] font-semibold border whitespace-nowrap shrink-0"
                style={pill.active
                  ? { background: '#CC2229', color: '#fff', borderColor: '#CC2229', padding: '6px 14px' }
                  : { background: '#fff', color: '#374151', borderColor: '#e5e7eb', padding: '6px 14px' }
                }
              >
                {pill.label}
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  )
}
