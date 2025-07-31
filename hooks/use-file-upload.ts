"use client"

import { useState, useCallback } from 'react'
import { useAuth } from '@/hooks/use-firebase-auth'

interface UploadResult {
  success: boolean
  jobId?: string
  message: string
  results?: {
    totalRows: number
    validTransactions: number
    savedTransactions: number
    duplicatesSkipped: number
    errors: number
    warnings: number
  }
  errors?: any[]
}

interface UploadProgress {
  jobId: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  progress: number
  fileName: string
  totalTransactions?: number
  processedTransactions?: number
  errors: string[]
  warnings: string[]
  createdAt: Date
  completedAt?: Date
}

export function useFileUpload() {
  const { user } = useAuth()
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)

  const uploadFile = useCallback(async (
    file: File, 
    exchangeType: string = 'auto'
  ): Promise<UploadResult> => {
    if (!user) {
      throw new Error('User must be authenticated to upload files')
    }

    setUploading(true)
    setProgress(0)
    setError(null)

    try {
      console.log('Starting file upload:', {
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        exchangeType
      })

      // Get Firebase ID token
      const token = await user.getIdToken()

      // Create form data
      const formData = new FormData()
      formData.append('file', file)
      formData.append('exchangeType', exchangeType)

      console.log('Uploading to API...')

      // Upload file
      const response = await fetch('/api/upload/transactions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      })

      const result = await response.json()

      console.log('API response:', {
        status: response.status,
        success: result.success,
        message: result.message,
        errors: result.errors
      })

      if (!response.ok) {
        throw new Error(result.error || result.message || 'Upload failed')
      }

      setProgress(100)
      return result

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Upload failed'
      console.error('Upload error:', error)
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setUploading(false)
    }
  }, [user])

  const getUploadStatus = useCallback(async (jobId: string): Promise<UploadProgress> => {
    try {
      const response = await fetch(`/api/upload/transactions?jobId=${jobId}`)
      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to get upload status')
      }

      return result.job
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to get status'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const pollUploadStatus = useCallback(async (
    jobId: string,
    onProgress?: (progress: UploadProgress) => void,
    intervalMs: number = 2000
  ): Promise<UploadProgress> => {
    return new Promise((resolve, reject) => {
      const poll = async () => {
        try {
          const status = await getUploadStatus(jobId)
          
          if (onProgress) {
            onProgress(status)
          }

          if (status.status === 'completed' || status.status === 'failed') {
            resolve(status)
          } else {
            setTimeout(poll, intervalMs)
          }
        } catch (error) {
          reject(error)
        }
      }

      poll()
    })
  }, [getUploadStatus])

  const validateFile = useCallback((file: File): { valid: boolean; error?: string } => {
    // Get file extension
    const extension = file.name.split('.').pop()?.toLowerCase() || ''
    
    // Define supported file types with their limits
    const supportedTypes = {
      'csv': { maxSize: 10 * 1024 * 1024, mimeTypes: ['text/csv', 'application/csv', 'text/plain'] },
      'xlsx': { maxSize: 25 * 1024 * 1024, mimeTypes: ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'] },
      'xls': { maxSize: 25 * 1024 * 1024, mimeTypes: ['application/vnd.ms-excel'] },
      'pdf': { maxSize: 50 * 1024 * 1024, mimeTypes: ['application/pdf'] }
    }

    // Check if file type is supported
    const fileType = supportedTypes[extension as keyof typeof supportedTypes]
    if (!fileType) {
      return {
        valid: false,
        error: `Unsupported file type. Supported formats: CSV, Excel (XLSX/XLS), PDF`
      }
    }

    // Check file size based on type
    if (file.size > fileType.maxSize) {
      const maxSizeMB = Math.round(fileType.maxSize / (1024 * 1024))
      return {
        valid: false,
        error: `File size exceeds ${maxSizeMB}MB limit for ${extension.toUpperCase()} files`
      }
    }

    // Check MIME type if available (some browsers don't set it correctly)
    if (file.type && !fileType.mimeTypes.includes(file.type)) {
      console.warn(`MIME type mismatch: expected ${fileType.mimeTypes.join(' or ')}, got ${file.type}`)
      // Don't fail validation, just warn
    }

    return { valid: true }
  }, [])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  return {
    uploading,
    progress,
    error,
    uploadFile,
    getUploadStatus,
    pollUploadStatus,
    validateFile,
    clearError
  }
}