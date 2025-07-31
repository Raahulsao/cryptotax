"use client"

import { useState, useRef, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Upload, CheckCircle, AlertCircle, FileText, X } from 'lucide-react'
import { useFileUpload } from '@/hooks/use-file-upload'
import { useTheme } from 'next-themes'

interface UploadedFile {
  file: File
  jobId?: string
  status: 'uploading' | 'processing' | 'completed' | 'failed'
  progress: number
  results?: any
  error?: string
}

export function FileUploadComponent() {
  const { theme } = useTheme()
  const isDarkMode = theme === 'dark'
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [dragActive, setDragActive] = useState(false)
  const [exchangeType, setExchangeType] = useState('auto')
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  
  const { uploadFile, validateFile, pollUploadStatus, error, clearError } = useFileUpload()

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0])
    }
  }, [])

  const handleFileUpload = useCallback(async (file: File) => {
    clearError()
    
    // Validate file
    const validation = validateFile(file)
    if (!validation.valid) {
      return
    }

    // Add file to uploaded files list
    const fileId = Math.random().toString(36).substring(2, 11)
    const uploadedFile: UploadedFile = {
      file,
      status: 'uploading',
      progress: 0
    }

    setUploadedFiles(prev => [...prev, uploadedFile])

    try {
      // Upload file
      const result = await uploadFile(file, exchangeType)
      
      if (result.success && result.jobId) {
        // Update file status
        setUploadedFiles(prev => prev.map(f => 
          f.file === file 
            ? { ...f, jobId: result.jobId, status: 'processing', progress: 10 }
            : f
        ))

        // Poll for status updates
        const finalStatus = await pollUploadStatus(result.jobId, (progress) => {
          setUploadedFiles(prev => prev.map(f => 
            f.jobId === result.jobId 
              ? { 
                  ...f, 
                  status: progress.status as any,
                  progress: progress.progress 
                }
              : f
          ))
        })

        // Update with final results
        setUploadedFiles(prev => prev.map(f => 
          f.jobId === result.jobId 
            ? { 
                ...f, 
                status: finalStatus.status as any,
                progress: 100,
                results: result.results,
                error: finalStatus.status === 'failed' ? finalStatus.errors.join(', ') : undefined
              }
            : f
        ))

      } else {
        // Upload failed
        setUploadedFiles(prev => prev.map(f => 
          f.file === file 
            ? { ...f, status: 'failed', progress: 0, error: result.message }
            : f
        ))
      }
    } catch (error) {
      setUploadedFiles(prev => prev.map(f => 
        f.file === file 
          ? { ...f, status: 'failed', progress: 0, error: error instanceof Error ? error.message : 'Unknown error' }
          : f
      ))
    }
  }, [uploadFile, validateFile, exchangeType, pollUploadStatus, clearError])

  const removeFile = useCallback((file: File) => {
    setUploadedFiles(prev => prev.filter(f => f.file !== file))
  }, [])

  const getStatusIcon = (status: UploadedFile['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'failed':
        return <AlertCircle className="w-5 h-5 text-red-500" />
      case 'uploading':
      case 'processing':
        return <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      default:
        return <FileText className="w-5 h-5 text-gray-500" />
    }
  }

  const getStatusText = (file: UploadedFile) => {
    switch (file.status) {
      case 'uploading':
        return 'Uploading...'
      case 'processing':
        return 'Processing transactions...'
      case 'completed':
        return file.results 
          ? `${file.results.savedTransactions} transactions imported`
          : 'Completed'
      case 'failed':
        if (file.error) {
          // Provide more helpful error messages
          if (file.error.includes('no valid transactions found')) {
            return 'No valid transactions found in file. Please check the file format.'
          } else if (file.error.includes('permission')) {
            return 'Permission denied. Please log in again.'
          } else if (file.error.includes('network')) {
            return 'Network error. Please check your connection and try again.'
          } else {
            return file.error
          }
        }
        return 'Upload failed'
      default:
        return 'Ready'
    }
  }

  return (
    <div className="space-y-6">
      {/* Exchange Type Selection */}
      <div className="space-y-2">
        <label className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
          Exchange Type (Optional)
        </label>
        <Select value={exchangeType} onValueChange={setExchangeType}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Auto-detect exchange format" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="auto">Auto-detect</SelectItem>
            <SelectItem value="binance_spot">Binance Spot Trading</SelectItem>
            <SelectItem value="binance_deposit">Binance Deposit History</SelectItem>
            <SelectItem value="binance_withdrawal">Binance Withdrawal History</SelectItem>
            <SelectItem value="coinbase">Coinbase</SelectItem>
            <SelectItem value="kraken">Kraken</SelectItem>
            <SelectItem value="other">Generic CSV</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragActive
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
            : isDarkMode 
              ? 'border-gray-600 hover:border-gray-500' 
              : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <Upload className={`w-12 h-12 mx-auto mb-4 ${
          dragActive ? 'text-blue-500' : isDarkMode ? 'text-gray-500' : 'text-gray-400'
        }`} />
        
        <div className={`text-lg font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          {dragActive ? 'Drop your file here' : 'Drag and drop your transaction file here'}
        </div>
        
        <div className={`text-sm mb-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          or click to browse • Supports CSV, Excel (XLSX/XLS), and PDF files
        </div>
        
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv,.xlsx,.xls,.pdf"
          className="hidden"
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              handleFileUpload(e.target.files[0])
            }
          }}
        />
        
        <Button
          variant="outline"
          className="bg-transparent"
          onClick={() => fileInputRef.current?.click()}
        >
          Select File
        </Button>
      </div>

      {/* Error Display */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Uploaded Files List */}
      {uploadedFiles.length > 0 && (
        <div className="space-y-3">
          <h3 className={`text-lg font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Upload Progress
          </h3>
          
          {uploadedFiles.map((uploadedFile, index) => (
            <div
              key={index}
              className={`flex items-center justify-between p-4 border rounded-lg ${
                isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'
              }`}
            >
              <div className="flex items-center space-x-3 flex-1">
                {getStatusIcon(uploadedFile.status)}
                
                <div className="flex-1 min-w-0">
                  <div className={`font-medium truncate ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {uploadedFile.file.name}
                  </div>
                  <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {getStatusText(uploadedFile)}
                  </div>
                  
                  {(uploadedFile.status === 'uploading' || uploadedFile.status === 'processing') && (
                    <div className="mt-2">
                      <Progress value={uploadedFile.progress} className="w-full h-2" />
                    </div>
                  )}
                  
                  {uploadedFile.status === 'completed' && uploadedFile.results && (
                    <div className={`text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {uploadedFile.results.totalRows} rows processed, {uploadedFile.results.duplicatesSkipped} duplicates skipped
                    </div>
                  )}
                </div>
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeFile(uploadedFile.file)}
                className="ml-2"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* Instructions */}
      <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
        <p className="font-medium mb-2">Supported formats:</p>
        <ul className="list-disc list-inside space-y-1">
          <li><strong>CSV Files:</strong> Binance, Coinbase, Kraken, or generic format</li>
          <li><strong>Excel Files:</strong> XLSX and XLS workbooks (first sheet used)</li>
          <li><strong>PDF Files:</strong> Transaction reports with tabular data (experimental)</li>
        </ul>
        <p className="mt-2 text-xs">
          <strong>File size limits:</strong> CSV (10MB), Excel (25MB), PDF (50MB)
        </p>
      </div>
    </div>
  )
}