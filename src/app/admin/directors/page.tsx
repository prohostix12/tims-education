'use client'
import { useEffect, useRef, useState } from 'react'
import { FiPlus, FiEdit2, FiTrash2, FiX, FiSave, FiUser, FiUpload } from 'react-icons/fi'

interface Director {
  _id?: string
  name: string
  role: string
  bio: string
  photo: string
  order: number | ''
}

const empty: Director = { name: '', role: '', bio: '', photo: '', order: '' }

export default function AdminDirectors() {
  const [list, setList] = useState<Director[]>([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(false)
  const [editing, setEditing] = useState<Director>(empty)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')
  const [deleting, setDeleting] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const uploadPhoto = async (file: File) => {
    setUploading(true)
    const fd = new FormData()
    fd.append('file', file)
    const res = await fetch('/api/admin/upload', { method: 'POST', body: fd })
    if (res.ok) {
      const { url } = await res.json()
      setEditing((p) => ({ ...p, photo: url }))
    }
    setUploading(false)
  }

  const load = () => {
    fetch('/api/admin/directors')
      .then((r) => r.json())
      .then((d) => { setList(Array.isArray(d) ? d : []); setLoading(false) })
      .catch(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const openNew = () => { setEditing(empty); setModal(true); setMsg('') }
  const openEdit = (d: Director) => { setEditing({ ...d }); setModal(true); setMsg('') }

  const handleSave = async () => {
    setSaving(true)
    setMsg('')
    const payload = { ...editing, order: editing.order === '' ? 0 : Number(editing.order) }
    const res = await fetch('/api/admin/directors', {
      method: editing._id ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    if (res.ok) {
      setMsg(editing._id ? 'Director updated!' : 'Director added!')
      load()
      setTimeout(() => { setModal(false); setMsg('') }, 1000)
    } else {
      setMsg('Error saving. Check required fields.')
    }
    setSaving(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this director?')) return
    setDeleting(id)
    await fetch('/api/admin/directors', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ _id: id }),
    })
    load()
    setDeleting(null)
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-xl font-bold text-gray-800 font-heading">Directors</h1>
          <p className="text-gray-500 text-sm">Manage the "Meet Our Directors" section on the About page</p>
        </div>
        <button onClick={openNew}
          className="flex items-center gap-2 px-4 py-2.5 bg-primary-600 text-white text-sm font-semibold rounded-xl hover:bg-primary-700 transition-all shadow-sm">
          <FiPlus size={16} /> Add Director
        </button>
      </div>

      <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 text-xs text-blue-700">
        Directors will appear on the <strong>About page</strong> under "Meet Our Directors". Use the <strong>Order</strong> field to control the display sequence (1 = first).
      </div>

      {/* Cards */}
      {loading ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center text-gray-400 text-sm">Loading...</div>
      ) : list.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center">
          <FiUser size={32} className="text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 text-sm">No directors added yet.</p>
          <button onClick={openNew} className="mt-3 text-primary-600 text-sm font-medium hover:underline">
            Add your first director →
          </button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {list.map((d) => (
            <div key={d._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              {/* Photo */}
              <div className="h-48 bg-hero-gradient relative overflow-hidden">
                {d.photo ? (
                  <img src={d.photo} alt={d.name} className="w-full h-full object-cover object-top" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-6xl font-extrabold text-white/20 font-heading">{d.name.charAt(0)}</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-primary-900/80 to-transparent" />
                <div className="absolute bottom-0 left-0 p-4">
                  <p className="text-white font-bold font-heading">{d.name}</p>
                  <p className="text-accent text-xs font-semibold">{d.role}</p>
                </div>
                <div className="absolute top-3 right-3 bg-white/20 text-white text-xs px-2 py-0.5 rounded-lg font-medium">
                  #{d.order || 0}
                </div>
              </div>

              <div className="p-4">
                <p className="text-gray-500 text-xs leading-relaxed line-clamp-3 mb-4">{d.bio || 'No bio added yet.'}</p>
                <div className="flex gap-2">
                  <button onClick={() => openEdit(d)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs text-primary-600 hover:bg-primary-50 rounded-lg transition-colors font-medium border border-primary-100">
                    <FiEdit2 size={12} /> Edit
                  </button>
                  <button onClick={() => handleDelete(d._id!)} disabled={deleting === d._id}
                    className="flex items-center gap-1.5 px-3 py-2 text-xs text-red-500 hover:bg-red-50 rounded-lg transition-colors font-medium border border-red-100 disabled:opacity-50">
                    <FiTrash2 size={12} /> {deleting === d._id ? '...' : 'Delete'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="font-bold text-gray-800">{editing._id ? 'Edit Director' : 'Add Director'}</h2>
              <button onClick={() => setModal(false)} className="p-1.5 hover:bg-gray-100 rounded-lg"><FiX size={18} /></button>
            </div>

            <div className="overflow-y-auto p-6 space-y-4 flex-1">
              {msg && (
                <div className={`p-3 rounded-xl text-sm ${msg.includes('Error') ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-700'}`}>
                  {msg}
                </div>
              )}

              {/* Photo preview */}
              {editing.photo && (
                <div className="w-full h-40 rounded-xl overflow-hidden border border-gray-200">
                  <img src={editing.photo} alt="preview" className="w-full h-full object-cover object-top" />
                </div>
              )}

              <F label="Full Name *" value={editing.name} onChange={(v) => setEditing((p) => ({ ...p, name: v }))} />
              <F label="Role / Designation *" value={editing.role} onChange={(v) => setEditing((p) => ({ ...p, role: v }))} placeholder="e.g. Founder & Director" />

              {/* Photo field with upload */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Photo</label>
                <div className="flex gap-2">
                  <input
                    value={editing.photo}
                    onChange={(e) => setEditing((p) => ({ ...p, photo: e.target.value }))}
                    placeholder="https://example.com/photo.jpg"
                    className="flex-1 border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
                  />
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => { if (e.target.files?.[0]) uploadPhoto(e.target.files[0]) }}
                  />
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    disabled={uploading}
                    className="flex items-center gap-1.5 px-3 py-2.5 text-sm font-medium text-primary-600 border border-primary-200 rounded-xl hover:bg-primary-50 transition-colors disabled:opacity-60 whitespace-nowrap"
                  >
                    <FiUpload size={14} /> {uploading ? 'Uploading…' : 'Upload'}
                  </button>
                </div>
              </div>

              <F label="Display Order" value={String(editing.order)} onChange={(v) => setEditing((p) => ({ ...p, order: v === '' ? '' : Number(v) }))} type="number" placeholder="1" />
              <TA label="Bio / Description" value={editing.bio} onChange={(v) => setEditing((p) => ({ ...p, bio: v }))} rows={5} />
            </div>

            <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3">
              <button onClick={() => setModal(false)} className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50">
                Cancel
              </button>
              <button onClick={handleSave} disabled={saving}
                className="flex items-center gap-2 px-5 py-2 bg-primary-600 text-white text-sm font-semibold rounded-xl hover:bg-primary-700 disabled:opacity-70">
                <FiSave size={14} /> {saving ? 'Saving...' : 'Save Director'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function F({ label, value, onChange, placeholder, type }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string }) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
      <input type={type ?? 'text'} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
        className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100" />
    </div>
  )
}

function TA({ label, value, onChange, rows = 3 }: { label: string; value: string; onChange: (v: string) => void; rows?: number }) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
      <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={rows}
        className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 resize-none" />
    </div>
  )
}
