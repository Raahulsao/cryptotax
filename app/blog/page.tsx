"use client"

import type React from "react"

import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Calendar, User, ArrowRight, TrendingUp, FileText, Shield, Zap } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

const featuredArticles = [
  {
    id: 1,
    title: "Complete Guide to Crypto Tax Reporting in 2024",
    excerpt:
      "Everything you need to know about reporting cryptocurrency transactions for the 2024 tax year, including new regulations and best practices.",
    author: "Sarah Johnson",
    date: "March 15, 2024",
    category: "Tax Guide",
    readTime: "12 min read",
    image: "/placeholder.svg?height=400&width=600",
    featured: true,
  },
  {
    id: 2,
    title: "DeFi Tax Implications: What You Need to Know",
    excerpt:
      "Understanding the tax implications of decentralized finance activities including yield farming, liquidity mining, and staking rewards.",
    author: "Michael Chen",
    date: "March 12, 2024",
    category: "DeFi",
    readTime: "8 min read",
    image: "/placeholder.svg?height=300&width=400",
    featured: true,
  },
  {
    id: 3,
    title: "NFT Taxation: A Comprehensive Overview",
    excerpt:
      "Learn how NFT transactions are taxed, including minting, buying, selling, and trading non-fungible tokens.",
    author: "Emily Rodriguez",
    date: "March 10, 2024",
    category: "NFT",
    readTime: "10 min read",
    image: "/placeholder.svg?height=300&width=400",
    featured: true,
  },
]

const recentArticles = [
  {
    id: 4,
    title: "Tax Loss Harvesting Strategies for Crypto Investors",
    excerpt: "Maximize your tax efficiency with these proven loss harvesting techniques for cryptocurrency portfolios.",
    author: "David Kim",
    date: "March 8, 2024",
    category: "Strategy",
    readTime: "6 min read",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 5,
    title: "Understanding Crypto Mining Tax Obligations",
    excerpt: "A detailed look at how cryptocurrency mining income is taxed and what records you need to keep.",
    author: "Lisa Wang",
    date: "March 5, 2024",
    category: "Mining",
    readTime: "7 min read",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 6,
    title: "International Crypto Tax Compliance",
    excerpt: "Navigate the complex world of international cryptocurrency taxation and reporting requirements.",
    author: "Alex Thompson",
    date: "March 3, 2024",
    category: "International",
    readTime: "9 min read",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 7,
    title: "Crypto Tax Software: Features to Look For",
    excerpt: "Essential features and capabilities to consider when choosing cryptocurrency tax preparation software.",
    author: "Jennifer Lee",
    date: "February 28, 2024",
    category: "Software",
    readTime: "5 min read",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 8,
    title: "Common Crypto Tax Mistakes to Avoid",
    excerpt: "Learn about the most common cryptocurrency tax mistakes and how to avoid them in your filing.",
    author: "Robert Brown",
    date: "February 25, 2024",
    category: "Tips",
    readTime: "8 min read",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 9,
    title: "Staking Rewards and Tax Implications",
    excerpt: "Understanding how staking rewards are taxed and the best practices for record keeping.",
    author: "Maria Garcia",
    date: "February 22, 2024",
    category: "Staking",
    readTime: "6 min read",
    image: "/placeholder.svg?height=200&width=300",
  },
]

const categories = [
  { name: "All", count: 45 },
  { name: "Tax Guide", count: 12 },
  { name: "DeFi", count: 8 },
  { name: "NFT", count: 6 },
  { name: "Strategy", count: 7 },
  { name: "Mining", count: 4 },
  { name: "International", count: 5 },
  { name: "Software", count: 3 },
]

