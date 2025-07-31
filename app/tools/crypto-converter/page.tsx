"use client"

import { Header } from "../../../components/header"
import { Footer } from "../../../components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ArrowUpDown, RefreshCw, ArrowRight, Coins } from "lucide-react"
import { useState, useEffect } from "react"
import Link from "next/link"

export default function CryptoConverterPage() {
  const [fromCurrency, setFromCurrency] = useState("bitcoin")
  const [toCurrency, setToCurrency] = useState("inr")
  const [amount, setAmount] = useState("1")
  const [convertedAmount, setConvertedAmount] = useState("0")
  const [exchangeRate, setExchangeRate] = useState(0)
  const [loading, setLoading] = useState(false)

  const cryptocurrencies = [
    { value: "bitcoin", label: "Bitcoin (BTC)", symbol: "₿" },
    { value: "ethereum", label: "Ethereum (ETH)", symbol: "Ξ" },
    { value: "binancecoin", label: "BNB (BNB)", symbol: "BNB" },
    { value: "cardano", label: "Cardano (ADA)", symbol: "ADA" },
    { value: "solana", label: "Solana (SOL)", symbol: "SOL" },
    { value: "polkadot", label: "Polkadot (DOT)", symbol: "DOT" },
    { value: "chainlink", label: "Chainlink (LINK)", symbol: "LINK" },
    { value: "litecoin", label: "Litecoin (LTC)", symbol: "Ł" },
    { value: "ripple", label: "XRP (XRP)", symbol: "XRP" },
    { value: "dogecoin", label: "Dogecoin (DOGE)", symbol: "DOGE" },
    { value: "avalanche-2", label: "Avalanche (AVAX)", symbol: "AVAX" },
    { value: "polygon", label: "Polygon (MATIC)", symbol: "MATIC" },
    { value: "uniswap", label: "Uniswap (UNI)", symbol: "UNI" },
    { value: "cosmos", label: "Cosmos (ATOM)", symbol: "ATOM" },
    { value: "algorand", label: "Algorand (ALGO)", symbol: "ALGO" },
    { value: "stellar", label: "Stellar (XLM)", symbol: "XLM" },
    { value: "vechain", label: "VeChain (VET)", symbol: "VET" },
    { value: "filecoin", label: "Filecoin (FIL)", symbol: "FIL" },
    { value: "tron", label: "TRON (TRX)", symbol: "TRX" },
    { value: "monero", label: "Monero (XMR)", symbol: "XMR" },
    { value: "eos", label: "EOS (EOS)", symbol: "EOS" },
    { value: "aave", label: "Aave (AAVE)", symbol: "AAVE" },
    { value: "maker", label: "Maker (MKR)", symbol: "MKR" },
    { value: "compound-governance-token", label: "Compound (COMP)", symbol: "COMP" },
    { value: "sushi", label: "SushiSwap (SUSHI)", symbol: "SUSHI" },
  ]

  const fiatCurrencies = [
    { value: "inr", label: "Indian Rupee (INR)", symbol: "₹" },
    { value: "usd", label: "US Dollar (USD)", symbol: "$" },
    { value: "eur", label: "Euro (EUR)", symbol: "€" },
    { value: "gbp", label: "British Pound (GBP)", symbol: "£" },
    { value: "jpy", label: "Japanese Yen (JPY)", symbol: "¥" },
    { value: "cad", label: "Canadian Dollar (CAD)", symbol: "C$" },
    { value: "aud", label: "Australian Dollar (AUD)", symbol: "A$" },
    { value: "cny", label: "Chinese Yuan (CNY)", symbol: "¥" },
    { value: "krw", label: "South Korean Won (KRW)", symbol: "₩" },
    { value: "sgd", label: "Singapore Dollar (SGD)", symbol: "S$" },
    { value: "hkd", label: "Hong Kong Dollar (HKD)", symbol: "HK$" },
    { value: "chf", label: "Swiss Franc (CHF)", symbol: "CHF" },
    { value: "sek", label: "Swedish Krona (SEK)", symbol: "kr" },
    { value: "nok", label: "Norwegian Krone (NOK)", symbol: "kr" },
    { value: "dkk", label: "Danish Krone (DKK)", symbol: "kr" },
    { value: "nzd", label: "New Zealand Dollar (NZD)", symbol: "NZ$" },
    { value: "mxn", label: "Mexican Peso (MXN)", symbol: "$" },
    { value: "brl", label: "Brazilian Real (BRL)", symbol: "R$" },
    { value: "rub", label: "Russian Ruble (RUB)", symbol: "₽" },
    { value: "zar", label: "South African Rand (ZAR)", symbol: "R" },
  ]

  const allCurrencies = [...cryptocurrencies, ...fiatCurrencies]

  const convertCurrency = async () => {
    setLoading(true)
    // Simulate API call with mock data
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Mock exchange rates (in a real app, you'd fetch from an API)
    const mockRates: { [key: string]: number } = {
      "bitcoin-usd": 45000,
      "bitcoin-inr": 3750000,
      "ethereum-usd": 2800,
      "ethereum-inr": 233000,
      "binancecoin-usd": 320,
      "binancecoin-inr": 26600,
      "cardano-usd": 0.45,
      "cardano-inr": 37.5,
      "solana-usd": 95,
      "solana-inr": 7900,
      "usd-bitcoin": 1 / 45000,
      "usd-ethereum": 1 / 2800,
      "inr-bitcoin": 1 / 3750000,
      "inr-ethereum": 1 / 233000,
      "usd-inr": 83.25,
      "inr-usd": 1 / 83.25,
      "eur-inr": 90.5,
      "inr-eur": 1 / 90.5,
      "gbp-inr": 105.2,
      "inr-gbp": 1 / 105.2,
    }

    const rateKey = `${fromCurrency}-${toCurrency}`
    const rate = mockRates[rateKey] || 1
    const result = Number.parseFloat(amount) * rate

    setExchangeRate(rate)
    setConvertedAmount(result.toFixed(8))
    setLoading(false)
  }

  const swapCurrencies = () => {
    setFromCurrency(toCurrency)
    setToCurrency(fromCurrency)
    setAmount(convertedAmount)
    setConvertedAmount(amount)
  }

  useEffect(() => {
    if (amount && fromCurrency && toCurrency) {
      convertCurrency()
    }
  }, [amount, fromCurrency, toCurrency])

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative w-full py-12 md:py-24 lg:py-32 bg-gradient-to-br from-blue-50 to-green-50 dark:from-gray-900 dark:to-gray-800">
          <div className="container px-4 md:px-6">
            <div className="text-center space-y-6">
              <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                <Coins className="w-4 h-4 mr-2" />
                Free Tool
              </Badge>
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl text-gray-900 dark:text-white">
                Crypto Currency Converter
              </h1>
              <p className="max-w-[800px] mx-auto text-gray-600 md:text-xl dark:text-gray-300">
                Convert between cryptocurrencies and fiat currencies with real-time exchange rates including INR (Indian
                Rupee)
              </p>
            </div>
          </div>
        </section>

        {/* Converter Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-white dark:bg-gray-900">
          <div className="container px-4 md:px-6">
            <div className="max-w-4xl mx-auto">
              <Card className="shadow-2xl border-0">
                <CardHeader className="text-center">
                  <CardTitle className="text-3xl font-bold text-gray-900 dark:text-white flex items-center justify-center">
                    <ArrowUpDown className="h-8 w-8 mr-3 text-blue-600" />
                    Currency Converter
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-end">
                    {/* From Currency */}
                    <div className="space-y-4">
                      <Label htmlFor="fromAmount" className="text-lg font-semibold">
                        From
                      </Label>
                      <Input
                        id="fromAmount"
                        type="number"
                        placeholder="1.00"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="text-2xl py-4 text-center"
                      />
                      <Select value={fromCurrency} onValueChange={setFromCurrency}>
                        <SelectTrigger className="py-3">
                          <SelectValue placeholder="Select currency" />
                        </SelectTrigger>
                        <SelectContent>
                          {allCurrencies.map((currency) => (
                            <SelectItem key={currency.value} value={currency.value}>
                              {currency.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Swap Button */}
                    <div className="flex justify-center">
                      <Button
                        onClick={swapCurrencies}
                        variant="outline"
                        size="icon"
                        className="h-12 w-12 rounded-full border-2 hover:bg-blue-50 dark:hover:bg-blue-900 bg-transparent"
                      >
                        <ArrowUpDown className="h-6 w-6" />
                      </Button>
                    </div>

                    {/* To Currency */}
                    <div className="space-y-4">
                      <Label htmlFor="toAmount" className="text-lg font-semibold">
                        To
                      </Label>
                      <div className="relative">
                        <Input
                          id="toAmount"
                          type="text"
                          value={loading ? "Converting..." : convertedAmount}
                          readOnly
                          className="text-2xl py-4 text-center bg-gray-50 dark:bg-gray-800"
                        />
                        {loading && (
                          <RefreshCw className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 animate-spin text-blue-600" />
                        )}
                      </div>
                      <Select value={toCurrency} onValueChange={setToCurrency}>
                        <SelectTrigger className="py-3">
                          <SelectValue placeholder="Select currency" />
                        </SelectTrigger>
                        <SelectContent>
                          {allCurrencies.map((currency) => (
                            <SelectItem key={currency.value} value={currency.value}>
                              {currency.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Exchange Rate Display */}
                  {exchangeRate > 0 && (
                    <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                      <div className="text-center">
                        <p className="text-sm text-blue-800 dark:text-blue-200 mb-2">Current Exchange Rate</p>
                        <p className="text-lg font-semibold text-blue-900 dark:text-blue-100">
                          1 {fromCurrency.toUpperCase()} = {exchangeRate.toLocaleString()} {toCurrency.toUpperCase()}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="mt-8 text-center">
                    <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg">
                      <Link href="/pricing">
                        Track All Your Conversions
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Popular Conversions */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-50 dark:bg-gray-800">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-gray-900 dark:text-white mb-4">
                Popular Conversions
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { from: "BTC", to: "INR", rate: "₹37,50,000" },
                { from: "ETH", to: "INR", rate: "₹2,33,000" },
                { from: "BTC", to: "USD", rate: "$45,000" },
                { from: "ETH", to: "USD", rate: "$2,800" },
              ].map((conversion, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="p-6 text-center">
                    <div className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                      {conversion.from} → {conversion.to}
                    </div>
                    <div className="text-xl text-blue-600 font-semibold">{conversion.rate}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
