/**
 * Enhanced File Parser
 * Supports CSV, Excel (XLSX, XLS), and PDF file parsing for transaction data
 */

import * as ExcelJS from 'exceljs'
// PDF parsing will be dynamically imported to avoid build issues
import { csvParser } from './csv-parser'
import { ParseResult, ValidationError } from '@/lib/types/transaction'

export interface FileParseOptions {
  userId: string
  exchangeType?: string
  sheetName?: string // For Excel files
  skipRows?: number // Number of rows to skip at the beginning
  dateFormat?: string // Expected date format
}

export interface SupportedFileType {
  extension: string
  mimeTypes: string[]
  description: string
  maxSize: number // in bytes
}

export class FileParser {
  private static readonly SUPPORTED_FILE_TYPES: SupportedFileType[] = [
    {
      extension: 'csv',
      mimeTypes: [
        'text/csv',
        'application/csv',
        'text/plain'
      ],
      description: 'Comma Separated Values',
      maxSize: 10 * 1024 * 1024 // 10MB
    },
    {
      extension: 'xlsx',
      mimeTypes: [
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      ],
      description: 'Excel Workbook (XLSX)',
      maxSize: 25 * 1024 * 1024 // 25MB
    },
    {
      extension: 'xls',
      mimeTypes: [
        'application/vnd.ms-excel'
      ],
      description: 'Excel Workbook (XLS)',
      maxSize: 25 * 1024 * 1024 // 25MB
    },
    {
      extension: 'pdf',
      mimeTypes: [
        'application/pdf'
      ],
      description: 'Portable Document Format',
      maxSize: 50 * 1024 * 1024 // 50MB
    }
  ]

  /**
   * Get supported file types
   */
  static getSupportedFileTypes(): SupportedFileType[] {
    return this.SUPPORTED_FILE_TYPES
  }

  /**
   * Validate file type and size
   */
  static validateFile(file: File): { isValid: boolean; error?: string } {
    // Check file size first
    const fileType = this.getFileTypeByName(file.name)
    if (!fileType) {
      return {
        isValid: false,
        error: `Unsupported file type. Supported formats: ${this.SUPPORTED_FILE_TYPES.map(t => t.extension.toUpperCase()).join(', ')}`
      }
    }

    if (file.size > fileType.maxSize) {
      const maxSizeMB = Math.round(fileType.maxSize / (1024 * 1024))
      return {
        isValid: false,
        error: `File size exceeds ${maxSizeMB}MB limit for ${fileType.extension.toUpperCase()} files`
      }
    }

    // Check MIME type if available
    if (file.type && !fileType.mimeTypes.includes(file.type)) {
      // Some browsers don't set MIME type correctly, so we'll be lenient
      console.warn(`MIME type mismatch: expected ${fileType.mimeTypes.join(' or ')}, got ${file.type}`)
    }

    return { isValid: true }
  }

  /**
   * Parse file based on its type
   */
  static async parseFile(file: File, options: FileParseOptions): Promise<ParseResult> {
    try {
      // Validate file first
      const validation = this.validateFile(file)
      if (!validation.isValid) {
        return {
          transactions: [],
          errors: [{
            row: 0,
            field: 'file',
            value: file.name,
            message: validation.error || 'File validation failed',
            severity: 'error'
          }],
          warnings: [],
          totalRows: 0,
          validRows: 0,
          duplicates: 0
        }
      }

      const fileExtension = this.getFileExtension(file.name)
      
      switch (fileExtension) {
        case 'csv':
          return await this.parseCSVFile(file, options)
        case 'xlsx':
        case 'xls':
          return await this.parseExcelFile(file, options)
        case 'pdf':
          return await this.parsePDFFile(file, options)
        default:
          return {
            transactions: [],
            errors: [{
              row: 0,
              field: 'file',
              value: file.name,
              message: `Unsupported file extension: ${fileExtension}`,
              severity: 'error'
            }],
            warnings: [],
            totalRows: 0,
            validRows: 0,
            duplicates: 0
          }
      }
    } catch (error) {
      return {
        transactions: [],
        errors: [{
          row: 0,
          field: 'file',
          value: file.name,
          message: `File parsing error: ${error instanceof Error ? error.message : 'Unknown error'}`,
          severity: 'error'
        }],
        warnings: [],
        totalRows: 0,
        validRows: 0,
        duplicates: 0
      }
    }
  }

  /**
   * Parse CSV file
   */
  private static async parseCSVFile(file: File, options: FileParseOptions): Promise<ParseResult> {
    try {
      const content = await file.text()
      return await csvParser.parseCSV(content, options.userId)
    } catch (error) {
      return {
        transactions: [],
        errors: [{
          row: 0,
          field: 'csv',
          value: file.name,
          message: `CSV parsing error: ${error instanceof Error ? error.message : 'Unknown error'}`,
          severity: 'error'
        }],
        warnings: [],
        totalRows: 0,
        validRows: 0,
        duplicates: 0
      }
    }
  }

