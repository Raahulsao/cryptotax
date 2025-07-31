# Crypto Transaction Backend Design

## Overview

This document outlines the technical design for a comprehensive crypto transaction processing backend that will transform uploaded files into dynamic, personalized dashboard data. The system will handle file parsing, data standardization, real-time calculations, and report generation.

## Architecture

### System Architecture Diagram

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   API Gateway   │    │   File Storage  │
│   (Next.js)     │◄──►│   (Next.js API) │◄──►│   (Firebase)    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │
                                ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Queue System  │◄──►│  Processing     │◄──►│   Database      │
│   (Bull/Redis)  │    │  Engine         │    │   (Firestore)   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │
                                ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  Market Data    │◄──►│  Tax Engine     │◄──►│  Report Gen     │
│  (CoinGecko)    │    │  (Calculations) │    │  (PDF/Excel)    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## Components and Interfaces

### 1. File Upload Service

**Purpose**: Handle file uploads and initial validation

**Technologies**: 
- Multer for file handling
- Firebase Storage for file storage
- Sharp for image processing (PDF thumbnails)

**API Endpoints**:
```typescript
POST /api/upload/transactions
- Accepts: multipart/form-data
- Supports: .csv, .xlsx, .xls, .pdf
- Max size: 50MB per file
- Returns: { uploadId, status, message }

GET /api/upload/status/:uploadId
- Returns: { status, progress, errors, results }
```

### 2. File Processing Engine

**Purpose**: Parse and standardize transaction data from various formats

**Components**:
- CSV Parser (Papa Parse)
- Excel Parser (ExcelJS)
- PDF Parser (PDF-Parse + OCR)
- Exchange Format Handlers

**Processing Pipeline**:
```typescript
interface ProcessingPipeline {
  1. File Validation
  2. Format Detection
  3. Data Extraction
  4. Data Standardization
  5. Duplicate Detection
  6. Data Validation
  7. Database Storage
  8. Cache Invalidation
}
```

### 3. Transaction Data Model

**Standardized Transaction Schema**:
```typescript
interface Transaction {
  id: string
  userId: string
  exchangeId?: string
  timestamp: Date
  type: 'buy' | 'sell' | 'trade' | 'stake' | 'unstake' | 'reward' | 'airdrop' | 'transfer'
  baseCurrency: string
  quoteCurrency?: string
  amount: number
  price?: number
  fee?: number
  feeCurrency?: string
  totalValue: number
  notes?: string
  source: 'binance' | 'coinbase' | 'kraken' | 'manual' | 'other'
  rawData: any // Original data for debugging
  processed: boolean
  createdAt: Date
  updatedAt: Date
}
```

### 4. Portfolio Analytics Engine

**Purpose**: Calculate real-time portfolio metrics and analytics

**Core Functions**:
```typescript
interface PortfolioEngine {
  calculateCurrentHoldings(userId: string): Promise<Holding[]>
  calculatePortfolioValue(userId: string): Promise<PortfolioValue>
  calculateAllocation(userId: string): Promise<AllocationData[]>
  calculateGainsLosses(userId: string, method: 'FIFO' | 'LIFO'): Promise<GainLoss[]>
  calculateTaxLiability(userId: string, taxYear: number): Promise<TaxSummary>
  generateInsights(userId: string): Promise<Insight[]>
}
```

### 5. Market Data Service

**Purpose**: Fetch and cache real-time and historical crypto prices

**Data Sources**:
- CoinGecko API (primary)
- CoinMarketCap API (backup)
- Binance API (for real-time prices)

**Caching Strategy**:
```typescript
interface MarketDataCache {
  currentPrices: Map<string, PriceData> // 1-minute cache
  historicalPrices: Map<string, HistoricalPrice[]> // 1-hour cache
  coinMetadata: Map<string, CoinInfo> // 24-hour cache
}
```

### 6. Tax Calculation Engine

**Purpose**: Calculate crypto taxes based on various accounting methods

**Supported Methods**:
- FIFO (First In, First Out)
- LIFO (Last In, First Out)
- Specific Identification
- Average Cost Basis

**Tax Categories**:
```typescript
interface TaxCalculation {
  shortTermGains: number
  longTermGains: number
  ordinaryIncome: number // Staking, mining rewards
  totalTaxLiability: number
  deductions: number
  netTaxableIncome: number
}
```

## Data Models

### User Portfolio Schema
```typescript
interface UserPortfolio {
  userId: string
  totalValue: number
  totalInvested: number
  totalGains: number
  totalGainsPercent: number
  holdings: Holding[]
  lastUpdated: Date
}

interface Holding {
  symbol: string
  name: string
  amount: number
  averageCostBasis: number
  currentPrice: number
  currentValue: number
  gainLoss: number
  gainLossPercent: number
  allocation: number
}
```

