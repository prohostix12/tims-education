import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import StudyMaterial from '@/models/StudyMaterial'

const ADMIN_TOKEN = process.env.ADMIN_TOKEN || 'tims-admin-secret-token-2024'
function auth(req: NextRequest) {
  return req.cookies.get('admin_token')?.value === ADMIN_TOKEN
}

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  if (!auth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  await connectDB()
  const list = await StudyMaterial.find().sort({ createdAt: -1 })
  return NextResponse.json(list)
}

export async function POST(req: NextRequest) {
  if (!auth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  await connectDB()
  const body = await req.json()
  const doc = await StudyMaterial.create(body)
  return NextResponse.json(doc, { status: 201 })
}

export async function PUT(req: NextRequest) {
  if (!auth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  await connectDB()
  const { _id, ...rest } = await req.json()
  const doc = await StudyMaterial.findByIdAndUpdate(_id, rest, { new: true })
  return NextResponse.json(doc)
}

export async function DELETE(req: NextRequest) {
  if (!auth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  await connectDB()
  const { id } = await req.json()
  await StudyMaterial.findByIdAndDelete(id)
  return NextResponse.json({ success: true })
}
