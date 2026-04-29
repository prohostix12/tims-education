import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import Subscription from '@/models/Subscription'

export const dynamic = 'force-dynamic'

const ADMIN_TOKEN = process.env.ADMIN_TOKEN || 'tims-admin-secret-token-2024'
function auth(req: NextRequest) {
  return req.cookies.get('admin_token')?.value === ADMIN_TOKEN
}

export async function GET(req: NextRequest) {
  if (!auth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  await connectDB()
  const subscriptions = await Subscription.find({}).sort({ createdAt: -1 }).lean()
  return NextResponse.json({ subscriptions })
}

export async function DELETE(req: NextRequest) {
  if (!auth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  await connectDB()
  const { id } = await req.json()
  await Subscription.findByIdAndDelete(id)
  return NextResponse.json({ success: true })
}
