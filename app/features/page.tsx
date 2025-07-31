import { Header } from "../../components/header"
import { Footer } from "../../components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Upload,
  Calculator,
  BarChart3,
  FileText,
  Network,
  Globe,
  ArrowRight,
  CheckCircle,
  Shield,
  Zap,
  Target,
  Database,
} from "lucide-react"
import Link from "next/link"

export default function FeaturesPage() {
  const mainFeatures = [
    {
      icon: Upload,
      title: "Seamless Transaction Import",
      description: "Connect 800+ exchanges and wallets. Automatically sync all your crypto transactions in real-time.",
      color: "bg-blue-500",
    },
    {
      icon: Calculator,
      title: "AI-Powered Tax Engine",
      description: "Advanced algorithms calculate capital gains, losses, and tax obligations with 99.9% accuracy.",
      color: "bg-purple-500",
    },
    {
      icon: BarChart3,
      title: "Real-Time Portfolio Insights",
      description: "Track your crypto portfolio performance and tax implications across all holdings.",
      color: "bg-green-500",
    },
    {
      icon: FileText,
      title: "Professional Tax Reports",
      description: "Generate IRS-compliant reports in PDF, CSV, and TurboTax formats instantly.",
      color: "bg-orange-500",
    },
    {
      icon: Network,
      title: "Complete DeFi Support",
      description: "Handle complex DeFi transactions, yield farming, and liquidity mining rewards.",
      color: "bg-pink-500",
    },
    {
      icon: Globe,
      title: "Multi-Country Support",
      description: "Tax calculations for US, UK, Canada, Australia, and 20+ other countries.",
      color: "bg-teal-500",
    },
  ]

  const advancedFeatures = [
    {
      icon: Target,
      title: "Transaction Categorization",
      features: [
        "Auto-classify trades, airdrops, staking rewards, and NFT transactions",
        "Custom category creation and management",
        "Smart pattern recognition for recurring transactions",
      ],
    },
    {
      icon: Database,
      title: "Cost Basis Tracking",
      features: [
        "FIFO, LIFO, and specific identification methods",
        "Historical price data with millisecond accuracy",
        "Automated cost basis calculations across all assets",
      ],
    },
    {
      icon: Shield,
      title: "Audit Trail",
      features: [
        "Complete transaction history with blockchain verification",
        "Audit-ready documentation for tax authorities",
        "Immutable record keeping with cryptographic proof",
      ],
    },
  ]

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative w-full py-12 md:py-24 lg:py-32 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center text-center space-y-6">
              <Badge variant="secondary" className="px-4 py-2">
                <Zap className="w-4 h-4 mr-2" />
                Trusted by 50,000+ Users
              </Badge>
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl text-gray-900 dark:text-white">
                Powerful Features for
                <span className="block text-purple-600 dark:text-purple-400">Effortless Crypto Tax</span>
                Management
              </h1>
              <p className="max-w-[900px] text-gray-600 md:text-xl lg:text-2xl dark:text-gray-300">
                Everything you need to calculate, track, and report your crypto taxes accurately with enterprise-grade
                precision and compliance.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mt-8">
                <Button asChild size="lg" className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 text-lg">
                  <Link href="/pricing">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="px-8 py-4 text-lg bg-transparent">
                  <Link href="/guides">
                  Watch Demo
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Main Features Grid */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-white dark:bg-gray-900">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-gray-900 dark:text-white mb-4">
                Core Features
              </h2>
              <p className="max-w-[800px] mx-auto text-gray-600 md:text-xl dark:text-gray-300">
                Comprehensive tools designed to simplify every aspect of crypto tax management
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {mainFeatures.map((feature, index) => (
                <Card
                  key={index}
                  className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg hover:scale-105"
                >
                  <CardHeader className="text-center pb-4">
                    <div
                      className={`w-16 h-16 ${feature.color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}
                    >
                      <feature.icon className="h-8 w-8 text-white" />
                    </div>
                    <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Advanced Features Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-50 dark:bg-gray-800">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-gray-900 dark:text-white mb-4">
                Advanced Capabilities
              </h2>
              <p className="max-w-[800px] mx-auto text-gray-600 md:text-xl dark:text-gray-300">
                Professional-grade features for complex crypto tax scenarios
              </p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {advancedFeatures.map((feature, index) => (
                <Card key={index} className="bg-white dark:bg-gray-900 border-0 shadow-lg">
                  <CardHeader>
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center mb-4">
                      <feature.icon className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {feature.features.map((item, idx) => (
                        <li key={idx} className="flex items-start space-x-3">
                          <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-600 dark:text-gray-300 text-sm">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Performance Stats */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-white dark:bg-gray-900">
          <div className="container px-4 md:px-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
              <div className="space-y-2">
                <div className="text-4xl font-bold text-purple-600 dark:text-purple-400">99.9%</div>
                <div className="text-gray-600 dark:text-gray-300">Calculation Accuracy</div>
              </div>
              <div className="space-y-2">
                <div className="text-4xl font-bold text-blue-600 dark:text-blue-400">800+</div>
                <div className="text-gray-600 dark:text-gray-300">Supported Exchanges</div>
              </div>
              <div className="space-y-2">
                <div className="text-4xl font-bold text-green-600 dark:text-green-400">24/7</div>
                <div className="text-gray-600 dark:text-gray-300">Real-time Sync</div>
              </div>
              <div className="space-y-2">
                <div className="text-4xl font-bold text-orange-600 dark:text-orange-400">20+</div>
                <div className="text-gray-600 dark:text-gray-300">Countries Supported</div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
          <div className="container px-4 md:px-6 text-center">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Start Your Free Tax Report Today
              </h2>
              <p className="max-w-[600px] mx-auto text-purple-100 md:text-xl">
                Join thousands of crypto investors who trust KoinFile for accurate, compliant tax reporting.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                <Button asChild
                  size="lg"
                  className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold"
                >
                  <Link href="/pricing">
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-purple-600 px-8 py-4 text-lg bg-transparent"
                >
                  <Link href="/accounting">
                  Contact Sales
                  </Link>
                </Button>
              </div>
              <p className="text-sm text-purple-200 mt-4">No credit card required • Free for up to 100 transactions</p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
