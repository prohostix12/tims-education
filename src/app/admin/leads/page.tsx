'use client'
import { useEffect, useState } from 'react'
import {
  FiMail, FiPhone, FiTrash2, FiSearch, FiFilter,
  FiRefreshCw, FiMessageSquare, FiChevronDown, FiChevronUp, FiZap,
} from 'react-icons/fi'

interface Lead {
  _id: string
  name: string
  email?: string
  phone?: string
  course?: string
  message?: string
  source: string
  status: 'new' | 'contacted' | 'resolved'
  createdAt: string
}

const statusConfig: Record<string, { label: string; cls: string }> = {
  new:       { label: 'New',       cls: 'bg-blue-50 text-blue-700 border-blue-200' },
  contacted: { label: 'Contacted', cls: 'bg-amber-50 text-amber-700 border-amber-200' },
  resolved:  { label: 'Resolved',  cls: 'bg-green-50 text-green-700 border-green-200' },
}

const sourceConfig: Record<string, { cls: string; icon: string }> = {
  'Course Finder': { cls: 'bg-purple-50 text-purple-700 border-purple-200', icon: '🎯' },
  'Contact Form':  { cls: 'bg-blue-50 text-blue-600 border-blue-200',       icon: '📩' },
  'Newsletter':    { cls: 'bg-green-50 text-green-700 border-green-200',    icon: '📧' },
}

function timeAgo(d: string) {
  const m = Math.floor((Date.now() - new Date(d).getTime()) / 60000)
  if (m < 1) return 'Just now'
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  const days = Math.floor(h / 24)
  return days === 1 ? '1 day ago' : `${days} days ago`
}

