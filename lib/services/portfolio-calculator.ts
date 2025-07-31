import { Transaction, Holding, UserPortfolio, TaxCalculation } from '@/lib/types/transaction'
import { marketDataService } from './market-data'
import { dbService } from './database'

export type AccountingMethod = 'FIFO' | 'LIFO' | 'SPECIFIC_ID' | 'AVERAGE_COST'

interface HoldingCalculation {
  symbol: string
  totalAmount: number
  totalInvested: number
  averageCostBasis: number
  transactions: Transaction[]
  realizedGainLoss: number
  unrealizedGainLoss?: number
}

export class PortfolioCalculator {
  
  async calculateUserPortfolio(userId: string): Promise<UserPortfolio> {
    try {
      // Get all user transactions
      const transactions = await dbService.getUserTransactions(userId)
      
      if (transactions.length === 0) {
        return {
          userId,
          holdings: [],
          totalValue: 0,
          totalInvested: 0,
          totalGains: 0,
          totalGainsPercent: 0,
          lastUpdated: new Date()
        }
      }

      // Calculate holdings from transactions
      const holdingCalculations = this.calculateHoldings(transactions)
      
      // Get current market prices for all symbols
      const symbols = Array.from(holdingCalculations.keys())
      const currentPrices = await marketDataService.getCurrentPrices(symbols)
      const priceMap = new Map(currentPrices.map(p => [p.symbol, p.price]))

      // Convert to holdings with current values
      const holdings: Holding[] = []
      let totalValue = 0
      let totalInvested = 0
      let totalRealizedGains = 0

      for (const [symbol, calc] of holdingCalculations) {
        // Include realized gains in total even if no current holdings
        totalRealizedGains += calc.realizedGainLoss

        if (calc.totalAmount <= 0) {
          // Log holdings that were completely sold
          if (calc.realizedGainLoss !== 0) {
            console.log(`💰 ${symbol}: Fully sold, realized gain/loss: $${calc.realizedGainLoss.toFixed(2)}`)
          }
          continue // Skip if no current holdings
        }

        const currentPrice = priceMap.get(symbol) || 0
        const currentValue = calc.totalAmount * currentPrice
        
        // Calculate unrealized gains (current holdings only)
        const unrealizedGainLoss = currentValue - calc.totalInvested
        
        // Total gain/loss includes both realized and unrealized
        const totalGainLoss = unrealizedGainLoss + calc.realizedGainLoss
        const gainLossPercent = calc.totalInvested > 0 ? (totalGainLoss / calc.totalInvested) * 100 : 0

        holdings.push({
          symbol,
          name: this.getCoinName(symbol),
          amount: calc.totalAmount,
          averageCostBasis: calc.averageCostBasis,
          totalInvested: calc.totalInvested,
          currentPrice,
          currentValue,
          gainLoss: totalGainLoss,
          gainLossPercent
        })

        totalValue += currentValue
        totalInvested += calc.totalInvested

        // Log holding details for debugging
        console.log(`🏦 ${symbol}: ${calc.totalAmount.toFixed(4)} @ $${currentPrice.toFixed(2)} = $${currentValue.toFixed(2)}, gain/loss: $${totalGainLoss.toFixed(2)}`)
      }

      // Calculate allocations
      holdings.forEach(holding => {
        holding.allocation = totalValue > 0 ? (holding.currentValue! / totalValue) * 100 : 0
      })

      // Sort by current value (descending)
      holdings.sort((a, b) => (b.currentValue || 0) - (a.currentValue || 0))

      // Calculate total gains including both realized and unrealized
      const totalUnrealizedGains = totalValue - totalInvested
      const totalGains = totalUnrealizedGains + totalRealizedGains
      const totalGainsPercent = totalInvested > 0 ? (totalGains / totalInvested) * 100 : 0

      // Log portfolio summary
      console.log(`📊 Portfolio Summary:`)
      console.log(`   Total Value: $${totalValue.toFixed(2)}`)
      console.log(`   Total Invested: $${totalInvested.toFixed(2)}`)
      console.log(`   Unrealized Gains: $${totalUnrealizedGains.toFixed(2)}`)
      console.log(`   Realized Gains: $${totalRealizedGains.toFixed(2)}`)
      console.log(`   Total Gains: $${totalGains.toFixed(2)} (${totalGainsPercent.toFixed(2)}%)`)
      console.log(`   Holdings Count: ${holdings.length}`)

      const portfolio: UserPortfolio = {
        userId,
        holdings,
        totalValue,
        totalInvested,
        totalGains,
        totalGainsPercent,
        lastUpdated: new Date()
      }

      // Save portfolio to database
      await dbService.saveUserPortfolio(portfolio)

      return portfolio

    } catch (error) {
      console.error('Error calculating portfolio:', error)
      throw new Error('Failed to calculate portfolio')
    }
  }

