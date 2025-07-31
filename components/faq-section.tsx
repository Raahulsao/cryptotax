"use client"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

const faqs = [
  {
    question: "How does KoinFile calculate my crypto taxes?",
    answer:
      "KoinFile uses advanced algorithms to track your transactions across multiple exchanges and wallets, calculating gains/losses using FIFO, LIFO, or specific identification methods as per your country's tax regulations.",
  },
  {
    question: "Is my data secure with KoinFile?",
    answer:
      "Yes, we use bank-grade encryption and security measures. Your data is encrypted both in transit and at rest. We never store your private keys or have access to your funds.",
  },
  {
    question: "Which exchanges and wallets are supported?",
    answer:
      "We support over 800+ exchanges and wallets including Binance, Coinbase, Kraken, MetaMask, Ledger, and many more. You can also import data via CSV files.",
  },
  {
    question: "Can I use KoinFile for multiple countries?",
    answer:
      "Yes, KoinFile supports tax calculations for multiple countries including the US, UK, Canada, Australia, Germany, and many others with country-specific tax rules.",
  },
  {
    question: "What if I have NFT transactions?",
    answer:
      "KoinFile fully supports NFT transactions including purchases, sales, minting, and transfers. We track the cost basis and calculate gains/losses for all NFT activities.",
  },
  {
    question: "Do you offer customer support?",
    answer:
      "Yes, we provide 24/7 customer support via chat, email, and phone. Our tax experts are available to help you with any questions about your crypto tax calculations.",
  },
]

export function FAQSection() {
  return (
    <section className="w-full py-16 md:py-24 lg:py-32 bg-gray-50 dark:bg-gray-900">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl mb-6 text-gray-900 dark:text-white">
            Frequently Asked Questions
          </h2>
          <p className="max-w-[900px] mx-auto text-gray-600 md:text-xl lg:text-2xl dark:text-gray-300">
            Get answers to the most common questions about crypto tax filing with KoinFile
          </p>
        </div>
        <div className="max-w-5xl mx-auto">
          <Accordion type="single" collapsible className="w-full space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 px-6 py-2 shadow-sm">
                <AccordionTrigger className="text-left text-lg font-semibold text-gray-900 dark:text-white hover:no-underline py-6">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 dark:text-gray-300 text-base leading-relaxed pb-6">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  )
}
