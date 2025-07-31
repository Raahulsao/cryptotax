# Portfolio Calculation Backend Fix - Requirements

## Introduction

The portfolio calculation backend needs to be fixed to accurately display portfolio metrics based on parsed transaction data instead of showing test data. Users should see correct portfolio allocation, total worth, total gains, total invested, and taxable gains based on their uploaded transaction files.

## Requirements

### Requirement 1: Accurate Portfolio Calculation

**User Story:** As a user who has uploaded transaction files, I want to see accurate portfolio metrics calculated from my actual transaction data, so that I can make informed investment decisions.

#### Acceptance Criteria

1. WHEN a user uploads transaction files THEN the system SHALL parse and store the transactions correctly in the database
2. WHEN portfolio calculations are performed THEN the system SHALL use only the user's actual transaction data
3. WHEN calculating holdings THEN the system SHALL properly handle buy/sell transactions using FIFO accounting
4. WHEN calculating total worth THEN the system SHALL fetch current market prices for all holdings
5. WHEN calculating total invested THEN the system SHALL sum the cost basis of all purchases including fees
6. WHEN calculating total gains THEN the system SHALL compute (current value - total invested + realized gains)
7. WHEN calculating portfolio allocation THEN the system SHALL show percentage allocation for each holding

### Requirement 2: Real-time Market Data Integration

**User Story:** As a user, I want my portfolio values to reflect current market prices, so that I can see up-to-date portfolio performance.

#### Acceptance Criteria

1. WHEN displaying portfolio metrics THEN the system SHALL fetch current market prices from CoinGecko API
2. WHEN market data is unavailable THEN the system SHALL handle errors gracefully and show appropriate messages
3. WHEN calculating current values THEN the system SHALL multiply holdings by current market prices
4. WHEN market data is cached THEN the system SHALL refresh prices at appropriate intervals

### Requirement 3: Transaction Processing Accuracy

**User Story:** As a user, I want my transactions to be processed accurately regardless of exchange format, so that my portfolio reflects my actual trading history.

#### Acceptance Criteria

1. WHEN processing Binance transactions THEN the system SHALL correctly parse trading pairs (e.g., BTCUSDT → BTC)
2. WHEN processing buy transactions THEN the system SHALL increase holdings and cost basis
3. WHEN processing sell transactions THEN the system SHALL decrease holdings and calculate realized gains
4. WHEN processing transactions with fees THEN the system SHALL include fees in cost calculations
5. WHEN handling insufficient holdings for sells THEN the system SHALL log warnings but continue processing

### Requirement 4: Portfolio Metrics Display

**User Story:** As a user, I want to see comprehensive portfolio metrics including allocation charts and performance data, so that I can understand my investment performance.

#### Acceptance Criteria

1. WHEN viewing portfolio overview THEN the system SHALL display total worth, total invested, total gains, and taxable gains
2. WHEN portfolio has holdings THEN the system SHALL show allocation pie chart with percentages
3. WHEN calculating performance metrics THEN the system SHALL identify best and worst performing assets
4. WHEN displaying gains THEN the system SHALL show both absolute amounts and percentages
5. WHEN no transactions exist THEN the system SHALL show empty state with upload prompt

### Requirement 5: Data Consistency and Caching

**User Story:** As a user, I want my portfolio data to be consistent and performant, so that I have a smooth experience when viewing my portfolio.

#### Acceptance Criteria

1. WHEN portfolio is calculated THEN the system SHALL cache results to improve performance
2. WHEN new transactions are uploaded THEN the system SHALL invalidate and recalculate portfolio cache
3. WHEN displaying cached data THEN the system SHALL show last updated timestamp
4. WHEN user requests refresh THEN the system SHALL recalculate portfolio with current market prices
5. WHEN calculations fail THEN the system SHALL show appropriate error messages and retry options