  private calculateHoldings(transactions: Transaction[]): Map<string, HoldingCalculation> {
    const holdings = new Map<string, HoldingCalculation>()

    // Sort transactions by timestamp (oldest first)
    const sortedTransactions = [...transactions].sort((a, b) => 
      a.timestamp.getTime() - b.timestamp.getTime()
    )

    for (const tx of sortedTransactions) {
      const symbol = tx.symbol.toUpperCase()
      
      if (!holdings.has(symbol)) {
        holdings.set(symbol, {
          symbol,
          totalAmount: 0,
          totalInvested: 0,
          averageCostBasis: 0,
          transactions: [],
          realizedGainLoss: 0
        })
      }

      const holding = holdings.get(symbol)!
      holding.transactions.push(tx)

      switch (tx.type) {
        case 'buy':
          this.processBuyTransaction(holding, tx)
          break
        case 'sell':
          this.processSellTransaction(holding, tx)
          break
        case 'trade':
          // For trades, treat as buy if amount is positive, sell if negative
          if (tx.amount > 0) {
            this.processBuyTransaction(holding, tx)
          } else {
            this.processSellTransaction(holding, { ...tx, amount: Math.abs(tx.amount) })
          }
          break
        case 'stake':
        case 'reward':
        case 'airdrop':
        case 'mining':
        case 'defi_yield':
          this.processRewardTransaction(holding, tx)
          break
        case 'transfer_in':
          this.processTransferInTransaction(holding, tx)
          break
        case 'transfer_out':
          this.processTransferOutTransaction(holding, tx)
          break
      }

      // Recalculate average cost basis
      if (holding.totalAmount > 0) {
        holding.averageCostBasis = holding.totalInvested / holding.totalAmount
      }
    }

    return holdings
  }

  private processBuyTransaction(holding: HoldingCalculation, tx: Transaction): void {
    const cost = tx.amount * tx.price + tx.fee
    holding.totalAmount += tx.amount
    holding.totalInvested += cost

    // Log the buy transaction for debugging
    console.log(`📈 Buy ${tx.symbol}: ${tx.amount} at $${tx.price}, cost: $${cost.toFixed(2)} (including $${tx.fee} fee)`)
  }

  private processSellTransaction(holding: HoldingCalculation, tx: Transaction): void {
    if (holding.totalAmount <= 0) {
      console.warn(`Sell transaction for ${tx.symbol} but no holdings available. Transaction: ${tx.amount} at ${tx.price} on ${tx.timestamp}`)
      return
    }

    const sellAmount = Math.min(tx.amount, holding.totalAmount)
    const costBasis = sellAmount * holding.averageCostBasis
    const saleProceeds = sellAmount * tx.price - tx.fee
    const realizedGain = saleProceeds - costBasis

    holding.totalAmount -= sellAmount
    holding.totalInvested = Math.max(0, holding.totalInvested - costBasis) // Ensure non-negative
    holding.realizedGainLoss += realizedGain

    // If we sold more than we had, log a detailed warning
    if (tx.amount > sellAmount) {
      console.warn(`Oversell detected for ${tx.symbol}: tried to sell ${tx.amount}, only had ${sellAmount}. Date: ${tx.timestamp}, Price: ${tx.price}`)
    }

    // Log the sell transaction for debugging
    console.log(`📉 Sell ${tx.symbol}: ${sellAmount} at $${tx.price}, realized gain: $${realizedGain.toFixed(2)}`)
  }

  private processRewardTransaction(holding: HoldingCalculation, tx: Transaction): void {
    // Rewards are treated as income at fair market value
    const cost = tx.amount * tx.price
    holding.totalAmount += tx.amount
    holding.totalInvested += cost
  }

