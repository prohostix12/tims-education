import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import Contact from '@/models/Contact'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, email, phone, course, message } = body

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Name, email and message are required.' }, { status: 400 })
    }

    await connectDB()
    await Contact.create({ name, email, phone, course, message })

    return NextResponse.json({ success: true, message: 'Message received. We will contact you shortly.' })
  } catch (err) {
    console.error('Contact API error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET() {
  try {
    await connectDB()
    const contacts = await Contact.find({}).sort({ createdAt: -1 }).limit(100)
    return NextResponse.json({ contacts })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
