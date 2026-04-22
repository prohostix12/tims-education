'use client'
import { useState, useMemo } from 'react'
import Link from 'next/link'
import { FiArrowRight, FiCheckCircle, FiArrowLeft } from 'react-icons/fi'
import { COURSES } from '@/lib/data'

interface UserProfile {
  workingStatus: '' | 'full-time' | 'part-time' | 'not-working'
  qualification: '' | 'sslc' | 'plus-two' | 'graduate' | 'postgraduate'
  careerStage: '' | 'student' | 'entry-level' | 'mid-career' | 'career-change' | 'upskilling'
  timePerWeek: '' | '5-10' | '10-15' | '15-20' | '20-plus'
  preferredMode: '' | 'online' | 'distance' | 'hybrid'
  budgetRange: '' | 'low' | 'medium' | 'high'
  duration: '' | 'short' | 'medium' | 'long'
  fieldInterest: '' | 'tech' | 'management' | 'foundation' | 'professional' | 'any'
}

const questions = [
  {
    id: 'workingStatus',
    question: 'Are you currently working?',
    type: 'choice',
    options: [
      { value: 'full-time', label: 'Yes (full-time)' },
      { value: 'part-time', label: 'Yes (part-time)' },
      { value: 'not-working', label: 'No' },
    ],
  },
  {
    id: 'qualification',
    question: 'What is your current educational qualification?',
    type: 'choice',
    options: [
      { value: 'sslc', label: 'SSLC / High School' },
      { value: 'plus-two', label: 'Plus Two / Intermediate' },
      { value: 'graduate', label: 'Bachelor\'s Degree' },
      { value: 'postgraduate', label: 'Master\'s Degree' },
    ],
  },
  {
    id: 'careerStage',
    question: 'What best describes your career stage?',
    type: 'choice',
    options: [
      { value: 'student', label: 'Student' },
      { value: 'entry-level', label: 'Entry-level Professional' },
      { value: 'mid-career', label: 'Mid-career Professional' },
      { value: 'career-change', label: 'Looking to change career' },
      { value: 'upskilling', label: 'Upskilling for current role' },
    ],
  },
  {
    id: 'timePerWeek',
    question: 'How many hours per week can you dedicate to studies?',
    type: 'choice',
    options: [
      { value: '5-10', label: '5-10 hours' },
      { value: '10-15', label: '10-15 hours' },
      { value: '15-20', label: '15-20 hours' },
      { value: '20-plus', label: '20+ hours' },
    ],
  },
  {
    id: 'preferredMode',
    question: 'What is your preferred learning mode?',
    type: 'choice',
    options: [
      { value: 'online', label: '🌐 Online (Live & Interactive)' },
      { value: 'distance', label: '📚 Distance Learning' },
      { value: 'hybrid', label: '🎯 Hybrid (Mix of both)' },
    ],
  },
  {
    id: 'budgetRange',
    question: 'What is your budget for the course?',
    type: 'choice',
    options: [
      { value: 'low', label: 'Under ₹20,000/year' },
      { value: 'medium', label: '₹20,000 - ₹75,000/year' },
      { value: 'high', label: 'Above ₹75,000/year' },
    ],
  },
  {
    id: 'duration',
    question: 'How long do you want the course to be?',
    type: 'choice',
    options: [
      { value: 'short', label: 'Short-term (< 1 Year)' },
      { value: 'medium', label: 'Medium-term (1-2 Years)' },
      { value: 'long', label: 'Long-term (3+ Years)' },
    ],
  },
  {
    id: 'fieldInterest',
    question: 'Which field interests you most?',
    type: 'choice',
    options: [
      { value: 'tech', label: '💻 Technology & Engineering' },
      { value: 'management', label: '📊 Management & Business' },
      { value: 'foundation', label: '🎓 School/Foundation Programs' },
      { value: 'professional', label: '🏢 Professional Certifications' },
      { value: 'any', label: 'Show me all options' },
    ],
  },
]

const modeColor: Record<string, string> = {
  'Online':            'bg-green-50 text-green-700 border-green-200',
  'Distance':          'bg-blue-50 text-blue-700 border-blue-200',
  'Online / Distance': 'bg-purple-50 text-purple-700 border-purple-200',
  'Hybrid':            'bg-orange-50 text-orange-700 border-orange-200',
}

