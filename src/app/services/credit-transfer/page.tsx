import type { Metadata } from 'next'
import Link from 'next/link'
import { FiCheckCircle, FiArrowRight, FiPhone } from 'react-icons/fi'

export const metadata: Metadata = {
  title: 'Credit Transfer Services | TIMS Online',
  description: 'Seamlessly continue your academic journey with TIMS credit transfer services. Transfer credits from any UGC-recognised university without repeating completed subjects.',
}

const benefits = [
  {
    icon: '🧠',
    title: 'Prior Learning Recognition',
    desc: 'We acknowledge the academic efforts you have already put in. Credit transfer allows recognition of your prior learning, ensuring you do not have to start from scratch.',
  },
  {
    icon: '⚡',
    title: 'Accelerated Progress',
    desc: 'Transfer credits enable faster program completion and help you reach your educational and career goals without unnecessary delays.',
  },
  {
    icon: '🎓',
    title: 'Higher Degree Access',
    desc: 'Credit transfer makes pursuing higher degrees more feasible. It provides a stepping stone for your academic advancement and career growth.',
  },
  {
    icon: '💰',
    title: 'Significant Cost Savings',
    desc: 'You will not need to pay for courses you have already studied. Credit transfer can result in meaningful financial savings on your education.',
  },
  {
    icon: '🗺️',
    title: 'Personalised Pathways',
    desc: 'Transfer credits strategically to tailor your academic pathway. Choose courses that align with your interests, career goals, and schedule.',
  },
  {
    icon: '🔄',
    title: 'Flexible Transitions',
    desc: 'Whether you are switching universities, returning after a break, or pursuing a lateral entry, TIMS ensures a smooth and stress-free transition.',
  },
]

const steps = [
  {
    num: '01',
    icon: '📄',
    title: 'Credit Evaluation',
    desc: 'Submit your previous university transcripts and mark sheets. Our team evaluates the subjects and credits you have already earned.',
  },
  {
    num: '02',
    icon: '🗂️',
    title: 'Approval & Mapping',
    desc: 'We determine equivalent courses at the new university. Each completed subject is mapped to its equivalent in the new program curriculum.',
  },
  {
    num: '03',
    icon: '📋',
    title: 'Customised Academic Plan',
    desc: 'We outline the remaining courses and credits you need to complete your degree, giving you a clear and personalised roadmap.',
  },
  {
    num: '04',
    icon: '✅',
    title: 'Seamless Integration',
    desc: 'Approved credits are incorporated into your new program. You start exactly where you left off — saving time, money, and effort.',
  },
]

const eligibility = [
  'Students who enrolled in a UGC-recognised university but could not complete their degree',
  'Working professionals who started a degree program years ago and want to resume',
  'Students who want to switch universities due to relocation, financial reasons, or course preference',
  'Graduates seeking lateral entry into a higher-level program',
  'Students who completed partial credits at a university abroad',
  'Anyone looking to avoid repeating subjects already cleared with a pass grade',
]

const faqs = [
  {
    q: 'Which universities support credit transfer?',
    a: 'Most UGC-DEB approved universities support credit transfer to some degree. TIMS works primarily with Glocal University, GLA University, SVSU, and others. We assess compatibility before initiating the process.',
  },
  {
    q: 'How long does the credit transfer process take?',
    a: 'The evaluation typically takes 7–15 working days. University approval and integration into your new program can take 30–60 days depending on the institution.',
  },
  {
    q: 'Will all my previous credits be accepted?',
    a: 'Not necessarily. Credit acceptance depends on subject equivalency and the policies of the new university. Our team maps your subjects carefully and tells you in advance what will and will not transfer.',
  },
  {
    q: 'Is there a fee for the credit transfer process?',
    a: 'TIMS charges a service fee for credit transfer facilitation. University-side fees (if any) are separate. Contact us for a detailed cost breakdown for your specific case.',
  },
  {
    q: 'Can I do a credit transfer for a program I studied abroad?',
    a: 'Yes, in many cases. Foreign credits can be evaluated and transferred if the institution and curriculum are recognised by the Association of Indian Universities (AIU). TIMS guides you through the verification process.',
  },
]

