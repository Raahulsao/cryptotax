"use client"

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useOverview } from '@/hooks/use-overview'
import { LoadingSpinner } from '@/components/loading-spinner'
import { 
  TrendingUp, 
  TrendingDown, 
  RefreshCw, 
  Target, 
  BarChart3, 
  FileText,
  AlertCircle,
  Upload
} from 'lucide-react'
import { useTheme } from 'next-themes'
import { ResponsiveContainer, PieChart, Cell, Tooltip, Pie } from 'recharts'

export function PortfolioOverview() {
  const { theme } = useTheme()
  const isDarkMode = theme === 'dark'
  
  const {
    overview,
    loading,
    error,
    fetchOverview,
    clearError,
    isEmpty
  } = useOverview()

  // Extract data from overview
  const portfolio = overview?.portfolio
  const totalValue = portfolio?.totalValue || 0
  const totalInvested = portfolio?.totalInvested || 0
  const totalGains = portfolio?.totalGains || 0
  const totalGainsPercent = portfolio?.gainPercentage || 0
  const allocationData = overview?.insights?.assetDistribution?.map((asset, index) => ({
    ...asset,
    color: ['#F7931A', '#627EEA', '#0033AD', '#9945FF', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444'][index % 8]
  })) || []

  // Calculate metrics from overview data
  const metrics = React.useMemo(() => {
    if (!overview?.portfolio?.holdings) return null
    
    const holdings = overview.portfolio.holdings
    const bestPerformer = holdings.reduce((best, holding) => {
      const holdingReturn = ((holding.currentValue - holding.costBasis) / holding.costBasis) * 100
      const bestReturn = best ? ((best.currentValue - best.costBasis) / best.costBasis) * 100 : -Infinity
      return holdingReturn > bestReturn ? { ...holding, return: holdingReturn } : best
    }, null)

    const worstPerformer = holdings.reduce((worst, holding) => {
      const holdingReturn = ((holding.currentValue - holding.costBasis) / holding.costBasis) * 100
      const worstReturn = worst ? ((worst.currentValue - worst.costBasis) / worst.costBasis) * 100 : Infinity
      return holdingReturn < worstReturn ? { ...holding, return: holdingReturn } : worst
    }, null)

    // Simple volatility calculation based on holdings variance
    const avgReturn = holdings.reduce((sum, holding) => {
      return sum + ((holding.currentValue - holding.costBasis) / holding.costBasis) * 100
    }, 0) / holdings.length

    const volatility = Math.sqrt(
      holdings.reduce((sum, holding) => {
        const holdingReturn = ((holding.currentValue - holding.costBasis) / holding.costBasis) * 100
        return sum + Math.pow(holdingReturn - avgReturn, 2)
      }, 0) / holdings.length
    )

    return {
      bestPerformer,
      worstPerformer,
      volatility: isNaN(volatility) ? 0 : volatility
    }
  }, [overview])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" text="Loading your portfolio..." />
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
              <p className="font-medium text-red-800 dark:text-red-200">Error loading portfolio</p>
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
          <Upload className={`w-16 h-16 mx-auto mb-4 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
          <h3 className={`text-xl font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            No Portfolio Data
          </h3>
          <p className={`text-sm mb-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Upload your transaction files to see your portfolio analytics and insights.
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
      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className={`transition-colors duration-200 ${
          isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200 shadow-sm'
        }`}>
          <CardHeader className="pb-3">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-white" />
              </div>
              <CardTitle className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Total Worth
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              ${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className={`text-sm ${totalGainsPercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {totalGainsPercent >= 0 ? '+' : ''}{totalGainsPercent.toFixed(2)}%
            </div>
          </CardContent>
        </Card>

        <Card className={`transition-colors duration-200 ${
          isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200 shadow-sm'
        }`}>
          <CardHeader className="pb-3">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                <Target className="w-4 h-4 text-white" />
              </div>
              <CardTitle className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Total Invested
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              ${totalInvested.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Cost basis
            </div>
          </CardContent>
        </Card>

        <Card className={`transition-colors duration-200 ${
          isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200 shadow-sm'
        }`}>
          <CardHeader className="pb-3">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-4 h-4 text-white" />
              </div>
              <CardTitle className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Total Gains
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${totalGains >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {totalGains >= 0 ? '+' : ''}${totalGains.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className={`text-sm ${totalGains >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {totalGains >= 0 ? '+' : ''}{totalGainsPercent.toFixed(2)}%
            </div>
          </CardContent>
        </Card>

        <Card className={`transition-colors duration-200 ${
          isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200 shadow-sm'
        }`}>
          <CardHeader className="pb-3">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
                <FileText className="w-4 h-4 text-white" />
              </div>
              <CardTitle className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Taxable Gains
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              ${Math.max(0, totalGains).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Subject to tax
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Portfolio Allocation Chart */}
      {allocationData.length > 0 && (
        <Card className={`transition-colors duration-200 ${
          isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200 shadow-sm'
        }`}>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className={isDarkMode ? 'text-white' : 'text-gray-900'}>
              Portfolio Allocation
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={fetchOverview}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Pie Chart */}
              <div className="relative">
                <ResponsiveContainer width="100%" height={320}>
                  <PieChart>
                    <Pie
                      data={allocationData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={130}
                      innerRadius={70}
                      fill="#8884d8"
                      dataKey="amount"
                      stroke="none"
                    >
                      {allocationData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload
                          return (
                            <div className="bg-gray-900 text-white p-4 rounded-lg shadow-xl border border-gray-700">
                              <p className="font-semibold text-lg">{data.name}</p>
                              <p className="text-sm">
                                <span className="text-gray-300">Value:</span> ${data.amount.toLocaleString()}
                              </p>
                              <p className="text-sm">
                                <span className="text-gray-300">Allocation:</span> {data.value.toFixed(1)}%
                              </p>
                            </div>
                          )
                        }
                        return null
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {totalValue >= 1000 
                        ? `$${(totalValue / 1000).toFixed(1)}K`
                        : `$${totalValue.toFixed(0)}`
                      }
                    </div>
                    <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} font-medium`}>
                      Total Value
                    </div>
                  </div>
                </div>
              </div>

              {/* Legend */}
              <div className="space-y-3">
                <h4 className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Holdings Breakdown
                </h4>
                {allocationData.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-4 h-4 rounded-full" 
                        style={{ backgroundColor: item.color }} 
                      />
                      <div>
                        <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                          {item.symbol}
                        </span>
                        <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          {item.name}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        ${item.amount.toLocaleString()}
                      </div>
                      <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {item.value.toFixed(1)}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Performance Metrics */}
      {metrics && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className={`transition-colors duration-200 ${
            isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200 shadow-sm'
          }`}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    Best Performer
                  </p>
                  <p className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {metrics.bestPerformer?.symbol || 'N/A'}
                  </p>
                  <p className="text-sm text-green-600">
                    +{metrics.bestPerformer?.return.toFixed(2) || 0}%
                  </p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className={`transition-colors duration-200 ${
            isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200 shadow-sm'
          }`}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    Worst Performer
                  </p>
                  <p className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {metrics.worstPerformer?.symbol || 'N/A'}
                  </p>
                  <p className="text-sm text-red-600">
                    {metrics.worstPerformer?.return.toFixed(2) || 0}%
                  </p>
                </div>
                <TrendingDown className="w-8 h-8 text-red-600" />
              </div>
            </CardContent>
          </Card>

          <Card className={`transition-colors duration-200 ${
            isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200 shadow-sm'
          }`}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    Portfolio Volatility
                  </p>
                  <p className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {metrics.volatility.toFixed(2)}%
                  </p>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Risk measure
                  </p>
                </div>
                <BarChart3 className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Last Updated */}
      {overview?.lastUpdated && (
        <div className="text-center">
          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Last updated: {new Date(overview.lastUpdated).toLocaleString()}
          </p>
        </div>
      )}
    </div>
  )
}