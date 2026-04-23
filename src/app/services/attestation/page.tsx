import type { Metadata } from 'next'
import Link from 'next/link'
import { FiCheckCircle, FiArrowRight, FiPhone, FiMail, FiAlertCircle } from 'react-icons/fi'

export const metadata: Metadata = {
  title: 'Certificate Attestation Services | TIMS Online',
  description: 'Fast & trusted certificate attestation services for GCC countries — Bahrain, Kuwait, Oman, Qatar, UAE. TIMS handles MEA, embassy, and notary attestation.',
}

const documentTypes = [
  {
    category: 'Educational Certificates',
    icon: '🎓',
    docs: [
      'SSLC / Class 10 Mark Sheet & Certificate',
      'Plus Two / Class 12 Mark Sheet & Certificate',
      'Degree Certificate (BA, BCom, BSc, BCA)',
      'PG Degree Certificate (MA, MCom, MBA, MCA)',
      'B.Tech / M.Tech Degree Certificate',
      'Diploma & ITI Certificates',
      'NTC / NAC Certificates',
      'AMIE / CA / Professional Certificates',
      'Medical & Nursing Degrees',
    ],
  },
  {
    category: 'Personal Documents',
    icon: '📄',
    docs: [
      'Birth Certificate',
      'Marriage Certificate',
      'Divorce Certificate',
      'Death Certificate',
      'Adoption Certificate',
      'Affidavit & Declarations',
      'Police Clearance Certificate (PCC)',
      'Vaccination / Medical Certificates',
      'Heirship / Legal Heir Certificate',
    ],
  },
  {
    category: 'Commercial & Other',
    icon: '💼',
    docs: [
      'Company Registration Documents',
      'Power of Attorney',
      'Trade & Commerce Certificates',
      'Chamber of Commerce Documents',
      'Export / Import Documents',
      'Bank Statements & Financial Records',
      'Agreements & Contracts',
    ],
  },
]

const steps = [
  {
    num: '01',
    title: 'Submit Your Documents',
    desc: 'Hand over your original or photocopy certificates to our Tirur or Edappal office. We also accept courier.',
    icon: '📥',
  },
  {
    num: '02',
    title: 'Notary & State Attestation',
    desc: 'Documents are first attested by a notary, then processed through the relevant state authority — GAD, HRD, or Home Ministry.',
    icon: '📋',
  },
  {
    num: '03',
    title: 'MEA Attestation',
    desc: 'We forward your documents to the Ministry of External Affairs (MEA) in New Delhi for central government attestation.',
    icon: '🏛️',
  },
  {
    num: '04',
    title: 'Embassy / Consulate Stamp',
    desc: 'Finally, the embassy or consulate of the destination country stamps your documents — completing the full attestation process.',
    icon: '🌐',
  },
  {
    num: '05',
    title: 'Delivery to You',
    desc: 'Attested documents are returned to you in person or via courier. We provide tracking updates throughout the process.',
    icon: '📦',
  },
]

const countries = [
  { name: 'United Arab Emirates', flag: '🇦🇪', short: 'UAE' },
  { name: 'Kingdom of Saudi Arabia', flag: '🇸🇦', short: 'KSA' },
  { name: 'Qatar', flag: '🇶🇦', short: 'Qatar' },
  { name: 'Kuwait', flag: '🇰🇼', short: 'Kuwait' },
  { name: 'Bahrain', flag: '🇧🇭', short: 'Bahrain' },
  { name: 'Oman', flag: '🇴🇲', short: 'Oman' },
]

const states = [
  'Kerala', 'Tamil Nadu', 'Karnataka', 'Andhra Pradesh', 'Telangana',
  'Maharashtra', 'Gujarat', 'Rajasthan', 'Delhi / NCR', 'Uttar Pradesh',
  'Punjab', 'Goa', 'Mizoram', 'Meghalaya', 'Chandigarh', 'Puducherry',
]

