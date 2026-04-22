'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import {
  FiArrowRight, FiCheckCircle, FiMapPin, FiExternalLink,
  FiAward, FiBookOpen, FiCalendar, FiArrowLeft, FiPhone,
} from 'react-icons/fi'
import { COURSES } from '@/lib/data'

interface University {
  slug: string
  name: string
  shortName: string
  naac: string
  type: string
  established: number
  location: string
  description: string
  programs?: string[]
  accreditations: string[]
  highlights: string[]
  feeRange: string
  website: string
  logo?: string
  banner?: string
  filterTags?: string[]
}

interface DBCourse {
  _id: string
  slug: string
  title: string
  category: string
  description: string
  duration: string
  mode: string
  icon: string
  badge?: string
  feeRange?: string
}

const naacColor: Record<string, string> = {
  'A++': 'bg-emerald-100 text-emerald-800 border-emerald-300',
  'A+':  'bg-blue-100 text-blue-800 border-blue-300',
  'A':   'bg-indigo-100 text-indigo-800 border-indigo-300',
}

export default function UniversityDetailPage() {
  const params = useParams()
  const slug = params?.slug as string

  const [uni, setUni] = useState<University | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [dbCourses, setDbCourses] = useState<DBCourse[]>([])

  useEffect(() => {
    if (!slug) return
    fetch(`/api/universities/${slug}`)
      .then((r) => {
        if (!r.ok) { setNotFound(true); setLoading(false); return null }
        return r.json()
      })
      .then((d) => { if (d) { setUni(d); setLoading(false) } })
      .catch(() => { setNotFound(true); setLoading(false) })

    // Fetch DB courses assigned to this university
    fetch(`/api/courses/university/${slug}`)
      .then((r) => r.json())
      .then((d) => setDbCourses(Array.isArray(d) ? d : []))
      .catch(() => {})
  }, [slug])

  // Static courses matched by university name
  const staticCourses = uni
    ? COURSES.filter((c) =>
        c.universities.some(
          (u) =>
            u.toLowerCase().includes(uni.name.toLowerCase()) ||
            u.toLowerCase().includes(uni.shortName.toLowerCase()) ||
            uni.name.toLowerCase().includes(u.toLowerCase())
        )
      )
    : []

  if (loading) {
    return (
      <div className="pt-24 min-h-screen flex items-center justify-center">
        <span className="w-10 h-10 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
      </div>
    )
  }

  if (notFound || !uni) {
    return (
      <div className="pt-24 min-h-screen flex flex-col items-center justify-center px-4">
        <h1 className="text-3xl font-bold text-primary-800 mb-3">University Not Found</h1>
        <Link href="/universities" className="text-primary-600 hover:underline flex items-center gap-1">
          <FiArrowLeft size={14} /> Back to Universities
        </Link>
      </div>
    )
  }

  const initial = uni.shortName?.charAt(0) ?? uni.name?.charAt(0) ?? 'U'

  return (
    <div className="pt-24">

      {/* ── Hero ── */}
      <section
        className="min-h-[80vh] flex items-center px-4 relative overflow-hidden"
        style={uni.banner
          ? {
              backgroundImage: `linear-gradient(135deg, rgba(43,52,136,0.93) 0%, rgba(26,32,96,0.88) 60%, rgba(26,32,96,0.75) 100%), url(${uni.banner})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }
          : { background: 'linear-gradient(135deg, #2B3488 0%, #1a2060 100%)' }
        }
      >
        {!uni.banner && (
          <div className="absolute inset-0 opacity-10"
            style={{ backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
        )}
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent/10 rounded-full translate-x-32 -translate-y-32 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full -translate-x-16 translate-y-16 blur-3xl" />

        <div className="relative max-w-7xl mx-auto w-full">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-white/50 text-sm mb-8">
            <Link href="/" className="hover:text-accent transition-colors">Home</Link>
            <span>/</span>
            <Link href="/universities" className="hover:text-accent transition-colors">Universities</Link>
            <span>/</span>
            <span className="text-accent">{uni.shortName}</span>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left */}
            <div>
              {/* Logo badge */}
              <div className="flex items-center gap-4 mb-6">
                <div className="w-20 h-20 rounded-2xl bg-white/15 border-2 border-white/25 flex items-center justify-center shrink-0 overflow-hidden">
                  {uni.logo
                    ? <img src={uni.logo} alt={uni.shortName} className="w-full h-full object-contain p-2" />
                    : <span className="text-white font-extrabold text-3xl font-heading">{initial}</span>
                  }
                </div>
                <div className="flex flex-wrap gap-2">
                  {uni.naac !== '-' && (
                    <span className={`text-xs font-bold px-3 py-1.5 rounded-xl border ${naacColor[uni.naac] || 'bg-gray-100 text-gray-600 border-gray-200'}`}>
                      NAAC {uni.naac}
                    </span>
                  )}
                  <span className="text-xs font-medium px-3 py-1.5 bg-white/15 text-white rounded-xl border border-white/25">
                    {uni.type}
                  </span>
                </div>
              </div>

              <p className="text-accent font-semibold text-sm uppercase tracking-widest mb-2">{uni.shortName}</p>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white font-heading leading-tight mb-4">
                {uni.name}
              </h1>
              <p className="text-white/75 text-base leading-relaxed mb-6 max-w-xl">
                {uni.description}
              </p>

              {/* Meta chips */}
              <div className="flex flex-wrap gap-3 mb-8">
                <span className="flex items-center gap-1.5 px-3 py-1.5 bg-white/15 text-white text-xs font-medium rounded-xl border border-white/25">
                  <FiMapPin size={12} className="text-accent" /> {uni.location}
                </span>
                {uni.established && (
                  <span className="flex items-center gap-1.5 px-3 py-1.5 bg-white/15 text-white text-xs font-medium rounded-xl border border-white/25">
                    <FiCalendar size={12} className="text-accent" /> Est. {uni.established}
                  </span>
                )}
                {uni.feeRange && (
                  <span className="flex items-center gap-1.5 px-3 py-1.5 bg-white/15 text-white text-xs font-medium rounded-xl border border-white/25">
                    💰 {uni.feeRange}
                  </span>
                )}
              </div>

              <div className="flex flex-wrap gap-3">
                <Link href="/contact"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-white font-bold rounded-xl hover:bg-accent-dark transition-all shadow-lg">
                  Apply / Enquire <FiArrowRight />
                </Link>
                {uni.website && (
                  <a href={`https://${uni.website.replace(/^https?:\/\//, '')}`} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-white/15 text-white font-semibold rounded-xl border border-white/30 hover:bg-white/25 transition-all">
                    <FiExternalLink size={15} /> Official Site
                  </a>
                )}
              </div>
            </div>

            {/* Right — stat cards */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Programs', value: uni.programs?.length ? `${uni.programs.length}+` : 'Multiple', icon: '🎓' },
                { label: 'Accreditations', value: uni.accreditations?.length ? `${uni.accreditations.length}+` : 'Approved', icon: '✅' },
                { label: 'NAAC Grade', value: uni.naac !== '-' ? uni.naac : 'Recognised', icon: '🏆' },
                { label: 'Mode', value: 'Online / Distance', icon: '💻' },
              ].map((s) => (
                <div key={s.label} className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/15 text-center hover:bg-white/15 transition-all">
                  <span className="text-2xl mb-2 block">{s.icon}</span>
                  <p className="text-xl font-bold text-white font-heading">{s.value}</p>
                  <p className="text-white/60 text-xs mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 50" fill="none"><path d="M0,25 C360,50 1080,0 1440,25 L1440,50 L0,50 Z" fill="#f8fafc" /></svg>
        </div>
      </section>

      {/* ── About + Programs ── */}
      <section className="bg-gray-50 py-16 px-4">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-10">

          {/* About */}
          <div className="lg:col-span-2 space-y-8">

            {/* DB Courses assigned to this university */}
            {dbCourses.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-7">
                <h2 className="text-xl font-bold text-primary-800 font-heading mb-1 flex items-center gap-2">
                  <span className="w-7 h-7 bg-primary-100 rounded-xl flex items-center justify-center text-sm">🎓</span>
                  Courses Offered
                </h2>
                <p className="text-gray-500 text-sm mb-4">Programs available through TIMS at {uni.shortName}</p>
                <div className="space-y-2">
                  {dbCourses.map((c) => (
                    <div key={c._id} className="flex items-center justify-between gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="text-xl shrink-0">{c.icon}</span>
                        <div className="min-w-0">
                          <p className="font-semibold text-primary-800 text-sm truncate">{c.title}</p>
                          <p className="text-xs text-gray-400">{c.duration} · {c.mode}</p>
                        </div>
                      </div>
                      {c.feeRange && <span className="text-xs text-gray-500 shrink-0">{c.feeRange}</span>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Accreditations */}
            {uni.accreditations?.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-7">
                <h2 className="text-xl font-bold text-primary-800 font-heading mb-4 flex items-center gap-2">
                  <span className="w-7 h-7 bg-green-50 rounded-xl flex items-center justify-center text-sm">✅</span>
                  Accreditations & Recognitions
                </h2>
                <div className="grid sm:grid-cols-2 gap-3">
                  {uni.accreditations.map((a) => (
                    <div key={a} className="flex items-center gap-2.5 bg-gray-50 rounded-xl px-4 py-3 border border-gray-100">
                      <FiCheckCircle className="text-primary-600 shrink-0" size={15} />
                      <span className="text-gray-700 text-sm">{a}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Key Highlights */}
            {uni.highlights?.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-7">
                <h2 className="text-xl font-bold text-primary-800 font-heading mb-4 flex items-center gap-2">
                  <span className="w-7 h-7 bg-yellow-50 rounded-xl flex items-center justify-center text-sm">⭐</span>
                  Key Highlights
                </h2>
                <div className="space-y-3">
                  {uni.highlights.map((h) => (
                    <div key={h} className="flex items-start gap-3">
                      <FiAward className="text-accent mt-0.5 shrink-0" size={15} />
                      <span className="text-gray-700 text-sm leading-relaxed">{h}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            {/* Quick info */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
              <h3 className="font-bold text-primary-800 font-heading text-base">Quick Info</h3>
              {[
                { label: 'Type', value: uni.type },
                { label: 'Location', value: uni.location },
                uni.established ? { label: 'Established', value: String(uni.established) } : null,
                uni.naac !== '-' ? { label: 'NAAC Grade', value: uni.naac } : null,
                uni.feeRange ? { label: 'Fee Range', value: uni.feeRange } : null,
              ].filter(Boolean).map((item) => (
                <div key={item!.label} className="flex justify-between items-start gap-2 border-b border-gray-50 pb-3 last:border-0 last:pb-0">
                  <span className="text-xs text-gray-500 font-medium">{item!.label}</span>
                  <span className="text-xs text-gray-800 font-semibold text-right max-w-[60%]">{item!.value}</span>
                </div>
              ))}
            </div>

            {/* Fee */}
            {uni.feeRange && (
              <div className="bg-primary-600 rounded-2xl p-6 text-white">
                <p className="text-white/70 text-xs font-semibold uppercase tracking-widest mb-1">Fee Range</p>
                <p className="text-xl font-bold font-heading">{uni.feeRange}</p>
                <p className="text-white/60 text-xs mt-1">Per year (approx.)</p>
              </div>
            )}

            {/* Website */}
            {uni.website && (
              <a href={`https://${uni.website.replace(/^https?:\/\//, '')}`} target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-between gap-3 bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:border-primary-300 hover:shadow-md transition-all group">
                <div>
                  <p className="text-xs text-gray-500 mb-0.5">Official Website</p>
                  <p className="text-sm font-semibold text-primary-700 break-all">{uni.website}</p>
                </div>
                <FiExternalLink className="text-gray-400 group-hover:text-primary-600 shrink-0" size={18} />
              </a>
            )}

            {/* CTA */}
            <div className="bg-accent/5 border border-accent/20 rounded-2xl p-6 text-center">
              <p className="font-bold text-primary-800 font-heading mb-1">Interested?</p>
              <p className="text-gray-500 text-xs mb-4">Talk to our counsellor to know admission dates, fee details, and seat availability.</p>
              <Link href="/contact"
                className="flex items-center justify-center gap-2 py-3 bg-accent text-white font-bold rounded-xl hover:bg-accent-dark transition-all text-sm shadow-md w-full">
                <FiPhone size={14} /> Get Free Guidance
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Courses Offered Through TIMS ── */}
      {staticCourses.length > 0 && (
        <section className="bg-white py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-10">
              <p className="text-primary-600 font-semibold text-sm uppercase tracking-widest mb-2">TIMS Programs</p>
              <h2 className="text-2xl md:text-3xl font-bold text-primary-800 font-heading mb-2">
                Courses Offered Through <span className="text-accent">{uni.shortName}</span>
              </h2>
              <p className="text-gray-500 text-sm max-w-xl mx-auto">
                These programs are available for enrolment at TIMS through {uni.name}.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {staticCourses.map((course) => (
                <div key={course.slug}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all overflow-hidden group">
                  <div className="bg-hero-gradient p-5 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-accent/10 rounded-full translate-x-6 -translate-y-6" />
                    <div className="relative flex items-center justify-between">
                      <span className="text-3xl">{course.icon}</span>
                      {course.badge && (
                        <span className="text-xs font-bold px-2.5 py-1 bg-accent text-white rounded-lg">
                          {course.badge}
                        </span>
                      )}
                    </div>
                    <div className="relative mt-3">
                      <p className="text-white/60 text-xs mb-0.5">{course.category}</p>
                      <h3 className="text-white font-bold font-heading text-base">{course.title}</h3>
                    </div>
                  </div>
                  <div className="p-5">
                    <p className="text-gray-500 text-sm leading-relaxed mb-4 line-clamp-2">{course.description}</p>
                    <div className="flex items-center gap-3 text-xs text-gray-500 mb-4">
                      <span className="flex items-center gap-1">⏱ {course.duration}</span>
                      <span className="flex items-center gap-1">💻 {course.mode}</span>
                    </div>
                    <div className="flex gap-2">
                      <Link href={`/courses#${course.slug}`}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-primary-600 text-white font-semibold text-xs rounded-xl hover:bg-primary-700 transition-all">
                        <FiBookOpen size={13} /> View Course
                      </Link>
                      <Link href="/contact"
                        className="px-4 py-2.5 border-2 border-accent text-accent font-semibold text-xs rounded-xl hover:bg-accent hover:text-white transition-all">
                        Apply
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── CTA ── */}
      <section className="bg-gray-50 py-14 px-4">
        <div className="max-w-3xl mx-auto bg-hero-gradient rounded-3xl p-10 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-10"
            style={{ backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)', backgroundSize: '25px 25px' }} />
          <div className="relative">
            <h2 className="text-2xl md:text-3xl font-bold text-white font-heading mb-3">
              Ready to enrol at {uni.shortName}?
            </h2>
            <p className="text-white/75 mb-6 text-sm max-w-lg mx-auto">
              Our counsellors will walk you through the admission process, fee structure, and scholarship options — completely free.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link href="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-white font-bold rounded-xl hover:bg-accent-dark transition-all shadow-lg text-sm">
                Get Free Counselling <FiArrowRight />
              </Link>
              <Link href="/universities"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white/15 text-white font-semibold rounded-xl border border-white/30 hover:bg-white/25 transition-all text-sm">
                <FiArrowLeft size={14} /> All Universities
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
