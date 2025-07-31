import { NextRequest, NextResponse } from 'next/server'
import { dbService } from '@/lib/services/database'
import { portfolioCalculator } from '@/lib/services/portfolio-calculator'
import { FirebaseErrorHandler, type EnhancedError } from '@/lib/utils/firebase-error-handler'

export async function GET(request: NextRequest) {
  try {
    console.log('Overview API: Starting request')
    
    // Get authorization header
    const authHeader = request.headers.get('authorization')
    console.log('Overview API: Auth header present:', !!authHeader)
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('Overview API: Missing or invalid auth header')
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
      console.log('Overview API: User ID extracted:', userId)
    } catch (error) {
      console.log('Overview API: Token parsing error:', error)
      return NextResponse.json(
        { error: 'Invalid authorization token' },
        { status: 401 }
      )
    }

    console.log('Overview API: Calculating comprehensive overview')
    
    // Get user transactions and portfolio
    const transactions = await dbService.getUserTransactions(userId)
    const portfolio = await portfolioCalculator.calculateUserPortfolio(userId)
    
    // Calculate tax implications
    const currentYear = new Date().getFullYear()
    const taxableEvents = transactions.filter(tx => 
      tx.type === 'sell' || tx.type === 'trade'
    )
    
    // Calculate realized and unrealized gains from portfolio data
    const realizedGains = transactions
      .filter(tx => tx.type === 'sell')
      .reduce((sum, tx) => {
        // Simple realized gain calculation (this could be more sophisticated)
        const costBasis = tx.amount * tx.price
        const saleValue = tx.totalValue
        return sum + (saleValue - costBasis)
      }, 0)
    
    const unrealizedGains = portfolio.totalValue - portfolio.totalInvested
    const totalGains = portfolio.totalGains
    const taxLiability = Math.max(0, realizedGains * 0.15) // Only tax realized gains
    
    // Calculate monthly activity for insights
    const monthlyActivity = getMonthlyActivity(transactions)
    const transactionsByType = getTransactionsByType(transactions)
    
    // Calculate performance metrics
    const performanceMetrics = {
      totalReturn: totalGains,
      totalReturnPercentage: portfolio.totalInvested > 0 
        ? ((totalGains / portfolio.totalInvested) * 100) 
        : 0,
      avgTransactionValue: transactions.length > 0 
        ? transactions.reduce((sum, tx) => sum + (tx.totalValue || 0), 0) / transactions.length 
        : 0,
      largestTransaction: transactions.length > 0 
        ? Math.max(...transactions.map(tx => tx.totalValue || 0)) 
        : 0,
      smallestTransaction: transactions.length > 0 
        ? Math.min(...transactions.map(tx => tx.totalValue || 0)) 
        : 0
    }

    const overview = {
      portfolio: {
        totalValue: portfolio.totalValue,
        totalInvested: portfolio.totalInvested,
        unrealizedGains: unrealizedGains,
        realizedGains: realizedGains,
        totalGains: totalGains,
        gainPercentage: performanceMetrics.totalReturnPercentage,
        holdings: portfolio.holdings.map(holding => ({
          ...holding,
          costBasis: holding.totalInvested,
          currentValue: holding.currentValue || 0
        })),
        holdingsCount: portfolio.holdings.length
      },
      transactions: {
        total: transactions.length,
        thisYear: transactions.filter(tx => 
          new Date(tx.timestamp).getFullYear() === currentYear
        ).length,
        taxableEvents: taxableEvents.length,
        byType: transactionsByType,
        recentTransactions: transactions.slice(0, 5) // Last 5 transactions
      },
      tax: {
        year: currentYear,
        estimatedLiability: taxLiability,
        realizedGains: realizedGains,
        unrealizedGains: unrealizedGains,
        totalGains: totalGains,
        taxableEvents: taxableEvents.length,
        status: taxLiability > 0 ? 'Tax Due' : 'No Tax Due'
      },
      insights: {
        performance: performanceMetrics,
        monthlyActivity: monthlyActivity,
        mostActiveMonth: getMostActiveMonth(transactions),
        assetDistribution: portfolio.holdings.map((holding: any) => ({
          symbol: holding.symbol,
          percentage: portfolio.totalValue > 0 
            ? (holding.currentValue / portfolio.totalValue) * 100 
            : 0,
          value: holding.currentValue,
          amount: holding.amount
        })),
        summary: {
          totalTransactions: transactions.length,
          totalValue: portfolio.totalValue,
          totalInvested: portfolio.totalInvested,
          profitLoss: totalGains,
          profitLossPercentage: performanceMetrics.totalReturnPercentage
        }
      },
      lastUpdated: new Date().toISOString()
    }

    console.log('Overview API: Comprehensive overview calculated successfully')
    
    return NextResponse.json({
      success: true,
      overview
    })

  } catch (error) {
    console.error('Overview API: Error:', error)
    
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
      { operation: 'calculateOverview', resource: 'overview' }
    )
    
    FirebaseErrorHandler.logEnhancedError(enhancedError)
    const statusCode = FirebaseErrorHandler.getHttpStatusCode(enhancedError)
    const apiResponse = FirebaseErrorHandler.createApiErrorResponse(enhancedError)
    
    return NextResponse.json(apiResponse, { status: statusCode })
  }
}

function getMostActiveMonth(transactions: any[]): string {
  if (transactions.length === 0) return 'N/A'
  
  const monthCounts = transactions.reduce((acc, tx) => {
    const month = new Date(tx.timestamp).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long' 
    })
    acc[month] = (acc[month] || 0) + 1
    return acc
  }, {} as Record<string, number>)
  
  return Object.entries(monthCounts)
    .sort(([,a], [,b]) => (b as number) - (a as number))[0]?.[0] || 'N/A'
}

function getMonthlyActivity(transactions: any[]) {
  const monthlyData = transactions.reduce((acc, tx) => {
    const month = new Date(tx.timestamp).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short' 
    })
    if (!acc[month]) {
      acc[month] = { month, transactions: 0, value: 0 }
    }
    acc[month].transactions += 1
    acc[month].value += tx.totalValue || 0
    return acc
  }, {} as Record<string, any>)
  
  return Object.values(monthlyData)
    .sort((a: any, b: any) => new Date(a.month).getTime() - new Date(b.month).getTime())
    .slice(-12) // Last 12 months
}

function getTransactionsByType(transactions: any[]) {
  return transactions.reduce((acc, tx) => {
    const type = tx.type || 'unknown'
    acc[type] = (acc[type] || 0) + 1
    return acc
  }, {} as Record<string, number>)
}