  /**
   * Parse Excel file (XLSX/XLS)
   */
  private static async parseExcelFile(file: File, options: FileParseOptions): Promise<ParseResult> {
    try {
      const buffer = await file.arrayBuffer()
      const workbook = new ExcelJS.Workbook()
      await workbook.xlsx.load(buffer)
      
      // Get sheet name - use specified sheet or first sheet
      const worksheets = workbook.worksheets
      let sheetName = options.sheetName
      let worksheet = worksheets.find(ws => ws.name === sheetName)
      
      if (!worksheet) {
        worksheet = worksheets[0]
        sheetName = worksheet?.name
        
        if (!worksheet || !sheetName) {
          return {
            transactions: [],
            errors: [{
              row: 0,
              field: 'excel',
              value: file.name,
              message: 'No worksheets found in Excel file',
              severity: 'error'
            }],
            warnings: [],
            totalRows: 0,
            validRows: 0,
            duplicates: 0
          }
        }
      }

      // Convert to CSV format for parsing
      const csvContent = this.worksheetToCSV(worksheet)

      if (!csvContent.trim()) {
        return {
          transactions: [],
          errors: [{
            row: 0,
            field: 'excel',
            value: file.name,
            message: `Worksheet "${sheetName}" is empty`,
            severity: 'error'
          }],
          warnings: [],
          totalRows: 0,
          validRows: 0,
          duplicates: 0
        }
      }

      // Parse the CSV content
      const result = await csvParser.parseCSV(csvContent, options.userId)
      
      // Add warning if we used a different sheet than requested
      if (options.sheetName && options.sheetName !== sheetName) {
        result.warnings.push({
          row: 0,
          field: 'excel',
          value: options.sheetName,
          message: `Requested sheet "${options.sheetName}" not found. Used "${sheetName}" instead.`,
          severity: 'warning'
        })
      }

      // Add info about available sheets if there are multiple
      const sheetNames = worksheets.map(ws => ws.name)
      if (sheetNames.length > 1) {
        result.warnings.push({
          row: 0,
          field: 'excel',
          value: sheetNames.join(', '),
          message: `Excel file contains multiple sheets: ${sheetNames.join(', ')}. Used "${sheetName}".`,
          severity: 'info'
        })
      }

      return result
    } catch (error) {
      return {
        transactions: [],
        errors: [{
          row: 0,
          field: 'excel',
          value: file.name,
          message: `Excel parsing error: ${error instanceof Error ? error.message : 'Unknown error'}`,
          severity: 'error'
        }],
        warnings: [],
        totalRows: 0,
        validRows: 0,
        duplicates: 0
      }
    }
  }

