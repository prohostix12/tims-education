import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import University from '@/models/University'
import { cookies } from 'next/headers'

const ADMIN_TOKEN = process.env.ADMIN_TOKEN || 'tims-admin-secret-token-2024'

function auth(req: NextRequest) {
  const cookie = req.cookies.get('admin_token')?.value
  return cookie === ADMIN_TOKEN
}

export async function GET(req: NextRequest) {
  if (!auth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  await connectDB()
  const list = await University.find().sort({ createdAt: -1 })
  return NextResponse.json(list)
}

export async function POST(req: NextRequest) {
  if (!auth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  await connectDB()
  const body = await req.json()
  const doc = await University.create(body)
  return NextResponse.json(doc, { status: 201 })
}

export async function PUT(req: NextRequest) {
  if (!auth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  await connectDB()
  const body = await req.json()
  const { _id, ...rest } = body
  const doc = await University.findByIdAndUpdate(_id, rest, { new: true })
  return NextResponse.json(doc)
}
