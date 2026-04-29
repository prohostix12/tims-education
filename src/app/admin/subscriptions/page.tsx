'use client'
import { useEffect, useState } from 'react'
import { FiMail, FiTrash2, FiDownload, FiRefreshCw, FiSearch } from 'react-icons/fi'

interface Subscription {
  _id: string
  email: string
  name: string
  createdAt: string
}

export default function SubscriptionsPage() {
  const [subs, setSubs]       = useState<Subscription[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch]   = useState('')
  const [deleting, setDeleting] = useState<string | null>(null)

  const load = async () => {
    setLoading(true)
    const r = await fetch('/api/admin/subscriptions')
    const d = await r.json()
    setSubs(d.subscriptions ?? [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const del = async (id: string) => {
    if (!confirm('Remove this subscriber?')) return
    setDeleting(id)
    await fetch('/api/admin/subscriptions', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    setSubs(p => p.filter(s => s._id !== id))
    setDeleting(null)
  }

  const exportCSV = () => {
    const rows = [['Name', 'Email', 'Subscribed At'], ...filtered.map(s => [s.name || '', s.email, new Date(s.createdAt).toLocaleDateString('en-IN')])]
    const csv = rows.map(r => r.map(v => `"${v}"`).join(',')).join('\n')
    const a = document.createElement('a')
    a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }))
    a.download = 'tims_subscribers.csv'
    a.click()
  }

  const filtered = subs.filter(s =>
    s.email.toLowerCase().includes(search.toLowerCase()) ||
    (s.name || '').toLowerCase().includes(search.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Newsletter Subscribers</h1>
          <p className="text-sm text-gray-500 mt-0.5">{subs.length} total subscriber{subs.length !== 1 ? 's' : ''}</p>
        </div>
        <div className="flex gap-2">
          <button onClick={load}
            className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition-all">
            <FiRefreshCw size={14} /> Refresh
          </button>
          <button onClick={exportCSV} disabled={filtered.length === 0}
            className="flex items-center gap-2 px-4 py-2 bg-primary-700 text-white rounded-xl text-sm font-semibold hover:bg-primary-800 transition-all disabled:opacity-40">
            <FiDownload size={14} /> Export CSV
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search email or name…"
          className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary-400"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <span className="w-7 h-7 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <FiMail size={32} className="mx-auto mb-3 opacity-40" />
            <p className="font-semibold">{search ? 'No results found' : 'No subscribers yet'}</p>
            <p className="text-sm mt-1">{search ? 'Try a different search' : 'Newsletter signups will appear here'}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">#</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Email</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Name</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Subscribed</th>
                  <th className="px-5 py-3.5" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((s, i) => (
                  <tr key={s._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4 text-gray-400">{i + 1}</td>
                    <td className="px-5 py-4 font-medium text-gray-800">{s.email}</td>
                    <td className="px-5 py-4 text-gray-500">{s.name || <span className="text-gray-300">—</span>}</td>
                    <td className="px-5 py-4 text-gray-400 text-xs">
                      {new Date(s.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="px-5 py-4">
                      <button onClick={() => del(s._id)} disabled={deleting === s._id}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all disabled:opacity-40">
                        <FiTrash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
