import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import University from '@/models/University'
import { UNIVERSITIES } from '@/lib/data'

export async function GET() {
  try {
    await connectDB()
    const dbList = await University.find().sort({ createdAt: 1 }).lean()
    const dbSlugs = new Set(dbList.map((u: any) => u.slug))

    // Append static universities that aren't in DB yet
    const staticFallback = UNIVERSITIES
      .filter((u) => !dbSlugs.has(u.slug))
      .map((u) => ({ ...u, _source: 'static' }))

    return NextResponse.json([...dbList, ...staticFallback])
  } catch {
    // DB unavailable — fall back entirely to static
    return NextResponse.json(UNIVERSITIES)
  }
}
