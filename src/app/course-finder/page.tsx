'use client'
import { useState, useMemo } from 'react'
import Link from 'next/link'
import { FiArrowRight, FiArrowLeft, FiCheckCircle, FiClock, FiRefreshCw, FiSearch } from 'react-icons/fi'
import { COURSES } from '@/lib/data'

type Answers = {
  qualification: string
  category: string
  interest: string
  mode: string
  goal: string
  budget: string
}

const categoryByQual: Record<string, { value: string; label: string; desc: string }[]> = {
  sslc: [
    { value: 'School Programs', label: '📚 10th / Foundation Programs', desc: 'NIOS, BOSSE, Jamia Urdu — secondary school' },
  ],
  'plus-two': [
    { value: 'School Programs',   label: '📚 12th / Foundation Programs', desc: 'NIOS, BOSSE — higher secondary' },
    { value: 'Under Graduate',    label: '🎓 Undergraduate (UG)',         desc: 'BA, B.Com, BCA, BBA — 3 year degrees' },
    { value: 'Diploma',           label: '📜 Diploma',                    desc: 'Short 1-year professional diploma' },
    { value: 'Skill Development', label: '💡 Skill / Short Courses',      desc: 'Job-ready skills in 3–6 months' },
  ],
  graduate: [
    { value: 'Post Graduate',     label: '🏆 Postgraduate (PG)',          desc: 'MBA, MCA, M.Com, MA — 2 year degrees' },
    { value: 'Under Graduate',    label: '🎓 Second UG Degree',           desc: 'Another bachelor\'s in a new field' },
    { value: 'Skill Development', label: '💡 Skill / Short Courses',      desc: 'Job-ready certifications' },
    { value: 'Engineering',       label: '⚙️ Engineering (M.Tech)',        desc: 'Advanced engineering programs' },
  ],
  postgraduate: [
    { value: 'Post Graduate',     label: '🏆 Advanced PG Program',        desc: 'M.Phil, specialisation, or second PG' },
    { value: 'Skill Development', label: '💡 Professional Certifications', desc: 'High-value certifications' },
    { value: 'Engineering',       label: '⚙️ M.Tech / PhD Programs',       desc: 'Research and technical programs' },
  ],
}

const steps = [
  {
    id: 'qualification' as keyof Answers,
    question: "What's your highest qualification?",
    subtitle: 'We use this to find programs you are eligible for.',
    emoji: '🎓',
    options: [
      { value: 'sslc',         label: '10th Pass (SSLC)',    desc: 'Looking for 11th, 12th or foundation courses' },
      { value: 'plus-two',     label: '12th Pass (Plus Two)', desc: 'Ready for undergraduate programs' },
      { value: 'graduate',     label: "Bachelor's Degree",   desc: 'Looking for PG, MBA or professional programs' },
      { value: 'postgraduate', label: "Master's Degree",     desc: 'Advanced certifications or research programs' },
    ],
  },
  {
    id: 'category' as keyof Answers,
    question: 'Which program category interests you?',
    subtitle: 'Choose the type of course you want to pursue.',
    emoji: '📋',
    options: [],
  },
  {
    id: 'interest' as keyof Answers,
    question: 'Which subject area do you prefer?',
    subtitle: 'Pick the field you want to build your career in.',
    emoji: '💡',
    options: [
      { value: 'management',   label: 'Management & Business',      desc: 'MBA, BBA, B.Com, M.Com, Finance' },
      { value: 'technology',   label: 'Technology & Computers',     desc: 'BCA, MCA, B.Tech, IT certifications' },
      { value: 'arts-science', label: 'Arts, Science & Humanities', desc: 'BA, B.Sc, MA, M.Sc, Literature' },
      { value: 'foundation',   label: '10th / 12th Foundation',     desc: 'NIOS, BOSSE programs' },
      { value: 'skill',        label: 'Skill & Short Courses',      desc: 'Digital marketing, Tally, Spoken English' },
      { value: 'any',          label: 'Show All Options',           desc: 'No preference — show me everything' },
    ],
  },
  {
    id: 'mode' as keyof Answers,
    question: 'How do you prefer to study?',
    subtitle: 'Choose what fits your schedule and lifestyle.',
    emoji: '💻',
    options: [
      { value: 'online',   label: 'Online (Live & Interactive)', desc: 'Study from home with real-time classes' },
      { value: 'distance', label: 'Distance Learning',           desc: 'Self-paced study with materials' },
      { value: 'hybrid',   label: 'Hybrid (Both)',               desc: 'Mix of online and offline study' },
    ],
  },
  {
    id: 'goal' as keyof Answers,
    question: "What's your main goal?",
    subtitle: 'This helps us rank the most relevant programs for you.',
    emoji: '🎯',
    options: [
      { value: 'degree',         label: 'Get a Recognised Degree', desc: 'For govt jobs, higher studies, or career growth' },
      { value: 'career-upgrade', label: 'Upgrade My Career',       desc: 'A better job, promotion, or pay hike' },
      { value: 'skill',          label: 'Learn a Specific Skill',  desc: 'Practical, job-ready skills fast' },
      { value: 'govt-job',       label: 'Prepare for Govt Jobs',   desc: 'Eligibility for PSC, SSC, or banking exams' },
    ],
  },
  {
    id: 'budget' as keyof Answers,
    question: 'What is your annual budget?',
    subtitle: 'We will filter out programs outside your range.',
    emoji: '💰',
    options: [
      { value: 'low',    label: 'Under ₹20,000 / year',     desc: 'Very affordable options' },
      { value: 'medium', label: '₹20,000 – ₹75,000 / year', desc: 'Mid-range programs' },
      { value: 'high',   label: 'Above ₹75,000 / year',     desc: 'Premium universities' },
    ],
  },
]

