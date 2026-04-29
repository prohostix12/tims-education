'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FiArrowRight, FiCheckCircle, FiMapPin, FiDownload, FiBookOpen, FiChevronDown } from 'react-icons/fi'

interface University {
  slug: string
  name: string
  shortName: string
  naac: string
  type: string
  established: number
  location: string
  description: string
  accreditations: string[]
  highlights: string[]
  feeRange: string
  website: string
  logo?: string
  banner?: string
  filterTags?: string[]
}

interface StudyMaterial {
  _id: string
  universitySlug: string
  universityName: string
  courseTitle: string
  subject: string
  title: string
  description: string
  fileUrl: string
  type: string
  semester: string
}

const filters = ['All', '10th/Plus Two', 'Degree/PG', 'Study Materials', 'Examination']

const naacBadge: Record<string, string> = {
  'A++': 'bg-emerald-100 text-emerald-800 border-emerald-200',
  'A+':  'bg-blue-100 text-blue-800 border-blue-200',
  'A':   'bg-primary-50 text-primary-700 border-primary-200',
}

const filterIcons: Record<string, string> = {
  'All': '🏛️',
  '10th/Plus Two': '📋',
  'Degree/PG': '🎓',
  'Study Materials': '📚',
  'Examination': '✍️',
}

const typeBadge = (t: string) =>
  t === 'pdf' ? 'bg-red-50 text-red-600 border-red-100' :
  t === 'video' ? 'bg-purple-50 text-purple-600 border-purple-100' :
  'bg-blue-50 text-blue-600 border-blue-100'

const typeIcon = (t: string) => t === 'pdf' ? '📄' : t === 'video' ? '🎥' : '🔗'

