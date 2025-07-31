import { NextRequest, NextResponse } from 'next/server'
import { portfolioCalculator } from '@/lib/services/portfolio-calculator'
import { dbService } from '@/lib/services/database'
import { FirebaseErrorHandler, type EnhancedError } from '@/lib/utils/firebase-error-handler'

export async function GET(request: NextRequest) {
  try {
    console.log('Portfolio API: Starting request')
    
    // Get authorization header
    const authHeader = request.headers.get('authorization')
    console.log('Portfolio API: Auth header present:', !!authHeader)
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('Portfolio API: Missing or invalid auth header')
      return NextResponse.json(
        { error: 'Authorization header required' },
        { status: 401 }
      )
    }

    // Extract user ID from token (simplified - in production use proper verification)
    const token = authHeader.split('Bearer ')[1]
    let userId: string
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      userId = payload.user_id || payload.sub
      console.log('Portfolio API: User ID extracted:', userId)
    } catch (error) {
      console.log('Portfolio API: Token parsing error:', error)
      return NextResponse.json(
        { error: 'Invalid authorization token' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const forceRecalculate = searchParams.get('recalculate') === 'true'
    console.log('Portfolio API: Force recalculate:', forceRecalculate)

    let portfolio

    if (forceRecalculate) {
      console.log('Portfolio API: Force recalculating portfolio')
      // Force recalculation
      portfolio = await portfolioCalculator.calculateUserPortfolio(userId)
    } else {
      console.log('Portfolio API: Checking for cached portfolio')
      // Try to get cached portfolio first
      portfolio = await dbService.getUserPortfolio(userId)
      
      if (!portfolio) {
        console.log('Portfolio API: No cached portfolio, calculating new one')
        // No cached portfolio, calculate new one
        portfolio = await portfolioCalculator.calculateUserPortfolio(userId)
      } else {
        console.log('Portfolio API: Found cached portfolio, checking if stale')
        // Check if portfolio is stale (older than 5 minutes)
        const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000)
        if (portfolio.lastUpdated < fiveMinutesAgo) {
          console.log('Portfolio API: Portfolio is stale, recalculating')
          portfolio = await portfolioCalculator.calculateUserPortfolio(userId)
        } else {
          console.log('Portfolio API: Using cached portfolio')
        }
      }
    }

    console.log('Portfolio API: Portfolio calculated successfully')

    return NextResponse.json({
      success: true,
      portfolio
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
      { operation: 'getPortfolio', resource: 'portfolio' }
    )
    
    FirebaseErrorHandler.logEnhancedError(enhancedError)
    const statusCode = FirebaseErrorHandler.getHttpStatusCode(enhancedError)
    const apiResponse = FirebaseErrorHandler.createApiErrorResponse(enhancedError)
    
    return NextResponse.json(apiResponse, { status: statusCode })
  }
}

// Force portfolio recalculation
export async function POST(request: NextRequest) {
  try {
    // Get authorization header
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
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
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid authorization token' },
        { status: 401 }
      )
    }

    // Force recalculate portfolio
    const portfolio = await portfolioCalculator.calculateUserPortfolio(userId)

    return NextResponse.json({
      success: true,
      message: 'Portfolio recalculated successfully',
      portfolio
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
      { operation: 'recalculatePortfolio', resource: 'portfolio' }
    )
    
    FirebaseErrorHandler.logEnhancedError(enhancedError)
    const statusCode = FirebaseErrorHandler.getHttpStatusCode(enhancedError)
    const apiResponse = FirebaseErrorHandler.createApiErrorResponse(enhancedError)
    
    return NextResponse.json(apiResponse, { status: statusCode })
  }
}