import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import BlogPost from '@/models/BlogPost'
import { BLOG_POSTS } from '@/lib/data'

export const dynamic = 'force-dynamic'

async function autoSeed() {
  const count = await BlogPost.countDocuments()
  if (count > 0) return
  for (const post of BLOG_POSTS) {
    const exists = await BlogPost.findOne({ slug: post.slug })
    if (!exists) {
      await BlogPost.create({ ...post, published: true })
    }
  }
}

export async function GET(req: NextRequest) {
  await connectDB()
  await autoSeed()

  const { searchParams } = new URL(req.url)
  const slug = searchParams.get('slug')

  if (slug) {
    const post = await BlogPost.findOne({ slug, published: true })
    if (!post) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json(post)
  }

  const posts = await BlogPost.find({ published: true }).sort({ date: -1, createdAt: -1 })
  return NextResponse.json(posts)
}
