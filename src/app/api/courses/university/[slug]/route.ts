import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import AdminCourse from '@/models/AdminCourse'

export async function GET(_req: NextRequest, { params }: { params: { slug: string } }) {
  try {
    await connectDB()
    const courses = await AdminCourse.find({ universities: params.slug })
    return NextResponse.json(courses)
  } catch {
    return NextResponse.json([])
  }
}
