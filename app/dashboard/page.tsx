"use client"

import { useState } from "react"
import { ProtectedRoute } from "@/components/protected-route"
import { useAuth } from "@/hooks/use-firebase-auth"
import { PortfolioOverview } from "@/components/portfolio-overview"
import { FileUploadComponent } from "@/components/file-upload"
import { TransactionsTable } from "@/components/transactions-table"
import { InsightsDashboard } from "../../components/insights-dashboard"
import { PortfolioSection } from "@/components/portfolio-section"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import { Checkbox } from "@/components/ui/checkbox"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Bell,
  User,
  Moon,
  Sun,
  Home,
  PieChart,
  ArrowRightLeft,
  FileText,
  Upload,
  TrendingUp,
  Settings,
  Cog,
  Search,
  Filter,
  Download,
  Plus,
  Edit,
  Trash2,
  Eye,
  TrendingDown,
  CheckCircle,
  Bitcoin,
  Target,
  BarChart3,
  RefreshCw,
  Clock,
  Archive,
  LogOut,
  Menu,
  Building,
} from "lucide-react"
import { ResponsiveContainer, PieChart as RechartsPieChart, Cell, Tooltip, Pie } from "recharts"

// Mock data for charts
const portfolioAllocationData = [
  { name: "Bitcoin", value: 45.2, color: "#F7931A", amount: 902580 },
  { name: "Ethereum", value: 28.5, color: "#627EEA", amount: 569370 },
  { name: "Cardano", value: 12.3, color: "#0033AD", amount: 245814 },
  { name: "Solana", value: 8.7, color: "#9945FF", amount: 173853 },
  { name: "Others", value: 5.3, color: "#8B5CF6", amount: 105883 },
]

const holdingsDistributionData = [
  { name: "BTC", value: 40, color: "#F7931A", amount: 655320 },
  { name: "ETH", value: 25, color: "#627EEA", amount: 410825 },
  { name: "SHIB", value: 20, color: "#FFA726", amount: 328660 },
  { name: "ADA", value: 10, color: "#0033AD", amount: 164330 },
  { name: "Others", value: 5, color: "#8B5CF6", amount: 82165 },
]

const holdingsData = [
  {
    coin: "Bitcoin",
    symbol: "BTC",
    currentValue: 655320.15,
    amountInvested: 534497.97,
    currentReturns: 120187.82,
    marketPrice: 98976.81,
    color: "#F7931A",
    change: 22.5,
  },
  {
    coin: "Ethereum",
    symbol: "ETH",
    currentValue: 247601.32,
    amountInvested: 234497.97,
    currentReturns: 13103.35,
    marketPrice: 2456.32,
    color: "#627EEA",
    change: 5.6,
  },
]

const topGainersData = [
  { name: "Ethereum", symbol: "ETH", change: 8.21, color: "#627EEA" },
  { name: "Bitcoin", symbol: "BTC", change: 5.26, color: "#F7931A" },
  { name: "Cardano", symbol: "ADA", change: 12.45, color: "#0033AD" },
]

const projectionsData = [
  { name: "BTC", trend: "up", change: 44.32, description: "There has been a sharpe increase" },
  { name: "ETH", trend: "down", change: -13.28, description: "There has been a sharpe decrease" },
]

// Mock data for reports (keeping only what's needed for reports section)
const mockReports = [
  { id: 1, name: "Tax Year 2023 - Complete", type: "Form 8949", date: "2024-01-10", status: "Ready" },
  { id: 2, name: "Q4 2023 Summary", type: "Summary", date: "2024-01-05", status: "Generated" },
  { id: 3, name: "Trading Report - Dec 2023", type: "Trading", date: "2024-01-01", status: "Processing" },
]

