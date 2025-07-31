"use client"

import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/hooks/use-firebase-auth'
import { UserPortfolio } from '@/lib/types/transaction'

interface PortfolioMetrics {
  totalReturn: number
  totalReturnPercent: number
  bestPerformer: { symbol: string; return: number } | null
  worstPerformer: { symbol: string; return: number } | null
  volatility: number
}

export function usePortfolio() {
  const { user } = useAuth()
  const [portfolio, setPortfolio] = useState<UserPortfolio | null>(null)
  const [metrics, setMetrics] = useState<PortfolioMetrics | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)

  const fetchPortfolio = useCallback(async (forceRecalculate = false) => {
    if (!user) {
      setLoading(false)
      return
    }

    try {
      setError(null)
      if (!forceRecalculate) {
        setLoading(true)
      } else {
        setRefreshing(true)
      }

      const token = await user.getIdToken()
      const url = forceRecalculate 
        ? '/api/portfolio?recalculate=true'
        : '/api/portfolio'

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.details || errorData.error || 'Failed to fetch portfolio')
      }

      const data = await response.json()
      
      if (data.success) {
        setPortfolio(data.portfolio)
      } else {
        throw new Error(data.error || 'Failed to fetch portfolio')
      }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch portfolio'
      setError(errorMessage)
      console.error('Portfolio fetch error:', error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [user])

  const fetchMetrics = useCallback(async (days = 30) => {
    if (!user) return

    try {
      const token = await user.getIdToken()
      const response = await fetch(`/api/portfolio/metrics?days=${days}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.details || errorData.error || 'Failed to fetch metrics')
      }

      const data = await response.json()
      
      if (data.success) {
        setMetrics(data.metrics)
      }

    } catch (error) {
      console.error('Metrics fetch error:', error)
    }
  }, [user])

  const recalculatePortfolio = useCallback(async () => {
    if (!user) return

    try {
      setRefreshing(true)
      setError(null)

      const token = await user.getIdToken()
      const response = await fetch('/api/portfolio', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!response.ok) {
        throw new Error('Failed to recalculate portfolio')
      }

      const data = await response.json()
      
      if (data.success) {
        setPortfolio(data.portfolio)
        // Also refresh metrics
        await fetchMetrics()
      } else {
        throw new Error(data.error || 'Failed to recalculate portfolio')
      }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to recalculate portfolio'
      setError(errorMessage)
      console.error('Portfolio recalculation error:', error)
    } finally {
      setRefreshing(false)
    }
  }, [user, fetchMetrics])

  // Initial load
  useEffect(() => {
    if (user) {
      fetchPortfolio()
      fetchMetrics()
    } else {
      setPortfolio(null)
      setMetrics(null)
      setLoading(false)
    }
  }, [user, fetchPortfolio, fetchMetrics])

  // Auto-refresh every 5 minutes
  useEffect(() => {
    if (!user || !portfolio) return

    const interval = setInterval(() => {
      fetchPortfolio()
      fetchMetrics()
    }, 5 * 60 * 1000) // 5 minutes

    return () => clearInterval(interval)
  }, [user, portfolio, fetchPortfolio, fetchMetrics])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  // Helper functions for easy access to portfolio data
  const isEmpty = !portfolio || portfolio.holdings.length === 0
  const totalValue = portfolio?.totalValue || 0
  const totalInvested = portfolio?.totalInvested || 0
  const totalGains = portfolio?.totalGains || 0
  const totalGainsPercent = portfolio?.totalGainsPercent || 0
  const holdings = portfolio?.holdings || []
  const lastUpdated = portfolio?.lastUpdated

  // Get top holdings (by value)
  const topHoldings = holdings.slice(0, 5)

  // Get allocation data for charts
  const allocationData = holdings.map(holding => ({
    name: holding.name,
    symbol: holding.symbol,
    value: holding.allocation || 0,
    amount: holding.currentValue || 0,
    color: getColorForSymbol(holding.symbol)
  }))

  return {
    // Data
    portfolio,
    metrics,
    holdings,
    topHoldings,
    allocationData,
    
    // Computed values
    isEmpty,
    totalValue,
    totalInvested,
    totalGains,
    totalGainsPercent,
    lastUpdated,
    
    // State
    loading,
    refreshing,
    error,
    
    // Actions
    fetchPortfolio,
    fetchMetrics,
    recalculatePortfolio,
    clearError
  }
}

// Helper function to get consistent colors for symbols
function getColorForSymbol(symbol: string): string {
  const colors = [
    '#F7931A', // Bitcoin orange
    '#627EEA', // Ethereum blue
    '#0033AD', // Cardano blue
    '#9945FF', // Solana purple
    '#8B5CF6', // Generic purple
    '#10B981', // Green
    '#F59E0B', // Amber
    '#EF4444', // Red
    '#8B5CF6', // Purple
    '#06B6D4', // Cyan
    '#84CC16', // Lime
    '#F97316', // Orange
  ]
  
  // Use symbol hash to get consistent color
  let hash = 0
  for (let i = 0; i < symbol.length; i++) {
    hash = symbol.charCodeAt(i) + ((hash << 5) - hash)
  }
  
  return colors[Math.abs(hash) % colors.length]
}