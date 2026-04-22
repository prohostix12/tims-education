'use client'
import { useState } from 'react'
import Link from 'next/link'
import { FiSearch, FiClock, FiMonitor, FiArrowRight, FiFilter, FiX, FiCheckCircle, FiBookOpen, FiBriefcase, FiDollarSign } from 'react-icons/fi'
import { COURSES, UNIVERSITIES } from '@/lib/data'

const categories = ['All', 'School Programs', 'Under Graduate', 'Post Graduate', 'Engineering', 'Diploma', 'Apprenticeship', 'Skill Development']

const modeColor: Record<string, string> = {
  'Online':            'bg-green-50 text-green-700 border-green-200',
  'Distance':          'bg-blue-50 text-blue-700 border-blue-200',
  'Online / Distance': 'bg-purple-50 text-purple-700 border-purple-200',
  'Hybrid':            'bg-orange-50 text-orange-700 border-orange-200',
}

// All university short names from course data
const allUniversities = ['All Universities', ...Array.from(
  new Set(COURSES.flatMap((c) => c.universities))
).sort()]

export default function CoursesPage() {
  const [search, setSearch]               = useState('')
  const [activeCategory, setActiveCategory] = useState('All')
  const [activeUniversity, setActiveUniversity] = useState('All Universities')
  const [selected, setSelected]           = useState<typeof COURSES[0] | null>(null)

  const filtered = COURSES.filter((c) => {
    const matchCat  = activeCategory === 'All' || c.category === activeCategory
    const matchUni  = activeUniversity === 'All Universities' || c.universities.includes(activeUniversity)
    const matchSearch = c.title.toLowerCase().includes(search.toLowerCase()) ||
                        c.description.toLowerCase().includes(search.toLowerCase()) ||
                        c.category.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchUni && matchSearch
  })

  return (
    <div className="pt-24">

      {/* ── Hero ── */}
      <section className="bg-hero-gradient min-h-[70vh] flex items-center px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
        <div className="absolute bottom-0 right-0 w-72 h-72 bg-accent/10 rounded-full translate-x-20 translate-y-20 blur-3xl" />
        <div className="relative max-w-7xl mx-auto text-center">
          <p className="text-accent font-semibold text-sm uppercase tracking-widest mb-3">Programs & Courses</p>
          <h1 className="text-4xl md:text-5xl font-bold text-white font-heading mb-4">Explore All Programs</h1>
          <p className="text-white/75 text-lg max-w-xl mx-auto mb-8">
            UGC-approved online and distance programs from top universities — tailored to your goals.
          </p>

          {/* Search bar */}
          <div className="max-w-xl mx-auto relative">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input type="text" placeholder="Search programs, categories…"
              value={search} onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-4 rounded-xl text-gray-800 bg-white shadow-xl focus:outline-none focus:ring-2 focus:ring-accent" />
          </div>

          {/* Quick stats */}
          <div className="flex flex-wrap justify-center gap-6 mt-8">
            {[
              { v: '7+', l: 'Program Categories' },
              { v: '200+', l: 'Courses Available' },
              { v: '9+', l: 'Partner Universities' },
              { v: '100%', l: 'UGC Recognised' },
            ].map((s) => (
              <div key={s.l} className="text-center">
                <p className="text-xl font-bold text-white font-heading">{s.v}</p>
                <p className="text-white/60 text-xs">{s.l}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 50" fill="none"><path d="M0,25 C360,50 1080,0 1440,25 L1440,50 L0,50 Z" fill="#f8fafc" /></svg>
        </div>
      </section>

      {/* ── Filter + Grid ── */}
      <section className="bg-gray-50 py-12 px-4">
        <div className="max-w-7xl mx-auto">

          {/* Category tabs */}
          <div className="flex flex-wrap gap-2 mb-4 items-center">
            <FiFilter className="text-gray-400 shrink-0" size={16} />
            {categories.map((cat) => (
              <button key={cat} onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all border ${activeCategory === cat
                  ? 'bg-primary-600 text-white border-primary-600 shadow-md'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-primary-400 hover:text-primary-600'}`}>
                {cat}
              </button>
            ))}
          </div>

          {/* University filter */}
          <div className="flex flex-wrap gap-2 mb-8 items-center">
            <span className="text-gray-400 text-sm font-medium shrink-0 flex items-center gap-1">
              🏛️ University:
            </span>
            {allUniversities.map((uni) => (
              <button key={uni} onClick={() => setActiveUniversity(uni)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${activeUniversity === uni
                  ? 'bg-accent text-white border-accent shadow-md'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-accent/50 hover:text-accent'}`}>
                {uni}
              </button>
            ))}
          </div>

          <p className="text-gray-500 text-sm mb-7">{filtered.length} program{filtered.length !== 1 ? 's' : ''} found</p>

          {filtered.length === 0 ? (
            <div className="text-center py-24">
              <span className="text-6xl mb-4 block">🔍</span>
              <p className="text-gray-500">No programs match your search.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((course) => (
                <div key={course.slug}
                  className="group bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer"
                  onClick={() => setSelected(course)}>

                  {/* Card top */}
                  <div className="bg-hero-gradient p-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-28 h-28 bg-white/5 rounded-full -translate-x-6 -translate-y-6" />
                    <div className="absolute bottom-0 left-0 w-20 h-20 bg-accent/10 rounded-full -translate-x-4 translate-y-4" />
                    <div className="relative">
                      <div className="flex items-start justify-between mb-3">
                        <span className="px-3 py-1 bg-accent text-white text-xs font-bold rounded-full">
                          {course.badge}
                        </span>
                        {course.popular && (
                          <span className="px-2 py-1 bg-white/15 text-white text-xs rounded-lg border border-white/25">🔥 Popular</span>
                        )}
                      </div>
                      <div className="text-4xl mb-3">{course.icon}</div>
                      <h3 className="text-white font-bold text-xl font-heading leading-snug">{course.title}</h3>
                      <p className="text-white/65 text-xs mt-1">{course.category}</p>
                    </div>
                  </div>

                  {/* Card body */}
                  <div className="p-6">
                    <p className="text-gray-500 text-sm leading-relaxed mb-4 line-clamp-2">{course.description}</p>

                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="inline-flex items-center gap-1.5 text-xs text-gray-600 bg-gray-50 rounded-lg px-3 py-1.5 border border-gray-100">
                        <FiClock size={11} className="text-primary-600" /> {course.duration}
                      </span>
                      <span className={`inline-flex items-center gap-1.5 text-xs rounded-lg px-3 py-1.5 border font-medium ${modeColor[course.mode] || 'bg-gray-50 text-gray-600 border-gray-100'}`}>
                        <FiMonitor size={11} /> {course.mode}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 mb-5">
                      <FiDollarSign size={13} className="text-accent shrink-0" />
                      <span className="text-xs text-gray-600">{course.feeRange}</span>
                    </div>

                    <div className="flex gap-2">
                      <button onClick={(e) => { e.stopPropagation(); setSelected(course) }}
                        className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-primary-600 text-white font-semibold text-sm rounded-xl hover:bg-primary-700 transition-all">
                        View Details <FiArrowRight size={14} />
                      </button>
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
        </div>
      </section>

      {/* ── Bottom CTA ── */}
      <section className="bg-white py-14 px-4">
        <div className="max-w-3xl mx-auto bg-hero-gradient rounded-3xl p-12 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-10"
            style={{ backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)', backgroundSize: '25px 25px' }} />
          <div className="relative">
            <h2 className="text-2xl md:text-3xl font-bold text-white font-heading mb-3">Still not sure which program?</h2>
            <p className="text-white/75 mb-6">Our expert counsellors will help you choose the perfect fit — free, no pressure.</p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link href="/contact"
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-accent text-white font-bold rounded-xl hover:bg-accent-dark transition-all shadow-lg">
                Talk to a Counsellor <FiArrowRight />
              </Link>
              <Link href="/universities"
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-white/15 text-white font-semibold rounded-xl border border-white/30 hover:bg-white/25 transition-all">
                Browse Universities
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Program Detail Modal ── */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={() => setSelected(null)}>
          <div className="absolute inset-0 bg-primary-900/70 backdrop-blur-sm" />
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}>

            {/* Modal header */}
            <div className="bg-hero-gradient p-8 rounded-t-3xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-accent/15 rounded-full translate-x-12 -translate-y-12" />
              <button onClick={() => setSelected(null)}
                className="absolute top-4 right-4 w-9 h-9 bg-white/15 hover:bg-white/25 rounded-full flex items-center justify-center text-white transition-all">
                <FiX size={16} />
              </button>
              <div className="relative">
                <div className="flex items-center gap-3 mb-4">
                  <span className="px-3 py-1 bg-accent text-white text-xs font-bold rounded-full">{selected.badge}</span>
                  {selected.popular && <span className="px-2.5 py-1 bg-white/15 text-white text-xs rounded-lg border border-white/25">🔥 Popular</span>}
                </div>
                <div className="text-5xl mb-3">{selected.icon}</div>
                <h2 className="text-white font-bold font-heading text-2xl leading-snug">{selected.title}</h2>
                <p className="text-white/65 text-sm mt-1">{selected.category}</p>
              </div>
            </div>

            {/* Quick info strip */}
            <div className="grid grid-cols-3 bg-primary-800">
              {[
                { icon: <FiClock size={14} />, label: 'Duration', val: selected.duration },
                { icon: <FiMonitor size={14} />, label: 'Mode', val: selected.mode },
                { icon: <FiDollarSign size={14} />, label: 'Fee Range', val: selected.feeRange },
              ].map((item) => (
                <div key={item.label} className="text-center py-4 px-2 border-r border-white/10 last:border-0">
                  <div className="flex justify-center text-accent mb-1">{item.icon}</div>
                  <p className="text-white/50 text-[10px] uppercase tracking-wider">{item.label}</p>
                  <p className="text-white font-semibold text-xs mt-0.5">{item.val}</p>
                </div>
              ))}
            </div>

            {/* Modal body */}
            <div className="p-8 space-y-7">

              {/* About */}
              <div>
                <h3 className="font-bold text-primary-800 font-heading mb-2 flex items-center gap-2">
                  <span className="w-6 h-6 bg-primary-100 rounded-lg flex items-center justify-center text-xs">📋</span>
                  Program Overview
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">{selected.fullDescription}</p>
              </div>

              {/* Eligibility */}
              <div className="bg-primary-50 rounded-2xl p-4 border border-primary-100">
                <h3 className="font-bold text-primary-800 font-heading text-sm mb-1 flex items-center gap-2">
                  <FiCheckCircle className="text-primary-600" size={15} /> Eligibility Criteria
                </h3>
                <p className="text-primary-700 text-sm">{selected.eligibility}</p>
              </div>

              {/* Highlights */}
              <div>
                <h3 className="font-bold text-primary-800 font-heading mb-3 flex items-center gap-2">
                  <span className="w-6 h-6 bg-yellow-50 rounded-lg flex items-center justify-center text-xs">⭐</span>
                  Program Highlights
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {selected.highlights.map((h) => (
                    <div key={h} className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2 border border-gray-100 text-sm text-gray-700">
                      <FiCheckCircle className="text-primary-600 shrink-0" size={13} /> {h}
                    </div>
                  ))}
                </div>
              </div>

              {/* Career paths */}
              <div>
                <h3 className="font-bold text-primary-800 font-heading mb-3 flex items-center gap-2">
                  <span className="w-6 h-6 bg-green-50 rounded-lg flex items-center justify-center text-xs">💼</span>
                  Career Opportunities
                </h3>
                <div className="flex flex-wrap gap-2">
                  {selected.careers.map((c) => (
                    <span key={c} className="px-3 py-1.5 bg-accent/10 text-accent text-xs font-semibold rounded-lg border border-accent/20">
                      {c}
                    </span>
                  ))}
                </div>
              </div>

              {/* Universities offering */}
              <div>
                <h3 className="font-bold text-primary-800 font-heading mb-3 flex items-center gap-2">
                  <span className="w-6 h-6 bg-blue-50 rounded-lg flex items-center justify-center text-xs">🏛️</span>
                  Offered Through
                </h3>
                <div className="flex flex-wrap gap-2">
                  {selected.universities.map((u) => (
                    <span key={u} className="px-3 py-1.5 bg-primary-50 text-primary-700 text-xs font-semibold rounded-lg border border-primary-100">
                      {u}
                    </span>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <div className="flex gap-3 pt-2">
                <Link href="/contact"
                  className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-accent text-white font-bold rounded-xl hover:bg-accent-dark transition-all shadow-md text-sm">
                  Enquire / Apply Now <FiArrowRight />
                </Link>
                <Link href="/universities"
                  className="flex-1 flex items-center justify-center gap-2 py-3.5 border-2 border-primary-600 text-primary-600 font-bold rounded-xl hover:bg-primary-600 hover:text-white transition-all text-sm">
                  <FiBookOpen size={15} /> View Universities
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
