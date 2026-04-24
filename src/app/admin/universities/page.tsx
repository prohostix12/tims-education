'use client'
import { useEffect, useState } from 'react'
import { FiPlus, FiEdit2, FiTrash2, FiX, FiSave, FiSearch, FiImage, FiCheck } from 'react-icons/fi'

const FILTER_TAG_OPTIONS = ['10th/Plus Two', 'Degree/PG', 'Study Materials', 'Examination']

interface University {
  _id?: string
  slug: string
  name: string
  shortName: string
  naac: string
  type: string
  established: number | ''
  location: string
  description: string
  accreditations: string
  highlights: string
  feeRange: string
  website: string
  logo: string
  banner: string
  filterTags: string[]
}

const empty: University = {
  slug: '', name: '', shortName: '', naac: 'A', type: 'Deemed University',
  established: '', location: '', description: '', accreditations: '',
  highlights: '', feeRange: '', website: '', logo: '', banner: '', filterTags: [],
}

export default function AdminUniversities() {
  const [list, setList] = useState<University[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [modal, setModal] = useState(false)
  const [editing, setEditing] = useState<University>(empty)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')
  const [seeding, setSeeding] = useState(false)
  const [seedMsg, setSeedMsg] = useState('')
  const [deleting, setDeleting] = useState<string | null>(null)

  const load = () => {
    fetch('/api/admin/universities')
      .then((r) => r.json())
      .then((d) => { setList(Array.isArray(d) ? d : []); setLoading(false) })
      .catch(() => setLoading(false))
  }

  const handleSeed = async () => {
    setSeeding(true)
    setSeedMsg('')
    const res = await fetch('/api/admin/seed-universities', { method: 'POST' })
    const data = await res.json()
    if (data.success) {
      setSeedMsg(`✅ Done! ${data.inserted} universities added, ${data.skipped} already existed.`)
      load()
    } else {
      setSeedMsg('❌ Seed failed. Try again.')
    }
    setSeeding(false)
  }

  useEffect(() => {
    load()
    const params = new URLSearchParams(window.location.search)
    if (params.get('new') === '1') openNew()
  }, [])

  const openNew = () => { setEditing(empty); setModal(true); setMsg('') }
  const openEdit = (u: University) => {
    setEditing({
      ...u,
      accreditations: (u.accreditations as unknown as string[])?.join(', ') ?? '',
      highlights:     (u.highlights as unknown as string[])?.join(', ') ?? '',
      logo:           (u.logo as string) ?? '',
      banner:         (u.banner as string) ?? '',
      filterTags:     Array.isArray(u.filterTags) ? u.filterTags : [],
    })
    setModal(true)
    setMsg('')
  }

  const toggleTag = (tag: string) => {
    setEditing((p) => ({
      ...p,
      filterTags: p.filterTags.includes(tag)
        ? p.filterTags.filter((t) => t !== tag)
        : [...p.filterTags, tag],
    }))
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this university? This cannot be undone.')) return
    setDeleting(id)
    await fetch('/api/admin/universities', {
      method: 'DELETE', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    setDeleting(null)
    load()
  }

  const handleSave = async () => {
    setSaving(true)
    setMsg('')
    const payload = {
      ...editing,
      established:    editing.established === '' ? undefined : Number(editing.established),
      accreditations: editing.accreditations.split(',').map((s) => s.trim()).filter(Boolean),
      highlights:     editing.highlights.split(',').map((s) => s.trim()).filter(Boolean),
    }
    const method = editing._id ? 'PUT' : 'POST'
    const res = await fetch('/api/admin/universities', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    if (res.ok) {
      setMsg(editing._id ? 'Updated successfully!' : 'University added!')
      load()
      setTimeout(() => { setModal(false); setMsg('') }, 1200)
    } else {
      const err = await res.json()
      setMsg(err.message || 'Error saving. Check required fields.')
    }
    setSaving(false)
  }

  const filtered = list.filter((u) =>
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.shortName?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-xl font-bold text-gray-800 font-heading">Universities</h1>
          <p className="text-gray-500 text-sm">{list.length} universities in database</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button onClick={handleSeed} disabled={seeding}
            className="flex items-center gap-2 px-4 py-2.5 bg-green-600 text-white text-sm font-semibold rounded-xl hover:bg-green-700 transition-all shadow-sm disabled:opacity-70">
            {seeding ? (
              <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Syncing...</>
            ) : (
              <>⬇️ Sync All Universities to DB</>
            )}
          </button>
          <button onClick={openNew}
            className="flex items-center gap-2 px-4 py-2.5 bg-primary-600 text-white text-sm font-semibold rounded-xl hover:bg-primary-700 transition-all shadow-sm">
            <FiPlus size={16} /> Add University
          </button>
        </div>
      </div>

      {seedMsg && (
        <div className={`p-3 rounded-xl text-sm font-medium ${seedMsg.startsWith('✅') ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-600 border border-red-100'}`}>
          {seedMsg}
        </div>
      )}

      {/* Search */}
      <div className="relative">
        <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
        <input value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="Search universities..."
          className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100" />
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-400 text-sm">Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="p-8 text-center text-gray-400 text-sm">
            {list.length === 0 ? 'No universities added yet. Click "Add University" to get started.' : 'No results found.'}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left px-5 py-3 font-semibold text-gray-600">University</th>
                  <th className="text-left px-5 py-3 font-semibold text-gray-600">Type</th>
                  <th className="text-left px-5 py-3 font-semibold text-gray-600">NAAC</th>
                  <th className="text-left px-5 py-3 font-semibold text-gray-600">Location</th>
                  <th className="text-left px-5 py-3 font-semibold text-gray-600">Categories</th>
                  <th className="text-left px-5 py-3 font-semibold text-gray-600">Images</th>
                  <th className="text-left px-5 py-3 font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((u) => (
                  <tr key={u._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        {u.logo ? (
                          <img src={u.logo} alt={u.shortName} className="w-9 h-9 rounded-lg object-contain border border-gray-100 bg-white" />
                        ) : (
                          <div className="w-9 h-9 rounded-lg bg-primary-100 flex items-center justify-center">
                            <span className="text-primary-700 font-bold text-sm">{u.shortName?.charAt(0)}</span>
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-gray-800">{u.name}</p>
                          <p className="text-xs text-gray-400">{u.shortName} · {u.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-gray-500">{u.type}</td>
                    <td className="px-5 py-3.5">
                      <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded-lg text-xs font-medium">{u.naac}</span>
                    </td>
                    <td className="px-5 py-3.5 text-gray-500">{u.location}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex flex-wrap gap-1">
                        {(u.filterTags as unknown as string[])?.map((t) => (
                          <span key={t} className="text-xs bg-primary-50 text-primary-600 px-2 py-0.5 rounded-lg font-medium">{t}</span>
                        ))}
                        {!(u.filterTags as unknown as string[])?.length && <span className="text-xs text-gray-300">—</span>}
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex gap-1.5">
                        {u.logo && <span className="text-xs bg-green-50 text-green-600 px-2 py-0.5 rounded-lg font-medium">Logo ✓</span>}
                        {u.banner && <span className="text-xs bg-purple-50 text-purple-600 px-2 py-0.5 rounded-lg font-medium">Banner ✓</span>}
                        {!u.logo && !u.banner && <span className="text-xs text-gray-300">—</span>}
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1.5">
                        <button onClick={() => openEdit(u)}
                          className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-primary-600 hover:bg-primary-50 rounded-lg transition-colors font-medium">
                          <FiEdit2 size={12} /> Edit
                        </button>
                        <button onClick={() => handleDelete(u._id!)} disabled={deleting === u._id}
                          className="flex items-center gap-1 px-2.5 py-1.5 text-xs text-red-500 hover:bg-red-50 rounded-lg transition-colors font-medium disabled:opacity-50">
                          <FiTrash2 size={12} /> {deleting === u._id ? '...' : 'Delete'}
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
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="font-bold text-gray-800">{editing._id ? 'Edit University' : 'Add University'}</h2>
              <button onClick={() => setModal(false)} className="p-1.5 hover:bg-gray-100 rounded-lg">
                <FiX size={18} />
              </button>
            </div>

            <div className="overflow-y-auto p-6 space-y-5 flex-1">
              {msg && (
                <div className={`p-3 rounded-xl text-sm ${msg.includes('Error') || msg.includes('Check') ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-700'}`}>
                  {msg}
                </div>
              )}

              {/* Image previews */}
              {(editing.logo || editing.banner) && (
                <div className="grid grid-cols-2 gap-4">
                  {editing.logo && (
                    <div>
                      <p className="text-xs text-gray-500 mb-1.5 font-medium">Logo Preview</p>
                      <div className="h-20 bg-gray-50 rounded-xl border border-gray-200 flex items-center justify-center p-2">
                        <img src={editing.logo} alt="logo preview" className="max-h-full max-w-full object-contain" />
                      </div>
                    </div>
                  )}
                  {editing.banner && (
                    <div>
                      <p className="text-xs text-gray-500 mb-1.5 font-medium">Banner Preview</p>
                      <div className="h-20 bg-gray-50 rounded-xl border border-gray-200 overflow-hidden">
                        <img src={editing.banner} alt="banner preview" className="w-full h-full object-cover" />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Image URLs */}
              <div className="grid grid-cols-2 gap-4 p-4 bg-blue-50 border border-blue-100 rounded-xl">
                <Field label="Logo URL" value={editing.logo} onChange={(v) => setEditing((p) => ({ ...p, logo: v }))}
                  placeholder="https://... (square image)" icon={<FiImage size={13} />} />
                <Field label="Banner Image URL" value={editing.banner} onChange={(v) => setEditing((p) => ({ ...p, banner: v }))}
                  placeholder="https://... (wide/landscape)" icon={<FiImage size={13} />} />
              </div>

              {/* Basic info */}
              <div className="grid grid-cols-2 gap-4">
                <Field label="University Name *" value={editing.name} onChange={(v) => setEditing((p) => ({ ...p, name: v }))} />
                <Field label="Short Name *" value={editing.shortName} onChange={(v) => setEditing((p) => ({ ...p, shortName: v }))} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Slug *" value={editing.slug} onChange={(v) => setEditing((p) => ({ ...p, slug: v }))} placeholder="e.g. amrita-university" />
                <Field label="NAAC Grade" value={editing.naac} onChange={(v) => setEditing((p) => ({ ...p, naac: v }))} placeholder="A++, A+, A, B++" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Type" value={editing.type} onChange={(v) => setEditing((p) => ({ ...p, type: v }))} placeholder="Deemed / Central / State University" />
                <Field label="Established Year" value={String(editing.established)}
                  onChange={(v) => setEditing((p) => ({ ...p, established: v === '' ? '' : (Number(v) as number | '') }))}
                  type="number" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Location" value={editing.location} onChange={(v) => setEditing((p) => ({ ...p, location: v }))} placeholder="City, State" />
                <Field label="Fee Range" value={editing.feeRange} onChange={(v) => setEditing((p) => ({ ...p, feeRange: v }))} placeholder="₹20,000 – ₹80,000 / year" />
              </div>
              <Field label="Official Website" value={editing.website} onChange={(v) => setEditing((p) => ({ ...p, website: v }))} placeholder="https://university.ac.in" />
              <TextArea label="Description" value={editing.description} onChange={(v) => setEditing((p) => ({ ...p, description: v }))} />
              <Field label="Accreditations (comma-separated)" value={editing.accreditations}
                onChange={(v) => setEditing((p) => ({ ...p, accreditations: v }))}
                placeholder="UGC-DEB Approved, NAAC A+, NIRF Ranked" />
              <Field label="Highlights (comma-separated)" value={editing.highlights}
                onChange={(v) => setEditing((p) => ({ ...p, highlights: v }))}
                placeholder="Established 1875, Pan-India recognition, Research-focused" />

              {/* Filter Category */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-2">
                  Category <span className="text-gray-400 font-normal">(shown on the frontend filter — select all that apply)</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {FILTER_TAG_OPTIONS.map((tag) => {
                    const active = editing.filterTags.includes(tag)
                    const icons: Record<string,string> = {
                      '10th/Plus Two': '📋',
                      'Degree/PG': '🎓',
                      'Study Materials': '📚',
                      'Examination': '✍️',
                    }
                    return (
                      <button key={tag} type="button" onClick={() => toggleTag(tag)}
                        className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl border-2 text-sm font-medium transition-all text-left
                          ${active
                            ? 'bg-primary-600 border-primary-600 text-white'
                            : 'bg-white border-gray-200 text-gray-600 hover:border-primary-400 hover:text-primary-600'
                          }`}>
                        <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-colors ${active ? 'bg-white/20 border-white/40' : 'border-gray-300'}`}>
                          {active && <FiCheck size={11} className="text-white" />}
                        </div>
                        <span>{icons[tag]}</span>
                        <span>{tag}</span>
                      </button>
                    )
                  })}
                </div>
                {editing.filterTags.length > 0 && (
                  <p className="text-xs text-primary-600 mt-1.5 font-medium">
                    Selected: {editing.filterTags.join(', ')}
                  </p>
                )}
              </div>
            </div>

            <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3">
              <button onClick={() => setModal(false)} className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50">
                Cancel
              </button>
              <button onClick={handleSave} disabled={saving}
                className="flex items-center gap-2 px-5 py-2 bg-primary-600 text-white text-sm font-semibold rounded-xl hover:bg-primary-700 disabled:opacity-70">
                <FiSave size={14} /> {saving ? 'Saving...' : 'Save University'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function Field({ label, value, onChange, placeholder, type, icon }: {
  label: string; value: string; onChange: (v: string) => void
  placeholder?: string; type?: string; icon?: React.ReactNode
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
      <div className="relative">
        {icon && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">{icon}</span>}
        <input type={type ?? 'text'} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
          className={`w-full border border-gray-200 rounded-xl py-2.5 text-sm focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 ${icon ? 'pl-8 pr-3' : 'px-3'}`} />
      </div>
    </div>
  )
}

function TextArea({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
      <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={3}
        className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 resize-none" />
    </div>
  )
}
