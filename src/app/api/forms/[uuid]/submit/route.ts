import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ uuid: string }> }
) {
  try {
    const { uuid } = await params
    const formData = await request.json()
    
    const form = await prisma.form.findUnique({
      where: { uuid }
    })
    
    if (!form) {
      return NextResponse.json({ error: 'Form not found' }, { status: 404 })
    }
    
    const submission = await prisma.submission.create({
      data: {
        formId: form.id,
        data: formData
      }
    })
    
    return NextResponse.json({ success: true, submissionId: submission.id })
  } catch (error) {
    console.error('Error submitting form:', error)
    return NextResponse.json({ error: 'Failed to submit form' }, { status: 500 })
  }
}
