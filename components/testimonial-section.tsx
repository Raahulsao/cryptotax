"use client"

import { useEffect, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Star, ArrowRight } from "lucide-react"
import Image from "next/image"

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Crypto Investor",
    image: "/placeholder.svg?height=60&width=60",
    rating: 5,
    content:
      "KoinFile made my crypto tax filing so much easier. The automated calculations saved me hours of work and the reports were perfectly formatted for my accountant.",
  },
  {
    name: "Michael Chen",
    role: "DeFi Trader",
    image: "/placeholder.svg?height=60&width=60",
    rating: 5,
    content:
      "As someone who trades across multiple DeFi protocols, tracking everything was a nightmare. KoinFile handles all the complexity and gives me accurate tax reports.",
  },
  {
    name: "Emily Rodriguez",
    role: "NFT Collector",
    image: "/placeholder.svg?height=60&width=60",
    rating: 5,
    content:
      "The NFT support is fantastic. KoinFile tracks all my NFT purchases, sales, and even airdrops. It's the only platform that handles NFTs properly for taxes.",
  },
  {
    name: "David Kim",
    role: "Enterprise CFO",
    image: "/placeholder.svg?height=60&width=60",
    rating: 5,
    content:
      "Our company needed enterprise-grade crypto tax reporting. KoinFile's enterprise solution handles our complex transactions with perfect accuracy and compliance.",
  },
]

export function TestimonialSection() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-white dark:bg-gray-900">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl mb-6 text-gray-900 dark:text-white">
            What Our Users Say
          </h2>
          <p className="max-w-[900px] mx-auto text-gray-600 md:text-xl lg:text-2xl dark:text-gray-300">
            Join thousands of satisfied users who trust KoinFile for their crypto tax needs
          </p>
        </div>
        
        {/* Scrolling Testimonials */}
        <div className="relative overflow-hidden">
          <div className="flex animate-scroll space-x-6">
            {[...testimonials, ...testimonials].map((testimonial, index) => (
              <Card key={index} className="flex-shrink-0 w-80 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-8">
                  <div className="flex items-center mb-6">
                    <Image
                      src={testimonial.image || "/placeholder.svg"}
                      alt={testimonial.name}
                      width={60}
                      height={60}
                      className="rounded-full mr-4"
                    />
                    <div>
                      <h4 className="font-semibold text-lg text-gray-900 dark:text-white">{testimonial.name}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{testimonial.role}</p>
                    </div>
                  </div>
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 text-base leading-relaxed">{testimonial.content}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        
        .animate-scroll {
          animation: scroll 30s linear infinite;
        }
        
        .animate-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  )
}
