import type { Metadata } from 'next'
import Link from 'next/link'
import { FiArrowRight, FiCheckCircle, FiPhone, FiMail } from 'react-icons/fi'

export const metadata: Metadata = {
  title: 'Services | TIMS Online',
  description: 'Explore TIMS services — Embassy Attestation, Credit Transfer, Distance Education, Admission Assistance, Study Materials, and more.',
}

const services = [
  {
    icon: '🌐',
    title: 'Embassy Attestation',
    tagline: 'Official document attestation for overseas use',
    description:
      'TIMS assists students and professionals with attestation of educational and non-educational documents for embassy submissions, visa applications, and overseas employment. We handle the full process — from notary to MEA and embassy stamp.',
    features: [
      'Educational certificate attestation (Degree, Diploma, Mark sheets)',
      'Non-educational document attestation (Birth certificate, Marriage certificate)',
      'MEA (Ministry of External Affairs) attestation',
      'Embassy / Consulate attestation',
      'Apostille attestation for Hague Convention countries',
      'Fast-track processing available',
    ],
    color: 'bg-blue-50 border-blue-200',
    iconBg: 'bg-blue-100',
    badge: 'bg-blue-600',
  },
  {
    icon: '🔄',
    title: 'Credit Transfer',
    tagline: 'Seamlessly move credits between institutions',
    description:
      'Switching universities or returning to education after a break? TIMS facilitates academic credit transfer between institutions, helping you avoid repeating subjects you have already completed. We liaise with both the source and destination university on your behalf.',
    features: [
      'Transfer credits from any UGC-recognised university',
      'Lateral entry assistance for degree programs',
      'Equivalent subject mapping and evaluation',
      'Documentation support and follow-up',
      'Works with all TIMS partner universities',
      'No repeat of already-completed subjects',
    ],
    color: 'bg-purple-50 border-purple-200',
    iconBg: 'bg-purple-100',
    badge: 'bg-purple-600',
  },
  {
    icon: '🎓',
    title: 'Distance Education',
    tagline: 'UGC-approved degrees from top universities',
    description:
      'TIMS is an authorised study centre for multiple UGC-DEB approved universities across India. We provide end-to-end support for students enrolling in distance education programs — from admission to exam registration and result tracking.',
    features: [
      'SSLC / Plus Two via NIOS, Jamia Urdu, BOSSE',
      'UG programs: BA, B.Com, BCA, B.Sc',
      'PG programs: MA, M.Com, MCA, M.Sc, MBA',
      'B.Tech / M.Tech via AICTE-recognised universities',
      'Diploma and certificate programs',
      'Study material delivery and guidance',
    ],
    color: 'bg-green-50 border-green-200',
    iconBg: 'bg-green-100',
    badge: 'bg-green-600',
  },
  {
    icon: '🏫',
    title: 'Online Admission Assistance',
    tagline: 'Guidance for admissions in India and abroad',
    description:
      'Not sure which university or program to choose? Our expert counsellors provide personalised guidance for admissions to the best institutes in India and abroad — analysing your eligibility, goals, and budget to recommend the perfect fit.',
    features: [
      'One-on-one counselling sessions',
      'University shortlisting based on eligibility',
      'Application form filling and submission',
      'Document verification and preparation',
      'Admission to institutes in India and overseas',
      'Post-admission support and onboarding',
    ],
    color: 'bg-orange-50 border-orange-200',
    iconBg: 'bg-orange-100',
    badge: 'bg-orange-600',
  },
  {
    icon: '📚',
    title: 'Study Materials',
    tagline: 'Course materials for all affiliated universities',
    description:
      'TIMS provides comprehensive study materials for all programs offered through our partner universities. Materials are curated by subject experts and updated regularly to align with current syllabi, ensuring students are exam-ready.',
    features: [
      'Printed and digital study materials',
      'Syllabus-aligned content for each subject',
      'Previous year question papers and solutions',
      'Available for AMU, Andhra, GLA, SVSU, Mizoram University',
      'Supplementary notes and revision guides',
      'Quick delivery to your doorstep',
    ],
    color: 'bg-indigo-50 border-indigo-200',
    iconBg: 'bg-indigo-100',
    badge: 'bg-indigo-600',
  },
  {
    icon: '✍️',
    title: 'Tutor Mark Assignment (TMA)',
    tagline: 'Expert support for assignment submission',
    description:
      'Many distance programs require Tutor Mark Assignments (TMAs) as part of internal assessment. TIMS helps students understand assignment requirements, structure their answers, and meet submission deadlines — improving your internal marks and overall grade.',
    features: [
      'Assignment question paper distribution',
      'Subject-wise guidance from experienced tutors',
      'Structured answer writing support',
      'Timely submission to universities',
      'Available for all TIMS partner universities',
      'Track submission and marks online',
    ],
    color: 'bg-rose-50 border-rose-200',
    iconBg: 'bg-rose-100',
    badge: 'bg-rose-600',
  },
]