export default function CourseFinderPage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [profile, setProfile] = useState<UserProfile>({
    workingStatus: '',
    qualification: '',
    careerStage: '',
    timePerWeek: '',
    preferredMode: '',
    budgetRange: '',
    duration: '',
    fieldInterest: '',
  })
  const [showResults, setShowResults] = useState(false)

  const handleOptionSelect = (questionId: string, value: string) => {
    setProfile((prev) => ({
      ...prev,
      [questionId]: value,
    }))
  }

  const goNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      setShowResults(true)
    }
  }

  const goBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const resetQuestionnaire = () => {
    setCurrentStep(0)
    setProfile({
      workingStatus: '',
      qualification: '',
      careerStage: '',
      timePerWeek: '',
      preferredMode: '',
      budgetRange: '',
      duration: '',
      fieldInterest: '',
    })
    setShowResults(false)
  }

  const recommendedCourses = useMemo(() => {
    let courses = [...COURSES]
    
    // Filter by qualification level
    if (profile.qualification === 'sslc') {
      courses = courses.filter((c) => ['School Programs'].includes(c.category))
    } else if (profile.qualification === 'plus-two') {
      courses = courses.filter((c) => 
        ['School Programs', 'Under Graduate', 'Diploma'].includes(c.category)
      )
    } else if (profile.qualification === 'graduate') {
      courses = courses.filter((c) => 
        !['School Programs'].includes(c.category)
      )
    } else if (profile.qualification === 'postgraduate') {
      courses = courses.filter((c) => c.category !== 'School Programs')
    }

    // Filter by working status
    if (profile.workingStatus === 'full-time' || profile.workingStatus === 'part-time') {
      // Working professionals prefer online/distance
      courses = courses.filter((c) => 
        c.mode !== 'On-campus'
      )
    }

    // Filter by preferred mode
    if (profile.preferredMode && profile.preferredMode !== 'hybrid') {
      if (profile.preferredMode === 'online') {
        courses = courses.filter((c) => c.mode.includes('Online'))
      } else if (profile.preferredMode === 'distance') {
        courses = courses.filter((c) => c.mode.includes('Distance'))
      }
    }

    // Filter by budget
    if (profile.budgetRange) {
      courses = courses.filter((c) => {
        const feeNum = parseInt(c.feeRange.replace(/[^0-9]/g, '')) || 0
        if (profile.budgetRange === 'low') return feeNum < 20000
        if (profile.budgetRange === 'medium') return feeNum >= 20000 && feeNum <= 75000
        if (profile.budgetRange === 'high') return feeNum > 75000
        return true
      })
    }

    // Filter by duration
    if (profile.duration) {
      courses = courses.filter((c) => {
        if (profile.duration === 'short') return c.duration.includes('Month') || c.duration === '1 Year'
        if (profile.duration === 'medium') return c.duration === '1 Year' || c.duration === '2 Years'
        if (profile.duration === 'long') return c.duration.includes('3') || c.duration.includes('4')
        return true
      })
    }

    // Filter by field interest
    if (profile.fieldInterest && profile.fieldInterest !== 'any') {
      if (profile.fieldInterest === 'tech') {
        courses = courses.filter((c) => ['Engineering', 'Technology'].some(f => c.category?.includes(f)))
      } else if (profile.fieldInterest === 'management') {
        courses = courses.filter((c) => ['Post Graduate', 'Under Graduate'].some(f => c.category?.includes(f)))
      } else if (profile.fieldInterest === 'foundation') {
        courses = courses.filter((c) => c.category === 'School Programs')
      }
    }

    // Prioritize by career stage
    if (profile.careerStage === 'entry-level') {
      courses = courses.sort((a, b) => {
        const aScore = a.category === 'Under Graduate' ? -1 : 1
        const bScore = b.category === 'Under Graduate' ? -1 : 1
        return aScore - bScore
      })
    } else if (profile.careerStage === 'upskilling') {
      courses = courses.sort((a, b) => {
        const aScore = a.category === 'Post Graduate' ? -1 : 1
        const bScore = b.category === 'Post Graduate' ? -1 : 1
        return aScore - bScore
      })
    }

    return courses
  }, [profile])

  if (showResults) {
    return (
      <div className="pt-24 pb-20">
        {/* Hero with Results */}
        <section className="bg-hero-gradient min-h-[50vh] flex items-center px-4 relative overflow-hidden">
          <div className="absolute inset-0"
            style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.15) 1.5px, transparent 1.5px)', backgroundSize: '32px 32px' }} />
          <div className="absolute top-0 right-0 w-96 h-96 bg-accent/15 rounded-full translate-x-24 -translate-y-24 blur-[100px]" />

          <div className="relative max-w-6xl mx-auto w-full">
            <h1 className="text-4xl md:text-5xl font-bold text-white font-heading mb-4">Your Personalized Recommendations</h1>
            <p className="text-white/75 text-lg max-w-2xl">
              Based on your profile, here are the courses that perfectly match your goals, schedule, and budget.
            </p>
          </div>
        </section>

        {/* Results Grid */}
        <section className="max-w-6xl mx-auto px-4 py-20">
          {recommendedCourses.length > 0 ? (
            <div>
              <div className="mb-8 flex items-center justify-between">
                <h2 className="text-3xl font-bold">Found {recommendedCourses.length} courses for you</h2>
                <button
                  onClick={resetQuestionnaire}
                  className="px-6 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 transition"
                >
                  Start Over
                </button>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recommendedCourses.map((course) => (
                  <div
                    key={course.slug}
                    className="group bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition hover:border-accent/50"
                  >
                    <div className="p-6">
                      <div className="text-4xl mb-4">{course.icon}</div>
                      
                      <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-accent transition">
                        {course.title}
                      </h3>

                      <p className="text-sm text-gray-600 mb-4">{course.description}</p>

                      <div className="space-y-3 mb-6">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <span className="font-semibold">📚</span> {course.category}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <span className="font-semibold">⏱️</span> {course.duration}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <span className="font-semibold">💰</span> {course.feeRange}
                        </div>
                      </div>

                      <div className="mb-6">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${modeColor[course.mode] || 'bg-gray-100 text-gray-700'}`}>
                          {course.mode}
                        </span>
                      </div>

                      <Link
                        href={`/courses/${course.slug}`}
                        className="inline-flex items-center gap-2 text-accent font-semibold hover:gap-3 transition"
                      >
                        View Details <FiArrowRight />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-20">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">No exact matches found</h2>
              <p className="text-gray-600 mb-8">We couldn't find courses matching all your criteria. Try adjusting your preferences.</p>
              <button
                onClick={resetQuestionnaire}
                className="px-6 py-3 bg-accent text-white rounded-lg hover:bg-accent/90 transition"
              >
                Start Over
              </button>
            </div>
          )}
        </section>
      </div>
    )
  }

  const question = questions[currentStep]
  const canProceed = profile[question.id as keyof UserProfile] !== ''

  return (
    <div className="pt-24 pb-20">
      {/* Hero */}
      <section className="bg-hero-gradient min-h-[60vh] flex items-center px-4 relative overflow-hidden">
        <div className="absolute inset-0"
          style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.15) 1.5px, transparent 1.5px)', backgroundSize: '32px 32px' }} />
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent/15 rounded-full translate-x-24 -translate-y-24 blur-[100px]" />

        <div className="relative max-w-4xl mx-auto text-center w-full">
          <span className="inline-block px-4 py-1.5 bg-accent text-white text-xs font-bold rounded-full mb-4 uppercase tracking-wider">
            Personalized Guidance
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-white font-heading mb-4">Find Your Perfect Course</h1>
          <p className="text-white/75 text-lg max-w-xl mx-auto">
            Tell us about your background and interests, and we'll recommend the best courses from top universities.
          </p>
        </div>
      </section>

      {/* ── Questionnaire Form ── */}
      <section className="bg-gray-50 py-16 px-4 min-h-[60vh] flex items-center">
        <div className="max-w-2xl mx-auto w-full">
          {/* Progress bar */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold text-gray-700">
                Step {currentStep + 1} of {questions.length}
              </h2>
              <span className="text-xs text-gray-500">{Math.round(((currentStep + 1) / questions.length) * 100)}%</span>
            </div>
            <div className="w-full h-2.5 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-accent to-accent/80 transition-all duration-300" 
                style={{ width: `${((currentStep + 1) / questions.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Question */}
          <div className="bg-white rounded-2xl p-8 md:p-10 mb-8 shadow-sm border border-gray-100">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">
              {question.question}
            </h3>

            {/* Options */}
            <div className="space-y-3">
              {question.options.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleOptionSelect(question.id, option.value)}
                  className={`w-full p-4 text-left rounded-xl border-2 transition-all font-medium flex items-center gap-3 ${
                    profile[question.id as keyof UserProfile] === option.value
                      ? 'border-accent bg-accent/5 text-accent'
                      : 'border-gray-200 bg-white text-gray-700 hover:border-accent/50'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                    profile[question.id as keyof UserProfile] === option.value
                      ? 'border-accent bg-accent'
                      : 'border-gray-300'
                  }`}>
                    {profile[question.id as keyof UserProfile] === option.value && (
                      <div className="w-2 h-2 bg-white rounded-full" />
                    )}
                  </div>
                  <span>{option.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Navigation buttons */}
          <div className="flex gap-3">
            {currentStep > 0 && (
              <button
                onClick={goBack}
                className="flex items-center justify-center gap-2 px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:border-gray-400 hover:bg-gray-50 transition"
              >
                <FiArrowLeft size={18} /> Back
              </button>
            )}
            <button
              onClick={goNext}
              disabled={!canProceed}
              className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 font-semibold rounded-xl transition ${
                canProceed
                  ? 'bg-gradient-to-r from-accent to-accent/80 text-white hover:shadow-lg'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              {currentStep === questions.length - 1 ? (
                <>
                  <FiCheckCircle size={18} /> Get Recommendations
                </>
              ) : (
                <>
                  Next <FiArrowRight size={18} />
                </>
              )}
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
