"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  CheckCircle,
  Star,
  Shield,
  Zap,
  Users,
  FileText,
  Calculator,
  BarChart3,
  ArrowRight,
  ChevronRight,
  ChevronLeft,
  TrendingUp,
  Globe,
  Lock,
  AlertTriangle,
  Upload,
  Sparkles,
} from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { AuthModal } from "@/components/auth-modal"
import Image from "next/image"

const features = [
  {
    icon: Calculator,
    title: "Automated Tax Calculations",
    description:
      "Our advanced AI algorithms automatically calculate your crypto taxes across all transactions and exchanges with 99.9% accuracy.",
  },
  {
    icon: FileText,
    title: "Professional Tax Reports",
    description:
      "Generate comprehensive, audit-ready tax reports compatible with popular tax software like TurboTax and TaxAct.",
  },
  {
    icon: BarChart3,
    title: "Advanced Portfolio Analytics",
    description:
      "Track your crypto portfolio performance with detailed analytics, insights, and real-time market data.",
  },
  {
    icon: Shield,
    title: "Enterprise-Grade Security",
    description: "Your data is protected with bank-level security, 256-bit encryption, and SOC 2 Type II compliance.",
  },
  {
    icon: Zap,
    title: "Real-Time Sync",
    description: "Automatically sync transactions from 300+ exchanges and wallets in real-time with instant updates.",
  },
  {
    icon: Users,
    title: "Expert Support",
    description: "Get help from our team of certified crypto tax experts and professional accountants available 24/7.",
  },
]

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Crypto Trader",
    avatar: "/placeholder.svg?height=40&width=40",
    content:
      "KoinFile saved me hours of manual work. The automated calculations are spot-on and the reports are professional.",
    rating: 5,
  },
  {
    name: "Michael Chen",
    role: "DeFi Investor",
    avatar: "/placeholder.svg?height=40&width=40",
    content:
      "Finally, a crypto tax tool that understands DeFi. The yield farming calculations are incredibly accurate.",
    rating: 5,
  },
  {
    name: "Emily Rodriguez",
    role: "Portfolio Manager",
    avatar: "/placeholder.svg?height=40&width=40",
    content: "The portfolio analytics feature helps me make better investment decisions. Highly recommended!",
    rating: 5,
  },
  {
    name: "David Kim",
    role: "NFT Collector",
    avatar: "/placeholder.svg?height=40&width=40",
    content: "The NFT tax calculations are perfect. KoinFile handles all my complex transactions seamlessly.",
    rating: 5,
  },
  {
    name: "Lisa Wang",
    role: "Day Trader",
    avatar: "/placeholder.svg?height=40&width=40",
    content: "As someone who makes hundreds of trades, KoinFile's automation is a lifesaver for tax season.",
    rating: 5,
  },
  {
    name: "Alex Thompson",
    role: "Crypto Investor",
    avatar: "/placeholder.svg?height=40&width=40",
    content: "The customer support is amazing. They helped me understand complex tax scenarios easily.",
    rating: 5,
  },
]

