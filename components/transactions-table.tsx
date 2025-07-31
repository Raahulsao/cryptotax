"use client"

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useTransactions } from '@/hooks/use-transactions'
import { LoadingSpinner } from '@/components/loading-spinner'
import { 
  Filter, 
  Download, 
  Search, 
  RefreshCw,
  AlertCircle,
  FileText
} from 'lucide-react'
import { useTheme } from 'next-themes'
import { Transaction } from '@/lib/types/transaction'

export function TransactionsTable() {
  const { theme } = useTheme()
  const isDarkMode = theme === 'dark'
  const [searchTerm, setSearchTerm] = useState("")
  
  const {
    transactions,
    loading,
    error,
    fetchTransactions,
    clearError,
    isEmpty
  } = useTransactions()

  // Filter transactions based on search term
  const filteredTransactions = transactions.filter(tx => 
    (tx.symbol || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (tx.type || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (tx.exchange || '').toLowerCase().includes(searchTerm.toLowerCase())
  )

  const formatDate = (date: Date | string | null | undefined) => {
    if (!date) return 'Invalid Date'
    
    try {
      const dateObj = date instanceof Date ? date : new Date(date)
      
      if (isNaN(dateObj.getTime())) {
        return 'Invalid Date'
      }
      
      return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(dateObj)
    } catch (error) {
      console.error('Error formatting date:', error, 'Date value:', date)
      return 'Invalid Date'
    }
  }

  const formatAmount = (amount: number | null | undefined, symbol: string) => {
    if (amount === null || amount === undefined || isNaN(amount)) {
      return `0.00 ${symbol}`
    }
    return `${amount.toLocaleString(undefined, { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 8 
    })} ${symbol}`
  }

  const formatPrice = (price: number | null | undefined) => {
    if (price === null || price === undefined || isNaN(price)) {
      return '$0.00'
    }
    return `$${price.toLocaleString(undefined, { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    })}`
  }

  const getTypeColor = (type: string | null | undefined) => {
    if (!type) return 'secondary'
    
    switch (type.toLowerCase()) {
      case 'buy':
        return 'default'
      case 'sell':
        return 'destructive'
      case 'transfer_in':
        return 'secondary'
      case 'transfer_out':
        return 'outline'
      case 'stake':
      case 'reward':
      case 'airdrop':
        return 'default'
      default:
        return 'secondary'
    }
  }

  const getTypeLabel = (type: string | null | undefined) => {
    if (!type) return 'Unknown'
    
    switch (type.toLowerCase()) {
      case 'transfer_in':
        return 'Deposit'
      case 'transfer_out':
        return 'Withdrawal'
      case 'defi_yield':
        return 'DeFi Yield'
      default:
        return type.charAt(0).toUpperCase() + type.slice(1)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" text="Loading transactions..." />
      </div>
    )
  }

  if (error) {
    return (
      <Card className={`${isDarkMode ? 'bg-red-900/20 border-red-800' : 'bg-red-50 border-red-200'}`}>
        <CardContent className="p-6">
          <div className="flex items-center space-x-3">
            <AlertCircle className="h-5 w-5 text-red-500" />
            <div>
              <p className="font-medium text-red-800 dark:text-red-200">Error loading transactions</p>
              <p className="text-sm text-red-600 dark:text-red-300">{error}</p>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={clearError}
              className="ml-auto"
            >
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (isEmpty) {
    return (
      <Card className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <CardContent className="p-12 text-center">
          <FileText className={`w-16 h-16 mx-auto mb-4 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
          <h3 className={`text-xl font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            No Transactions Found
          </h3>
          <p className={`text-sm mb-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Upload your transaction files to see your trading history.
          </p>
          <Button onClick={() => window.location.hash = '#upload'}>
            Upload Transactions
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card className={`transition-colors duration-200 ${
        isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200 shadow-sm'
      }`}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className={isDarkMode ? 'text-white' : 'text-gray-900'}>
              Transaction History
            </CardTitle>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search transactions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={fetchTransactions}
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className={isDarkMode ? "text-gray-300" : "text-gray-700"}>Date</TableHead>
                  <TableHead className={isDarkMode ? "text-gray-300" : "text-gray-700"}>Type</TableHead>
                  <TableHead className={isDarkMode ? "text-gray-300" : "text-gray-700"}>Asset</TableHead>
                  <TableHead className={isDarkMode ? "text-gray-300" : "text-gray-700"}>Amount</TableHead>
                  <TableHead className={isDarkMode ? "text-gray-300" : "text-gray-700"}>Price</TableHead>
                  <TableHead className={isDarkMode ? "text-gray-300" : "text-gray-700"}>Fee</TableHead>
                  <TableHead className={isDarkMode ? "text-gray-300" : "text-gray-700"}>Exchange</TableHead>
                  <TableHead className={isDarkMode ? "text-gray-300" : "text-gray-700"}>Total Value</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell className={isDarkMode ? "text-gray-300" : "text-gray-700"}>
                      {formatDate(transaction.timestamp)}
                    </TableCell>
                    <TableCell>
                      <Badge variant={getTypeColor(transaction.type || 'unknown')}>
                        {getTypeLabel(transaction.type || 'unknown')}
                      </Badge>
                    </TableCell>
                    <TableCell className={`font-medium ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                      {transaction.symbol || 'N/A'}
                    </TableCell>
                    <TableCell className={isDarkMode ? "text-gray-300" : "text-gray-700"}>
                      {formatAmount(transaction.amount, transaction.symbol)}
                    </TableCell>
                    <TableCell className={isDarkMode ? "text-gray-300" : "text-gray-700"}>
                      {formatPrice(transaction.price)}
                    </TableCell>
                    <TableCell className={isDarkMode ? "text-gray-300" : "text-gray-700"}>
                      {(transaction.fee && transaction.fee > 0) ? `${transaction.fee} ${transaction.feeCurrency || transaction.symbol || 'USD'}` : '-'}
                    </TableCell>
                    <TableCell className={isDarkMode ? "text-gray-300" : "text-gray-700"}>
                      <Badge variant="outline">
                        {transaction.exchange?.replace('_', ' ').toUpperCase() || 'Manual'}
                      </Badge>
                    </TableCell>
                    <TableCell className={`font-medium ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                      {formatPrice(transaction.totalValue || ((transaction.amount || 0) * (transaction.price || 0)))}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          {filteredTransactions.length === 0 && searchTerm && (
            <div className="text-center py-8">
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                No transactions found matching "{searchTerm}"
              </p>
            </div>
          )}
          
          <div className="flex items-center justify-between mt-4">
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Showing {filteredTransactions.length} of {transactions.length} transactions
            </p>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Last updated: {new Date().toLocaleString()}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}