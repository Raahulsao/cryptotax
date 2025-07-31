"use client"

import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/hooks/use-firebase-auth'
import { Transaction } from '@/lib/types/transaction'

export function useTransactions(limit?: number) {
  const { user } = useAuth()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTransactions = useCallback(async () => {
    if (!user) {
      setLoading(false)
      return
    }

    try {
      setError(null)
      setLoading(true)

      const token = await user.getIdToken()
      const url = limit 
        ? `/api/transactions?limit=${limit}`
        : '/api/transactions'

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.details || errorData.error || 'Failed to fetch transactions')
      }

      const data = await response.json()
      
      if (data.success) {
        setTransactions(data.transactions)
      } else {
        throw new Error(data.error || 'Failed to fetch transactions')
      }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch transactions'
      setError(errorMessage)
      console.error('Transactions fetch error:', error)
    } finally {
      setLoading(false)
    }
  }, [user, limit])

  // Initial load
  useEffect(() => {
    if (user) {
      fetchTransactions()
    } else {
      setTransactions([])
      setLoading(false)
    }
  }, [user, fetchTransactions])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  return {
    transactions,
    loading,
    error,
    fetchTransactions,
    clearError,
    isEmpty: transactions.length === 0
  }
}