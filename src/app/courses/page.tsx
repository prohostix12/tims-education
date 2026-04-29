'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  FiSearch, FiClock, FiMonitor, FiArrowRight, FiFilter,
  FiX, FiCheckCircle, FiBookOpen, FiDollarSign, FiChevronRight,
  FiUser, FiPhone, FiMail, FiZap,
} from 'react-icons/fi'

interface Course {
  _id: string; slug: string; title: string; category: string
  description: string; fullDescription: string; duration: string
  mode: string; eligibility: string; popular: boolean; icon: string
  badge: string; feeRange: string; careers: string[]; highlights: string[]
  universities: string[]; syllabusUrl?: string
}
interface UniOption { slug: string; name: string; shortName: string }

// ── Course Finder config ──────────────────────────────────────────────────────

const Q1 = {
  key: 'qual',
  question: 'What is your highest qualification?',
  hint: 'This helps us find programs you are eligible for.',
  options: [
    { label: '10th Pass',        value: '10th',    icon: '📗', cats: ['School Programs'] },
    { label: '12th / Plus Two',  value: '12th',    icon: '📘', cats: ['School Programs','Diploma','Under Graduate','Skill Development'] },
    { label: 'Diploma / ITI',    value: 'diploma', icon: '📙', cats: ['Under Graduate','Engineering','Skill Development','Apprenticeship'] },
    { label: "Bachelor's Degree",value: 'ug',      icon: '🎓', cats: ['Post Graduate','Apprenticeship','Skill Development'] },
    { label: "Master's Degree",  value: 'pg',      icon: '🏅', cats: ['Post Graduate'] },
  ],
}

const Q2 = {
  key: 'interest',
  question: 'What field are you most interested in?',
  hint: 'Pick the area that excites you most.',
  options: [
    { label: 'Business & Management', value: 'business',   icon: '💼', cats: ['Under Graduate','Post Graduate'] },
    { label: 'Technology & Engineering', value: 'tech',    icon: '💻', cats: ['Engineering','Skill Development'] },
    { label: 'Arts, Humanities & Education', value: 'arts',icon: '📚', cats: ['Under Graduate','Post Graduate','School Programs'] },
    { label: 'Commerce & Finance',    value: 'commerce',   icon: '📊', cats: ['Under Graduate','Post Graduate'] },
    { label: 'Skill Development',     value: 'skill',      icon: '🔧', cats: ['Skill Development','Diploma','Apprenticeship'] },
    { label: 'Not sure yet',          value: 'any',        icon: '🌟', cats: [] },
  ],
}

const Q3 = {
  key: 'mode',
  question: 'How do you prefer to study?',
  hint: 'All modes are UGC-DEB approved and flexible.',
  options: [
    { label: 'Online (study from home)',   value: 'Online',   icon: '🌐' },
    { label: 'Distance learning',          value: 'Distance', icon: '📦' },
    { label: 'Either works for me',        value: 'any',      icon: '🤷' },
  ],
}

const Q4 = {
  key: 'budget',
  question: 'What is your budget per year?',
  hint: 'We will show programs that fit your financial plan.',
  options: [
    { label: 'Under ₹20,000',       value: 'low',  icon: '💰' },
    { label: '₹20,000 – ₹60,000',  value: 'mid',  icon: '💳' },
    { label: 'Above ₹60,000',       value: 'high', icon: '🏦' },
    { label: 'No preference',        value: 'any',  icon: '✅' },
  ],
}

type Step = 1 | 2 | 'lead' | 3 | 4 | 'results'

function matchCourses(courses: Course[], answers: Record<string, string>): Course[] {
  const qualOpt  = Q1.options.find(o => o.value === answers.qual)
  const intOpt   = Q2.options.find(o => o.value === answers.interest)
  const qualCats = qualOpt?.cats ?? []
  const intCats  = intOpt?.cats ?? []
  const mode     = answers.mode
  const allowAll = answers.interest === 'any'

  return courses
    .map(c => {
      let score = 0
      if (qualCats.includes(c.category)) score += 3
      if (allowAll || intCats.includes(c.category)) score += 2
      if (mode !== 'any' && c.mode) {
        if (c.mode.toLowerCase().includes(mode?.toLowerCase() ?? '')) score += 1
      } else {
        score += 1
      }
      if (c.popular) score += 1
      return { course: c, score }
    })
    .filter(x => x.score >= 3)
    .sort((a, b) => b.score - a.score)
    .slice(0, 6)
    .map(x => x.course)
}

