'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { FiArrowRight, FiCheckCircle } from 'react-icons/fi'

const highlights = [
  'Accredited Attestation and Certification Services',
  'Flexible Online and Credit Transfer Options',
  'Comprehensive Course and Degree Programs',
]

export default function CTASection() {
  const [awardPhoto, setAwardPhoto] = useState('')
  const [imgError, setImgError] = useState(false)
  const [fetchDone, setFetchDone] = useState(false)

  useEffect(() => {
    fetch(`/api/settings?t=${Date.now()}`, { cache: 'no-store' })
      .then(r => r.json())
      .then(d => {
        if (d.awardPhoto) {
          setAwardPhoto(d.awardPhoto)
          setImgError(false)
        }
      })
      .catch(() => {})
      .finally(() => setFetchDone(true))
  }, [])

  return (
    <section className="bg-white py-0 mb-16">
      <div className="max-w-7xl mx-auto px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2" style={{ minHeight: 500 }}>

          {/* ── Left: Award image panel ── */}
          <div className="relative overflow-hidden bg-gray-100 min-h-[400px] lg:min-h-0">

            {awardPhoto && !imgError ? (
              /* Full-cover uploaded poster image */
              <img
                src={awardPhoto}
                alt="Honored with Excellence"
                className="w-full h-full object-cover object-center"
                style={{ position: 'absolute', inset: 0 }}
                onError={() => setImgError(true)}
              />
            ) : (
              /* Fallback placeholder design */
              <>
                {/* Watermark */}
                <div
                  className="absolute inset-0 flex items-center justify-center select-none pointer-events-none overflow-hidden"
                  aria-hidden
                >
                  <span
                    className="font-black text-gray-300 whitespace-nowrap leading-none"
                    style={{ fontSize: 'clamp(5rem,14vw,11rem)', opacity: 0.18, letterSpacing: '-0.04em' }}
                  >
                    CENTER
                  </span>
                </div>

                {/* Headline */}
                <div className="absolute top-10 left-0 right-0 text-center z-10 px-6">
                  <p
                    className="font-black uppercase italic leading-tight"
                    style={{ fontSize: 'clamp(1.8rem,4vw,3rem)', color: '#CC2229', letterSpacing: '-0.01em' }}
                  >
                    HONORED WITH<br />EXCELLENCE..!
                  </p>
                </div>

                {/* Award text */}
                <div className="absolute top-[44%] left-0 right-0 text-center z-10 px-10">
                  <p className="text-gray-700 text-sm leading-relaxed max-w-xs mx-auto">
                    We've been awarded the <strong>Best Admission Partner</strong> by{' '}
                    <strong>Swami Vivekanand Subharti University</strong>, presented by{' '}
                    <strong>Prof. (Dr.) Mahavir Singh</strong>, Director, Centre for Distance and Online Education.
                  </p>
                </div>

                {/* Red bottom */}
                <div
                  className="absolute bottom-0 left-0 right-0 h-20"
                  style={{ background: 'linear-gradient(to top, #CC2229 40%, transparent 100%)' }}
                />
                <div className="absolute bottom-0 left-0 right-0 h-3" style={{ background: '#CC2229' }} />

                <div className="absolute bottom-4 left-0 right-0 text-center z-10">
                  <p className="text-white/80 text-xs font-semibold">
                    Upload award photo via Admin → Settings
                  </p>
                </div>
              </>
            )}
          </div>

          {/* ── Right: Content panel ── */}
          <div
            className="flex flex-col justify-center px-10 py-14 relative overflow-hidden"
            style={{ background: '#f7f7f5' }}
          >
            {/* Dot grid */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage: 'radial-gradient(circle, #2B3488 1px, transparent 1px)',
                backgroundSize: '22px 22px',
                opacity: 0.07,
              }}
            />

            <div className="relative">
              <p className="text-sm font-bold uppercase tracking-widest mb-3" style={{ color: '#CC2229' }}>
                Get To Know Us
              </p>

              <h2
                className="font-black text-gray-900 font-heading leading-tight mb-5"
                style={{ fontSize: 'clamp(1.8rem,3.5vw,2.8rem)' }}
              >
                Learning Anytime,<br />
                <span style={{ color: '#2B3488' }}>Anywhere for Success</span>
              </h2>

              <p className="text-gray-500 text-base leading-relaxed mb-7 max-w-lg">
                Providing accessible, high-quality education and guidance, Tirur Institute of Management Studies
                fosters academic excellence, professional growth, and societal impact for every learner.
              </p>

              <ul className="space-y-3.5 mb-8">
                {highlights.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <FiCheckCircle size={20} className="shrink-0 mt-0.5" style={{ color: '#2B3488' }} />
                    <span className="text-gray-800 font-semibold text-[15px]">{item}</span>
                  </li>
                ))}
              </ul>

              <div className="flex flex-wrap gap-3">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 px-7 py-3.5 text-white font-bold rounded-xl text-sm transition-all hover:opacity-90 shadow-lg"
                  style={{ background: 'linear-gradient(135deg,#CC2229,#2B3488)' }}
                >
                  Get Free Guidance <FiArrowRight size={15} />
                </Link>
                <Link
                  href="/courses"
                  className="inline-flex items-center gap-2 px-7 py-3.5 font-bold rounded-xl text-sm transition-all hover:bg-gray-100 border-2 border-gray-200 text-gray-700"
                >
                  Explore Programs
                </Link>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
