import { Header } from "../../components/header"
import { Footer } from "../../components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Building2, Users, Shield, Zap, BarChart3, Settings, ArrowRight, CheckCircle, Database } from "lucide-react"
import Link from "next/link"

export default function AccountingPage() {
  const keyBenefits = [
    {
      icon: Zap,
      title: "Automated Bookkeeping",
      features: [
        "Real-time transaction recording",
        "Multi-entity management",
        "Custom chart of accounts",
        "Automated journal entries",
      ],
    },
    {
      icon: BarChart3,
      title: "Financial Reporting",
      features: [
        "Balance sheets with crypto valuations",
        "P&L statements with realized/unrealized gains",
        "Cash flow analysis",
        "Custom financial dashboards",
      ],
    },
    {
      icon: Users,
      title: "Team Collaboration",
      features: ["Role-based access controls", "Approval workflows", "Activity audit logs", "Multi-user permissions"],
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      features: [
        "SOC 2 Type II compliance",
        "Bank-level encryption",
        "Data privacy protection",
        "Regular security audits",
      ],
    },
  ]

  const integrations = [
    { name: "QuickBooks", logo: "/placeholder.svg?height=60&width=120&text=QuickBooks" },
    { name: "Xero", logo: "/placeholder.svg?height=60&width=120&text=Xero" },
    { name: "NetSuite", logo: "/placeholder.svg?height=60&width=120&text=NetSuite" },
    { name: "SAP", logo: "/placeholder.svg?height=60&width=120&text=SAP" },
  ]

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative w-full py-12 md:py-24 lg:py-32 bg-gradient-to-br from-blue-900 to-purple-900 text-white">
          <div className="container px-4 md:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <Badge className="bg-blue-500/20 text-blue-200 border-blue-500/30">
                  <Building2 className="w-4 h-4 mr-2" />
                  Enterprise Solution
                </Badge>
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
                  Professional Crypto
                  <span className="block text-blue-300">Accounting for Businesses</span>
                </h1>
                <p className="text-xl text-gray-300 max-w-[600px]">
                  Streamline your digital asset accounting with enterprise-grade tools and compliance features designed
                  for modern businesses.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button asChild size="lg" className="bg-white text-blue-900 hover:bg-gray-100 px-8 py-4 text-lg">
                    <Link href="/pricing">
                    Request Demo
                    <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                  <Button asChild
                    size="lg"
                    variant="outline"
                    className="border-white text-white hover:bg-white hover:text-blue-900 px-8 py-4 text-lg bg-transparent"
                  >
                    <Link href="/pricing">
                    Contact Sales
                    </Link>
                  </Button>
                </div>
              </div>
              <div className="relative">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-300">Total Portfolio Value</span>
                      <span className="text-2xl font-bold text-green-400">$2,847,392</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-300">Realized Gains (YTD)</span>
                      <span className="text-xl font-semibold text-blue-300">$184,729</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-300">Tax Liability</span>
                      <span className="text-xl font-semibold text-orange-300">$45,182</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Key Benefits */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-white dark:bg-gray-900">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-gray-900 dark:text-white mb-4">
                Enterprise-Grade Capabilities
              </h2>
              <p className="max-w-[800px] mx-auto text-gray-600 md:text-xl dark:text-gray-300">
                Built for businesses that need professional crypto accounting and compliance
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {keyBenefits.map((benefit, index) => (
                <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <CardHeader>
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                        <benefit.icon className="h-6 w-6 text-white" />
                      </div>
                      <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">{benefit.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {benefit.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start space-x-3">
                          <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-600 dark:text-gray-300">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Integration Features */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-50 dark:bg-gray-800">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-gray-900 dark:text-white mb-4">
                Seamless Integrations
              </h2>
              <p className="max-w-[600px] mx-auto text-gray-600 md:text-xl dark:text-gray-300">
                Connect with your existing accounting software and financial systems
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
              {integrations.map((integration, index) => (
                <Card
                  key={index}
                  className="bg-white dark:bg-gray-900 border-0 shadow-md hover:shadow-lg transition-shadow duration-300 p-6"
                >
                  <div className="flex items-center justify-center h-16">
                    <img
                      src={integration.logo || "/placeholder.svg"}
                      alt={integration.name}
                      className="max-h-12 max-w-full object-contain"
                    />
                  </div>
                </Card>
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="bg-white dark:bg-gray-900 border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-3">
                    <Database className="h-6 w-6 text-blue-500" />
                    <span className="text-gray-900 dark:text-white">Custom API Connections</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    Build custom integrations with our robust API infrastructure
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm text-gray-600 dark:text-gray-300">RESTful API with webhooks</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm text-gray-600 dark:text-gray-300">Real-time data synchronization</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm text-gray-600 dark:text-gray-300">Comprehensive documentation</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
              <Card className="bg-white dark:bg-gray-900 border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-3">
                    <Settings className="h-6 w-6 text-purple-500" />
                    <span className="text-gray-900 dark:text-white">Multi-Bank Account Linking</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    Connect multiple bank accounts and financial institutions
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm text-gray-600 dark:text-gray-300">Secure bank-grade connections</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm text-gray-600 dark:text-gray-300">Automated transaction matching</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm text-gray-600 dark:text-gray-300">Multi-currency support</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <div className="container px-4 md:px-6 text-center">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Ready to Transform Your Crypto Accounting?
              </h2>
              <p className="max-w-[600px] mx-auto text-blue-100 md:text-xl">
                Contact our sales team to discuss enterprise pricing and custom solutions for your business.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                <Button asChild size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold">
                  <Link href="/pricing">
                  Schedule Demo
                  <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 text-lg bg-transparent"
                >
                  <Link href="/pricing">
                  Contact Sales
                  </Link>
                </Button>
              </div>
              <p className="text-sm text-blue-200 mt-4">
                Custom pricing available • Dedicated account management • SLA guarantees
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
