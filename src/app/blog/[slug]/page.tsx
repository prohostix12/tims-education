import Link from 'next/link'
import { notFound } from 'next/navigation'
import { FiArrowLeft, FiClock, FiCalendar, FiTag, FiArrowRight, FiCheckCircle } from 'react-icons/fi'
import { BLOG_POSTS } from '@/lib/data'

export function generateStaticParams() {
  return BLOG_POSTS.map((p) => ({ slug: p.slug }))
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const post = BLOG_POSTS.find((p) => p.slug === params.slug)
  if (!post) return { title: 'Article Not Found' }
  return { title: `${post.title} | TIMS Blog`, description: post.excerpt }
}

const categoryColor: Record<string, string> = {
  'Education Guide': 'bg-blue-50 text-blue-700 border-blue-200',
  'University Spotlight': 'bg-purple-50 text-purple-700 border-purple-200',
  'Student Tips': 'bg-green-50 text-green-700 border-green-200',
  'Career Tips': 'bg-orange-50 text-orange-700 border-orange-200',
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = BLOG_POSTS.find((p) => p.slug === params.slug)
  if (!post) notFound()

  const related = BLOG_POSTS.filter((p) => p.slug !== post.slug && p.category === post.category).slice(0, 3)
  const more = related.length < 3
    ? [...related, ...BLOG_POSTS.filter((p) => p.slug !== post.slug && p.category !== post.category).slice(0, 3 - related.length)]
    : related

  const paragraphs = post.content.split('\n\n').filter(Boolean)

  return (
    <div className="pt-24">

      {/* ── Hero Banner ── */}
      <section className="bg-hero-gradient min-h-[70vh] flex items-center px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
        <div className="absolute bottom-0 right-0 w-72 h-72 bg-accent/10 rounded-full translate-x-20 translate-y-20 blur-3xl" />

        <div className="relative max-w-4xl mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-white/60 text-sm mb-6">
            <Link href="/" className="hover:text-accent transition-colors">Home</Link>
            <span>/</span>
            <Link href="/blog" className="hover:text-accent transition-colors">Blog</Link>
            <span>/</span>
            <span className="text-accent line-clamp-1">{post.title}</span>
          </div>

          <div className="flex items-center gap-3 mb-5">
            <span className={`text-xs font-bold px-3 py-1 rounded-full border ${categoryColor[post.category] || 'bg-white/10 text-white border-white/20'}`}>
              {post.category}
            </span>
            {post.featured && (
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-accent text-white">
                Featured
              </span>
            )}
          </div>

          <div className="text-6xl mb-4">{post.icon}</div>
          <h1 className="text-3xl md:text-4xl font-bold text-white font-heading leading-snug mb-4">
            {post.title}
          </h1>
          <p className="text-white/70 text-lg mb-6 leading-relaxed">{post.excerpt}</p>

          <div className="flex flex-wrap items-center gap-5 text-white/60 text-sm">
            <span className="flex items-center gap-1.5">
              <span className="w-7 h-7 rounded-full bg-accent flex items-center justify-center text-white text-xs font-bold">T</span>
              {post.author}
            </span>
            <span className="flex items-center gap-1.5">
              <FiCalendar size={14} />
              {new Date(post.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
            </span>
            <span className="flex items-center gap-1.5">
              <FiClock size={14} /> {post.readTime}
            </span>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 50" fill="none"><path d="M0,25 C360,50 1080,0 1440,25 L1440,50 L0,50 Z" fill="#f8fafc" /></svg>
        </div>
      </section>

      {/* ── Content + Sidebar ── */}
      <section className="bg-gray-50 py-14 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

            {/* Article body */}
            <article className="lg:col-span-2">
              <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 md:p-10">

                {/* Back button */}
                <Link href="/blog"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-primary-600 hover:text-accent transition-colors mb-8">
                  <FiArrowLeft size={15} /> Back to Blog
                </Link>

                {/* Article content */}
                <div className="prose prose-sm max-w-none">
                  {paragraphs.map((para, i) => {
                    const isList = para.trim().match(/^(\d+\.|-)/)
                    if (isList) {
                      const lines = para.split('\n').filter(Boolean)
                      return (
                        <ul key={i} className="space-y-2 my-5">
                          {lines.map((line, j) => {
                            const text = line.replace(/^(\d+\.|-)?\s*/, '')
                            return (
                              <li key={j} className="flex items-start gap-2.5 text-gray-700 text-sm leading-relaxed">
                                <FiCheckCircle className="text-primary-600 shrink-0 mt-0.5" size={15} />
                                <span>{text}</span>
                              </li>
                            )
                          })}
                        </ul>
                      )
                    }
                    const isHeading = para.trim().startsWith('##') || (para.length < 80 && !para.includes('.') && i !== 0)
                    if (isHeading) {
                      return (
                        <h2 key={i} className="text-primary-800 font-bold font-heading text-xl mt-7 mb-3">
                          {para.replace(/^#+\s*/, '')}
                        </h2>
                      )
                    }
                    return (
                      <p key={i} className="text-gray-700 text-base leading-relaxed mb-4">
                        {para}
                      </p>
                    )
                  })}
                </div>

                {/* Tags */}
                <div className="mt-10 pt-6 border-t border-gray-100">
                  <div className="flex flex-wrap items-center gap-2">
                    <FiTag className="text-gray-400" size={14} />
                    {post.tags.map((tag) => (
                      <span key={tag}
                        className="px-3 py-1 bg-primary-50 text-primary-700 text-xs font-semibold rounded-lg border border-primary-100 hover:bg-primary-600 hover:text-white transition-all cursor-pointer">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Author card */}
                <div className="mt-8 bg-gray-50 rounded-2xl p-5 border border-gray-100 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-hero-gradient flex items-center justify-center text-white font-bold text-lg font-heading shrink-0">
                    T
                  </div>
                  <div>
                    <p className="font-bold text-primary-800 text-sm">{post.author}</p>
                    <p className="text-gray-500 text-xs mt-0.5">Education counselling team at TIMS — helping students find the right program since 2009.</p>
                  </div>
                </div>
              </div>

              {/* CTA box */}
              <div className="mt-6 bg-hero-gradient rounded-3xl p-8 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10"
                  style={{ backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
                <div className="relative flex flex-col md:flex-row items-center gap-6">
                  <div className="flex-1">
                    <h3 className="text-white font-bold font-heading text-xl mb-2">Ready to take the next step?</h3>
                    <p className="text-white/70 text-sm">Talk to a TIMS counsellor — free, no pressure, personalised guidance for your goals.</p>
                  </div>
                  <div className="flex gap-3 shrink-0">
                    <Link href="/contact"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-white font-bold rounded-xl hover:bg-accent-dark transition-all shadow-md text-sm">
                      Get Free Guidance <FiArrowRight size={14} />
                    </Link>
                    <Link href="/courses"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-white/15 text-white font-semibold rounded-xl border border-white/30 hover:bg-white/25 transition-all text-sm">
                      Browse Courses
                    </Link>
                  </div>
                </div>
              </div>
            </article>

            {/* Sidebar */}
            <aside className="space-y-6">

              {/* Category badge */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h4 className="font-bold text-primary-800 font-heading text-sm mb-3">Article Category</h4>
                <span className={`text-sm font-semibold px-4 py-2 rounded-xl border ${categoryColor[post.category] || 'bg-gray-50 text-gray-600 border-gray-200'}`}>
                  {post.category}
                </span>
                <div className="mt-4 pt-4 border-t border-gray-100 space-y-1.5 text-sm text-gray-500">
                  <div className="flex items-center gap-2"><FiCalendar size={13} className="text-accent" />
                    {new Date(post.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </div>
                  <div className="flex items-center gap-2"><FiClock size={13} className="text-accent" /> {post.readTime}</div>
                </div>
              </div>

              {/* Related articles */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h4 className="font-bold text-primary-800 font-heading text-sm mb-4">Related Articles</h4>
                <div className="space-y-4">
                  {more.map((p) => (
                    <Link key={p.slug} href={`/blog/${p.slug}`}
                      className="flex items-start gap-3 group">
                      <span className="text-2xl shrink-0">{p.icon}</span>
                      <div>
                        <p className="text-gray-700 text-sm font-medium group-hover:text-primary-600 transition-colors leading-snug line-clamp-2">
                          {p.title}
                        </p>
                        <p className="text-gray-400 text-xs mt-1">{p.readTime}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Popular tags */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h4 className="font-bold text-primary-800 font-heading text-sm mb-3">Tags</h4>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span key={tag}
                      className="px-3 py-1 bg-primary-50 text-primary-700 text-xs font-semibold rounded-lg border border-primary-100 hover:bg-primary-600 hover:text-white transition-all cursor-pointer">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Quick links */}
              <div className="bg-hero-gradient rounded-2xl p-6 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10"
                  style={{ backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
                <div className="relative">
                  <h4 className="font-bold text-white font-heading text-sm mb-1">Need Guidance?</h4>
                  <p className="text-white/70 text-xs mb-4">Our counsellors are available Mon–Sat, 9 AM–6 PM.</p>
                  <Link href="/contact"
                    className="w-full flex items-center justify-center gap-2 py-2.5 bg-accent text-white font-bold text-sm rounded-xl hover:bg-accent-dark transition-all shadow-md">
                    Talk to a Counsellor <FiArrowRight size={13} />
                  </Link>
                </div>
              </div>

            </aside>
          </div>
        </div>
      </section>

      {/* ── More articles ── */}
      <section className="bg-white py-14 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold text-primary-800 font-heading mb-8 text-center">More Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {more.map((p) => (
              <Link key={p.slug} href={`/blog/${p.slug}`}
                className="group bg-gray-50 rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all">
                <div className="bg-hero-gradient p-5 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-accent/10 rounded-full translate-x-6 -translate-y-6" />
                  <div className="relative">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-lg border ${categoryColor[p.category] || 'bg-white/10 text-white border-white/20'}`}>
                      {p.category}
                    </span>
                    <div className="text-3xl mt-3 mb-2">{p.icon}</div>
                    <h3 className="text-white font-bold font-heading text-sm leading-snug line-clamp-2 group-hover:text-accent transition-colors">
                      {p.title}
                    </h3>
                  </div>
                </div>
                <div className="p-5">
                  <p className="text-gray-500 text-sm leading-relaxed line-clamp-2 mb-3">{p.excerpt}</p>
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <span className="flex items-center gap-1"><FiClock size={11} /> {p.readTime}</span>
                    <span className="text-primary-600 font-semibold group-hover:text-accent transition-colors flex items-center gap-1">
                      Read <FiArrowRight size={11} />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link href="/blog"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-hero-gradient text-white font-bold rounded-xl hover:opacity-90 transition-all shadow-md">
              View All Articles <FiArrowRight />
            </Link>
          </div>
        </div>
      </section>

    </div>
  )
}
