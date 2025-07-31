// Transaction data types and interfaces

export interface Transaction {
  id: string
  userId: string
  timestamp: Date
  type: TransactionType
  symbol: string
  amount: number
  price: number
  fee: number
  feeCurrency?: string
  totalValue: number
  exchange: ExchangeType
  notes?: string
  rawData: any // Original data for debugging
  processed: boolean
  createdAt: Date
  updatedAt: Date
}

export type TransactionType = 
  | 'buy' 
  | 'sell' 
  | 'trade' 
  | 'stake' 
  | 'unstake' 
  | 'reward' 
  | 'airdrop' 
  | 'transfer_in' 
  | 'transfer_out'
  | 'deposit'
  | 'withdrawal'
  | 'mining'
  | 'defi_yield'

export type ExchangeType = 
  | 'binance_spot' 
  | 'binance_deposit'
  | 'binance_withdrawal'
  | 'coinbase' 
  | 'coinbase_pro' 
  | 'kraken' 
  | 'kucoin'
  | 'huobi'
  | 'bybit'
  | 'manual' 
  | 'other'

export interface Holding {
  symbol: string
  name: string
  amount: number
  averageCostBasis: number
  totalInvested: number
  currentPrice?: number
  currentValue?: number
  gainLoss?: number
  gainLossPercent?: number
  allocation?: number
}

export interface UserPortfolio {
  userId: string
  holdings: Holding[]
  totalValue: number
  totalInvested: number
  totalGains: number
  totalGainsPercent: number
  lastUpdated: Date
}

export interface ProcessingJob {
  id: string
  userId: string
  fileName: string
  originalName: string
  fileType: string
  status: ProcessingStatus
  progress: number
  totalTransactions?: number
  processedTransactions?: number
  errors: string[]
  warnings: string[]
  createdAt: Date
  completedAt?: Date
}

export type ProcessingStatus = 
  | 'pending' 
  | 'processing' 
  | 'completed' 
  | 'failed' 
  | 'cancelled'

// Raw exchange data formats
export interface BinanceSpotTransaction {
  Date: string
  Market: string
  Type: 'BUY' | 'SELL'
  Price: string
  Amount: string
  Total: string
  Fee: string
  'Fee Coin': string
}

export interface BinanceDepositTransaction {
  'Date(UTC+0)': string
  Coin: string
  Network: string
  Amount: string
  Address: string
  TXID: string
  Status: string
}

export interface BinanceWithdrawalTransaction {
  'Date(UTC+0)': string
  Coin: string
  Network: string
  Amount: string
  'Transaction Fee': string
  'Transaction ID': string
  Address: string
  Status: string
}

export interface CoinbaseTransaction {
  Timestamp: string
  'Transaction Type': string
  Asset: string
  'Quantity Transacted': string
  'Spot Price Currency': string
  'Spot Price at Transaction': string
  Subtotal: string
  Total: string
  Fees: string
  Notes: string
}

export interface KrakenTransaction {
  txid: string
  ordertxid: string
  pair: string
  time: string
  type: 'buy' | 'sell'
  ordertype: string
  price: string
  cost: string
  fee: string
  vol: string
  margin: string
  misc: string
  ledgers: string
}

// Validation and error types
export interface ValidationError {
  row: number
  field: string
  value: any
  message: string
  severity: 'error' | 'warning' | 'info'
}

export interface ParseResult {
  transactions: Transaction[]
  errors: ValidationError[]
  warnings: ValidationError[]
  totalRows: number
  validRows: number
  duplicates: number
}

// Market data types
export interface CoinPrice {
  symbol: string
  price: number
  change24h: number
  lastUpdated: Date
}

export interface HistoricalPrice {
  symbol: string
  date: Date
  price: number
}

// Tax calculation types
export interface TaxCalculation {
  userId: string
  taxYear: number
  method: 'FIFO' | 'LIFO' | 'SPECIFIC_ID' | 'AVERAGE_COST'
  shortTermGains: number
  longTermGains: number
  totalGains: number
  totalTaxLiability: number
  transactions: TaxTransaction[]
  createdAt: Date
}

export interface TaxTransaction {
  transactionId: string
  symbol: string
  type: 'buy' | 'sell'
  date: Date
  amount: number
  costBasis: number
  salePrice?: number
  gainLoss?: number
  holdingPeriod?: number
  taxType?: 'short_term' | 'long_term'
}