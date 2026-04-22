import Link from 'next/link'
import { FiArrowRight, FiPhone } from 'react-icons/fi'

export default function CTASection() {
  return (
    <section className="bg-white py-20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="bg-hero-gradient rounded-3xl overflow-hidden relative">
          {/* Decoration */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-0 right-0 w-72 h-72 bg-white/5 rounded-full translate-x-24 -translate-y-24" />
            <div className="absolute bottom-0 left-0 w-56 h-56 bg-sky-brand/20 rounded-full -translate-x-12 translate-y-12" />
            <div className="absolute inset-0 opacity-10"
              style={{ backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
          </div>

          <div className="relative py-16 px-8 md:px-14 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-center md:text-left max-w-xl">
              <p className="text-accent font-semibold text-sm uppercase tracking-widest mb-3">Start Today</p>
              <h2 className="text-3xl md:text-4xl font-bold text-white font-heading mb-4">
                Ready to Start Your<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-yellow-300">
                  Learning Journey?
                </span>
              </h2>
              <p className="text-white/75 text-base leading-relaxed">
                Talk to our expert counsellors today — completely free. We'll help you find the right program that fits your goals, schedule, and budget.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 shrink-0">
              <a href="tel:+917736111588"
                className="inline-flex items-center gap-2 px-7 py-4 bg-white text-primary-600 font-bold rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105 text-sm">
                <FiPhone size={18} /> Call Now
              </a>
              <Link href="/courses"
                className="inline-flex items-center gap-2 px-7 py-4 bg-accent text-white font-bold rounded-xl shadow-lg hover:bg-accent-dark transition-all hover:scale-105 text-sm">
                Explore Programs <FiArrowRight />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
