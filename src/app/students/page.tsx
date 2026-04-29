'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  FiDownload, FiArrowRight, FiExternalLink,
  FiBookOpen, FiChevronDown, FiFileText, FiAlertCircle, FiSearch,
  FiCalendar, FiAward, FiFolder,
} from 'react-icons/fi'

const tabs = ['Study Materials', 'Examinations', 'Results', 'News & Updates', 'FAQ'] as const
type Tab = typeof tabs[number]

interface University { slug: string; name: string; shortName: string; logo?: string; website?: string }
interface StudyMaterial { _id: string; universitySlug: string; universityName: string; courseTitle: string; subject: string; title: string; description: string; fileUrl: string; type: string; semester: string }
interface Examination { _id: string; universitySlug: string; universityName: string; courseTitle: string; title: string; description: string; examDate: string; lastDate: string; scheduleUrl: string; instructions: string }
interface Result { _id: string; universitySlug: string; universityName: string; title: string; description: string; semester: string; resultUrl: string; publishedDate: string }

const news = [
  { date: 'Apr 2025', headline: 'TIMS Admissions Open for 2025–26 Academic Year', tag: 'Admissions', desc: 'Applications are now open for all UG, PG, Diploma, and skill development programs through TIMS partner universities. Enrol before June 30 to avail early-bird benefits.' },
  { date: 'Mar 2025', headline: 'AMU Online Releases New Semester Exam Schedule', tag: 'Exams', desc: 'Aligarh Muslim University Distance Education has published the April 2025 semester examination timetable. Students can download it from the AMU portal or contact TIMS.' },
  { date: 'Feb 2025', headline: 'NIOS October 2024 Results Declared', tag: 'Results', desc: 'NIOS has declared results for the October/November 2024 exam cycle. Students can check their results on the official NIOS results portal using their roll number.' },
  { date: 'Jan 2025', headline: 'New Skill Development Batch Starting February', tag: 'Courses', desc: 'TIMS is launching a new batch for Digital Marketing, Tally Prime, and Spoken English programs. Limited seats — register now through the Contact page.' },
  { date: 'Dec 2024', headline: 'GLA University Semester Results Published', tag: 'Results', desc: 'GLA University has published results for all distance education students for Semester 1 and Semester 3 of the 2024–25 academic year.' },
  { date: 'Nov 2024', headline: 'TIMS Recognized as Top Education Consultancy in Malappuram', tag: 'Achievement', desc: 'TIMS received the Best Education Consultancy Award at the Kerala Education Excellence Meet 2024, recognising our decade-long commitment to accessible education.' },
]

const faqs = [
  { q: 'Are TIMS-supported degrees recognised?', a: 'Yes. All programs are offered through UGC-DEB approved universities, ensuring national recognition. Degrees are valid for government jobs, further studies, and private employment.' },
  { q: 'What documents are needed for admission?', a: 'You typically need mark sheets of your highest qualification, Aadhaar/ID proof, passport-size photos, and a migration certificate if transferring from another university.' },
  { q: 'How do I get my syllabus and study materials?', a: 'TIMS provides syllabus PDFs and study materials directly to enrolled students. You can also download them from the respective university portals. Contact our office for subject-specific guides.' },
  { q: 'How do I check my exam results?', a: 'Results are published on each university\'s official portal. TIMS also notifies students via WhatsApp and SMS when results are declared.' },
  { q: 'Can I get a scholarship?', a: 'Yes. TIMS actively helps students from economically weaker sections and high-achievers to identify and apply for scholarships from partner universities.' },
  { q: 'How do I submit Tutor Mark Assignments (TMA)?', a: 'TIMS will provide you with assignment question papers and guide you on submission. Completed assignments are submitted to the respective university through TIMS on your behalf.' },
  { q: 'Is there a refund policy?', a: 'Refund policies vary by university. Please consult our counsellors before making payment. We ensure full transparency regarding fees and refunds before you enrol.' },
]

