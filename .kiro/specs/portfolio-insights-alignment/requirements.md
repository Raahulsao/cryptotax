# Portfolio and Insights Page Data Alignment Requirements

## Introduction

This specification addresses the need to properly align the portfolio and insights pages with the actual uploaded transaction file data, ensuring consistency between overview, transaction, and portfolio data across all dashboard sections.

## Requirements

### Requirement 1: Portfolio Page Data Alignment

**User Story:** As a user who has uploaded transaction files, I want the portfolio page to show accurate data that matches my uploaded transactions, so that I can trust the portfolio allocation and statistics.

#### Acceptance Criteria

1. WHEN I view the portfolio section THEN the system SHALL display portfolio allocation based on actual uploaded transaction data
2. WHEN I view portfolio statistics THEN the system SHALL show metrics calculated from real transaction data instead of mock data
3. WHEN I compare portfolio data with overview data THEN the system SHALL show consistent values across all sections
4. WHEN I view asset holdings THEN the system SHALL display actual holdings calculated from transaction history
5. WHEN I view portfolio performance THEN the system SHALL show real gains/losses based on uploaded data

### Requirement 2: Portfolio Allocation Accuracy

**User Story:** As a user, I want to see accurate portfolio allocation percentages and values, so that I can make informed investment decisions.

#### Acceptance Criteria

1. WHEN I view portfolio allocation THEN the system SHALL calculate percentages based on current market values of actual holdings
2. WHEN I view asset distribution THEN the system SHALL show only assets that I actually hold based on transaction history
3. WHEN I view allocation charts THEN the system SHALL display real-time data from the portfolio calculator
4. WHEN I view individual asset values THEN the system SHALL show current market value multiplied by actual holdings
5. WHEN allocation percentages are calculated THEN the system SHALL ensure they total 100% for all holdings

### Requirement 3: Insights Page Data Integration

**User Story:** As a user, I want the insights page to provide meaningful analytics based on my actual transaction data, so that I can optimize my tax strategy and portfolio performance.

#### Acceptance Criteria

1. WHEN I view insights THEN the system SHALL generate insights from actual transaction and portfolio data
2. WHEN I view tax optimization suggestions THEN the system SHALL base recommendations on real realized/unrealized gains
3. WHEN I view performance metrics THEN the system SHALL calculate metrics from actual transaction history
4. WHEN I view monthly activity charts THEN the system SHALL show data derived from uploaded transaction timestamps
5. WHEN I view asset distribution insights THEN the system SHALL reflect actual portfolio composition

### Requirement 4: Data Consistency Across Sections

**User Story:** As a user, I want all dashboard sections to show consistent data, so that I can trust the accuracy of the information presented.

#### Acceptance Criteria

1. WHEN I navigate between overview, portfolio, and insights sections THEN the system SHALL show consistent total portfolio values
2. WHEN I view transaction counts THEN the system SHALL show the same numbers across all relevant sections
3. WHEN I view gains/losses THEN the system SHALL display consistent values in all sections that show this data
4. WHEN I view asset holdings THEN the system SHALL show the same holdings and amounts across all sections
5. WHEN data is updated THEN the system SHALL refresh all sections to maintain consistency

### Requirement 5: Real-Time Portfolio Calculations

**User Story:** As a user, I want my portfolio data to be calculated in real-time based on current market prices, so that I see accurate current values.

#### Acceptance Criteria

1. WHEN I view portfolio values THEN the system SHALL use current market prices for calculations
2. WHEN I refresh portfolio data THEN the system SHALL recalculate all values with latest market data
3. WHEN I view unrealized gains THEN the system SHALL calculate based on current market prices vs. cost basis
4. WHEN I view portfolio allocation THEN the system SHALL use current market values for percentage calculations
5. WHEN market prices change THEN the system SHALL allow manual refresh to update displayed values

### Requirement 6: Transaction-Based Holdings Calculation

**User Story:** As a user, I want my portfolio holdings to be accurately calculated from my transaction history, so that the data reflects my actual positions.

#### Acceptance Criteria

1. WHEN I view holdings THEN the system SHALL calculate amounts from all buy/sell/transfer transactions
2. WHEN I have multiple transactions for the same asset THEN the system SHALL aggregate them correctly
3. WHEN I have sold some of an asset THEN the system SHALL show the remaining balance accurately
4. WHEN I have transferred assets THEN the system SHALL account for transfers in/out correctly
5. WHEN calculating cost basis THEN the system SHALL use appropriate accounting method (FIFO/LIFO/Average)

### Requirement 7: Enhanced Portfolio Statistics

**User Story:** As a user, I want to see comprehensive portfolio statistics that help me understand my investment performance, so that I can make better financial decisions.

#### Acceptance Criteria

1. WHEN I view portfolio statistics THEN the system SHALL show total invested amount from transaction history
2. WHEN I view performance metrics THEN the system SHALL display current value, gains/losses, and percentage returns
3. WHEN I view asset performance THEN the system SHALL show individual asset gains/losses and performance
4. WHEN I view portfolio diversity THEN the system SHALL show allocation percentages and concentration metrics
5. WHEN I view historical performance THEN the system SHALL show performance trends over time

### Requirement 8: Insights Based on Real Data

**User Story:** As a user, I want actionable insights generated from my actual trading data, so that I can optimize my tax situation and portfolio performance.

#### Acceptance Criteria

1. WHEN I view tax insights THEN the system SHALL analyze actual realized/unrealized gains for optimization opportunities
2. WHEN I view performance insights THEN the system SHALL identify best/worst performing assets from my portfolio
3. WHEN I view trading insights THEN the system SHALL analyze transaction patterns and frequency
4. WHEN I view allocation insights THEN the system SHALL suggest rebalancing based on actual holdings
5. WHEN I view trend insights THEN the system SHALL show monthly/quarterly activity patterns from real data