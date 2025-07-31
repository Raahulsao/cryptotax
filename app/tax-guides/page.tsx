import { Header } from "../../components/header"
import { Footer } from "../../components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Globe, TrendingUp, Calculator, Download, ArrowRight, Clock, Users, Star } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function TaxGuidesPage() {
  const featuredGuides = [
    {
      title: "Complete Crypto Tax Guide 2024",
      description:
        "Understanding crypto tax basics, taxable vs non-taxable events, record keeping requirements, filing deadlines and forms",
      image: "/placeholder.svg?height=200&width=300&text=Crypto+Tax+Guide+2024",
      readTime: "25 min",
      difficulty: "Beginner",
      views: "45.2k",
      featured: true,
    },
    {
      title: "DeFi Tax Implications",
      description:
        "Complete guide to decentralized finance taxation including yield farming, liquidity mining, and staking rewards",
      image: "/placeholder.svg?height=200&width=300&text=DeFi+Tax+Guide",
      readTime: "18 min",
      difficulty: "Advanced",
      views: "28.7k",
      featured: true,
    },
    {
      title: "NFT Taxation Guide",
      description: "Everything you need to know about NFT taxes including creation, trading, and royalty income",
      image: "/placeholder.svg?height=200&width=300&text=NFT+Tax+Guide",
      readTime: "15 min",
      difficulty: "Intermediate",
      views: "19.3k",
      featured: true,
    },
  ]

  const countryGuides = [
    {
      country: "United States",
      flag: "🇺🇸",
      title: "US Crypto Tax Guide",
      description: "Form 8949, Schedule D, and IRS requirements",
      guides: ["Form 8949 Instructions", "Schedule D Filing", "IRS Crypto Guidelines"],
    },
    {
      country: "United Kingdom",
      flag: "🇬🇧",
      title: "UK Crypto Tax Guide",
      description: "Capital Gains Tax and HMRC requirements",
      guides: ["CGT Calculations", "HMRC Reporting", "UK Tax Rates"],
    },
    {
      country: "Canada",
      flag: "🇨🇦",
      title: "Canada Crypto Tax Guide",
      description: "CRA requirements and tax implications",
      guides: ["CRA Guidelines", "Business vs Investment", "Tax Forms"],
    },
    {
      country: "Australia",
      flag: "🇦🇺",
      title: "Australia Crypto Tax Guide",
      description: "ATO guidelines and reporting requirements",
      guides: ["ATO Requirements", "CGT Events", "Record Keeping"],
    },
  ]

  const advancedTopics = [
    {
      icon: TrendingUp,
      title: "DeFi Tax Implications",
      description: "Navigate complex DeFi protocols and their tax consequences",
      topics: ["Yield Farming", "Liquidity Mining", "Governance Tokens", "Impermanent Loss"],
    },
    {
      icon: Star,
      title: "NFT Taxation Guide",
      description: "Understand NFT creation, trading, and royalty taxation",
      topics: ["NFT Creation", "Trading Taxes", "Royalty Income", "Marketplace Fees"],
    },
    {
      icon: Calculator,
      title: "Mining and Staking Tax Treatment",
      description: "Tax implications of mining rewards and staking income",
      topics: ["Mining Income", "Staking Rewards", "Validator Rewards", "Pool Rewards"],
    },
    {
      icon: Globe,
      title: "Crypto Business Tax Strategies",
      description: "Advanced strategies for crypto businesses and traders",
      topics: ["Business Structure", "Expense Deductions", "Trader Status", "Section 1256"],
    },
  ]

  const taxPlanningTools = [
    {
      title: "Tax Loss Harvesting Calculator",
      description: "Optimize your tax liability with strategic loss harvesting",
      type: "Calculator",
    },
    {
      title: "Country Tax Rate Comparison",
      description: "Compare crypto tax rates across different countries",
      type: "Comparison Tool",
    },
    {
      title: "Year-End Tax Planning Checklist",
      description: "Essential checklist for crypto tax preparation",
      type: "Checklist",
    },
    {
      title: "Audit Preparation Guide",
      description: "Prepare for potential tax audits with proper documentation",
      type: "Guide",
    },
  ]

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative w-full py-12 md:py-24 lg:py-32 bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
          <div className="container px-4 md:px-6">
            <div className="text-center space-y-6">
              <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                <BookOpen className="w-4 h-4 mr-2" />
                Educational Resources
              </Badge>
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl text-gray-900 dark:text-white">
                Crypto Tax Education Hub
              </h1>
              <p className="max-w-[800px] mx-auto text-gray-600 md:text-xl dark:text-gray-300">
                Master crypto taxation with our comprehensive guides, country-specific resources, and expert insights
              </p>
            </div>
          </div>
        </section>

        {/* Featured Guides */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-white dark:bg-gray-900">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-gray-900 dark:text-white mb-4">
                Featured Tax Guides
              </h2>
              <p className="max-w-[600px] mx-auto text-gray-600 md:text-xl dark:text-gray-300">
                Essential reading for crypto tax compliance and optimization
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredGuides.map((guide, index) => (
                <Card
                  key={index}
                  className="overflow-hidden hover:shadow-xl transition-shadow duration-300 group cursor-pointer"
                >
                  <div className="relative">
                    <Image
                      src={guide.image || "/placeholder.svg"}
                      alt={guide.title}
                      width={300}
                      height={200}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <Badge className="absolute top-3 right-3 bg-blue-500 text-white">Featured</Badge>
                  </div>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <Badge variant="secondary" className="text-xs">
                        {guide.difficulty}
                      </Badge>
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <Clock className="h-3 w-3 mr-1" />
                        {guide.readTime}
                      </div>
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <Users className="h-3 w-3 mr-1" />
                        {guide.views}
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {guide.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">{guide.description}</p>
                    <div className="flex items-center text-blue-600 dark:text-blue-400 text-sm font-medium">
                      Read Guide
                      <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Country-Specific Guides */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-50 dark:bg-gray-800">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-gray-900 dark:text-white mb-4">
                Country-Specific Tax Guides
              </h2>
              <p className="max-w-[600px] mx-auto text-gray-600 md:text-xl dark:text-gray-300">
                Detailed tax guidance tailored to your country's regulations
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {countryGuides.map((guide, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow duration-300 cursor-pointer group">
                  <CardHeader className="text-center pb-4">
                    <div className="text-4xl mb-2">{guide.flag}</div>
                    <CardTitle className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {guide.title}
                    </CardTitle>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{guide.description}</p>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {guide.guides.map((item, idx) => (
                        <li key={idx} className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                          <ArrowRight className="h-3 w-3 mr-2 text-blue-500" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Advanced Topics */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-white dark:bg-gray-900">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-gray-900 dark:text-white mb-4">
                Advanced Tax Topics
              </h2>
              <p className="max-w-[600px] mx-auto text-gray-600 md:text-xl dark:text-gray-300">
                Deep dive into complex crypto tax scenarios and strategies
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {advancedTopics.map((topic, index) => (
                <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <CardHeader>
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
                        <topic.icon className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">{topic.title}</CardTitle>
                        <p className="text-gray-600 dark:text-gray-300 text-sm">{topic.description}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-2">
                      {topic.topics.map((item, idx) => (
                        <Badge key={idx} variant="secondary" className="justify-center">
                          {item}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Interactive Tools */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-50 dark:bg-gray-800">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-gray-900 dark:text-white mb-4">
                Tax Planning Tools
              </h2>
              <p className="max-w-[600px] mx-auto text-gray-600 md:text-xl dark:text-gray-300">
                Interactive tools and resources to optimize your crypto tax strategy
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {taxPlanningTools.map((tool, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow duration-300 cursor-pointer group">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                          {tool.title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 text-sm">{tool.description}</p>
                      </div>
                      <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                        {tool.type}
                      </Badge>
                    </div>
                    <div className="flex items-center text-purple-600 dark:text-purple-400 text-sm font-medium">
                      <Download className="h-4 w-4 mr-2" />
                      Access Tool
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-r from-green-600 to-blue-600 text-white">
          <div className="container px-4 md:px-6 text-center">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Ready to File Your Crypto Taxes?
              </h2>
              <p className="max-w-[600px] mx-auto text-green-100 md:text-xl">
                Put your knowledge into practice with KoinFile's automated crypto tax platform
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                <Button asChild size="lg" className="bg-white text-green-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold">
                  <Link href="/pricing">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-green-600 px-8 py-4 text-lg bg-transparent"
                >
                  <Link href="/accounting">
                  Contact Tax Expert
                  </Link>
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
