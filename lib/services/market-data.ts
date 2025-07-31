import axios from 'axios'
import { CoinPrice, HistoricalPrice } from '@/lib/types/transaction'

interface CoinGeckoPrice {
  [key: string]: {
    usd: number
    usd_24h_change: number
  }
}

interface CoinGeckoHistorical {
  prices: [number, number][]
  market_data?: {
    current_price?: {
      usd?: number
    }
  }
}

export class MarketDataService {
  private baseUrl = 'https://api.coingecko.com/api/v3'
  private cache = new Map<string, { data: any; timestamp: number }>()
  private cacheTimeout = 60000 // 1 minute cache

  // Symbol to CoinGecko ID mapping
  private symbolToId: { [key: string]: string } = {
    'BTC': 'bitcoin',
    'ETH': 'ethereum',
    'ADA': 'cardano',
    'DOT': 'polkadot',
    'SOL': 'solana',
    'LINK': 'chainlink',
    'UNI': 'uniswap',
    'MATIC': 'matic-network',
    'AVAX': 'avalanche-2',
    'ATOM': 'cosmos',
    'NEAR': 'near',
    'FTM': 'fantom',
    'ALGO': 'algorand',
    'XRP': 'ripple',
    'LTC': 'litecoin',
    'BCH': 'bitcoin-cash',
    'XLM': 'stellar',
    'VET': 'vechain',
    'ICP': 'internet-computer',
    'THETA': 'theta-token',
    'FIL': 'filecoin',
    'TRX': 'tron',
    'ETC': 'ethereum-classic',
    'XMR': 'monero',
    'CAKE': 'pancakeswap-token',
    'AAVE': 'aave',
    'GRT': 'the-graph',
    'SUSHI': 'sushi',
    'CRV': 'curve-dao-token',
    'COMP': 'compound-governance-token',
    'YFI': 'yearn-finance',
    'SNX': 'havven',
    'MKR': 'maker',
    'USDT': 'tether',
    'USDC': 'usd-coin',
    'BUSD': 'binance-usd',
    'DAI': 'dai'
  }

  private getCoinGeckoId(symbol: string): string {
    return this.symbolToId[symbol.toUpperCase()] || symbol.toLowerCase()
  }

  private getCacheKey(key: string): string {
    return 'market_data_' + key
  }

  private isValidCache(key: string): boolean {
    const cached = this.cache.get(key)
    if (!cached) return false

    const now = Date.now()
    return (now - cached.timestamp) < this.cacheTimeout
  }

