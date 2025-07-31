# Implementation Plan

- [ ] 1. Fix TypeScript compilation issues
  - Resolve `cleanupTestData` method recognition error in TypeScript compiler
  - Ensure proper method signatures and class structure
  - Verify all imports and exports are correct
  - _Requirements: 3.3_

- [ ] 2. Enhance database cleanup method
  - [ ] 2.1 Implement transaction classification logic
    - Write function to identify test vs real transactions based on asset symbols and data patterns
    - Add logic to detect test assets (A, B, E) and unrealistic transaction data
    - Create validation for real USDT deposits with valid TXIDs
    - _Requirements: 1.1, 1.2_

  - [ ] 2.2 Improve cleanup method with detailed reporting
    - Enhance `cleanupTestData` method to return detailed cleanup results
    - Add transaction counting and categorization during cleanup
    - Implement comprehensive error handling and logging
    - _Requirements: 3.1, 3.2, 3.4_

  - [ ] 2.3 Add portfolio cache invalidation verification
    - Ensure portfolio cache is properly cleared after cleanup
    - Add verification that cache invalidation was successful
    - Implement fallback cache clearing mechanisms
    - _Requirements: 3.2, 4.2_

- [ ] 3. Enhance cleanup API endpoint
  - [ ] 3.1 Improve API response structure
    - Return detailed cleanup results including counts and status
    - Add proper error handling with specific error messages
    - Implement request validation and authentication checks
    - _Requirements: 3.1, 3.3, 3.4_

  - [ ] 3.2 Add cleanup operation logging
    - Log all cleanup attempts with user ID and timestamp
    - Track cleanup results and performance metrics
    - Implement audit trail for cleanup operations
    - _Requirements: 3.3, 4.3_

- [ ] 4. Implement portfolio data validation
  - [ ] 4.1 Add data consistency checks
    - Create validation logic to verify portfolio calculations match transaction data
    - Implement checks for suspicious or inconsistent data
    - Add warnings for potential data quality issues
    - _Requirements: 2.1, 2.2, 2.3, 4.1_

  - [ ] 4.2 Create portfolio recalculation trigger
    - Implement automatic portfolio recalculation after cleanup
    - Ensure all cached data is refreshed properly
    - Add verification that recalculation completed successfully
    - _Requirements: 2.1, 2.2, 2.3, 4.2_

- [ ] 5. Test cleanup functionality
  - [ ] 5.1 Create unit tests for cleanup methods
    - Write tests for transaction classification logic
    - Test cleanup method with various data scenarios
    - Verify error handling and edge cases
    - _Requirements: 1.1, 1.2, 3.1, 3.2_

  - [ ] 5.2 Test API endpoint functionality
    - Test cleanup API with valid and invalid requests
    - Verify authentication and authorization
    - Test error responses and success scenarios
    - _Requirements: 3.1, 3.3, 3.4_

  - [ ] 5.3 Validate portfolio accuracy after cleanup
    - Test that portfolio shows only real USDT deposits after cleanup
    - Verify Total Invested matches actual deposit amounts (~$788)
    - Confirm duplicate detection continues to work properly
    - _Requirements: 1.1, 1.3, 2.1, 2.2, 2.4_

- [ ] 6. Implement frontend cleanup controls
  - [ ] 6.1 Add cleanup trigger to dashboard
    - Create cleanup button or control in development mode
    - Add confirmation dialog for cleanup operations
    - Display cleanup progress and results
    - _Requirements: 3.1, 3.3_

  - [ ] 6.2 Show data source indicators
    - Add indicators to show which transactions are real vs test data
    - Display data quality metrics and warnings
    - Show last cleanup timestamp and results
    - _Requirements: 4.1, 4.4_

- [ ] 7. Verify complete solution
  - [ ] 7.1 End-to-end testing
    - Test complete cleanup workflow from API to frontend
    - Verify portfolio displays accurate data after cleanup
    - Confirm all dashboard metrics are consistent
    - _Requirements: 1.1, 1.2, 1.3, 2.1, 2.2, 2.3, 4.1_

  - [ ] 7.2 Performance and reliability testing
    - Test cleanup operations with large datasets
    - Verify error handling and recovery mechanisms
    - Test concurrent cleanup requests and rate limiting
    - _Requirements: 3.2, 3.3, 3.4_