export default function UniversitiesPage() {
  const router = useRouter()
  const [activeFilter, setActiveFilter] = useState('All')
  const [universities, setUniversities] = useState<University[]>([])
  const [loading, setLoading] = useState(true)
  const [studyMaterials, setStudyMaterials] = useState<StudyMaterial[]>([])
  const [expandedUni, setExpandedUni] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/universities')
      .then((r) => r.json())
      .then((d) => { setUniversities(Array.isArray(d) ? d : []); setLoading(false) })
      .catch(() => setLoading(false))

    fetch(`/api/study-materials?t=${Date.now()}`, { cache: 'no-store' })
      .then(r => r.json())
      .then((d: StudyMaterial[]) => setStudyMaterials(Array.isArray(d) ? d : []))
      .catch(() => {})
  }, [])

  const unisWithMaterials = new Set(studyMaterials.map(m => m.universitySlug))

  const materialsByUni: Record<string, StudyMaterial[]> = {}
  for (const m of studyMaterials) {
    if (!materialsByUni[m.universitySlug]) materialsByUni[m.universitySlug] = []
    materialsByUni[m.universitySlug].push(m)
  }

  const filtered = activeFilter === 'All'
    ? universities
    : activeFilter === 'Study Materials'
      ? universities.filter(u => unisWithMaterials.has(u.slug))
      : universities.filter(u => u.filterTags?.includes(activeFilter))

  return (
    <div className="">

      {/* ── Hero ── */}
      <section className="bg-gray-50 min-h-[90vh] flex items-center px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-50"
          style={{ backgroundImage: 'radial-gradient(circle, #cbd5e1 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
        <div className="absolute top-0 right-0 w-80 h-80 bg-primary-100 rounded-full translate-x-28 -translate-y-28 blur-3xl" />
        <div className="relative max-w-7xl mx-auto">
          <div className="flex flex-col items-center text-center mb-10">
            <p className="text-accent font-semibold text-sm uppercase tracking-widest mb-3">Our Network</p>
            <h1 className="text-3xl md:text-5xl font-bold text-gray-900 font-heading mb-4">Partner Universities</h1>
            <p className="text-gray-600 text-lg max-w-2xl">
              Every university in our network is UGC-DEB approved and NAAC accredited — so your degree is recognised everywhere.
            </p>
            <div className="flex items-center gap-2 mt-4 text-gray-500 text-sm">
              <Link href="/" className="text-gray-500 hover:text-[#CC2229] transition-colors">Home</Link>
              <span>/</span>
              <span className="text-accent">Universities</span>
            </div>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {[
              { v: `${universities.length || '12'}+`, l: 'Partner Universities' },
              { v: 'A+', l: 'Avg NAAC Grade' },
              { v: '200+', l: 'Programs' },
              { v: '100%', l: 'UGC Approved' },
            ].map((s) => (
              <div key={s.l} className="bg-white  rounded-2xl p-4 text-center border border-white/15">
                <p className="text-2xl font-bold text-gray-900 font-heading">{s.v}</p>
                <p className="text-gray-500 text-xs mt-0.5">{s.l}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 50" fill="none"><path d="M0,25 C360,50 1080,0 1440,25 L1440,50 L0,50 Z" fill="white" /></svg>
        </div>
      </section>

      {/* ── Filter + Grid ── */}
      <section className="bg-gray-50 py-14 px-4">
        <div className="max-w-7xl mx-auto">

          {/* Filter tabs */}
          <div className="flex flex-wrap gap-3 mb-10 justify-center">
            {filters.map((f) => (
              <button key={f} onClick={() => setActiveFilter(f)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all border ${activeFilter === f
                  ? 'bg-primary-600 text-white border-primary-600 shadow-md'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-primary-400 hover:text-primary-600'}`}>
                <span>{filterIcons[f]}</span> {f}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1,2,3,4,5,6].map((i) => (
                <div key={i} className="bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse">
                  <div className="h-32 bg-gray-200" />
                  <div className="p-6 space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-3 bg-gray-100 rounded w-1/2" />
                    <div className="h-3 bg-gray-100 rounded w-full" />
                    <div className="h-3 bg-gray-100 rounded w-5/6" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <>
              <p className="text-gray-500 text-sm mb-8 text-center">
                {filtered.length} universit{filtered.length !== 1 ? 'ies' : 'y'} listed
              </p>

              {/* ── Study Materials accordion view ── */}
              {activeFilter === 'Study Materials' ? (
                <div className="space-y-4">
                  {filtered.map((u) => {
                    const uniMats = materialsByUni[u.slug] ?? []
                    const isOpen = expandedUni === u.slug
                    const courseGroups: Record<string, StudyMaterial[]> = {}
                    for (const m of uniMats) {
                      const key = m.courseTitle || 'General'
                      if (!courseGroups[key]) courseGroups[key] = []
                      courseGroups[key].push(m)
                    }
                    return (
                      <div key={u.slug} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                        {/* Accordion header */}
                        <button
                          className="w-full flex items-center justify-between p-5 hover:bg-gray-50 transition-colors text-left"
                          onClick={() => setExpandedUni(isOpen ? null : u.slug)}>
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-center overflow-hidden shrink-0">
                              {u.logo
                                ? <img src={u.logo} alt={u.shortName} className="w-full h-full object-contain p-1" />
                                : <span className="font-extrabold text-lg font-heading" style={{ color: '#2B3488' }}>{u.shortName?.charAt(0)}</span>
                              }
                            </div>
                            <div>
                              <p className="font-bold text-gray-800 text-sm">{u.name}</p>
                              <div className="flex items-center gap-3 mt-0.5">
                                <span className="text-xs text-gray-400 flex items-center gap-1">
                                  <FiMapPin size={10} /> {u.location}
                                </span>
                                <span className="text-xs text-primary-600 font-semibold">
                                  {uniMats.length} material{uniMats.length !== 1 ? 's' : ''}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 shrink-0">
                            {u.naac && u.naac !== '-' && (
                              <span className={`text-xs font-bold px-2.5 py-1 rounded-lg border hidden sm:inline ${naacBadge[u.naac] || 'bg-gray-100 text-gray-600 border-gray-200'}`}>
                                NAAC {u.naac}
                              </span>
                            )}
                            <FiChevronDown size={16} className={`text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                          </div>
                        </button>

                        {/* Expanded: courses + materials */}
                        {isOpen && (
                          <div className="border-t border-gray-100">
                            {Object.entries(courseGroups).map(([courseTitle, mats]) => (
                              <div key={courseTitle} className="border-b border-gray-50 last:border-0">
                                {/* Course label */}
                                <div className="px-5 py-3 bg-gray-50 flex items-center gap-2">
                                  <FiBookOpen size={13} className="text-primary-600 shrink-0" />
                                  <span className="text-sm font-bold text-primary-700">{courseTitle}</span>
                                  <span className="text-xs text-gray-400 ml-auto">{mats.length} file{mats.length !== 1 ? 's' : ''}</span>
                                </div>
                                {/* Materials */}
                                <div className="divide-y divide-gray-50">
                                  {mats.map(m => (
                                    <div key={m._id} className="flex items-center justify-between gap-3 px-5 py-3.5 hover:bg-gray-50 transition-colors">
                                      <div className="flex items-start gap-3 min-w-0">
                                        <span className="text-xl shrink-0 mt-0.5">{typeIcon(m.type)}</span>
                                        <div className="min-w-0">
                                          <p className="font-semibold text-gray-800 text-sm truncate">{m.title}</p>
                                          <div className="flex flex-wrap items-center gap-2 mt-0.5">
                                            {m.subject && <span className="text-[11px] text-gray-500">{m.subject}</span>}
                                            {m.semester && <span className="text-[11px] text-gray-400">· {m.semester}</span>}
                                          </div>
                                          {m.description && <p className="text-xs text-gray-400 mt-0.5 truncate">{m.description}</p>}
                                        </div>
                                      </div>
                                      <div className="flex items-center gap-2 shrink-0">
                                        <span className={`text-[11px] font-medium px-2 py-0.5 rounded-lg border hidden sm:inline ${typeBadge(m.type)}`}>
                                          {m.type.toUpperCase()}
                                        </span>
                                        <a href={m.fileUrl} target="_blank" rel="noopener noreferrer"
                                          className="flex items-center gap-1 px-3 py-1.5 bg-primary-600 text-white text-xs font-semibold rounded-lg hover:bg-primary-700 transition-all">
                                          <FiDownload size={11} /> Download
                                        </a>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ))}
                            {/* Footer link */}
                            <div className="px-5 py-3 flex justify-end border-t border-gray-100">
                              <Link href={`/universities/${u.slug}`}
                                className="flex items-center gap-1.5 text-xs text-primary-600 font-semibold hover:text-primary-800 transition-colors">
                                View University Profile <FiArrowRight size={12} />
                              </Link>
                            </div>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              ) : (
                /* ── Normal grid view ── */
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filtered.map((u) => (
                    <div key={u.slug}
                      className="group bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer"
                      onClick={() => router.push(`/universities/${u.slug}`)}>

                      {/* Card header */}
                      <div className="bg-hero-gradient p-6 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-28 h-28 bg-primary-100 rounded-full translate-x-8 -translate-y-8" />
                        <div className="absolute bottom-0 left-0 w-20 h-20 bg-white/5 rounded-full -translate-x-4 translate-y-4" />
                        <div className="relative flex items-start justify-between">
                          <div className="w-14 h-14 rounded-2xl bg-gray-100 border border-gray-200 flex items-center justify-center overflow-hidden">
                            {u.logo && !u.logo.startsWith('/universities/')
                              ? <img src={u.logo} alt={u.shortName} className="w-full h-full object-contain p-1" />
                              : <span className="text-white font-extrabold text-2xl font-heading">{u.shortName?.charAt(0)}</span>
                            }
                          </div>
                          {u.naac && u.naac !== '-' && (
                            <span className={`text-xs font-bold px-2.5 py-1 rounded-lg border ${naacBadge[u.naac] || 'bg-gray-100 text-gray-600 border-gray-200'}`}>
                              NAAC {u.naac}
                            </span>
                          )}
                        </div>
                        <div className="relative mt-4">
                          <p className="text-gray-500 text-xs font-medium mb-0.5">{u.shortName}</p>
                          <h3 className="text-white font-bold font-heading text-base leading-snug">{u.name}</h3>
                        </div>
                      </div>

                      {/* Card body */}
                      <div className="p-6">
                        <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
                          <FiMapPin size={12} className="text-accent shrink-0" />
                          {u.location}{u.established ? ` · Est. ${u.established}` : ''}
                        </div>

                        <span className="inline-block px-3 py-1 bg-primary-50 text-primary-700 text-xs font-semibold rounded-lg border border-primary-100 mb-4">
                          {u.type}
                        </span>

                        <p className="text-gray-500 text-sm leading-relaxed mb-5 line-clamp-3">{u.description}</p>

                        {u.accreditations?.length > 0 && (
                          <div className="space-y-1.5 mb-5">
                            {u.accreditations.slice(0, 3).map((a) => (
                              <div key={a} className="flex items-center gap-2 text-xs text-gray-600">
                                <FiCheckCircle className="text-primary-600 shrink-0" size={13} /> {a}
                              </div>
                            ))}
                          </div>
                        )}

                        <div className="flex gap-2">
                          <Link href={`/universities/${u.slug}`} onClick={(e) => e.stopPropagation()}
                            className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-primary-600 text-white font-semibold text-sm rounded-xl hover:bg-primary-700 transition-all">
                            View Details <FiArrowRight size={14} />
                          </Link>
                          <Link href="/contact" onClick={(e) => e.stopPropagation()}
                            className="px-4 py-2.5 border-2 border-accent text-accent font-semibold text-sm rounded-xl hover:bg-accent hover:text-white transition-all">
                            Apply
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="bg-white py-14 px-4">
        <div className="max-w-3xl mx-auto rounded-3xl p-6 md:p-12 text-center relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #CC2229 0%, #2B3488 100%)' }}>
          <div className="absolute inset-0 opacity-10"
            style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '25px 25px' }} />
          <div className="relative">
            <h2 className="text-2xl md:text-3xl font-bold text-white font-heading mb-3">Not sure which university suits you?</h2>
            <p className="text-white/80 mb-6">Get a personalised recommendation based on your eligibility, budget and goals — completely free.</p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link href="/contact"
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-accent text-white font-bold rounded-xl hover:bg-accent-dark transition-all shadow-lg">
                Get Free Guidance <FiArrowRight />
              </Link>
              <Link href="/courses"
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-white text-gray-700 font-semibold rounded-xl border-2 border-gray-300 hover:bg-gray-50 transition-all">
                Browse Programs
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