// ── Helpers ───────────────────────────────────────────────────────────────────
const modeColor: Record<string, string> = {
  'Online':            'bg-green-50 text-green-700 border-green-200',
  'Distance':          'bg-blue-50 text-blue-700 border-blue-200',
  'Online / Distance': 'bg-purple-50 text-purple-700 border-purple-200',
  'Hybrid':            'bg-orange-50 text-orange-700 border-orange-200',
}

export default function CoursesPage() {
  const router = useRouter()
  const [courses, setCourses]     = useState<Course[]>([])
  const [unis, setUnis]           = useState<UniOption[]>([])
  const [loading, setLoading]     = useState(true)
  const [search, setSearch]       = useState('')
  const [activeCategory, setActiveCategory] = useState('All')
  const [activeUni, setActiveUni] = useState('all')
  const [selected, setSelected]   = useState<Course | null>(null)

  // Course Finder state
  const [finderOpen, setFinderOpen]   = useState(false)
  const [step, setStep]               = useState<Step>(1)
  const [answers, setAnswers]         = useState<Record<string, string>>({})
  const [lead, setLead]               = useState({ name: '', phone: '', email: '' })
  const [leadSaving, setLeadSaving]   = useState(false)
  const [leadSaved, setLeadSaved]     = useState(false)
  const [finderResults, setFinderResults] = useState<Course[]>([])
  const finderRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    Promise.all([
      fetch('/api/courses/all').then(r => r.json()).catch(() => []),
      fetch('/api/universities').then(r => r.json()).catch(() => []),
    ]).then(([c, u]) => {
      setCourses(Array.isArray(c) ? c : [])
      setUnis(Array.isArray(u) ? u : [])
      setLoading(false)
    })
  }, [])

  const categories = ['All','School Programs','Under Graduate','Post Graduate','Engineering','Diploma','Apprenticeship','Skill Development']
  const uniOptions = [{ slug: 'all', name: 'All Universities', shortName: 'All Universities' }, ...unis]

  const filtered = courses.filter(c => {
    const matchCat    = activeCategory === 'All' || c.category === activeCategory
    const matchUni    = activeUni === 'all' || c.universities?.includes(activeUni)
    const matchSearch = !search ||
      c.title?.toLowerCase().includes(search.toLowerCase()) ||
      c.description?.toLowerCase().includes(search.toLowerCase()) ||
      c.category?.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchUni && matchSearch
  })

  const uniName = (slug: string) => unis.find(u => u.slug === slug)?.name ?? slug

  // ── Finder helpers ──────────────────────────────────────────────────────────
  const openFinder = () => {
    setStep(1); setAnswers({}); setLead({ name: '', phone: '', email: '' })
    setLeadSaved(false); setFinderResults([]); setFinderOpen(true)
  }

  const pick = (key: string, value: string) => {
    const next = { ...answers, [key]: value }
    setAnswers(next)
    if (key === 'qual')     setStep(2)
    if (key === 'interest') setStep('lead')
    if (key === 'mode')     setStep(4)
    if (key === 'budget') {
      const results = matchCourses(courses, { ...next })
      setFinderResults(results)
      setStep('results')
    }
  }

  const saveLead = async () => {
    if (!lead.name || !lead.phone) return
    setLeadSaving(true)
    const interest = Q2.options.find(o => o.value === answers.interest)?.label ?? ''
    await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: lead.name, phone: lead.phone, email: lead.email,
        course: interest || 'Course Finder Lead',
        source: 'Course Finder',
        message: `Course Finder lead. Qualification: ${Q1.options.find(o => o.value === answers.qual)?.label ?? '—'}. Interest: ${interest || '—'}.`,
      }),
    }).catch(() => {})
    setLeadSaving(false)
    setLeadSaved(true)
    setStep(3)
  }

  const enquireNow = (course: Course) => {
    const params = new URLSearchParams({
      course: course.title,
      name: lead.name,
      phone: lead.phone,
      email: lead.email,
    })
    router.push(`/contact?${params.toString()}`)
  }

  const steps: Step[] = [1, 2, 'lead', 3, 4, 'results']
  const stepIndex = steps.indexOf(step)
  const totalVisual = 5
  const progressPct = Math.round((stepIndex / (steps.length - 1)) * 100)

  return (
    <div className="">

      {/* ── Hero ── */}
      <section className="bg-gray-50 min-h-[90vh] flex items-center px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-50"
          style={{ backgroundImage: 'radial-gradient(circle, #cbd5e1 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
        <div className="absolute bottom-0 right-0 w-72 h-72 bg-primary-100 rounded-full translate-x-20 translate-y-20 blur-3xl" />
        <div className="relative max-w-7xl mx-auto text-center">
          <p className="text-accent font-semibold text-sm uppercase tracking-widest mb-3">Programs & Courses</p>
          <h1 className="text-3xl md:text-5xl font-bold text-gray-900 font-heading mb-4">Explore All Programs</h1>
          <p className="text-gray-600 text-lg max-w-xl mx-auto mb-8">
            UGC-approved online and distance programs from top universities — tailored to your goals.
          </p>
          <div className="max-w-xl mx-auto relative">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input type="text" placeholder="Search programs, categories…"
              value={search} onChange={e => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-4 rounded-xl text-gray-800 bg-white shadow-xl focus:outline-none focus:ring-2 focus:ring-accent" />
          </div>
          <div className="flex flex-wrap justify-center gap-6 mt-8">
            {[
              { v: loading ? '…' : `${categories.length - 1}+`, l: 'Program Categories' },
              { v: loading ? '…' : `${courses.length}+`,        l: 'Courses Available' },
              { v: `${unis.length}+`,                            l: 'Partner Universities' },
              { v: '100%',                                        l: 'UGC Recognised' },
            ].map(s => (
              <div key={s.l} className="text-center">
                <p className="text-xl font-bold text-gray-900 font-heading">{s.v}</p>
                <p className="text-gray-500 text-xs">{s.l}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 50" fill="none"><path d="M0,25 C360,50 1080,0 1440,25 L1440,50 L0,50 Z" fill="white" /></svg>
        </div>
      </section>

      {/* ── Course Finder Banner ── */}
      <section className="bg-white py-10 px-4 border-b border-gray-100">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center gap-6 bg-gradient-to-r from-[#2B3488] to-[#CC2229] rounded-2xl p-6 md:p-8 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10"
            style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
          <div className="relative text-left flex-1">
            <div className="flex items-center gap-2 mb-1">
              <FiZap className="text-yellow-300" size={16} />
              <span className="text-white/70 text-xs font-semibold uppercase tracking-widest">Smart Tool</span>
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-white font-heading mb-1">Not sure which course to pick?</h2>
            <p className="text-white/75 text-sm">Answer 4 quick questions and get personalised program recommendations in under a minute.</p>
          </div>
          <button onClick={openFinder}
            className="relative shrink-0 flex items-center gap-2 px-6 py-3 bg-white text-[#2B3488] font-bold rounded-xl hover:bg-gray-100 transition-all shadow-lg text-sm">
            Find My Course <FiChevronRight size={16} />
          </button>
        </div>
      </section>

      {/* ── Filter + Grid ── */}
      <section className="bg-gray-50 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap gap-2 mb-4 items-center">
            <FiFilter className="text-gray-400 shrink-0" size={16} />
            {categories.map(cat => (
              <button key={cat} onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all border ${
                  activeCategory === cat
                    ? 'bg-primary-600 text-white border-primary-600 shadow-md'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-primary-400 hover:text-primary-600'
                }`}>
                {cat}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2 mb-8 items-center">
            <span className="text-gray-400 text-sm font-medium shrink-0 flex items-center gap-1">🏛️ University:</span>
            {uniOptions.map(u => (
              <button key={u.slug} onClick={() => setActiveUni(u.slug)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
                  activeUni === u.slug
                    ? 'bg-accent text-white border-accent shadow-md'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-accent/50 hover:text-accent'
                }`}>
                {u.name}
              </button>
            ))}
          </div>
          <p className="text-gray-500 text-sm mb-7">{filtered.length} program{filtered.length !== 1 ? 's' : ''} found</p>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1,2,3,4,5,6].map(i => (
                <div key={i} className="bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse">
                  <div className="h-40 bg-gray-200" />
                  <div className="p-6 space-y-3">
                    <div className="h-3 bg-gray-100 rounded w-3/4" />
                    <div className="h-3 bg-gray-100 rounded w-1/2" />
                    <div className="h-8 bg-gray-100 rounded mt-4" />
                  </div>
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-24">
              <span className="text-6xl mb-4 block">🔍</span>
              <p className="text-gray-500">
                {courses.length === 0
                  ? 'No programs in database yet. Add courses from the admin panel.'
                  : 'No programs match your filters.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map(course => (
                <CourseCard key={course._id} course={course} onSelect={() => setSelected(course)} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Bottom CTA ── */}
      <section className="bg-white py-14 px-4">
        <div className="max-w-3xl mx-auto rounded-3xl p-6 md:p-12 text-center relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #CC2229 0%, #2B3488 100%)' }}>
          <div className="absolute inset-0 opacity-10"
            style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '25px 25px' }} />
          <div className="relative">
            <h2 className="text-2xl md:text-3xl font-bold text-white font-heading mb-3">Still not sure which program?</h2>
            <p className="text-white/80 mb-6">Our expert counsellors will help you choose the perfect fit — free, no pressure.</p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link href="/contact"
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-accent text-white font-bold rounded-xl hover:bg-accent-dark transition-all shadow-lg">
                Talk to a Counsellor <FiArrowRight />
              </Link>
              <Link href="/universities"
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-white text-gray-700 font-semibold rounded-xl border-2 border-gray-300 hover:bg-gray-50 transition-all">
                Browse Universities
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Program Detail Modal ── */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="absolute inset-0 bg-primary-900/70" />
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}>
            <div className="bg-hero-gradient p-5 md:p-8 rounded-t-3xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-accent/15 rounded-full translate-x-12 -translate-y-12" />
              <button onClick={() => setSelected(null)}
                className="absolute top-4 right-4 w-9 h-9 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-all">
                <FiX size={16} />
              </button>
              <div className="relative">
                <div className="flex items-center gap-3 mb-4">
                  {selected.badge && <span className="px-3 py-1 bg-accent text-white text-xs font-bold rounded-full">{selected.badge}</span>}
                  {selected.popular && <span className="px-2.5 py-1 bg-gray-100 text-gray-700 text-xs rounded-lg border border-gray-200">🔥 Popular</span>}
                </div>
                <div className="text-5xl mb-3">{selected.icon || '📚'}</div>
                <h2 className="text-white font-bold font-heading text-2xl leading-snug">{selected.title}</h2>
                <p className="text-gray-500 text-sm mt-1">{selected.category}</p>
              </div>
            </div>
            <div className="grid grid-cols-3 bg-primary-800">
              {[
                { icon: <FiClock size={14} />,      label: 'Duration',  val: selected.duration || '—' },
                { icon: <FiMonitor size={14} />,    label: 'Mode',      val: selected.mode || '—' },
                { icon: <FiDollarSign size={14} />, label: 'Fee Range', val: selected.feeRange || '—' },
              ].map(item => (
                <div key={item.label} className="text-center py-4 px-2 border-r border-white/10 last:border-0">
                  <div className="flex justify-center text-accent mb-1">{item.icon}</div>
                  <p className="text-gray-400 text-[10px] uppercase tracking-wider">{item.label}</p>
                  <p className="text-white font-semibold text-xs mt-0.5">{item.val}</p>
                </div>
              ))}
            </div>
            <div className="p-5 md:p-8 space-y-7">
              {selected.fullDescription && (
                <div>
                  <h3 className="font-bold text-primary-800 font-heading mb-2 flex items-center gap-2">
                    <span className="w-6 h-6 bg-primary-100 rounded-lg flex items-center justify-center text-xs">📋</span> Program Overview
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{selected.fullDescription}</p>
                </div>
              )}
              {selected.eligibility && (
                <div className="bg-primary-50 rounded-2xl p-4 border border-primary-100">
                  <h3 className="font-bold text-primary-800 font-heading text-sm mb-1 flex items-center gap-2">
                    <FiCheckCircle className="text-primary-600" size={15} /> Eligibility Criteria
                  </h3>
                  <p className="text-primary-700 text-sm">{selected.eligibility}</p>
                </div>
              )}
              {selected.highlights?.length > 0 && (
                <div>
                  <h3 className="font-bold text-primary-800 font-heading mb-3 flex items-center gap-2">
                    <span className="w-6 h-6 bg-yellow-50 rounded-lg flex items-center justify-center text-xs">⭐</span> Program Highlights
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {selected.highlights.map((h, i) => (
                      <div key={i} className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2 border border-gray-100 text-sm text-gray-700">
                        <FiCheckCircle className="text-primary-600 shrink-0" size={13} /> {h}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {selected.careers?.length > 0 && (
                <div>
                  <h3 className="font-bold text-primary-800 font-heading mb-3 flex items-center gap-2">
                    <span className="w-6 h-6 bg-green-50 rounded-lg flex items-center justify-center text-xs">💼</span> Career Opportunities
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selected.careers.map((c, i) => (
                      <span key={i} className="px-3 py-1.5 bg-accent/10 text-accent text-xs font-semibold rounded-lg border border-accent/20">{c}</span>
                    ))}
                  </div>
                </div>
              )}
              {selected.universities?.length > 0 && (
                <div>
                  <h3 className="font-bold text-primary-800 font-heading mb-3 flex items-center gap-2">
                    <span className="w-6 h-6 bg-blue-50 rounded-lg flex items-center justify-center text-xs">🏛️</span> Offered Through
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selected.universities.map(slug => (
                      <span key={slug} className="px-3 py-1.5 bg-primary-50 text-primary-700 text-xs font-semibold rounded-lg border border-primary-100">
                        {uniName(slug)}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {selected.syllabusUrl && (
                <a href={selected.syllabusUrl} target="_blank" rel="noreferrer"
                  className="flex items-center justify-center gap-2 py-2.5 border-2 border-primary-200 text-primary-600 font-semibold text-sm rounded-xl hover:bg-primary-50 transition-all">
                  📄 Download Syllabus PDF
                </a>
              )}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
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

      {/* ── Course Finder Modal ── */}
      {finderOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
          <div ref={finderRef} className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[92vh] flex flex-col overflow-hidden"
            onClick={e => e.stopPropagation()}>

            {/* Modal header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <FiZap className="text-accent" size={18} />
                <span className="font-bold text-gray-800 font-heading">Course Finder</span>
              </div>
              <button onClick={() => setFinderOpen(false)} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
                <FiX size={18} />
              </button>
            </div>

            {/* Progress bar */}
            {step !== 'results' && (
              <div className="px-6 pt-4 pb-0">
                <div className="flex items-center justify-between text-xs text-gray-400 mb-1.5">
                  <span>Step {stepIndex + 1} of {steps.length - 1}</span>
                  <span>{progressPct}% complete</span>
                </div>
                <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${progressPct}%`, background: 'linear-gradient(90deg,#2B3488,#CC2229)' }} />
                </div>
              </div>
            )}

            <div className="overflow-y-auto flex-1 px-6 py-5">

              {/* Step 1 — Qualification */}
              {step === 1 && (
                <QuizStep q={Q1} onPick={v => pick('qual', v)} />
              )}

              {/* Step 2 — Interest */}
              {step === 2 && (
                <div>
                  <QuizStep q={Q2} onPick={v => pick('interest', v)} />
                  <button onClick={() => setStep(1)} className="mt-4 text-xs text-gray-400 hover:text-gray-600 transition-colors">
                    ← Back
                  </button>
                </div>
              )}

              {/* Lead form — between Q2 and Q3 */}
              {step === 'lead' && (
                <div className="space-y-5">
                  <div className="text-center mb-6">
                    <div className="w-14 h-14 rounded-2xl mx-auto mb-3 flex items-center justify-center text-2xl"
                      style={{ background: 'linear-gradient(135deg,#2B3488,#CC2229)' }}>
                      🎯
                    </div>
                    <h3 className="text-lg font-bold text-gray-800 font-heading">Great choices!</h3>
                    <p className="text-gray-500 text-sm mt-1">
                      Share your details so we can send your personalised results and have a counsellor reach out.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1.5">Your Name *</label>
                    <div className="relative">
                      <FiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                      <input value={lead.name} onChange={e => setLead(p => ({ ...p, name: e.target.value }))}
                        placeholder="Full name"
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1.5">Phone Number *</label>
                    <div className="relative">
                      <FiPhone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                      <input value={lead.phone} onChange={e => setLead(p => ({ ...p, phone: e.target.value }))}
                        placeholder="+91 00000 00000" type="tel"
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1.5">Email Address <span className="text-gray-400">(optional)</span></label>
                    <div className="relative">
                      <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                      <input value={lead.email} onChange={e => setLead(p => ({ ...p, email: e.target.value }))}
                        placeholder="your@email.com" type="email"
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100" />
                    </div>
                  </div>

                  <p className="text-[11px] text-gray-400 text-center">
                    🔒 Your details are private and used only by TIMS counsellors.
                  </p>

                  <button
                    onClick={saveLead}
                    disabled={!lead.name || !lead.phone || leadSaving}
                    className="w-full flex items-center justify-center gap-2 py-3.5 text-white font-bold rounded-xl text-sm transition-all disabled:opacity-50"
                    style={{ background: 'linear-gradient(135deg,#2B3488,#CC2229)' }}>
                    {leadSaving
                      ? <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Saving...</>
                      : <>Continue to Next Step <FiArrowRight size={15} /></>
                    }
                  </button>
                  <button onClick={() => setStep(2)} className="w-full text-center text-xs text-gray-400 hover:text-gray-600 transition-colors">
                    ← Back
                  </button>
                </div>
              )}

              {/* Step 3 — Mode */}
              {step === 3 && (
                <div>
                  <QuizStep q={Q3} onPick={v => pick('mode', v)} />
                  <button onClick={() => setStep('lead')} className="mt-4 text-xs text-gray-400 hover:text-gray-600 transition-colors">
                    ← Back
                  </button>
                </div>
              )}

              {/* Step 4 — Budget */}
              {step === 4 && (
                <div>
                  <QuizStep q={Q4} onPick={v => pick('budget', v)} />
                  <button onClick={() => setStep(3)} className="mt-4 text-xs text-gray-400 hover:text-gray-600 transition-colors">
                    ← Back
                  </button>
                </div>
              )}

              {/* Results */}
              {step === 'results' && (
                <div className="space-y-4">
                  <div className="text-center mb-6">
                    <div className="text-3xl mb-2">🎉</div>
                    <h3 className="text-lg font-bold text-gray-800 font-heading">Your Recommended Programs</h3>
                    <p className="text-gray-500 text-sm mt-1">
                      {finderResults.length > 0
                        ? `We found ${finderResults.length} program${finderResults.length !== 1 ? 's' : ''} matching your profile.`
                        : 'Showing popular programs — our counsellors will help narrow it down.'}
                    </p>
                    {lead.name && (
                      <p className="text-primary-600 text-sm font-medium mt-1">
                        Hi {lead.name}! A counsellor will contact you soon.
                      </p>
                    )}
                  </div>

                  {(finderResults.length > 0 ? finderResults : courses.filter(c => c.popular).slice(0, 4)).map(course => (
                    <div key={course._id}
                      className="bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-all overflow-hidden">
                      <div className="flex items-center gap-4 p-4">
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0"
                          style={{ background: 'linear-gradient(135deg,#2B3488,#CC2229)' }}>
                          {course.icon || '📚'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-gray-800 text-sm truncate">{course.title}</p>
                          <div className="flex flex-wrap gap-2 mt-0.5">
                            <span className="text-xs text-gray-400">{course.category}</span>
                            {course.duration && <span className="text-xs text-gray-400">· {course.duration}</span>}
                          </div>
                          {course.feeRange && <p className="text-xs text-primary-600 font-semibold mt-0.5">{course.feeRange}</p>}
                        </div>
                        <button
                          onClick={() => enquireNow(course)}
                          className="shrink-0 flex items-center gap-1.5 px-4 py-2 text-white text-xs font-bold rounded-xl transition-all"
                          style={{ background: 'linear-gradient(135deg,#CC2229,#2B3488)' }}>
                          Enquire <FiArrowRight size={12} />
                        </button>
                      </div>
                    </div>
                  ))}

                  <div className="pt-2 flex gap-3">
                    <button onClick={() => { setStep(1); setAnswers({}); setFinderResults([]) }}
                      className="flex-1 py-3 text-sm font-semibold text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all">
                      Retake Quiz
                    </button>
                    <Link href="/contact"
                      className="flex-1 py-3 text-sm font-bold text-white rounded-xl text-center transition-all"
                      style={{ background: 'linear-gradient(135deg,#2B3488,#CC2229)' }}
                      onClick={() => setFinderOpen(false)}>
                      Talk to Counsellor
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ── Sub-components ────────────────────────────────────────────────────────────

function QuizStep({ q, onPick }: {
  q: { question: string; hint: string; options: { label: string; value: string; icon: string }[] }
  onPick: (v: string) => void
}) {
  return (
    <div className="space-y-4">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-gray-800 font-heading mb-1">{q.question}</h3>
        <p className="text-gray-400 text-sm">{q.hint}</p>
      </div>
      <div className="space-y-2.5">
        {q.options.map(opt => (
          <button key={opt.value} onClick={() => onPick(opt.value)}
            className="w-full flex items-center gap-4 p-4 bg-gray-50 hover:bg-primary-50 border border-gray-200 hover:border-primary-400 rounded-2xl text-left transition-all group">
            <span className="text-2xl shrink-0">{opt.icon}</span>
            <span className="font-semibold text-gray-700 group-hover:text-primary-700 text-sm">{opt.label}</span>
            <FiChevronRight className="ml-auto text-gray-300 group-hover:text-primary-500 shrink-0" size={16} />
          </button>
        ))}
      </div>
    </div>
  )
}

function CourseCard({ course, onSelect }: { course: Course; onSelect: () => void }) {
  return (
    <div
      className="group bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer"
      onClick={onSelect}>
      <div className="bg-hero-gradient p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-28 h-28 bg-white/5 rounded-full -translate-x-6 -translate-y-6" />
        <div className="absolute bottom-0 left-0 w-20 h-20 bg-primary-100 rounded-full -translate-x-4 translate-y-4" />
        <div className="relative">
          <div className="flex items-start justify-between mb-3">
            {course.badge
              ? <span className="px-3 py-1 bg-accent text-white text-xs font-bold rounded-full">{course.badge}</span>
              : <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full border border-gray-100">{course.category}</span>}
            {course.popular && <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-lg border border-gray-200">🔥 Popular</span>}
          </div>
          <div className="text-4xl mb-3">{course.icon || '📚'}</div>
          <h3 className="text-white font-bold text-xl font-heading leading-snug">{course.title}</h3>
          <p className="text-gray-500 text-xs mt-1">{course.category}</p>
        </div>
      </div>
      <div className="p-6">
        {course.description && (
          <p className="text-gray-500 text-sm leading-relaxed mb-4 line-clamp-2">{course.description}</p>
        )}
        <div className="flex flex-wrap gap-2 mb-4">
          {course.duration && (
            <span className="inline-flex items-center gap-1.5 text-xs text-gray-600 bg-gray-50 rounded-lg px-3 py-1.5 border border-gray-100">
              <FiClock size={11} className="text-primary-600" /> {course.duration}
            </span>
          )}
          {course.mode && (
            <span className={`inline-flex items-center gap-1.5 text-xs rounded-lg px-3 py-1.5 border font-medium ${modeColor[course.mode] || 'bg-gray-50 text-gray-600 border-gray-100'}`}>
              <FiMonitor size={11} /> {course.mode}
            </span>
          )}
        </div>
        {course.feeRange && (
          <div className="flex items-center gap-2 mb-5">
            <FiDollarSign size={13} className="text-accent shrink-0" />
            <span className="text-xs text-gray-600">{course.feeRange}</span>
          </div>
        )}
        <div className="flex gap-2">
          <button onClick={e => { e.stopPropagation(); onSelect() }}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-primary-600 text-white font-semibold text-sm rounded-xl hover:bg-primary-700 transition-all">
            View Details <FiArrowRight size={14} />
          </button>
          <Link href="/contact" onClick={e => e.stopPropagation()}
            className="px-4 py-2.5 border-2 border-accent text-accent font-semibold text-sm rounded-xl hover:bg-accent hover:text-white transition-all">
            Apply
          </Link>
        </div>
      </div>
    </div>
  )
}
