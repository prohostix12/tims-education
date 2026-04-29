import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import QuizQuestion from '@/models/QuizQuestion'

export const dynamic = 'force-dynamic'

const SEED_STEPS = [
  {
    stepId: 'qualification', order: 0,
    question: "What's your highest qualification?",
    subtitle: 'We use this to find programs you are eligible for.',
    emoji: '🎓',
    options: [
      { value: 'sslc',         label: '10th Pass (SSLC)',    desc: 'Looking for 11th, 12th or foundation courses' },
      { value: 'plus-two',     label: '12th Pass (Plus Two)', desc: 'Ready for undergraduate programs' },
      { value: 'graduate',     label: "Bachelor's Degree",   desc: 'Looking for PG, MBA or professional programs' },
      { value: 'postgraduate', label: "Master's Degree",     desc: 'Advanced certifications or research programs' },
    ],
  },
  {
    stepId: 'category', order: 1,
    question: 'Which program category interests you?',
    subtitle: 'Choose the type of course you want to pursue.',
    emoji: '📋',
    options: [],
  },
  {
    stepId: 'interest', order: 2,
    question: 'Which subject area do you prefer?',
    subtitle: 'Pick the field you want to build your career in.',
    emoji: '💡',
    options: [
      { value: 'management',   label: 'Management & Business',      desc: 'MBA, BBA, B.Com, M.Com, Finance' },
      { value: 'technology',   label: 'Technology & Computers',     desc: 'BCA, MCA, B.Tech, IT certifications' },
      { value: 'arts-science', label: 'Arts, Science & Humanities', desc: 'BA, B.Sc, MA, M.Sc, Literature' },
      { value: 'foundation',   label: '10th / 12th Foundation',     desc: 'NIOS, BOSSE programs' },
      { value: 'skill',        label: 'Skill & Short Courses',      desc: 'Digital marketing, Tally, Spoken English' },
      { value: 'any',          label: 'Show All Options',           desc: 'No preference — show me everything' },
    ],
  },
  {
    stepId: 'mode', order: 3,
    question: 'How do you prefer to study?',
    subtitle: 'Choose what fits your schedule and lifestyle.',
    emoji: '💻',
    options: [
      { value: 'online',   label: 'Online (Live & Interactive)', desc: 'Study from home with real-time classes' },
      { value: 'distance', label: 'Distance Learning',           desc: 'Self-paced study with materials' },
      { value: 'hybrid',   label: 'Hybrid (Both)',               desc: 'Mix of online and offline study' },
    ],
  },
  {
    stepId: 'goal', order: 4,
    question: "What's your main goal?",
    subtitle: 'This helps us rank the most relevant programs for you.',
    emoji: '🎯',
    options: [
      { value: 'degree',         label: 'Get a Recognised Degree', desc: 'For govt jobs, higher studies, or career growth' },
      { value: 'career-upgrade', label: 'Upgrade My Career',       desc: 'A better job, promotion, or pay hike' },
      { value: 'skill',          label: 'Learn a Specific Skill',  desc: 'Practical, job-ready skills fast' },
      { value: 'govt-job',       label: 'Prepare for Govt Jobs',   desc: 'Eligibility for PSC, SSC, or banking exams' },
    ],
  },
  {
    stepId: 'budget', order: 5,
    question: 'What is your annual budget?',
    subtitle: 'We will filter out programs outside your range.',
    emoji: '💰',
    options: [
      { value: 'low',    label: 'Under ₹20,000 / year',     desc: 'Very affordable options' },
      { value: 'medium', label: '₹20,000 – ₹75,000 / year', desc: 'Mid-range programs' },
      { value: 'high',   label: 'Above ₹75,000 / year',     desc: 'Premium universities' },
    ],
  },
]

export async function GET() {
  try {
    await connectDB()
    const count = await QuizQuestion.countDocuments()
    if (count === 0) {
      await QuizQuestion.insertMany(SEED_STEPS)
    }
    const questions = await QuizQuestion.find({ active: true }).sort({ order: 1 }).lean()
    return NextResponse.json({ questions })
  } catch (err) {
    console.error('quiz-questions GET error:', err)
    return NextResponse.json({ questions: SEED_STEPS })
  }
}
