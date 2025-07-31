import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit,
  writeBatch,
  setDoc,
  Timestamp
} from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { 
  Transaction, 
  UserPortfolio, 
  ProcessingJob, 
  Holding,
  TaxCalculation 
} from '@/lib/types/transaction'
import { FirebaseErrorHandler } from '@/lib/utils/firebase-error-handler'
import { PermissionLogger } from '@/lib/utils/permission-logger'

export class DatabaseService {
  // Transaction operations
  async saveTransaction(transaction: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const transactionData = {
        ...transaction,
        timestamp: Timestamp.fromDate(transaction.timestamp),
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      }
      
      const docRef = await addDoc(collection(db, 'transactions'), transactionData)
      return docRef.id
    } catch (error) {
      console.error('Error saving transaction:', error)
      throw new Error('Failed to save transaction')
    }
  }

  async saveTransactionsBatch(transactions: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>[]): Promise<string[]> {
    try {
      const batch = writeBatch(db)
      const transactionIds: string[] = []
      
      for (const transaction of transactions) {
        const docRef = doc(collection(db, 'transactions'))
        const transactionData = {
          ...transaction,
          timestamp: Timestamp.fromDate(transaction.timestamp),
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now()
        }
        
        batch.set(docRef, transactionData)
        transactionIds.push(docRef.id)
      }
      
      await batch.commit()
      return transactionIds
    } catch (error) {
      console.error('Error saving transactions batch:', error)
      throw new Error('Failed to save transactions')
    }
  }

  async getUserTransactions(userId: string, limitCount?: number): Promise<Transaction[]> {
    const startTime = Date.now()
    
    try {
      console.log('Database: Fetching transactions for user:', userId)
      
      if (!db) {
        const enhancedError = FirebaseErrorHandler.handleFirebaseError(
          new Error('Database not initialized'),
          { userId, operation: 'getUserTransactions', resource: 'transactions' }
        )
        
        PermissionLogger.logError('getUserTransactions', 'transactions', {
          userId,
          collection: 'transactions',
          errorCode: 'database-not-initialized',
          errorMessage: 'Database not initialized',
          duration: Date.now() - startTime
        })
        
        FirebaseErrorHandler.logEnhancedError(enhancedError)
        throw new Error(enhancedError.userMessage)
      }
      
      let q = query(
        collection(db, 'transactions'),
        where('userId', '==', userId),
        orderBy('timestamp', 'desc')
      )
      
      if (limitCount) {
        q = query(q, limit(limitCount))
      }
      
      const querySnapshot = await getDocs(q)
      const transactions: Transaction[] = []
      
      console.log('Database: Found', querySnapshot.size, 'transactions')
      
      querySnapshot.forEach((doc) => {
        const data = doc.data()
        transactions.push({
          id: doc.id,
          ...data,
          timestamp: data.timestamp.toDate(),
          createdAt: data.createdAt.toDate(),
          updatedAt: data.updatedAt.toDate()
        } as Transaction)
      })
      
      // Log successful permission attempt
      PermissionLogger.logSuccess('getUserTransactions', 'transactions', {
        userId,
        collection: 'transactions',
        duration: Date.now() - startTime,
        metadata: {
          transactionCount: transactions.length,
          limitApplied: limitCount || null
        }
      })
      
      return transactions
    } catch (error) {
      const enhancedError = FirebaseErrorHandler.handleFirebaseError(
        error,
        { userId, operation: 'getUserTransactions', resource: 'transactions' }
      )
      
      // Log permission error
      PermissionLogger.logError('getUserTransactions', 'transactions', {
        userId,
        collection: 'transactions',
        errorCode: enhancedError.code,
        errorMessage: enhancedError.message,
        duration: Date.now() - startTime,
        metadata: {
          limitApplied: limitCount || null
        }
      })
      
      FirebaseErrorHandler.logEnhancedError(enhancedError)
      throw enhancedError
    }
  }

  async updateTransaction(transactionId: string, updates: Partial<Transaction>): Promise<void> {
    try {
      const docRef = doc(db, 'transactions', transactionId)
      const updateData = {
        ...updates,
        updatedAt: Timestamp.now()
      }
      
      if (updates.timestamp) {
        (updateData as any).timestamp = Timestamp.fromDate(updates.timestamp)
      }
      
      await updateDoc(docRef, updateData)
    } catch (error) {
      console.error('Error updating transaction:', error)
      throw new Error('Failed to update transaction')
    }
  }

  async deleteTransaction(transactionId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, 'transactions', transactionId))
    } catch (error) {
      console.error('Error deleting transaction:', error)
      throw new Error('Failed to delete transaction')
    }
  }

  // Portfolio operations
  async saveUserPortfolio(portfolio: UserPortfolio): Promise<void> {
    try {
      const portfolioData = {
        ...portfolio,
        lastUpdated: Timestamp.fromDate(portfolio.lastUpdated)
      }
      
      const docRef = doc(db, 'portfolios', portfolio.userId)
      
      // Use setDoc with merge option to create or update
      await setDoc(docRef, portfolioData, { merge: true })
    } catch (error) {
      console.error('Error saving portfolio:', error)
      throw new Error('Failed to save portfolio')
    }
  }

  async getUserPortfolio(userId: string): Promise<UserPortfolio | null> {
    const startTime = Date.now()
    
    try {
      console.log('Database: Fetching portfolio for user:', userId)
      
      if (!db) {
        const enhancedError = FirebaseErrorHandler.handleFirebaseError(
          new Error('Database not initialized'),
          { userId, operation: 'getUserPortfolio', resource: 'portfolios' }
        )
        
        PermissionLogger.logError('getUserPortfolio', 'portfolios', {
          userId,
          collection: 'portfolios',
          documentId: userId,
          errorCode: 'database-not-initialized',
          errorMessage: 'Database not initialized',
          duration: Date.now() - startTime
        })
        
        FirebaseErrorHandler.logEnhancedError(enhancedError)
        throw new Error(enhancedError.userMessage)
      }
      
      const docRef = doc(db, 'portfolios', userId)
      const docSnap = await getDoc(docRef)
      
      if (docSnap.exists()) {
        console.log('Database: Found cached portfolio')
        const data = docSnap.data()
        
        // Log successful permission attempt
        PermissionLogger.logSuccess('getUserPortfolio', 'portfolios', {
          userId,
          collection: 'portfolios',
          documentId: userId,
          duration: Date.now() - startTime,
          metadata: {
            portfolioFound: true,
            lastUpdated: data.lastUpdated?.toDate?.()?.toISOString()
          }
        })
        
        return {
          ...data,
          lastUpdated: data.lastUpdated.toDate()
        } as UserPortfolio
      }
      
      console.log('Database: No cached portfolio found')
      
      // Log successful permission attempt (no data found)
      PermissionLogger.logSuccess('getUserPortfolio', 'portfolios', {
        userId,
        collection: 'portfolios',
        documentId: userId,
        duration: Date.now() - startTime,
        metadata: {
          portfolioFound: false
        }
      })
      
      return null
    } catch (error) {
      const enhancedError = FirebaseErrorHandler.handleFirebaseError(
        error,
        { userId, operation: 'getUserPortfolio', resource: 'portfolios' }
      )
      
      // Log permission error
      PermissionLogger.logError('getUserPortfolio', 'portfolios', {
        userId,
        collection: 'portfolios',
        documentId: userId,
        errorCode: enhancedError.code,
        errorMessage: enhancedError.message,
        duration: Date.now() - startTime
      })
      
      FirebaseErrorHandler.logEnhancedError(enhancedError)
      throw enhancedError
    }
  }

  // Processing job operations
  async createProcessingJob(job: Omit<ProcessingJob, 'id' | 'createdAt'>): Promise<string> {
    try {
      const jobData = {
        ...job,
        createdAt: Timestamp.now()
      }
      
      const docRef = await addDoc(collection(db, 'processing_jobs'), jobData)
      return docRef.id
    } catch (error) {
      console.error('Error creating processing job:', error)
      throw new Error('Failed to create processing job')
    }
  }

  async updateProcessingJob(jobId: string, updates: Partial<ProcessingJob>): Promise<void> {
    try {
      const docRef = doc(db, 'processing_jobs', jobId)
      const updateData = { ...updates }
      
      if (updates.status === 'completed' || updates.status === 'failed') {
        (updateData as any).completedAt = Timestamp.now()
      }
      
      await updateDoc(docRef, updateData)
    } catch (error) {
      console.error('Error updating processing job:', error)
      throw new Error('Failed to update processing job')
    }
  }

  async getProcessingJob(jobId: string): Promise<ProcessingJob | null> {
    try {
      const docRef = doc(db, 'processing_jobs', jobId)
      const docSnap = await getDoc(docRef)
      
      if (docSnap.exists()) {
        const data = docSnap.data()
        return {
          id: docSnap.id,
          ...data,
          createdAt: data.createdAt.toDate(),
          completedAt: data.completedAt?.toDate()
        } as ProcessingJob
      }
      
      return null
    } catch (error) {
      console.error('Error fetching processing job:', error)
      throw new Error('Failed to fetch processing job')
    }
  }

  async getUserProcessingJobs(userId: string): Promise<ProcessingJob[]> {
    try {
      const q = query(
        collection(db, 'processing_jobs'),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc'),
        limit(20)
      )
      
      const querySnapshot = await getDocs(q)
      const jobs: ProcessingJob[] = []
      
      querySnapshot.forEach((doc) => {
        const data = doc.data()
        jobs.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt.toDate(),
          completedAt: data.completedAt?.toDate()
        } as ProcessingJob)
      })
      
      return jobs
    } catch (error) {
      console.error('Error fetching processing jobs:', error)
      throw new Error('Failed to fetch processing jobs')
    }
  }

  // Tax calculation operations
  async saveTaxCalculation(calculation: Omit<TaxCalculation, 'createdAt'>): Promise<string> {
    try {
      const calculationData = {
        ...calculation,
        createdAt: Timestamp.now()
      }
      
      const docRef = await addDoc(collection(db, 'tax_calculations'), calculationData)
      return docRef.id
    } catch (error) {
      console.error('Error saving tax calculation:', error)
      throw new Error('Failed to save tax calculation')
    }
  }

  async getUserTaxCalculations(userId: string, taxYear?: number): Promise<TaxCalculation[]> {
    try {
      let q = query(
        collection(db, 'tax_calculations'),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      )
      
      if (taxYear) {
        q = query(q, where('taxYear', '==', taxYear))
      }
      
      const querySnapshot = await getDocs(q)
      const calculations: TaxCalculation[] = []
      
      querySnapshot.forEach((doc) => {
        const data = doc.data()
        calculations.push({
          ...data,
          createdAt: data.createdAt.toDate()
        } as TaxCalculation)
      })
      
      return calculations
    } catch (error) {
      console.error('Error fetching tax calculations:', error)
      throw new Error('Failed to fetch tax calculations')
    }
  }

  // Utility functions
  async checkDuplicateTransactions(userId: string, transactions: Partial<Transaction>[]): Promise<string[]> {
    try {
      const existingTransactions = await this.getUserTransactions(userId)
      const duplicates: string[] = []
      
      for (const newTx of transactions) {
        let isDuplicate = false;
        let reason = '';

        // For deposits/withdrawals, use TXID if available
        if (
          (newTx.type === 'transfer_in' || newTx.type === 'transfer_out') &&
          newTx.rawData && (newTx.rawData.TXID || newTx.rawData.txid || newTx.rawData.txHash)
        ) {
          const txid = (newTx.rawData.TXID || newTx.rawData.txid || newTx.rawData.txHash).toLowerCase();
          isDuplicate = existingTransactions.some(existing =>
            existing.rawData && (
              (existing.rawData.TXID && existing.rawData.TXID.toLowerCase() === txid) ||
              (existing.rawData.txid && existing.rawData.txid.toLowerCase() === txid) ||
              (existing.rawData.txHash && existing.rawData.txHash.toLowerCase() === txid)
            )
          );
          if (isDuplicate) reason = `TXID duplicate: ${txid}`;
        } else {
          // Fallback to old logic for other types
          isDuplicate = existingTransactions.some(existing =>
            existing.timestamp.getTime() === newTx.timestamp?.getTime() &&
            existing.symbol === newTx.symbol &&
            existing.amount === newTx.amount &&
            existing.type === newTx.type
          );
          if (isDuplicate) reason = 'timestamp+symbol+amount+type match';
        }

        if (isDuplicate) {
          console.log('[DuplicateDetection] Skipped:', {
            symbol: newTx.symbol,
            type: newTx.type,
            amount: newTx.amount,
            timestamp: newTx.timestamp,
            reason,
            txid: newTx.rawData?.TXID || newTx.rawData?.txid || newTx.rawData?.txHash || null
          });
          duplicates.push(`${newTx.symbol} ${newTx.type} ${newTx.amount} on ${newTx.timestamp}`)
        }
      }
      
      return duplicates
    } catch (error) {
      console.error('Error checking duplicates:', error)
      return []
    }
  }

  async getUserStats(userId: string): Promise<{
    totalTransactions: number
    totalValue: number
    uniqueAssets: number
    lastTransaction?: Date
  }> {
    try {
      const transactions = await this.getUserTransactions(userId)
      const portfolio = await this.getUserPortfolio(userId)
      
      const uniqueAssets = new Set(transactions.map(tx => tx.symbol)).size
      const lastTransaction = transactions.length > 0 ? transactions[0].timestamp : undefined
      
      return {
        totalTransactions: transactions.length,
        totalValue: portfolio?.totalValue || 0,
        uniqueAssets,
        lastTransaction
      }
    } catch (error) {
      console.error('Error fetching user stats:', error)
      throw new Error('Failed to fetch user stats')
    }
  }
}

// Export singleton instance
export const dbService = new DatabaseService()