export default function CreditTransferPage() {
  return (
    <div className="pt-24">

      {/* ── Hero ── */}
      <section className="bg-[#f7f7f5] min-h-[90vh] flex items-center px-4 relative overflow-hidden">
        <div className="absolute inset-0"
          style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.12) 1.5px, transparent 1.5px)', backgroundSize: '32px 32px' }} />
        <div className="absolute top-0 right-0 w-[480px] h-[480px] bg-accent/15 rounded-full translate-x-28 -translate-y-28 blur-[100px]" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-white/5 rounded-full -translate-x-20 translate-y-20 blur-3xl" />

        <div className="relative max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-gray-500 text-sm mb-6">
            <Link href="/" className="text-gray-500 hover:text-[#CC2229] transition-colors">Home</Link>
            <span>/</span>
            <Link href="/services" className="hover:text-accent transition-colors">Services</Link>
            <span>/</span>
            <span className="text-accent">Credit Transfer</span>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block px-4 py-1.5 bg-accent text-white text-xs font-bold rounded-full mb-4 uppercase tracking-wider">
                Service
              </span>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 font-heading leading-tight mb-5">
                Seamlessly Continue<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-red-300">
                  Your Academic Journey
                </span>
              </h1>
              <p className="text-gray-600 text-lg leading-relaxed mb-8">
                Life happens — and sometimes education gets paused. TIMS credit transfer services help you pick up exactly where you left off, without repeating subjects you have already completed.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link href="/contact"
                  className="inline-flex items-center gap-2 px-7 py-3.5 bg-accent text-white font-bold rounded-xl hover:bg-accent-dark transition-all shadow-lg">
                  Start the Process <FiArrowRight />
                </Link>
                <a href="tel:+917736111588"
                  className="inline-flex items-center gap-2 px-7 py-3.5 bg-white text-gray-700 font-semibold rounded-xl border-2 border-gray-300 hover:bg-gray-50 transition-all">
                  <FiPhone size={15} /> Talk to Us
                </a>
              </div>
            </div>

            {/* Right card */}
            <div className="hidden lg:block">
              <div className="bg-white backdrop-blur-md rounded-3xl p-8 border border-gray-100">
                <p className="text-white font-bold font-heading text-lg mb-5">Who Is This For?</p>
                <ul className="space-y-3">
                  {[
                    'Dropped out of college and want to complete your degree',
                    'Switched universities mid-program',
                    'Working professional who started a degree long ago',
                    'Student looking for lateral entry',
                    'Studied abroad and want Indian recognition',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-gray-600 text-sm">
                      <FiCheckCircle className="text-accent shrink-0 mt-0.5" size={15} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 50" fill="none"><path d="M0,25 C360,50 1080,0 1440,25 L1440,50 L0,50 Z" fill="white" /></svg>
        </div>
      </section>

      {/* ── Benefits ── */}
      <section className="bg-gray-50 py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-primary-600 font-semibold text-sm uppercase tracking-widest mb-2">Why Credit Transfer</p>
            <h2 className="text-3xl font-bold text-primary-800 font-heading mb-3">6 Key Benefits</h2>
            <p className="text-gray-500 max-w-xl mx-auto text-sm">
              Credit transfer is not just about saving time — it is about respecting the effort you have already put into your education.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {benefits.map((b) => (
              <div key={b.title}
                className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all">
                <div className="w-12 h-12 rounded-xl bg-primary-50 border border-primary-100 flex items-center justify-center text-2xl mb-4">
                  {b.icon}
                </div>
                <h3 className="font-bold text-primary-800 font-heading text-base mb-2">{b.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Process ── */}
      <section className="bg-white py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-primary-600 font-semibold text-sm uppercase tracking-widest mb-2">The Process</p>
            <h2 className="text-3xl font-bold text-primary-800 font-heading">4 Simple Steps</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
            <div className="hidden md:block absolute top-12 left-20 right-20 h-0.5 bg-gradient-to-r from-primary-200 via-accent/30 to-primary-200" />
            {steps.map((s) => (
              <div key={s.num} className="flex flex-col items-center text-center">
                <div className="relative w-24 h-24 rounded-3xl bg-hero-gradient flex flex-col items-center justify-center shadow-xl mb-5 z-10 border-4 border-white">
                  <span className="text-3xl mb-1">{s.icon}</span>
                  <span className="text-gray-600 text-xs font-bold">{s.num}</span>
                </div>
                <h3 className="font-bold text-primary-800 font-heading text-base mb-2">{s.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Eligibility ── */}
      <section className="bg-gray-50 py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-primary-600 font-semibold text-sm uppercase tracking-widest mb-2">Eligibility</p>
            <h2 className="text-3xl font-bold text-primary-800 font-heading">Who Can Apply?</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {eligibility.map((e) => (
              <div key={e} className="flex items-start gap-3 bg-white rounded-xl px-5 py-4 border border-gray-100 shadow-sm text-sm text-gray-700">
                <FiCheckCircle className="text-primary-600 shrink-0 mt-0.5" size={15} />
                {e}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="bg-white py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-primary-600 font-semibold text-sm uppercase tracking-widest mb-2">Questions</p>
            <h2 className="text-3xl font-bold text-primary-800 font-heading">Frequently Asked</h2>
          </div>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <details key={i} className="bg-gray-50 rounded-2xl border border-gray-100 group open:bg-primary-50 open:border-primary-200 transition-all">
                <summary className="flex items-center justify-between p-5 cursor-pointer font-semibold text-primary-800 text-sm group-open:text-primary-600">
                  {faq.q}
                  <span className="text-primary-600 text-xl font-bold group-open:rotate-45 transition-transform inline-block shrink-0 ml-3">+</span>
                </summary>
                <p className="px-5 pb-5 text-gray-600 text-sm leading-relaxed border-t border-primary-100 pt-3">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="bg-gray-50 py-14 px-4">
        <div className="max-w-3xl mx-auto rounded-3xl p-10 text-center relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #CC2229 0%, #2B3488 100%)' }}>
          <div className="absolute inset-0 opacity-10"
            style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '25px 25px' }} />
          <div className="relative">
            <h2 className="text-2xl md:text-3xl font-bold text-white font-heading mb-3">Ready to Continue Your Degree?</h2>
            <p className="text-white/80 mb-6">Speak to our counsellors — we will evaluate your previous credits and tell you exactly how much you have already completed.</p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link href="/contact"
                className="inline-flex items-center gap-2 px-7 py-3 bg-accent text-white font-bold rounded-xl hover:bg-accent-dark transition-all shadow-lg">
                Get Free Assessment <FiArrowRight />
              </Link>
              <a href="tel:+917736111588"
                className="inline-flex items-center gap-2 px-7 py-3 bg-white text-gray-700 font-semibold rounded-xl border-2 border-gray-300 hover:bg-gray-50 transition-all">
                <FiPhone size={14} /> +91 7736 1115 88
              </a>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}
