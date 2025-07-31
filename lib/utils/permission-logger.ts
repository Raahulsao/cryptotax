/**
 * Permission Logger
 * Comprehensive logging system for Firebase permission attempts and results
 */

export interface PermissionAttempt {
  id: string;
  timestamp: string;
  userId?: string;
  operation: string;
  resource: string;
  collection?: string;
  documentId?: string;
  result: 'success' | 'denied' | 'error';
  errorCode?: string;
  errorMessage?: string;
  userAgent?: string;
  ipAddress?: string;
  sessionId?: string;
  duration?: number;
  metadata?: Record<string, any>;
}

export interface PermissionLogSummary {
  totalAttempts: number;
  successfulAttempts: number;
  deniedAttempts: number;
  errorAttempts: number;
  uniqueUsers: number;
  topOperations: Array<{ operation: string; count: number }>;
  topErrors: Array<{ error: string; count: number }>;
  timeRange: { start: string; end: string };
}

export class PermissionLogger {
  private static logs: PermissionAttempt[] = [];
  private static readonly MAX_LOGS = 1000; // Keep last 1000 logs in memory
  private static readonly LOG_RETENTION_HOURS = 24; // Keep logs for 24 hours

  /**
   * Log a permission attempt
   */
  static logPermissionAttempt(
    operation: string,
    resource: string,
    result: 'success' | 'denied' | 'error',
    context: {
      userId?: string;
      collection?: string;
      documentId?: string;
      errorCode?: string;
      errorMessage?: string;
      duration?: number;
      metadata?: Record<string, any>;
    } = {}
  ): void {
    const attempt: PermissionAttempt = {
      id: this.generateLogId(),
      timestamp: new Date().toISOString(),
      operation,
      resource,
      result,
      ...context,
      userAgent: this.getUserAgent(),
      sessionId: this.getSessionId()
    };

    // Add to logs
    this.logs.push(attempt);

    // Maintain log size limit
    if (this.logs.length > this.MAX_LOGS) {
      this.logs = this.logs.slice(-this.MAX_LOGS);
    }

    // Clean old logs
    this.cleanOldLogs();

    // Log to console with appropriate level
    this.logToConsole(attempt);

    // In production, you might want to send to external logging service
    if (process.env.NODE_ENV === 'production') {
      this.sendToExternalLogger(attempt);
    }
  }

  /**
   * Log successful permission attempt
   */
  static logSuccess(
    operation: string,
    resource: string,
    context: {
      userId?: string;
      collection?: string;
      documentId?: string;
      duration?: number;
      metadata?: Record<string, any>;
    } = {}
  ): void {
    this.logPermissionAttempt(operation, resource, 'success', context);
  }

  /**
   * Log denied permission attempt
   */
  static logDenied(
    operation: string,
    resource: string,
    context: {
      userId?: string;
      collection?: string;
      documentId?: string;
      errorCode?: string;
      errorMessage?: string;
      duration?: number;
      metadata?: Record<string, any>;
    } = {}
  ): void {
    this.logPermissionAttempt(operation, resource, 'denied', context);
  }

  /**
   * Log error in permission attempt
   */
  static logError(
    operation: string,
    resource: string,
    context: {
      userId?: string;
      collection?: string;
      documentId?: string;
      errorCode?: string;
      errorMessage?: string;
      duration?: number;
      metadata?: Record<string, any>;
    } = {}
  ): void {
    this.logPermissionAttempt(operation, resource, 'error', context);
  }

  /**
   * Get permission logs with optional filtering
   */
  static getLogs(filter: {
    userId?: string;
    operation?: string;
    resource?: string;
    result?: 'success' | 'denied' | 'error';
    since?: string; // ISO timestamp
    limit?: number;
  } = {}): PermissionAttempt[] {
    let filteredLogs = [...this.logs];

    // Apply filters
    if (filter.userId) {
      filteredLogs = filteredLogs.filter(log => log.userId === filter.userId);
    }

    if (filter.operation) {
      filteredLogs = filteredLogs.filter(log => 
        log.operation.toLowerCase().includes(filter.operation!.toLowerCase())
      );
    }

    if (filter.resource) {
      filteredLogs = filteredLogs.filter(log => 
        log.resource.toLowerCase().includes(filter.resource!.toLowerCase())
      );
    }

    if (filter.result) {
      filteredLogs = filteredLogs.filter(log => log.result === filter.result);
    }

    if (filter.since) {
      const sinceDate = new Date(filter.since);
      filteredLogs = filteredLogs.filter(log => 
        new Date(log.timestamp) >= sinceDate
      );
    }

    // Sort by timestamp (newest first)
    filteredLogs.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

    // Apply limit
    if (filter.limit) {
      filteredLogs = filteredLogs.slice(0, filter.limit);
    }

    return filteredLogs;
  }

