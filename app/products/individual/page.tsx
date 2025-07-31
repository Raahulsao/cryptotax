import { Header } from "../../../components/header"
import { Footer } from "../../../components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, User, TrendingUp, FileText, Shield, Calculator, ArrowRight, Zap } from "lucide-react"
import Link from "next/link"

export default function IndividualPage() {
  const features = [
    {
      icon: Calculator,
      title: "Automated Tax Calculations",
      description: "AI-powered algorithms calculate your capital gains, losses, and tax obligations with 99.9% accuracy across all your crypto transactions."
    },
    {
      icon: TrendingUp,
      title: "Portfolio Tracking",
      description: "Real-time portfolio monitoring with detailed performance analytics, profit/loss tracking, and asset allocation insights."
    },
    {
      icon: FileText,
      title: "Professional Tax Reports",
      description: "Generate IRS-compliant tax reports in multiple formats including PDF, CSV, and direct TurboTax integration."
    },
    {
      icon: Shield,
      title: "Bank-Grade Security",
      description: "Your data is protected with enterprise-level encryption, secure API connections, and we never store your private keys."
    }
  ]

  const benefits = [
    "Support for 800+ exchanges and wallets",
    "Automatic transaction import and categorization",
    "DeFi and NFT transaction support",
    "Multiple cost basis methods (FIFO, LIFO, Specific ID)",
    "Tax loss harvesting optimization",
    "Multi-country tax compliance",
    "Priority customer support",
    "Audit trail and documentation"
  ]

  const pricingPlans = [
    {
      name: "Free",
      price: "$0",
      period: "forever",
      description: "Perfect for crypto beginners",
      features: [
        "Up to 100 transactions",
        "Basic tax report (PDF)",
        "1 exchange connection",
        "Email support"
      ],
      cta: "Get Started Free",
      popular: false
    },
    {
      name: "Personal",
      price: "$49",
      period: "per year",
      description: "Ideal for active crypto investors",
      features: [
        "Unlimited transactions",
        "All report formats",
        "All exchange integrations",
        "Priority support",
        "Portfolio analytics",
        "Tax optimization"
      ],
      cta: "Choose Personal",
      popular: true
    },
    {
      name: "Pro",
      price: "$149",
      period: "per year",
      description: "Advanced features for serious traders",
      features: [
        "Everything in Personal",
        "Advanced tax strategies",
        "Phone support",
        "API access",
        "Custom categories",
        "Audit support"
      ],
      cta: "Choose Pro",
      popular: false
    }
  ]

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative w-full py-12 md:py-24 lg:py-32 bg-gradient-to-br from-purple-600 to-blue-600 text-white">
          <div className="container px-4 md:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <Badge className="bg-white/20 text-white border-white/30">
                  <User className="w-4 h-4 mr-2" />
                  For Individuals
                </Badge>
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
                  Crypto Tax Filing
                  <span className="block text-purple-200">Made Simple</span>
                </h1>
                <p className="text-xl text-purple-100 max-w-[600px]">
                  Automate your crypto tax calculations with the most trusted platform for individual investors. 
                  From simple trades to complex DeFi transactions, we've got you covered.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button asChild size="lg" className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-4 text-lg">
                    <Link href="/pricing">
                    Start Free Trial
                    <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                  <Button asChild
                    size="lg"
                    variant="outline"
                    className="border-white text-white hover:bg-white hover:text-purple-600 px-8 py-4 text-lg bg-transparent"
                  >
                    <Link href="/tools/tax-calculator">
                    Try Free Calculator
                    </Link>
                  </Button>
                </div>
              </div>
              <div className="relative">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-purple-200">Total Transactions</span>
                      <span className="text-2xl font-bold text-white">1,247</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-purple-200">Capital Gains</span>
                      <span className="text-xl font-semibold text-green-300">+$12,450</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-purple-200">Tax Owed</span>
                      <span className="text-xl font-semibold text-orange-300">$2,489</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-purple-200">Time Saved</span>
                      <span className="text-xl font-semibold text-blue-300">40+ hours</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-white dark:bg-gray-900">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-gray-900 dark:text-white mb-4">
                Everything You Need for Crypto Taxes
              </h2>
              <p className="max-w-[800px] mx-auto text-gray-600 md:text-xl dark:text-gray-300">
                Comprehensive tools designed specifically for individual crypto investors
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {features.map((feature, index) => (
                <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <CardHeader>
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
                        <feature.icon className="h-6 w-6 text-white" />
                      </div>
                      <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">{feature.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-50 dark:bg-gray-800">
          <div className="container px-4 md:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-gray-900 dark:text-white mb-6">
                  Why Choose KoinFile for Individual Tax Filing?
                </h2>
                <div className="grid grid-cols-1 gap-4">
                  {benefits.map((benefit, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <CheckCircle className="h-6 w-6 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-600 dark:text-gray-300">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="relative">
                <Card className="shadow-xl border-0">
                  <CardContent className="p-8">
                    <div className="text-center space-y-4">
                      <Zap className="h-16 w-16 text-yellow-500 mx-auto" />
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Save 40+ Hours</h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        Our users save an average of 40+ hours during tax season by automating their crypto tax calculations
                      </p>
                      <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                        <p className="text-green-800 dark:text-green-200 font-semibold">
                          "KoinFile saved me weeks of work and stress during tax season!" - Sarah J.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-white dark:bg-gray-900">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-gray-900 dark:text-white mb-4">
                Choose Your Plan
              </h2>
              <p className="max-w-[600px] mx-auto text-gray-600 md:text-xl dark:text-gray-300">
                Start free and upgrade as your crypto portfolio grows
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {pricingPlans.map((plan, index) => (
                <Card
                  key={index}
                  className={`relative ${
                    plan.popular ? "ring-2 ring-purple-500 scale-105" : ""
                  } hover:shadow-xl transition-all duration-300`}
                >
                  {plan.popular && (
                    <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-purple-500 text-white">
                      Most Popular
                    </Badge>
                  )}
                  <CardHeader className="text-center pb-4">
                    <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">{plan.name}</CardTitle>
                    <div className="mt-4">
                      <span className="text-4xl font-bold text-gray-900 dark:text-white">{plan.price}</span>
                      <span className="text-gray-600 dark:text-gray-300 ml-2">/{plan.period}</span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 text-sm mt-2">{plan.description}</p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <ul className="space-y-3">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start space-x-3">
                          <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-600 dark:text-gray-300 text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button
                      className={`w-full mt-6 ${
                        plan.popular
                          ? "bg-purple-600 hover:bg-purple-700 text-white"
                          : "bg-gray-100 hover:bg-gray-200 text-gray-900 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-white"
                      }`}
                    >
                      {plan.cta}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
          <div className="container px-4 md:px-6 text-center">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Ready to Simplify Your Crypto Taxes?
              </h2>
              <p className="max-w-[600px] mx-auto text-purple-100 md:text-xl">
                Join thousands of individual investors who trust KoinFile for accurate, compliant crypto tax reporting
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                <Button asChild size="lg" className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold">
                  <Link href="/pricing">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-purple-600 px-8 py-4 text-lg bg-transparent"
                >
                  <Link href="/guides">
                  View Demo
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