  private processTransferInTransaction(holding: HoldingCalculation, tx: Transaction): void {
    // Transfer in - add to holdings at cost basis (if known) or market price
    let cost = 0
    
    if (tx.price > 0) {
      // Use the provided price
      cost = tx.amount * tx.price
    } else {
      // For deposits without price, use totalValue if available
      cost = tx.totalValue || 0
    }
    
    holding.totalAmount += tx.amount
    holding.totalInvested += cost

    // Log the transfer in transaction for debugging
    console.log(`📥 Transfer In ${tx.symbol}: ${tx.amount} at $${tx.price}, cost: $${cost.toFixed(2)}`)
  }

  private processTransferOutTransaction(holding: HoldingCalculation, tx: Transaction): void {
    // Transfer out - remove from holdings at average cost basis
    if (holding.totalAmount <= 0) return

    const transferAmount = Math.min(tx.amount, holding.totalAmount)
    const costBasis = transferAmount * holding.averageCostBasis

    holding.totalAmount -= transferAmount
    holding.totalInvested -= costBasis
  }

  private getCoinName(symbol: string): string {
    const coinNames: { [key: string]: string } = {
      'BTC': 'Bitcoin',
      'ETH': 'Ethereum',
      'ADA': 'Cardano',
      'DOT': 'Polkadot',
      'SOL': 'Solana',
      'LINK': 'Chainlink',
      'UNI': 'Uniswap',
      'MATIC': 'Polygon',
      'AVAX': 'Avalanche',
      'ATOM': 'Cosmos',
      'NEAR': 'NEAR Protocol',
      'FTM': 'Fantom',
      'ALGO': 'Algorand',
      'XRP': 'XRP',
      'LTC': 'Litecoin',
      'BCH': 'Bitcoin Cash',
      'XLM': 'Stellar',
      'VET': 'VeChain',
      'ICP': 'Internet Computer',
      'THETA': 'Theta Network',
      'FIL': 'Filecoin',
      'TRX': 'TRON',
      'ETC': 'Ethereum Classic',
      'XMR': 'Monero',
      'CAKE': 'PancakeSwap',
      'AAVE': 'Aave',
      'GRT': 'The Graph',
      'SUSHI': 'SushiSwap',
      'CRV': 'Curve DAO Token',
      'COMP': 'Compound',
      'YFI': 'yearn.finance',
      'SNX': 'Synthetix',
      'MKR': 'Maker',
      'USDT': 'Tether',
      'USDC': 'USD Coin',
      'BUSD': 'Binance USD',
      'DAI': 'Dai'
    }

    return coinNames[symbol.toUpperCase()] || symbol.toUpperCase()
  }

  // Calculate tax implications using different accounting methods
  async calculateTaxLiability(
    userId: string, 
    taxYear: number, 
    method: AccountingMethod = 'FIFO'
  ): Promise<TaxCalculation> {
    try {
      const transactions = await dbService.getUserTransactions(userId)
      
      // Filter transactions for the tax year
      const taxYearTransactions = transactions.filter(tx => 
        tx.timestamp.getFullYear() === taxYear
      )

      // Calculate gains/losses using specified method
      const taxTransactions = await this.calculateTaxTransactions(
        taxYearTransactions, 
        method
      )

      let shortTermGains = 0
      let longTermGains = 0
      let totalGains = 0

      taxTransactions.forEach(tx => {
        if (tx.gainLoss) {
          totalGains += tx.gainLoss
          
          if (tx.taxType === 'short_term') {
            shortTermGains += tx.gainLoss
          } else if (tx.taxType === 'long_term') {
            longTermGains += tx.gainLoss
          }
        }
      })

      // Simplified tax calculation (actual rates depend on jurisdiction)
      const shortTermTaxRate = 0.37 // 37% for short-term gains
      const longTermTaxRate = 0.20 // 20% for long-term gains
      
      const totalTaxLiability = 
        Math.max(0, shortTermGains) * shortTermTaxRate +
        Math.max(0, longTermGains) * longTermTaxRate

      const calculation: TaxCalculation = {
        userId,
        taxYear,
        method,
        shortTermGains,
        longTermGains,
        totalGains,
        totalTaxLiability,
        transactions: taxTransactions,
        createdAt: new Date()
      }

      // Save calculation to database
      await dbService.saveTaxCalculation(calculation)

      return calculation

    } catch (error) {
      console.error('Error calculating tax liability:', error)
      throw new Error('Failed to calculate tax liability')
    }
  }