// Custom Doughnut Chart Component with Enhanced Tooltips
const DoughnutChart = ({ data, title }: { data: any[]; title: string }) => {
  const RADIAN = Math.PI / 180
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5
    const x = cx + radius * Math.cos(-midAngle * RADIAN)
    const y = cy + radius * Math.sin(-midAngle * RADIAN)

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        fontSize="14"
        fontWeight="bold"
        style={{ textShadow: "1px 1px 2px rgba(0,0,0,0.8)" }}
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    )
  }

  const totalValue = data.reduce((sum, entry) => sum + entry.amount, 0)

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-gray-900 text-white p-4 rounded-lg shadow-xl border border-gray-700">
          <p className="font-semibold text-lg">{data.name}</p>
          <p className="text-sm">
            <span className="text-gray-300">Value:</span> ₹{data.amount.toLocaleString()}
          </p>
          <p className="text-sm">
            <span className="text-gray-300">Allocation:</span> {data.value}%
          </p>
          <div className="w-4 h-4 rounded-full mt-2" style={{ backgroundColor: data.color }} />
        </div>
      )
    }
    return null
  }

  return (
    <div className="relative">
      <ResponsiveContainer width="100%" height={320}>
        <RechartsPieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomizedLabel}
            outerRadius={130}
            innerRadius={70}
            fill="#8884d8"
            dataKey="amount"
            stroke="none"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </RechartsPieChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <div className="text-3xl font-bold text-gray-900 dark:text-white">₹{(totalValue / 100000).toFixed(1)}L</div>
          <div className="text-sm text-gray-500 dark:text-gray-400 font-medium">{title}</div>
        </div>
      </div>
    </div>
  )
}

