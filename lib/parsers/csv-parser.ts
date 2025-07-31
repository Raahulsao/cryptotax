import Papa from 'papaparse'
import { 
  Transaction, 
  BinanceSpotTransaction, 
  BinanceDepositTransaction,
  BinanceWithdrawalTransaction,
  CoinbaseTransaction, 
  KrakenTransaction,
  ParseResult,
  ValidationError,
  ExchangeType,
  TransactionType
} from '@/lib/types/transaction'

export class CSVParser {
  private generateId(): string {
    return Math.random().toString(36).substring(2, 11)
  }

  private parseDate(dateString: string): Date {
    // 1. Handle 2-digit year: YY-MM-DD HH:MM:SS (e.g., 25-07-27 07:35:40)
    const twoDigitYearPattern = /^(\d{2})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})$/;
    const match = twoDigitYearPattern.exec(dateString);
    if (match) {
      // YY-MM-DD HH:MM:SS
      let [ , yy, mm, dd, hh, min, ss ] = match;
      // Convert to 2000-2099
      const yyyy = (parseInt(yy, 10) + 2000).toString();
      // Reconstruct as YYYY-MM-DD HH:MM:SS
      const reconstructed = `${yyyy}-${mm}-${dd} ${hh}:${min}:${ss}`;
      const date = new Date(reconstructed);
      if (!isNaN(date.getTime())) {
        return date;
      } else {
        throw new Error(`Invalid date after conversion: ${reconstructed}`);
      }
    }

    // Handle various date formats (existing logic)
    const formats = [
      // ISO format: 2023-01-15T10:30:00Z
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z?$/,
      // Standard format: 2023-01-15 10:30:00
      /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/,
      // Date only: 2023-01-15
      /^\d{4}-\d{2}-\d{2}$/,
      // US format: 01/15/2023
      /^\d{2}\/\d{2}\/\d{4}/,
      // EU format: 15/01/2023
      /^\d{2}\/\d{2}\/\d{4}/
    ]

    let date = new Date(dateString)
    
    if (isNaN(date.getTime())) {
      // Try parsing with different formats
      const timestamp = Date.parse(dateString)
      if (!isNaN(timestamp)) {
        date = new Date(timestamp)
      } else {
        throw new Error(`Invalid date format: ${dateString}`)
      }
    }
    
    return date
  }

  private parseNumber(value: string | number): number {
    if (typeof value === 'number') return value
    
    // Remove commas and currency symbols
    const cleaned = value.toString().replace(/[,$€£¥]/g, '')
    const number = parseFloat(cleaned)
    
    if (isNaN(number)) {
      throw new Error(`Invalid number format: ${value}`)
    }
    
    return number
  }

  private detectExchangeFormat(headers: string[]): ExchangeType {
    const headerStr = headers.join(',').toLowerCase()
    
    // Binance formats
    if (headerStr.includes('market') && headerStr.includes('fee coin')) {
      return 'binance_spot'
    } else if (headerStr.includes('coin') && headerStr.includes('network') && headerStr.includes('txid')) {
      return 'binance_deposit'
    } else if (headerStr.includes('coin') && headerStr.includes('network') && headerStr.includes('transaction id')) {
      return 'binance_withdrawal'
    } else if (headerStr.includes('transaction type') && headerStr.includes('spot price currency')) {
      return 'coinbase'
    } else if (headerStr.includes('txid') && headerStr.includes('ordertxid')) {
      return 'kraken'
    }
    
    return 'other'
  }

  async parseCSV(csvContent: string, userId: string): Promise<ParseResult> {
    return new Promise((resolve) => {
      // First, try to detect if this is a Binance deposit format and handle it specially
      if (csvContent.includes('Date(UTC+0)') && csvContent.includes('Coin') && csvContent.includes('Network')) {
        console.log('Detected Binance deposit format, using special parsing')
        try {
          const parseResult = this.parseBinanceDepositCSV(csvContent, userId)
          resolve(parseResult)
          return
        } catch (error) {
          console.error('Special parsing failed, falling back to Papa Parse:', error)
        }
      }

      Papa.parse(csvContent, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          try {
            console.log('CSV Parse Results:', {
              data: results.data.slice(0, 2), // Log first 2 rows for debugging
              errors: results.errors,
              meta: results.meta
            })
            
            const parseResult = this.processParseResults(results, userId)
            resolve(parseResult)
          } catch (error) {
            console.error('CSV Parse Error:', error)
            resolve({
              transactions: [],
              errors: [{
                row: 0,
                field: 'general',
                value: csvContent.substring(0, 100),
                message: `Parse error: ${error instanceof Error ? error.message : 'Unknown error'}`,
                severity: 'error'
              }],
              warnings: [],
              totalRows: 0,
              validRows: 0,
              duplicates: 0
            })
          }
        },
        error: (error: any) => {
          console.error('Papa Parse Error:', error)
          resolve({
            transactions: [],
            errors: [{
              row: 0,
              field: 'general',
              value: '',
              message: `CSV parse error: ${error.message}`,
              severity: 'error'
            }],
            warnings: [],
            totalRows: 0,
            validRows: 0,
            duplicates: 0
          })
        }
      })
    })
  }

  private parseBinanceDepositCSV(csvContent: string, userId: string): ParseResult {
    console.log('Using very simple Binance deposit CSV parser')
    
    const lines = csvContent.split('\n').filter(line => line.trim().length > 0)
    const transactions: Transaction[] = []
    const errors: ValidationError[] = []
    const warnings: ValidationError[] = []

    if (lines.length < 2) {
      errors.push({
        row: 0,
        field: 'general',
        value: '',
        message: 'No data found in CSV file',
        severity: 'error'
      })
      return { transactions, errors, warnings, totalRows: 0, validRows: 0, duplicates: 0 }
    }

    // Process data rows (skip header)
    for (let i = 1; i < lines.length; i++) {
      try {
        const line = lines[i]
        console.log(`Processing line ${i}:`, line)
        
        // For Binance deposit format, we know the structure:
        // Date(UTC+0),Coin,Network,Amount,Address,TXID,Status
        // We'll extract the first 4 fields which are the most important
        
        // Find all comma positions for proper field extraction
        const commaPositions = []
        for (let j = 0; j < line.length; j++) {
          if (line[j] === ',') {
            commaPositions.push(j)
          }
        }
        
        if (commaPositions.length >= 6) {
          // Extract fields based on comma positions
          // Format: Date(UTC+0),Coin,Network,Amount,Address,TXID,Status
          const dateStr = line.substring(0, commaPositions[0]).trim()
          const coin = line.substring(commaPositions[0] + 1, commaPositions[1]).trim()
          const network = line.substring(commaPositions[1] + 1, commaPositions[2]).trim()
          const amountStr = line.substring(commaPositions[2] + 1, commaPositions[3]).trim()
          const address = line.substring(commaPositions[3] + 1, commaPositions[4]).trim()
          const txid = line.substring(commaPositions[4] + 1, commaPositions[5]).trim()
          const status = line.substring(commaPositions[5] + 1).trim()

          console.log('Extracted fields:', { dateStr, coin, network, amountStr })
          
          if (dateStr && coin && amountStr) {
            const amount = this.parseNumber(amountStr)
            
            // For deposits, we need to set a price for cost basis calculation
            // For stablecoins like USDT, the price is approximately $1
            // For other coins, we'll set price to 1 and let the portfolio calculator handle it
            let price = 1 // Default price
            let totalValue = amount
            
            if (coin.toUpperCase() === 'USDT' || coin.toUpperCase() === 'USDC' || coin.toUpperCase() === 'BUSD') {
              // Stablecoins are approximately $1
              price = 1
              totalValue = amount * price
            } else {
              // For other cryptocurrencies, we'll need to fetch historical price
              // For now, set price to 1 and totalValue to amount
              price = 1
              totalValue = amount
            }

            // Create a simplified transaction
            const transaction: Transaction = {
              id: this.generateId(),
              userId,
              timestamp: this.parseDate(dateStr),
              type: 'transfer_in' as TransactionType, // Deposits are transfer_in
              symbol: coin,
              amount: amount,
              price: price, // Set appropriate price for cost basis
              fee: 0, // No fee for deposits
              feeCurrency: coin,
              totalValue: totalValue,
              exchange: 'binance_deposit' as ExchangeType,
              notes: `Deposit via ${network} network`,
              rawData: { date: dateStr, coin, network, amount: amountStr, address, TXID: txid, status },
              processed: false,
              createdAt: new Date(),
              updatedAt: new Date()
            }
            
            transactions.push(transaction)
            console.log(`✅ Line ${i} parsed successfully:`, transaction)
          } else {
            console.log(`❌ Line ${i} missing required fields`)
            errors.push({
              row: i,
              field: 'general',
              value: line,
              message: 'Missing required fields (Date, Coin, Amount)',
              severity: 'error'
            })
          }
        } else {
          console.log(`❌ Line ${i} has insufficient commas:`, commaPositions.length)
          errors.push({
            row: i,
            field: 'general',
            value: line,
            message: `Invalid row format: expected at least 6 commas for Binance deposit format, got ${commaPositions.length}`,
            severity: 'error'
          })
        }
      } catch (error) {
        console.error(`❌ Error processing line ${i}:`, error)
        errors.push({
          row: i,
          field: 'general',
          value: lines[i],
          message: error instanceof Error ? error.message : 'Unknown error',
          severity: 'error'
        })
      }
    }

    console.log('Simple parsing results:', {
      totalRows: lines.length - 1,
      validTransactions: transactions.length,
      errors: errors.length
    })

    return {
      transactions,
      errors,
      warnings,
      totalRows: lines.length - 1,
      validRows: transactions.length,
      duplicates: 0
    }
  }

  private processParseResults(results: Papa.ParseResult<any>, userId: string): ParseResult {
    const { data, errors: parseErrors } = results
    const transactions: Transaction[] = []
    const errors: ValidationError[] = []
    const warnings: ValidationError[] = []
    
    console.log('Processing CSV results:', {
      totalRows: data.length,
      parseErrors: parseErrors.length,
      firstRow: data[0],
      headers: data[0] ? Object.keys(data[0]) : []
    })
    
    // Add parse errors
    parseErrors.forEach(error => {
      errors.push({
        row: error.row || 0,
        field: 'parse',
        value: '',
        message: error.message,
        severity: 'error'
      })
    })

    if (data.length === 0) {
      errors.push({
        row: 0,
        field: 'general',
        value: '',
        message: 'No data found in CSV file',
        severity: 'error'
      })
      
      return {
        transactions: [],
        errors,
        warnings,
        totalRows: 0,
        validRows: 0,
        duplicates: 0
      }
    }

    // Detect exchange format
    const headers = Object.keys(data[0])
    const exchangeType = this.detectExchangeFormat(headers)
    
    console.log('Exchange format detection:', {
      headers,
      detectedExchange: exchangeType
    })

    // Process each row
    data.forEach((row, index) => {
      try {
        console.log(`Processing row ${index + 1}:`, row)
        const transaction = this.parseRowByExchange(row, exchangeType, userId, index)
        if (transaction) {
          transactions.push(transaction)
          console.log(`✅ Row ${index + 1} parsed successfully`)
        } else {
          console.log(`❌ Row ${index + 1} returned null`)
        }
      } catch (error) {
        console.error(`❌ Error processing row ${index + 1}:`, error)
        errors.push({
          row: index + 1,
          field: 'general',
          value: JSON.stringify(row),
          message: error instanceof Error ? error.message : 'Unknown error',
          severity: 'error'
        })
      }
    })

    console.log('Final results:', {
      totalRows: data.length,
      validTransactions: transactions.length,
      errors: errors.length,
      warnings: warnings.length
    })

    // Check for duplicates within the file
    const duplicates = this.findDuplicates(transactions)

    return {
      transactions,
      errors,
      warnings,
      totalRows: data.length,
      validRows: transactions.length,
      duplicates: duplicates.length
    }
  }

  private parseRowByExchange(row: any, exchange: ExchangeType, userId: string, rowIndex: number): Transaction | null {
    switch (exchange) {
      case 'binance_spot':
        return this.parseBinanceSpotRow(row as BinanceSpotTransaction, userId, rowIndex)
      case 'binance_deposit':
        return this.parseBinanceDepositRow(row as BinanceDepositTransaction, userId, rowIndex)
      case 'binance_withdrawal':
        return this.parseBinanceWithdrawalRow(row as BinanceWithdrawalTransaction, userId, rowIndex)
      case 'coinbase':
        return this.parseCoinbaseRow(row as CoinbaseTransaction, userId, rowIndex)
      case 'kraken':
        return this.parseKrakenRow(row as KrakenTransaction, userId, rowIndex)
      default:
        return this.parseGenericRow(row, userId, rowIndex)
    }
  }

  private parseBinanceSpotRow(row: BinanceSpotTransaction, userId: string, rowIndex: number): Transaction {
    // Parse the trading pair (e.g., "BTCUSDT" -> "BTC" and "USDT")
    const market = row.Market.toUpperCase()
    let baseSymbol = ''
    let quoteSymbol = ''
    
    // Common quote currencies in order of preference (longer first to avoid conflicts)
    const quoteCurrencies = ['USDT', 'USDC', 'BUSD', 'BNB', 'ETH', 'BTC', 'USD', 'EUR', 'GBP']
    
    for (const quote of quoteCurrencies) {
      if (market.endsWith(quote)) {
        quoteSymbol = quote
        baseSymbol = market.slice(0, -quote.length)
        break
      }
    }
    
    // If no quote currency found, assume last 3-4 characters are quote
    if (!baseSymbol) {
      if (market.length > 6) {
        baseSymbol = market.slice(0, -4)
        quoteSymbol = market.slice(-4)
      } else {
        baseSymbol = market.slice(0, -3)
        quoteSymbol = market.slice(-3)
      }
    }
    
    const type: TransactionType = row.Type.toLowerCase() as TransactionType
    
    return {
      id: this.generateId(),
      userId,
      timestamp: this.parseDate(row.Date),
      type,
      symbol: baseSymbol,
      amount: this.parseNumber(row.Amount),
      price: this.parseNumber(row.Price),
      fee: this.parseNumber(row.Fee),
      feeCurrency: row['Fee Coin'],
      totalValue: this.parseNumber(row.Total),
      exchange: 'binance_spot',
      rawData: row,
      processed: false,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  }

  private parseBinanceDepositRow(row: BinanceDepositTransaction, userId: string, rowIndex: number): Transaction {
    console.log('Parsing Binance deposit row:', row)
    
    try {
      const type: TransactionType = 'transfer_in' // Deposits are transfer_in transactions
      const amount = this.parseNumber(row.Amount)
      const price = 0 // Deposit has no price
      const fee = 0 // Deposit has no fee
      const feeCurrency = row.Coin // Use the coin as fee currency
      const totalValue = amount // For deposits, total value equals amount

      console.log('Parsed values:', {
        type,
        amount,
        price,
        fee,
        feeCurrency,
        totalValue,
        date: row['Date(UTC+0)'],
        coin: row.Coin
      })

      const transaction = {
        id: this.generateId(),
        userId,
        timestamp: this.parseDate(row['Date(UTC+0)']),
        type,
        symbol: row.Coin,
        amount,
        price,
        fee,
        feeCurrency,
        totalValue,
        exchange: 'binance_deposit' as ExchangeType,
        notes: `Deposit via ${row.Network} network. TXID: ${row.TXID}`,
        rawData: row,
        processed: false,
        createdAt: new Date(),
        updatedAt: new Date()
      }

      console.log('Created transaction:', transaction)
      return transaction
      
    } catch (error) {
      console.error('Error parsing Binance deposit row:', error, row)
      throw error
    }
  }

  private parseBinanceWithdrawalRow(row: BinanceWithdrawalTransaction, userId: string, rowIndex: number): Transaction {
    const type: TransactionType = 'transfer_out' // Withdrawals are transfer_out transactions
    const amount = this.parseNumber(row.Amount)
    const price = 0 // Withdrawal has no price
    const fee = this.parseNumber(row['Transaction Fee'])
    const feeCurrency = row.Coin // Use the coin as fee currency
    const totalValue = amount + fee // Total value includes the fee

    return {
      id: this.generateId(),
      userId,
      timestamp: this.parseDate(row['Date(UTC+0)']),
      type,
      symbol: row.Coin,
      amount,
      price,
      fee,
      feeCurrency,
      totalValue,
      exchange: 'binance_withdrawal' as ExchangeType,
      notes: `Withdrawal via ${row.Network} network. TXID: ${row['Transaction ID']}`,
      rawData: row,
      processed: false,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  }

  private parseCoinbaseRow(row: CoinbaseTransaction, userId: string, rowIndex: number): Transaction {
    // Map Coinbase transaction types to our standard types
    const typeMapping: { [key: string]: TransactionType } = {
      'Buy': 'buy',
      'Sell': 'sell',
      'Send': 'transfer_out',
      'Receive': 'transfer_in',
      'Coinbase Earn': 'reward',
      'Staking Income': 'stake',
      'Learning Reward': 'reward'
    }

    const type = typeMapping[row['Transaction Type']] || 'other' as TransactionType
    const amount = Math.abs(this.parseNumber(row['Quantity Transacted']))
    const price = this.parseNumber(row['Spot Price at Transaction'])
    
    return {
      id: this.generateId(),
      userId,
      timestamp: this.parseDate(row.Timestamp),
      type,
      symbol: row.Asset,
      amount,
      price,
      fee: this.parseNumber(row.Fees || '0'),
      feeCurrency: row['Spot Price Currency'],
      totalValue: this.parseNumber(row.Total),
      exchange: 'coinbase',
      notes: row.Notes,
      rawData: row,
      processed: false,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  }

  private parseKrakenRow(row: KrakenTransaction, userId: string, rowIndex: number): Transaction {
    const [baseSymbol, quoteSymbol] = row.pair.split('/')
    
    return {
      id: this.generateId(),
      userId,
      timestamp: this.parseDate(row.time),
      type: row.type as TransactionType,
      symbol: baseSymbol,
      amount: this.parseNumber(row.vol),
      price: this.parseNumber(row.price),
      fee: this.parseNumber(row.fee),
      feeCurrency: quoteSymbol,
      totalValue: this.parseNumber(row.cost),
      exchange: 'kraken',
      rawData: row,
      processed: false,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  }

  private parseGenericRow(row: any, userId: string, rowIndex: number): Transaction | null {
    // Try to parse generic CSV format
    // Look for common column names
    const commonMappings = {
      date: ['date', 'timestamp', 'time', 'datetime'],
      type: ['type', 'side', 'transaction_type', 'action'],
      symbol: ['symbol', 'asset', 'coin', 'currency', 'pair'],
      amount: ['amount', 'quantity', 'qty', 'volume', 'vol'],
      price: ['price', 'rate', 'unit_price'],
      fee: ['fee', 'fees', 'commission'],
      total: ['total', 'value', 'total_value']
    }

    const findColumn = (mappings: string[]): string | null => {
      const keys = Object.keys(row)
      const lowerKeys = keys.map(k => k.toLowerCase())
      
      // First try exact matches
      for (const mapping of mappings) {
        const exactMatch = keys.find(key => key.toLowerCase() === mapping)
        if (exactMatch) return exactMatch
      }
      
      // Then try partial matches
      for (const mapping of mappings) {
        const partialMatch = keys.find(key => key.toLowerCase().includes(mapping))
        if (partialMatch) return partialMatch
      }
      
      return null
    }

    try {
      const dateCol = findColumn(commonMappings.date)
      const typeCol = findColumn(commonMappings.type)
      const symbolCol = findColumn(commonMappings.symbol)
      const amountCol = findColumn(commonMappings.amount)
      const priceCol = findColumn(commonMappings.price)

      if (!dateCol || !symbolCol || !amountCol) {
        throw new Error('Required columns not found')
      }

      return {
        id: this.generateId(),
        userId,
        timestamp: this.parseDate(row[dateCol]),
        type: (typeCol !== null ? row[typeCol]?.toLowerCase() || 'trade' : 'trade') as TransactionType,
        symbol: row[symbolCol],
        amount: this.parseNumber(row[amountCol]),
        price: priceCol ? this.parseNumber(row[priceCol]) : 0,
        fee: this.parseNumber((() => {
          const feeCol = findColumn(commonMappings.fee);
          return feeCol !== null ? row[feeCol] : null;
        })() || '0'),
        totalValue: this.parseNumber((() => {
          const totalCol = findColumn(commonMappings.total);
          return totalCol !== null ? row[totalCol] : null;
        })() || '0'),
        exchange: 'other',
        rawData: row,
        processed: false,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    } catch (error) {
      throw new Error(`Failed to parse generic row: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  private findDuplicates(transactions: Transaction[]): Transaction[] {
    const seen = new Set<string>()
    const duplicates: Transaction[] = []

    transactions.forEach(tx => {
      const key = `${tx.timestamp.getTime()}-${tx.symbol}-${tx.amount}-${tx.type}`
      if (seen.has(key)) {
        duplicates.push(tx)
      } else {
        seen.add(key)
      }
    })

    return duplicates
  }

  // Validation methods
  validateTransaction(transaction: Transaction): ValidationError[] {
    const errors: ValidationError[] = []

    if (!transaction.symbol || transaction.symbol.length === 0) {
      errors.push({
        row: 0,
        field: 'symbol',
        value: transaction.symbol,
        message: 'Symbol is required',
        severity: 'error'
      })
    }

    if (transaction.amount <= 0) {
      errors.push({
        row: 0,
        field: 'amount',
        value: transaction.amount,
        message: 'Amount must be greater than 0',
        severity: 'error'
      })
    }

    if (transaction.price < 0) {
      errors.push({
        row: 0,
        field: 'price',
        value: transaction.price,
        message: 'Price cannot be negative',
        severity: 'error'
      })
    }

    if (transaction.timestamp > new Date()) {
      errors.push({
        row: 0,
        field: 'timestamp',
        value: transaction.timestamp,
        message: 'Transaction date cannot be in the future',
        severity: 'warning'
      })
    }

    return errors
  }

  // Get supported exchange formats
  getSupportedExchanges(): { name: string; value: ExchangeType; description: string }[] {
    return [
      {
        name: 'Binance Spot',
        value: 'binance_spot',
        description: 'Binance Spot Trading History CSV'
      },
      {
        name: 'Binance Deposit',
        value: 'binance_deposit',
        description: 'Binance Deposit History CSV'
      },
      {
        name: 'Binance Withdrawal',
        value: 'binance_withdrawal',
        description: 'Binance Withdrawal History CSV'
      },
      {
        name: 'Coinbase',
        value: 'coinbase',
        description: 'Coinbase Transaction History CSV'
      },
      {
        name: 'Kraken',
        value: 'kraken',
        description: 'Kraken Ledger History CSV'
      },
      {
        name: 'Generic',
        value: 'other',
        description: 'Generic CSV format with standard columns'
      }
    ]
  }
}

// Export singleton instance
export const csvParser = new CSVParser()