import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import BlogPost from '@/models/BlogPost'
import { BLOG_POSTS } from '@/lib/data'

const ADMIN_TOKEN = process.env.ADMIN_TOKEN || 'tims-admin-secret-token-2024'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  if (req.cookies.get('admin_token')?.value !== ADMIN_TOKEN)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  await connectDB()

  let inserted = 0
  let skipped  = 0

  for (const post of BLOG_POSTS) {
    const exists = await BlogPost.findOne({ slug: post.slug })
    if (exists) { skipped++; continue }

    await BlogPost.create({
      slug:      post.slug,
      title:     post.title,
      excerpt:   post.excerpt,
      content:   post.content,
      author:    post.author,
      category:  post.category,
      tags:      post.tags,
      icon:      post.icon,
      date:      post.date,
      readTime:  post.readTime,
      featured:  post.featured,
      published: true,
    })
    inserted++
  }

  return NextResponse.json({ inserted, skipped, total: BLOG_POSTS.length })
}
