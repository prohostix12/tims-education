import Link from 'next/link'
import { FiArrowRight } from 'react-icons/fi'
import { UNIVERSITIES } from '@/lib/data'

export default function UniversitiesSection() {
  return (
    <section className="bg-gray-50 py-24">
      <div className="max-w-7xl mx-auto px-8">
        <div className="text-center mb-12">
          <p className="text-primary-600 font-semibold text-sm uppercase tracking-widest mb-2">Partner Universities</p>
          <h2 className="text-3xl md:text-4xl font-bold text-primary-800 font-heading mb-4">
            Top Universities, <span className="text-sky-brand">Recognised Degrees</span>
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            All programs are offered in association with UGC-approved, NAAC accredited universities — ensuring your degree is recognised nationwide.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {UNIVERSITIES.map((u) => (
            <div key={u.name}
              className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all flex items-center gap-4">
              {/* Logo placeholder */}
              <div className="w-16 h-16 rounded-xl bg-primary-50 flex items-center justify-center shrink-0 border border-primary-100">
                <span className="text-primary-600 font-bold text-lg">{u.name.charAt(0)}</span>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-primary-800 text-sm font-heading leading-snug mb-1">{u.name}</h3>
                <div className="flex flex-wrap gap-2">
                  <span className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-full font-medium">
                    NAAC {u.naac}
                  </span>
                  <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-medium">
                    {u.type}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link href="/universities"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 transition-all shadow-md hover:shadow-lg">
            View All Partner Universities <FiArrowRight />
          </Link>
        </div>
      </div>
    </section>
  )
}
