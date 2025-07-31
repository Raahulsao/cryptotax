/**
 * Firebase Error Handler
 * Enhanced error handling for Firebase operations with user-friendly messages
 */

import { FirebaseError } from 'firebase/app';

export interface EnhancedError {
  code: string;
  message: string;
  userMessage: string;
  troubleshooting: string[];
  isRetryable: boolean;
  severity: 'low' | 'medium' | 'high' | 'critical';
  context?: {
    userId?: string;
    operation?: string;
    resource?: string;
    timestamp: string;
  };
}

export class FirebaseErrorHandler {
  private static readonly PROJECT_ID = 'taxation-f3ee8';
  private static readonly CONSOLE_URL = `https://console.firebase.google.com/project/${FirebaseErrorHandler.PROJECT_ID}`;

  /**
   * Enhanced error processing for Firebase operations
   */
  static handleFirebaseError(
    error: unknown,
    context: {
      userId?: string;
      operation: string;
      resource?: string;
    }
  ): EnhancedError {
    const timestamp = new Date().toISOString();
    
    // Handle Firebase-specific errors
    if (error instanceof FirebaseError) {
      return this.handleFirebaseSpecificError(error, { ...context, timestamp });
    }
    
    // Handle generic errors
    if (error instanceof Error) {
      return this.handleGenericError(error, { ...context, timestamp });
    }
    
    // Handle unknown errors
    return this.handleUnknownError(error, { ...context, timestamp });
  }

  /**
   * Handle Firebase-specific errors
   */
  private static handleFirebaseSpecificError(
    error: FirebaseError,
    context: { userId?: string; operation: string; resource?: string; timestamp: string }
  ): EnhancedError {
    switch (error.code) {
      case 'permission-denied':
        return this.handlePermissionDeniedError(error, context);
      
      case 'unauthenticated':
        return this.handleUnauthenticatedError(error, context);
      
      case 'failed-precondition':
        return this.handleFailedPreconditionError(error, context);
      
      case 'not-found':
        return this.handleNotFoundError(error, context);
      
      case 'already-exists':
        return this.handleAlreadyExistsError(error, context);
      
      case 'resource-exhausted':
        return this.handleResourceExhaustedError(error, context);
      
      case 'deadline-exceeded':
        return this.handleDeadlineExceededError(error, context);
      
      case 'unavailable':
        return this.handleUnavailableError(error, context);
      
      default:
        return this.handleUnknownFirebaseError(error, context);
    }
  }

  /**
   * Handle permission denied errors
   */
  private static handlePermissionDeniedError(
    error: FirebaseError,
    context: { userId?: string; operation: string; resource?: string; timestamp: string }
  ): EnhancedError {
    const isIndexError = error.message.includes('index') || error.message.includes('composite');
    
    if (isIndexError) {
      return {
        code: 'missing-index',
        message: error.message,
        userMessage: 'Database index required for this operation',
        troubleshooting: [
          'Database indexes are being created automatically',
          'This usually takes 1-2 minutes to complete',
          'Please try again in a few minutes',
          'If the issue persists, contact support'
        ],
        isRetryable: true,
        severity: 'medium',
        context
      };
    }

    // Regular permission denied error
    const troubleshooting = [
      'Verify you are logged in to the application',
      'Check if your session has expired and try logging in again',
      'Ensure you have permission to access this data',
      `Check Firebase Console: ${this.CONSOLE_URL}/firestore/rules`
    ];

    if (context.userId) {
      troubleshooting.push(`Your user ID: ${context.userId}`);
    }

    return {
      code: 'permission-denied',
      message: error.message,
      userMessage: 'You don\'t have permission to access this data',
      troubleshooting,
      isRetryable: false,
      severity: 'high',
      context
    };
  }

  /**
   * Handle unauthenticated errors
   */
  private static handleUnauthenticatedError(
    error: FirebaseError,
    context: { userId?: string; operation: string; resource?: string; timestamp: string }
  ): EnhancedError {
    return {
      code: 'unauthenticated',
      message: error.message,
      userMessage: 'Please log in to access this feature',
      troubleshooting: [
        'Click the login button to sign in',
        'If you were previously logged in, your session may have expired',
        'Clear your browser cache and cookies if login issues persist',
        'Try refreshing the page and logging in again'
      ],
      isRetryable: true,
      severity: 'medium',
      context
    };
  }