  private async calculateTaxTransactions(
    transactions: Transaction[], 
    method: AccountingMethod
  ): Promise<any[]> {
    // This is a simplified implementation
    // In a real system, you'd implement proper FIFO/LIFO/etc. logic
    
    const taxTransactions: any[] = []
    const holdings = new Map<string, Transaction[]>()

    // Sort transactions chronologically
    const sortedTransactions = [...transactions].sort((a, b) => 
      a.timestamp.getTime() - b.timestamp.getTime()
    )

    for (const tx of sortedTransactions) {
      if (tx.type === 'buy' || tx.type === 'transfer_in') {
        // Add to holdings
        if (!holdings.has(tx.symbol)) {
          holdings.set(tx.symbol, [])
        }
        holdings.get(tx.symbol)!.push(tx)
      } else if (tx.type === 'sell' || tx.type === 'transfer_out') {
        // Calculate gain/loss
        const symbolHoldings = holdings.get(tx.symbol) || []
        
        if (symbolHoldings.length > 0) {
          // Use FIFO method (take oldest holdings first)
          let remainingToSell = tx.amount
          
          while (remainingToSell > 0 && symbolHoldings.length > 0) {
            const oldestHolding = symbolHoldings[0]
            const sellAmount = Math.min(remainingToSell, oldestHolding.amount)
            
            const costBasis = sellAmount * oldestHolding.price
            const saleProceeds = sellAmount * tx.price
            const gainLoss = saleProceeds - costBasis
            
            // Determine if short-term or long-term
            const holdingPeriod = tx.timestamp.getTime() - oldestHolding.timestamp.getTime()
            const isLongTerm = holdingPeriod > (365 * 24 * 60 * 60 * 1000) // > 1 year
            
            taxTransactions.push({
              transactionId: tx.id,
              symbol: tx.symbol,
              type: tx.type,
              date: tx.timestamp,
              amount: sellAmount,
              costBasis,
              salePrice: tx.price,
              gainLoss,
              holdingPeriod: Math.floor(holdingPeriod / (24 * 60 * 60 * 1000)), // days
              taxType: isLongTerm ? 'long_term' : 'short_term'
            })
            
            // Update or remove the holding
            oldestHolding.amount -= sellAmount
            if (oldestHolding.amount <= 0) {
              symbolHoldings.shift()
            }
            
            remainingToSell -= sellAmount
          }
        }
      }
    }

    return taxTransactions
  }

  // Get portfolio performance metrics
  async getPortfolioMetrics(userId: string, days: number = 30): Promise<{
    totalReturn: number
    totalReturnPercent: number
    bestPerformer: { symbol: string; return: number } | null
    worstPerformer: { symbol: string; return: number } | null
    volatility: number
  }> {
    try {
      const portfolio = await this.calculateUserPortfolio(userId)
      
      if (portfolio.holdings.length === 0) {
        return {
          totalReturn: 0,
          totalReturnPercent: 0,
          bestPerformer: null,
          worstPerformer: null,
          volatility: 0
        }
      }

      let bestPerformer = portfolio.holdings[0]
      let worstPerformer = portfolio.holdings[0]

      portfolio.holdings.forEach(holding => {
        if ((holding.gainLossPercent || 0) > (bestPerformer.gainLossPercent || 0)) {
          bestPerformer = holding
        }
        if ((holding.gainLossPercent || 0) < (worstPerformer.gainLossPercent || 0)) {
          worstPerformer = holding
        }
      })

      // Calculate portfolio volatility (simplified)
      const returns = portfolio.holdings.map(h => h.gainLossPercent || 0)
      const avgReturn = returns.reduce((sum, r) => sum + r, 0) / returns.length
      const variance = returns.reduce((sum, r) => sum + Math.pow(r - avgReturn, 2), 0) / returns.length
      const volatility = Math.sqrt(variance)

      return {
        totalReturn: portfolio.totalGains,
        totalReturnPercent: portfolio.totalGainsPercent,
        bestPerformer: {
          symbol: bestPerformer.symbol,
          return: bestPerformer.gainLossPercent || 0
        },
        worstPerformer: {
          symbol: worstPerformer.symbol,
          return: worstPerformer.gainLossPercent || 0
        },
        volatility
      }

    } catch (error) {
      console.error('Error calculating portfolio metrics:', error)
      throw new Error('Failed to calculate portfolio metrics')
    }
  }
}

// Export singleton instance
export const portfolioCalculator = new PortfolioCalculator()