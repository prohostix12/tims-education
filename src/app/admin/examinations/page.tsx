'use client'
import { useEffect, useState, useRef } from 'react'
import { FiPlus, FiEdit2, FiTrash2, FiX, FiSave, FiSearch, FiUpload } from 'react-icons/fi'

interface Examination {
  _id?: string
  universitySlug: string
  universityName: string
  courseTitle: string
  title: string
  description: string
  examDate: string
  lastDate: string
  scheduleUrl: string
  instructions: string
}

interface UniOption { _id: string; slug: string; name: string; shortName: string }
interface CourseOption { _id: string; slug: string; title: string; category: string }

const empty: Examination = {
  universitySlug: '', universityName: '', courseTitle: '', title: '', description: '',
  examDate: '', lastDate: '', scheduleUrl: '', instructions: '',
}

export default function AdminExaminations() {
  const [list, setList] = useState<Examination[]>([])
  const [unis, setUnis] = useState<UniOption[]>([])
  const [courses, setCourses] = useState<CourseOption[]>([])
  const [loadingCourses, setLoadingCourses] = useState(false)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterUni, setFilterUni] = useState('')
  const [modal, setModal] = useState(false)
  const [editing, setEditing] = useState<Examination>(empty)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')
  const [deleting, setDeleting] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const load = () => {
    fetch('/api/admin/examinations', { credentials: 'include' })
      .then(r => r.json())
      .then(d => { setList(Array.isArray(d) ? d : []); setLoading(false) })
      .catch(() => setLoading(false))
  }

  useEffect(() => {
    load()
    fetch('/api/admin/universities', { credentials: 'include' })
      .then(r => r.json())
      .then(d => setUnis(Array.isArray(d) ? d : []))
      .catch(() => {})
  }, [])

  const fetchCoursesForUni = (slug: string) => {
    if (!slug) { setCourses([]); return }
    setLoadingCourses(true)
    fetch(`/api/courses/university/${slug}`)
      .then(r => r.json())
      .then(d => setCourses(Array.isArray(d) ? d : []))
      .catch(() => setCourses([]))
      .finally(() => setLoadingCourses(false))
  }

  const openNew = () => { setEditing(empty); setCourses([]); setModal(true); setMsg('') }

  const openEdit = (e: Examination) => {
    setEditing(e)
    setModal(true)
    setMsg('')
    if (e.universitySlug) fetchCoursesForUni(e.universitySlug)
  }

  const onUniChange = (slug: string) => {
    const u = unis.find(u => u.slug === slug)
    setEditing(p => ({ ...p, universitySlug: slug, universityName: u?.name ?? '', courseTitle: '' }))
    fetchCoursesForUni(slug)
  }

  const uploadFile = async (file: File) => {
    setUploading(true)
    const fd = new FormData()
    fd.append('file', file)
    const res = await fetch('/api/admin/upload', { method: 'POST', body: fd, credentials: 'include' })
    const data = await res.json()
    setUploading(false)
    if (data.url) setEditing(p => ({ ...p, scheduleUrl: data.url }))
  }

  const handleSave = async () => {
    if (!editing.universitySlug || !editing.title) {
      setMsg('University and title are required.')
      return
    }
    setSaving(true)
    setMsg('')
    const method = editing._id ? 'PUT' : 'POST'
    const res = await fetch('/api/admin/examinations', {
      method, headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editing), credentials: 'include',
    })
    if (res.ok) {
      setMsg(editing._id ? 'Updated!' : 'Added!')
      load()
      setTimeout(() => { setModal(false); setMsg('') }, 1000)
    } else {
      const err = await res.json()
      setMsg(err.message || 'Error saving.')
    }
    setSaving(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this examination entry?')) return
    setDeleting(id)
    await fetch('/api/admin/examinations', {
      method: 'DELETE', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }), credentials: 'include',
    })
    setDeleting(null)
    load()
  }

  const filtered = list.filter(e => {
    const matchSearch = e.title?.toLowerCase().includes(search.toLowerCase()) ||
      e.universityName?.toLowerCase().includes(search.toLowerCase()) ||
      e.courseTitle?.toLowerCase().includes(search.toLowerCase())
    const matchUni = !filterUni || e.universitySlug === filterUni
    return matchSearch && matchUni
  })

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-xl font-bold text-gray-800 font-heading">Examination Details</h1>
          <p className="text-gray-500 text-sm">{list.length} examination entries</p>
        </div>
        <button onClick={openNew}
          className="flex items-center gap-2 px-4 py-2.5 bg-primary-600 text-white text-sm font-semibold rounded-xl hover:bg-primary-700 transition-all shadow-sm">
          <FiPlus size={16} /> Add Examination
        </button>
      </div>

      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search examinations..."
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary-400" />
        </div>
        <select value={filterUni} onChange={e => setFilterUni(e.target.value)}
          className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-primary-400 bg-white">
          <option value="">All Universities</option>
          {unis.map(u => <option key={u.slug} value={u.slug}>{u.shortName}</option>)}
        </select>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-400 text-sm">Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="p-8 text-center text-gray-400 text-sm">
            {list.length === 0 ? 'No examination entries yet. Click "Add Examination" to get started.' : 'No results found.'}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left px-5 py-3 font-semibold text-gray-600">Title</th>
                  <th className="text-left px-5 py-3 font-semibold text-gray-600">University</th>
                  <th className="text-left px-5 py-3 font-semibold text-gray-600">Course</th>
                  <th className="text-left px-5 py-3 font-semibold text-gray-600">Exam Date</th>
                  <th className="text-left px-5 py-3 font-semibold text-gray-600">Last Date</th>
                  <th className="text-left px-5 py-3 font-semibold text-gray-600">Schedule</th>
                  <th className="text-left px-5 py-3 font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map(e => (
                  <tr key={e._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3.5 font-medium text-gray-800">{e.title}</td>
                    <td className="px-5 py-3.5 text-gray-500">{e.universityName || e.universitySlug}</td>
                    <td className="px-5 py-3.5 text-gray-500">{e.courseTitle || '—'}</td>
                    <td className="px-5 py-3.5 text-gray-500">{e.examDate || '—'}</td>
                    <td className="px-5 py-3.5 text-gray-500">{e.lastDate || '—'}</td>
                    <td className="px-5 py-3.5">
                      {e.scheduleUrl ? (
                        <a href={e.scheduleUrl} target="_blank" rel="noopener noreferrer"
                          className="text-xs text-primary-600 hover:underline font-medium">View PDF</a>
                      ) : <span className="text-gray-300 text-xs">—</span>}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1.5">
                        <button onClick={() => openEdit(e)}
                          className="flex items-center gap-1 px-2.5 py-1.5 text-xs text-primary-600 hover:bg-primary-50 rounded-lg font-medium">
                          <FiEdit2 size={12} /> Edit
                        </button>
                        <button onClick={() => handleDelete(e._id!)} disabled={deleting === e._id}
                          className="flex items-center gap-1 px-2.5 py-1.5 text-xs text-red-500 hover:bg-red-50 rounded-lg font-medium disabled:opacity-50">
                          <FiTrash2 size={12} /> {deleting === e._id ? '...' : 'Delete'}
                        </button>
                      </div>
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
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="font-bold text-gray-800">{editing._id ? 'Edit Examination' : 'Add Examination'}</h2>
              <button onClick={() => setModal(false)} className="p-1.5 hover:bg-gray-100 rounded-lg"><FiX size={18} /></button>
            </div>

            <div className="overflow-y-auto p-6 space-y-4 flex-1">
              {msg && (
                <div className={`p-3 rounded-xl text-sm ${msg.includes('Error') || msg.includes('required') ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-700'}`}>
                  {msg}
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">University *</label>
                <select value={editing.universitySlug} onChange={e => onUniChange(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-primary-400">
                  <option value="">Select university...</option>
                  {unis.map(u => <option key={u.slug} value={u.slug}>{u.name} ({u.shortName})</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Course</label>
                <select
                  value={editing.courseTitle}
                  onChange={e => setEditing(p => ({ ...p, courseTitle: e.target.value }))}
                  disabled={!editing.universitySlug || loadingCourses}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-primary-400 disabled:bg-gray-50 disabled:text-gray-400">
                  <option value="">
                    {!editing.universitySlug ? 'Select a university first' : loadingCourses ? 'Loading courses...' : 'All courses / General'}
                  </option>
                  {courses.map(c => (
                    <option key={c._id} value={c.title}>🎓 {c.title} ({c.category})</option>
                  ))}
                </select>
              </div>

              <F label="Examination Title *" value={editing.title} onChange={v => setEditing(p => ({ ...p, title: v }))}
                placeholder="e.g. June 2025 End Semester Examination" />

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Description</label>
                <textarea value={editing.description} onChange={e => setEditing(p => ({ ...p, description: e.target.value }))} rows={2}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-primary-400 resize-none" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <F label="Exam Date" value={editing.examDate} onChange={v => setEditing(p => ({ ...p, examDate: v }))} placeholder="e.g. 15 June 2025" />
                <F label="Last Date to Register" value={editing.lastDate} onChange={v => setEditing(p => ({ ...p, lastDate: v }))} placeholder="e.g. 30 May 2025" />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Schedule / Time-table PDF</label>
                <div className="flex gap-2">
                  <input value={editing.scheduleUrl} onChange={e => setEditing(p => ({ ...p, scheduleUrl: e.target.value }))}
                    placeholder="Paste URL or upload PDF"
                    className="flex-1 border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-primary-400" />
                  <button onClick={() => fileRef.current?.click()} disabled={uploading}
                    className="flex items-center gap-1.5 px-3 py-2.5 bg-primary-600 text-white text-sm font-semibold rounded-xl hover:bg-primary-700 disabled:opacity-60">
                    {uploading ? <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> : <FiUpload size={14} />}
                    Upload
                  </button>
                  <input ref={fileRef} type="file" accept=".pdf" className="hidden"
                    onChange={e => e.target.files?.[0] && uploadFile(e.target.files[0])} />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Instructions (for students)</label>
                <textarea value={editing.instructions} onChange={e => setEditing(p => ({ ...p, instructions: e.target.value }))} rows={3}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-primary-400 resize-none"
                  placeholder="e.g. Students must carry hall ticket and ID proof..." />
              </div>
            </div>

            <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3">
              <button onClick={() => setModal(false)} className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50">Cancel</button>
              <button onClick={handleSave} disabled={saving}
                className="flex items-center gap-2 px-5 py-2 bg-primary-600 text-white text-sm font-semibold rounded-xl hover:bg-primary-700 disabled:opacity-70">
                <FiSave size={14} /> {saving ? 'Saving...' : 'Save Examination'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function F({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
      <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100" />
    </div>
  )
}
