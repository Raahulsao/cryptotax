import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    console.log('Test API: Request received')
    
    // Get authorization header
    const authHeader = request.headers.get('authorization')
    console.log('Test API: Auth header present:', !!authHeader)
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('Test API: Missing or invalid auth header')
      return NextResponse.json(
        { error: 'Authorization header required' },
        { status: 401 }
      )
    }

    // Extract user ID from token
    const token = authHeader.split('Bearer ')[1]
    let userId: string
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      userId = payload.user_id || payload.sub
      console.log('Test API: User ID extracted:', userId)
    } catch (error) {
      console.log('Test API: Token parsing error:', error)
      return NextResponse.json(
        { error: 'Invalid authorization token' },
        { status: 401 }
      )
    }

    console.log('Test API: Success')
    return NextResponse.json({
      success: true,
      message: 'Test API working',
      userId,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Test API error:', error)
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}