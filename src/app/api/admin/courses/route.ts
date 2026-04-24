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
  try {
    await connectDB()
    const body = await req.json()
    const doc = await AdminCourse.create(body)
    return NextResponse.json(doc, { status: 201 })
  } catch (err: any) {
    if (err.code === 11000) {
      return NextResponse.json({ message: 'A course with this slug already exists. Use a different slug.' }, { status: 400 })
    }
    return NextResponse.json({ message: err.message || 'Server error' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  if (!auth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    await connectDB()
    const { _id, ...rest } = await req.json()
    const doc = await AdminCourse.findByIdAndUpdate(_id, rest, { new: true })
    return NextResponse.json(doc)
  } catch (err: any) {
    if (err.code === 11000) {
      return NextResponse.json({ message: 'A course with this slug already exists.' }, { status: 400 })
    }
    return NextResponse.json({ message: err.message || 'Server error' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  if (!auth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  await connectDB()
  const { id } = await req.json()
  await AdminCourse.findByIdAndDelete(id)
  return NextResponse.json({ success: true })
}
