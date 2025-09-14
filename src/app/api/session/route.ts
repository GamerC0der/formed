import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

export async function GET(request: NextRequest) {
  try {
    const clientIP = request.headers.get('x-forwarded-for') || 
                    request.headers.get('x-real-ip') || 
                    '127.0.0.1'
    
    const hour = Math.floor(Date.now() / (1000 * 60 * 60))
    const sessionData = `${clientIP}-${hour}`
    const sessionId = crypto.createHash('sha256').update(sessionData).digest('hex').substring(0, 16)
    
    return NextResponse.json({ sessionId })
  } catch (error) {
    console.error('Error generating session:', error)
    return NextResponse.json({ error: 'Failed to generate session' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { sessionId } = await request.json()
    
    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID required' }, { status: 400 })
    }
    
    if (!/^[a-f0-9]{16}$/.test(sessionId)) {
      return NextResponse.json({ error: 'Invalid session ID format' }, { status: 400 })
    }
    
    return NextResponse.json({ valid: true })
  } catch (error) {
    console.error('Error validating session:', error)
    return NextResponse.json({ error: 'Failed to validate session' }, { status: 500 })
  }
}
