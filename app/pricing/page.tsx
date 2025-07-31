import { Header } from "../../components/header"
import { Footer } from "../../components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Check, X, Star, Zap, Shield, Crown, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function PricingPage() {
  const plans = [
    {
      name: "Free",
      price: "$0",
      period: "forever",
      description: "Perfect for getting started with crypto taxes",
      features: [
        "Up to 100 transactions",
        "Basic tax report (PDF only)",
        "1 exchange connection",
        "Email support",
        "Basic portfolio tracking",
      ],
      limitations: ["Limited transaction history", "No advanced features", "Standard support only"],
      cta: "Get Started Free",
      popular: false,
      icon: Zap,
      color: "border-gray-200",
    },
    {
      name: "Personal",
      price: "$49",
      period: "per year",
      description: "Ideal for individual crypto investors",
      features: [
        "Unlimited transactions",
        "All report formats (PDF, CSV, TurboTax)",
        "All exchange integrations",
        "Priority email support",
        "Portfolio tracking & analytics",
        "Tax loss harvesting",
        "Previous year data access",
      ],
      limitations: [],
      cta: "Choose Personal",
      popular: true,
      icon: Star,
      color: "border-purple-500",
    },
    {
      name: "Pro",
      price: "$149",
      period: "per year",
      description: "Advanced features for serious traders",
      features: [
        "Everything in Personal",
        "Advanced tax optimization",
        "Phone support",
        "Priority processing",
        "Custom transaction categories",
        "DeFi & NFT support",
        "API access",
        "Audit support",
      ],
      limitations: [],
      cta: "Choose Pro",
      popular: false,
      icon: Crown,
      color: "border-blue-500",
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "pricing",
      description: "Tailored solutions for businesses",
      features: [
        "Multi-entity management",
        "White-label solutions",
        "Dedicated account manager",
        "Custom integrations",
        "SLA guarantees",
        "Advanced reporting",
        "Team collaboration tools",
        "Priority support",
      ],
      limitations: [],
      cta: "Contact Sales",
      popular: false,
      icon: Shield,
      color: "border-green-500",
    },
  ]

  const featureComparison = [
    {
      category: "Transaction Limits",
      free: "100 transactions",
      personal: "Unlimited",
      pro: "Unlimited",
      enterprise: "Unlimited",
    },
    {
      category: "Report Formats",
      free: "PDF only",
      personal: "PDF, CSV, TurboTax",
      pro: "PDF, CSV, TurboTax, Custom",
      enterprise: "All formats + Custom",
    },
    {
      category: "Exchange Integrations",
      free: "1 exchange",
      personal: "All exchanges",
      pro: "All exchanges",
      enterprise: "All exchanges + Custom",
    },
    {
      category: "Support Level",
      free: "Email",
      personal: "Priority Email",
      pro: "Email + Phone",
      enterprise: "Dedicated Manager",
    },
    {
      category: "DeFi Support",
      free: false,
      personal: "Basic",
      pro: "Advanced",
      enterprise: "Full + Custom",
    },
    {
      category: "API Access",
      free: false,
      personal: false,
      pro: "Standard",
      enterprise: "Full + Custom",
    },
    {
      category: "Team Features",
      free: false,
      personal: false,
      pro: false,
      enterprise: "Full Suite",
    },
  ]

  const faqs = [
    {
      question: "Can I upgrade or downgrade my plan at any time?",
      answer:
        "Yes, you can upgrade or downgrade your plan at any time. When you upgrade, you'll be charged the prorated difference immediately. When you downgrade, the change will take effect at your next billing cycle.",
    },
    {
      question: "What happens if I exceed my transaction limit?",
      answer:
        "If you're on the Free plan and exceed 100 transactions, you'll need to upgrade to continue using the service. Paid plans have unlimited transactions, so you won't face any limits.",
    },
    {
      question: "Do you offer refunds?",
      answer:
        "We offer a 30-day money-back guarantee for all paid plans. If you're not satisfied with our service, contact us within 30 days of your purchase for a full refund.",
    },
    {
      question: "What payment methods do you accept?",
      answer:
        "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and bank transfers for Enterprise customers. All payments are processed securely through Stripe.",
    },
    {
      question: "Is there a discount for multiple years?",
      answer:
        "Yes, we offer a 20% discount when you pay for 2 years upfront, and a 30% discount for 3 years. Contact our sales team for custom pricing on longer terms.",
    },
    {
      question: "Can I get a custom plan for my specific needs?",
      answer:
        "Our Enterprise plan is fully customizable. Contact our sales team to discuss your specific requirements and get a tailored solution.",
    },
  ]

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative w-full py-12 md:py-24 lg:py-32 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
          <div className="container px-4 md:px-6">
            <div className="text-center space-y-6">
              <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                <Star className="w-4 h-4 mr-2" />
                Simple, Transparent Pricing
              </Badge>
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl text-gray-900 dark:text-white">
                Choose Your Perfect Plan
              </h1>
              <p className="max-w-[800px] mx-auto text-gray-600 md:text-xl dark:text-gray-300">
                Start free and scale as you grow. No hidden fees, no surprises.
              </p>
            </div>
          </div>
        </section>

        {/* Pricing Cards */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-white dark:bg-gray-900">
          <div className="container px-4 md:px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {plans.map((plan, index) => (
                <Card
                  key={index}
                  className={`relative ${plan.color} ${
                    plan.popular ? "ring-2 ring-purple-500 scale-105" : ""
                  } hover:shadow-xl transition-all duration-300`}
                >
                  {plan.popular && (
                    <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-purple-500 text-white">
                      Most Popular
                    </Badge>
                  )}
                  <CardHeader className="text-center pb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <plan.icon className="h-6 w-6 text-white" />
                    </div>
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
                          <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-600 dark:text-gray-300 text-sm">{feature}</span>
                        </li>
                      ))}
                      {plan.limitations.map((limitation, idx) => (
                        <li key={idx} className="flex items-start space-x-3">
                          <X className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-500 dark:text-gray-400 text-sm">{limitation}</span>
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

        {/* Feature Comparison Table */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-50 dark:bg-gray-800">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-gray-900 dark:text-white mb-4">
                Feature Comparison
              </h2>
              <p className="max-w-[600px] mx-auto text-gray-600 md:text-xl dark:text-gray-300">
                Compare features across all plans to find the perfect fit
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full bg-white dark:bg-gray-900 rounded-lg shadow-lg">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left p-4 font-semibold text-gray-900 dark:text-white">Feature</th>
                    <th className="text-center p-4 font-semibold text-gray-900 dark:text-white">Free</th>
                    <th className="text-center p-4 font-semibold text-purple-600 dark:text-purple-400">Personal</th>
                    <th className="text-center p-4 font-semibold text-blue-600 dark:text-blue-400">Pro</th>
                    <th className="text-center p-4 font-semibold text-green-600 dark:text-green-400">Enterprise</th>
                  </tr>
                </thead>
                <tbody>
                  {featureComparison.map((feature, index) => (
                    <tr key={index} className="border-b border-gray-100 dark:border-gray-800">
                      <td className="p-4 font-medium text-gray-900 dark:text-white">{feature.category}</td>
                      <td className="p-4 text-center text-gray-600 dark:text-gray-300">
                        {typeof feature.free === "boolean" ? (
                          feature.free ? (
                            <Check className="h-5 w-5 text-green-500 mx-auto" />
                          ) : (
                            <X className="h-5 w-5 text-red-500 mx-auto" />
                          )
                        ) : (
                          feature.free
                        )}
                      </td>
                      <td className="p-4 text-center text-gray-600 dark:text-gray-300">
                        {typeof feature.personal === "boolean" ? (
                          feature.personal ? (
                            <Check className="h-5 w-5 text-green-500 mx-auto" />
                          ) : (
                            <X className="h-5 w-5 text-red-500 mx-auto" />
                          )
                        ) : (
                          feature.personal
                        )}
                      </td>
                      <td className="p-4 text-center text-gray-600 dark:text-gray-300">
                        {typeof feature.pro === "boolean" ? (
                          feature.pro ? (
                            <Check className="h-5 w-5 text-green-500 mx-auto" />
                          ) : (
                            <X className="h-5 w-5 text-red-500 mx-auto" />
                          )
                        ) : (
                          feature.pro
                        )}
                      </td>
                      <td className="p-4 text-center text-gray-600 dark:text-gray-300">
                        {typeof feature.enterprise === "boolean" ? (
                          feature.enterprise ? (
                            <Check className="h-5 w-5 text-green-500 mx-auto" />
                          ) : (
                            <X className="h-5 w-5 text-red-500 mx-auto" />
                          )
                        ) : (
                          feature.enterprise
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-white dark:bg-gray-900">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-gray-900 dark:text-white mb-4">
                Frequently Asked Questions
              </h2>
              <p className="max-w-[600px] mx-auto text-gray-600 md:text-xl dark:text-gray-300">
                Common questions about our pricing and plans
              </p>
            </div>
            <div className="max-w-3xl mx-auto">
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left text-gray-900 dark:text-white">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-600 dark:text-gray-300">{faq.answer}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
          <div className="container px-4 md:px-6 text-center">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Ready to Get Started?</h2>
              <p className="max-w-[600px] mx-auto text-purple-100 md:text-xl">
                Join thousands of crypto investors who trust KoinFile for accurate tax reporting
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                <Button asChild
                  size="lg"
                  className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold"
                >
                  <Link href="/features">
                  Start Free Trial
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
              <p className="text-sm text-purple-200 mt-4">No credit card required • 30-day money-back guarantee</p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
