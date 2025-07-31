import { NextRequest, NextResponse } from 'next/server'
import { PermissionLogger } from '@/lib/utils/permission-logger'

// This endpoint should be protected in production
export async function GET(request: NextRequest) {
  try {
    // In production, add proper authentication/authorization here
    // For now, we'll allow access for development
    
    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action') || 'list'
    const userId = searchParams.get('userId') || undefined
    const operation = searchParams.get('operation') || undefined
    const result = searchParams.get('result') as 'success' | 'denied' | 'error' | undefined
    const since = searchParams.get('since') || undefined
    const limit = parseInt(searchParams.get('limit') || '50')
    const format = searchParams.get('format') || 'json'

    switch (action) {
      case 'list':
        const logs = PermissionLogger.getLogs({
          userId,
          operation,
          result,
          since,
          limit
        })

        if (format === 'csv') {
          const csvData = PermissionLogger.exportLogs('csv')
          return new NextResponse(csvData, {
            headers: {
              'Content-Type': 'text/csv',
              'Content-Disposition': 'attachment; filename=permission-logs.csv'
            }
          })
        }

        return NextResponse.json({
          success: true,
          logs,
          count: logs.length
        })

      case 'summary':
        const summary = PermissionLogger.getLogSummary(since)
        return NextResponse.json({
          success: true,
          summary
        })

      case 'user':
        if (!userId) {
          return NextResponse.json(
            { error: 'User ID required for user activity' },
            { status: 400 }
          )
        }

        const userActivity = PermissionLogger.getUserActivity(userId, limit)
        return NextResponse.json({
          success: true,
          userId,
          activity: userActivity
        })

      case 'report':
        const report = PermissionLogger.generateReport(since)
        return NextResponse.json({
          success: true,
          report
        })

      case 'export':
        const exportFormat = format === 'csv' ? 'csv' : 'json'
        const exportedData = PermissionLogger.exportLogs(exportFormat)
        
        if (exportFormat === 'csv') {
          return new NextResponse(exportedData, {
            headers: {
              'Content-Type': 'text/csv',
              'Content-Disposition': 'attachment; filename=permission-logs.csv'
            }
          })
        }

        return new NextResponse(exportedData, {
          headers: {
            'Content-Type': 'application/json',
            'Content-Disposition': 'attachment; filename=permission-logs.json'
          }
        })

      default:
        return NextResponse.json(
          { error: 'Invalid action. Supported actions: list, summary, user, report, export' },
          { status: 400 }
        )
    }

  } catch (error) {
    console.error('Permission logs API error:', error)
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// Clear logs endpoint (DELETE method)
export async function DELETE(request: NextRequest) {
  try {
    // In production, add proper authentication/authorization here
    // This is a destructive operation and should be heavily protected
    
    const { searchParams } = new URL(request.url)
    const confirm = searchParams.get('confirm')

    if (confirm !== 'true') {
      return NextResponse.json(
        { 
          error: 'Confirmation required. Add ?confirm=true to clear logs',
          warning: 'This action cannot be undone'
        },
        { status: 400 }
      )
    }

    PermissionLogger.clearLogs()

    return NextResponse.json({
      success: true,
      message: 'All permission logs cleared'
    })

  } catch (error) {
    console.error('Permission logs clear error:', error)
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}