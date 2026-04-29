import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import QuizQuestion from '@/models/QuizQuestion'

export const dynamic = 'force-dynamic'

const ADMIN_TOKEN = process.env.ADMIN_TOKEN || 'tims-admin-secret-token-2024'
function auth(req: NextRequest) {
  return req.cookies.get('admin_token')?.value === ADMIN_TOKEN
}

export async function GET(req: NextRequest) {
  if (!auth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  await connectDB()
  const questions = await QuizQuestion.find({}).sort({ order: 1 }).lean()
  return NextResponse.json({ questions })
}

export async function POST(req: NextRequest) {
  if (!auth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  await connectDB()
  const body = await req.json()
  const doc = await QuizQuestion.create(body)
  return NextResponse.json({ question: doc })
}

export async function PUT(req: NextRequest) {
  if (!auth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  await connectDB()
  const { _id, ...update } = await req.json()
  const doc = await QuizQuestion.findByIdAndUpdate(_id, update, { new: true })
  return NextResponse.json({ question: doc })
}

export async function DELETE(req: NextRequest) {
  if (!auth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  await connectDB()
  const { id } = await req.json()
  await QuizQuestion.findByIdAndDelete(id)
  return NextResponse.json({ success: true })
}
