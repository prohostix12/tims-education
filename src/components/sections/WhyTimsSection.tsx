import Link from 'next/link'
import { FiArrowRight } from 'react-icons/fi'
import { WHY_TIMS, SERVICES } from '@/lib/data'

export default function WhyTimsSection() {
  return (
    <section className="bg-white py-24">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Why TIMS */}
        <div className="grid lg:grid-cols-2 gap-14 items-center mb-16">
          <div>
            <p className="text-primary-600 font-semibold text-sm uppercase tracking-widest mb-2">Our Process</p>
            <h2 className="text-3xl md:text-4xl font-bold text-primary-800 font-heading mb-5">
              How We Help You <span className="text-sky-brand">Succeed</span>
            </h2>
            <p className="text-gray-500 text-base leading-relaxed mb-8">
              At TIMS, we don't just enrol you — we walk with you every step of the way. From choosing the right program to getting your degree.
            </p>

            <div className="space-y-6">
              {WHY_TIMS.map((item) => (
                <div key={item.title} className="flex gap-4">
                  <div className="shrink-0 w-12 h-12 rounded-xl bg-primary-50 border border-primary-100 flex items-center justify-center">
                    <span className="text-xl">{item.icon}</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-primary-400">{item.step}</span>
                      <h3 className="font-bold text-primary-800 font-heading">{item.title}</h3>
                    </div>
                    <p className="text-gray-500 text-sm leading-relaxed">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <Link href="/course-finder"
              className="inline-flex items-center gap-2 mt-8 px-6 py-3 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 transition-all shadow-md">
              Get Free Counselling <FiArrowRight />
            </Link>
          </div>

          {/* Right visual */}
          <div className="bg-hero-gradient rounded-3xl p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-x-4 -translate-y-4" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-sky-brand/20 rounded-full translate-x-4 translate-y-4" />
            <div className="relative space-y-4">
              {[
                { label: 'Established', value: '2009', icon: '📅' },
                { label: 'Locations', value: 'Tirur & Edappal', icon: '📍' },
                { label: 'Partner Universities', value: '9+', icon: '🏛️' },
                { label: 'Programs Available', value: '200+', icon: '📚' },
                { label: 'Student Satisfaction', value: '98%', icon: '⭐' },
              ].map((item) => (
                <div key={item.label}
                  className="flex items-center justify-between bg-white/10 backdrop-blur-sm rounded-xl px-5 py-4 border border-white/15">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{item.icon}</span>
                    <span className="text-white/80 text-sm">{item.label}</span>
                  </div>
                  <span className="text-white font-bold text-sm">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Services */}
        <div>
          <div className="text-center mb-10">
            <p className="text-primary-600 font-semibold text-sm uppercase tracking-widest mb-2">Additional Services</p>
            <h2 className="text-3xl font-bold text-primary-800 font-heading">
              We Do More Than <span className="text-sky-brand">Admissions</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {SERVICES.map((s) => (
              <div key={s.title}
                className="bg-primary-50 rounded-2xl p-6 border border-primary-100 hover:bg-primary-600 hover:border-primary-600 group transition-all">
                <span className="text-3xl mb-4 block">{s.icon}</span>
                <h3 className="font-bold text-primary-800 group-hover:text-white font-heading mb-2 transition-colors">{s.title}</h3>
                <p className="text-gray-500 group-hover:text-white/80 text-sm leading-relaxed transition-colors">{s.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
