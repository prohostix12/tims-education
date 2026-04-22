import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import University from '@/models/University'
import AdminCourse from '@/models/AdminCourse'
import BlogPost from '@/models/BlogPost'
import Contact from '@/models/Contact'
import Director from '@/models/Director'

export async function GET() {
  try {
    await connectDB()
    const [universities, courses, blogs, contacts, directors] = await Promise.all([
      University.countDocuments(),
      AdminCourse.countDocuments(),
      BlogPost.countDocuments(),
      Contact.countDocuments(),
      Director.countDocuments(),
    ])
    return NextResponse.json({ universities, courses, blogs, contacts, directors })
  } catch {
    return NextResponse.json({ universities: 0, courses: 0, blogs: 0, contacts: 0, directors: 0 })
  }
}
