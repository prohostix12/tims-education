import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import Course from '@/models/Course'
import Testimonial from '@/models/Testimonial'
import { COURSES, TESTIMONIALS } from '@/lib/data'

export async function POST() {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Seed not allowed in production.' }, { status: 403 })
  }
  try {
    await connectDB()
    await Course.deleteMany({})
    await Testimonial.deleteMany({})
    await Course.insertMany(COURSES)
    await Testimonial.insertMany(TESTIMONIALS)
    return NextResponse.json({ success: true, message: 'Database seeded.' })
  } catch (err) {
    return NextResponse.json({ error: 'Seed failed' }, { status: 500 })
  }
}
