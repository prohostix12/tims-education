import type { Metadata } from 'next'
import Link from 'next/link'
import { FiArrowRight, FiCheckCircle, FiPhone, FiMail, FiMapPin, FiAward, FiUsers, FiBookOpen, FiTrendingUp } from 'react-icons/fi'
import DirectorsSection from '@/components/DirectorsSection'

export const metadata: Metadata = { title: 'About Us – TIMSOnline' }

const timeline = [
  { year: '2009', title: 'Foundation', event: 'TIMS was founded in Tirur, Kerala by a team of passionate educators committed to making quality education accessible to all sections of society.' },
  { year: '2012', title: 'University Partnerships', event: 'Signed partnerships with the first batch of UGC-DEB approved universities, enabling students to pursue recognised online and distance degrees.' },
  { year: '2015', title: 'Growing Reach', event: 'Student enrolments crossed 1,000 — with learners from Malappuram, Kozhikode, and Palakkad districts benefitting from flexible learning options.' },
  { year: '2016', title: 'Edappal Centre', event: 'Opened a second counselling and support centre in Edappal to serve a wider student base across northern Kerala.' },
  { year: '2019', title: 'Digital Transformation', event: 'Launched fully online learning support services with digital LMS access, enabling students to study from anywhere in India.' },
  { year: '2021', title: 'Skill Development', event: 'Introduced a dedicated skill development division offering short-term job-ready courses in digital marketing, accounting, and communication.' },
  { year: '2022', title: '10,000 Alumni', event: 'Celebrated a landmark milestone — 10,000 TIMS alumni successfully completing their programs and entering professional careers across India and abroad.' },
  { year: '2024', title: 'Expanded Network', event: 'Onboarded 9+ partner universities including Manipal, Amrita, Jain, and Andhra University — offering 200+ programs across disciplines.' },
]

const values = [
  { title: 'Integrity', desc: 'We provide honest, unbiased guidance with no hidden fees and no false promises. Every recommendation is in the best interest of the student.', icon: '🤝', color: 'bg-blue-50 border-blue-100 text-blue-700' },
  { title: 'Accessibility', desc: 'Quality education must be available to all — regardless of background, location, age, or financial status. We break down every barrier we can.', icon: '🌍', color: 'bg-green-50 border-green-100 text-green-700' },
  { title: 'Lifelong Learning', desc: 'Education is not a one-time event. We walk with students at every stage — from their first degree to advanced certifications later in life.', icon: '📖', color: 'bg-purple-50 border-purple-100 text-purple-700' },
  { title: 'Community', desc: 'Our alumni network spans the country. We foster connections that help graduates find jobs, mentors, and lifelong friendships through learning.', icon: '👥', color: 'bg-orange-50 border-orange-100 text-orange-700' },
  { title: 'Excellence', desc: 'We partner only with universities that are UGC-DEB approved and NAAC accredited — so every degree our students earn is nationally recognised.', icon: '🏆', color: 'bg-yellow-50 border-yellow-100 text-yellow-700' },
  { title: 'Empathy', desc: 'Many of our students are working adults, parents, and career-changers. We design our support around their real lives, not ideal conditions.', icon: '❤️', color: 'bg-red-50 border-red-100 text-red-700' },
]

const team = [
  {
    name: 'Mohammed Riyas',
    role: 'Founder & Director',
    bio: 'A visionary educationist with 15+ years of experience in distance learning, student counselling, and university partnerships. He founded TIMS with the belief that no student should be denied a degree because of circumstance.',
    icon: '👨‍💼',
  },
  {
    name: 'Priya Nair',
    role: 'Academic Head',
    bio: 'Specialist in curriculum design and UGC-DEB compliance. Priya oversees all university tie-ups and ensures every program meets the highest accreditation standards before being offered to students.',
    icon: '👩‍🏫',
  },
  {
    name: 'Shajahan K.',
    role: 'Head of Student Relations',
    bio: 'Shajahan leads our counselling team, personally ensuring every student receives the right program recommendation. He has guided over 5,000 students through their admission journeys.',
    icon: '👨‍💻',
  },
  {
    name: 'Asha Menon',
    role: 'Skill Development Lead',
    bio: 'Industry expert with a background in HR and training. Asha designs and runs all skill development programs, connecting learners with job-ready certifications and placement support.',
    icon: '👩‍🔬',
  },
  {
    name: 'Faisal Rahman',
    role: 'Operations Manager',
    bio: 'Faisal ensures the TIMS experience is seamless — from admission paperwork and fee processing to exam registration and certificate delivery for all partner universities.',
    icon: '👨‍⚙️',
  },
  {
    name: 'Nithya Suresh',
    role: 'Student Support Counsellor',
    bio: 'Dedicated to post-admission student welfare, Nithya manages queries, academic concerns, and re-registration support — making sure no student is left without help.',
    icon: '👩‍💼',
  },
]

