import { FEATURES } from '@/lib/data'

export default function FeaturesSection() {
  return (
    <section className="bg-gray-50 py-20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-14">
          <p className="text-primary-600 font-semibold text-sm uppercase tracking-widest mb-2">Why Choose TIMS</p>
          <h2 className="text-3xl md:text-4xl font-bold text-primary-800 font-heading mb-4">
            Education That Works <span className="text-sky-brand">For You</span>
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto text-base">
            We make distance and online education genuinely accessible — no compromises on quality, recognition, or support.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURES.map((f) => (
            <div key={f.title}
              className="bg-white rounded-2xl p-7 shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-1 transition-all group">
              <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl mb-5 ${f.color} group-hover:scale-110 transition-transform`}>
                {f.icon}
              </div>
              <h3 className="font-bold text-primary-800 text-base font-heading mb-2">{f.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{f.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
