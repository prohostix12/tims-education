'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { FiArrowRight, FiCalendar, FiUser, FiClock, FiTag, FiSearch } from 'react-icons/fi'

type BlogPost = {
  _id: string; slug: string; title: string; excerpt: string; content: string
  author: string; category: string; tags: string[]; image?: string
  icon: string; date: string; readTime: string; featured: boolean; published: boolean
}

const categories = ['All', 'Education Guide', 'University Spotlight', 'Student Tips', 'Career Tips']

const categoryColors: Record<string, string> = {
  'Education Guide':    'bg-blue-100 text-blue-700 border-blue-200',
  'University Spotlight': 'bg-primary-100 text-primary-700 border-primary-200',
  'Student Tips':       'bg-green-100 text-green-700 border-green-200',
  'Career Tips':        'bg-accent/10 text-accent border-accent/20',
}

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState('All')
  const [search, setSearch] = useState('')
  const [subEmail, setSubEmail] = useState('')
  const [subStatus, setSubStatus] = useState<'idle' | 'saving' | 'done' | 'error'>('idle')

  useEffect(() => {
    fetch('/api/blogs')
      .then(r => r.json())
      .then(d => { setPosts(Array.isArray(d) ? d : []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const subscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!subEmail) return
    setSubStatus('saving')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: subEmail,
          email: subEmail,
          source: 'Newsletter',
          course: 'Newsletter',
          message: 'Newsletter subscription from blog page.',
        }),
      })
      setSubStatus(res.ok ? 'done' : 'error')
    } catch {
      setSubStatus('error')
    }
  }

  const featured = posts.find((p) => p.featured)
  const filtered  = posts.filter((p) => {
    const matchCat  = activeCategory === 'All' || p.category === activeCategory
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase()) ||
                        p.excerpt.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch && !p.featured
  })

  const recent = posts.filter((p) => !p.featured).slice(0, 4)

  return (
    <div className="">

      {/* ── Hero ── */}
      <section className="bg-gray-50 min-h-[90vh] flex items-center px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-50"
          style={{ backgroundImage: 'radial-gradient(circle, #cbd5e1 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
        <div className="absolute top-0 right-0 w-72 h-72 bg-primary-100 rounded-full translate-x-24 -translate-y-24 blur-3xl" />
        <div className="relative max-w-7xl mx-auto text-center">
          <p className="text-accent font-semibold text-sm uppercase tracking-widest mb-3">Knowledge Hub</p>
          <h1 className="text-3xl md:text-5xl font-bold text-gray-900 font-heading mb-4">Blog & Articles</h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto mb-8">
            Expert insights on online education, career growth, university choices, and student success — written by the TIMS team.
          </p>

          {/* Search */}
          <div className="max-w-md mx-auto relative">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={17} />
            <input type="text" placeholder="Search articles…" value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3.5 rounded-xl text-sm text-gray-800 bg-white shadow-lg focus:outline-none focus:ring-2 focus:ring-accent" />
          </div>

          {/* Breadcrumb */}
          <div className="flex items-center justify-center gap-2 mt-5 text-gray-500 text-sm">
            <Link href="/" className="text-gray-500 hover:text-[#CC2229] transition-colors">Home</Link>
            <span>/</span>
            <span className="text-accent">Blog</span>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 50" fill="none"><path d="M0,25 C360,50 1080,0 1440,25 L1440,50 L0,50 Z" fill="white" /></svg>
        </div>
      </section>

      {/* ── Stats bar ── */}
      <section className="bg-white border-b border-gray-100 py-5 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-center gap-8">
          {[
            { v: loading ? '…' : `${posts.length}`, l: 'Articles Published' },
            { v: `${categories.length - 1}`, l: 'Categories' },
            { v: 'Weekly', l: 'New Posts' },
            { v: 'Free', l: 'Always' },
          ].map((s) => (
            <div key={s.l} className="text-center">
              <p className="text-lg font-bold text-primary-700 font-heading">{s.v}</p>
              <p className="text-xs text-gray-400">{s.l}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-gray-50 py-14 px-4">
        <div className="max-w-7xl mx-auto">

          {/* ── Featured Post ── */}
          {!search && activeCategory === 'All' && featured && (
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-5">
                <div className="h-px flex-1 bg-gray-200" />
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Featured Article</span>
                <div className="h-px flex-1 bg-gray-200" />
              </div>
              <Link href={`/blog/${featured.slug}`}>
                <article className="group bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-xl transition-all">
                  <div className="grid md:grid-cols-5 gap-0">
                    {/* Left — visual */}
                    <div className="md:col-span-2 bg-hero-gradient p-6 md:p-10 flex flex-col justify-between relative overflow-hidden min-h-[180px] md:min-h-[260px]">
                      <div className="absolute inset-0 opacity-50"
                        style={{ backgroundImage: 'radial-gradient(circle, #cbd5e1 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
                      <div className="absolute bottom-0 right-0 w-40 h-40 bg-accent/20 rounded-full translate-x-12 translate-y-12 blur-2xl" />
                      <div className="relative">
                        <span className="inline-block px-3 py-1 bg-accent text-white text-xs font-bold rounded-full mb-4">Featured</span>
                        <div className="text-7xl mb-2">{featured.icon}</div>
                      </div>
                      <div className="relative">
                        <span className={`inline-block text-xs font-semibold px-3 py-1.5 rounded-lg border ${categoryColors[featured.category] || 'bg-gray-100 text-gray-600'}`}>
                          {featured.category}
                        </span>
                      </div>
                    </div>

                    {/* Right — content */}
                    <div className="md:col-span-3 p-5 md:p-8 flex flex-col justify-between">
                      <div>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {featured.tags.map((t) => (
                            <span key={t} className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-lg">#{t}</span>
                          ))}
                        </div>
                        <h2 className="text-2xl font-bold text-primary-800 font-heading leading-snug mb-3 group-hover:text-accent transition-colors">
                          {featured.title}
                        </h2>
                        <p className="text-gray-500 text-sm leading-relaxed mb-5">{featured.excerpt}</p>
                      </div>
                      <div className="flex items-center justify-between flex-wrap gap-3">
                        <div className="flex items-center gap-4 text-xs text-gray-400">
                          <span className="flex items-center gap-1.5"><FiUser size={12} /> {featured.author}</span>
                          <span className="flex items-center gap-1.5"><FiCalendar size={12} /> {featured.date}</span>
                          <span className="flex items-center gap-1.5"><FiClock size={12} /> {featured.readTime}</span>
                        </div>
                        <span className="inline-flex items-center gap-1.5 text-sm font-bold text-accent group-hover:gap-3 transition-all">
                          Read Article <FiArrowRight size={15} />
                        </span>
                      </div>
                    </div>
                  </div>
                </article>
              </Link>
            </div>
          )}

          {/* ── Category filter ── */}
          <div className="flex flex-wrap gap-2 mb-8">
            {categories.map((cat) => (
              <button key={cat} onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all border ${activeCategory === cat
                  ? 'bg-primary-600 text-white border-primary-600 shadow-md'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-primary-400 hover:text-primary-600'}`}>
                {cat}
              </button>
            ))}
          </div>

          {/* ── Main grid + Sidebar ── */}
          <div className="grid lg:grid-cols-3 gap-8">

            {/* Article grid */}
            <div className="lg:col-span-2">
              {loading ? (
                <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
                  <p className="text-gray-400">Loading articles…</p>
                </div>
              ) : filtered.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
                  <span className="text-5xl mb-3 block">🔍</span>
                  <p className="text-gray-500">No articles match your search.</p>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 gap-6">
                  {filtered.map((post) => (
                    <Link key={post.slug} href={`/blog/${post.slug}`}>
                      <article className="group bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all h-full flex flex-col">
                        {/* Top */}
                        <div className="bg-hero-gradient p-6 flex items-center justify-between">
                          <span className="text-4xl">{post.icon}</span>
                          <span className={`text-xs font-bold px-2.5 py-1 rounded-lg border ${categoryColors[post.category] || 'bg-gray-100 text-gray-600'}`}>
                            {post.category}
                          </span>
                        </div>

                        {/* Body */}
                        <div className="p-5 flex flex-col flex-1">
                          <h3 className="font-bold text-primary-800 font-heading text-sm leading-snug mb-2 group-hover:text-accent transition-colors">
                            {post.title}
                          </h3>
                          <p className="text-gray-500 text-xs leading-relaxed mb-4 flex-1">{post.excerpt}</p>

                          <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-gray-400 mb-3">
                            <span className="flex items-center gap-1"><FiCalendar size={10} /> {post.date}</span>
                            <span className="flex items-center gap-1"><FiClock size={10} /> {post.readTime}</span>
                          </div>

                          <span className="inline-flex items-center gap-1 text-xs font-bold text-primary-600 group-hover:text-accent group-hover:gap-2 transition-all">
                            Read More <FiArrowRight size={12} />
                          </span>
                        </div>
                      </article>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">

              {/* Recent posts */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h3 className="font-bold text-primary-800 font-heading mb-5 flex items-center gap-2">
                  <span className="w-1.5 h-5 bg-accent rounded-full inline-block" /> Recent Articles
                </h3>
                <div className="space-y-4">
                  {recent.map((post) => (
                    <Link key={post.slug} href={`/blog/${post.slug}`}
                      className="flex items-start gap-3 group">
                      <div className="w-10 h-10 rounded-xl bg-hero-gradient flex items-center justify-center text-xl shrink-0">
                        {post.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-primary-800 font-semibold text-xs leading-snug group-hover:text-accent transition-colors line-clamp-2">
                          {post.title}
                        </p>
                        <p className="text-gray-400 text-[10px] mt-0.5 flex items-center gap-1">
                          <FiClock size={9} /> {post.readTime}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Categories */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h3 className="font-bold text-primary-800 font-heading mb-5 flex items-center gap-2">
                  <span className="w-1.5 h-5 bg-primary-600 rounded-full inline-block" /> Categories
                </h3>
                <div className="space-y-2">
                  {categories.slice(1).map((cat) => {
                    const count = posts.filter((p) => p.category === cat).length
                    return (
                      <button key={cat} onClick={() => setActiveCategory(cat)}
                        className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm text-gray-600 hover:bg-primary-50 hover:text-primary-700 transition-all group">
                        <span className="flex items-center gap-2">
                          <FiTag size={13} className="text-gray-400 group-hover:text-primary-600" /> {cat}
                        </span>
                        <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full group-hover:bg-primary-100 group-hover:text-primary-700">
                          {count}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* CTA box */}
              <div className="bg-hero-gradient rounded-2xl p-6 relative overflow-hidden">
                <div className="absolute inset-0 opacity-50"
                  style={{ backgroundImage: 'radial-gradient(circle, #cbd5e1 1px, transparent 1px)', backgroundSize: '18px 18px' }} />
                <div className="relative">
                  <p className="text-accent font-bold text-sm mb-2">Free Counselling</p>
                  <h3 className="text-white font-bold font-heading text-base mb-3">Need guidance on the right program?</h3>
                  <p className="text-gray-600 text-xs mb-4 leading-relaxed">Talk to a TIMS counsellor for free. No pressure, no commitment.</p>
                  <Link href="/contact"
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-accent text-white font-bold rounded-xl hover:bg-accent-dark transition-all text-sm w-full justify-center">
                    Talk to Us <FiArrowRight size={14} />
                  </Link>
                </div>
              </div>

              {/* Tags cloud */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h3 className="font-bold text-primary-800 font-heading mb-4 flex items-center gap-2">
                  <span className="w-1.5 h-5 bg-accent rounded-full inline-block" /> Popular Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {Array.from(new Set(posts.flatMap((p) => p.tags))).map((tag) => (
                    <span key={tag} className="px-3 py-1.5 bg-gray-50 text-gray-600 text-xs rounded-lg border border-gray-100 hover:bg-primary-50 hover:text-primary-700 hover:border-primary-200 cursor-pointer transition-all">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Newsletter ── */}
      <section className="bg-white py-14 px-4">
        <div className="max-w-2xl mx-auto rounded-3xl p-6 md:p-10 text-center relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #CC2229 0%, #2B3488 100%)' }}>
          <div className="absolute inset-0 opacity-10"
            style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
          <div className="relative">
            <p className="text-white/70 font-semibold text-sm uppercase tracking-widest mb-2">Stay Informed</p>
            <h2 className="text-2xl md:text-3xl font-bold text-white font-heading mb-2">Subscribe to Our Newsletter</h2>
            <p className="text-white/80 mb-6 text-sm">Admission alerts, education news, and career tips — delivered weekly.</p>
            {subStatus === 'done' ? (
              <div className="max-w-sm mx-auto bg-white/20 rounded-xl px-6 py-4 text-white font-semibold text-sm">
                ✅ You&apos;re subscribed! We&apos;ll keep you updated.
              </div>
            ) : (
              <form className="flex flex-col sm:flex-row gap-3 max-w-sm mx-auto" onSubmit={subscribe}>
                <input type="email" required placeholder="your@email.com"
                  value={subEmail} onChange={e => setSubEmail(e.target.value)}
                  className="flex-1 px-4 py-3 rounded-xl text-sm text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-white/50" />
                <button type="submit" disabled={subStatus === 'saving'}
                  className="px-5 py-3 bg-white text-[#CC2229] font-bold rounded-xl hover:bg-gray-100 transition-all text-sm shrink-0 disabled:opacity-70">
                  {subStatus === 'saving' ? '…' : 'Subscribe'}
                </button>
              </form>
            )}
            {subStatus === 'error' && <p className="text-red-200 text-xs mt-2">Something went wrong. Please try again.</p>}
            <p className="text-white/50 text-xs mt-3">No spam. Unsubscribe anytime.</p>
          </div>
        </div>
      </section>
    </div>
  )
}