  /**
   * Get permission log summary
   */
  static getLogSummary(since?: string): PermissionLogSummary {
    const logs = this.getLogs(since ? { since } : {});

    const totalAttempts = logs.length;
    const successfulAttempts = logs.filter(log => log.result === 'success').length;
    const deniedAttempts = logs.filter(log => log.result === 'denied').length;
    const errorAttempts = logs.filter(log => log.result === 'error').length;

    const uniqueUsers = new Set(logs.map(log => log.userId).filter(Boolean)).size;

    // Top operations
    const operationCounts = logs.reduce((acc, log) => {
      acc[log.operation] = (acc[log.operation] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const topOperations = Object.entries(operationCounts)
      .map(([operation, count]) => ({ operation, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // Top errors
    const errorCounts = logs
      .filter(log => log.result === 'error' || log.result === 'denied')
      .reduce((acc, log) => {
        const error = log.errorCode || log.errorMessage || 'Unknown error';
        acc[error] = (acc[error] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

    const topErrors = Object.entries(errorCounts)
      .map(([error, count]) => ({ error, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // Time range
    const timestamps = logs.map(log => log.timestamp).sort();
    const timeRange = {
      start: timestamps[0] || new Date().toISOString(),
      end: timestamps[timestamps.length - 1] || new Date().toISOString()
    };

    return {
      totalAttempts,
      successfulAttempts,
      deniedAttempts,
      errorAttempts,
      uniqueUsers,
      topOperations,
      topErrors,
      timeRange
    };
  }

  /**
   * Get user-specific permission activity
   */
  static getUserActivity(userId: string, limit: number = 50): {
    recentAttempts: PermissionAttempt[];
    summary: {
      totalAttempts: number;
      successRate: number;
      commonOperations: string[];
      recentErrors: string[];
    };
  } {
    const userLogs = this.getLogs({ userId, limit });

    const totalAttempts = userLogs.length;
    const successfulAttempts = userLogs.filter(log => log.result === 'success').length;
    const successRate = totalAttempts > 0 ? (successfulAttempts / totalAttempts) * 100 : 0;

    const operationCounts = userLogs.reduce((acc, log) => {
      acc[log.operation] = (acc[log.operation] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const commonOperations = Object.entries(operationCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([operation]) => operation);

    const recentErrors = userLogs
      .filter(log => log.result === 'error' || log.result === 'denied')
      .slice(0, 5)
      .map(log => log.errorMessage || log.errorCode || 'Unknown error')
      .filter((error, index, arr) => arr.indexOf(error) === index); // Remove duplicates

    return {
      recentAttempts: userLogs,
      summary: {
        totalAttempts,
        successRate: Math.round(successRate * 100) / 100,
        commonOperations,
        recentErrors
      }
    };
  }

  /**
   * Export logs for analysis
   */
  static exportLogs(format: 'json' | 'csv' = 'json'): string {
    const logs = this.getLogs();

    if (format === 'csv') {
      const headers = [
        'timestamp', 'userId', 'operation', 'resource', 'result', 
        'errorCode', 'errorMessage', 'duration', 'collection', 'documentId'
      ];

      const csvRows = [
        headers.join(','),
        ...logs.map(log => [
          log.timestamp,
          log.userId || '',
          log.operation,
          log.resource,
          log.result,
          log.errorCode || '',
          log.errorMessage || '',
          log.duration || '',
          log.collection || '',
          log.documentId || ''
        ].map(field => `"${String(field).replace(/"/g, '""')}"`).join(','))
      ];

      return csvRows.join('\n');
    }

    return JSON.stringify(logs, null, 2);
  }

  /**
   * Clear all logs
   */
  static clearLogs(): void {
    this.logs = [];
    console.log('🧹 Permission logs cleared');
  }

  /**
   * Generate unique log ID
   */
  private static generateLogId(): string {
    return `log_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
  }

  /**
   * Get user agent (simplified for server-side)
   */
  private static getUserAgent(): string {
    if (typeof window !== 'undefined' && window.navigator) {
      return window.navigator.userAgent;
    }
    return 'Server-side';
  }

  /**
   * Get or generate session ID
   */
  private static getSessionId(): string {
    if (typeof window !== 'undefined') {
      let sessionId = sessionStorage.getItem('permission-session-id');
      if (!sessionId) {
        sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
        sessionStorage.setItem('permission-session-id', sessionId);
      }
      return sessionId;
    }
    return 'server-session';
  }

  /**
   * Clean old logs based on retention policy
   */
  private static cleanOldLogs(): void {
    const cutoffTime = new Date();
    cutoffTime.setHours(cutoffTime.getHours() - this.LOG_RETENTION_HOURS);

    const initialCount = this.logs.length;
    this.logs = this.logs.filter(log => 
      new Date(log.timestamp) > cutoffTime
    );

    const removedCount = initialCount - this.logs.length;
    if (removedCount > 0) {
      console.log(`🧹 Cleaned ${removedCount} old permission logs`);
    }
  }

  /**
   * Log to console with appropriate formatting
   */
  private static logToConsole(attempt: PermissionAttempt): void {
    const icon = this.getResultIcon(attempt.result);
    const timestamp = new Date(attempt.timestamp).toLocaleTimeString();
    
    const logMessage = [
      `${icon} [${timestamp}]`,
      `${attempt.operation}`,
      `→ ${attempt.resource}`,
      attempt.userId ? `(User: ${attempt.userId})` : '(No user)',
      attempt.duration ? `(${attempt.duration}ms)` : ''
    ].filter(Boolean).join(' ');

    switch (attempt.result) {
      case 'success':
        console.log(`🔐 ${logMessage}`);
        break;
      case 'denied':
        console.warn(`🔐 ${logMessage} - ${attempt.errorMessage || 'Access denied'}`);
        break;
      case 'error':
        console.error(`🔐 ${logMessage} - ${attempt.errorMessage || 'Error occurred'}`);
        break;
    }
  }

  /**
   * Get icon for result type
   */
  private static getResultIcon(result: string): string {
    switch (result) {
      case 'success': return '✅';
      case 'denied': return '🚫';
      case 'error': return '❌';
      default: return '❓';
    }
  }

  /**
   * Send to external logging service (placeholder)
   */
  private static sendToExternalLogger(attempt: PermissionAttempt): void {
    // In production, implement sending to external logging service
    // Examples: DataDog, LogRocket, Sentry, CloudWatch, etc.
    
    // For now, just log that we would send it
    if (attempt.result !== 'success') {
      console.log(`📤 Would send to external logger: ${attempt.operation} ${attempt.result}`);
    }
  }

  /**
   * Generate permission report
   */
  static generateReport(since?: string): string {
    const summary = this.getLogSummary(since);
    const logs = this.getLogs(since ? { since } : {});

    const report = [
      '🔐 PERMISSION ACTIVITY REPORT',
      '='.repeat(40),
      `📅 Time Range: ${summary.timeRange.start} to ${summary.timeRange.end}`,
      `📊 Total Attempts: ${summary.totalAttempts}`,
      `✅ Successful: ${summary.successfulAttempts} (${Math.round((summary.successfulAttempts / summary.totalAttempts) * 100)}%)`,
      `🚫 Denied: ${summary.deniedAttempts} (${Math.round((summary.deniedAttempts / summary.totalAttempts) * 100)}%)`,
      `❌ Errors: ${summary.errorAttempts} (${Math.round((summary.errorAttempts / summary.totalAttempts) * 100)}%)`,
      `👥 Unique Users: ${summary.uniqueUsers}`,
      '',
      '🔝 TOP OPERATIONS:',
      ...summary.topOperations.map((op, i) => `${i + 1}. ${op.operation}: ${op.count} attempts`),
      '',
      '⚠️ TOP ERRORS:',
      ...summary.topErrors.map((err, i) => `${i + 1}. ${err.error}: ${err.count} occurrences`),
      '',
      '📋 RECENT ACTIVITY:',
      ...logs.slice(0, 10).map(log => 
        `${this.getResultIcon(log.result)} ${log.timestamp} - ${log.operation} → ${log.resource} ${log.userId ? `(${log.userId})` : ''}`
      )
    ];

    return report.join('\n');
  }
}