const achievements = [
  { icon: <FiUsers size={28} />, value: '10,000+', label: 'Alumni Across India', color: 'text-primary-600' },
  { icon: <FiAward size={28} />, value: '15+', label: 'Years of Excellence', color: 'text-accent' },
  { icon: <FiBookOpen size={28} />, value: '200+', label: 'Programs Offered', color: 'text-green-600' },
  { icon: <FiTrendingUp size={28} />, value: '98%', label: 'Student Satisfaction', color: 'text-purple-600' },
]

const offices = [
  {
    name: 'Tirur – Head Office',
    address: '2nd Floor, Pamls Tower, near Central Bank, Thazhepalam, Tirur, Kerala 676101',
    phone: '+91 7736 1115 88',
    email: 'info@timseducation.com',
    hours: 'Mon – Sat: 9:00 AM – 6:00 PM',
  },
  {
    name: 'Edappal – Branch Office',
    address: 'Edappal, Malappuram District, Kerala',
    phone: '+91 9526 387 777',
    email: 'info@timseducation.com',
    hours: 'Mon – Sat: 9:00 AM – 5:30 PM',
  },
]

export default function AboutPage() {
  return (
    <div className="pt-24">

      {/* ── Hero Banner ── */}
      <section className="bg-hero-gradient min-h-[70vh] flex items-center px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent/10 rounded-full translate-x-32 -translate-y-32 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-white/5 rounded-full -translate-x-20 translate-y-20 blur-3xl" />
        <div className="relative max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-accent font-semibold text-sm uppercase tracking-widest mb-3">Who We Are</p>
            <h1 className="text-4xl md:text-5xl font-bold text-white font-heading leading-tight mb-5">
              Empowering Kerala's<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-red-300">
                Next Generation
              </span>
            </h1>
            <p className="text-white/80 text-lg leading-relaxed mb-6">
              Since 2009, TIMS has helped thousands of students across Kerala complete their education — affordably, flexibly, and with full recognition. We don't just enrol you; we walk with you every step of the way.
            </p>
            <div className="flex flex-wrap gap-3 mb-8">
              {['Founded 2009', 'Tirur & Edappal', 'UGC-DEB Approved', '10,000+ Alumni'].map((b) => (
                <span key={b} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/15 text-white text-xs font-medium rounded-lg border border-white/25">
                  <FiCheckCircle className="text-accent" size={12} /> {b}
                </span>
              ))}
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/courses"
                className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-white font-bold rounded-xl hover:bg-accent-dark transition-all shadow-lg">
                Explore Programs <FiArrowRight />
              </Link>
              <Link href="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white/15 text-white font-semibold rounded-xl border border-white/30 hover:bg-white/25 transition-all">
                Talk to Us
              </Link>
            </div>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 gap-4">
            {achievements.map((a) => (
              <div key={a.label} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 text-center hover:bg-white/15 transition-all">
                <div className={`flex justify-center mb-3 ${a.color}`}>{a.icon}</div>
                <p className="text-3xl font-bold text-white font-heading mb-1">{a.value}</p>
                <p className="text-white/65 text-sm">{a.label}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 50" fill="none"><path d="M0,25 C360,50 1080,0 1440,25 L1440,50 L0,50 Z" fill="#f8fafc" /></svg>
        </div>
      </section>

      {/* ── Our Story ── */}
      <section className="bg-gray-50 py-20 px-4">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-14 items-center">
          <div>
            <p className="text-primary-600 font-semibold text-sm uppercase tracking-widest mb-2">Our Story</p>
            <h2 className="text-3xl md:text-4xl font-bold text-primary-800 font-heading mb-5">
              Built on the Belief That <span className="text-accent">Learning Never Stops</span>
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Tirur Institute of Management Studies (TIMS) was born in 2009 in a small office in Tirur, Kerala — driven by one simple observation: thousands of deserving students were being left out of higher education because of rigid schedules, high costs, and lack of guidance.
            </p>
            <p className="text-gray-600 leading-relaxed mb-4">
              Our founders believed that a working mother, a daily-wage earner, a school dropout, or a professional wanting to upskill — all deserved the same quality of education as anyone else. So we built TIMS to serve exactly them.
            </p>
            <p className="text-gray-600 leading-relaxed mb-8">
              Today, with two offices, 9+ partner universities, 200+ programs, and 10,000+ alumni, TIMS has become Kerala's most trusted name in distance and online education. But our mission hasn't changed — <strong className="text-primary-700">learning made easy and affordable for everyone</strong>.
            </p>
            <div className="space-y-3">
              {[
                'Honest counselling — no pressure, no hidden charges',
                'Programs from UGC-DEB approved, NAAC accredited universities',
                'Support from admission to degree — all under one roof',
                'Scholarships and fee concessions for eligible students',
              ].map((p) => (
                <div key={p} className="flex items-start gap-3">
                  <FiCheckCircle className="text-accent mt-0.5 shrink-0" size={17} />
                  <span className="text-gray-700 text-sm">{p}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-5">
            {[
              { title: 'Our Mission', icon: '🎯', color: 'border-l-accent', text: 'To deliver quality, value-driven education that meets the highest standards of student satisfaction — developing competent, confident professionals prepared for the real world.' },
              { title: 'Our Vision', icon: '🔭', color: 'border-l-primary-600', text: 'To be the most trusted education partner in Kerala — where every student, regardless of background, can access a recognised degree that opens doors to a better future.' },
              { title: 'Our Promise', icon: '🤲', color: 'border-l-green-500', text: 'We promise honest advice, transparent fees, timely support, and an admission process so smooth you\'ll wonder why you waited. Your success is our only measure of ours.' },
            ].map((item) => (
              <div key={item.title} className={`bg-white rounded-2xl p-6 border border-gray-100 border-l-4 ${item.color} shadow-sm hover:shadow-md transition-all`}>
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl">{item.icon}</span>
                  <h3 className="font-bold text-primary-800 font-heading text-lg">{item.title}</h3>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Core Values ── */}
      <section className="bg-white py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-primary-600 font-semibold text-sm uppercase tracking-widest mb-2">What Drives Us</p>
            <h2 className="text-3xl md:text-4xl font-bold text-primary-800 font-heading mb-3">
              Our Core <span className="text-accent">Values</span>
            </h2>
            <p className="text-gray-500 max-w-lg mx-auto text-sm">
              These aren't just words on a wall — they're the principles behind every decision we make and every student we serve.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map((v) => (
              <div key={v.title}
                className={`rounded-2xl p-7 border hover:shadow-md hover:-translate-y-1 transition-all ${v.color}`}>
                <span className="text-3xl mb-4 block">{v.icon}</span>
                <h3 className="font-bold text-primary-800 font-heading text-lg mb-2">{v.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Timeline ── */}
      <section className="bg-gray-50 py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-primary-600 font-semibold text-sm uppercase tracking-widest mb-2">Our Journey</p>
            <h2 className="text-3xl md:text-4xl font-bold text-primary-800 font-heading">
              15 Years of <span className="text-accent">Milestones</span>
            </h2>
          </div>

          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary-600 via-accent to-primary-600 md:-translate-x-px" />

            <div className="space-y-10">
              {timeline.map((item, i) => (
                <div key={item.year}
                  className={`relative flex items-start gap-8 md:gap-0 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                  {/* Content */}
                  <div className={`hidden md:block w-5/12 ${i % 2 === 0 ? 'pr-10 text-right' : 'pl-10'}`}>
                    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all">
                      <h3 className="font-bold text-primary-800 font-heading mb-1">{item.title}</h3>
                      <p className="text-gray-600 text-sm leading-relaxed">{item.event}</p>
                    </div>
                  </div>

                  {/* Dot + year */}
                  <div className="absolute left-3 md:left-1/2 md:-translate-x-1/2 flex flex-col items-center">
                    <div className="w-7 h-7 rounded-full bg-accent border-4 border-white shadow-lg flex items-center justify-center" />
                    <span className="mt-1 text-xs font-bold text-primary-700 bg-primary-50 border border-primary-100 px-2 py-0.5 rounded-full hidden md:inline-block">{item.year}</span>
                  </div>

                  {/* Mobile content */}
                  <div className="ml-12 md:hidden bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex-1">
                    <span className="inline-block text-xs font-bold text-white bg-accent px-2.5 py-1 rounded-full mb-2">{item.year}</span>
                    <h3 className="font-bold text-primary-800 font-heading mb-1">{item.title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{item.event}</p>
                  </div>

                  {/* Spacer for alternating layout */}
                  <div className="hidden md:block w-5/12" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Directors ── */}
      <section className="bg-white py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-primary-600 font-semibold text-sm uppercase tracking-widest mb-2">Leadership</p>
            <h2 className="text-3xl md:text-4xl font-bold text-primary-800 font-heading mb-3">
              Meet Our <span className="text-accent">Directors</span>
            </h2>
            <p className="text-gray-500 max-w-lg mx-auto text-sm">
              The visionaries behind TIMS — committed to making quality education accessible to every student across Kerala and beyond.
            </p>
          </div>
          <DirectorsSection />
        </div>
      </section>

      {/* ── Why Choose TIMS ── */}
      <section className="bg-gray-50 py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-primary-600 font-semibold text-sm uppercase tracking-widest mb-2">Why TIMS</p>
            <h2 className="text-3xl md:text-4xl font-bold text-primary-800 font-heading mb-3">
              What Makes Us <span className="text-accent">Different</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-12">
            {[
              { icon: '🎓', title: 'Only Recognised Universities', desc: 'We work exclusively with UGC-DEB approved, NAAC accredited institutions. Your degree will be valid for government jobs, higher studies, and private employment.' },
              { icon: '💸', title: 'Truly Affordable', desc: 'We negotiate the best fee structures for our students. No surprise charges, no middlemen, no hidden costs — just transparent, fair pricing for everyone.' },
              { icon: '🧭', title: 'Personal Counselling', desc: 'Every student gets dedicated one-on-one counselling before enrolment. We assess your background and goals to recommend the right program and university.' },
              { icon: '📋', title: 'End-to-End Admission', desc: 'We handle all paperwork, university applications, and documentation. Students simply focus on studying — we take care of everything else.' },
              { icon: '🎖️', title: 'Scholarship Assistance', desc: 'We actively help eligible students apply for scholarships and fee concessions offered by partner universities — making education even more accessible.' },
              { icon: '📞', title: '24/7 Student Support', desc: 'Our support team is always just a call or WhatsApp message away. Whether it is an exam query or an admission concern, we respond fast.' },
            ].map((item) => (
              <div key={item.title} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-start gap-4 hover:shadow-md hover:-translate-y-0.5 transition-all">
                <div className="w-12 h-12 rounded-xl bg-primary-50 border border-primary-100 flex items-center justify-center text-xl shrink-0">
                  {item.icon}
                </div>
                <div>
                  <h3 className="font-bold text-primary-800 font-heading mb-1">{item.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Our Offices ── */}
      <section className="bg-white py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-primary-600 font-semibold text-sm uppercase tracking-widest mb-2">Find Us</p>
            <h2 className="text-3xl md:text-4xl font-bold text-primary-800 font-heading">
              Our <span className="text-accent">Offices</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {offices.map((office, i) => (
              <div key={office.name}
                className={`rounded-2xl p-8 border transition-all hover:shadow-lg ${i === 0 ? 'bg-hero-gradient border-primary-700' : 'bg-gray-50 border-gray-100'}`}>
                <h3 className={`font-bold font-heading text-xl mb-5 ${i === 0 ? 'text-white' : 'text-primary-800'}`}>{office.name}</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <FiMapPin className={`mt-0.5 shrink-0 ${i === 0 ? 'text-accent' : 'text-primary-600'}`} size={16} />
                    <span className={`text-sm ${i === 0 ? 'text-white/80' : 'text-gray-600'}`}>{office.address}</span>
                  </li>
                  <li>
                    <a href={`tel:${office.phone.replace(/\s/g, '')}`}
                      className={`flex items-center gap-3 text-sm hover:underline ${i === 0 ? 'text-white/80 hover:text-white' : 'text-gray-600 hover:text-primary-600'}`}>
                      <FiPhone className={`shrink-0 ${i === 0 ? 'text-accent' : 'text-primary-600'}`} size={16} />
                      {office.phone}
                    </a>
                  </li>
                  <li>
                    <a href={`mailto:${office.email}`}
                      className={`flex items-center gap-3 text-sm hover:underline ${i === 0 ? 'text-white/80 hover:text-white' : 'text-gray-600 hover:text-primary-600'}`}>
                      <FiMail className={`shrink-0 ${i === 0 ? 'text-accent' : 'text-primary-600'}`} size={16} />
                      {office.email}
                    </a>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className={`text-lg`}>🕐</span>
                    <span className={`text-sm ${i === 0 ? 'text-white/70' : 'text-gray-500'}`}>{office.hours}</span>
                  </li>
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="bg-gray-50 py-16 px-4">
        <div className="max-w-4xl mx-auto bg-hero-gradient rounded-3xl p-12 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-10"
            style={{ backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)', backgroundSize: '25px 25px' }} />
          <div className="absolute top-0 right-0 w-56 h-56 bg-accent/10 rounded-full translate-x-20 -translate-y-20 blur-2xl" />
          <div className="relative">
            <p className="text-accent font-semibold text-sm uppercase tracking-widest mb-3">Start Today</p>
            <h2 className="text-3xl md:text-4xl font-bold text-white font-heading mb-4">
              Ready to Begin Your<br />Learning Journey?
            </h2>
            <p className="text-white/75 max-w-lg mx-auto mb-8 text-base">
              Join over 10,000 students who trusted TIMS to guide them. Get a free counselling session — no commitment, no pressure.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/courses"
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-accent text-white font-bold rounded-xl hover:bg-accent-dark transition-all shadow-lg hover:scale-105">
                Explore Programs <FiArrowRight />
              </Link>
              <Link href="/contact"
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-white text-primary-700 font-bold rounded-xl hover:bg-gray-50 transition-all shadow-lg hover:scale-105">
                Book Free Counselling
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}
