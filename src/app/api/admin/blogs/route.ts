import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import BlogPost from '@/models/BlogPost'
import { BLOG_POSTS } from '@/lib/data'

const ADMIN_TOKEN = process.env.ADMIN_TOKEN || 'tims-admin-secret-token-2024'

function auth(req: NextRequest) {
  return req.cookies.get('admin_token')?.value === ADMIN_TOKEN
}

async function autoSeed() {
  const count = await BlogPost.countDocuments()
  if (count > 0) return
  for (const post of BLOG_POSTS) {
    const exists = await BlogPost.findOne({ slug: post.slug })
    if (!exists) await BlogPost.create({ ...post, published: true })
  }
}

export async function GET(req: NextRequest) {
  if (!auth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  await connectDB()
  await autoSeed()
  const list = await BlogPost.find().sort({ createdAt: -1 })
  return NextResponse.json(list)
}

export async function POST(req: NextRequest) {
  if (!auth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  await connectDB()
  const body = await req.json()
  const doc = await BlogPost.create(body)
  return NextResponse.json(doc, { status: 201 })
}

export async function PUT(req: NextRequest) {
  if (!auth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  await connectDB()
  const { _id, ...rest } = await req.json()
  const doc = await BlogPost.findByIdAndUpdate(_id, rest, { new: true })
  return NextResponse.json(doc)
}

export async function DELETE(req: NextRequest) {
  if (!auth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  await connectDB()
  const { id } = await req.json()
  await BlogPost.findByIdAndDelete(id)
  return NextResponse.json({ success: true })
}
