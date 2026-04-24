import Link from 'next/link'
import { FiArrowRight, FiClock, FiMonitor } from 'react-icons/fi'
import { COURSES } from '@/lib/data'

export default function ProgramsSection() {
  const featured = COURSES.filter((c) => c.popular)

  return (
    <section className="bg-white py-24">
      <div className="max-w-7xl mx-auto px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <p className="text-primary-600 font-semibold text-sm uppercase tracking-widest mb-2">Our Programs</p>
            <h2 className="text-3xl md:text-4xl font-bold text-primary-800 font-heading">
              Most Popular <span className="text-sky-brand">Courses</span>
            </h2>
            <p className="text-gray-500 mt-3 max-w-md">
              Chosen by thousands of students across Kerala — recognised programs from top universities.
            </p>
          </div>
          <Link href="/courses"
            className="inline-flex items-center gap-2 text-primary-600 font-semibold text-sm hover:gap-3 transition-all shrink-0">
            View All Programs <FiArrowRight />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featured.map((course) => (
            <div key={course.title}
              className="group bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all">
              {/* Card header */}
              <div className="bg-hero-gradient p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-x-8 -translate-y-8" />
                <span className="inline-block px-3 py-1 bg-accent text-white text-xs font-bold rounded-full mb-4">
                  {course.badge}
                </span>
                <div className="text-4xl mb-2">{course.icon}</div>
                <h3 className="text-white font-bold text-xl font-heading">{course.title}</h3>
                <p className="text-white/70 text-xs mt-1">{course.category}</p>
              </div>

              {/* Card body */}
              <div className="p-6">
                <p className="text-gray-500 text-sm leading-relaxed mb-5">{course.description}</p>

                <div className="flex flex-wrap gap-3 mb-5">
                  <span className="inline-flex items-center gap-1.5 text-xs text-gray-600 bg-gray-50 rounded-lg px-3 py-1.5">
                    <FiClock size={12} className="text-primary-600" /> {course.duration}
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-xs text-gray-600 bg-gray-50 rounded-lg px-3 py-1.5">
                    <FiMonitor size={12} className="text-primary-600" /> {course.mode}
                  </span>
                </div>

                <p className="text-xs text-gray-400 mb-4">
                  <span className="font-medium text-gray-600">Eligibility:</span> {course.eligibility}
                </p>

                <Link href={`/courses?cat=${course.category.toLowerCase().replace(/\s/g, '-')}`}
                  className="w-full flex items-center justify-center gap-2 py-2.5 border-2 border-primary-600 text-primary-600 font-semibold text-sm rounded-xl hover:bg-primary-600 hover:text-white transition-all group-hover:bg-primary-600 group-hover:text-white">
                  Learn More <FiArrowRight size={14} />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* All programs grid */}
        <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {COURSES.filter((c) => !c.popular).map((course) => (
            <Link key={course.title} href="/courses"
              className="flex items-center gap-3 bg-gray-50 rounded-xl p-4 hover:bg-primary-50 hover:border-primary-200 border border-gray-100 transition-all group">
              <span className="text-2xl">{course.icon}</span>
              <div>
                <p className="font-medium text-gray-800 text-sm group-hover:text-primary-600 transition-colors">{course.title}</p>
                <p className="text-gray-400 text-xs">{course.duration}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
