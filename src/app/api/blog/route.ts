import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import BlogPost from '@/models/BlogPost'

export async function GET(req: NextRequest) {
  try {
    await connectDB()
    const { searchParams } = new URL(req.url)
    const limit = parseInt(searchParams.get('limit') || '10')
    const posts = await BlogPost.find({ published: true })
      .sort({ createdAt: -1 })
      .limit(limit)
      .select('-content')
    return NextResponse.json({ posts })
  } catch {
    return NextResponse.json({ posts: [] })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    await connectDB()
    const post = await BlogPost.create(body)
    return NextResponse.json({ post }, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 })
  }
}
