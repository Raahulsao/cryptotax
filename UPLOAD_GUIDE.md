# 📁 File Upload Guide

## Supported File Types

### 📊 CSV Files
- **Binance Spot Trading History** - Trading transactions from Binance spot market
- **Binance Deposit History** - Deposit transactions from Binance
- **Binance Withdrawal History** - Withdrawal transactions from Binance
- **Coinbase Transaction History** - All Coinbase transactions
- **Kraken Ledger History** - Kraken trading and ledger data
- **Generic CSV** - Any CSV with standard transaction columns

### 📈 Excel Files
- **XLSX/XLS** - Excel workbooks (first sheet will be used)
- Supports all the same formats as CSV files

### 📄 PDF Files
- **Transaction Reports** - PDF files containing tabular transaction data
- **Experimental** - May not capture all data accurately

## File Size Limits
- **CSV**: 10MB maximum
- **Excel**: 25MB maximum  
- **PDF**: 50MB maximum

## How to Upload Files

### Step 1: Prepare Your File
1. Download your transaction history from your exchange
2. Ensure the file is in one of the supported formats
3. Check that the file size is within limits

### Step 2: Upload
1. Go to the **Upload** section in your dashboard
2. Select the appropriate exchange type from the dropdown
3. Drag and drop your file or click "Select File"
4. Wait for processing to complete

### Step 3: Review Results
- Check the upload progress and status
- Review any warnings or errors
- Verify that transactions were imported correctly

## Exchange-Specific Instructions

### Binance
**Spot Trading History:**
- Go to Binance → Wallet → Spot → Order History
- Click "Export" to download CSV
- Select "Binance Spot Trading" in the upload form

**Deposit History:**
- Go to Binance → Wallet → Spot → Deposit History
- Click "Export" to download CSV
- Select "Binance Deposit History" in the upload form

**Withdrawal History:**
- Go to Binance → Wallet → Spot → Withdrawal History
- Click "Export" to download CSV
- Select "Binance Withdrawal History" in the upload form

### Coinbase
1. Go to Coinbase → Reports → Generate Report
2. Select transaction history and download CSV
3. Select "Coinbase" in the upload form

### Kraken
1. Go to Kraken → History → Ledgers
2. Export as CSV
3. Select "Kraken" in the upload form

## Troubleshooting Common Issues

### "Upload failed" Error
**Possible causes:**
- File is too large
- Unsupported file format
- Network connection issues
- Authentication expired

**Solutions:**
1. Check file size and format
2. Try refreshing the page and logging in again
3. Check your internet connection
4. Try uploading a smaller file first

### "No valid transactions found" Error
**Possible causes:**
- Wrong exchange type selected
- File format doesn't match expected structure
- Empty or corrupted file

**Solutions:**
1. Verify you selected the correct exchange type
2. Check that your file contains transaction data
3. Try the "Auto-detect" option
4. Ensure the file wasn't corrupted during download

### "Permission denied" Error
**Possible causes:**
- User session expired
- Firebase authentication issues

**Solutions:**
1. Log out and log back in
2. Clear browser cache and cookies
3. Try using a different browser

### Processing Stuck at 0%
**Possible causes:**
- Large file taking time to process
- Server overload
- Network issues

**Solutions:**
1. Wait a few minutes for processing
2. Try uploading a smaller file
3. Check your internet connection
4. Refresh the page and try again

## File Format Examples

### Binance Deposit History CSV
```csv
Date(UTC+0),Coin,Network,Amount,Address,TXID,Status
25-07-27 07:35:40,USDT,BSC,3.47999517,0x2cf...,0xf69e...,Completed
```

### Binance Spot Trading CSV
```csv
Date,Market,Type,Price,Amount,Total,Fee,Fee Coin
2024-01-15 10:30:00,BTCUSDT,BUY,42000,0.1,4200,4.2,USDT
```

### Coinbase Transaction CSV
```csv
Timestamp,Transaction Type,Asset,Quantity Transacted,Spot Price Currency,Spot Price at Transaction,Subtotal,Total,Fees,Notes
2024-01-15T10:30:00Z,Buy,BTC,0.1,USD,42000,4200,4204.2,4.2,
```

## Best Practices

1. **Use Auto-detect**: Let the system automatically detect the file format
2. **Check file before upload**: Ensure the file contains the expected data
3. **Upload in batches**: For large datasets, split into smaller files
4. **Keep originals**: Save original files for backup
5. **Verify imports**: Check that transactions were imported correctly

## Getting Help

If you continue to have issues:

1. Check the browser console for error messages
2. Try uploading a sample file first
3. Contact support with:
   - File name and type
   - Error message
   - Browser and operating system
   - Steps you followed

## Supported Exchange Formats

| Exchange | Format | Description |
|----------|--------|-------------|
| Binance | Spot Trading | Buy/sell transactions from spot market |
| Binance | Deposit History | Incoming deposits to your account |
| Binance | Withdrawal History | Outgoing withdrawals from your account |
| Coinbase | Transaction History | All Coinbase transactions |
| Kraken | Ledger History | Trading and ledger data |
| Generic | CSV | Any CSV with standard columns |

## Column Mapping

The system automatically maps common column names:

- **Date/Time**: `Date`, `Timestamp`, `Time`, `DateTime`
- **Type**: `Type`, `Side`, `Transaction Type`, `Action`
- **Asset**: `Symbol`, `Asset`, `Coin`, `Currency`, `Pair`
- **Amount**: `Amount`, `Quantity`, `Qty`, `Volume`, `Vol`
- **Price**: `Price`, `Rate`, `Unit Price`
- **Fee**: `Fee`, `Fees`, `Commission`
- **Total**: `Total`, `Value`, `Total Value` 