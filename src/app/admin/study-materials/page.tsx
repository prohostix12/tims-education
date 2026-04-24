'use client'
import { useEffect, useState, useRef } from 'react'
import { FiPlus, FiEdit2, FiTrash2, FiX, FiSave, FiSearch, FiUpload } from 'react-icons/fi'

interface StudyMaterial {
  _id?: string
  universitySlug: string
  universityName: string
  courseTitle: string
  subject: string
  title: string
  description: string
  fileUrl: string
  type: 'pdf' | 'video' | 'link'
  semester: string
}

interface UniOption { _id: string; slug: string; name: string; shortName: string }
interface CourseOption { _id: string; slug: string; title: string; category: string; icon?: string }

const empty: StudyMaterial = {
  universitySlug: '', universityName: '', courseTitle: '', subject: '',
  title: '', description: '', fileUrl: '', type: 'pdf', semester: '',
}

export default function AdminStudyMaterials() {
  const [list, setList] = useState<StudyMaterial[]>([])
  const [unis, setUnis] = useState<UniOption[]>([])
  const [courses, setCourses] = useState<CourseOption[]>([])
  const [loadingCourses, setLoadingCourses] = useState(false)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterUni, setFilterUni] = useState('')
  const [modal, setModal] = useState(false)
  const [editing, setEditing] = useState<StudyMaterial>(empty)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')
  const [deleting, setDeleting] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const load = () => {
    fetch('/api/admin/study-materials', { credentials: 'include' })
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

  const openNew = () => {
    setEditing(empty)
    setCourses([])
    setModal(true)
    setMsg('')
  }
  const openEdit = (m: StudyMaterial) => {
    setEditing(m)
    setModal(true)
    setMsg('')
    if (m.universitySlug) fetchCoursesForUni(m.universitySlug)
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
    if (data.url) setEditing(p => ({ ...p, fileUrl: data.url }))
  }

  const handleSave = async () => {
    if (!editing.universitySlug || !editing.title || !editing.fileUrl) {
      setMsg('University, title and file URL are required.')
      return
    }
    setSaving(true)
    setMsg('')
    const method = editing._id ? 'PUT' : 'POST'
    const res = await fetch('/api/admin/study-materials', {
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
    if (!confirm('Delete this study material?')) return
    setDeleting(id)
    await fetch('/api/admin/study-materials', {
      method: 'DELETE', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }), credentials: 'include',
    })
    setDeleting(null)
    load()
  }

  const filtered = list.filter(m => {
    const matchSearch = m.title?.toLowerCase().includes(search.toLowerCase()) ||
      m.universityName?.toLowerCase().includes(search.toLowerCase()) ||
      m.subject?.toLowerCase().includes(search.toLowerCase())
    const matchUni = !filterUni || m.universitySlug === filterUni
    return matchSearch && matchUni
  })

  const typeIcon = (t: string) => t === 'pdf' ? '📄' : t === 'video' ? '🎥' : '🔗'
  const typeBg = (t: string) => t === 'pdf' ? 'bg-red-50 text-red-600' : t === 'video' ? 'bg-purple-50 text-purple-600' : 'bg-blue-50 text-blue-600'

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-xl font-bold text-gray-800 font-heading">Study Materials</h1>
          <p className="text-gray-500 text-sm">{list.length} materials uploaded</p>
        </div>
        <button onClick={openNew}
          className="flex items-center gap-2 px-4 py-2.5 bg-primary-600 text-white text-sm font-semibold rounded-xl hover:bg-primary-700 transition-all shadow-sm">
          <FiPlus size={16} /> Add Material
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search materials..."
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary-400" />
        </div>
        <select value={filterUni} onChange={e => setFilterUni(e.target.value)}
          className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-primary-400 bg-white">
          <option value="">All Universities</option>
          {unis.map(u => <option key={u.slug} value={u.slug}>{u.shortName}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-400 text-sm">Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="p-8 text-center text-gray-400 text-sm">
            {list.length === 0 ? 'No study materials yet. Click "Add Material" to get started.' : 'No results found.'}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left px-5 py-3 font-semibold text-gray-600">Title</th>
                  <th className="text-left px-5 py-3 font-semibold text-gray-600">University</th>
                  <th className="text-left px-5 py-3 font-semibold text-gray-600">Course / Subject</th>
                  <th className="text-left px-5 py-3 font-semibold text-gray-600">Type</th>
                  <th className="text-left px-5 py-3 font-semibold text-gray-600">Semester</th>
                  <th className="text-left px-5 py-3 font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map(m => (
                  <tr key={m._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3.5 font-medium text-gray-800">{m.title}</td>
                    <td className="px-5 py-3.5 text-gray-500">{m.universityName || m.universitySlug}</td>
                    <td className="px-5 py-3.5">
                      <div className="text-gray-700 text-xs font-medium">{m.courseTitle || '—'}</div>
                      <div className="text-gray-400 text-xs">{m.subject || '—'}</div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-lg ${typeBg(m.type)}`}>
                        {typeIcon(m.type)} {m.type.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-gray-500">{m.semester || '—'}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1.5">
                        <button onClick={() => openEdit(m)}
                          className="flex items-center gap-1 px-2.5 py-1.5 text-xs text-primary-600 hover:bg-primary-50 rounded-lg transition-colors font-medium">
                          <FiEdit2 size={12} /> Edit
                        </button>
                        <button onClick={() => handleDelete(m._id!)}
                          disabled={deleting === m._id}
                          className="flex items-center gap-1 px-2.5 py-1.5 text-xs text-red-500 hover:bg-red-50 rounded-lg transition-colors font-medium disabled:opacity-50">
                          <FiTrash2 size={12} /> {deleting === m._id ? '...' : 'Delete'}
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

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="font-bold text-gray-800">{editing._id ? 'Edit Material' : 'Add Study Material'}</h2>
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

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Course</label>
                  {!editing.universitySlug ? (
                    <div className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-400 bg-gray-50">
                      Select a university first
                    </div>
                  ) : loadingCourses ? (
                    <div className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-400 bg-gray-50 flex items-center gap-2">
                      <span className="w-3.5 h-3.5 border-2 border-gray-300 border-t-primary-500 rounded-full animate-spin" />
                      Loading courses...
                    </div>
                  ) : (
                    <select
                      value={editing.courseTitle}
                      onChange={e => setEditing(p => ({ ...p, courseTitle: e.target.value }))}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-primary-400 bg-white">
                      <option value="">— Select course —</option>
                      {courses.length === 0 ? (
                        <option disabled>No courses found for this university</option>
                      ) : (
                        courses.map(c => (
                          <option key={c._id} value={c.title}>
                            {c.icon ? `${c.icon} ` : ''}{c.title} ({c.category})
                          </option>
                        ))
                      )}
                    </select>
                  )}
                </div>
                <F label="Subject" value={editing.subject} onChange={v => setEditing(p => ({ ...p, subject: v }))} placeholder="e.g. Marketing Management" />
              </div>

              <F label="Material Title *" value={editing.title} onChange={v => setEditing(p => ({ ...p, title: v }))} placeholder="e.g. Unit 1 – Introduction to Management" />

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Description</label>
                <textarea value={editing.description} onChange={e => setEditing(p => ({ ...p, description: e.target.value }))} rows={2}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-primary-400 resize-none" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Type</label>
                  <select value={editing.type} onChange={e => setEditing(p => ({ ...p, type: e.target.value as 'pdf' | 'video' | 'link' }))}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-primary-400">
                    <option value="pdf">📄 PDF</option>
                    <option value="video">🎥 Video</option>
                    <option value="link">🔗 Link</option>
                  </select>
                </div>
                <F label="Semester / Year" value={editing.semester} onChange={v => setEditing(p => ({ ...p, semester: v }))} placeholder="e.g. Semester 1" />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">File URL *</label>
                <div className="flex gap-2">
                  <input value={editing.fileUrl} onChange={e => setEditing(p => ({ ...p, fileUrl: e.target.value }))}
                    placeholder="Paste URL or upload file"
                    className="flex-1 border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-primary-400" />
                  <button onClick={() => fileRef.current?.click()} disabled={uploading}
                    className="flex items-center gap-1.5 px-3 py-2.5 bg-primary-600 text-white text-sm font-semibold rounded-xl hover:bg-primary-700 disabled:opacity-60">
                    {uploading ? <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> : <FiUpload size={14} />}
                    Upload
                  </button>
                  <input ref={fileRef} type="file" accept=".pdf,.mp4,.doc,.docx,video/*" className="hidden"
                    onChange={e => e.target.files?.[0] && uploadFile(e.target.files[0])} />
                </div>
                {editing.fileUrl && (
                  <a href={editing.fileUrl} target="_blank" rel="noopener noreferrer"
                    className="text-xs text-primary-600 hover:underline mt-1 block truncate">{editing.fileUrl}</a>
                )}
              </div>
            </div>

            <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3">
              <button onClick={() => setModal(false)} className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50">Cancel</button>
              <button onClick={handleSave} disabled={saving}
                className="flex items-center gap-2 px-5 py-2 bg-primary-600 text-white text-sm font-semibold rounded-xl hover:bg-primary-700 disabled:opacity-70">
                <FiSave size={14} /> {saving ? 'Saving...' : 'Save Material'}
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
