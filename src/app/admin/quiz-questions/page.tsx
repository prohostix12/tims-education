'use client'
import { useEffect, useState } from 'react'
import { FiEdit2, FiRefreshCw, FiPlus, FiTrash2, FiInfo } from 'react-icons/fi'

interface QuizOption {
  value: string
  label: string
  desc:  string
}

interface QuizQuestion {
  _id:      string
  stepId:   string
  order:    number
  question: string
  subtitle: string
  emoji:    string
  active:   boolean
  options:  QuizOption[]
}

const STEP_LABELS: Record<string, string> = {
  qualification: 'Qualification',
  category:      'Program Category',
  interest:      'Subject Area',
  mode:          'Study Mode',
  goal:          'Main Goal',
  budget:        'Budget',
}

const emptyQ = (): Omit<QuizQuestion, '_id'> => ({
  stepId: '', order: 0, question: '', subtitle: '', emoji: '❓', active: true, options: [],
})

export default function QuizQuestionsPage() {
  const [questions, setQuestions] = useState<QuizQuestion[]>([])
  const [loading, setLoading]     = useState(true)
  const [saving, setSaving]       = useState(false)

  // Modal state
  const [modal, setModal]   = useState(false)
  const [editing, setEditing] = useState<QuizQuestion | null>(null)
  const [form, setForm]     = useState(emptyQ())

  const load = async () => {
    setLoading(true)
    const r = await fetch('/api/admin/quiz-questions')
    const d = await r.json()
    setQuestions(d.questions ?? [])
    setLoading(false)
  }
  useEffect(() => { load() }, [])

  const openEdit = (q: QuizQuestion) => {
    setEditing(q)
    setForm({ stepId: q.stepId, order: q.order, question: q.question, subtitle: q.subtitle, emoji: q.emoji, active: q.active, options: q.options.map(o => ({ ...o })) })
    setModal(true)
  }

  const openNew = () => {
    setEditing(null)
    setForm(emptyQ())
    setModal(true)
  }

  const save = async () => {
    if (!form.question.trim()) return alert('Question text is required.')
    setSaving(true)
    const method = editing ? 'PUT' : 'POST'
    const body   = editing ? { _id: editing._id, ...form } : form
    const r = await fetch('/api/admin/quiz-questions', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    if (r.ok) {
      setModal(false)
      await load()
    } else {
      alert('Error saving. Please try again.')
    }
    setSaving(false)
  }

  const del = async (id: string, label: string) => {
    if (!confirm(`Delete question "${label}"? This cannot be undone.`)) return
    await fetch('/api/admin/quiz-questions', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    await load()
  }

  const addOption = () =>
    setForm(p => ({ ...p, options: [...p.options, { value: '', label: '', desc: '' }] }))

  const updateOption = (i: number, field: keyof QuizOption, val: string) =>
    setForm(p => {
      const opts = [...p.options]
      opts[i] = { ...opts[i], [field]: val }
      return { ...p, options: opts }
    })

  const removeOption = (i: number) =>
    setForm(p => ({ ...p, options: p.options.filter((_, j) => j !== i) }))

  const isCategoryStep = form.stepId === 'category'

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Course Finder Questions</h1>
          <p className="text-sm text-gray-500 mt-0.5">Manage the quiz steps shown to students</p>
        </div>
        <div className="flex gap-2">
          <button onClick={load}
            className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition-all">
            <FiRefreshCw size={14} /> Refresh
          </button>
          <button onClick={openNew}
            className="flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-xl text-sm font-semibold hover:bg-accent-dark transition-all">
            <FiPlus size={14} /> Add Step
          </button>
        </div>
      </div>

      {/* Info banner */}
      <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-100 rounded-2xl text-sm text-blue-700">
        <FiInfo size={16} className="shrink-0 mt-0.5" />
        <p>Changes here update the live Course Finder quiz. The option <strong>Value</strong> field is used by the matching algorithm — only change labels and descriptions for existing options. The <strong>Program Category</strong> step options are computed dynamically from student qualification and cannot be edited here.</p>
      </div>

      {/* Questions list */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <span className="w-7 h-7 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
        </div>
      ) : (
        <div className="space-y-3">
          {questions.map((q, i) => (
            <div key={q._id}
              className={`bg-white rounded-2xl border shadow-sm p-5 ${q.active ? 'border-gray-100' : 'border-gray-200 opacity-60'}`}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-xl shrink-0">
                    {q.emoji}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-primary-50 text-primary-700">
                        Step {i + 1} · {STEP_LABELS[q.stepId] ?? q.stepId}
                      </span>
                      {!q.active && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">Hidden</span>
                      )}
                    </div>
                    <p className="font-semibold text-gray-800 mt-1 text-sm">{q.question}</p>
                    {q.subtitle && <p className="text-xs text-gray-400 mt-0.5">{q.subtitle}</p>}
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {q.stepId === 'category' ? (
                        <span className="text-xs px-2.5 py-1 rounded-lg bg-yellow-50 text-yellow-700 border border-yellow-100">
                          Dynamic options (based on qualification)
                        </span>
                      ) : q.options.map(o => (
                        <span key={o.value} className="text-xs px-2.5 py-1 rounded-lg bg-gray-50 text-gray-600 border border-gray-100">
                          {o.label}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button onClick={() => openEdit(q)}
                    className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all">
                    <FiEdit2 size={15} />
                  </button>
                  <button onClick={() => del(q._id, q.question)}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
                    <FiTrash2 size={15} />
                  </button>
                </div>
              </div>
            </div>
          ))}
          {questions.length === 0 && (
            <div className="text-center py-12 text-gray-400 bg-white rounded-2xl border border-gray-100">
              <p className="font-semibold">No quiz steps found</p>
              <p className="text-sm mt-1">Click &quot;Add Step&quot; to create one, or reload to auto-seed defaults.</p>
            </div>
          )}
        </div>
      )}

      {/* Edit / New Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setModal(false)} />
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col"
            style={{ maxHeight: '90vh' }}>

            <div className="px-6 py-5 border-b border-gray-100 shrink-0">
              <h2 className="text-lg font-bold text-gray-900">{editing ? 'Edit Quiz Step' : 'New Quiz Step'}</h2>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              {/* Step ID (only for new) */}
              {!editing && (
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Step ID</label>
                  <input
                    value={form.stepId}
                    onChange={e => setForm(p => ({ ...p, stepId: e.target.value }))}
                    placeholder="e.g. qualification, interest, mode…"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary-400"
                  />
                  <p className="text-xs text-gray-400 mt-1">Used internally — do not change for existing steps.</p>
                </div>
              )}

              <div className="grid grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Emoji</label>
                  <input
                    value={form.emoji}
                    onChange={e => setForm(p => ({ ...p, emoji: e.target.value }))}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-center text-2xl focus:outline-none focus:border-primary-400"
                  />
                </div>
                <div className="col-span-3">
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Order</label>
                  <input
                    type="number"
                    value={form.order}
                    onChange={e => setForm(p => ({ ...p, order: Number(e.target.value) }))}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Question *</label>
                <input
                  value={form.question}
                  onChange={e => setForm(p => ({ ...p, question: e.target.value }))}
                  placeholder="e.g. What's your highest qualification?"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Subtitle / Help text</label>
                <input
                  value={form.subtitle}
                  onChange={e => setForm(p => ({ ...p, subtitle: e.target.value }))}
                  placeholder="Brief description shown below the question"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary-400"
                />
              </div>

              <div className="flex items-center gap-3">
                <input
                  id="active"
                  type="checkbox"
                  checked={form.active}
                  onChange={e => setForm(p => ({ ...p, active: e.target.checked }))}
                  className="w-4 h-4 accent-accent"
                />
                <label htmlFor="active" className="text-sm font-semibold text-gray-700 cursor-pointer">Active (visible in quiz)</label>
              </div>

              {/* Options */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-xs font-semibold text-gray-600">Answer Options</label>
                  {isCategoryStep ? (
                    <span className="text-xs text-yellow-600 bg-yellow-50 px-2.5 py-1 rounded-lg">Dynamic — computed per qualification</span>
                  ) : (
                    <button onClick={addOption}
                      className="flex items-center gap-1.5 text-xs px-3 py-1.5 bg-primary-50 text-primary-700 font-semibold rounded-xl hover:bg-primary-100 transition-all">
                      <FiPlus size={12} /> Add Option
                    </button>
                  )}
                </div>

                {isCategoryStep ? (
                  <p className="text-sm text-gray-400 text-center py-4 bg-gray-50 rounded-xl">
                    Options for this step are automatically generated based on the student&apos;s qualification answer.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {form.options.map((opt, i) => (
                      <div key={i} className="bg-gray-50 rounded-xl p-4 space-y-2.5 border border-gray-100">
                        <div className="flex gap-2">
                          <div className="flex-1">
                            <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Label (shown to student)</label>
                            <input
                              value={opt.label}
                              onChange={e => updateOption(i, 'label', e.target.value)}
                              placeholder="Option label"
                              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-400 bg-white"
                            />
                          </div>
                          <div className="w-36">
                            <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Value (algorithm key)</label>
                            <input
                              value={opt.value}
                              onChange={e => updateOption(i, 'value', e.target.value)}
                              placeholder="e.g. sslc"
                              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-400 bg-white font-mono"
                            />
                          </div>
                          <button onClick={() => removeOption(i)}
                            className="self-end p-2 text-red-400 hover:bg-red-50 rounded-lg transition-all">
                            <FiTrash2 size={14} />
                          </button>
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Description (optional)</label>
                          <input
                            value={opt.desc}
                            onChange={e => updateOption(i, 'desc', e.target.value)}
                            placeholder="Short description shown under label"
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-400 bg-white"
                          />
                        </div>
                      </div>
                    ))}
                    {form.options.length === 0 && (
                      <p className="text-center text-sm text-gray-400 py-4 bg-gray-50 rounded-xl">No options yet. Click &quot;Add Option&quot; to add one.</p>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="px-6 py-5 border-t border-gray-100 flex gap-3 shrink-0">
              <button onClick={() => setModal(false)}
                className="px-5 py-2.5 border border-gray-200 text-gray-600 font-semibold rounded-xl hover:bg-gray-50 transition-all text-sm">
                Cancel
              </button>
              <button onClick={save} disabled={saving}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-accent text-white font-bold rounded-xl text-sm hover:bg-accent-dark transition-all disabled:opacity-50">
                {saving ? <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Saving…</> : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
