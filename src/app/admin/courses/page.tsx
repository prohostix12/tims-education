'use client'
import { useEffect, useState } from 'react'
import { FiPlus, FiEdit2, FiX, FiSave, FiSearch, FiCheck, FiChevronDown, FiRefreshCw, FiExternalLink } from 'react-icons/fi'

const COURSE_CATEGORIES = [
  { value: 'School Programs',   label: '📚 School Programs (SSLC / Plus Two)' },
  { value: 'Under Graduate',    label: '🎓 Under Graduate (UG)' },
  { value: 'Post Graduate',     label: '🏆 Post Graduate (PG)' },
  { value: 'Engineering',       label: '⚙️ Engineering (B.Tech / M.Tech)' },
  { value: 'Diploma',           label: '📜 Diploma' },
  { value: 'Skill Development', label: '💡 Skill Development' },
  { value: 'Apprenticeship',    label: '🛠️ Apprenticeship' },
]

interface Course {
  _id?: string
  slug: string
  title: string
  category: string
  description: string
  fullDescription: string
  duration: string
  mode: string
  eligibility: string
  popular: boolean
  icon: string
  badge: string
  feeRange: string
  careers: string
  highlights: string
  universities: string[]
  syllabusUrl: string
}

interface UniOption {
  _id: string
  slug: string
  name: string
  shortName: string
  logo?: string
}

const empty: Course = {
  slug: '', title: '', category: '', description: '', fullDescription: '',
  duration: '', mode: 'Online', eligibility: '', popular: false,
  icon: '📚', badge: '', feeRange: '', careers: '', highlights: '',
  universities: [], syllabusUrl: '',
}

