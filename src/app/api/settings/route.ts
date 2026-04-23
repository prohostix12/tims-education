import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import Settings from '@/models/Settings'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
  await connectDB()
  const settings = await Settings.findOne().lean()
  return NextResponse.json(
    settings ?? { heroStudentImage: '', logoIcon: '', awardPhoto: '' },
    { headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' } }
  )
}
