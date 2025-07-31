"use client"

import { Header } from "../../../components/header"
import { Footer } from "../../../components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Calculator, TrendingUp, DollarSign, Percent, Info, ArrowRight } from "lucide-react"
import { useState } from "react"
import Link from "next/link"

export default function TaxCalculatorPage() {
  const [formData, setFormData] = useState({
    purchasePrice: "",
    salePrice: "",
    purchaseDate: "",
    saleDate: "",
    taxMethod: "fifo",
    country: "us",
  })

  const [results, setResults] = useState({
    capitalGain: 0,
    taxOwed: 0,
    taxRate: 0,
    holdingPeriod: 0,
  })

  const calculateTax = () => {
    const purchase = Number.parseFloat(formData.purchasePrice) || 0
    const sale = Number.parseFloat(formData.salePrice) || 0
    const gain = sale - purchase

    const purchaseDate = new Date(formData.purchaseDate)
    const saleDate = new Date(formData.saleDate)
    const holdingDays = Math.floor((saleDate.getTime() - purchaseDate.getTime()) / (1000 * 60 * 60 * 24))

    // Tax calculation based on country
    let taxRate = 0
    if (formData.country === "us") {
      taxRate = holdingDays > 365 ? 0.15 : 0.22 // US rates
    } else if (formData.country === "uk") {
      taxRate = 0.2 // UK capital gains tax
    } else if (formData.country === "ca") {
      taxRate = 0.25 // Canada (50% inclusion rate at 50% marginal)
    } else if (formData.country === "au") {
      taxRate = holdingDays > 365 ? 0.23 : 0.32 // Australia with CGT discount
    } else if (formData.country === "in") {
      taxRate = holdingDays > 365 ? 0.2 : 0.3 // India LTCG vs STCG
    }

    const taxOwed = gain > 0 ? gain * taxRate : 0

    setResults({
      capitalGain: gain,
      taxOwed: taxOwed,
      taxRate: taxRate * 100,
      holdingPeriod: holdingDays,
    })
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative w-full py-12 md:py-24 lg:py-32 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
          <div className="container px-4 md:px-6">
            <div className="text-center space-y-6">
              <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                <Calculator className="w-4 h-4 mr-2" />
                Free Tool
              </Badge>
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl text-gray-900 dark:text-white">
                Crypto Tax Calculator
              </h1>
              <p className="max-w-[800px] mx-auto text-gray-600 md:text-xl dark:text-gray-300">
                Calculate your crypto capital gains and tax liability with our free, easy-to-use calculator
              </p>
            </div>
          </div>
        </section>

        {/* Calculator Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-white dark:bg-gray-900">
          <div className="container px-4 md:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Calculator Form */}
              <Card className="shadow-xl border-0">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
                    <Calculator className="h-6 w-6 mr-2 text-purple-600" />
                    Calculate Your Crypto Taxes
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="purchasePrice">Purchase Price ($)</Label>
                      <Input
                        id="purchasePrice"
                        type="number"
                        placeholder="10,000"
                        value={formData.purchasePrice}
                        onChange={(e) => setFormData({ ...formData, purchasePrice: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="salePrice">Sale Price ($)</Label>
                      <Input
                        id="salePrice"
                        type="number"
                        placeholder="15,000"
                        value={formData.salePrice}
                        onChange={(e) => setFormData({ ...formData, salePrice: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="purchaseDate">Purchase Date</Label>
                      <Input
                        id="purchaseDate"
                        type="date"
                        value={formData.purchaseDate}
                        onChange={(e) => setFormData({ ...formData, purchaseDate: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="saleDate">Sale Date</Label>
                      <Input
                        id="saleDate"
                        type="date"
                        value={formData.saleDate}
                        onChange={(e) => setFormData({ ...formData, saleDate: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="taxMethod">Tax Method</Label>
                      <Select
                        value={formData.taxMethod}
                        onValueChange={(value) => setFormData({ ...formData, taxMethod: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select method" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="fifo">FIFO (First In, First Out)</SelectItem>
                          <SelectItem value="lifo">LIFO (Last In, First Out)</SelectItem>
                          <SelectItem value="specific">Specific Identification</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="country">Country</Label>
                      <Select
                        value={formData.country}
                        onValueChange={(value) => setFormData({ ...formData, country: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select country" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="us">United States</SelectItem>
                          <SelectItem value="uk">United Kingdom</SelectItem>
                          <SelectItem value="ca">Canada</SelectItem>
                          <SelectItem value="au">Australia</SelectItem>
                          <SelectItem value="in">India</SelectItem>
                          <SelectItem value="de">Germany</SelectItem>
                          <SelectItem value="fr">France</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Button
                    onClick={calculateTax}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 text-lg"
                  >
                    Calculate Tax
                  </Button>
                </CardContent>
              </Card>

              {/* Results */}
              <Card className="shadow-xl border-0">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
                    <TrendingUp className="h-6 w-6 mr-2 text-green-600" />
                    Tax Calculation Results
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 gap-4">
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 dark:text-gray-300">Capital Gain/Loss</span>
                        <span
                          className={`text-xl font-bold ${results.capitalGain >= 0 ? "text-green-600" : "text-red-600"}`}
                        >
                          ${results.capitalGain.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 dark:text-gray-300">Tax Owed</span>
                        <span className="text-xl font-bold text-orange-600">${results.taxOwed.toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 dark:text-gray-300">Tax Rate</span>
                        <span className="text-xl font-bold text-blue-600">{results.taxRate}%</span>
                      </div>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 dark:text-gray-300">Holding Period</span>
                        <span className="text-xl font-bold text-purple-600">{results.holdingPeriod} days</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                    <div className="flex items-start space-x-2">
                      <Info className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div>
                        <p className="text-sm text-blue-800 dark:text-blue-200">
                          <strong>Note:</strong> This is a simplified calculation for educational purposes. Actual tax
                          calculations may vary based on your specific situation and local tax laws.
                        </p>
                      </div>
                    </div>
                  </div>

                  <Button asChild className="w-full bg-green-600 hover:bg-green-700 text-white py-3 text-lg">
                    <Link href="/pricing">
                      Get Professional Tax Report
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-50 dark:bg-gray-800">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-gray-900 dark:text-white mb-4">
                Why Use Our Tax Calculator?
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="text-center">
                <CardContent className="p-6">
                  <DollarSign className="h-12 w-12 text-green-600 mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-2">Free to Use</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Calculate your crypto taxes without any cost or registration required
                  </p>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="p-6">
                  <Percent className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-2">Accurate Calculations</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Based on current tax laws and regulations for multiple countries including India
                  </p>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="p-6">
                  <TrendingUp className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-2">Multiple Methods</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Support for FIFO, LIFO, and specific identification methods
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
