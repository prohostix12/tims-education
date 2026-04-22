'use client'
import { useInView } from 'react-intersection-observer'
import CountUp from 'react-countup'
import { STATS } from '@/lib/data'

export default function StatsSection() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 })

  return (
    <section className="bg-white py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div ref={ref}
          className="bg-hero-gradient rounded-2xl shadow-xl grid grid-cols-2 md:grid-cols-4 gap-1 overflow-hidden">
          {STATS.map((stat, i) => (
            <div key={stat.label}
              className={`flex flex-col items-center justify-center py-10 px-6 text-center ${i < STATS.length - 1 ? 'border-r border-white/15' : ''} hover:bg-white/10 transition-colors`}>
              <span className="text-3xl mb-2">{stat.icon}</span>
              <p className="text-4xl font-bold text-white font-heading">
                {inView ? <CountUp end={stat.value} duration={2.5} separator="," /> : '0'}
                <span className="text-accent">{stat.suffix}</span>
              </p>
              <p className="text-white/70 text-sm mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
