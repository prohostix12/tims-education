'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  FiDownload, FiArrowRight, FiExternalLink,
  FiBookOpen, FiChevronDown, FiFileText, FiAlertCircle, FiSearch,
  FiLoader,
} from 'react-icons/fi'

const tabs = ['Syllabus', 'News & Updates', 'FAQ'] as const
type Tab = typeof tabs[number]

interface University {
  slug: string
  name: string
  shortName: string
  logo?: string
  website?: string
}

interface Course {
  _id: string
  slug: string
  title: string
  icon: string
  category: string
  syllabusUrl?: string
}

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

/* ── Syllabus tab: one university card ── */
function UniversityCard({ uni, allCourses }: { uni: University; allCourses: Course[] }) {
  const [expanded, setExpanded] = useState(false)

  // courses that belong to this university
  const courses = allCourses.filter((c) => {
    // courses were seeded with uni slugs in the universities[] array
    // We match by checking if this course has this uni slug
    return true // filtering happens in parent via the pre-grouped map
  })

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all overflow-hidden">
      {/* Header */}
      <div className="bg-hero-gradient p-5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-20 h-20 bg-white/5 rounded-full translate-x-6 -translate-y-6" />
        <div className="relative flex items-center gap-3">
          {uni.logo ? (
            <img src={uni.logo} alt={uni.shortName}
              className="w-12 h-12 rounded-xl object-contain bg-gray-100 border border-gray-100 p-1 shrink-0" />
          ) : (
            <div className="w-12 h-12 rounded-xl bg-gray-100 border border-gray-100 flex items-center justify-center shrink-0">
              <span className="text-white font-extrabold text-xl font-heading">{uni.shortName?.charAt(0)}</span>
            </div>
          )}
          <div>
            <p className="text-gray-500 text-xs font-medium">{uni.shortName}</p>
            <h3 className="text-white font-bold font-heading text-sm leading-snug">{uni.name}</h3>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="p-5">
        {/* Course count */}
        <p className="text-xs text-gray-500 mb-4">
          {courses.length > 0
            ? `${courses.length} course${courses.length !== 1 ? 's' : ''} available`
            : 'Courses coming soon'}
        </p>

        {/* Expand toggle */}
        {courses.length > 0 && (
          <div className="border-t border-gray-100 pt-4">
            <button
              onClick={() => setExpanded(!expanded)}
              className="w-full flex items-center justify-between text-xs font-bold text-primary-700 hover:text-accent transition-colors">
              <span className="flex items-center gap-1.5">
                <FiDownload size={12} /> Download Syllabus PDFs
              </span>
              <FiChevronDown size={13} className={`transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`} />
            </button>

            {expanded && (
              <div className="mt-3 space-y-2">
                {courses.map((c) => (
                  <div key={c._id}
                    className="flex items-center justify-between gap-2 px-3 py-2.5 bg-gray-50 border border-gray-100 rounded-xl">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-base shrink-0">{c.icon}</span>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-gray-800 truncate">{c.title}</p>
                        <p className="text-[10px] text-gray-400">{c.category}</p>
                      </div>
                    </div>
                    {c.syllabusUrl ? (
                      <a href={c.syllabusUrl} target="_blank" rel="noreferrer"
                        className="flex items-center gap-1 px-3 py-1.5 bg-primary-600 text-white text-xs font-semibold rounded-lg hover:bg-primary-700 transition-all shrink-0">
                        <FiDownload size={10} /> Syllabus
                      </a>
                    ) : (
                      <span className="px-3 py-1.5 bg-gray-100 text-gray-400 text-xs rounded-lg shrink-0">
                        Coming Soon
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Visit portal */}
        {uni.website && (
          <a href={uni.website.startsWith('http') ? uni.website : `https://${uni.website}`}
            target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-accent hover:text-accent-dark transition-colors mt-4 block">
            Visit University Portal <FiExternalLink size={12} />
          </a>
        )}
      </div>
    </div>
  )
}

export default function StudentsPage() {
  const [activeTab, setActiveTab]     = useState<Tab>('Syllabus')
  const [openFaq, setOpenFaq]         = useState<number | null>(null)
  const [universities, setUniversities] = useState<University[]>([])
  const [allCourses, setAllCourses]   = useState<Course[]>([])
  const [loadingSyllabus, setLoadingSyllabus] = useState(true)

  // grouped: uniSlug → Course[]
  const coursesByUni: Record<string, Course[]> = {}
  for (const c of allCourses) {
    // courses have a universities field (array of slugs)
    const uniSlugs: string[] = (c as any).universities ?? []
    for (const slug of uniSlugs) {
      if (!coursesByUni[slug]) coursesByUni[slug] = []
      coursesByUni[slug].push(c)
    }
  }

  useEffect(() => {
    if (activeTab !== 'Syllabus') return
    Promise.all([
      fetch('/api/universities').then((r) => r.json()).catch(() => []),
      fetch('/api/courses/all').then((r) => r.json()).catch(() => []),
    ]).then(([unis, courses]) => {
      setUniversities(Array.isArray(unis) ? unis : [])
      setAllCourses(Array.isArray(courses) ? courses : [])
      setLoadingSyllabus(false)
    })
  }, [activeTab])

  return (
    <div className="pt-24">

      {/* ── Hero ── */}
      <section className="bg-[#f7f7f5] min-h-[90vh] flex items-center px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-50"
          style={{ backgroundImage: 'radial-gradient(circle, #cbd5e1 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
        <div className="absolute top-0 right-0 w-72 h-72 bg-primary-100 rounded-full translate-x-24 -translate-y-24 blur-3xl" />

        <div className="relative max-w-7xl mx-auto text-center">
          <p className="text-accent font-semibold text-sm uppercase tracking-widest mb-3">Students Corner</p>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 font-heading mb-4">Student Resources</h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto mb-6">
            Everything you need as a TIMS student — syllabus, results, timetables, downloads, latest news, and support.
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

          {/* ── SYLLABUS TAB ── */}
          {activeTab === 'Syllabus' && (
            <div>
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-xl bg-primary-600 flex items-center justify-center">
                  <FiBookOpen className="text-white" size={18} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-primary-800 font-heading">Syllabus by University</h2>
                  <p className="text-gray-500 text-sm">Click "Download Syllabus PDFs" under any university to view courses and download</p>
                </div>
              </div>

              {loadingSyllabus ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1,2,3,4,5,6].map((i) => (
                    <div key={i} className="bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse">
                      <div className="h-24 bg-gray-200" />
                      <div className="p-5 space-y-3">
                        <div className="h-3 bg-gray-100 rounded w-3/4" />
                        <div className="h-3 bg-gray-100 rounded w-1/2" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : universities.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
                  <div className="text-5xl mb-3">🏛️</div>
                  <p className="text-gray-500 text-sm">No universities found. Please check back later.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {universities.map((uni) => (
                    <UniversityCard
                      key={uni.slug}
                      uni={uni}
                      allCourses={coursesByUni[uni.slug] ?? []}
                    />
                  ))}
                </div>
              )}

              <div className="mt-8 bg-primary-50 rounded-2xl border border-primary-100 p-5 flex items-start gap-3">
                <FiAlertCircle className="text-primary-600 shrink-0 mt-0.5" size={18} />
                <p className="text-primary-700 text-sm">
                  Can't find your syllabus?{' '}
                  <Link href="/contact" className="font-bold underline hover:text-accent">Contact TIMS</Link>
                  {' '}and our team will send you the exact syllabus PDF within 24 hours.
                </p>
              </div>
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
                  <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all p-6 flex items-start gap-5">
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
        <div className="max-w-3xl mx-auto rounded-3xl p-10 text-center relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #CC2229 0%, #2B3488 100%)' }}>
          <div className="absolute inset-0 opacity-10"
            style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '25px 25px' }} />
          <div className="relative">
            <h2 className="text-2xl md:text-3xl font-bold text-white font-heading mb-3">Still Have Questions?</h2>
            <p className="text-white/80 mb-6">Our support team is available Mon–Sat, 9 AM–6 PM. Always happy to help.</p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/contact"
                className="inline-flex items-center gap-2 px-7 py-3 bg-accent text-white font-bold rounded-xl hover:bg-accent-dark transition-all shadow-lg">
                Contact Us <FiArrowRight />
              </Link>
              <a href="tel:+917736111588"
                className="inline-flex items-center gap-2 px-7 py-3 bg-white text-gray-700 font-semibold rounded-xl border-2 border-gray-300 hover:bg-gray-50 transition-all">
                Call Now
              </a>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}
