# Portfolio Data Cleanup - Design Document

## Overview

This design addresses the portfolio data cleanup issue where test data is mixed with real USDT deposit transactions, causing inaccurate portfolio displays. The solution involves implementing a comprehensive cleanup mechanism and ensuring data consistency across the dashboard.

## Architecture

### Current State Analysis
- Portfolio shows mixed data: real USDT deposits + test assets (A, B, E, BTC, ETH, ADA)
- Test assets have $0 values indicating they're not real holdings
- Duplicate detection is working correctly (21 USDT deposits properly identified as duplicates)
- TypeScript compilation issue with `cleanupTestData` method (runtime works fine)

### Target State
- Portfolio displays only real USDT deposits (~$788 total based on Binance CSV)
- Clean separation between test and production data
- Accurate portfolio calculations and metrics
- Resolved TypeScript compilation issues

## Components and Interfaces

### 1. Database Service Enhancement
**File:** `lib/services/database.ts`

```typescript
class DatabaseService {
  // Enhanced cleanup method with better error handling
  async cleanupTestData(userId: string): Promise<{
    deletedTransactions: number;
    deletedJobs: number;
    portfolioCacheCleared: boolean;
  }>;
  
  // Method to identify test vs real transactions
  async identifyTestTransactions(userId: string): Promise<{
    testTransactions: Transaction[];
    realTransactions: Transaction[];
  }>;
  
  // Enhanced portfolio invalidation
  async invalidatePortfolioCache(userId: string): Promise<void>;
}
```

### 2. Cleanup API Enhancement
**File:** `app/api/cleanup/route.ts`

```typescript
// Enhanced response with detailed cleanup results
interface CleanupResponse {
  success: boolean;
  message: string;
  details: {
    deletedTransactions: number;
    deletedJobs: number;
    portfolioCacheCleared: boolean;
  };
}
```

### 3. Portfolio Service Integration
**File:** `lib/services/portfolio-calculator.ts`

- Ensure portfolio calculations exclude test data
- Add validation to identify suspicious transactions
- Implement data consistency checks

### 4. Frontend Integration
**File:** `components/portfolio-overview.tsx`

- Add cleanup trigger button (development mode)
- Display data source indicators
- Show loading states during cleanup

## Data Models

### Transaction Classification
```typescript
interface TransactionClassification {
  isTestData: boolean;
  confidence: number;
  reasons: string[];
}

// Classification criteria:
// - Assets with symbols A, B, E = test data
// - Transactions with unrealistic prices = test data
// - USDT deposits with valid TXIDs = real data
```

### Cleanup Result
```typescript
interface CleanupResult {
  deletedTransactions: number;
  deletedJobs: number;
  portfolioCacheCleared: boolean;
  errors: string[];
  warnings: string[];
}
```

## Error Handling

### 1. TypeScript Compilation Issues
- **Problem:** `cleanupTestData` method not recognized by TypeScript compiler
- **Solution:** Ensure method is properly defined within class scope
- **Fallback:** Add explicit type declarations if needed

### 2. Database Operation Failures
- **Batch Operations:** Use Firebase batch writes with rollback capability
- **Cache Invalidation:** Handle cache deletion failures gracefully
- **Logging:** Comprehensive error logging with context

### 3. Data Consistency Issues
- **Validation:** Verify portfolio calculations after cleanup
- **Rollback:** Ability to restore data if cleanup causes issues
- **Monitoring:** Track cleanup operations and their effects

## Testing Strategy

### 1. Unit Tests
```typescript
describe('DatabaseService.cleanupTestData', () => {
  it('should remove only test transactions');
  it('should preserve real USDT deposits');
  it('should invalidate portfolio cache');
  it('should handle errors gracefully');
});
```

### 2. Integration Tests
```typescript
describe('Portfolio Cleanup Integration', () => {
  it('should show accurate portfolio after cleanup');
  it('should maintain duplicate detection');
  it('should update all dashboard metrics');
});
```

### 3. Manual Testing Checklist
- [ ] Verify portfolio shows only USDT deposits after cleanup
- [ ] Confirm Total Invested matches actual deposit amounts
- [ ] Check that duplicate detection still works
- [ ] Validate all dashboard metrics are consistent
- [ ] Test cleanup API endpoint functionality

## Implementation Approach

### Phase 1: Fix TypeScript Issues
1. Resolve `cleanupTestData` method compilation error
2. Ensure proper method signatures and exports
3. Verify all imports and dependencies

### Phase 2: Enhance Cleanup Logic
1. Implement transaction classification logic
2. Add detailed cleanup reporting
3. Improve error handling and logging

### Phase 3: Portfolio Data Validation
1. Add data consistency checks
2. Implement portfolio recalculation triggers
3. Ensure cache invalidation works properly

### Phase 4: Frontend Integration
1. Add cleanup controls to dashboard
2. Display cleanup results and status
3. Show data source indicators

## Security Considerations

### Authentication
- Cleanup API requires valid JWT token
- User can only clean their own data
- Rate limiting on cleanup operations

### Data Protection
- Backup critical data before cleanup
- Audit trail for cleanup operations
- Rollback capability for accidental deletions

## Performance Considerations

### Database Operations
- Use batch operations for efficiency
- Minimize database round trips
- Implement proper indexing for queries

### Cache Management
- Efficient cache invalidation
- Avoid unnecessary recalculations
- Optimize portfolio data loading

## Monitoring and Logging

### Cleanup Operations
- Log all cleanup attempts and results
- Track performance metrics
- Monitor error rates and patterns

### Data Quality
- Monitor portfolio calculation accuracy
- Track duplicate detection effectiveness
- Alert on data inconsistencies