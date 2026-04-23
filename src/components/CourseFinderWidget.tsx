'use client'
import { useState, useMemo } from 'react'
import Link from 'next/link'
import { FiArrowRight, FiArrowLeft, FiCheckCircle, FiX, FiSearch, FiRefreshCw } from 'react-icons/fi'
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
    { value: 'School Programs', label: '📚 10th / Foundation', desc: 'NIOS, BOSSE — secondary school' },
  ],
  'plus-two': [
    { value: 'Under Graduate',    label: '🎓 Undergraduate (UG)',   desc: 'BA, B.Com, BCA, BBA — 3yr degrees' },
    { value: 'Diploma',           label: '📜 Diploma',              desc: '1-year professional diploma' },
    { value: 'Skill Development', label: '💡 Skill Courses',        desc: 'Job-ready skills in 3–6 months' },
  ],
  graduate: [
    { value: 'Post Graduate',     label: '🏆 Postgraduate (PG)',    desc: 'MBA, MCA, M.Com, MA — 2yr degrees' },
    { value: 'Under Graduate',    label: '🎓 Second UG Degree',     desc: 'Bachelor\'s in a new field' },
    { value: 'Skill Development', label: '💡 Skill Courses',        desc: 'Job-ready certifications' },
    { value: 'Engineering',       label: '⚙️ Engineering (M.Tech)', desc: 'Advanced engineering programs' },
  ],
  postgraduate: [
    { value: 'Post Graduate',     label: '🏆 Advanced PG',          desc: 'M.Phil, specialisation' },
    { value: 'Skill Development', label: '💡 Professional Certs',   desc: 'High-value certifications' },
  ],
}

const steps = [
  {
    id: 'qualification' as keyof Answers,
    question: "Your highest qualification?",
    emoji: '🎓',
    options: [
      { value: 'sslc',         label: '10th Pass (SSLC)' },
      { value: 'plus-two',     label: '12th Pass (Plus Two)' },
      { value: 'graduate',     label: "Bachelor's Degree" },
      { value: 'postgraduate', label: "Master's Degree" },
    ],
  },
  {
    id: 'category' as keyof Answers,
    question: 'Program category?',
    emoji: '📋',
    options: [],
  },
  {
    id: 'interest' as keyof Answers,
    question: 'Subject area?',
    emoji: '💡',
    options: [
      { value: 'management',   label: 'Management & Business' },
      { value: 'technology',   label: 'Technology & Computers' },
      { value: 'arts-science', label: 'Arts, Science & Humanities' },
      { value: 'skill',        label: 'Skill & Short Courses' },
      { value: 'any',          label: 'Show All Options' },
    ],
  },
  {
    id: 'mode' as keyof Answers,
    question: 'Study mode?',
    emoji: '💻',
    options: [
      { value: 'online',   label: 'Online' },
      { value: 'distance', label: 'Distance Learning' },
      { value: 'hybrid',   label: 'Hybrid (Both)' },
    ],
  },
  {
    id: 'budget' as keyof Answers,
    question: 'Annual budget?',
    emoji: '💰',
    options: [
      { value: 'low',    label: 'Under ₹20,000' },
      { value: 'medium', label: '₹20,000 – ₹75,000' },
      { value: 'high',   label: 'Above ₹75,000' },
    ],
  },
]

function scoreMatch(course: typeof COURSES[0], a: Answers): number {
  let s = 0
  if (a.category && course.category !== a.category) return -1
  if (a.qualification === 'sslc')        { if (course.category === 'School Programs') s += 4 }
  if (a.qualification === 'plus-two')    { if (['Under Graduate','Diploma'].includes(course.category)) s += 4 }
  if (a.qualification === 'graduate')    { if (['Post Graduate','Skill Development'].includes(course.category)) s += 4 }
  if (a.qualification === 'postgraduate'){ if (course.category === 'Post Graduate') s += 4 }
  if (a.interest === 'management')   { if (['BBA','B.Com','MBA','M.Com'].some(k => course.title.includes(k))) s += 3 }
  if (a.interest === 'technology')   { if (['BCA','MCA','B.Tech','M.Tech'].some(k => course.title.includes(k))) s += 3 }
  if (a.interest === 'arts-science') { if (['BA','MA','B.Sc','M.Sc'].some(k => course.title.includes(k))) s += 3 }
  if (a.interest === 'skill')        { if (['Skill Development','Diploma'].includes(course.category)) s += 3 }
  if (a.mode === 'online'   && course.mode.includes('Online'))   s += 2
  if (a.mode === 'distance' && course.mode.includes('Distance')) s += 2
  const fee = parseInt(course.feeRange.replace(/[^0-9]/g, '')) || 0
  if (a.budget === 'low'    && fee < 20000)                  s += 2
  if (a.budget === 'medium' && fee >= 20000 && fee <= 75000) s += 2
  if (a.budget === 'high'   && fee > 75000)                  s += 2
  if (course.popular) s += 1
  return s
}