function scoreMatch(course: typeof COURSES[0], a: Answers): number {
  let s = 0
  if (a.category && course.category !== a.category) return -1
  if (a.qualification === 'sslc')        { if (course.category === 'School Programs') s += 4 }
  if (a.qualification === 'plus-two')    { if (['Under Graduate','Diploma'].includes(course.category)) s += 4; if (course.category === 'School Programs') s += 2 }
  if (a.qualification === 'graduate')    { if (['Post Graduate','Skill Development'].includes(course.category)) s += 4; if (course.category === 'School Programs') s -= 5 }
  if (a.qualification === 'postgraduate'){ if (course.category === 'Post Graduate') s += 4; if (course.category === 'School Programs') s -= 5 }
  if (a.interest !== 'any') {
    if (a.interest === 'management')   { if (['BBA','B.Com','MBA','M.Com','Management'].some(k => course.title.includes(k))) s += 3 }
    if (a.interest === 'technology')   { if (['BCA','MCA','B.Tech','M.Tech','Computer'].some(k => course.title.includes(k))) s += 3 }
    if (a.interest === 'arts-science') { if (['BA','MA','B.Sc','M.Sc','Arts','Science'].some(k => course.title.includes(k))) s += 3 }
    if (a.interest === 'foundation')   { if (course.category === 'School Programs') s += 3 }
    if (a.interest === 'skill')        { if (['Skill Development','Diploma'].includes(course.category)) s += 3 }
  }
  if (a.mode === 'online'   && course.mode.includes('Online'))   s += 2
  if (a.mode === 'distance' && course.mode.includes('Distance')) s += 2
  if (a.mode === 'hybrid')                                        s += 1
  if (a.goal === 'degree'         && ['Under Graduate','Post Graduate'].includes(course.category)) s += 2
  if (a.goal === 'career-upgrade' && ['Post Graduate','Skill Development'].includes(course.category)) s += 2
  if (a.goal === 'skill'          && ['Skill Development','Diploma'].includes(course.category)) s += 2
  const fee = parseInt(course.feeRange.replace(/[^0-9]/g, '')) || 0
  if (a.budget === 'low'    && fee < 20000)                  s += 2
  if (a.budget === 'medium' && fee >= 20000 && fee <= 75000) s += 2
  if (a.budget === 'high'   && fee > 75000)                  s += 2
  if (course.popular) s += 1
  return s
}

