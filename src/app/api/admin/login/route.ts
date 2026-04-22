import { NextRequest, NextResponse } from 'next/server'

const ADMIN_USER = process.env.ADMIN_USERNAME || 'admin'
const ADMIN_PASS = process.env.ADMIN_PASSWORD || 'tims@2024'
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || 'tims-admin-secret-token-2024'

export async function POST(req: NextRequest) {
  const { username, password } = await req.json()
  if (username === ADMIN_USER && password === ADMIN_PASS) {
    const res = NextResponse.json({ success: true, token: ADMIN_TOKEN })
    res.cookies.set('admin_token', ADMIN_TOKEN, {
      httpOnly: false,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24, // 24 hours
      path: '/',
    })
    return res
  }
  return NextResponse.json({ success: false, message: 'Invalid credentials' }, { status: 401 })
}