  private setCache(key: string, data: any): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    })
  }

  private getCache(key: string): any {
    const cached = this.cache.get(key)
    return cached ? cached.data : null
  }

  // Get current price for a single symbol
  async getCurrentPrice(symbol: string): Promise<CoinPrice | null> {
    try {
      const cacheKey = this.getCacheKey('price_' + symbol)

      if (this.isValidCache(cacheKey)) {
        return this.getCache(cacheKey)
      }

      const coinId = this.getCoinGeckoId(symbol)
      const response = await axios.get<CoinGeckoPrice>(
        this.baseUrl + '/simple/price',
        {
          params: {
            ids: coinId,
            vs_currencies: 'usd',
            include_24hr_change: true
          },
          timeout: 10000
        }
      )

      const data = response.data[coinId]
      if (!data) {
        console.warn('Price data not found for ' + symbol)
        return null
      }

      const price: CoinPrice = {
        symbol: symbol.toUpperCase(),
        price: data.usd,
        change24h: data.usd_24h_change || 0,
        lastUpdated: new Date()
      }

      this.setCache(cacheKey, price)
      return price

    } catch (error) {
      console.error('Error fetching price for ' + symbol + ':', error)
      return null
    }
  }

  // Get current prices for multiple symbols
  async getCurrentPrices(symbols: string[]): Promise<CoinPrice[]> {
    try {
      const cacheKey = this.getCacheKey('prices_' + symbols.sort().join(','))

      if (this.isValidCache(cacheKey)) {
        console.log(`📈 Using cached prices for ${symbols.length} symbols`)
        return this.getCache(cacheKey)
      }

      const uniqueSymbols = [...new Set(symbols)]
      const coinIds = uniqueSymbols.map(symbol => this.getCoinGeckoId(symbol))

      console.log(`📈 Fetching prices for ${uniqueSymbols.length} symbols: ${uniqueSymbols.join(', ')}`)

      const response = await axios.get<CoinGeckoPrice>(
        this.baseUrl + '/simple/price',
        {
          params: {
            ids: coinIds.join(','),
            vs_currencies: 'usd',
            include_24hr_change: true
          },
          timeout: 15000
        }
      )

      const prices: CoinPrice[] = []
      let successCount = 0
      let failureCount = 0

      for (const symbol of uniqueSymbols) {
        const coinId = this.getCoinGeckoId(symbol)
        const data = response.data[coinId]

        if (data && data.usd > 0) {
          prices.push({
            symbol: symbol.toUpperCase(),
            price: data.usd,
            change24h: data.usd_24h_change || 0,
            lastUpdated: new Date()
          })
          successCount++
        } else {
          console.warn(`Price data not found for ${symbol} (coinId: ${coinId})`)
          // Add placeholder with 0 price
          prices.push({
            symbol: symbol.toUpperCase(),
            price: 0,
            change24h: 0,
            lastUpdated: new Date()
          })
          failureCount++
        }
      }

      console.log(`📈 Price fetch results: ${successCount} successful, ${failureCount} failed`)

      this.setCache(cacheKey, prices)
      return prices

    } catch (error) {
      console.error('Error fetching prices from CoinGecko API:', error)
      
      // Try to return cached data even if expired
      const cacheKey = this.getCacheKey('prices_' + symbols.sort().join(','))
      const cachedData = this.getCache(cacheKey)
      
      if (cachedData) {
        console.log('📈 Using expired cached data due to API failure')
        return cachedData
      }

      // Return zero prices as fallback
      console.warn('📈 Returning zero prices due to API failure and no cache')
      return symbols.map(symbol => ({
        symbol: symbol.toUpperCase(),
        price: 0,
        change24h: 0,
        lastUpdated: new Date()
      }))
    }
  }

  // Get historical price for a specific date
  async getHistoricalPrice(symbol: string, date: Date): Promise<number | null> {
    try {
      const dateStr = date.toISOString().split('T')[0]
      const cacheKey = this.getCacheKey('historical_' + symbol + '_' + dateStr)

      if (this.isValidCache(cacheKey)) {
        return this.getCache(cacheKey)
      }

      const coinId = this.getCoinGeckoId(symbol)
      const response = await axios.get<CoinGeckoHistorical>(
        this.baseUrl + '/coins/' + coinId + '/history',
        {
          params: {
            date: dateStr,
            localization: false
          },
          timeout: 10000
        }
      )

      const price = response.data.market_data?.current_price?.usd || 0
      this.setCache(cacheKey, price)
      return price

    } catch (error) {
      console.error('Error fetching historical price for ' + symbol + ' on ' + date + ':', error)
      return null
    }
  }

  // Get historical prices for a range of days
  async getHistoricalPrices(symbol: string, days: number = 30): Promise<HistoricalPrice[]> {
    try {
      const cacheKey = this.getCacheKey('historical_range_' + symbol + '_' + days)

      if (this.isValidCache(cacheKey)) {
        return this.getCache(cacheKey)
      }

      const coinId = this.getCoinGeckoId(symbol)
      const response = await axios.get<CoinGeckoHistorical>(
        this.baseUrl + '/coins/' + coinId + '/market_chart',
        {
          params: {
            vs_currency: 'usd',
            days: days,
            interval: days > 90 ? 'daily' : 'hourly'
          },
          timeout: 15000
        }
      )

      const prices: HistoricalPrice[] = response.data.prices.map(([timestamp, price]) => ({
        symbol: symbol.toUpperCase(),
        date: new Date(timestamp),
        price
      }))

      this.setCache(cacheKey, prices)
      return prices

    } catch (error) {
      console.error('Error fetching historical prices for ' + symbol + ':', error)
      return []
    }
  }

  // Get price at specific timestamp (closest available)
  async getPriceAtTimestamp(symbol: string, timestamp: Date): Promise<number | null> {
    try {
      // For recent timestamps (within 30 days), use market_chart
      const daysDiff = Math.floor((Date.now() - timestamp.getTime()) / (1000 * 60 * 60 * 24))

      if (daysDiff <= 30) {
        const historicalPrices = await this.getHistoricalPrices(symbol, Math.max(daysDiff + 1, 1))

        if (historicalPrices.length === 0) return null

        // Find closest price to the timestamp
        let closestPrice = historicalPrices[0]
        let minDiff = Math.abs(historicalPrices[0].date.getTime() - timestamp.getTime())

        for (const price of historicalPrices) {
          const diff = Math.abs(price.date.getTime() - timestamp.getTime())
          if (diff < minDiff) {
            minDiff = diff
            closestPrice = price
          }
        }

        return closestPrice.price
      } else {
        // For older timestamps, use historical price by date
        return await this.getHistoricalPrice(symbol, timestamp)
      }

    } catch (error) {
      console.error('Error getting price at timestamp for ' + symbol + ':', error)
      return null
    }
  }

  // Batch get prices at multiple timestamps for multiple symbols
  async getBatchPricesAtTimestamps(
    requests: { symbol: string; timestamp: Date }[]
  ): Promise<Map<string, number>> {
    const results = new Map<string, number>()

    // Group requests by symbol
    const symbolGroups = new Map<string, Date[]>()

    requests.forEach(({ symbol, timestamp }) => {
      if (!symbolGroups.has(symbol)) {
        symbolGroups.set(symbol, [])
      }
      symbolGroups.get(symbol)!.push(timestamp)
    })

    // Process each symbol group
    for (const [symbol, timestamps] of symbolGroups) {
      try {
        // Get historical prices for the symbol
        const maxDays = Math.max(
          ...timestamps.map(ts =>
            Math.floor((Date.now() - ts.getTime()) / (1000 * 60 * 60 * 24))
          )
        )

        const historicalPrices = await this.getHistoricalPrices(symbol, Math.min(maxDays + 1, 365))

        // Match each timestamp to closest historical price
        timestamps.forEach(timestamp => {
          const resultKey = symbol + '_' + timestamp.getTime()

          if (historicalPrices.length === 0) {
            results.set(resultKey, 0)
            return
          }

          // Find closest price
          let closestPrice = historicalPrices[0]
          let minDiff = Math.abs(historicalPrices[0].date.getTime() - timestamp.getTime())

          for (const price of historicalPrices) {
            const diff = Math.abs(price.date.getTime() - timestamp.getTime())
            if (diff < minDiff) {
              minDiff = diff
              closestPrice = price
            }
          }

          results.set(resultKey, closestPrice.price)
        })

      } catch (error) {
        console.error('Error processing batch prices for ' + symbol + ':', error)
        // Set default prices for failed requests
        timestamps.forEach(timestamp => {
          results.set(symbol + '_' + timestamp.getTime(), 0)
        })
      }
    }

    return results
  }

  // Get list of supported coins
  async getSupportedCoins(): Promise<{ id: string; symbol: string; name: string }[]> {
    try {
      const cacheKey = this.getCacheKey('supported_coins')

      if (this.isValidCache(cacheKey)) {
        return this.getCache(cacheKey)
      }

      const response = await axios.get(
        this.baseUrl + '/coins/list',
        { timeout: 10000 }
      )

      const coins = response.data.slice(0, 1000) // Limit to first 1000 coins
      this.setCache(cacheKey, coins)
      return coins

    } catch (error) {
      console.error('Error fetching supported coins:', error)
      return []
    }
  }
}

// Export singleton instance
export const marketDataService = new MarketDataService()