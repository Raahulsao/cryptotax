"use client"

import { useState, useEffect, createContext, useContext } from 'react'
import { 
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  updateProfile,
  AuthError
} from 'firebase/auth'
import { doc, setDoc, getDoc } from 'firebase/firestore'
import { auth, googleProvider, db } from '@/lib/firebase'
import { useRouter } from 'next/navigation'

interface AuthContextType {
  user: User | null
  loading: boolean
  signUp: (email: string, password: string, fullName: string) => Promise<void>
  signIn: (email: string, password: string) => Promise<void>
  signInWithGoogle: () => Promise<void>
  logout: () => Promise<void>
  error: string | null
  clearError: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export function useFirebaseAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  // Clear error function
  const clearError = () => setError(null)

  // Format Firebase error messages
  const formatFirebaseError = (error: AuthError): string => {
    switch (error.code) {
      case 'auth/user-not-found':
      case 'auth/wrong-password':
      case 'auth/invalid-credential':
        return 'Invalid email or password'
      case 'auth/email-already-in-use':
        return 'An account with this email already exists'
      case 'auth/weak-password':
        return 'Password should be at least 6 characters'
      case 'auth/invalid-email':
        return 'Please enter a valid email address'
      case 'auth/too-many-requests':
        return 'Too many failed attempts. Please try again later'
      case 'auth/network-request-failed':
        return 'Network error. Please check your connection'
      case 'auth/popup-closed-by-user':
        return 'Sign-in was cancelled'
      default:
        return error.message || 'An error occurred during authentication'
    }
  }

  // Create user document in Firestore
  const createUserDocument = async (user: User, additionalData?: any) => {
    if (!user) return

    const userRef = doc(db, 'users', user.uid)
    const userSnap = await getDoc(userRef)

    if (!userSnap.exists()) {
      const { displayName, email, photoURL } = user
      const createdAt = new Date()

      try {
        await setDoc(userRef, {
          displayName: displayName || additionalData?.fullName || '',
          email,
          photoURL: photoURL || '',
          createdAt,
          ...additionalData
        })
      } catch (error) {
        console.error('Error creating user document:', error)
      }
    }
  }

  // Sign up with email and password
  const signUp = async (email: string, password: string, fullName: string) => {
    if (!auth) {
      setError('Firebase is not configured. Please set up your environment variables.')
      return
    }
    
    try {
      setError(null)
      setLoading(true)
      
      const { user } = await createUserWithEmailAndPassword(auth, email, password)
      
      // Update the user's display name
      await updateProfile(user, {
        displayName: fullName
      })

      // Create user document in Firestore
      await createUserDocument(user, { fullName })
      
      router.push('/dashboard')
    } catch (error) {
      setError(formatFirebaseError(error as AuthError))
      throw error
    } finally {
      setLoading(false)
    }
  }

  // Sign in with email and password
  const signIn = async (email: string, password: string) => {
    if (!auth) {
      setError('Firebase is not configured. Please set up your environment variables.')
      return
    }
    
    try {
      setError(null)
      setLoading(true)
      
      await signInWithEmailAndPassword(auth, email, password)
      router.push('/dashboard')
    } catch (error) {
      setError(formatFirebaseError(error as AuthError))
      throw error
    } finally {
      setLoading(false)
    }
  }

  // Sign in with Google
  const signInWithGoogle = async () => {
    if (!auth) {
      setError('Firebase is not configured. Please set up your environment variables.')
      return
    }
    
    try {
      setError(null)
      setLoading(true)
      
      const { user } = await signInWithPopup(auth, googleProvider)
      
      // Create user document in Firestore if it doesn't exist
      await createUserDocument(user)
      
      router.push('/dashboard')
    } catch (error) {
      if ((error as AuthError).code !== 'auth/popup-closed-by-user') {
        setError(formatFirebaseError(error as AuthError))
      }
      throw error
    } finally {
      setLoading(false)
    }
  }

  // Logout
  const logout = async () => {
    if (!auth) {
      router.push('/')
      return
    }
    
    try {
      setError(null)
      await signOut(auth)
      router.push('/')
    } catch (error) {
      setError(formatFirebaseError(error as AuthError))
      throw error
    }
  }

  // Listen for authentication state changes
  useEffect(() => {
    if (!auth) {
      setLoading(false)
      return
    }
    
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
      setLoading(false)
    })

    return unsubscribe
  }, [])

  return {
    user,
    loading,
    signUp,
    signIn,
    signInWithGoogle,
    logout,
    error,
    clearError
  }
}

export { AuthContext }