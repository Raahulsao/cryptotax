import { NextRequest, NextResponse } from 'next/server'
import { dbService } from '@/lib/services/database'
import { FirebaseErrorHandler, type EnhancedError } from '@/lib/utils/firebase-error-handler'

export async function GET(request: NextRequest) {
  try {
    console.log('Transactions API: Starting request')
    
    // Get authorization header
    const authHeader = request.headers.get('authorization')
    console.log('Transactions API: Auth header present:', !!authHeader)
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('Transactions API: Missing or invalid auth header')
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
      console.log('Transactions API: User ID extracted:', userId)
    } catch (error) {
      console.log('Transactions API: Token parsing error:', error)
      return NextResponse.json(
        { error: 'Invalid authorization token' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const limitParam = searchParams.get('limit')
    const limit = limitParam ? parseInt(limitParam) : undefined

    console.log('Transactions API: Fetching transactions with limit:', limit)

    // Get user transactions
    const transactions = await dbService.getUserTransactions(userId, limit)

    console.log('Transactions API: Found', transactions.length, 'transactions')

    return NextResponse.json({
      success: true,
      transactions,
      count: transactions.length
    })

  } catch (error) {
    // Check if it's already an enhanced error
    if (error && typeof error === 'object' && 'code' in error && 'userMessage' in error) {
      const enhancedError = error as EnhancedError
      const statusCode = FirebaseErrorHandler.getHttpStatusCode(enhancedError)
      const apiResponse = FirebaseErrorHandler.createApiErrorResponse(enhancedError)
      
      return NextResponse.json(apiResponse, { status: statusCode })
    }
    
    // Handle other errors
    const enhancedError = FirebaseErrorHandler.handleFirebaseError(
      error,
      { operation: 'getTransactions', resource: 'transactions' }
    )
    
    FirebaseErrorHandler.logEnhancedError(enhancedError)
    const statusCode = FirebaseErrorHandler.getHttpStatusCode(enhancedError)
    const apiResponse = FirebaseErrorHandler.createApiErrorResponse(enhancedError)
    
    return NextResponse.json(apiResponse, { status: statusCode })
  }
}