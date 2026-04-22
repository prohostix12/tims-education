import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import AdminCourse from '@/models/AdminCourse'

const ADMIN_TOKEN = process.env.ADMIN_TOKEN || 'tims-admin-secret-token-2024'

function auth(req: NextRequest) {
  return req.cookies.get('admin_token')?.value === ADMIN_TOKEN
}

export async function GET(req: NextRequest) {
  if (!auth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  await connectDB()
  const list = await AdminCourse.find().sort({ createdAt: -1 })
  return NextResponse.json(list)
}

export async function POST(req: NextRequest) {
  if (!auth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  await connectDB()
  const body = await req.json()
  const doc = await AdminCourse.create(body)
  return NextResponse.json(doc, { status: 201 })
}

export async function PUT(req: NextRequest) {
  if (!auth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  await connectDB()
  const { _id, ...rest } = await req.json()
  const doc = await AdminCourse.findByIdAndUpdate(_id, rest, { new: true })
  return NextResponse.json(doc)
}
