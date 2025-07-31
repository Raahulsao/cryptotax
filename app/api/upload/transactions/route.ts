import { NextRequest, NextResponse } from 'next/server'
import { FileParser } from '@/lib/parsers/file-parser'
import { dbService } from '@/lib/services/database'
import { FirebaseErrorHandler, type EnhancedError } from '@/lib/utils/firebase-error-handler'

export async function POST(request: NextRequest) {
  try {
    // Get authorization header
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Authorization header required' },
        { status: 401 }
      )
    }

    // Verify Firebase token
    const token = authHeader.split('Bearer ')[1]
    let decodedToken
    
    try {
      // Note: In a real implementation, you'd use Firebase Admin SDK
      // For now, we'll extract user ID from the client token
      // This is a simplified version - in production, use proper token verification
      const payload = JSON.parse(atob(token.split('.')[1]))
      decodedToken = { uid: payload.user_id || payload.sub }
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid authorization token' },
        { status: 401 }
      )
    }

    // Parse form data
    const formData = await request.formData()
    const file = formData.get('file') as File
    const exchangeType = formData.get('exchangeType') as string || 'auto'
    const sheetName = formData.get('sheetName') as string || undefined

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    // Validate file using enhanced file parser
    const validation = FileParser.validateFile(file)
    if (!validation.isValid) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      )
    }

    // Create processing job
    const jobId = await dbService.createProcessingJob({
      userId: decodedToken.uid,
      fileName: `${Date.now()}-${file.name}`,
      originalName: file.name,
      fileType: file.type,
      status: 'pending',
      progress: 0,
      errors: [],
      warnings: []
    })

    // Process file immediately (in production, this would be queued)
    try {
      // Update job status to processing
      await dbService.updateProcessingJob(jobId, {
        status: 'processing',
        progress: 10
      })

      // Update progress
      await dbService.updateProcessingJob(jobId, { progress: 30 })

      // Parse file using enhanced parser
      const parseResult = await FileParser.parseFile(file, {
        userId: decodedToken.uid,
        exchangeType,
        sheetName
      })
      
      // Update progress
      await dbService.updateProcessingJob(jobId, { progress: 60 })

      // Log parsing results for debugging
      console.log('File parsing results:', {
        fileName: file.name,
        exchangeType,
        totalRows: parseResult.totalRows,
        validRows: parseResult.validRows,
        transactionsCount: parseResult.transactions.length,
        errorsCount: parseResult.errors.length,
        warningsCount: parseResult.warnings.length
      })

      if (parseResult.errors.length > 0) {
        console.log('Parsing errors:', parseResult.errors)
      }

      if (parseResult.warnings.length > 0) {
        console.log('Parsing warnings:', parseResult.warnings)
      }

      if (parseResult.errors.length > 0 && parseResult.transactions.length === 0) {
        // All transactions failed to parse
        await dbService.updateProcessingJob(jobId, {
          status: 'failed',
          progress: 100,
          errors: parseResult.errors.map(e => e.message)
        })

        return NextResponse.json({
          success: false,
          jobId,
          message: 'File processing failed - no valid transactions found',
          errors: parseResult.errors.map(e => ({
            row: e.row,
            field: e.field,
            message: e.message,
            value: e.value
          }))
        }, { status: 400 })
      }

      // Check for duplicates in database
      const duplicates = await dbService.checkDuplicateTransactions(
        decodedToken.uid, 
        parseResult.transactions
      )

      // Filter out duplicates
      const newTransactions = parseResult.transactions.filter((tx, index) => {
        const key = `${tx.symbol} ${tx.type} ${tx.amount} on ${tx.timestamp}`
        return !duplicates.includes(key)
      })

      // Save transactions to database
      if (newTransactions.length > 0) {
        await dbService.saveTransactionsBatch(newTransactions)
      }

      // Update progress
      await dbService.updateProcessingJob(jobId, { progress: 90 })

      // Update job completion
      await dbService.updateProcessingJob(jobId, {
        status: 'completed',
        progress: 100,
        totalTransactions: parseResult.totalRows,
        processedTransactions: newTransactions.length,
        errors: parseResult.errors.map(e => e.message),
        warnings: parseResult.warnings.map(w => w.message)
      })

      return NextResponse.json({
        success: true,
        jobId,
        message: 'File processed successfully',
        results: {
          totalRows: parseResult.totalRows,
          validTransactions: parseResult.validRows,
          savedTransactions: newTransactions.length,
          duplicatesSkipped: duplicates.length,
          errors: parseResult.errors.length,
          warnings: parseResult.warnings.length
        }
      })

    } catch (processingError) {
      // Update job with error
      await dbService.updateProcessingJob(jobId, {
        status: 'failed',
        progress: 100,
        errors: [processingError instanceof Error ? processingError.message : 'Unknown error']
      })

      return NextResponse.json({
        success: false,
        jobId,
        message: 'File processing failed',
        error: processingError instanceof Error ? processingError.message : 'Unknown error'
      }, { status: 500 })
    }

  } catch (error) {
    // Check if it's already an enhanced error
    if (error && typeof error === 'object' && 'code' in error && 'userMessage' in error) {
      const enhancedError = error as EnhancedError
      const statusCode = FirebaseErrorHandler.getHttpStatusCode(enhancedError)
      const apiResponse = FirebaseErrorHandler.createApiErrorResponse(enhancedError)
      
      return NextResponse.json(apiResponse, { status: statusCode })
    }
    
    // Handle other errors
    const enhancedError = FirebaseErrorHandler.handleFirebaseError(
      error,
      { operation: 'uploadTransactions', resource: 'file-upload' }
    )
    
    FirebaseErrorHandler.logEnhancedError(enhancedError)
    const statusCode = FirebaseErrorHandler.getHttpStatusCode(enhancedError)
    const apiResponse = FirebaseErrorHandler.createApiErrorResponse(enhancedError)
    
    return NextResponse.json(apiResponse, { status: statusCode })
  }
}

// Get upload status
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const jobId = searchParams.get('jobId')

    if (!jobId) {
      return NextResponse.json(
        { error: 'Job ID required' },
        { status: 400 }
      )
    }

    const job = await dbService.getProcessingJob(jobId)
    
    if (!job) {
      return NextResponse.json(
        { error: 'Job not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      job: {
        id: job.id,
        status: job.status,
        progress: job.progress,
        fileName: job.originalName,
        totalTransactions: job.totalTransactions,
        processedTransactions: job.processedTransactions,
        errors: job.errors,
        warnings: job.warnings,
        createdAt: job.createdAt,
        completedAt: job.completedAt
      }
    })

  } catch (error) {
    // Check if it's already an enhanced error
    if (error && typeof error === 'object' && 'code' in error && 'userMessage' in error) {
      const enhancedError = error as EnhancedError
      const statusCode = FirebaseErrorHandler.getHttpStatusCode(enhancedError)
      const apiResponse = FirebaseErrorHandler.createApiErrorResponse(enhancedError)
      
      return NextResponse.json(apiResponse, { status: statusCode })
    }
    
    // Handle other errors
    const enhancedError = FirebaseErrorHandler.handleFirebaseError(
      error,
      { operation: 'getUploadStatus', resource: 'processing-job' }
    )
    
    FirebaseErrorHandler.logEnhancedError(enhancedError)
    const statusCode = FirebaseErrorHandler.getHttpStatusCode(enhancedError)
    const apiResponse = FirebaseErrorHandler.createApiErrorResponse(enhancedError)
    
    return NextResponse.json(apiResponse, { status: statusCode })
  }
}