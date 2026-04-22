import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import Director from '@/models/Director'

export async function GET() {
  try {
    await connectDB()
    const list = await Director.find().sort({ order: 1, createdAt: 1 })
    return NextResponse.json(list)
  } catch {
    return NextResponse.json([])
  }
}
