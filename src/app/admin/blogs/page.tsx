'use client'
import { useEffect, useState } from 'react'
import { FiPlus, FiEdit2, FiX, FiSave, FiSearch, FiEye, FiEyeOff } from 'react-icons/fi'

interface BlogPost {
  _id?: string
  slug: string
  title: string
  excerpt: string
  content: string
  author: string
  category: string
  tags: string
  image: string
  published: boolean
}

const empty: BlogPost = {
  slug: '', title: '', excerpt: '', content: '',
  author: 'TIMS Team', category: '', tags: '', image: '', published: false,
}

export default function AdminBlogs() {
  const [list, setList] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [modal, setModal] = useState(false)
  const [editing, setEditing] = useState<BlogPost>(empty)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')

  const load = () => {
    fetch('/api/admin/blogs')
      .then((r) => r.json())
      .then((d) => { setList(Array.isArray(d) ? d : []); setLoading(false) })
      .catch(() => setLoading(false))
  }

  useEffect(() => {
    load()
    const params = new URLSearchParams(window.location.search)
    if (params.get('new') === '1') openNew()
  }, [])

  const openNew = () => { setEditing(empty); setModal(true); setMsg('') }
  const openEdit = (b: BlogPost) => {
    setEditing({
      ...b,
      tags: (b.tags as unknown as string[])?.join(', ') ?? '',
    })
    setModal(true)
    setMsg('')
  }

  const slugify = (text: string) =>
    text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

  const handleTitleChange = (v: string) => {
    setEditing((p) => ({
      ...p,
      title: v,
      slug: p._id ? p.slug : slugify(v),
    }))
  }

  const handleSave = async () => {
    setSaving(true)
    setMsg('')
    const payload = {
      ...editing,
      tags: editing.tags.split(',').map((s) => s.trim()).filter(Boolean),
    }
    const res = await fetch('/api/admin/blogs', {
      method: editing._id ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    if (res.ok) {
      setMsg(editing._id ? 'Blog updated!' : 'Blog post created!')
      load()
      setTimeout(() => { setModal(false); setMsg('') }, 1200)
    } else {
      const err = await res.json()
      setMsg(err.message || 'Error saving. Check required fields.')
    }
    setSaving(false)
  }

  const filtered = list.filter((b) =>
    b.title?.toLowerCase().includes(search.toLowerCase()) ||
    b.category?.toLowerCase().includes(search.toLowerCase())
  )

  const formatDate = (d: unknown) => {
    if (!d) return ''
    return new Date(d as string).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-xl font-bold text-gray-800 font-heading">Blog Posts</h1>
          <p className="text-gray-500 text-sm">{list.length} posts in database</p>
        </div>
        <button onClick={openNew}
          className="flex items-center gap-2 px-4 py-2.5 bg-primary-600 text-white text-sm font-semibold rounded-xl hover:bg-primary-700 transition-all shadow-sm">
          <FiPlus size={16} /> New Post
        </button>
      </div>

      <div className="relative">
        <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
        <input value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="Search posts..."
          className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100" />
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-400 text-sm">Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="p-8 text-center text-gray-400 text-sm">
            {list.length === 0 ? 'No blog posts yet. Click "New Post" to create one.' : 'No results found.'}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left px-5 py-3 font-semibold text-gray-600">Title</th>
                  <th className="text-left px-5 py-3 font-semibold text-gray-600">Category</th>
                  <th className="text-left px-5 py-3 font-semibold text-gray-600">Author</th>
                  <th className="text-left px-5 py-3 font-semibold text-gray-600">Date</th>
                  <th className="text-left px-5 py-3 font-semibold text-gray-600">Status</th>
                  <th className="text-left px-5 py-3 font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((b) => (
                  <tr key={b._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3.5">
                      <p className="font-medium text-gray-800 max-w-xs truncate">{b.title}</p>
                      <p className="text-xs text-gray-400">/blog/{b.slug}</p>
                    </td>
                    <td className="px-5 py-3.5 text-gray-500">{b.category}</td>
                    <td className="px-5 py-3.5 text-gray-500">{b.author}</td>
                    <td className="px-5 py-3.5 text-gray-400 text-xs">{formatDate((b as unknown as Record<string,unknown>).createdAt)}</td>
                    <td className="px-5 py-3.5">
                      {b.published ? (
                        <span className="flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-lg w-fit">
                          <FiEye size={11} /> Published
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-lg w-fit">
                          <FiEyeOff size={11} /> Draft
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3.5">
                      <button onClick={() => openEdit(b)}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-primary-600 hover:bg-primary-50 rounded-lg transition-colors font-medium">
                        <FiEdit2 size={12} /> Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="font-bold text-gray-800">{editing._id ? 'Edit Blog Post' : 'New Blog Post'}</h2>
              <button onClick={() => setModal(false)} className="p-1.5 hover:bg-gray-100 rounded-lg"><FiX size={18} /></button>
            </div>

            <div className="overflow-y-auto p-6 space-y-4 flex-1">
              {msg && (
                <div className={`p-3 rounded-xl text-sm ${msg.includes('Error') || msg.includes('Check') ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-700'}`}>
                  {msg}
                </div>
              )}

              <Fld label="Title *" value={editing.title} onChange={handleTitleChange} />
              <div className="grid grid-cols-2 gap-4">
                <Fld label="Slug *" value={editing.slug} onChange={(v) => setEditing((p) => ({ ...p, slug: v }))} />
                <Fld label="Category" value={editing.category} onChange={(v) => setEditing((p) => ({ ...p, category: v }))} placeholder="e.g. News" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Fld label="Author" value={editing.author} onChange={(v) => setEditing((p) => ({ ...p, author: v }))} />
                <Fld label="Tags (comma-separated)" value={editing.tags} onChange={(v) => setEditing((p) => ({ ...p, tags: v }))} />
              </div>
              <Fld label="Cover Image URL" value={editing.image} onChange={(v) => setEditing((p) => ({ ...p, image: v }))} placeholder="https://..." />
              <TArea label="Excerpt (short summary) *" value={editing.excerpt} onChange={(v) => setEditing((p) => ({ ...p, excerpt: v }))} rows={2} />
              <TArea label="Full Content *" value={editing.content} onChange={(v) => setEditing((p) => ({ ...p, content: v }))} rows={8} />
              <p className="text-xs text-gray-400">Tip: Use ## for headings, - for bullet points. Each paragraph on a new line.</p>

              <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                <input type="checkbox" checked={editing.published}
                  onChange={(e) => setEditing((p) => ({ ...p, published: e.target.checked }))}
                  className="rounded" />
                Publish immediately (visible on website)
              </label>
            </div>

            <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3">
              <button onClick={() => setModal(false)} className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50">
                Cancel
              </button>
              <button onClick={handleSave} disabled={saving}
                className="flex items-center gap-2 px-5 py-2 bg-primary-600 text-white text-sm font-semibold rounded-xl hover:bg-primary-700 disabled:opacity-70">
                <FiSave size={14} /> {saving ? 'Saving...' : 'Save Post'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function Fld({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
      <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
        className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100" />
    </div>
  )
}

function TArea({ label, value, onChange, rows = 3 }: { label: string; value: string; onChange: (v: string) => void; rows?: number }) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
      <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={rows}
        className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 resize-none" />
    </div>
  )
}
