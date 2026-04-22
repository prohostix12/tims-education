import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import University from '@/models/University'
import { UNIVERSITIES } from '@/lib/data'

const ADMIN_TOKEN = process.env.ADMIN_TOKEN || 'tims-admin-secret-token-2024'

export async function POST(req: NextRequest) {
  if (req.cookies.get('admin_token')?.value !== ADMIN_TOKEN) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  await connectDB()

  // Use native collection to bypass Mongoose schema caching issues
  const col = University.collection
  let inserted = 0
  let updated = 0

  for (const u of UNIVERSITIES) {
    const { programs, ...doc } = u as any   // programs not in model

    const result = await col.updateOne(
      { slug: u.slug },
      {
        $setOnInsert: { ...doc, createdAt: new Date(), updatedAt: new Date() },
        $set: { filterTags: u.filterTags ?? [], updatedAt: new Date() },
      },
      { upsert: true }
    )

    if (result.upsertedCount) inserted++
    else { updated++; }
  }

  return NextResponse.json({ success: true, inserted, updated })
}
