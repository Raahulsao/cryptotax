# Portfolio Calculation Backend Fix - Design

## Overview

This design addresses the portfolio calculation backend issues to ensure accurate display of portfolio metrics based on parsed transaction data. The solution involves fixing the transaction parsing, improving portfolio calculation logic, enhancing market data integration, and ensuring proper data flow from upload to display.

## Architecture

### Current System Flow
```
Transaction Upload → CSV Parser → Database Storage → Portfolio Calculator → Market Data → Display
```

### Issues Identified
1. **Binance CSV Parsing**: Market field splitting incorrectly (splitting characters instead of trading pairs)
2. **Test Data Contamination**: Old test data interfering with real calculations
3. **Market Data Failures**: Graceful handling of API failures needed
4. **Cache Invalidation**: Portfolio cache not properly invalidated after new uploads
5. **Error Handling**: Better error messages and recovery mechanisms needed

## Components and Interfaces

### 1. Enhanced CSV Parser (`lib/parsers/csv-parser.ts`)

**Improvements:**
- Fix Binance market parsing to correctly split trading pairs
- Improve exchange format detection
- Better error handling and validation
- Support for more transaction types

**Key Methods:**
```typescript
private parseBinanceRow(row: BinanceSpotTransaction, userId: string, rowIndex: number): Transaction {
  // Fixed market parsing logic
  const market = row.Market.toUpperCase()
  const quoteCurrencies = ['USDT', 'USDC', 'BUSD', 'BNB', 'ETH', 'BTC']
  // Proper symbol extraction logic
}
```

### 2. Portfolio Calculator Service (`lib/services/portfolio-calculator.ts`)

**Enhancements:**
- Improved holding calculation with proper FIFO accounting
- Better handling of sell transactions with insufficient holdings
- Enhanced error handling and logging
- Proper realized vs unrealized gains calculation

**Key Methods:**
```typescript
async calculateUserPortfolio(userId: string): Promise<UserPortfolio> {
  // 1. Fetch all user transactions
  // 2. Calculate holdings using FIFO method
  // 3. Get current market prices
  // 4. Calculate current values and gains
  // 5. Compute allocations
  // 6. Cache results
}

private calculateHoldings(transactions: Transaction[]): Map<string, HoldingCalculation> {
  // Process transactions chronologically
  // Handle buy/sell/transfer/reward transactions
  // Calculate average cost basis
  // Track realized gains/losses
}
```

### 3. Market Data Service (`lib/services/market-data.ts`)

**Improvements:**
- Better error handling for API failures
- Fallback mechanisms for missing price data
- Improved caching strategy
- Rate limiting and retry logic

**Enhanced Methods:**
```typescript
async getCurrentPrices(symbols: string[]): Promise<CoinPrice[]> {
  // Batch API calls for efficiency
  // Handle API failures gracefully
  // Return partial results when possible
  // Cache successful responses
}
```

### 4. Database Service (`lib/services/database.ts`)

**Enhancements:**
- Portfolio cache invalidation on new transactions
- Better transaction querying and filtering
- Improved error handling and logging
- Transaction deduplication logic

**Key Methods:**
```typescript
async saveTransactionsBatch(transactions: Transaction[]): Promise<void> {
  // Save transactions in batch
  // Invalidate portfolio cache
  // Log operation for debugging
}

async invalidatePortfolioCache(userId: string): Promise<void> {
  // Clear cached portfolio data
  // Force recalculation on next request
}
```

### 5. API Routes Enhancement

**Portfolio API (`app/api/portfolio/route.ts`):**
- Better error handling and logging
- Cache management
- Force recalculation option
- Proper response formatting

**Metrics API (`app/api/portfolio/metrics/route.ts`):**
- Enhanced performance calculations
- Better error handling
- Consistent response format

## Data Models

### Enhanced Transaction Model
```typescript
interface Transaction {
  id: string
  userId: string
  timestamp: Date
  type: TransactionType
  symbol: string // Properly parsed base symbol (e.g., 'BTC' from 'BTCUSDT')
  amount: number
  price: number
  fee: number
  feeCurrency?: string
  totalValue: number
  exchange: ExchangeType
  notes?: string
  rawData: any
  processed: boolean
  createdAt: Date
  updatedAt: Date
}
```

### Portfolio Calculation Model
```typescript
interface HoldingCalculation {
  symbol: string
  totalAmount: number
  totalInvested: number
  averageCostBasis: number
  transactions: Transaction[]
  realizedGainLoss: number
  unrealizedGainLoss?: number
}
```

## Error Handling

### 1. CSV Parsing Errors
- Graceful handling of malformed data
- Detailed error messages with row numbers
- Partial success processing (save valid transactions)
- User-friendly error reporting

### 2. Market Data Errors
- Fallback to cached prices when API fails
- Graceful degradation with zero prices
- Retry mechanisms with exponential backoff
- User notification of stale data

### 3. Calculation Errors
- Handle edge cases (negative holdings, missing data)
- Log warnings for unusual situations
- Provide default values for missing calculations
- Clear error messages for users

## Testing Strategy

### 1. Unit Tests
- CSV parser with various exchange formats
- Portfolio calculation with different transaction scenarios
- Market data service with API mocking
- Database operations with test data

### 2. Integration Tests
- End-to-end transaction upload and portfolio calculation
- API endpoint testing with real data
- Cache invalidation and refresh scenarios
- Error handling and recovery testing

### 3. Test Data Scenarios
```typescript
// Test scenarios to cover:
const testScenarios = [
  'Binance CSV with BTCUSDT, ETHUSDT pairs',
  'Mixed buy/sell transactions with gains/losses',
  'Insufficient holdings for sell transactions',
  'Market data API failures',
  'Empty portfolio state',
  'Large portfolio with many holdings',
  'Transactions with high fees',
  'Multiple exchange formats'
]
```

## Performance Considerations

### 1. Caching Strategy
- Cache portfolio calculations for 5 minutes
- Cache market prices for 1 minute
- Invalidate cache on new transactions
- Use Redis for production caching

### 2. Database Optimization
- Index on userId and timestamp for transaction queries
- Batch operations for multiple transactions
- Efficient aggregation queries
- Connection pooling

### 3. API Rate Limiting
- Respect CoinGecko API limits
- Batch price requests when possible
- Implement exponential backoff
- Cache responses appropriately

## Security Considerations

### 1. Data Validation
- Validate all transaction data before processing
- Sanitize user inputs
- Prevent injection attacks
- Rate limit API endpoints

### 2. User Data Protection
- Ensure users can only access their own data
- Encrypt sensitive transaction data
- Audit trail for data access
- Secure API token handling

## Deployment Strategy

### 1. Database Migration
- Clean up any existing test data
- Ensure proper indexes are in place
- Backup existing data before changes
- Gradual rollout with monitoring

### 2. API Deployment
- Deploy with feature flags
- Monitor error rates and performance
- Rollback plan for issues
- User communication about improvements

### 3. Monitoring and Alerting
- Track portfolio calculation success rates
- Monitor market data API health
- Alert on high error rates
- Performance metrics dashboard