export default function CourseFinderWidget() {
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<Answers>({ qualification:'', category:'', interest:'', mode:'', goal:'', budget:'' })
  const [showResults, setShowResults] = useState(false)

  const currentStep = steps[step]
  const options = currentStep.id === 'category'
    ? (categoryByQual[answers.qualification] ?? [])
    : currentStep.options
  const chosen = answers[currentStep.id]
  const progress = ((step + 1) / steps.length) * 100

  const pick = (v: string) => setAnswers(p => ({ ...p, [currentStep.id]: v }))
  const next = () => { if (step < steps.length - 1) setStep(s => s + 1); else setShowResults(true) }
  const back = () => { if (step > 0) setStep(s => s - 1) }
  const restart = () => { setStep(0); setAnswers({ qualification:'', category:'', interest:'', mode:'', goal:'', budget:'' }); setShowResults(false) }
  const close = () => { setOpen(false); restart() }

  const recs = useMemo(() =>
    [...COURSES]
      .map(c => ({ c, score: scoreMatch(c, answers) }))
      .filter(({ score }) => score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 6)
      .map(({ c }) => c),
    [answers]
  )

  return (
    <>
      {/* ── Floating Button ── */}
      <div className="fixed bottom-20 right-7 z-50">
        {/* Animated pulse rings */}
        <span className="absolute inset-0 rounded-full animate-ping opacity-25"
          style={{ background: 'linear-gradient(135deg,#CC2229,#2B3488)', animationDuration: '1.8s' }} />
        <span className="absolute inset-0 rounded-full animate-ping opacity-15"
          style={{ background: 'linear-gradient(135deg,#2B3488,#CC2229)', animationDuration: '2.4s', animationDelay: '0.6s' }} />

        <button
          onClick={() => setOpen(true)}
          className="relative flex items-center gap-2.5 text-white font-bold text-sm rounded-full shadow-2xl transition-all hover:scale-105 hover:shadow-[0_8px_30px_rgba(204,34,41,0.5)]"
          style={{
            background: 'linear-gradient(135deg, #CC2229 0%, #2B3488 100%)',
            padding: '13px 22px',
            border: '2px solid rgba(255,255,255,0.2)',
          }}
        >
          <FiSearch size={16} />
          Find My Course
        </button>
      </div>

      {/* ── Popup Modal ── */}
      {open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={close}
          />

          {/* Modal card */}
          <div
            className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col"
            style={{ maxHeight: '92vh' }}
          >
            {/* Header gradient bar */}
            <div
              className="px-7 py-5 flex items-center justify-between shrink-0"
              style={{ background: 'linear-gradient(135deg, #CC2229 0%, #2B3488 100%)' }}
            >
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 bg-white/20 rounded-xl flex items-center justify-center text-2xl">
                  {showResults ? '🎉' : currentStep.emoji}
                </div>
                <div>
                  <p className="text-white/70 text-xs font-semibold uppercase tracking-widest">
                    {showResults ? 'Your Results' : `Step ${step + 1} of ${steps.length}`}
                  </p>
                  <p className="text-white font-bold text-lg leading-tight">
                    {showResults ? 'Matched Programs' : currentStep.question}
                  </p>
                </div>
              </div>
              <button onClick={close}
                className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-xl flex items-center justify-center text-white transition-all">
                <FiX size={16} />
              </button>
            </div>

            {/* Progress bar */}
            {!showResults && (
              <div className="h-1 bg-gray-100 shrink-0">
                <div
                  className="h-full transition-all duration-500"
                  style={{
                    width: `${progress}%`,
                    background: 'linear-gradient(90deg, #CC2229, #2B3488)',
                  }}
                />
              </div>
            )}

            {/* Body */}
            <div className="flex-1 overflow-y-auto">
              {!showResults ? (
                <div className="p-7 space-y-3">
                  {options.map((opt) => {
                    const sel = chosen === opt.value
                    return (
                      <button
                        key={opt.value}
                        onClick={() => pick(opt.value)}
                        className="w-full flex items-center gap-4 p-4 rounded-2xl border-2 text-left transition-all"
                        style={sel
                          ? { borderColor: '#CC2229', background: 'rgba(204,34,41,0.05)' }
                          : { borderColor: '#f3f4f6', background: '#f9fafb' }
                        }
                      >
                        <div
                          className="w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0"
                          style={sel
                            ? { borderColor: '#CC2229', background: '#CC2229' }
                            : { borderColor: '#d1d5db' }
                          }
                        >
                          {sel && <div className="w-2 h-2 bg-white rounded-full" />}
                        </div>
                        <p className="font-semibold text-base" style={{ color: sel ? '#CC2229' : '#1f2937' }}>
                          {'label' in opt ? opt.label : ''}
                        </p>
                        {sel && <FiCheckCircle size={15} className="ml-auto shrink-0" style={{ color: '#CC2229' }} />}
                      </button>
                    )
                  })}
                </div>
              ) : (
                <div className="p-5">
                  {recs.length === 0 ? (
                    <div className="text-center py-8">
                      <div className="text-4xl mb-3">🔍</div>
                      <p className="font-bold text-gray-800 mb-1">No exact matches</p>
                      <p className="text-gray-500 text-sm">Try different preferences.</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {recs.map((course, i) => (
                        <div key={course.slug}
                          className="flex items-center gap-3 p-3.5 bg-gray-50 rounded-2xl border border-gray-100">
                          <div
                            className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0"
                            style={{ background: 'linear-gradient(135deg,rgba(204,34,41,0.1),rgba(43,52,136,0.1))' }}
                          >
                            {course.icon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="font-bold text-gray-800 text-sm leading-tight truncate">{course.title}</p>
                              {i === 0 && (
                                <span className="text-[9px] font-bold px-2 py-0.5 rounded-full text-white shrink-0"
                                  style={{ background: '#CC2229' }}>
                                  Best
                                </span>
                              )}
                            </div>
                            <p className="text-gray-400 text-xs mt-0.5">{course.category} · {course.duration}</p>
                          </div>
                          <Link href="/contact"
                            className="shrink-0 px-3 py-1.5 text-white text-xs font-bold rounded-xl"
                            style={{ background: '#2B3488' }}
                            onClick={close}
                          >
                            Enquire
                          </Link>
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="mt-4 p-4 rounded-2xl text-center"
                    style={{ background: 'linear-gradient(135deg,rgba(204,34,41,0.06),rgba(43,52,136,0.06))', border: '1px solid rgba(43,52,136,0.1)' }}>
                    <p className="font-semibold text-gray-700 text-sm mb-3">Need personalised guidance?</p>
                    <Link href="/contact" onClick={close}
                      className="inline-flex items-center gap-2 px-5 py-2.5 text-white font-bold text-sm rounded-xl"
                      style={{ background: 'linear-gradient(135deg,#CC2229,#2B3488)' }}>
                      Talk to a Counsellor <FiArrowRight size={13} />
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Footer nav */}
            <div className="px-7 pb-6 pt-4 flex gap-3 border-t border-gray-100 shrink-0">
              {showResults ? (
                <>
                  <button onClick={restart}
                    className="flex items-center gap-2 px-5 py-3 border-2 border-gray-200 text-gray-600 font-semibold rounded-2xl hover:bg-gray-50 transition-all text-sm">
                    <FiRefreshCw size={14} /> Retake
                  </button>
                  <Link href="/course-finder" onClick={close}
                    className="flex-1 flex items-center justify-center gap-2 py-3 text-white font-bold rounded-2xl text-sm transition-all"
                    style={{ background: 'linear-gradient(135deg,#CC2229,#2B3488)' }}>
                    See Full Results <FiArrowRight size={14} />
                  </Link>
                </>
              ) : (
                <>
                  {step > 0 && (
                    <button onClick={back}
                      className="flex items-center gap-2 px-5 py-3 border-2 border-gray-200 text-gray-600 font-semibold rounded-2xl hover:bg-gray-50 transition-all text-sm">
                      <FiArrowLeft size={14} /> Back
                    </button>
                  )}
                  <button
                    onClick={next}
                    disabled={!chosen}
                    className="flex-1 flex items-center justify-center gap-2 py-3 text-white font-bold rounded-2xl text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                    style={{ background: chosen ? 'linear-gradient(135deg,#CC2229,#2B3488)' : '#e5e7eb', color: chosen ? '#fff' : '#9ca3af' }}
                  >
                    {step === steps.length - 1
                      ? <><FiCheckCircle size={15} /> Show My Courses</>
                      : <>Next <FiArrowRight size={14} /></>}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
