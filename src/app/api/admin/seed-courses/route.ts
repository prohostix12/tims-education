import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import AdminCourse from '@/models/AdminCourse'
import University from '@/models/University'
import { COURSES } from '@/lib/data'

const ADMIN_TOKEN = process.env.ADMIN_TOKEN || 'tims-admin-secret-token-2024'

export async function POST(req: NextRequest) {
  if (req.cookies.get('admin_token')?.value !== ADMIN_TOKEN) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  await connectDB()

  // Build name → slug map from DB universities
  const dbUnis = await University.find().lean() as any[]
  const nameToSlug: Record<string, string> = {}
  for (const u of dbUnis) {
    nameToSlug[u.name.toLowerCase()] = u.slug
    nameToSlug[u.shortName.toLowerCase()] = u.slug
  }

  // Manual fallback mappings for static names used in COURSES data
  const fallback: Record<string, string> = {
    'aligarh muslim university':              'aligarh-muslim-university',
    'amu online':                             'aligarh-muslim-university',
    'andhra university':                      'andhra-university',
    'gla university':                         'gla-university',
    'jain university':                        'jain-university',
    'manipal university':                     'manipal-university',
    'amrita university':                      'amrita-university',
    'mizoram university':                     'mizoram-university',
    'guru kashi university':                  'guru-kashi-university',
    'swami vivekanand subharti university':   'subharti-university',
    'nios (national institute of open schooling)': 'nios',
    'nios':                                   'nios',
    'jamia urdu aligarh':                     'jamia-urdu',
    'bosse':                                  'bosse',
    'andhra univ':                            'andhra-university',
  }

  const resolveUni = (name: string): string | null => {
    const key = name.toLowerCase().trim()
    return nameToSlug[key] || fallback[key] || null
  }

  const col = AdminCourse.collection
  let inserted = 0
  let updated = 0

  for (const c of COURSES) {
    const uniSlugs = (c.universities as string[])
      .map(resolveUni)
      .filter(Boolean) as string[]

    const doc = {
      slug:            c.slug,
      title:           c.title,
      category:        c.category,
      description:     c.description,
      fullDescription: c.fullDescription,
      duration:        c.duration,
      mode:            c.mode,
      eligibility:     c.eligibility,
      popular:         c.popular,
      icon:            c.icon,
      badge:           c.badge,
      feeRange:        c.feeRange,
      careers:         c.careers,
      highlights:      c.highlights,
      universities:    uniSlugs,
      syllabusUrl:     '',
    }

    const result = await col.updateOne(
      { slug: c.slug },
      {
        $setOnInsert: { ...doc, createdAt: new Date(), updatedAt: new Date() },
        $set: { universities: uniSlugs, updatedAt: new Date() },
      },
      { upsert: true }
    )

    if (result.upsertedCount) inserted++
    else updated++
  }

  return NextResponse.json({ success: true, inserted, updated })
}