  /**
   * Convert ExcelJS worksheet to CSV string
   */
  private static worksheetToCSV(worksheet: ExcelJS.Worksheet): string {
    const csvRows: string[] = []
    
    worksheet.eachRow((row, rowNumber) => {
      const csvRow: string[] = []
      
      row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
        let value = ''
        
        if (cell.value !== null && cell.value !== undefined) {
          if (typeof cell.value === 'object' && 'text' in cell.value) {
            // Rich text
            value = cell.value.text || ''
          } else if (cell.value instanceof Date) {
            // Date
            value = cell.value.toISOString()
          } else {
            // Regular value
            value = String(cell.value)
          }
        }
        
        // Escape CSV special characters
        if (value.includes(',') || value.includes('"') || value.includes('\n')) {
          value = `"${value.replace(/"/g, '""')}"`
        }
        
        csvRow.push(value)
      })
      
      csvRows.push(csvRow.join(','))
    })
    
    return csvRows.join('\n')
  }

  /**
   * Parse PDF file
   */
  private static async parsePDFFile(file: File, options: FileParseOptions): Promise<ParseResult> {
    try {
      const buffer = await file.arrayBuffer()
      
      // Dynamic import to avoid build issues
      const pdfParseModule = await import('pdf-parse')
      const pdfParseFunction = pdfParseModule.default || pdfParseModule
      const pdfData = await pdfParseFunction(Buffer.from(buffer))
      
      if (!pdfData.text || pdfData.text.trim().length === 0) {
        return {
          transactions: [],
          errors: [{
            row: 0,
            field: 'pdf',
            value: file.name,
            message: 'No text content found in PDF file',
            severity: 'error'
          }],
          warnings: [],
          totalRows: 0,
          validRows: 0,
          duplicates: 0
        }
      }

      // Try to extract tabular data from PDF text
      const csvContent = this.extractTableFromPDFText(pdfData.text)
      
      if (!csvContent) {
        return {
          transactions: [],
          errors: [{
            row: 0,
            field: 'pdf',
            value: file.name,
            message: 'Could not extract transaction data from PDF. Please ensure the PDF contains a table with transaction data.',
            severity: 'error'
          }],
          warnings: [{
            row: 0,
            field: 'pdf',
            value: 'text_preview',
            message: `PDF text preview: ${pdfData.text.substring(0, 200)}...`,
            severity: 'info'
          }],
          totalRows: 0,
          validRows: 0,
          duplicates: 0
        }
      }

      // Parse the extracted CSV content
      const result = await csvParser.parseCSV(csvContent, options.userId)
      
      // Add info about PDF processing
      result.warnings.push({
        row: 0,
        field: 'pdf',
        value: file.name,
        message: `Extracted ${result.totalRows} rows from PDF. PDF parsing is experimental and may not capture all data accurately.`,
        severity: 'info'
      })

      return result
    } catch (error) {
      return {
        transactions: [],
        errors: [{
          row: 0,
          field: 'pdf',
          value: file.name,
          message: `PDF parsing error: ${error instanceof Error ? error.message : 'Unknown error'}`,
          severity: 'error'
        }],
        warnings: [],
        totalRows: 0,
        validRows: 0,
        duplicates: 0
      }
    }
  }

  /**
   * Extract table data from PDF text
   */
  private static extractTableFromPDFText(text: string): string | null {
    try {
      const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0)
      
      // Look for common transaction table patterns
      const tablePatterns = [
        // Look for lines with multiple columns separated by spaces/tabs
        /^.+\s+\d{4}-\d{2}-\d{2}.+\d+\.\d+.*/,
        // Look for lines with dates and amounts
        /^.+\d{1,2}\/\d{1,2}\/\d{4}.+\$?\d+\.\d+.*/,
        // Look for comma-separated values
        /^.+,.+,.+,.+$/
      ]

      let potentialTableLines: string[] = []
      let headerLine: string | null = null

      // Find potential header line
      for (const line of lines) {
        const lowerLine = line.toLowerCase()
        if ((lowerLine.includes('date') || lowerLine.includes('time')) &&
            (lowerLine.includes('amount') || lowerLine.includes('quantity')) &&
            (lowerLine.includes('symbol') || lowerLine.includes('asset') || lowerLine.includes('coin'))) {
          headerLine = line
          break
        }
      }

      // Find data lines that match table patterns
      for (const line of lines) {
        if (tablePatterns.some(pattern => pattern.test(line))) {
          potentialTableLines.push(line)
        }
      }

      if (potentialTableLines.length === 0) {
        return null
      }

      // Try to convert to CSV format
      let csvLines: string[] = []
      
      if (headerLine) {
        // Convert header to CSV
        csvLines.push(this.convertLineToCSV(headerLine))
      }

      // Convert data lines to CSV
      for (const line of potentialTableLines) {
        const csvLine = this.convertLineToCSV(line)
        if (csvLine) {
          csvLines.push(csvLine)
        }
      }

      return csvLines.length > 1 ? csvLines.join('\n') : null
    } catch (error) {
      console.error('Error extracting table from PDF:', error)
      return null
    }
  }

  /**
   * Convert a text line to CSV format
   */
  private static convertLineToCSV(line: string): string {
    // If line already contains commas, assume it's CSV-like
    if (line.includes(',')) {
      return line
    }

    // Split by multiple spaces or tabs and join with commas
    const parts = line.split(/\s{2,}|\t+/).map(part => part.trim()).filter(part => part.length > 0)
    
    // Wrap parts that contain spaces in quotes
    const csvParts = parts.map(part => {
      if (part.includes(' ') || part.includes(',')) {
        return `"${part.replace(/"/g, '""')}"` // Escape quotes
      }
      return part
    })

    return csvParts.join(',')
  }

  /**
   * Get file extension from filename
   */
  private static getFileExtension(filename: string): string {
    return filename.split('.').pop()?.toLowerCase() || ''
  }

  /**
   * Get file type configuration by filename
   */
  private static getFileTypeByName(filename: string): SupportedFileType | null {
    const extension = this.getFileExtension(filename)
    return this.SUPPORTED_FILE_TYPES.find(type => type.extension === extension) || null
  }

  /**
   * Get file type configuration by MIME type
   */
  private static getFileTypeByMime(mimeType: string): SupportedFileType | null {
    return this.SUPPORTED_FILE_TYPES.find(type => 
      type.mimeTypes.includes(mimeType)
    ) || null
  }

  /**
   * Get all supported MIME types
   */
  static getSupportedMimeTypes(): string[] {
    return this.SUPPORTED_FILE_TYPES.flatMap(type => type.mimeTypes)
  }

  /**
   * Get all supported file extensions
   */
  static getSupportedExtensions(): string[] {
    return this.SUPPORTED_FILE_TYPES.map(type => type.extension)
  }

  /**
   * Generate file type description for UI
   */
  static getFileTypeDescription(): string {
    return this.SUPPORTED_FILE_TYPES
      .map(type => `${type.description} (.${type.extension})`)
      .join(', ')
  }
}

// Export singleton instance for backward compatibility
export const fileParser = FileParser