  /**
   * Handle failed precondition errors (usually index-related)
   */
  private static handleFailedPreconditionError(
    error: FirebaseError,
    context: { userId?: string; operation: string; resource?: string; timestamp: string }
  ): EnhancedError {
    const isIndexError = error.message.includes('index') || error.message.includes('composite');
    
    if (isIndexError) {
      // Extract index creation URL if available
      const indexUrlMatch = error.message.match(/https:\/\/console\.firebase\.google\.com[^\s]+/);
      const indexUrl = indexUrlMatch ? indexUrlMatch[0] : null;
      
      const troubleshooting = [
        'A database index is required for this query',
        'Indexes are being created automatically',
        'This process usually takes 1-5 minutes',
        'Please wait and try again shortly'
      ];
      
      if (indexUrl) {
        troubleshooting.push(`Index creation URL: ${indexUrl}`);
      }

      return {
        code: 'missing-index',
        message: error.message,
        userMessage: 'Database is being optimized for this query. Please try again in a few minutes.',
        troubleshooting,
        isRetryable: true,
        severity: 'medium',
        context
      };
    }

    return {
      code: 'failed-precondition',
      message: error.message,
      userMessage: 'Operation cannot be completed due to current data state',
      troubleshooting: [
        'Check if the data you\'re trying to access exists',
        'Verify the operation is valid for the current data state',
        'Try refreshing the page and attempting the operation again'
      ],
      isRetryable: true,
      severity: 'medium',
      context
    };
  }

  /**
   * Handle not found errors
   */
  private static handleNotFoundError(
    error: FirebaseError,
    context: { userId?: string; operation: string; resource?: string; timestamp: string }
  ): EnhancedError {
    return {
      code: 'not-found',
      message: error.message,
      userMessage: 'The requested data was not found',
      troubleshooting: [
        'Check if the data you\'re looking for exists',
        'Verify you have the correct permissions to view this data',
        'Try refreshing the page to reload the data',
        'If you believe this is an error, contact support'
      ],
      isRetryable: false,
      severity: 'low',
      context
    };
  }

  /**
   * Handle already exists errors
   */
  private static handleAlreadyExistsError(
    error: FirebaseError,
    context: { userId?: string; operation: string; resource?: string; timestamp: string }
  ): EnhancedError {
    return {
      code: 'already-exists',
      message: error.message,
      userMessage: 'This data already exists',
      troubleshooting: [
        'Check if you\'re trying to create duplicate data',
        'Consider updating the existing data instead',
        'Verify the uniqueness constraints for this operation'
      ],
      isRetryable: false,
      severity: 'low',
      context
    };
  }

  /**
   * Handle resource exhausted errors
   */
  private static handleResourceExhaustedError(
    error: FirebaseError,
    context: { userId?: string; operation: string; resource?: string; timestamp: string }
  ): EnhancedError {
    return {
      code: 'resource-exhausted',
      message: error.message,
      userMessage: 'Service is temporarily overloaded. Please try again later.',
      troubleshooting: [
        'Wait a few minutes before trying again',
        'Reduce the amount of data in your request if possible',
        'Try breaking large operations into smaller chunks',
        'Contact support if the issue persists'
      ],
      isRetryable: true,
      severity: 'high',
      context
    };
  }

  /**
   * Handle deadline exceeded errors
   */
  private static handleDeadlineExceededError(
    error: FirebaseError,
    context: { userId?: string; operation: string; resource?: string; timestamp: string }
  ): EnhancedError {
    return {
      code: 'timeout',
      message: error.message,
      userMessage: 'Operation timed out. Please try again.',
      troubleshooting: [
        'Check your internet connection',
        'Try again with a smaller data set',
        'Wait a moment and retry the operation',
        'Contact support if timeouts persist'
      ],
      isRetryable: true,
      severity: 'medium',
      context
    };
  }

  /**
   * Handle service unavailable errors
   */
  private static handleUnavailableError(
    error: FirebaseError,
    context: { userId?: string; operation: string; resource?: string; timestamp: string }
  ): EnhancedError {
    return {
      code: 'service-unavailable',
      message: error.message,
      userMessage: 'Service is temporarily unavailable. Please try again later.',
      troubleshooting: [
        'Check your internet connection',
        'Wait a few minutes and try again',
        'Check Firebase status page for service outages',
        'Contact support if the issue persists'
      ],
      isRetryable: true,
      severity: 'high',
      context
    };
  }