export default function AdminCourses() {
  const [list, setList]           = useState<Course[]>([])
  const [uniOptions, setUniOptions] = useState<UniOption[]>([])
  const [loading, setLoading]     = useState(true)
  const [search, setSearch]       = useState('')
  const [modal, setModal]         = useState(false)
  const [editing, setEditing]     = useState<Course>(empty)
  const [saving, setSaving]       = useState(false)
  const [seeding, setSeeding]     = useState(false)
  const [msg, setMsg]             = useState('')
  const [seedMsg, setSeedMsg]     = useState('')

  const load = () => {
    fetch('/api/admin/courses')
      .then((r) => r.json())
      .then((d) => { setList(Array.isArray(d) ? d : []); setLoading(false) })
      .catch(() => setLoading(false))
  }

  const loadUnis = () => {
    fetch('/api/admin/universities')
      .then((r) => r.json())
      .then((d) => setUniOptions(Array.isArray(d) ? d : []))
      .catch(() => {})
  }

  useEffect(() => {
    load()
    loadUnis()
    const params = new URLSearchParams(window.location.search)
    if (params.get('new') === '1') openNew()
  }, [])

  const openNew  = () => { setEditing(empty); setModal(true); setMsg('') }
  const openEdit = (c: Course) => {
    setEditing({
      ...c,
      careers:    (c.careers as unknown as string[])?.join(', ') ?? '',
      highlights: (c.highlights as unknown as string[])?.join(', ') ?? '',
      universities: Array.isArray(c.universities) ? c.universities : [],
      syllabusUrl: c.syllabusUrl ?? '',
    })
    setModal(true)
    setMsg('')
  }

  const toggleUni = (slug: string) => {
    setEditing((p) => ({
      ...p,
      universities: p.universities.includes(slug)
        ? p.universities.filter((s) => s !== slug)
        : [...p.universities, slug],
    }))
  }

  const handleSave = async () => {
    setSaving(true)
    setMsg('')
    const payload = {
      ...editing,
      careers:    editing.careers.split(',').map((s) => s.trim()).filter(Boolean),
      highlights: editing.highlights.split(',').map((s) => s.trim()).filter(Boolean),
    }
    const res = await fetch('/api/admin/courses', {
      method: editing._id ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    if (res.ok) {
      setMsg(editing._id ? 'Updated successfully!' : 'Course added!')
      load()
      setTimeout(() => { setModal(false); setMsg('') }, 1200)
    } else {
      const err = await res.json()
      setMsg(err.message || 'Error saving. Check required fields.')
    }
    setSaving(false)
  }

  const handleSeed = async () => {
    setSeeding(true)
    setSeedMsg('')
    const res = await fetch('/api/admin/seed-courses', { method: 'POST' })
    const data = await res.json()
    if (data.success) {
      setSeedMsg(`✅ Seeded: ${data.inserted} inserted, ${data.updated} updated`)
      load()
    } else {
      setSeedMsg('❌ Seed failed')
    }
    setSeeding(false)
    setTimeout(() => setSeedMsg(''), 4000)
  }

  const filtered = list.filter((c) =>
    c.title?.toLowerCase().includes(search.toLowerCase()) ||
    c.category?.toLowerCase().includes(search.toLowerCase())
  )

  const getUniNames = (slugs: string[]) => {
    if (!slugs?.length) return '—'
    return slugs.map((s) => uniOptions.find((u) => u.slug === s)?.shortName ?? s).join(', ')
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-xl font-bold text-gray-800 font-heading">Courses / Programs</h1>
          <p className="text-gray-500 text-sm">{list.length} courses in database</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {seedMsg && <span className="text-xs font-medium text-green-700 bg-green-50 px-3 py-1.5 rounded-lg border border-green-100">{seedMsg}</span>}
          <button onClick={handleSeed} disabled={seeding}
            className="flex items-center gap-2 px-4 py-2.5 bg-green-600 text-white text-sm font-semibold rounded-xl hover:bg-green-700 transition-all shadow-sm disabled:opacity-70">
            <FiRefreshCw size={14} className={seeding ? 'animate-spin' : ''} />
            {seeding ? 'Seeding...' : 'Sync All Courses to DB'}
          </button>
          <button onClick={openNew}
            className="flex items-center gap-2 px-4 py-2.5 bg-primary-600 text-white text-sm font-semibold rounded-xl hover:bg-primary-700 transition-all shadow-sm">
            <FiPlus size={16} /> Add Course
          </button>
        </div>
      </div>

      <div className="relative">
        <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
        <input value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="Search courses..."
          className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100" />
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-400 text-sm">Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="p-8 text-center text-gray-400 text-sm">
            {list.length === 0
              ? 'No courses yet. Click "Sync All Courses to DB" to import all programs.'
              : 'No results found.'}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left px-5 py-3 font-semibold text-gray-600 whitespace-nowrap">Course</th>
                  <th className="text-left px-5 py-3 font-semibold text-gray-600 whitespace-nowrap">Category</th>
                  <th className="text-left px-5 py-3 font-semibold text-gray-600 whitespace-nowrap">Duration</th>
                  <th className="text-left px-5 py-3 font-semibold text-gray-600 whitespace-nowrap">Universities</th>
                  <th className="text-left px-5 py-3 font-semibold text-gray-600 whitespace-nowrap">Syllabus</th>
                  <th className="text-left px-5 py-3 font-semibold text-gray-600 whitespace-nowrap">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((c) => (
                  <tr key={c._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3.5">
                      <p className="font-medium text-gray-800">{c.icon} {c.title}</p>
                      <p className="text-xs text-gray-400">{c.slug}</p>
                    </td>
                    <td className="px-5 py-3.5">
                      {c.category && (
                        <span className="text-xs bg-primary-50 text-primary-700 px-2.5 py-1 rounded-lg font-medium border border-primary-100">
                          {c.category}
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-gray-500 whitespace-nowrap">{c.duration}</td>
                    <td className="px-5 py-3.5">
                      <span className="text-xs text-gray-500">{getUniNames(c.universities)}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      {c.syllabusUrl ? (
                        <a href={c.syllabusUrl} target="_blank" rel="noreferrer"
                          className="inline-flex items-center gap-1 text-xs text-primary-600 hover:text-accent font-medium">
                          <FiExternalLink size={11} /> View
                        </a>
                      ) : (
                        <span className="text-xs text-gray-300">—</span>
                      )}
                    </td>
                    <td className="px-5 py-3.5">
                      <button onClick={() => openEdit(c)}
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

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="font-bold text-gray-800">{editing._id ? 'Edit Course' : 'Add Course'}</h2>
              <button onClick={() => setModal(false)} className="p-1.5 hover:bg-gray-100 rounded-lg"><FiX size={18} /></button>
            </div>

            <div className="overflow-y-auto p-6 space-y-4 flex-1">
              {msg && (
                <div className={`p-3 rounded-xl text-sm ${msg.includes('Error') || msg.includes('Check') ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-700'}`}>
                  {msg}
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <F label="Course Title *" v={editing.title} set={(v) => setEditing((p) => ({ ...p, title: v }))} />
                <F label="Slug *" v={editing.slug} set={(v) => setEditing((p) => ({ ...p, slug: v }))} placeholder="e.g. bba-online" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Category *</label>
                  <div className="relative">
                    <select
                      value={editing.category}
                      onChange={(e) => setEditing((p) => ({ ...p, category: e.target.value }))}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 bg-white appearance-none pr-8 text-gray-700">
                      <option value="">Select category...</option>
                      {COURSE_CATEGORIES.map((c) => (
                        <option key={c.value} value={c.value}>{c.label}</option>
                      ))}
                    </select>
                    <FiChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                </div>
                <F label="Icon (emoji)" v={editing.icon} set={(v) => setEditing((p) => ({ ...p, icon: v }))} placeholder="📚" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <F label="Duration" v={editing.duration} set={(v) => setEditing((p) => ({ ...p, duration: v }))} placeholder="e.g. 3 Years" />
                <F label="Mode" v={editing.mode} set={(v) => setEditing((p) => ({ ...p, mode: v }))} placeholder="Online / Hybrid" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <F label="Fee Range" v={editing.feeRange} set={(v) => setEditing((p) => ({ ...p, feeRange: v }))} placeholder="₹20,000 – ₹60,000" />
                <F label="Badge" v={editing.badge} set={(v) => setEditing((p) => ({ ...p, badge: v }))} placeholder="e.g. Most Popular" />
              </div>
              <F label="Eligibility" v={editing.eligibility} set={(v) => setEditing((p) => ({ ...p, eligibility: v }))} />
              <F label="Syllabus URL (PDF or link)" v={editing.syllabusUrl} set={(v) => setEditing((p) => ({ ...p, syllabusUrl: v }))} placeholder="https://..." />
              <TA label="Short Description" v={editing.description} set={(v) => setEditing((p) => ({ ...p, description: v }))} />
              <TA label="Full Description" v={editing.fullDescription} set={(v) => setEditing((p) => ({ ...p, fullDescription: v }))} rows={4} />
              <F label="Career Options (comma-separated)" v={editing.careers} set={(v) => setEditing((p) => ({ ...p, careers: v }))} />
              <F label="Highlights (comma-separated)" v={editing.highlights} set={(v) => setEditing((p) => ({ ...p, highlights: v }))} />

              {/* University selector */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-2">
                  Universities Offering This Course
                  <span className="text-gray-400 font-normal ml-1">(select all that apply)</span>
                </label>
                {uniOptions.length === 0 ? (
                  <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl text-xs text-amber-700">
                    No universities in database yet. Add universities first.
                  </div>
                ) : (
                  <div className="border border-gray-200 rounded-xl divide-y divide-gray-50 max-h-52 overflow-y-auto">
                    {uniOptions.map((u) => {
                      const selected = editing.universities.includes(u.slug)
                      return (
                        <button key={u.slug} type="button" onClick={() => toggleUni(u.slug)}
                          className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${selected ? 'bg-primary-50' : 'hover:bg-gray-50'}`}>
                          <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-colors ${selected ? 'bg-primary-600 border-primary-600' : 'border-gray-300'}`}>
                            {selected && <FiCheck size={11} className="text-white" />}
                          </div>
                          {u.logo ? (
                            <img src={u.logo} alt={u.shortName} className="w-7 h-7 rounded-lg object-contain border border-gray-100 bg-white shrink-0" />
                          ) : (
                            <div className="w-7 h-7 rounded-lg bg-primary-100 flex items-center justify-center shrink-0">
                              <span className="text-primary-700 font-bold text-xs">{u.shortName?.charAt(0)}</span>
                            </div>
                          )}
                          <div className="min-w-0">
                            <p className={`text-sm font-medium truncate ${selected ? 'text-primary-700' : 'text-gray-700'}`}>{u.name}</p>
                            <p className="text-xs text-gray-400">{u.shortName}</p>
                          </div>
                        </button>
                      )
                    })}
                  </div>
                )}
                {editing.universities.length > 0 && (
                  <p className="text-xs text-primary-600 mt-1.5 font-medium">
                    {editing.universities.length} universit{editing.universities.length === 1 ? 'y' : 'ies'} selected
                  </p>
                )}
              </div>

              <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                <input type="checkbox" checked={editing.popular} onChange={(e) => setEditing((p) => ({ ...p, popular: e.target.checked }))}
                  className="rounded" />
                Mark as Popular
              </label>
            </div>

            <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3">
              <button onClick={() => setModal(false)} className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50">
                Cancel
              </button>
              <button onClick={handleSave} disabled={saving}
                className="flex items-center gap-2 px-5 py-2 bg-primary-600 text-white text-sm font-semibold rounded-xl hover:bg-primary-700 disabled:opacity-70">
                <FiSave size={14} /> {saving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function F({ label, v, set, placeholder }: { label: string; v: string; set: (v: string) => void; placeholder?: string }) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
      <input value={v} onChange={(e) => set(e.target.value)} placeholder={placeholder}
        className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100" />
    </div>
  )
}

function TA({ label, v, set, rows = 3 }: { label: string; v: string; set: (v: string) => void; rows?: number }) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
      <textarea value={v} onChange={(e) => set(e.target.value)} rows={rows}
        className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 resize-none" />
    </div>
  )
}