### Exchange Format Handlers

**Binance CSV Format**:
```typescript
interface BinanceTransaction {
  Date: string
  Market: string
  Type: 'BUY' | 'SELL'
  Price: string
  Amount: string
  Total: string
  Fee: string
  'Fee Coin': string
}
```

**Coinbase CSV Format**:
```typescript
interface CoinbaseTransaction {
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
```

## Error Handling

### File Processing Errors
```typescript
enum ProcessingError {
  INVALID_FILE_FORMAT = 'INVALID_FILE_FORMAT',
  FILE_TOO_LARGE = 'FILE_TOO_LARGE',
  CORRUPTED_FILE = 'CORRUPTED_FILE',
  MISSING_REQUIRED_COLUMNS = 'MISSING_REQUIRED_COLUMNS',
  INVALID_DATA_FORMAT = 'INVALID_DATA_FORMAT',
  DUPLICATE_TRANSACTIONS = 'DUPLICATE_TRANSACTIONS',
  PROCESSING_TIMEOUT = 'PROCESSING_TIMEOUT'
}
```

### Error Recovery Strategies
1. **Partial Processing**: Process valid transactions, report errors for invalid ones
2. **Retry Logic**: Exponential backoff for temporary failures
3. **Fallback Parsing**: Try alternative parsing methods if primary fails
4. **User Feedback**: Detailed error messages with suggested fixes

## Testing Strategy

### Unit Tests
- File parser functions
- Tax calculation algorithms
- Portfolio calculation logic
- Data validation functions

### Integration Tests
- End-to-end file processing
- API endpoint testing
- Database operations
- External API integrations

### Performance Tests
- Large file processing (10MB+ CSV files)
- Concurrent user uploads
- Database query performance
- Memory usage optimization

### Test Data Sets
```typescript
interface TestDataSets {
  binanceSmall: 'binance_100_transactions.csv'
  binanceLarge: 'binance_10000_transactions.csv'
  coinbaseBasic: 'coinbase_basic_trades.csv'
  krakenComplex: 'kraken_margin_trades.csv'
  multiExchange: 'combined_exchanges.csv'
  corruptedFile: 'corrupted_data.csv'
  emptyFile: 'empty.csv'
}
```

## Security Considerations

### File Upload Security
1. **File Type Validation**: Strict MIME type checking
2. **Virus Scanning**: Integrate with antivirus service
3. **Size Limits**: Prevent DoS attacks
4. **Content Validation**: Scan for malicious content

### Data Protection
1. **Encryption at Rest**: Encrypt sensitive transaction data
2. **Encryption in Transit**: HTTPS for all communications
3. **Access Control**: User can only access their own data
4. **Data Retention**: Automatic deletion of old files

### API Security
1. **Rate Limiting**: Prevent abuse of upload endpoints
2. **Authentication**: Firebase Auth tokens required
3. **Input Validation**: Sanitize all user inputs
4. **Audit Logging**: Log all data access and modifications

## Performance Optimization

### Database Optimization
```sql
-- Indexes for fast queries
CREATE INDEX idx_transactions_user_timestamp ON transactions(userId, timestamp DESC);
CREATE INDEX idx_transactions_symbol ON transactions(baseCurrency);
CREATE INDEX idx_portfolio_user ON user_portfolio(userId);
```

### Caching Strategy
1. **Redis Cache**: Store calculated portfolio data
2. **CDN**: Cache static assets and reports
3. **Application Cache**: In-memory cache for frequently accessed data
4. **Database Query Cache**: Cache expensive aggregation queries

### Background Processing
```typescript
interface JobQueue {
  fileProcessing: Queue<FileProcessingJob>
  portfolioCalculation: Queue<PortfolioCalculationJob>
  reportGeneration: Queue<ReportGenerationJob>
  marketDataUpdate: Queue<MarketDataUpdateJob>
}
```

## Monitoring and Logging

### Key Metrics
- File processing success rate
- Average processing time
- API response times
- Database query performance
- Error rates by type

### Logging Strategy
```typescript
interface LogEntry {
  timestamp: Date
  level: 'info' | 'warn' | 'error'
  userId?: string
  action: string
  details: any
  duration?: number
  error?: Error
}
```

### Alerting
- File processing failures
- High error rates
- Performance degradation
- External API failures
- Database connection issues

This design provides a robust, scalable foundation for processing crypto transaction files and generating dynamic, personalized dashboard data. The modular architecture allows for easy extension and maintenance while ensuring security and performance.