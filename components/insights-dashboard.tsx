"use client"

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useOverview } from '@/hooks/use-overview'
import { LoadingSpinner } from '@/components/loading-spinner'
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Activity,
  Target,
  AlertCircle,
  BarChart3
} from 'lucide-react'
import { useTheme } from 'next-themes'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts'

export function InsightsDashboard() {
  const { theme } = useTheme()
  const isDarkMode = theme === 'dark'
  const {
    overview,
    loading,
    error
  } = useOverview()

  // Generate comprehensive insights based on real data - MUST be before conditional returns
  const insights = React.useMemo(() => {
    if (!overview) return []
    
    const taxInsights = [
      {
        title: "Tax Liability Status",
        description: overview.tax.estimatedLiability > 0 
          ? `You have an estimated tax liability of $${overview.tax.estimatedLiability.toFixed(2)} from realized gains`
          : "No current tax liability - all gains are unrealized",
        priority: overview.tax.estimatedLiability > 1000 ? "High" : overview.tax.estimatedLiability > 0 ? "Medium" : "Low",
        savings: overview.tax.estimatedLiability,
        type: "tax",
        actionable: overview.tax.estimatedLiability > 0
      },
      {
        title: "Unrealized Gains Analysis",
        description: `You have $${overview.portfolio.unrealizedGains.toFixed(2)} in unrealized gains. Consider tax-loss harvesting opportunities.`,
        priority: overview.portfolio.unrealizedGains > 5000 ? "Medium" : "Low",
        savings: overview.portfolio.unrealizedGains * 0.15, // Potential tax if realized
        type: "gains",
        actionable: overview.portfolio.unrealizedGains > 1000
      },
      {
        title: "Portfolio Performance",
        description: `Your portfolio has ${overview.portfolio.gainPercentage >= 0 ? 'gained' : 'lost'} ${Math.abs(overview.portfolio.gainPercentage).toFixed(2)}% since inception`,
        priority: Math.abs(overview.portfolio.gainPercentage) > 20 ? "High" : "Medium",
        savings: Math.abs(overview.portfolio.totalGains),
        type: "performance",
        actionable: overview.portfolio.gainPercentage < -10
      }
    ]

    // Add transaction-based insights
    if (overview.transactions.total > 0) {
      taxInsights.push({
        title: "Transaction Activity",
        description: `You've made ${overview.transactions.total} transactions this year. ${overview.transactions.taxableEvents} are taxable events.`,
        priority: overview.transactions.taxableEvents > 10 ? "Medium" : "Low",
        savings: 0,
        type: "activity",
        actionable: overview.transactions.taxableEvents > 0
      })
    }

    // Add holding period insights
    if (overview.portfolio.realizedGains > 0) {
      taxInsights.push({
        title: "Long-term vs Short-term Gains",
        description: `You have $${overview.portfolio.realizedGains.toFixed(2)} in realized gains. Optimize holding periods for better tax treatment.`,
        priority: overview.portfolio.realizedGains > 2000 ? "High" : "Medium",
        savings: overview.portfolio.realizedGains * 0.05, // Potential savings from long-term treatment
        type: "holding_period",
        actionable: true
      })
    }

    return taxInsights
  }, [overview])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" text="Loading insights..." />
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
              <p className="font-medium text-red-800 dark:text-red-200">Error loading insights</p>
              <p className="text-sm text-red-600 dark:text-red-300">{error}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!overview) {
    return (
      <Card className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
        <CardContent className="p-6">
          <div className="text-center">
            <BarChart3 className={`h-12 w-12 mx-auto mb-4 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
            <p className={`text-lg font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              No data available
            </p>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Upload some transactions to see insights
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className={`transition-colors duration-200 ${
          isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200 shadow-sm'
        }`}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Total Transactions
            </CardTitle>
            <Activity className={`h-4 w-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {overview.transactions.total}
            </div>
            <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {overview.transactions.thisYear} this year
            </p>
          </CardContent>
        </Card>

        <Card className={`transition-colors duration-200 ${
          isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200 shadow-sm'
        }`}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Average Transaction
            </CardTitle>
            <DollarSign className={`h-4 w-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              ${overview.insights.performance.avgTransactionValue.toFixed(2)}
            </div>
            <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Per transaction
            </p>
          </CardContent>
        </Card>

        <Card className={`transition-colors duration-200 ${
          isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200 shadow-sm'
        }`}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Portfolio Performance
            </CardTitle>
            {overview.portfolio.gainPercentage >= 0 ? (
              <TrendingUp className="h-4 w-4 text-green-500" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-500" />
            )}
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${
              overview.portfolio.gainPercentage >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {overview.portfolio.gainPercentage >= 0 ? '+' : ''}
              {overview.portfolio.gainPercentage.toFixed(2)}%
            </div>
            <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              ${overview.portfolio.totalGains.toFixed(2)} total
            </p>
          </CardContent>
        </Card>

        <Card className={`transition-colors duration-200 ${
          isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200 shadow-sm'
        }`}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Tax Status
            </CardTitle>
            <Target className={`h-4 w-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${
              overview.tax.estimatedLiability > 0 ? 'text-orange-600' : 'text-green-600'
            }`}>
              ${overview.tax.estimatedLiability.toFixed(2)}
            </div>
            <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {overview.tax.status}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Insights and Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tax Optimization */}
        <Card className={`transition-colors duration-200 ${
          isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200 shadow-sm'
        }`}>
          <CardHeader>
            <CardTitle className={isDarkMode ? 'text-white' : 'text-gray-900'}>
              Tax & Performance Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {insights.map((insight, index) => (
                <div
                  key={index}
                  className={`p-4 border rounded-lg ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {insight.title}
                      </div>
                      <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mt-1`}>
                        {insight.description}
                      </div>
                    </div>
                    <Badge
                      variant={
                        insight.priority === "High"
                          ? "destructive"
                          : insight.priority === "Medium"
                            ? "default"
                            : "secondary"
                      }
                    >
                      {insight.priority}
                    </Badge>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    {insight.savings > 0 && (
                      <div className={`text-sm font-medium ${
                        insight.type === 'tax' ? 'text-orange-600' : 
                        insight.type === 'gains' ? 'text-blue-600' : 
                        insight.type === 'performance' ? 'text-green-600' :
                        insight.type === 'holding_period' ? 'text-purple-600' : 'text-gray-600'
                      }`}>
                        {insight.type === 'tax' ? 'Tax liability: ' : 
                         insight.type === 'gains' ? 'Potential tax: ' : 
                         insight.type === 'performance' ? 'Value: ' :
                         insight.type === 'holding_period' ? 'Potential savings: ' : 'Amount: '}
                        ${insight.savings.toFixed(2)}
                      </div>
                    )}
                    {insight.actionable && (
                      <Button variant="outline" size="sm">
                        Take Action
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Asset Distribution */}
        <Card className={`transition-colors duration-200 ${
          isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200 shadow-sm'
        }`}>
          <CardHeader>
            <CardTitle className={isDarkMode ? 'text-white' : 'text-gray-900'}>
              Asset Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            {overview.insights.assetDistribution.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={overview.insights.assetDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ symbol, percentage }) => `${symbol} ${percentage.toFixed(1)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {overview.insights.assetDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
                      border: `1px solid ${isDarkMode ? '#374151' : '#e5e7eb'}`,
                      borderRadius: '6px',
                      color: isDarkMode ? '#ffffff' : '#000000'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center">
                <div className="text-center">
                  <PieChart className={`h-12 w-12 mx-auto mb-4 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    No asset data available
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Monthly Activity Chart */}
      {overview.insights.monthlyActivity.length > 0 && (
        <Card className={`transition-colors duration-200 ${
          isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200 shadow-sm'
        }`}>
          <CardHeader>
            <CardTitle className={isDarkMode ? 'text-white' : 'text-gray-900'}>
              Monthly Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={overview.insights.monthlyActivity}>
                <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#374151' : '#e5e7eb'} />
                <XAxis 
                  dataKey="month" 
                  stroke={isDarkMode ? '#9ca3af' : '#6b7280'}
                  fontSize={12}
                />
                <YAxis 
                  stroke={isDarkMode ? '#9ca3af' : '#6b7280'}
                  fontSize={12}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
                    border: `1px solid ${isDarkMode ? '#374151' : '#e5e7eb'}`,
                    borderRadius: '6px',
                    color: isDarkMode ? '#ffffff' : '#000000'
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#0088FE"
                  fill="#0088FE"
                  fillOpacity={0.3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Summary Stats */}
      <Card className={`transition-colors duration-200 ${
        isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200 shadow-sm'
      }`}>
        <CardHeader>
          <CardTitle className={isDarkMode ? 'text-white' : 'text-gray-900'}>
            Portfolio Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                ${overview.portfolio.totalInvested.toFixed(2)}
              </div>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Total Invested
              </p>
            </div>
            <div className="text-center">
              <div className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                ${overview.portfolio.totalValue.toFixed(2)}
              </div>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Current Value
              </p>
            </div>
            <div className="text-center">
              <div className={`text-3xl font-bold ${
                overview.portfolio.totalGains >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {overview.portfolio.totalGains >= 0 ? '+' : ''}
                ${overview.portfolio.totalGains.toFixed(2)}
              </div>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Total Gains/Losses
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}