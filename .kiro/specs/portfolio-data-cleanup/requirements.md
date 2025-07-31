# Portfolio Data Cleanup - Requirements Document

## Introduction

The crypto tax dashboard is currently displaying mixed portfolio data that includes both real USDT deposits and test data (assets A, B, E with $0 values). This creates confusion for users and makes it difficult to see accurate portfolio information. We need to clean up the test data and ensure the portfolio only shows real transaction data.

## Requirements

### Requirement 1: Clean Test Data

**User Story:** As a user, I want to see only my real cryptocurrency transactions in the portfolio, so that I can accurately track my actual investments and gains.

#### Acceptance Criteria

1. WHEN I view the portfolio overview THEN the system SHALL display only real transactions (USDT deposits from Binance)
2. WHEN test data exists in the database THEN the system SHALL provide a way to remove it
3. WHEN test data is removed THEN the portfolio SHALL recalculate to show accurate values
4. WHEN duplicate transactions are uploaded THEN the system SHALL continue to prevent duplicates using TXID matching

### Requirement 2: Portfolio Data Accuracy

**User Story:** As a user, I want my portfolio to show accurate investment amounts and current values, so that I can make informed financial decisions.

#### Acceptance Criteria

1. WHEN viewing Total Invested THEN the system SHALL show the sum of all real deposit amounts
2. WHEN viewing Total Worth THEN the system SHALL show current market value of actual holdings
3. WHEN viewing Total Gains THEN the system SHALL calculate gains based only on real transactions
4. WHEN viewing Holdings Breakdown THEN the system SHALL show only assets with actual balances

### Requirement 3: Test Data Management

**User Story:** As a developer, I want to be able to clean up test data easily, so that I can maintain a clean development environment.

#### Acceptance Criteria

1. WHEN cleanup API is called THEN the system SHALL remove all test transactions for the user
2. WHEN cleanup is performed THEN the system SHALL invalidate portfolio cache
3. WHEN cleanup is complete THEN the system SHALL return success confirmation
4. WHEN cleanup fails THEN the system SHALL provide clear error messages

### Requirement 4: Data Consistency

**User Story:** As a user, I want consistent data across all dashboard views, so that I can trust the information displayed.

#### Acceptance Criteria

1. WHEN portfolio is recalculated THEN all dashboard metrics SHALL be consistent
2. WHEN cache is invalidated THEN fresh data SHALL be loaded from the database
3. WHEN new transactions are added THEN portfolio SHALL update automatically
4. WHEN viewing transaction history THEN it SHALL match portfolio calculations