import { TESTIMONIALS } from '@/lib/data'
import { FiStar } from 'react-icons/fi'

export default function TestimonialsSection() {
  return (
    <section className="bg-gray-50 py-24">
      <div className="max-w-7xl mx-auto px-8">
        <div className="text-center mb-12">
          <p className="text-primary-600 font-semibold text-sm uppercase tracking-widest mb-2">Student Stories</p>
          <h2 className="text-3xl md:text-4xl font-bold text-primary-800 font-heading mb-4">
            What Our Students <span className="text-sky-brand">Say</span>
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            Real success stories from students who trusted TIMS for their educational journey.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, i) => (
            <div key={t.name}
              className={`bg-white rounded-2xl p-7 shadow-sm border border-gray-100 hover:shadow-md transition-all flex flex-col ${i === 1 ? 'md:-translate-y-3 border-primary-200 shadow-md' : ''}`}>
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <FiStar key={j} className="text-accent fill-accent" size={16} />
                ))}
              </div>

              {/* Quote */}
              <blockquote className="text-gray-600 text-sm leading-relaxed flex-1 mb-6 italic">
                "{t.quote}"
              </blockquote>

              {/* Author */}
              <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                <div className="w-11 h-11 rounded-full bg-hero-gradient flex items-center justify-center text-white font-bold shrink-0">
                  {t.name.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-primary-800 text-sm">{t.name}</p>
                  <p className="text-gray-400 text-xs">{t.program}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
