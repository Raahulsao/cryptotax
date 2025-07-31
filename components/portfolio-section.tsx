"use client"

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useOverview } from '@/hooks/use-overview'
import { LoadingSpinner } from '@/components/loading-spinner'
import { 
  TrendingUp, 
  TrendingDown, 
  RefreshCw, 
  Download,
  AlertCircle,
  Upload,
  BarChart3
} from 'lucide-react'
import { useTheme } from 'next-themes'
import { ResponsiveContainer, PieChart, Cell, Tooltip, Pie } from 'recharts'

export function PortfolioSection() {
  const { theme } = useTheme()
  const isDarkMode = theme === 'dark'
  const {
    overview,
    loading,
    error,
    fetchOverview,
    clearError
  } = useOverview()

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" text="Loading portfolio..." />
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

  if (!overview || overview.portfolio.holdingsCount === 0) {
    return (
      <Card className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <CardContent className="p-12 text-center">
          <Upload className={`w-16 h-16 mx-auto mb-4 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
          <h3 className={`text-xl font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            No Portfolio Data
          </h3>
          <p className={`text-sm mb-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Upload your transaction files to see your portfolio details and analytics.
          </p>
          <Button onClick={() => window.location.hash = '#upload'}>
            Upload Transactions
          </Button>
        </CardContent>
      </Card>
    )
  }

  const COLORS = ['#F7931A', '#627EEA', '#0033AD', '#9945FF', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444']

  // Prepare allocation data for charts
  const allocationData = overview.insights.assetDistribution.map((asset, index) => ({
    ...asset,
    color: COLORS[index % COLORS.length]
  }))

  // Calculate portfolio metrics
  const totalValue = overview.portfolio.totalValue
  const totalInvested = overview.portfolio.totalInvested
  const totalGains = overview.portfolio.totalGains
  const gainPercentage = overview.portfolio.gainPercentage

  // Find best and worst performers
  const holdings = overview.portfolio.holdings
  const bestPerformer = holdings.reduce((best, holding) => {
    const holdingReturn = ((holding.currentValue - holding.costBasis) / holding.costBasis) * 100
    const bestReturn = best ? ((best.currentValue - best.costBasis) / best.costBasis) * 100 : -Infinity
    return holdingReturn > bestReturn ? holding : best
  }, null)

  const worstPerformer = holdings.reduce((worst, holding) => {
    const holdingReturn = ((holding.currentValue - holding.costBasis) / holding.costBasis) * 100
    const worstReturn = worst ? ((worst.currentValue - worst.costBasis) / worst.costBasis) * 100 : Infinity
    return holdingReturn < worstReturn ? holding : worst
  }, null)

  return (
    <div className="space-y-6">
      {/* Portfolio Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Portfolio Allocation Chart */}
        <Card className={`lg:col-span-2 transition-colors duration-200 ${
          isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200 shadow-sm'
        }`}>
          <CardHeader>
            <CardTitle className={isDarkMode ? 'text-white' : 'text-gray-900'}>
              Portfolio Allocation
            </CardTitle>
          </CardHeader>
          <CardContent>
            {allocationData.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Pie Chart */}
                <div className="relative">
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={allocationData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={100}
                        innerRadius={60}
                        fill="#8884d8"
                        dataKey="value"
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
                                <p className="font-semibold text-lg">{data.symbol}</p>
                                <p className="text-sm">
                                  <span className="text-gray-300">Value:</span> ${data.value.toLocaleString()}
                                </p>
                                <p className="text-sm">
                                  <span className="text-gray-300">Allocation:</span> {data.percentage.toFixed(1)}%
                                </p>
                                <p className="text-sm">
                                  <span className="text-gray-300">Amount:</span> {data.amount.toLocaleString()}
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
                      <div className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        ${totalValue >= 1000 
                          ? `${(totalValue / 1000).toFixed(1)}K`
                          : totalValue.toFixed(0)
                        }
                      </div>
                      <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} font-medium`}>
                        Total Value
                      </div>
                    </div>
                  </div>
                </div>

                {/* Asset List */}
                <div className="space-y-3">
                  <h4 className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Holdings Breakdown
                  </h4>
                  {allocationData.map((asset, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div 
                          className="w-4 h-4 rounded-full" 
                          style={{ backgroundColor: asset.color }} 
                        />
                        <div>
                          <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            {asset.symbol}
                          </span>
                          <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            {asset.amount.toLocaleString()} tokens
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                          ${asset.value.toLocaleString()}
                        </div>
                        <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          {asset.percentage.toFixed(1)}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="h-[300px] flex items-center justify-center">
                <div className="text-center">
                  <BarChart3 className={`h-12 w-12 mx-auto mb-4 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    No allocation data available
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Portfolio Stats */}
        <Card className={`transition-colors duration-200 ${
          isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200 shadow-sm'
        }`}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className={isDarkMode ? 'text-white' : 'text-gray-900'}>
                Portfolio Stats
              </CardTitle>
              <Button variant="outline" size="sm" onClick={fetchOverview}>
                <RefreshCw className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Total Value
                </div>
                <div className="text-2xl font-bold text-blue-600">
                  ${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
              </div>
              
              <div>
                <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Total Invested
                </div>
                <div className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  ${totalInvested.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
              </div>

              <div>
                <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Total Gains/Losses
                </div>
                <div className={`text-lg font-semibold ${totalGains >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {totalGains >= 0 ? '+' : ''}${totalGains.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} 
                  ({gainPercentage >= 0 ? '+' : ''}{gainPercentage.toFixed(2)}%)
                </div>
              </div>

              {bestPerformer && (
                <div>
                  <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Best Performer
                  </div>
                  <div className="text-green-600 font-medium">
                    {bestPerformer.symbol} +{(((bestPerformer.currentValue - bestPerformer.costBasis) / bestPerformer.costBasis) * 100).toFixed(1)}%
                  </div>
                </div>
              )}

              {worstPerformer && (
                <div>
                  <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Worst Performer
                  </div>
                  <div className="text-red-600 font-medium">
                    {worstPerformer.symbol} {(((worstPerformer.currentValue - worstPerformer.costBasis) / worstPerformer.costBasis) * 100).toFixed(1)}%
                  </div>
                </div>
              )}

              <div>
                <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Holdings Count
                </div>
                <div className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {overview.portfolio.holdingsCount} assets
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Holdings Table */}
      <Card className={`transition-colors duration-200 ${
        isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200 shadow-sm'
      }`}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className={isDarkMode ? 'text-white' : 'text-gray-900'}>
              Holdings Details
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button variant="outline" size="sm" onClick={fetchOverview}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {holdings.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>Asset</TableHead>
                  <TableHead className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>Holdings</TableHead>
                  <TableHead className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>Current Price</TableHead>
                  <TableHead className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>Current Value</TableHead>
                  <TableHead className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>Cost Basis</TableHead>
                  <TableHead className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>Unrealized P&L</TableHead>
                  <TableHead className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>Allocation</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {holdings.map((holding, index) => {
                  const unrealizedGain = holding.currentValue - holding.costBasis
                  const unrealizedGainPercent = holding.costBasis > 0 ? (unrealizedGain / holding.costBasis) * 100 : 0
                  const allocation = totalValue > 0 ? (holding.currentValue / totalValue) * 100 : 0
                  const currentPrice = holding.amount > 0 ? holding.currentValue / holding.amount : 0
                  
                  return (
                    <TableRow key={holding.symbol}>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <div
                            className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold"
                            style={{ backgroundColor: COLORS[index % COLORS.length] }}
                          >
                            {holding.symbol.charAt(0)}
                          </div>
                          <div>
                            <div className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                              {holding.symbol}
                            </div>
                            <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                              {holding.name || holding.symbol}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                        {holding.amount.toLocaleString(undefined, { maximumFractionDigits: 6 })}
                      </TableCell>
                      <TableCell className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                        ${currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 })}
                      </TableCell>
                      <TableCell className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                        ${holding.currentValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </TableCell>
                      <TableCell className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                        ${holding.costBasis.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </TableCell>
                      <TableCell>
                        <div className={unrealizedGain >= 0 ? 'text-green-600' : 'text-red-600'}>
                          <div className="font-medium">
                            {unrealizedGain >= 0 ? '+' : ''}${unrealizedGain.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </div>
                          <div className="text-sm">
                            ({unrealizedGainPercent >= 0 ? '+' : ''}{unrealizedGainPercent.toFixed(2)}%)
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                        {allocation.toFixed(1)}%
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8">
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                No holdings data available
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Last Updated */}
      {overview.lastUpdated && (
        <div className="text-center">
          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Last updated: {new Date(overview.lastUpdated).toLocaleString()}
          </p>
        </div>
      )}
    </div>
  )
}