const typeIcon = (t: string) => t === 'pdf' ? '📄' : t === 'video' ? '🎥' : '🔗'
const typeBadge = (t: string) =>
  t === 'pdf' ? 'bg-red-50 text-red-600 border-red-100' :
  t === 'video' ? 'bg-purple-50 text-purple-600 border-purple-100' :
  'bg-blue-50 text-blue-600 border-blue-100'

function UniGroupHeader({ slug, name, logo }: { slug: string; name: string; logo?: string }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      {logo ? (
        <img src={logo} alt={slug} className="w-10 h-10 rounded-xl object-contain bg-white border border-gray-200 p-1 shrink-0" />
      ) : (
        <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: 'linear-gradient(135deg,#2B3488,#CC2229)' }}>
          <span className="text-white font-bold text-sm">{(name || slug).charAt(0).toUpperCase()}</span>
        </div>
      )}
      <div>
        <h3 className="font-bold text-primary-800 font-heading text-base">{name || slug}</h3>
      </div>
    </div>
  )
}

export default function StudentsPage() {
  const [activeTab, setActiveTab] = useState<Tab>('Study Materials')
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  // Study Materials state
  const [materials, setMaterials] = useState<StudyMaterial[]>([])
  const [unis, setUnis] = useState<University[]>([])
  const [loadingMaterials, setLoadingMaterials] = useState(true)
  const [expandedUni, setExpandedUni] = useState<string | null>(null)

  // Examinations state
  const [exams, setExams] = useState<Examination[]>([])
  const [loadingExams, setLoadingExams] = useState(true)

  // Results state
  const [results, setResults] = useState<Result[]>([])
  const [loadingResults, setLoadingResults] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch(`/api/study-materials?t=${Date.now()}`, { cache: 'no-store' }).then(r => r.json()).catch(() => []),
      fetch('/api/universities').then(r => r.json()).catch(() => []),
    ]).then(([mats, uniList]) => {
      setMaterials(Array.isArray(mats) ? mats : [])
      setUnis(Array.isArray(uniList) ? uniList : [])
      setLoadingMaterials(false)
    })
  }, [])

  useEffect(() => {
    if (activeTab !== 'Examinations') return
    fetch(`/api/examinations?t=${Date.now()}`, { cache: 'no-store' })
      .then(r => r.json()).then(d => { setExams(Array.isArray(d) ? d : []); setLoadingExams(false) })
      .catch(() => setLoadingExams(false))
  }, [activeTab])

  useEffect(() => {
    if (activeTab !== 'Results') return
    fetch(`/api/results?t=${Date.now()}`, { cache: 'no-store' })
      .then(r => r.json()).then(d => { setResults(Array.isArray(d) ? d : []); setLoadingResults(false) })
      .catch(() => setLoadingResults(false))
  }, [activeTab])

  // Group materials by university slug
  const materialsByUni: Record<string, StudyMaterial[]> = {}
  for (const m of materials) {
    if (!materialsByUni[m.universitySlug]) materialsByUni[m.universitySlug] = []
    materialsByUni[m.universitySlug].push(m)
  }
  // Only unis that have materials
  const unisWithMaterials = Object.keys(materialsByUni)

  // Group exams / results by uni
  const examsByUni: Record<string, Examination[]> = {}
  for (const e of exams) {
    if (!examsByUni[e.universitySlug]) examsByUni[e.universitySlug] = []
    examsByUni[e.universitySlug].push(e)
  }
  const resultsByUni: Record<string, Result[]> = {}
  for (const r of results) {
    if (!resultsByUni[r.universitySlug]) resultsByUni[r.universitySlug] = []
    resultsByUni[r.universitySlug].push(r)
  }

  const uniMap: Record<string, University> = {}
  for (const u of unis) uniMap[u.slug] = u

  return (
    <div className="">

      {/* ── Hero ── */}
      <section className="bg-gray-50 min-h-[90vh] flex items-center px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-50"
          style={{ backgroundImage: 'radial-gradient(circle, #cbd5e1 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
        <div className="absolute top-0 right-0 w-72 h-72 bg-primary-100 rounded-full translate-x-24 -translate-y-24 blur-3xl" />

        <div className="relative max-w-7xl mx-auto text-center">
          <p className="text-accent font-semibold text-sm uppercase tracking-widest mb-3">Students Corner</p>
          <h1 className="text-3xl md:text-5xl font-bold text-gray-900 font-heading mb-4">Student Resources</h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto mb-6">
            Everything you need as a TIMS student — study materials, exam schedules, results, news, and support.
          </p>
          <div className="flex items-center justify-center gap-2 text-gray-500 text-sm mb-10">
            <Link href="/" className="text-gray-500 hover:text-[#CC2229] transition-colors">Home</Link>
            <span>/</span>
            <span className="text-accent">Students Corner</span>
          </div>
          <div className="flex flex-wrap justify-center gap-8">
            {[
              { v: '9+', l: 'Partner Universities' },
              { v: '200+', l: 'Programs Available' },
              { v: '10,000+', l: 'Students Enrolled' },
              { v: '24/7', l: 'Online Resources' },
            ].map((s) => (
              <div key={s.l} className="text-center">
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

      {/* ── Tab nav ── */}
      <section className="bg-gray-50 sticky top-[72px] z-30 border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex overflow-x-auto gap-1 py-2 scrollbar-none">
            {tabs.map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`px-5 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all flex-shrink-0 ${
                  activeTab === tab
                    ? 'bg-primary-600 text-white shadow-md'
                    : 'text-gray-600 hover:text-primary-600 hover:bg-primary-50'
                }`}>
                {tab}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Tab content ── */}
      <section className="bg-gray-50 py-14 px-4">
        <div className="max-w-7xl mx-auto">

          {/* ── STUDY MATERIALS ── */}
          {activeTab === 'Study Materials' && (
            <div>
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-xl bg-primary-600 flex items-center justify-center">
                  <FiFolder className="text-white" size={18} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-primary-800 font-heading">Study Materials</h2>
                  <p className="text-gray-500 text-sm">Download PDFs, videos and resources by university</p>
                </div>
              </div>

              {loadingMaterials ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1,2,3].map(i => (
                    <div key={i} className="bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse">
                      <div className="h-20 bg-gray-200" />
                      <div className="p-5 space-y-3">
                        <div className="h-3 bg-gray-100 rounded w-3/4" />
                        <div className="h-3 bg-gray-100 rounded w-1/2" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : unisWithMaterials.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
                  <div className="text-5xl mb-4">📚</div>
                  <p className="text-gray-700 font-semibold mb-1">No study materials uploaded yet</p>
                  <p className="text-gray-400 text-sm">Materials will appear here once added by TIMS admin.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {unisWithMaterials.map(slug => {
                    const uniMats = materialsByUni[slug]
                    const uni = uniMap[slug]
                    const isOpen = expandedUni === slug
                    return (
                      <div key={slug} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                        {/* Header */}
                        <button
                          className="w-full flex items-center justify-between p-5 hover:bg-gray-50 transition-colors"
                          onClick={() => setExpandedUni(isOpen ? null : slug)}>
                          <div className="flex items-center gap-3">
                            {uni?.logo ? (
                              <img src={uni.logo} alt={uni.shortName} className="w-10 h-10 rounded-xl object-contain bg-gray-50 border border-gray-100 p-1 shrink-0" />
                            ) : (
                              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                                style={{ background: 'linear-gradient(135deg,#2B3488,#CC2229)' }}>
                                <span className="text-white font-bold text-sm">{(uni?.name || slug).charAt(0).toUpperCase()}</span>
                              </div>
                            )}
                            <div className="text-left">
                              <p className="font-bold text-gray-800 text-sm">{uni?.name || slug}</p>
                              <p className="text-xs text-gray-400">{uniMats.length} material{uniMats.length !== 1 ? 's' : ''} available</p>
                            </div>
                          </div>
                          <FiChevronDown size={16} className={`text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {/* Materials grouped by course */}
                        {isOpen && (
                          <div className="border-t border-gray-100">
                            {Object.entries(
                              uniMats.reduce<Record<string, StudyMaterial[]>>((acc, m) => {
                                const key = m.courseTitle || 'General'
                                if (!acc[key]) acc[key] = []
                                acc[key].push(m)
                                return acc
                              }, {})
                            ).map(([courseTitle, courseMats]) => (
                              <div key={courseTitle} className="border-b border-gray-50 last:border-0">
                                <div className="px-5 py-3 bg-gray-50 flex items-center gap-2">
                                  <FiBookOpen size={13} className="text-primary-600" />
                                  <span className="text-sm font-bold text-primary-700">{courseTitle}</span>
                                  <span className="text-xs text-gray-400 ml-auto">{courseMats.length} file{courseMats.length !== 1 ? 's' : ''}</span>
                                </div>
                                <div className="divide-y divide-gray-50">
                                  {courseMats.map(m => (
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
                                        <span className={`text-[11px] font-medium px-2 py-0.5 rounded-lg border ${typeBadge(m.type)}`}>
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
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}

              <div className="mt-8 bg-primary-50 rounded-2xl border border-primary-100 p-5 flex items-start gap-3">
                <FiAlertCircle className="text-primary-600 shrink-0 mt-0.5" size={18} />
                <p className="text-primary-700 text-sm">
                  Can't find your study material?{' '}
                  <Link href="/contact" className="font-bold underline hover:text-accent">Contact TIMS</Link>
                  {' '}and our team will assist you within 24 hours.
                </p>
              </div>
            </div>
          )}

          {/* ── EXAMINATIONS ── */}
          {activeTab === 'Examinations' && (
            <div>
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-xl bg-primary-600 flex items-center justify-center">
                  <FiCalendar className="text-white" size={18} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-primary-800 font-heading">Examination Details</h2>
                  <p className="text-gray-500 text-sm">Upcoming exam schedules, dates, and timetables</p>
                </div>
              </div>

              {loadingExams ? (
                <div className="space-y-4">
                  {[1,2,3].map(i => <div key={i} className="bg-white rounded-2xl h-24 animate-pulse border border-gray-100" />)}
                </div>
              ) : exams.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
                  <div className="text-5xl mb-4">📅</div>
                  <p className="text-gray-700 font-semibold mb-1">No examination details yet</p>
                  <p className="text-gray-400 text-sm">Exam schedules will appear here once published by TIMS.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {Object.entries(examsByUni).map(([slug, uniExams]) => {
                    const uni = uniMap[slug]
                    // Group by courseTitle
                    const courseGroups: Record<string, Examination[]> = {}
                    for (const e of uniExams) {
                      const key = e.courseTitle || 'General'
                      if (!courseGroups[key]) courseGroups[key] = []
                      courseGroups[key].push(e)
                    }
                    return (
                      <div key={slug} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                        {/* University header */}
                        <div className="flex items-center gap-3 p-5 border-b border-gray-100">
                          {uni?.logo ? (
                            <img src={uni.logo} alt={uni.shortName} className="w-10 h-10 rounded-xl object-contain bg-gray-50 border border-gray-100 p-1 shrink-0" />
                          ) : (
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                              style={{ background: 'linear-gradient(135deg,#2B3488,#CC2229)' }}>
                              <span className="text-white font-bold text-sm">{(uniExams[0].universityName || slug).charAt(0).toUpperCase()}</span>
                            </div>
                          )}
                          <div>
                            <h3 className="font-bold text-primary-800 font-heading text-base">{uniExams[0].universityName || uni?.name || slug}</h3>
                            <p className="text-xs text-gray-400">{uniExams.length} examination{uniExams.length !== 1 ? 's' : ''}</p>
                          </div>
                        </div>
                        {/* Courses */}
                        {Object.entries(courseGroups).map(([courseTitle, exams]) => (
                          <div key={courseTitle} className="border-b border-gray-50 last:border-0">
                            <div className="px-5 py-3 bg-gray-50 flex items-center gap-2">
                              <FiBookOpen size={13} className="text-primary-600 shrink-0" />
                              <span className="text-sm font-bold text-primary-700">{courseTitle}</span>
                            </div>
                            <div className="divide-y divide-gray-50">
                              {exams.map(e => (
                                <div key={e._id} className="p-5 hover:bg-gray-50 transition-colors">
                                  <div className="flex items-start justify-between gap-4 flex-wrap">
                                    <div className="flex-1 min-w-0">
                                      <h4 className="font-bold text-gray-800 text-sm mb-1">{e.title}</h4>
                                      {e.description && <p className="text-gray-500 text-sm mb-3">{e.description}</p>}
                                      <div className="flex flex-wrap gap-4 text-sm">
                                        {e.examDate && (
                                          <div className="flex items-center gap-2">
                                            <FiCalendar size={13} className="text-accent" />
                                            <span className="text-gray-700 font-medium">Exam: <span className="text-accent font-semibold">{e.examDate}</span></span>
                                          </div>
                                        )}
                                        {e.lastDate && (
                                          <div className="flex items-center gap-2">
                                            <FiCalendar size={13} className="text-primary-500" />
                                            <span className="text-gray-700 font-medium">Last Date: <span className="text-primary-600 font-semibold">{e.lastDate}</span></span>
                                          </div>
                                        )}
                                      </div>
                                      {e.instructions && (
                                        <p className="mt-3 text-xs text-gray-500 bg-amber-50 border border-amber-100 rounded-xl px-3 py-2 leading-relaxed">
                                          📌 {e.instructions}
                                        </p>
                                      )}
                                    </div>
                                    {e.scheduleUrl && (
                                      <a href={e.scheduleUrl} target="_blank" rel="noopener noreferrer"
                                        className="flex items-center gap-1.5 px-4 py-2 bg-primary-600 text-white text-sm font-semibold rounded-xl hover:bg-primary-700 transition-all shrink-0 self-start">
                                        <FiDownload size={13} /> Timetable
                                      </a>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )}

          {/* ── RESULTS ── */}
          {activeTab === 'Results' && (
            <div>
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-xl bg-primary-600 flex items-center justify-center">
                  <FiAward className="text-white" size={18} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-primary-800 font-heading">Results</h2>
                  <p className="text-gray-500 text-sm">Published examination results by university and semester</p>
                </div>
              </div>

              {loadingResults ? (
                <div className="space-y-4">
                  {[1,2,3].map(i => <div key={i} className="bg-white rounded-2xl h-20 animate-pulse border border-gray-100" />)}
                </div>
              ) : results.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
                  <div className="text-5xl mb-4">🏆</div>
                  <p className="text-gray-700 font-semibold mb-1">No results published yet</p>
                  <p className="text-gray-400 text-sm">Results will appear here once published by TIMS.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {Object.entries(resultsByUni).map(([slug, uniResults]) => {
                    const uni = uniMap[slug]
                    return (
                      <div key={slug}>
                        <UniGroupHeader slug={slug} name={uniResults[0].universityName || uni?.name || slug} logo={uni?.logo} />
                        <div className="space-y-3 mb-6">
                          {uniResults.map(r => (
                            <div key={r._id}
                              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center justify-between gap-4 hover:shadow-md transition-all">
                              <div className="flex-1 min-w-0">
                                <h3 className="font-bold text-primary-800 font-heading text-sm mb-1">{r.title}</h3>
                                {r.description && <p className="text-gray-500 text-xs mb-1">{r.description}</p>}
                                <div className="flex flex-wrap gap-3 text-xs text-gray-500">
                                  {r.semester && <span className="bg-primary-50 text-primary-600 px-2.5 py-0.5 rounded-lg font-medium border border-primary-100">{r.semester}</span>}
                                  {r.publishedDate && <span>Published: {r.publishedDate}</span>}
                                </div>
                              </div>
                              <a href={r.resultUrl} target="_blank" rel="noopener noreferrer"
                                className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-xl shrink-0 transition-all"
                                style={{ background: 'linear-gradient(135deg,#CC2229,#2B3488)', color: '#fff' }}>
                                <FiExternalLink size={13} /> View Result
                              </a>
                            </div>
                          ))}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )}

          {/* ── NEWS & UPDATES ── */}
          {activeTab === 'News & Updates' && (
            <div>
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-xl bg-primary-600 flex items-center justify-center">
                  <FiFileText className="text-white" size={18} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-primary-800 font-heading">News & Updates</h2>
                  <p className="text-gray-500 text-sm">Latest announcements, results, and updates from TIMS</p>
                </div>
              </div>
              <div className="space-y-4">
                {news.map((n, i) => (
                  <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all p-4 md:p-6 flex items-start gap-3 md:gap-5">
                    <div className="shrink-0 text-center">
                      <div className="w-14 h-14 rounded-xl bg-primary-50 border border-primary-100 flex flex-col items-center justify-center">
                        <span className="text-primary-800 font-bold text-xs font-heading">{n.date.split(' ')[0]}</span>
                        <span className="text-primary-600 font-semibold text-xs">{n.date.split(' ')[1]}</span>
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-xs font-bold px-2.5 py-0.5 bg-accent/10 text-accent rounded-lg border border-accent/20">{n.tag}</span>
                      </div>
                      <h3 className="font-bold text-primary-800 font-heading text-base mb-1.5">{n.headline}</h3>
                      <p className="text-gray-500 text-sm leading-relaxed">{n.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── FAQ ── */}
          {activeTab === 'FAQ' && (
            <div>
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-xl bg-primary-600 flex items-center justify-center">
                  <FiSearch className="text-white" size={18} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-primary-800 font-heading">Frequently Asked Questions</h2>
                  <p className="text-gray-500 text-sm">Answers to the questions students ask us most</p>
                </div>
              </div>
              <div className="max-w-3xl space-y-3">
                {faqs.map((faq, i) => (
                  <div key={i}
                    className={`rounded-2xl border transition-all overflow-hidden ${openFaq === i ? 'bg-primary-50 border-primary-200' : 'bg-white border-gray-100 shadow-sm'}`}>
                    <button className="w-full flex items-center justify-between p-5 text-left"
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                      <span className={`font-semibold text-sm ${openFaq === i ? 'text-primary-700' : 'text-primary-800'}`}>{faq.q}</span>
                      <span className={`text-primary-600 text-xl font-bold transition-transform shrink-0 ml-3 ${openFaq === i ? 'rotate-45' : ''}`}>+</span>
                    </button>
                    {openFaq === i && (
                      <div className="px-5 pb-5 text-gray-600 text-sm leading-relaxed border-t border-primary-100 pt-3">{faq.a}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </section>

      {/* ── Bottom CTA ── */}
      <section className="bg-white py-14 px-4">
        <div className="max-w-3xl mx-auto rounded-3xl p-6 md:p-10 text-center relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #CC2229 0%, #2B3488 100%)' }}>
          <div className="absolute inset-0 opacity-10"
            style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '25px 25px' }} />
          <div className="relative">
            <h2 className="text-2xl md:text-3xl font-bold text-white font-heading mb-3">Still Have Questions?</h2>
            <p className="text-white/80 mb-6">Our support team is available Mon–Sat, 9 AM–6 PM. Always happy to help.</p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/contact"
                className="inline-flex items-center gap-2 px-7 py-3 bg-white text-[#CC2229] font-bold rounded-xl hover:bg-gray-100 transition-all shadow-lg">
                Contact Us <FiArrowRight />
              </Link>
              <a href="tel:+917736111588"
                className="inline-flex items-center gap-2 px-7 py-3 bg-white/20 text-white font-semibold rounded-xl border-2 border-white/40 hover:bg-white/30 transition-all">
                Call Now
              </a>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}