function fmtDate(d: string) {
  return new Date(d).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

export default function AdminLeads() {
  const [list, setList]               = useState<Lead[]>([])
  const [loading, setLoading]         = useState(true)
  const [search, setSearch]           = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [filterSource, setFilterSource] = useState('')
  const [expanded, setExpanded]       = useState<string | null>(null)
  const [deleting, setDeleting]       = useState<string | null>(null)
  const [updating, setUpdating]       = useState<string | null>(null)

  const load = () => {
    setLoading(true)
    fetch('/api/admin/enquiries', { credentials: 'include' })
      .then(r => r.json())
      .then(d => { setList(Array.isArray(d) ? d : []); setLoading(false) })
      .catch(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const updateStatus = async (id: string, status: string) => {
    setUpdating(id)
    await fetch('/api/admin/enquiries', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ _id: id, status }),
      credentials: 'include',
    })
    setUpdating(null)
    load()
  }

  const deleteLead = async (id: string) => {
    if (!confirm('Delete this lead?')) return
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
    const matchSearch = !q || [e.name, e.email, e.phone, e.course, e.message].some(f => f?.toLowerCase().includes(q))
    const matchStatus = !filterStatus || e.status === filterStatus
    const matchSource = !filterSource || e.source === filterSource
    return matchSearch && matchStatus && matchSource
  })

  const sources = Array.from(new Set(list.map(e => e.source || 'Contact Form')))
  const counts = {
    total:      list.length,
    new:        list.filter(e => e.status === 'new').length,
    finder:     list.filter(e => e.source === 'Course Finder').length,
    newsletter: list.filter(e => e.source === 'Newsletter').length,
    contacted:  list.filter(e => e.status === 'contacted').length,
    resolved:   list.filter(e => e.status === 'resolved').length,
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-xl font-bold text-gray-800 font-heading">Leads & Enquiries</h1>
          <p className="text-gray-500 text-sm">{counts.total} total · {counts.new} new · {counts.finder} Course Finder · {counts.newsletter} Newsletter</p>
        </div>
        <button onClick={load}
          className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 text-gray-600 text-sm font-semibold rounded-xl hover:bg-gray-50 transition-all shadow-sm">
          <FiRefreshCw size={14} /> Refresh
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-6 gap-3">
        {[
          { label: 'Total',         value: counts.total,      color: 'text-gray-800',   bg: 'bg-white' },
          { label: 'New',           value: counts.new,        color: 'text-blue-700',   bg: 'bg-blue-50' },
          { label: 'Course Finder', value: counts.finder,     color: 'text-purple-700', bg: 'bg-purple-50' },
          { label: 'Newsletter',    value: counts.newsletter,  color: 'text-green-700',  bg: 'bg-green-50' },
          { label: 'Contacted',     value: counts.contacted,  color: 'text-amber-700',  bg: 'bg-amber-50' },
          { label: 'Resolved',      value: counts.resolved,   color: 'text-emerald-700', bg: 'bg-emerald-50' },
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
        <select value={filterSource} onChange={e => setFilterSource(e.target.value)}
          className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary-400 bg-white">
          <option value="">All Sources</option>
          {sources.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {/* Lead list */}
      <div className="space-y-3">
        {loading ? (
          [1,2,3,4].map(i => <div key={i} className="bg-white rounded-2xl border border-gray-100 h-20 animate-pulse" />)
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
            <FiMessageSquare className="text-gray-300 mx-auto mb-3" size={40} />
            <p className="text-gray-500 font-semibold">{list.length === 0 ? 'No leads yet' : 'No results match your filter'}</p>
          </div>
        ) : (
          filtered.map(lead => {
            const isOpen   = expanded === lead._id
            const scfg     = statusConfig[lead.status] ?? statusConfig.new
            const srcCfg   = sourceConfig[lead.source] ?? sourceConfig['Contact Form']
            return (
              <div key={lead._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                {/* Row */}
                <div className="flex items-center gap-4 px-5 py-4 cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => setExpanded(isOpen ? null : lead._id)}>

                  {/* Avatar */}
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 font-bold text-white text-sm"
                    style={{ background: 'linear-gradient(135deg,#2B3488,#CC2229)' }}>
                    {lead.name?.charAt(0)?.toUpperCase() ?? '?'}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold text-gray-800 text-sm">{lead.name}</p>
                      {lead.status === 'new' && <span className="w-2 h-2 rounded-full bg-blue-500 inline-block" />}
                    </div>
                    <div className="flex flex-wrap items-center gap-3 mt-0.5 text-xs text-gray-400">
                      {lead.phone && <span className="flex items-center gap-1"><FiPhone size={10} /> {lead.phone}</span>}
                      {lead.email && <span className="flex items-center gap-1"><FiMail size={10} /> {lead.email}</span>}
                      {lead.course && <span className="text-primary-600 font-medium">{lead.course}</span>}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-lg border hidden sm:inline ${srcCfg.cls}`}>
                      {srcCfg.icon} {lead.source || 'Contact Form'}
                    </span>
                    <div className="text-right hidden sm:block">
                      <p className="text-xs text-gray-400">{timeAgo(lead.createdAt)}</p>
                    </div>
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg border ${scfg.cls}`}>{scfg.label}</span>
                    {isOpen ? <FiChevronUp size={15} className="text-gray-400" /> : <FiChevronDown size={15} className="text-gray-400" />}
                  </div>
                </div>

                {/* Expanded */}
                {isOpen && (
                  <div className="border-t border-gray-100 px-5 py-4 bg-gray-50 space-y-4">
                    {lead.message && (
                      <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Message</p>
                        <p className="text-sm text-gray-700 leading-relaxed bg-white rounded-xl p-4 border border-gray-100">{lead.message}</p>
                      </div>
                    )}

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                      <div className="bg-white rounded-xl px-3 py-2 border border-gray-100">
                        <p className="text-gray-400 mb-0.5">Submitted</p>
                        <p className="font-semibold text-gray-700">{fmtDate(lead.createdAt)}</p>
                      </div>
                      <div className="bg-white rounded-xl px-3 py-2 border border-gray-100">
                        <p className="text-gray-400 mb-0.5">Source</p>
                        <p className="font-semibold text-gray-700">{srcCfg.icon} {lead.source || 'Contact Form'}</p>
                      </div>
                      {lead.course && (
                        <div className="bg-white rounded-xl px-3 py-2 border border-gray-100">
                          <p className="text-gray-400 mb-0.5">Interested In</p>
                          <p className="font-semibold text-gray-700">{lead.course}</p>
                        </div>
                      )}
                      {lead.email && (
                        <div className="bg-white rounded-xl px-3 py-2 border border-gray-100">
                          <p className="text-gray-400 mb-0.5">Email</p>
                          <a href={`mailto:${lead.email}`} className="font-semibold text-primary-600 hover:underline">{lead.email}</a>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-3 flex-wrap pt-1">
                      <p className="text-xs font-semibold text-gray-500">Status:</p>
                      {(['new', 'contacted', 'resolved'] as const).map(s => (
                        <button key={s} onClick={() => updateStatus(lead._id, s)}
                          disabled={lead.status === s || updating === lead._id}
                          className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all disabled:opacity-50 ${
                            lead.status === s ? statusConfig[s].cls + ' cursor-default' : 'bg-white text-gray-600 border-gray-200 hover:border-primary-300 hover:text-primary-600'
                          }`}>
                          {updating === lead._id ? '…' : statusConfig[s].label}
                        </button>
                      ))}
                      <div className="ml-auto flex gap-2">
                        {lead.phone && (
                          <a href={`tel:${lead.phone}`}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-green-600 text-white text-xs font-semibold rounded-lg hover:bg-green-700 transition-all">
                            <FiPhone size={11} /> Call
                          </a>
                        )}
                        {lead.email && (
                          <a href={`mailto:${lead.email}`}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-primary-600 text-white text-xs font-semibold rounded-lg hover:bg-primary-700 transition-all">
                            <FiMail size={11} /> Reply
                          </a>
                        )}
                        <button onClick={() => deleteLead(lead._id)} disabled={deleting === lead._id}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-600 text-xs font-semibold rounded-lg hover:bg-red-100 border border-red-100 transition-all disabled:opacity-50">
                          <FiTrash2 size={11} /> {deleting === lead._id ? '…' : 'Delete'}
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
