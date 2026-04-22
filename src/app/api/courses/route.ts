import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import Course from '@/models/Course'
import { COURSES } from '@/lib/data'

export async function GET(req: NextRequest) {
  try {
    await connectDB()
    const { searchParams } = new URL(req.url)
    const category = searchParams.get('category')
    const popular = searchParams.get('popular')

    const query: Record<string, unknown> = {}
    if (category) query.category = category
    if (popular === 'true') query.popular = true

    let courses = await Course.find(query).sort({ popular: -1, createdAt: -1 })

    if (courses.length === 0) {
      return NextResponse.json({ courses: COURSES, source: 'static' })
    }

    return NextResponse.json({ courses, source: 'db' })
  } catch {
    return NextResponse.json({ courses: COURSES, source: 'static' })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    await connectDB()
    const course = await Course.create(body)
    return NextResponse.json({ course }, { status: 201 })
  } catch (err) {
    return NextResponse.json({ error: 'Failed to create course' }, { status: 500 })
  }
}