const faqs = [
  {
    question: "How does KoinFile calculate my crypto taxes?",
    answer:
      "KoinFile uses advanced algorithms to track your cost basis, calculate capital gains/losses, and determine your tax liability based on your country's tax laws. We support FIFO, LIFO, and specific identification methods. Our system automatically handles complex scenarios like DeFi transactions, staking rewards, airdrops, and NFT trades to ensure accurate tax calculations.",
  },
  {
    question: "Which exchanges and wallets do you support?",
    answer:
      "We support over 300 exchanges and wallets including Binance, Coinbase, Kraken, MetaMask, Ledger, Trezor, and many more. You can connect via API for real-time sync or upload CSV files for manual import. We also support DeFi protocols like Uniswap, Aave, Compound, and other popular platforms.",
  },
  {
    question: "Is my data secure with KoinFile?",
    answer:
      "Yes, we use bank-level security with 256-bit encryption, two-factor authentication, and never store your exchange API keys with trading permissions. All data is encrypted both in transit and at rest. We undergo regular security audits and comply with SOC 2 Type II standards to ensure your information is always protected.",
  },
  {
    question: "Can I generate reports for multiple tax years?",
    answer:
      "You can generate tax reports for any tax year and export them in various formats compatible with popular tax software like TurboTax, TaxAct, FreeTaxUSA, and more. You can also generate custom date range reports for specific periods or accounting purposes.",
  },
  {
    question: "Do you support DeFi transactions and yield farming?",
    answer:
      "Yes, we have comprehensive support for DeFi protocols including yield farming, liquidity mining, staking rewards, lending/borrowing, and more. Our system automatically categorizes these transactions and calculates the appropriate tax implications based on your jurisdiction's regulations.",
  },
  {
    question: "What countries do you support for tax calculations?",
    answer:
      "KoinFile supports tax calculations for over 100 countries including the United States, Canada, United Kingdom, Australia, Germany, France, and many others. Each country has specific tax rules and regulations that our system automatically applies to ensure compliance with local tax laws.",
  },
  {
    question: "How accurate are the tax calculations?",
    answer:
      "Our tax calculations are 99.9% accurate thanks to our advanced AI-powered algorithms and continuous updates to tax regulations. We work with certified tax professionals and regularly audit our calculations to ensure they meet the highest standards of accuracy and compliance.",
  },
  {
    question: "Can I import historical transaction data?",
    answer:
      "Yes, you can import historical transaction data going back several years. We support various file formats including CSV, Excel, and direct API connections. Our system can handle large volumes of historical data and will automatically organize and categorize your transactions for tax purposes.",
  },
]

const newsItems = [
  {
    title: "New DeFi Protocol Support Added",
    excerpt: "We've added support for 15 new DeFi protocols including Aave, Compound, and Uniswap V3.",
    date: "March 15, 2024",
    category: "Product Update",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    title: "2024 Tax Season Preparation Guide",
    excerpt: "Everything you need to know about crypto taxes for the 2024 tax season.",
    date: "March 10, 2024",
    category: "Tax Guide",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    title: "Partnership with Leading Tax Firms",
    excerpt: "KoinFile partners with top accounting firms to provide expert crypto tax services.",
    date: "March 5, 2024",
    category: "Partnership",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    title: "Advanced Portfolio Analytics",
    excerpt: "New portfolio tracking features with real-time insights and performance metrics.",
    date: "February 28, 2024",
    category: "Feature",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    title: "Enhanced Security Features",
    excerpt: "New two-factor authentication and advanced encryption for better security.",
    date: "February 20, 2024",
    category: "Security",
    image: "/placeholder.svg?height=200&width=300",
  },
]

const additionalFeatures = [
  {
    icon: Globe,
    title: "Multi-Country Support",
    description:
      "Tax calculations for 100+ countries with local compliance and regulations including India, US, UK, Canada, and more",
    color: "bg-gradient-to-br from-blue-500 to-blue-600",
  },
  {
    icon: Lock,
    title: "Advanced Security",
    description:
      "SOC 2 compliant with bank-grade encryption, multi-factor authentication, and zero-knowledge architecture",
    color: "bg-gradient-to-br from-purple-500 to-purple-600",
  },
  {
    icon: TrendingUp,
    title: "Real-time Tracking",
    description:
      "Live portfolio monitoring, tax optimization alerts, and instant notifications for better decision making",
    color: "bg-gradient-to-br from-orange-500 to-orange-600",
  },
]

