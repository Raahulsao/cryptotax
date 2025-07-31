"use client"

import React from 'react'
import { AuthContext, useFirebaseAuth } from '@/hooks/use-firebase-auth'

interface AuthProviderProps {
  children: React.ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const auth = useFirebaseAuth()

  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  )
}