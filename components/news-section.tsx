import { Card, CardContent, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

const newsItems = [
  {
    title: "New DeFi Protocol Integration: Uniswap V4 Support",
    excerpt:
      "KoinFile now supports Uniswap V4 transactions with advanced liquidity position tracking and automated yield calculations.",
    image: "/placeholder.svg?height=200&width=300",
    date: "2024-01-15",
    category: "Product Update",
    isNew: true,
  },
  {
    title: "2024 Crypto Tax Season: What You Need to Know",
    excerpt:
      "Complete guide to crypto tax filing for 2024, including new regulations and reporting requirements across different countries.",
    image: "/placeholder.svg?height=200&width=300",
    date: "2024-01-10",
    category: "Tax Guide",
    isNew: true,
  },
  {
    title: "Enterprise Dashboard 2.0 Launch",
    excerpt:
      "Introducing advanced analytics, multi-user access controls, and enhanced reporting features for enterprise customers.",
    image: "/placeholder.svg?height=200&width=300",
    date: "2024-01-05",
    category: "Product Update",
    isNew: false,
  },
  {
    title: "NFT Tax Calculations Made Simple",
    excerpt:
      "Learn how to properly calculate taxes on NFT transactions including royalties, creator fees, and marketplace transactions.",
    image: "/placeholder.svg?height=200&width=300",
    date: "2023-12-28",
    category: "Education",
    isNew: false,
  },
]

export function NewsSection() {
  return (
    <section className="w-full py-8 md:py-16 lg:py-24 bg-gray-50 dark:bg-gray-800">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-4 text-gray-900 dark:text-white">
            Latest News & Updates
          </h2>
          <p className="max-w-[800px] mx-auto text-gray-600 md:text-xl dark:text-gray-300">
            Stay updated with the latest features, guides, and crypto tax insights
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {newsItems.map((item, index) => (
            <Card
              key={index}
              className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow duration-300"
            >
              <div className="relative">
                <Image
                  src={item.image || "/placeholder.svg"}
                  alt={item.title}
                  width={300}
                  height={200}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                {item.isNew && <Badge className="absolute top-2 right-2 bg-red-500 text-white">NEW</Badge>}
              </div>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant="secondary" className="text-xs">
                    {item.category}
                  </Badge>
                  <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                    <Calendar className="h-3 w-3 mr-1" />
                    {new Date(item.date).toLocaleDateString()}
                  </div>
                </div>
                <CardTitle className="text-lg font-bold mb-2 text-gray-900 dark:text-white line-clamp-2">
                  {item.title}
                </CardTitle>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3">{item.excerpt}</p>
                <Link
                  href="/tax-guides"
                  className="text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 text-sm font-medium"
                >
                  Read More →
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