export default function HomePage() {
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [authMode, setAuthMode] = useState<"login" | "signup">("login")
  const testimonialRef = useRef<HTMLDivElement>(null)
  const newsRef = useRef<HTMLDivElement>(null)

  const handleGetStarted = () => {
    setAuthMode("signup")
    setAuthModalOpen(true)
  }

  const handleSignIn = () => {
    setAuthMode("login")
    setAuthModalOpen(true)
  }

  const handleGotTaxNotice = () => {
    setAuthMode("signup")
    setAuthModalOpen(true)
  }

  const scrollTestimonials = (direction: "left" | "right") => {
    if (testimonialRef.current) {
      const scrollAmount = 320
      testimonialRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      })
    }
  }

  const scrollNews = (direction: "left" | "right") => {
    if (newsRef.current) {
      const scrollAmount = 320
      newsRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      })
    }
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Header />

      {/* Hero Section - Reduced Size */}
      <section className="relative overflow-hidden bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 pt-20 pb-24">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="absolute top-20 left-10 w-48 h-48 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-10 w-48 h-48 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-48 h-48 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Badge
              variant="outline"
              className="mb-6 bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 border-purple-200 dark:bg-purple-900 dark:text-purple-300 text-sm px-4 py-2 shadow-lg"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              New: Advanced DeFi Tax Calculations with AI
            </Badge>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
              Simplify Your{" "}
              <span className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Crypto Taxes
              </span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              The most comprehensive crypto tax platform trusted by 500K+ investors. Automatically calculate taxes,
              generate professional reports, and stay compliant across 100+ countries.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Button
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-3 text-lg font-semibold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
                onClick={handleGetStarted}
              >
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="px-8 py-3 text-lg font-semibold bg-transparent border-2 border-orange-500 text-orange-600 hover:bg-orange-50 dark:border-orange-400 dark:text-orange-400 dark:hover:bg-orange-900/20 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                onClick={handleGotTaxNotice}
              >
                <AlertTriangle className="mr-2 h-5 w-5" />
                Got Tax Notice?
              </Button>
            </div>
            <div className="flex items-center justify-center gap-8 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                Free 14-day trial
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                No credit card required
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                Cancel anytime
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Reduced Size */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Everything You Need for Crypto Tax Compliance
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              From automated calculations to professional reports, KoinFile handles all aspects of crypto taxation with
              enterprise-grade precision.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white dark:bg-gray-800 hover:scale-105 group"
              >
                <CardHeader className="pb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900 dark:to-blue-900 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <feature.icon className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section - Reduced Size */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">How KoinFile Works</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Get started with crypto tax compliance in just 3 simple steps
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900 dark:to-blue-900 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Upload className="w-8 h-8 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Upload Your Transactions</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                Securely upload your transaction files or connect your exchanges and wallets. We support 300+ platforms
                with automatic sync and real-time updates.
              </p>
            </div>
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900 dark:to-blue-900 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">2</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Automatic Calculations</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                Our AI-powered engine automatically calculates your gains, losses, and tax liability with 99.9% accuracy
                across all jurisdictions and complex DeFi scenarios.
              </p>
            </div>
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900 dark:to-blue-900 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">3</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Generate Reports</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                Download professional, audit-ready tax reports compatible with TurboTax, TaxAct, and other popular tax
                software in multiple formats with detailed breakdowns.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Advanced Features Section - Reduced Size */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Advanced Features for Every Need
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
              Discover powerful tools designed to make crypto tax management effortless and professional
            </p>
            <Button
              size="lg"
              variant="outline"
              className="bg-transparent border-2 border-purple-600 text-purple-600 hover:bg-purple-50 dark:border-purple-400 dark:text-purple-400 dark:hover:bg-purple-900/20 px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              asChild
            >
              <a href="/features">
                Explore All Features
                <ArrowRight className="ml-2 h-5 w-5" />
              </a>
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {additionalFeatures.map((feature, index) => (
              <Card
                key={index}
                className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white dark:bg-gray-800 hover:scale-105 group"
              >
                <CardContent className="p-6 text-center">
                  <div
                    className={`w-12 h-12 ${feature.color} rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}
                  >
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">{feature.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section - Reduced Size */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <Card className="text-center p-8 border-0 shadow-lg bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 hover:shadow-xl transition-all duration-300 hover:scale-105 group">
              <div className="text-4xl font-bold text-purple-600 mb-3 group-hover:scale-110 transition-transform duration-300">
                500K+
              </div>
              <div className="text-gray-600 dark:text-gray-300 font-semibold text-sm">Active Users</div>
            </Card>
            <Card className="text-center p-8 border-0 shadow-lg bg-gradient-to-br from-blue-50 to-green-50 dark:from-blue-900/20 dark:to-green-900/20 hover:shadow-xl transition-all duration-300 hover:scale-105 group">
              <div className="text-4xl font-bold text-blue-600 mb-3 group-hover:scale-110 transition-transform duration-300">
                $50B+
              </div>
              <div className="text-gray-600 dark:text-gray-300 font-semibold text-sm">Assets Tracked</div>
            </Card>
            <Card className="text-center p-8 border-0 shadow-lg bg-gradient-to-br from-green-50 to-yellow-50 dark:from-green-900/20 dark:to-yellow-900/20 hover:shadow-xl transition-all duration-300 hover:scale-105 group">
              <div className="text-4xl font-bold text-green-600 mb-3 group-hover:scale-110 transition-transform duration-300">
                300+
              </div>
              <div className="text-gray-600 dark:text-gray-300 font-semibold text-sm">Exchanges Supported</div>
            </Card>
            <Card className="text-center p-8 border-0 shadow-lg bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 hover:shadow-xl transition-all duration-300 hover:scale-105 group">
              <div className="text-4xl font-bold text-orange-600 mb-3 group-hover:scale-110 transition-transform duration-300">
                100+
              </div>
              <div className="text-gray-600 dark:text-gray-300 font-semibold text-sm">Countries</div>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials Section - Reduced Size */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Trusted by Crypto Investors Worldwide
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              See what our customers have to say about KoinFile
            </p>
          </div>
          <div className="relative">
            <div className="flex items-center justify-between mb-6">
              <Button
                variant="outline"
                size="icon"
                onClick={() => scrollTestimonials("left")}
                className="bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl w-10 h-10"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => scrollTestimonials("right")}
                className="bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl w-10 h-10"
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
            <div
              ref={testimonialRef}
              className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {testimonials.map((testimonial, index) => (
                <Card
                  key={index}
                  className="min-w-[300px] border-0 shadow-lg bg-white dark:bg-gray-800 hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 mb-6 text-sm leading-relaxed">
                      "{testimonial.content}"
                    </p>
                    <div className="flex items-center">
                      <Avatar className="h-10 w-10 mr-3">
                        <AvatarImage src={testimonial.avatar || "/placeholder.svg"} alt={testimonial.name} />
                        <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-semibold text-gray-900 dark:text-white text-sm">{testimonial.name}</div>
                        <div className="text-gray-500 dark:text-gray-400 text-xs">{testimonial.role}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section - Reduced Size */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Get answers to common questions about crypto taxes and KoinFile
            </p>
          </div>
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-white dark:bg-gray-800 border rounded-lg px-6 shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <AccordionTrigger className="text-left font-semibold text-gray-900 dark:text-white hover:no-underline py-6 text-lg">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 dark:text-gray-300 pb-6 text-sm leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* News Section - Reduced Size */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">Latest News & Updates</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Stay updated with the latest crypto tax news and KoinFile updates
            </p>
          </div>
          <div className="relative">
            <div className="flex items-center justify-between mb-6">
              <Button
                variant="outline"
                size="icon"
                onClick={() => scrollNews("left")}
                className="bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl w-10 h-10"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => scrollNews("right")}
                className="bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl w-10 h-10"
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
            <div
              ref={newsRef}
              className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {newsItems.map((item, index) => (
                <Card
                  key={index}
                  className="min-w-[320px] border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white dark:bg-gray-800 hover:scale-105 group"
                >
                  <div className="relative overflow-hidden rounded-t-lg">
                    <Image
                      src={item.image || "/placeholder.svg"}
                      alt={item.title}
                      width={320}
                      height={180}
                      className="w-full h-40 object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <Badge className="absolute top-3 right-3 bg-white/90 text-gray-800 shadow-lg text-xs px-2 py-1">
                      {item.category}
                    </Badge>
                  </div>
                  <CardHeader>
                    <CardTitle className="text-lg font-bold text-gray-900 dark:text-white line-clamp-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                      {item.title}
                    </CardTitle>
                    <div className="text-gray-500 dark:text-gray-400 text-sm">{item.date}</div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm leading-relaxed">{item.excerpt}</p>
                    <Button
                      variant="ghost"
                      className="p-0 h-auto text-purple-600 hover:text-purple-700 text-sm font-semibold"
                    >
                      Read More <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Reduced Size */}
      <section className="py-16 bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to Simplify Your Crypto Taxes?</h2>
          <p className="text-lg text-purple-100 mb-8">
            Join thousands of crypto investors who trust KoinFile for their tax compliance needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-3 text-lg font-bold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
              onClick={handleGetStarted}
            >
              Start Free Trial
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-2 border-white text-white hover:bg-white hover:text-purple-600 px-8 py-3 text-lg font-bold bg-transparent shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
              onClick={handleSignIn}
            >
              Sign In
            </Button>
          </div>
        </div>
      </section>

      <Footer />

      <AuthModal open={authModalOpen} onOpenChange={setAuthModalOpen} mode={authMode} onModeChange={setAuthMode} />
    </div>
  )
}
