'use client'
import { useEffect, useState } from 'react'
import {
  FiMail, FiPhone, FiTrash2, FiSearch, FiFilter,
  FiRefreshCw, FiMessageSquare, FiChevronDown, FiChevronUp,
} from 'react-icons/fi'

interface Enquiry {
  _id: string
  name: string
  email: string
  phone?: string
  course?: string
  message: string
  status: 'new' | 'contacted' | 'resolved'
  createdAt: string
}

const statusConfig: Record<string, { label: string; cls: string }> = {
  new:       { label: 'New',       cls: 'bg-blue-50 text-blue-700 border-blue-200' },
  contacted: { label: 'Contacted', cls: 'bg-amber-50 text-amber-700 border-amber-200' },
  resolved:  { label: 'Resolved',  cls: 'bg-green-50 text-green-700 border-green-200' },
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 1) return 'Just now'
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  const d = Math.floor(h / 24)
  return d === 1 ? '1 day ago' : `${d} days ago`
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

export default function AdminEnquiries() {
  const [list, setList] = useState<Enquiry[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [expanded, setExpanded] = useState<string | null>(null)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null)

  const load = () => {
    setLoading(true)
    fetch('/api/admin/enquiries', { credentials: 'include' })
      .then(r => r.json())
      .then(d => { setList(Array.isArray(d) ? d : []); setLoading(false) })
      .catch(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const updateStatus = async (id: string, status: string) => {
    setUpdatingStatus(id)
    await fetch('/api/admin/enquiries', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ _id: id, status }),
      credentials: 'include',
    })
    setUpdatingStatus(null)
    load()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this enquiry permanently?')) return
    setDeleting(id)
    await fetch('/api/admin/enquiries', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
      credentials: 'include',
    })
    setDeleting(null)
    load()
  }

  const filtered = list.filter(e => {
    const q = search.toLowerCase()
    const matchSearch = !q ||
      e.name?.toLowerCase().includes(q) ||
      e.email?.toLowerCase().includes(q) ||
      e.phone?.includes(q) ||
      e.course?.toLowerCase().includes(q) ||
      e.message?.toLowerCase().includes(q)
    const matchStatus = !filterStatus || e.status === filterStatus
    return matchSearch && matchStatus
  })

  const counts = {
    total: list.length,
    new: list.filter(e => e.status === 'new').length,
    contacted: list.filter(e => e.status === 'contacted').length,
    resolved: list.filter(e => e.status === 'resolved').length,
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-xl font-bold text-gray-800 font-heading">Enquiries</h1>
          <p className="text-gray-500 text-sm">{counts.total} total · {counts.new} new</p>
        </div>
        <button onClick={load}
          className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 text-gray-600 text-sm font-semibold rounded-xl hover:bg-gray-50 transition-all shadow-sm">
          <FiRefreshCw size={14} /> Refresh
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total', value: counts.total, color: 'text-gray-800', bg: 'bg-white' },
          { label: 'New', value: counts.new, color: 'text-blue-700', bg: 'bg-blue-50' },
          { label: 'Contacted', value: counts.contacted, color: 'text-amber-700', bg: 'bg-amber-50' },
          { label: 'Resolved', value: counts.resolved, color: 'text-green-700', bg: 'bg-green-50' },
        ].map(s => (
          <div key={s.label} className={`${s.bg} rounded-2xl border border-gray-100 p-4 text-center`}>
            <p className={`text-2xl font-bold font-heading ${s.color}`}>{s.value}</p>
            <p className="text-gray-500 text-xs mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by name, email, phone, course..."
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary-400" />
        </div>
        <div className="relative">
          <FiFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
            className="pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary-400 bg-white">
            <option value="">All Status</option>
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>
      </div>

      {/* List */}
      <div className="space-y-3">
        {loading ? (
          [1,2,3,4].map(i => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 h-20 animate-pulse" />
          ))
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
            <FiMessageSquare className="text-gray-300 mx-auto mb-3" size={40} />
            <p className="text-gray-500 font-semibold">
              {list.length === 0 ? 'No enquiries yet' : 'No results match your filter'}
            </p>
          </div>
        ) : (
          filtered.map(e => {
            const isOpen = expanded === e._id
            const cfg = statusConfig[e.status] ?? statusConfig.new
            return (
              <div key={e._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                {/* Row */}
                <div
                  className="flex items-center gap-4 px-5 py-4 cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => setExpanded(isOpen ? null : e._id)}>

                  {/* Avatar */}
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 font-bold text-white text-sm"
                    style={{ background: 'linear-gradient(135deg,#2B3488,#CC2229)' }}>
                    {e.name?.charAt(0)?.toUpperCase() ?? '?'}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold text-gray-800 text-sm">{e.name}</p>
                      {e.status === 'new' && (
                        <span className="w-2 h-2 rounded-full bg-blue-500 inline-block" title="New" />
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-3 mt-0.5 text-xs text-gray-400">
                      <span className="flex items-center gap-1"><FiMail size={10} /> {e.email}</span>
                      {e.phone && <span className="flex items-center gap-1"><FiPhone size={10} /> {e.phone}</span>}
                      {e.course && <span className="text-primary-600 font-medium">{e.course}</span>}
                    </div>
                  </div>

                  {/* Right side */}
                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right hidden sm:block">
                      <p className="text-xs text-gray-400">{timeAgo(e.createdAt)}</p>
                      <p className="text-[11px] text-gray-300">{formatDate(e.createdAt)}</p>
                    </div>
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg border ${cfg.cls}`}>
                      {cfg.label}
                    </span>
                    {isOpen ? <FiChevronUp size={15} className="text-gray-400" /> : <FiChevronDown size={15} className="text-gray-400" />}
                  </div>
                </div>

                {/* Expanded detail */}
                {isOpen && (
                  <div className="border-t border-gray-100 px-5 py-4 bg-gray-50 space-y-4">
                    {/* Message */}
                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Message</p>
                      <p className="text-sm text-gray-700 leading-relaxed bg-white rounded-xl p-4 border border-gray-100">{e.message}</p>
                    </div>

                    {/* Meta */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                      <div className="bg-white rounded-xl px-3 py-2 border border-gray-100">
                        <p className="text-gray-400 mb-0.5">Submitted</p>
                        <p className="font-semibold text-gray-700">{formatDate(e.createdAt)}</p>
                      </div>
                      {e.course && (
                        <div className="bg-white rounded-xl px-3 py-2 border border-gray-100">
                          <p className="text-gray-400 mb-0.5">Interested In</p>
                          <p className="font-semibold text-gray-700">{e.course}</p>
                        </div>
                      )}
                      <div className="bg-white rounded-xl px-3 py-2 border border-gray-100">
                        <p className="text-gray-400 mb-0.5">Email</p>
                        <a href={`mailto:${e.email}`} className="font-semibold text-primary-600 hover:underline">{e.email}</a>
                      </div>
                      {e.phone && (
                        <div className="bg-white rounded-xl px-3 py-2 border border-gray-100">
                          <p className="text-gray-400 mb-0.5">Phone</p>
                          <a href={`tel:${e.phone}`} className="font-semibold text-primary-600 hover:underline">{e.phone}</a>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-3 flex-wrap pt-1">
                      <p className="text-xs font-semibold text-gray-500">Update Status:</p>
                      {(['new', 'contacted', 'resolved'] as const).map(s => (
                        <button key={s} onClick={() => updateStatus(e._id, s)}
                          disabled={e.status === s || updatingStatus === e._id}
                          className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all disabled:opacity-50 ${
                            e.status === s
                              ? statusConfig[s].cls + ' cursor-default'
                              : 'bg-white text-gray-600 border-gray-200 hover:border-primary-300 hover:text-primary-600'
                          }`}>
                          {updatingStatus === e._id ? '...' : statusConfig[s].label}
                        </button>
                      ))}
                      <div className="ml-auto flex gap-2">
                        <a href={`mailto:${e.email}`}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-primary-600 text-white text-xs font-semibold rounded-lg hover:bg-primary-700 transition-all">
                          <FiMail size={11} /> Reply
                        </a>
                        {e.phone && (
                          <a href={`tel:${e.phone}`}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-green-600 text-white text-xs font-semibold rounded-lg hover:bg-green-700 transition-all">
                            <FiPhone size={11} /> Call
                          </a>
                        )}
                        <button onClick={() => handleDelete(e._id)} disabled={deleting === e._id}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-600 text-xs font-semibold rounded-lg hover:bg-red-100 border border-red-100 transition-all disabled:opacity-50">
                          <FiTrash2 size={11} /> {deleting === e._id ? '...' : 'Delete'}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