export default function BlogPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [email, setEmail] = useState("")

  const handleNewsletterSignup = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle newsletter signup
    console.log("Newsletter signup:", email)
    setEmail("")
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">Crypto Tax Blog</h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
              Stay updated with the latest crypto tax news, guides, and insights from our team of experts
            </p>

            {/* Search Bar */}
            <div className="max-w-md mx-auto relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 py-3 text-lg"
              />
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Featured Articles */}
            <section className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Featured Articles</h2>

              {/* Main Featured Article */}
              <Card className="mb-8 overflow-hidden shadow-xl hover:shadow-2xl transition-shadow duration-300">
                <div className="md:flex">
                  <div className="md:w-1/2">
                    <Image
                      src={featuredArticles[0].image || "/placeholder.svg"}
                      alt={featuredArticles[0].title}
                      width={600}
                      height={400}
                      className="w-full h-64 md:h-full object-cover"
                    />
                  </div>
                  <div className="md:w-1/2 p-8">
                    <Badge className="mb-4">{featuredArticles[0].category}</Badge>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                      {featuredArticles[0].title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">{featuredArticles[0].excerpt}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center">
                          <User className="w-4 h-4 mr-1" />
                          {featuredArticles[0].author}
                        </div>
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {featuredArticles[0].date}
                        </div>
                        <span>{featuredArticles[0].readTime}</span>
                      </div>
                      <Button variant="ghost" className="text-purple-600 hover:text-purple-700">
                        Read More <ArrowRight className="ml-2 w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Secondary Featured Articles */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {featuredArticles.slice(1).map((article) => (
                  <Card
                    key={article.id}
                    className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
                  >
                    <Image
                      src={article.image || "/placeholder.svg"}
                      alt={article.title}
                      width={400}
                      height={300}
                      className="w-full h-48 object-cover"
                    />
                    <CardContent className="p-6">
                      <Badge className="mb-3">{article.category}</Badge>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{article.title}</h3>
                      <p className="text-gray-600 dark:text-gray-300 mb-4">{article.excerpt}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                          <span>{article.author}</span>
                          <span>•</span>
                          <span>{article.date}</span>
                        </div>
                        <Button variant="ghost" size="sm" className="text-purple-600 hover:text-purple-700">
                          Read More
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            {/* Recent Articles */}
            <section>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Recent Articles</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recentArticles.map((article) => (
                  <Card
                    key={article.id}
                    className="overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                  >
                    <Image
                      src={article.image || "/placeholder.svg"}
                      alt={article.title}
                      width={300}
                      height={200}
                      className="w-full h-40 object-cover"
                    />
                    <CardContent className="p-4">
                      <Badge variant="outline" className="mb-2 text-xs">
                        {article.category}
                      </Badge>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">
                        {article.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 line-clamp-2">{article.excerpt}</p>
                      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                        <span>{article.author}</span>
                        <span>{article.readTime}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-8">
              {/* Categories */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">Categories</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <button
                        key={category.name}
                        onClick={() => setSelectedCategory(category.name)}
                        className={`w-full flex items-center justify-between p-2 rounded-lg text-left transition-colors ${
                          selectedCategory === category.name
                            ? "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300"
                            : "hover:bg-gray-100 dark:hover:bg-gray-700"
                        }`}
                      >
                        <span>{category.name}</span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">({category.count})</span>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Newsletter Signup */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">Stay Updated</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    Get the latest crypto tax insights delivered to your inbox.
                  </p>
                  <form onSubmit={handleNewsletterSignup} className="space-y-3">
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                    <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700">
                      Subscribe
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Popular Tags */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">Popular Tags</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {["Tax Planning", "DeFi", "NFTs", "Mining", "Staking", "Trading", "Compliance", "IRS"].map(
                      (tag) => (
                        <Badge
                          key={tag}
                          variant="outline"
                          className="cursor-pointer hover:bg-purple-100 dark:hover:bg-purple-900"
                        >
                          {tag}
                        </Badge>
                      ),
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Links */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">Quick Links</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Link
                      href="/tools/tax-calculator"
                      className="flex items-center text-purple-600 hover:text-purple-700"
                    >
                      <TrendingUp className="w-4 h-4 mr-2" />
                      Tax Calculator
                    </Link>
                    <Link href="/guides" className="flex items-center text-purple-600 hover:text-purple-700">
                      <FileText className="w-4 h-4 mr-2" />
                      Tax Guides
                    </Link>
                    <Link href="/features" className="flex items-center text-purple-600 hover:text-purple-700">
                      <Shield className="w-4 h-4 mr-2" />
                      Features
                    </Link>
                    <Link href="/pricing" className="flex items-center text-purple-600 hover:text-purple-700">
                      <Zap className="w-4 h-4 mr-2" />
                      Pricing
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