const steps = [
  { step: '01', title: 'Book a Consultation', desc: 'Call or message us to schedule a free counselling session with our experts.' },
  { step: '02', title: 'Share Your Requirements', desc: 'Tell us your goals, documents needed, or the service you require.' },
  { step: '03', title: 'We Handle the Process', desc: 'Our team manages all paperwork, follow-ups, and submissions on your behalf.' },
  { step: '04', title: 'Track & Receive', desc: 'Get real-time updates and receive your processed documents or admission letter.' },
]

export default function ServicesPage() {
  return (
    <div className="pt-24">

      {/* ── Hero ── */}
      <section className="bg-[#f7f7f5] min-h-[90vh] flex items-center px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-50"
          style={{ backgroundImage: 'radial-gradient(circle, #cbd5e1 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
        <div className="absolute top-0 right-0 w-80 h-80 bg-primary-100 rounded-full translate-x-28 -translate-y-28 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-60 h-60 bg-white/5 rounded-full -translate-x-20 translate-y-20 blur-2xl" />

        <div className="relative max-w-7xl mx-auto text-center">
          <p className="text-accent font-semibold text-sm uppercase tracking-widest mb-3">What We Offer</p>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 font-heading mb-4">Our Services</h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto mb-6">
            From admission guidance to embassy attestation — TIMS provides end-to-end education support services designed to make your academic journey smooth and successful.
          </p>
          <div className="flex items-center justify-center gap-2 text-gray-500 text-sm mb-10">
            <Link href="/" className="text-gray-500 hover:text-[#CC2229] transition-colors">Home</Link>
            <span>/</span>
            <span className="text-accent">Services</span>
          </div>

          {/* Quick stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {[
              { v: '6+', l: 'Core Services' },
              { v: '15+', l: 'Years Experience' },
              { v: '10,000+', l: 'Students Served' },
              { v: '100%', l: 'Satisfaction Focus' },
            ].map((s) => (
              <div key={s.l} className="bg-white  rounded-2xl p-4 text-center border border-white/15">
                <p className="text-2xl font-bold text-gray-900 font-heading">{s.v}</p>
                <p className="text-gray-500 text-xs mt-0.5">{s.l}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 50" fill="none"><path d="M0,25 C360,50 1080,0 1440,25 L1440,50 L0,50 Z" fill="white" /></svg>
        </div>
      </section>

      {/* ── Services Grid ── */}
      <section className="bg-gray-50 py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-primary-600 font-semibold text-sm uppercase tracking-widest mb-2">Services</p>
            <h2 className="text-3xl font-bold text-primary-800 font-heading mb-3">Everything You Need, Under One Roof</h2>
            <p className="text-gray-500 max-w-xl mx-auto text-sm">
              TIMS is more than an education consultancy. We are your complete academic partner — from choosing the right course to getting your certificates attested.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {services.map((svc) => (
              <div key={svc.title}
                className={`bg-white rounded-3xl border shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all overflow-hidden ${svc.color}`}>

                {/* Card header */}
                <div className="bg-hero-gradient p-7 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full translate-x-10 -translate-y-10" />
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-primary-100 rounded-full -translate-x-6 translate-y-6" />
                  <div className="relative flex items-start gap-4">
                    <div className="text-5xl">{svc.icon}</div>
                    <div>
                      <span className={`text-xs font-bold px-3 py-1 rounded-full text-white mb-2 inline-block ${svc.badge}`}>
                        Service
                      </span>
                      <h3 className="text-white font-bold font-heading text-xl leading-snug">{svc.title}</h3>
                      <p className="text-gray-500 text-sm mt-0.5">{svc.tagline}</p>
                    </div>
                  </div>
                </div>

                {/* Card body */}
                <div className="p-7">
                  <p className="text-gray-600 text-sm leading-relaxed mb-5">{svc.description}</p>

                  <h4 className="font-bold text-primary-800 text-sm mb-3">What is included:</h4>
                  <ul className="space-y-2 mb-6">
                    {svc.features.map((f) => (
                      <li key={f} className="flex items-start gap-2.5 text-sm text-gray-700">
                        <FiCheckCircle className="text-primary-600 shrink-0 mt-0.5" size={14} />
                        {f}
                      </li>
                    ))}
                  </ul>

                  <Link href="/contact"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary-600 text-white font-semibold text-sm rounded-xl hover:bg-primary-700 transition-all shadow-sm">
                    Enquire About This Service <FiArrowRight size={14} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="bg-white py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-primary-600 font-semibold text-sm uppercase tracking-widest mb-2">Process</p>
            <h2 className="text-3xl font-bold text-primary-800 font-heading">How TIMS Works With You</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {steps.map((s, i) => (
              <div key={s.step} className="relative text-center">
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-1/2 w-full h-0.5 bg-gradient-to-r from-primary-200 to-primary-100" />
                )}
                <div className="relative mx-auto w-16 h-16 rounded-2xl bg-hero-gradient flex items-center justify-center mb-4 shadow-md">
                  <span className="text-white font-extrabold text-lg font-heading">{s.step}</span>
                </div>
                <h3 className="font-bold text-primary-800 font-heading text-base mb-2">{s.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Contact strip ── */}
      <section className="bg-gray-50 py-10 px-4">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 bg-hero-gradient rounded-3xl p-8 relative overflow-hidden">
            <div className="absolute inset-0 opacity-50"
              style={{ backgroundImage: 'radial-gradient(circle, #cbd5e1 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
            <div className="relative">
              <h2 className="text-2xl font-bold text-gray-900 font-heading mb-2">Not sure which service you need?</h2>
              <p className="text-gray-600 text-sm mb-5">Our counsellors will listen to your situation and recommend exactly what you need — completely free of charge.</p>
              <div className="flex flex-wrap gap-3">
                <Link href="/contact"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-white font-bold rounded-xl hover:bg-accent-dark transition-all shadow-md text-sm">
                  Get Free Guidance <FiArrowRight />
                </Link>
                <Link href="/courses"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white text-gray-700 font-semibold rounded-xl border-2 border-gray-300 hover:bg-gray-50 transition-all text-sm">
                  Browse Programs
                </Link>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 flex flex-col justify-center gap-5">
            <h3 className="font-bold text-primary-800 font-heading text-base">Reach Us Directly</h3>
            <a href="tel:+917736111588"
              className="flex items-center gap-3 text-sm text-gray-700 hover:text-accent transition-colors font-medium">
              <div className="w-9 h-9 rounded-xl bg-accent/10 flex items-center justify-center">
                <FiPhone className="text-accent" size={16} />
              </div>
              +91 7736 1115 88
            </a>
            <a href="mailto:info@timseducation.com"
              className="flex items-center gap-3 text-sm text-gray-700 hover:text-accent transition-colors font-medium">
              <div className="w-9 h-9 rounded-xl bg-primary-50 flex items-center justify-center">
                <FiMail className="text-primary-600" size={16} />
              </div>
              info@timseducation.com
            </a>
            <p className="text-gray-400 text-xs">Mon – Sat · 9:00 AM – 6:00 PM</p>
          </div>
        </div>
      </section>

    </div>
  )
}
