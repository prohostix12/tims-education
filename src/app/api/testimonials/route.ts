import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import Testimonial from '@/models/Testimonial'
import { TESTIMONIALS } from '@/lib/data'

export async function GET() {
  try {
    await connectDB()
    let testimonials = await Testimonial.find({ active: true }).sort({ createdAt: -1 })
    if (testimonials.length === 0) {
      return NextResponse.json({ testimonials: TESTIMONIALS, source: 'static' })
    }
    return NextResponse.json({ testimonials, source: 'db' })
  } catch {
    return NextResponse.json({ testimonials: TESTIMONIALS, source: 'static' })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    await connectDB()
    const testimonial = await Testimonial.create(body)
    return NextResponse.json({ testimonial }, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Failed to create testimonial' }, { status: 500 })
  }
}
