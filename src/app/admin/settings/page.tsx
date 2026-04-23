'use client'
import { useState, useEffect, useRef } from 'react'
import { FiUpload, FiSave, FiImage, FiCheck } from 'react-icons/fi'

type SettingsState = {
  heroStudentImage: string
  logoIcon: string
  awardPhoto: string
}

type UploadField = 'hero' | 'logo' | 'award'

function ImageField({
  label,
  hint,
  value,
  uploading,
  fieldKey,
  previewClass,
  onChange,
  onUpload,
}: {
  label: string
  hint: string
  value: string
  uploading: UploadField | null
  fieldKey: UploadField
  previewClass?: string
  onChange: (v: string) => void
  onUpload: (file: File, field: UploadField) => void
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
      <h2 className="font-semibold text-gray-800 flex items-center gap-2"><FiImage size={16} /> {label}</h2>
      <p className="text-xs text-gray-500">{hint}</p>

      {value && (
        <img
          src={value}
          alt="Preview"
          className={previewClass ?? 'h-40 w-auto rounded-xl border border-gray-200 object-contain bg-gray-50'}
        />
      )}

      <div className="flex items-center gap-3">
        <input
          type="text"
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder="Paste URL or upload"
          className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
        />
        <button
          onClick={() => inputRef.current?.click()}
          disabled={uploading === fieldKey}
          className="flex items-center gap-2 px-4 py-2.5 bg-primary-600 text-white text-sm font-semibold rounded-xl hover:bg-primary-700 transition-all disabled:opacity-60"
        >
          {uploading === fieldKey
            ? <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            : <FiUpload size={14} />}
          Upload
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={e => e.target.files?.[0] && onUpload(e.target.files[0], fieldKey)}
        />
      </div>
    </div>
  )
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SettingsState>({ heroStudentImage: '', logoIcon: '', awardPhoto: '' })
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [uploading, setUploading] = useState<UploadField | null>(null)

  useEffect(() => {
    fetch('/api/admin/settings', { credentials: 'include' })
      .then(r => r.json())
      .then(d => setSettings({
        heroStudentImage: d.heroStudentImage || '',
        logoIcon: d.logoIcon || '',
        awardPhoto: d.awardPhoto || '',
      }))
  }, [])

  async function uploadFile(file: File, field: UploadField) {
    setUploading(field)
    const fd = new FormData()
    fd.append('file', file)
    const res = await fetch('/api/admin/upload', { method: 'POST', body: fd, credentials: 'include' })
    const data = await res.json()
    setUploading(null)
    if (data.url) {
      const key = field === 'hero' ? 'heroStudentImage' : field === 'logo' ? 'logoIcon' : 'awardPhoto'
      setSettings(prev => ({ ...prev, [key]: data.url }))
    }
  }

  async function handleSave() {
    setSaving(true)
    await fetch('/api/admin/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings),
      credentials: 'include',
    })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const set = (key: keyof SettingsState) => (v: string) => setSettings(prev => ({ ...prev, [key]: v }))

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Site Settings</h1>
        <p className="text-sm text-gray-500 mt-1">Manage homepage images and branding.</p>
      </div>

      <ImageField
        label="Hero Student Image"
        hint="Homepage hero section (right side). Recommended: transparent PNG, portrait orientation."
        value={settings.heroStudentImage}
        uploading={uploading}
        fieldKey="hero"
        onChange={set('heroStudentImage')}
        onUpload={uploadFile}
      />

      <ImageField
        label="Company Logo"
        hint="Replaces the default SVG logo in the navbar and footer. Leave blank to use the default."
        value={settings.logoIcon}
        uploading={uploading}
        fieldKey="logo"
        previewClass="h-16 w-auto rounded-xl border border-gray-200 object-contain bg-gray-50 p-2"
        onChange={set('logoIcon')}
        onUpload={uploadFile}
      />

      <ImageField
        label="Award / Honored with Excellence Photo"
        hint="Photo displayed in the 'Honored with Excellence' section at the bottom of the homepage."
        value={settings.awardPhoto}
        uploading={uploading}
        fieldKey="award"
        previewClass="h-48 w-auto rounded-xl border border-gray-200 object-cover bg-gray-50"
        onChange={set('awardPhoto')}
        onUpload={uploadFile}
      />

      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-3 bg-accent text-white font-bold rounded-xl hover:bg-accent-dark transition-all shadow-md disabled:opacity-60"
        >
          {saved
            ? <FiCheck size={16} />
            : saving
              ? <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              : <FiSave size={16} />}
          {saved ? 'Saved!' : saving ? 'Saving…' : 'Save Settings'}
        </button>
      </div>
    </div>
  )
}
