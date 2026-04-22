import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import University from '@/models/University'
import { UNIVERSITIES } from '@/lib/data'

export async function GET(_req: NextRequest, { params }: { params: { slug: string } }) {
  try {
    await connectDB()
    const dbUni = await University.findOne({ slug: params.slug })
    if (dbUni) return NextResponse.json(dbUni)
  } catch {
    // fall through to static
  }
  const staticUni = UNIVERSITIES.find((u) => u.slug === params.slug)
  if (staticUni) return NextResponse.json(staticUni)
  return NextResponse.json({ error: 'Not found' }, { status: 404 })
}