const modeColor: Record<string, string> = {
  'Online':            'bg-green-50 text-green-700 border-green-200',
  'Distance':          'bg-blue-50 text-blue-700 border-blue-200',
  'Online / Distance': 'bg-purple-50 text-purple-700 border-purple-200',
  'Hybrid':            'bg-orange-50 text-orange-700 border-orange-200',
}

export default function CourseFinderPage() {
  const [step, setStep]       = useState(0)
  const [answers, setAnswers] = useState<Answers>({ qualification:'', category:'', interest:'', mode:'', goal:'', budget:'' })
  const [showResults, setResults] = useState(false)

  const currentOptions = (s: typeof steps[number]) =>
    s.id === 'category' ? (categoryByQual[answers.qualification] ?? []) : s.options

  const current  = steps[step]
  const options  = currentOptions(current)
  const chosen   = answers[current.id]
  const progress = ((step + 1) / steps.length) * 100

  const pick    = (v: string) => setAnswers(p => ({ ...p, [current.id]: v }))
  const next    = () => { if (step < steps.length - 1) setStep(s => s + 1); else setResults(true) }
  const back    = () => { if (step > 0) setStep(s => s - 1) }
  const restart = () => { setStep(0); setAnswers({ qualification:'', category:'', interest:'', mode:'', goal:'', budget:'' }); setResults(false) }

  const recs = useMemo(() =>
    [...COURSES]
      .map(c => ({ c, score: scoreMatch(c, answers) }))
      .filter(({ score }) => score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 9)
      .map(({ c }) => c),
    [answers]
  )

  return (
    <div className="min-h-screen bg-[#f7f7f5] pt-20">
      {/* dot grid */}
      <div className="fixed inset-0 pointer-events-none"
        style={{ backgroundImage: 'radial-gradient(circle,#d1d5db 1px,transparent 1px)', backgroundSize: '30px 30px', opacity: 0.4 }} />

      {/* ── Hero banner ── */}
      <div className="relative py-12 px-4 text-center">
        <div
          className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-white text-xs font-bold mb-4"
          style={{ background: 'linear-gradient(135deg,#CC2229,#2B3488)' }}
        >
          <FiSearch size={12} /> Smart Course Finder
        </div>
        <h1 className="text-3xl md:text-4xl font-black text-gray-900 font-heading mb-2">
          Find Your <span style={{ color: '#CC2229' }}>Perfect Program</span>
        </h1>
        <p className="text-gray-500 text-sm max-w-md mx-auto">
          Answer {steps.length} quick questions — we'll instantly match you with the right course.
        </p>
      </div>

      {!showResults ? (
        /* ── Quiz ── */
        <div className="relative flex justify-center px-4 pb-16">
          <div className="w-full max-w-xl">
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">

              {/* Progress */}
              <div className="h-1.5 bg-gray-100">
                <div
                  className="h-full transition-all duration-500"
                  style={{ width: `${progress}%`, background: 'linear-gradient(90deg,#CC2229,#2B3488)' }}
                />
              </div>

              {/* Card header */}
              <div className="px-6 pt-5 pb-4 border-b border-gray-100"
                style={{ background: 'linear-gradient(135deg,rgba(204,34,41,0.04),rgba(43,52,136,0.04))' }}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-2xl"
                      style={{ background: 'linear-gradient(135deg,rgba(204,34,41,0.12),rgba(43,52,136,0.12))' }}>
                      {current.emoji}
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider" style={{ color: '#CC2229' }}>
                        Step {step + 1} of {steps.length}
                      </p>
                      <h2 className="text-lg font-bold text-gray-900 leading-tight">{current.question}</h2>
                    </div>
                  </div>
                  {/* Step dots */}
                  <div className="hidden sm:flex items-center gap-1.5 shrink-0">
                    {steps.map((_, i) => (
                      <div key={i} className="rounded-full transition-all duration-300"
                        style={{
                          width: i === step ? 16 : i < step ? 16 : 8,
                          height: 8,
                          background: i < step ? '#2B3488' : i === step ? '#CC2229' : '#e5e7eb',
                        }} />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-gray-400 mt-1.5 ml-[52px]">{current.subtitle}</p>
              </div>

              {/* Options */}
              <div className="p-5 space-y-2.5 max-h-[55vh] overflow-y-auto">
                {options.map((opt) => {
                  const sel = chosen === opt.value
                  return (
                    <button key={opt.value} onClick={() => pick(opt.value)}
                      className="w-full flex items-center gap-3 p-4 rounded-2xl border-2 text-left transition-all"
                      style={sel
                        ? { borderColor: '#CC2229', background: 'rgba(204,34,41,0.04)', boxShadow: '0 2px 12px rgba(204,34,41,0.12)' }
                        : { borderColor: '#f3f4f6', background: '#f9fafb' }
                      }>
                      <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all"
                        style={sel ? { borderColor: '#CC2229', background: '#CC2229' } : { borderColor: '#d1d5db' }}>
                        {sel && <div className="w-2 h-2 bg-white rounded-full" />}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-sm" style={{ color: sel ? '#CC2229' : '#1f2937' }}>{opt.label}</p>
                        {'desc' in opt && <p className="text-xs text-gray-400 mt-0.5">{opt.desc}</p>}
                      </div>
                      {sel && <FiCheckCircle size={16} style={{ color: '#CC2229' }} className="shrink-0" />}
                    </button>
                  )
                })}
              </div>

              {/* Navigation */}
              <div className="px-5 pb-5 pt-3 flex gap-2.5 border-t border-gray-100">
                {step > 0 && (
                  <button onClick={back}
                    className="flex items-center gap-2 px-5 py-3 border-2 border-gray-200 text-gray-600 font-semibold rounded-2xl hover:border-gray-300 hover:bg-gray-50 transition-all text-sm">
                    <FiArrowLeft size={14} /> Back
                  </button>
                )}
                <button onClick={next} disabled={!chosen}
                  className="flex-1 flex items-center justify-center gap-2 py-3 text-white font-bold rounded-2xl text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{ background: chosen ? 'linear-gradient(135deg,#CC2229,#2B3488)' : '#e5e7eb', color: chosen ? '#fff' : '#9ca3af' }}>
                  {step === steps.length - 1
                    ? <><FiCheckCircle size={15} /> Show My Courses</>
                    : <>Next <FiArrowRight size={14} /></>}
                </button>
              </div>
            </div>
            <p className="text-center text-gray-400 text-xs mt-4">Free · No signup required · Personalised results</p>
          </div>
        </div>
      ) : (
        /* ── Results ── */
        <div className="relative px-4 pb-16">
          <div className="max-w-5xl mx-auto">

            {/* Results header */}
            <div className="rounded-3xl p-8 mb-8 text-center relative overflow-hidden border border-gray-100"
              style={{ background: 'linear-gradient(135deg,rgba(204,34,41,0.06),rgba(43,52,136,0.06))' }}>
              <div className="text-4xl mb-3">🎉</div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 font-heading mb-2">
                {recs.length} Program{recs.length !== 1 ? 's' : ''} Match Your Profile
              </h2>
              <p className="text-gray-500 text-sm max-w-lg mx-auto">
                Ranked by how well they match your qualification, interests, and budget.
              </p>
              <div className="flex flex-wrap justify-center gap-2 mt-4">
                {answers.qualification && (
                  <span className="px-3 py-1 bg-white text-gray-700 text-xs rounded-full border border-gray-200 shadow-sm">
                    {answers.qualification.replace('-',' ')}
                  </span>
                )}
                {answers.category && (
                  <span className="px-3 py-1 text-white text-xs rounded-full" style={{ background: '#CC2229' }}>
                    {answers.category}
                  </span>
                )}
                {answers.mode && (
                  <span className="px-3 py-1 bg-white text-gray-700 text-xs rounded-full border border-gray-200 shadow-sm">
                    {answers.mode}
                  </span>
                )}
              </div>
              <button onClick={restart}
                className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 bg-white text-gray-700 font-semibold rounded-xl border border-gray-200 hover:bg-gray-50 transition-all text-sm shadow-sm">
                <FiRefreshCw size={13} /> Retake Quiz
              </button>
            </div>

            {recs.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center shadow-xl border border-gray-100">
                <div className="text-5xl mb-4">🔍</div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">No exact matches found</h3>
                <p className="text-gray-500 mb-6 text-sm">Try different preferences for more results.</p>
                <button onClick={restart}
                  className="px-6 py-3 text-white font-bold rounded-xl"
                  style={{ background: '#CC2229' }}>
                  Try Again
                </button>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                {recs.map((course, i) => (
                  <div key={course.slug}
                    className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl hover:-translate-y-1 transition-all border border-gray-100">
                    <div className="p-5 relative overflow-hidden"
                      style={{ background: 'linear-gradient(135deg,#2B3488,#1a2060)' }}>
                      <div className="absolute top-0 right-0 w-24 h-24 rounded-full translate-x-8 -translate-y-8"
                        style={{ background: 'rgba(255,255,255,0.05)' }} />
                      {i === 0 && (
                        <span className="absolute top-3 right-3 px-2.5 py-1 text-white text-[10px] font-bold rounded-full uppercase"
                          style={{ background: '#CC2229' }}>
                          Best Match
                        </span>
                      )}
                      <div className="relative">
                        <div className="text-4xl mb-2">{course.icon}</div>
                        <h3 className="text-white font-bold font-heading text-base leading-snug">{course.title}</h3>
                        <p className="text-white/60 text-xs mt-0.5">{course.category}</p>
                      </div>
                    </div>
                    <div className="p-5">
                      <p className="text-gray-500 text-xs leading-relaxed mb-4 line-clamp-2">{course.description}</p>
                      <div className="flex flex-wrap gap-2 mb-3">
                        <span className="inline-flex items-center gap-1 text-xs text-gray-600 bg-gray-50 rounded-lg px-2.5 py-1 border border-gray-100">
                          <FiClock size={10} style={{ color: '#2B3488' }} /> {course.duration}
                        </span>
                        <span className={`text-xs rounded-lg px-2.5 py-1 border font-medium ${modeColor[course.mode] || 'bg-gray-50 text-gray-600 border-gray-100'}`}>
                          {course.mode}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mb-4">💰 {course.feeRange}</p>
                      <div className="flex gap-2">
                        <Link href="/contact"
                          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-white font-semibold text-xs rounded-xl hover:opacity-90 transition-all"
                          style={{ background: '#2B3488' }}>
                          Enquire <FiArrowRight size={12} />
                        </Link>
                        <Link href="/contact"
                          className="px-3 py-2.5 text-white font-semibold text-xs rounded-xl hover:opacity-90 transition-all"
                          style={{ background: '#CC2229' }}>
                          Apply
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Bottom CTA */}
            <div className="mt-10 rounded-3xl p-8 text-center border border-gray-100"
              style={{ background: 'linear-gradient(135deg,rgba(43,52,136,0.06),rgba(204,34,41,0.06))' }}>
              <h3 className="text-xl font-bold text-gray-900 font-heading mb-2">Still not sure which program?</h3>
              <p className="text-gray-500 text-sm mb-5">Talk to a TIMS counsellor — free, no pressure, personalised guidance.</p>
              <div className="flex flex-wrap gap-3 justify-center">
                <Link href="/contact"
                  className="inline-flex items-center gap-2 px-6 py-3 text-white font-bold rounded-xl text-sm"
                  style={{ background: 'linear-gradient(135deg,#CC2229,#2B3488)' }}>
                  Get Free Guidance <FiArrowRight />
                </Link>
                <button onClick={restart}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white text-gray-700 font-semibold rounded-xl border border-gray-200 hover:bg-gray-50 transition-all text-sm shadow-sm">
                  <FiRefreshCw size={14} /> Retake Quiz
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