export default function AttestationPage() {
  return (
    <div className="pt-24">

      {/* ── Hero ── */}
      <section className="bg-[#f7f7f5] min-h-[90vh] flex items-center px-4 relative overflow-hidden">
        <div className="absolute inset-0"
          style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.12) 1.5px, transparent 1.5px)', backgroundSize: '32px 32px' }} />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/15 rounded-full translate-x-32 -translate-y-32 blur-[100px]" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-white/5 rounded-full -translate-x-20 translate-y-20 blur-3xl" />

        <div className="relative max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-gray-500 text-sm mb-6">
            <Link href="/" className="text-gray-500 hover:text-[#CC2229] transition-colors">Home</Link>
            <span>/</span>
            <Link href="/services" className="hover:text-accent transition-colors">Services</Link>
            <span>/</span>
            <span className="text-accent">Attestation</span>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block px-4 py-1.5 bg-accent text-white text-xs font-bold rounded-full mb-4 uppercase tracking-wider">
                Service
              </span>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 font-heading leading-tight mb-5">
                Fast & Trusted<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-red-300">
                  Certificate Attestation
                </span><br />
                Services for GCC
              </h1>
              <p className="text-gray-600 text-lg leading-relaxed mb-8">
                Planning to work, study, or migrate abroad? TIMS handles complete attestation of your educational and non-educational documents — from notary to MEA to embassy stamp.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link href="/contact"
                  className="inline-flex items-center gap-2 px-7 py-3.5 bg-accent text-white font-bold rounded-xl hover:bg-accent-dark transition-all shadow-lg">
                  Get Started <FiArrowRight />
                </Link>
                <a href="tel:+919961967777"
                  className="inline-flex items-center gap-2 px-7 py-3.5 bg-white text-gray-700 font-semibold rounded-xl border-2 border-gray-300 hover:bg-gray-50 transition-all">
                  <FiPhone size={15} /> Call Now
                </a>
              </div>
            </div>

            {/* Right — country chips */}
            <div className="hidden lg:block">
              <div className="bg-white backdrop-blur-md rounded-3xl p-8 border border-gray-100">
                <p className="text-gray-500 text-sm font-semibold uppercase tracking-wider mb-5">GCC Countries We Serve</p>
                <div className="grid grid-cols-2 gap-3">
                  {countries.map((c) => (
                    <div key={c.name} className="flex items-center gap-3 bg-white rounded-xl px-4 py-3 border border-white/15">
                      <span className="text-2xl">{c.flag}</span>
                      <div>
                        <p className="text-white font-semibold text-sm">{c.short}</p>
                        <p className="text-gray-400 text-xs">{c.name}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 bg-white rounded-xl px-4 py-3 border border-white/15 text-center">
                  <p className="text-gray-500 text-xs">+ Other countries on request</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 50" fill="none"><path d="M0,25 C360,50 1080,0 1440,25 L1440,50 L0,50 Z" fill="white" /></svg>
        </div>
      </section>

      {/* ── Stats strip ── */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { v: '6', l: 'GCC Countries Covered' },
            { v: '80+', l: 'Document Types' },
            { v: '15+', l: 'Indian States Covered' },
            { v: 'Fast', l: 'Turnaround Available' },
          ].map((s) => (
            <div key={s.l} className="text-center py-3">
              <p className="text-2xl font-bold text-primary-800 font-heading">{s.v}</p>
              <p className="text-gray-500 text-xs mt-0.5">{s.l}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Process ── */}
      <section className="bg-gray-50 py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-primary-600 font-semibold text-sm uppercase tracking-widest mb-2">How It Works</p>
            <h2 className="text-3xl font-bold text-primary-800 font-heading mb-3">Attestation Process</h2>
            <p className="text-gray-500 max-w-xl mx-auto text-sm">
              We help to get things done right, avoiding all related problems. TIMS manages the entire chain — so you don't have to.
            </p>
          </div>

          <div className="relative">
            <div className="hidden md:block absolute top-14 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary-200 to-transparent mx-24" />
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
              {steps.map((s) => (
                <div key={s.num} className="flex flex-col items-center text-center">
                  <div className="relative w-16 h-16 rounded-2xl bg-hero-gradient flex items-center justify-center shadow-lg mb-4 z-10">
                    <span className="text-2xl">{s.icon}</span>
                    <span className="absolute -top-2 -right-2 w-6 h-6 bg-accent rounded-full flex items-center justify-center text-white text-xs font-bold">
                      {s.num.replace('0', '')}
                    </span>
                  </div>
                  <h3 className="font-bold text-primary-800 font-heading text-sm mb-2">{s.title}</h3>
                  <p className="text-gray-500 text-xs leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Document types ── */}
      <section className="bg-white py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-primary-600 font-semibold text-sm uppercase tracking-widest mb-2">What We Attest</p>
            <h2 className="text-3xl font-bold text-primary-800 font-heading mb-3">80+ Document Types</h2>
            <p className="text-gray-500 max-w-xl mx-auto text-sm">
              From school certificates to commercial documents — if it needs an official stamp, we handle it.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {documentTypes.map((cat) => (
              <div key={cat.category}
                className="bg-gray-50 rounded-3xl border border-gray-100 overflow-hidden">
                <div className="bg-hero-gradient p-5 flex items-center gap-3 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-white/5 rounded-full translate-x-6 -translate-y-6" />
                  <span className="text-4xl relative">{cat.icon}</span>
                  <h3 className="text-white font-bold font-heading text-base relative">{cat.category}</h3>
                </div>
                <ul className="p-5 space-y-2.5">
                  {cat.docs.map((doc) => (
                    <li key={doc} className="flex items-start gap-2.5 text-sm text-gray-700">
                      <FiCheckCircle className="text-primary-600 shrink-0 mt-0.5" size={14} />
                      {doc}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── States covered ── */}
      <section className="bg-gray-50 py-14 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-primary-600 font-semibold text-sm uppercase tracking-widest mb-2">Coverage</p>
            <h2 className="text-2xl font-bold text-primary-800 font-heading">States We Process From</h2>
          </div>
          <div className="flex flex-wrap gap-2.5 justify-center">
            {states.map((s) => (
              <span key={s} className="px-4 py-2 bg-white border border-gray-200 text-gray-700 text-sm font-medium rounded-xl shadow-sm hover:border-primary-400 hover:text-primary-600 transition-all">
                {s}
              </span>
            ))}
            <span className="px-4 py-2 bg-primary-50 border border-primary-200 text-primary-700 text-sm font-semibold rounded-xl">
              + More states on request
            </span>
          </div>
        </div>
      </section>

      {/* ── Important note ── */}
      <section className="bg-white py-8 px-4">
        <div className="max-w-3xl mx-auto bg-amber-50 rounded-2xl border border-amber-200 p-6 flex items-start gap-4">
          <FiAlertCircle className="text-amber-600 shrink-0 mt-0.5" size={22} />
          <div>
            <p className="font-bold text-amber-800 mb-1">Important Note</p>
            <p className="text-amber-700 text-sm leading-relaxed">
              Attestation requirements vary by destination country and document type. Processing time depends on the state and central government departments involved. TIMS provides accurate timelines and updates throughout the process. Contact us before submitting documents for a free assessment.
            </p>
          </div>
        </div>
      </section>

      {/* ── CTA + Contact ── */}
      <section className="bg-gray-50 py-14 px-4">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 rounded-3xl p-8 relative overflow-hidden"
            style={{ background: 'linear-gradient(135deg, #CC2229 0%, #2B3488 100%)' }}>
            <div className="absolute inset-0 opacity-10"
              style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
            <div className="relative">
              <h2 className="text-2xl font-bold text-white font-heading mb-2">Ready to start your attestation?</h2>
              <p className="text-white/80 text-sm mb-5">Contact our team for a free document assessment and a clear timeline before you submit anything.</p>
              <div className="flex flex-wrap gap-3">
                <Link href="/contact"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-white font-bold rounded-xl hover:bg-accent-dark transition-all shadow-md text-sm">
                  Enquire Now <FiArrowRight />
                </Link>
                <a href="tel:+919961967777"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white text-gray-700 font-semibold rounded-xl border-2 border-gray-300 hover:bg-gray-50 transition-all text-sm">
                  <FiPhone size={13} /> +91 9961 9677 77
                </a>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-7 flex flex-col justify-center gap-4">
            <h3 className="font-bold text-primary-800 font-heading">Our Offices</h3>
            <div>
              <p className="font-semibold text-primary-800 text-sm">Head Office — Tirur</p>
              <a href="tel:+919961967777" className="flex items-center gap-2 text-sm text-gray-600 mt-1 hover:text-accent transition-colors">
                <FiPhone size={13} className="text-accent" /> +91 9961 9677 77
              </a>
            </div>
            <div>
              <p className="font-semibold text-primary-800 text-sm">Branch — Edappal</p>
              <a href="tel:+919526387777" className="flex items-center gap-2 text-sm text-gray-600 mt-1 hover:text-accent transition-colors">
                <FiPhone size={13} className="text-accent" /> +91 9526 3877 77
              </a>
            </div>
            <a href="mailto:info@timseducation.com"
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-accent transition-colors">
              <FiMail size={13} className="text-primary-600" /> info@timseducation.com
            </a>
            <p className="text-gray-400 text-xs">Mon – Sat · 9:00 AM – 6:00 PM</p>
          </div>
        </div>
      </section>

    </div>
  )
}
