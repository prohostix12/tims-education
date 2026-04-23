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
  const [imgError, setImgError] = useState(false)
  const [heroImage, setHeroImage] = useState('')
  const [fetchDone, setFetchDone] = useState(false)

  useEffect(() => {
    fetch(`/api/settings?t=${Date.now()}`, { cache: 'no-store' })
      .then(r => r.json())
      .then(d => {
        setHeroImage(d.heroStudentImage || '')
        setImgError(false)
      })
      .catch(() => {})
      .finally(() => setFetchDone(true))
  }, [])

  return (
    <section
      className="relative overflow-hidden flex items-center"
      style={{
        backgroundColor: '#f7f7f5',
        height: '100vh',
        paddingTop: 94,
        paddingBottom: 24,
      }}
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

      <div className="relative w-full max-w-6xl mx-auto px-12">
        <div className="grid items-center gap-0" style={{ gridTemplateColumns: '1fr auto 200px' }}>

          {/* ══ Col 1 — Headline + badges + desc + CTA ══ */}
          <div className="flex flex-col justify-center pr-6 py-4">

            <h1
              className="font-black text-gray-950 font-heading leading-[0.94] tracking-tight mb-6"
              style={{ fontSize: 'clamp(2.4rem, 4.8vw, 4.2rem)' }}
            >
              Inspiring<br />
              Education<br />
              <span style={{ color: '#CC2229' }}>Exploration</span>
            </h1>

            {/* Badge row */}
            <div className="flex flex-wrap items-center gap-2.5 mb-5">
              <span className="bg-gray-900 text-white text-sm font-bold px-5 py-2 rounded-full">
                UGC Approved
              </span>
              <span
                className="w-4 h-4 rounded-full shrink-0"
                style={{ background: '#CC2229' }}
              />
              <span
                className="text-white text-sm font-bold px-4 py-2 rounded-full"
                style={{ background: '#2B3488' }}
              >
                9+ Universities
              </span>
              <span
                className="text-white text-sm font-bold px-4 py-2 rounded-full"
                style={{ background: '#CC2229' }}
              >
                100% Online
              </span>
            </div>

            <p className="text-gray-500 text-[17px] leading-relaxed mb-7 max-w-[380px]">
              Fostering ambition and career growth through trusted online and distance education —
              affordable, flexible, and nationally recognised.
            </p>

            <Link
              href="/courses"
              className="inline-flex items-center gap-2 text-white font-bold text-base rounded-full shadow-lg transition-all hover:opacity-90 self-start"
              style={{ background: '#CC2229', padding: '14px 32px' }}
            >
              Getting Started <FiArrowRight size={14} />
            </Link>
          </div>

          {/* ══ Col 2 — Student image with circle blobs ══ */}
          <div
            className="hidden lg:block relative shrink-0"
            style={{ width: 'clamp(340px, 40vw, 560px)', height: 'clamp(380px, 68vh, 620px)' }}
          >
            {/* Large navy circle */}
            <div
              className="absolute rounded-full"
              style={{
                width: '68%',
                height: '68%',
                top: '50%',
                left: '50%',
                transform: 'translate(-58%, -52%)',
                background: '#2B3488',
                zIndex: 0,
              }}
            />
            {/* Red circle */}
            <div
              className="absolute rounded-full"
              style={{
                width: '46%',
                height: '46%',
                top: '50%',
                left: '50%',
                transform: 'translate(-5%, -60%)',
                background: '#CC2229',
                opacity: 0.9,
                zIndex: 0,
              }}
            />

            {/* Student PNG */}
            {heroImage && !imgError ? (
              <img
                src={heroImage}
                alt="Student"
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  height: '96%',
                  width: 'auto',
                  objectFit: 'contain',
                  objectPosition: 'bottom',
                  zIndex: 10,
                  animation: 'fadeInUp 0.5s ease',
                }}
                onError={() => setImgError(true)}
              />
            ) : fetchDone && !heroImage ? (
              /* Only show placeholder once fetch is done and no image is set */
              <div
                className="absolute inset-0 flex items-end justify-center pb-4"
                style={{ zIndex: 10 }}
              >
                <div
                  className="flex flex-col items-center justify-center gap-4 rounded-t-[80px] border-2 border-dashed"
                  style={{
                    width: '55%',
                    height: '80%',
                    borderColor: 'rgba(43,52,136,0.3)',
                    background: 'linear-gradient(to bottom, rgba(43,52,136,0.1), rgba(43,52,136,0.02))',
                  }}
                >
                  <span style={{ fontSize: 64 }}>🎓</span>
                  <p className="text-center text-xs font-semibold px-4 opacity-60" style={{ color: '#2B3488' }}>
                    Upload via<br />Admin → Settings
                  </p>
                </div>
              </div>
            ) : null}

            <style>{`
              @keyframes fadeInUp {
                from { opacity: 0; transform: translateX(-50%) translateY(20px); }
                to   { opacity: 1; transform: translateX(-50%) translateY(0); }
              }
            `}</style>

            {/* Alumni floating badge */}
            <div
              className="absolute bg-white rounded-2xl flex items-center gap-2.5 border border-gray-100"
              style={{
                top: '6%',
                left: '2%',
                zIndex: 20,
                padding: '10px 14px',
                boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
                animation: 'floatUp 3.5s ease-in-out infinite',
              }}
            >
              <span style={{ fontSize: 20 }}>🎓</span>
              <div>
                <p className="font-extrabold text-base font-heading leading-none text-gray-900">10,000+</p>
                <p className="text-gray-400 mt-0.5 text-xs">Alumni</p>
              </div>
            </div>

            {/* UGC floating card */}
            <div
              className="absolute bg-white rounded-2xl border border-gray-100"
              style={{
                bottom: '8%',
                right: '0%',
                zIndex: 20,
                width: 175,
                padding: 12,
                boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
                animation: 'floatDown 4s ease-in-out infinite',
              }}
            >
              <div className="flex items-start gap-2.5">
                <div
                  className="rounded-xl flex items-center justify-center shrink-0 text-base"
                  style={{
                    width: 34, height: 34,
                    background: 'rgba(204,34,41,0.1)',
                    border: '1px solid rgba(204,34,41,0.2)',
                  }}
                >🏛️</div>
                <div>
                  <p className="font-bold text-gray-800 text-sm leading-tight">UGC Recognised</p>
                  <p className="text-gray-400 mt-1 leading-relaxed text-xs">
                    Nationally approved programs for jobs & higher studies.
                  </p>
                </div>
              </div>
            </div>

            <style>{`
              @keyframes floatUp {
                0%, 100% { transform: translateY(0px); }
                50%       { transform: translateY(-10px); }
              }
              @keyframes floatDown {
                0%, 100% { transform: translateY(0px); }
                50%       { transform: translateY(10px); }
              }
            `}</style>
          </div>

          {/* ══ Col 3 — Program pills ══ */}
          <div className="hidden lg:flex flex-col gap-3 pl-6 py-4">
            {pills.map((pill) => (
              <div
                key={pill.label}
                className="rounded-full text-[15px] font-semibold border whitespace-nowrap text-center transition-all cursor-pointer"
                style={
                  pill.active
                    ? {
                        background: '#CC2229',
                        color: '#fff',
                        borderColor: '#CC2229',
                        padding: '10px 24px',
                      }
                    : {
                        background: '#fff',
                        color: '#1a1a1a',
                        borderColor: '#e5e7eb',
                        padding: '10px 24px',
                      }
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