  /**
   * Handle unknown Firebase errors
   */
  private static handleUnknownFirebaseError(
    error: FirebaseError,
    context: { userId?: string; operation: string; resource?: string; timestamp: string }
  ): EnhancedError {
    return {
      code: error.code || 'unknown-firebase-error',
      message: error.message,
      userMessage: 'An unexpected error occurred. Please try again.',
      troubleshooting: [
        'Try refreshing the page',
        'Check your internet connection',
        'Wait a moment and try again',
        `Error code: ${error.code}`,
        'Contact support if the issue persists'
      ],
      isRetryable: true,
      severity: 'medium',
      context
    };
  }

  /**
   * Handle generic JavaScript errors
   */
  private static handleGenericError(
    error: Error,
    context: { userId?: string; operation: string; resource?: string; timestamp: string }
  ): EnhancedError {
    return {
      code: 'generic-error',
      message: error.message,
      userMessage: 'An unexpected error occurred. Please try again.',
      troubleshooting: [
        'Try refreshing the page',
        'Check your internet connection',
        'Clear your browser cache and cookies',
        'Contact support if the issue persists'
      ],
      isRetryable: true,
      severity: 'medium',
      context
    };
  }

  /**
   * Handle completely unknown errors
   */
  private static handleUnknownError(
    error: unknown,
    context: { userId?: string; operation: string; resource?: string; timestamp: string }
  ): EnhancedError {
    return {
      code: 'unknown-error',
      message: String(error),
      userMessage: 'An unexpected error occurred. Please try again.',
      troubleshooting: [
        'Try refreshing the page',
        'Check your internet connection',
        'Contact support with the error details',
        `Error details: ${String(error)}`
      ],
      isRetryable: true,
      severity: 'medium',
      context
    };
  }

  /**
   * Log enhanced error for debugging
   */
  static logEnhancedError(enhancedError: EnhancedError): void {
    const logLevel = this.getLogLevel(enhancedError.severity);
    
    console.group(`🔥 ${logLevel} Firebase Error - ${enhancedError.code}`);
    console.error('📋 User Message:', enhancedError.userMessage);
    console.error('🔧 Technical Message:', enhancedError.message);
    
    if (enhancedError.context?.userId) {
      console.error('👤 User ID:', enhancedError.context.userId);
    }
    
    if (enhancedError.context?.operation) {
      console.error('⚙️ Operation:', enhancedError.context.operation);
    }
    
    if (enhancedError.context?.resource) {
      console.error('📁 Resource:', enhancedError.context.resource);
    }
    
    console.error('⏰ Timestamp:', enhancedError.context?.timestamp);
    console.error('🔄 Retryable:', enhancedError.isRetryable);
    
    if (enhancedError.troubleshooting.length > 0) {
      console.group('💡 Troubleshooting Steps:');
      enhancedError.troubleshooting.forEach((step, index) => {
        console.error(`   ${index + 1}. ${step}`);
      });
      console.groupEnd();
    }
    
    console.groupEnd();
  }

  /**
   * Get appropriate log level emoji
   */
  private static getLogLevel(severity: string): string {
    switch (severity) {
      case 'low': return '🟢 INFO';
      case 'medium': return '🟡 WARN';
      case 'high': return '🟠 ERROR';
      case 'critical': return '🔴 CRITICAL';
      default: return '⚪ UNKNOWN';
    }
  }

  /**
   * Create user-friendly API response from enhanced error
   */
  static createApiErrorResponse(enhancedError: EnhancedError): {
    error: string;
    message: string;
    code: string;
    retryable: boolean;
    troubleshooting?: string[];
    timestamp: string;
  } {
    return {
      error: enhancedError.userMessage,
      message: enhancedError.userMessage,
      code: enhancedError.code,
      retryable: enhancedError.isRetryable,
      troubleshooting: enhancedError.severity === 'low' ? undefined : enhancedError.troubleshooting,
      timestamp: enhancedError.context?.timestamp || new Date().toISOString()
    };
  }

  /**
   * Get HTTP status code based on error type
   */
  static getHttpStatusCode(enhancedError: EnhancedError): number {
    switch (enhancedError.code) {
      case 'unauthenticated':
        return 401;
      case 'permission-denied':
        return 403;
      case 'not-found':
        return 404;
      case 'already-exists':
        return 409;
      case 'failed-precondition':
      case 'missing-index':
        return 412;
      case 'resource-exhausted':
        return 429;
      case 'timeout':
      case 'deadline-exceeded':
        return 408;
      case 'service-unavailable':
        return 503;
      default:
        return 500;
    }
  }
}