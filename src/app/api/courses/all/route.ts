import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import AdminCourse from '@/models/AdminCourse'

export async function GET() {
  try {
    await connectDB()
    const courses = await AdminCourse.find().sort({ title: 1 }).lean()
    return NextResponse.json(courses)
  } catch {
    return NextResponse.json([])
  }
}
