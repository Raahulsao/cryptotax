import { Header } from "../../components/header"
import { Footer } from "../../components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Search,
  Zap,
  Link,
  FileText,
  Settings,
  BarChart3,
  HelpCircle,
  ArrowRight,
  Clock,
  Star,
  Filter,
} from "lucide-react"
import NextLink from "next/link"

export default function GuidesPage() {
  const guideCategories = [
    {
      icon: Zap,
      title: "Getting Started",
      description: "Essential guides to get you up and running quickly",
      guides: [
        { title: "How to Create Your Account", readTime: "3 min", difficulty: "Beginner" },
        { title: "Importing Your First Transactions", readTime: "5 min", difficulty: "Beginner" },
        { title: "Understanding Your Dashboard", readTime: "4 min", difficulty: "Beginner" },
        { title: "Generating Your First Tax Report", readTime: "7 min", difficulty: "Beginner" },
      ],
    },
    {
      icon: Link,
      title: "Integrations",
      description: "Connect your exchanges, wallets, and other platforms",
      guides: [
        { title: "Connecting Exchanges (Binance, Coinbase, etc.)", readTime: "6 min", difficulty: "Intermediate" },
        { title: "Wallet Integrations (MetaMask, Ledger, etc.)", readTime: "5 min", difficulty: "Intermediate" },
        { title: "Manual CSV Import Guide", readTime: "8 min", difficulty: "Beginner" },
        { title: "API Setup Instructions", readTime: "10 min", difficulty: "Advanced" },
      ],
    },
    {
      icon: FileText,
      title: "Transactions",
      description: "Manage and categorize your crypto transactions",
      guides: [
        { title: "Understanding Transaction Types", readTime: "6 min", difficulty: "Beginner" },
        { title: "Editing and Categorizing Transactions", readTime: "7 min", difficulty: "Intermediate" },
        { title: "Handling Missing Data", readTime: "5 min", difficulty: "Intermediate" },
        { title: "Duplicate Transaction Management", readTime: "4 min", difficulty: "Beginner" },
      ],
    },
    {
      icon: Settings,
      title: "Tax Settings",
      description: "Configure your tax preferences and methods",
      guides: [
        { title: "Choosing Your Tax Method (FIFO/LIFO)", readTime: "8 min", difficulty: "Intermediate" },
        { title: "Setting Up Tax Residency", readTime: "5 min", difficulty: "Beginner" },
        { title: "Configuring Tax Year Settings", readTime: "4 min", difficulty: "Beginner" },
        { title: "Understanding Tax Categories", readTime: "9 min", difficulty: "Advanced" },
      ],
    },
    {
      icon: BarChart3,
      title: "Portfolio Tracker",
      description: "Monitor your crypto portfolio and performance",
      guides: [
        { title: "Reading Your Portfolio Overview", readTime: "6 min", difficulty: "Beginner" },
        { title: "Setting Up Price Alerts", readTime: "4 min", difficulty: "Beginner" },
        { title: "Understanding P&L Calculations", readTime: "8 min", difficulty: "Intermediate" },
        { title: "Tracking Staking Rewards", readTime: "7 min", difficulty: "Intermediate" },
      ],
    },
    {
      icon: HelpCircle,
      title: "Customer Support",
      description: "Get help when you need it most",
      guides: [
        { title: "How to Contact Support", readTime: "2 min", difficulty: "Beginner" },
        { title: "Submitting Bug Reports", readTime: "4 min", difficulty: "Beginner" },
        { title: "Feature Request Process", readTime: "3 min", difficulty: "Beginner" },
        { title: "FAQ Section", readTime: "5 min", difficulty: "Beginner" },
      ],
    },
  ]

  const popularGuides = [
    { title: "Complete Guide to Crypto Tax Filing", readTime: "15 min", views: "12.5k" },
    { title: "DeFi Tax Implications Explained", readTime: "12 min", views: "8.2k" },
    { title: "NFT Tax Guide for Beginners", readTime: "10 min", views: "6.8k" },
    { title: "Setting Up Binance Integration", readTime: "6 min", views: "5.4k" },
  ]

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "Intermediate":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "Advanced":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative w-full py-12 md:py-24 lg:py-32 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
          <div className="container px-4 md:px-6">
            <div className="text-center space-y-6">
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl text-gray-900 dark:text-white">
                Help Center & Guides
              </h1>
              <p className="max-w-[800px] mx-auto text-gray-600 md:text-xl dark:text-gray-300">
                Everything you need to know about using KoinFile for crypto tax management
              </p>

              {/* Search Bar */}
              <div className="max-w-2xl mx-auto mt-8">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input
                    placeholder="Search guides and tutorials..."
                    className="pl-10 pr-4 py-3 text-lg border-2 border-gray-200 focus:border-purple-500 rounded-xl"
                  />
                  <Button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-purple-600 hover:bg-purple-700">
                    <Filter className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Popular Guides */}
        <section className="w-full py-12 bg-white dark:bg-gray-900">
          <div className="container px-4 md:px-6">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Popular Guides</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {popularGuides.map((guide, index) => (
                  <Card key={index} className="hover:shadow-lg transition-shadow duration-300 cursor-pointer">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <Star className="h-4 w-4 text-yellow-500 flex-shrink-0 mt-1" />
                        <Badge variant="secondary" className="text-xs">
                          {guide.views} views
                        </Badge>
                      </div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">{guide.title}</h3>
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <Clock className="h-3 w-3 mr-1" />
                        {guide.readTime}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Guide Categories */}
        <section className="w-full py-12 bg-gray-50 dark:bg-gray-800">
          <div className="container px-4 md:px-6">
            <div className="space-y-12">
              {guideCategories.map((category, index) => (
                <div key={index}>
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
                      <category.icon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{category.title}</h2>
                      <p className="text-gray-600 dark:text-gray-300">{category.description}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {category.guides.map((guide, guideIndex) => (
                      <Card
                        key={guideIndex}
                        className="hover:shadow-lg transition-shadow duration-300 cursor-pointer group"
                      >
                        <CardContent className="p-4">
                          <h3 className="font-semibold text-gray-900 dark:text-white mb-3 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                            {guide.title}
                          </h3>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                              <Clock className="h-3 w-3 mr-1" />
                              {guide.readTime}
                            </div>
                            <Badge className={`text-xs ${getDifficultyColor(guide.difficulty)}`}>
                              {guide.difficulty}
                            </Badge>
                          </div>
                          <div className="mt-3 flex items-center text-purple-600 dark:text-purple-400 text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                            Read guide
                            <ArrowRight className="h-3 w-3 ml-1" />
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-white dark:bg-gray-900">
          <div className="container px-4 md:px-6 text-center">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-gray-900 dark:text-white">
                Still Need Help?
              </h2>
              <p className="max-w-[600px] mx-auto text-gray-600 md:text-xl dark:text-gray-300">
                Our support team is here to help you with any questions about crypto tax filing
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                <Button asChild size="lg" className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 text-lg">
                  <NextLink href="/accounting">
                  Contact Support
                  <ArrowRight className="ml-2 h-5 w-5" />
                  </NextLink>
                </Button>
                <Button asChild size="lg" variant="outline" className="px-8 py-4 text-lg bg-transparent">
                  <NextLink href="/tax-guides">
                  Join Community
                  </NextLink>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
