import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    const password = authHeader?.replace('Bearer ', '')
    const sessionId = request.headers.get('x-session-id')
    
    if (password === process.env.ADMIN_PASSWORD) {
      const forms = await prisma.form.findMany({
        include: {
          submissions: {
            orderBy: { createdAt: 'desc' }
          }
        },
        orderBy: { createdAt: 'desc' }
      })
      return NextResponse.json(forms)
    } else if (sessionId) {
      const forms = await prisma.form.findMany({
        where: { sessionId },
        include: {
          submissions: {
            orderBy: { createdAt: 'desc' }
          }
        },
        orderBy: { createdAt: 'desc' }
      })
      return NextResponse.json(forms)
    } else {
      return NextResponse.json({ error: 'Session ID required' }, { status: 400 })
    }
  } catch (error) {
    console.error('Error fetching forms:', error)
    return NextResponse.json({ error: 'Failed to fetch forms' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { formName, formComponents, sessionId } = await request.json()
    console.log('API received:', { formName, formComponents, sessionId })
    
    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID required' }, { status: 400 })
    }
    
    const form = await prisma.form.create({
      data: {
        name: formName || 'Untitled Form',
        content: {
          formName: formName || 'Untitled Form',
          formComponents: formComponents || []
        },
        sessionId
      }
    })
    
    console.log('Form saved:', form)
    
    return NextResponse.json({ 
      success: true, 
      uuid: form.uuid,
      url: `/f/${form.uuid}`
    })
  } catch (error) {
    console.error('Error saving form:', error)
    return NextResponse.json({ error: 'Failed to save form' }, { status: 500 })
  }
}