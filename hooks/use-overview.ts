"use client"

import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/hooks/use-firebase-auth'

interface OverviewData {
  portfolio: {
    totalValue: number
    totalInvested: number
    unrealizedGains: number
    realizedGains: number
    totalGains: number
    gainPercentage: number
    holdings: any[]
    holdingsCount: number
  }
  transactions: {
    total: number
    thisYear: number
    taxableEvents: number
    byType: Record<string, number>
    recentTransactions: any[]
  }
  tax: {
    year: number
    estimatedLiability: number
    realizedGains: number
    unrealizedGains: number
    totalGains: number
    taxableEvents: number
    status: string
  }
  insights: {
    performance: {
      totalReturn: number
      totalReturnPercentage: number
      avgTransactionValue: number
      largestTransaction: number
      smallestTransaction: number
    }
    monthlyActivity: any[]
    mostActiveMonth: string
    assetDistribution: any[]
    summary: {
      totalTransactions: number
      totalValue: number
      totalInvested: number
      profitLoss: number
      profitLossPercentage: number
    }
  }
  lastUpdated: string
}

export function useOverview() {
  const { user } = useAuth()
  const [overview, setOverview] = useState<OverviewData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchOverview = useCallback(async () => {
    if (!user) {
      setLoading(false)
      return
    }

    try {
      setError(null)
      setLoading(true)
      
      const token = await user.getIdToken()
      const response = await fetch('/api/overview', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.details || errorData.error || 'Failed to fetch overview')
      }

      const data = await response.json()
      if (data.success) {
        setOverview(data.overview)
      } else {
        throw new Error(data.error || 'Failed to fetch overview')
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch overview'
      setError(errorMessage)
      console.error('Overview fetch error:', error)
    } finally {
      setLoading(false)
    }
  }, [user])

  // Initial load
  useEffect(() => {
    if (user) {
      fetchOverview()
    } else {
      setOverview(null)
      setLoading(false)
    }
  }, [user, fetchOverview])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  return {
    overview,
    loading,
    error,
    fetchOverview,
    clearError,
    isEmpty: !overview || overview.transactions.total === 0
  }
}