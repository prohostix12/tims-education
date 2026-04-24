import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import StudyMaterial from '@/models/StudyMaterial'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  await connectDB()
  const { searchParams } = new URL(req.url)
  const uniSlug = searchParams.get('university')
  const query = uniSlug ? { universitySlug: uniSlug } : {}
  const list = await StudyMaterial.find(query).sort({ createdAt: -1 })
  return NextResponse.json(list, {
    headers: { 'Cache-Control': 'no-store' },
  })
}