function DashboardContent() {
  const { logout } = useAuth()
  const [currentSection, setCurrentSection] = useState("overview")
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTransaction, setSelectedTransaction] = useState(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  // We'll handle auth checking in a separate component

  // Theme toggle
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode)
    if (typeof window !== "undefined") {
      document.documentElement.classList.toggle("dark")
    }
  }

  // Logout function will be handled by the auth hook

  // Mock file upload
  const handleFileUpload = (file: File) => {
    setIsUploading(true)
    setUploadProgress(0)

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsUploading(false)
          return 100
        }
        return prev + 10
      })
    }, 200)
  }

  // Sidebar navigation items
  const navigationItems = [
    { id: "overview", label: "Overview", icon: Home },
    { id: "portfolio", label: "Portfolio", icon: PieChart },
    { id: "transactions", label: "Transactions", icon: ArrowRightLeft },
    { id: "reports", label: "Tax Reports", icon: FileText },
    { id: "upload", label: "Upload", icon: Upload },
    { id: "insights", label: "Insights", icon: TrendingUp },
    { id: "tax-settings", label: "Tax Settings", icon: Cog },
    { id: "settings", label: "Settings", icon: Settings },
  ]

  // Portfolio metrics - removed mock data calculations

  return (
    <div className={`min-h-screen transition-colors duration-200 ${isDarkMode ? "dark bg-gray-900" : "bg-gray-50"}`}>
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={() => setIsSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 h-full w-64 transition-all duration-300 z-50 transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          } lg:translate-x-0 ${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"} border-r`}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-2">
              <div
                className={`w-8 h-8 rounded-lg ${isDarkMode ? "bg-blue-600" : "bg-blue-500"} flex items-center justify-center`}
              >
                <Bitcoin className="w-5 h-5 text-white" />
              </div>
              <h1 className={`text-xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>KoinFile</h1>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setIsSidebarOpen(false)} className="lg:hidden">
              ✕
            </Button>
          </div>

          <nav className="space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setCurrentSection(item.id)
                    setIsSidebarOpen(false)
                  }}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${currentSection === item.id
                    ? isDarkMode
                      ? "bg-blue-600 text-white"
                      : "bg-blue-50 text-blue-600 border border-blue-200"
                    : isDarkMode
                      ? "text-gray-300 hover:bg-gray-700 hover:text-white"
                      : "text-gray-600 hover:bg-gray-100"
                    }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              )
            })}
          </nav>

          {/* Logout Button */}
          <div className="absolute bottom-6 left-6 right-6">
            <Button
              onClick={logout}
              variant="outline"
              className="w-full flex items-center space-x-2 bg-transparent"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:ml-64 transition-all duration-300">
        {/* Header */}
        <header
          className={`${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
            } border-b px-6 py-4 transition-colors duration-200`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" onClick={() => setIsSidebarOpen(true)} className="lg:hidden">
                <Menu className="w-5 h-5" />
              </Button>
              <h2 className={`text-2xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                {navigationItems.find((item) => item.id === currentSection)?.label || "Dashboard"}
              </h2>
              <Badge variant="outline" className="text-sm">
                Tax Year 2024
              </Badge>
            </div>

            <div className="flex items-center space-x-4">
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search transactions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>

              <Button variant="ghost" size="icon" onClick={toggleTheme}>
                {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </Button>

              <Button variant="ghost" size="icon">
                <Bell className="w-5 h-5" />
              </Button>

              <Button variant="ghost" size="icon">
                <User className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          {/* Overview Section */}
          {currentSection === "overview" && (
            <PortfolioOverview />
          )}

          {/* Upload Section */}
          {currentSection === "upload" && (
            <div className="space-y-6">
              <Card
                className={`transition-colors duration-200 ${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200 shadow-sm"
                  }`}
              >
                <CardHeader>
                  <CardTitle className={isDarkMode ? "text-white" : "text-gray-900"}>Import Transactions</CardTitle>
                  <CardDescription className={isDarkMode ? "text-gray-400" : "text-gray-600"}>
                    Upload CSV files, connect exchanges, or add transactions manually
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <FileUploadComponent />
                </CardContent>
              </Card>
            </div>
          )}

          {/* Legacy Overview Section - Keep for reference */}
          {currentSection === "legacy-overview" && (
            <div className="space-y-6">
              {/* Key Metrics Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card
                  className={`transition-colors duration-200 ${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200 shadow-sm"
                    }`}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                        <TrendingUp className="w-4 h-4 text-white" />
                      </div>
                      <CardTitle className={`text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                        Total Worth
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">₹15,95,800</div>
                    <div className="text-sm text-green-600">+10.86%</div>
                  </CardContent>
                </Card>

                <Card
                  className={`transition-colors duration-200 ${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200 shadow-sm"
                    }`}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                        <Target className="w-4 h-4 text-white" />
                      </div>
                      <CardTitle className={`text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                        Cost Basis
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-orange-600">₹13,84,600</div>
                    <div className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>Total invested</div>
                  </CardContent>
                </Card>

                <Card
                  className={`transition-colors duration-200 ${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200 shadow-sm"
                    }`}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                        <BarChart3 className="w-4 h-4 text-white" />
                      </div>
                      <CardTitle className={`text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                        Total Gains
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-blue-600">₹2,05,800</div>
                    <div className="text-sm text-blue-600">+14.87%</div>
                  </CardContent>
                </Card>

                <Card
                  className={`transition-colors duration-200 ${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200 shadow-sm"
                    }`}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
                        <FileText className="w-4 h-4 text-white" />
                      </div>
                      <CardTitle className={`text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                        Taxable Gains
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-red-600">₹1,25,800</div>
                    <div className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>Subject to tax</div>
                  </CardContent>
                </Card>
              </div>

              {/* Charts Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Portfolio Allocation Doughnut Chart */}
                <Card
                  className={`transition-colors duration-200 ${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200 shadow-sm"
                    }`}
                >
                  <CardHeader>
                    <CardTitle className={isDarkMode ? "text-white" : "text-gray-900"}>Portfolio Allocation</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <DoughnutChart data={portfolioAllocationData} title="Total Value" />
                    <div className="grid grid-cols-2 gap-3 mt-6">
                      {portfolioAllocationData.map((item) => (
                        <div key={item.name} className="flex items-center space-x-3">
                          <div className="w-4 h-4 rounded-full" style={{ backgroundColor: item.color }} />
                          <span className={`text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                            {item.name} ({item.value}%)
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Holdings Distribution Doughnut Chart */}
                <Card
                  className={`transition-colors duration-200 ${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200 shadow-sm"
                    }`}
                >
                  <CardHeader>
                    <CardTitle className={isDarkMode ? "text-white" : "text-gray-900"}>Holdings Distribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <DoughnutChart data={holdingsDistributionData} title="Net Value" />
                    <div className="grid grid-cols-2 gap-3 mt-6">
                      {holdingsDistributionData.map((item) => (
                        <div key={item.name} className="flex items-center space-x-3">
                          <div className="w-4 h-4 rounded-full" style={{ backgroundColor: item.color }} />
                          <span className={`text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                            {item.name} ({item.value}%)
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Holdings and Top Gainers */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Holdings Table */}
                <Card
                  className={`transition-colors duration-200 ${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200 shadow-sm"
                    }`}
                >
                  <CardHeader>
                    <CardTitle className={isDarkMode ? "text-white" : "text-gray-900"}>Holdings</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div
                        className={`grid grid-cols-4 gap-4 text-xs font-medium uppercase tracking-wide ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                      >
                        <div>Coin</div>
                        <div>Current Value ₹</div>
                        <div>Amount Invested ₹</div>
                        <div>Current Returns ₹</div>
                      </div>
                      {holdingsData.map((holding) => (
                        <div
                          key={holding.symbol}
                          className={`grid grid-cols-4 gap-4 items-center py-3 border-b ${isDarkMode ? "border-gray-700" : "border-gray-200"}`}
                        >
                          <div className="flex items-center space-x-2">
                            <div
                              className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold"
                              style={{ backgroundColor: holding.color }}
                            >
                              {holding.symbol.charAt(0)}
                            </div>
                            <div>
                              <div className={`font-medium ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                                {holding.coin}
                              </div>
                              <div className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                                {holding.symbol}
                              </div>
                            </div>
                          </div>
                          <div className={`font-medium ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                            ₹{holding.currentValue.toLocaleString()}
                          </div>
                          <div className={`${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                            ₹{holding.amountInvested.toLocaleString()}
                          </div>
                          <div
                            className={`font-medium ${holding.currentReturns >= 0 ? "text-green-500" : "text-red-500"}`}
                          >
                            ₹{holding.currentReturns.toLocaleString()}
                            <div className="text-xs">
                              {holding.change >= 0 ? "+" : ""}
                              {holding.change}%
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Top Gainers and Projections */}
                <div className="space-y-6">
                  <Card
                    className={`transition-colors duration-200 ${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200 shadow-sm"
                      }`}
                  >
                    <CardHeader>
                      <CardTitle className={isDarkMode ? "text-white" : "text-gray-900"}>Top Gainers (24h)</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {topGainersData.map((gainer) => (
                          <div key={gainer.symbol} className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div
                                className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold"
                                style={{ backgroundColor: gainer.color }}
                              >
                                {gainer.symbol.charAt(0)}
                              </div>
                              <div>
                                <div className={`font-medium ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                                  {gainer.name}
                                </div>
                                <div className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                                  ({gainer.symbol})
                                </div>
                              </div>
                            </div>
                            <div className="text-green-500 font-medium">↗ {gainer.change}%</div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card
                    className={`transition-colors duration-200 ${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200 shadow-sm"
                      }`}
                  >
                    <CardHeader>
                      <CardTitle className={isDarkMode ? "text-white" : "text-gray-900"}>Projections</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {projectionsData.map((projection) => (
                          <div key={projection.name} className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                              {projection.name.charAt(0)}
                            </div>
                            <div className="flex-1">
                              <div
                                className={`font-medium ${projection.change >= 0 ? "text-green-500" : "text-red-500"}`}
                              >
                                {projection.change >= 0 ? "+" : ""}
                                {projection.change}%
                              </div>
                              <div className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                                {projection.description}
                              </div>
                            </div>
                            <div
                              className={`w-12 h-8 flex items-center justify-center ${projection.trend === "up" ? "text-green-500" : "text-red-500"
                                }`}
                            >
                              {projection.trend === "up" ? "📈" : "📉"}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Action Items */}
              <Card
                className={`transition-colors duration-200 ${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200 shadow-sm"
                  }`}
              >
                <CardHeader>
                  <CardTitle className={isDarkMode ? "text-white" : "text-gray-900"}>Action Items</CardTitle>
                  <CardDescription className={isDarkMode ? "text-gray-400" : "text-gray-600"}>
                    Important tasks to complete for accurate tax reporting
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Checkbox />
                      <span className={isDarkMode ? "text-white" : "text-gray-900"}>
                        Review and categorize 12 unassigned transactions
                      </span>
                      <Badge variant="destructive">High Priority</Badge>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Checkbox />
                      <span className={isDarkMode ? "text-white" : "text-gray-900"}>
                        Connect Binance account for complete transaction history
                      </span>
                      <Badge variant="secondary">Medium Priority</Badge>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Checkbox checked />
                      <span className={`line-through ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                        Upload DeFi transaction records from Uniswap
                      </span>
                      <Badge variant="outline">Completed</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Portfolio Section */}
          {currentSection === "portfolio" && (
            <PortfolioSection />
          )}

          {/* Transactions Section */}
          {currentSection === "transactions" && (
            <TransactionsTable />
          )}

          {/* Tax Reports Section */}
          {currentSection === "reports" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card
                  className={`transition-colors duration-200 ${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200 shadow-sm"
                    }`}
                >
                  <CardHeader>
                    <CardTitle className={isDarkMode ? "text-white" : "text-gray-900"}>Generate New Report</CardTitle>
                    <CardDescription className={isDarkMode ? "text-gray-400" : "text-gray-600"}>
                      Create tax-compliant reports for your crypto activities
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="report-type">Report Type</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select report type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="form-8949">Form 8949</SelectItem>
                            <SelectItem value="schedule-d">Schedule D</SelectItem>
                            <SelectItem value="complete-tax">Complete Tax Report</SelectItem>
                            <SelectItem value="summary">Summary Report</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="tax-year">Tax Year</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select tax year" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="2024">2024</SelectItem>
                            <SelectItem value="2023">2023</SelectItem>
                            <SelectItem value="2022">2022</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="format">Export Format</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select format" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pdf">PDF</SelectItem>
                            <SelectItem value="csv">CSV</SelectItem>
                            <SelectItem value="excel">Excel</SelectItem>
                            <SelectItem value="turbotax">TurboTax</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Button className="w-full">
                        <FileText className="w-4 h-4 mr-2" />
                        Generate Report
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card
                  className={`transition-colors duration-200 ${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200 shadow-sm"
                    }`}
                >
                  <CardHeader>
                    <CardTitle className={isDarkMode ? "text-white" : "text-gray-900"}>Report Preview</CardTitle>
                    <CardDescription className={isDarkMode ? "text-gray-400" : "text-gray-600"}>
                      Preview your tax report before downloading
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className={`${isDarkMode ? "bg-gray-900" : "bg-gray-50"} p-4 rounded-lg`}>
                      <div className="text-center space-y-2">
                        <FileText className={`w-16 h-16 mx-auto ${isDarkMode ? "text-gray-500" : "text-gray-400"}`} />
                        <div className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                          Select report parameters to generate preview
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Reports */}
              <Card
                className={`transition-colors duration-200 ${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200 shadow-sm"
                  }`}
              >
                <CardHeader>
                  <CardTitle className={isDarkMode ? "text-white" : "text-gray-900"}>Recent Reports</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockReports.map((report) => (
                      <div
                        key={report.id}
                        className={`flex items-center justify-between p-4 border rounded-lg ${isDarkMode ? "border-gray-700" : "border-gray-200"}`}
                      >
                        <div className="flex items-center space-x-4">
                          <div
                            className={`w-12 h-12 ${isDarkMode ? "bg-blue-900" : "bg-blue-100"
                              } rounded-lg flex items-center justify-center`}
                          >
                            <FileText className="w-6 h-6 text-blue-600" />
                          </div>
                          <div>
                            <div className={`font-medium ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                              {report.name}
                            </div>
                            <div className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                              {report.type} • Generated on {report.date}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant={report.status === "Ready" ? "default" : "secondary"}>{report.status}</Badge>
                          <Button variant="outline" size="sm">
                            <Download className="w-4 h-4 mr-2" />
                            Download
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}



          {/* Insights Section */}
          {currentSection === "insights" && (
            <InsightsDashboard />
          )}

          {/* Tax Settings Section */}
          {currentSection === "tax-settings" && (
            <div className="space-y-6">
              <Card
                className={`transition-colors duration-200 ${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200 shadow-sm"
                  }`}
              >
                <CardHeader>
                  <CardTitle className={isDarkMode ? "text-white" : "text-gray-900"}>Tax Configuration</CardTitle>
                  <CardDescription className={isDarkMode ? "text-gray-400" : "text-gray-600"}>
                    Configure your tax calculation preferences and jurisdictions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="jurisdiction">Tax Jurisdiction</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select jurisdiction" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="us">United States</SelectItem>
                            <SelectItem value="ca">Canada</SelectItem>
                            <SelectItem value="uk">United Kingdom</SelectItem>
                            <SelectItem value="au">Australia</SelectItem>
                            <SelectItem value="de">Germany</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="tax-year">Tax Year</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select tax year" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="2024">2024</SelectItem>
                            <SelectItem value="2023">2023</SelectItem>
                            <SelectItem value="2022">2022</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="accounting-method">Accounting Method</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select accounting method" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="fifo">FIFO (First In, First Out)</SelectItem>
                          <SelectItem value="lifo">LIFO (Last In, First Out)</SelectItem>
                          <SelectItem value="hifo">HIFO (Highest In, First Out)</SelectItem>
                          <SelectItem value="specific">Specific Identification</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="min-threshold">Minimum Transaction Threshold</Label>
                      <Input type="number" placeholder="Enter minimum amount" />
                    </div>

                    <div className="space-y-3">
                      <Label>Special Handling</Label>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox id="staking" />
                          <Label htmlFor="staking">Include staking rewards as income</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="mining" />
                          <Label htmlFor="mining">Include mining rewards as income</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="defi" />
                          <Label htmlFor="defi">Include DeFi yield as income</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="airdrops" />
                          <Label htmlFor="airdrops">Include airdrops as income</Label>
                        </div>
                      </div>
                    </div>

                    <Button className="w-full">Save Tax Settings</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Settings Section */}
          {currentSection === "settings" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card
                  className={`transition-colors duration-200 ${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200 shadow-sm"
                    }`}
                >
                  <CardHeader>
                    <CardTitle className={isDarkMode ? "text-white" : "text-gray-900"}>Profile Settings</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="full-name">Full Name</Label>
                        <Input id="full-name" defaultValue="John Doe" />
                      </div>
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" defaultValue="john@example.com" />
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone</Label>
                        <Input id="phone" type="tel" defaultValue="+1 (555) 123-4567" />
                      </div>
                      <Button>Update Profile</Button>
                    </div>
                  </CardContent>
                </Card>

                <Card
                  className={`transition-colors duration-200 ${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200 shadow-sm"
                    }`}
                >
                  <CardHeader>
                    <CardTitle className={isDarkMode ? "text-white" : "text-gray-900"}>Security Settings</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="current-password">Current Password</Label>
                        <Input id="current-password" type="password" />
                      </div>
                      <div>
                        <Label htmlFor="new-password">New Password</Label>
                        <Input id="new-password" type="password" />
                      </div>
                      <div>
                        <Label htmlFor="confirm-password">Confirm Password</Label>
                        <Input id="confirm-password" type="password" />
                      </div>
                      <Button>Change Password</Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card
                className={`transition-colors duration-200 ${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200 shadow-sm"
                  }`}
              >
                <CardHeader>
                  <CardTitle className={isDarkMode ? "text-white" : "text-gray-900"}>Preferences</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="theme">Dark Mode</Label>
                        <div className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                          Use dark theme for better viewing in low light
                        </div>
                      </div>
                      <Button variant="outline" onClick={toggleTheme}>
                        {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                      </Button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Email Notifications</Label>
                        <div className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                          Receive email updates about your tax reports
                        </div>
                      </div>
                      <Checkbox />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Push Notifications</Label>
                        <div className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                          Get push notifications for important updates
                        </div>
                      </div>
                      <Checkbox />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Auto-sync Exchanges</Label>
                        <div className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                          Automatically sync transactions from connected exchanges
                        </div>
                      </div>
                      <Checkbox defaultChecked />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card
                className={`transition-colors duration-200 ${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200 shadow-sm"
                  }`}
              >
                <CardHeader>
                  <CardTitle className={isDarkMode ? "text-white" : "text-gray-900"}>Data Management</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Export Data</Label>
                        <div className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                          Download all your transaction data and reports
                        </div>
                      </div>
                      <Button variant="outline">
                        <Download className="w-4 h-4 mr-2" />
                        Export
                      </Button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Backup Settings</Label>
                        <div className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                          Create a backup of your current settings
                        </div>
                      </div>
                      <Button variant="outline">
                        <Archive className="w-4 h-4 mr-2" />
                        Backup
                      </Button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Delete Account</Label>
                        <div className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                          Permanently delete your account and all data
                        </div>
                      </div>
                      <Button variant="destructive">
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card
                className={`transition-colors duration-200 ${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200 shadow-sm"
                  }`}
              >
                <CardHeader>
                  <CardTitle className={isDarkMode ? "text-white" : "text-gray-900"}>API Keys</CardTitle>
                  <CardDescription className={isDarkMode ? "text-gray-400" : "text-gray-600"}>
                    Manage your exchange API keys for automated syncing
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div
                      className={`flex items-center justify-between p-4 border rounded-lg ${isDarkMode ? "border-gray-700" : "border-gray-200"}`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-yellow-500 rounded-lg flex items-center justify-center">
                          <Bitcoin className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <div className={`font-medium ${isDarkMode ? "text-white" : "text-gray-900"}`}>Binance</div>
                          <div className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                            API Key: ****...****
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="default">Active</Badge>
                        <Button variant="outline" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <div
                      className={`flex items-center justify-between p-4 border rounded-lg ${isDarkMode ? "border-gray-700" : "border-gray-200"}`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                          <Building className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <div className={`font-medium ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                            Coinbase Pro
                          </div>
                          <div className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                            Not configured
                          </div>
                        </div>
                      </div>
                      <Button size="sm">
                        <Plus className="w-4 h-4 mr-2" />
                        Add API Key
                      </Button>
                    </div>

                    <div
                      className={`flex items-center justify-between p-4 border rounded-lg ${isDarkMode ? "border-gray-700" : "border-gray-200"}`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                          <Building className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <div className={`font-medium ${isDarkMode ? "text-white" : "text-gray-900"}`}>Kraken</div>
                          <div className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                            Not configured
                          </div>
                        </div>
                      </div>
                      <Button size="sm">
                        <Plus className="w-4 h-4 mr-2" />
                        Add API Key
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

export default function CryptoTaxDashboard() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  )
}