"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ChevronDown, MenuIcon, Moon, Sun, User, LogOut } from "lucide-react"
import { useTheme } from "next-themes"
import { AuthModal } from "./auth-modal"
import { useAuth } from "@/hooks/use-firebase-auth"

export function Header() {
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [authMode, setAuthMode] = useState<"login" | "signup">("login")
  const { theme, setTheme } = useTheme()
  const { user, logout, loading } = useAuth()

  const handleGetStarted = () => {
    setAuthMode("signup")
    setAuthModalOpen(true)
  }

  const handleSignIn = () => {
    setAuthMode("login")
    setAuthModalOpen(true)
  }

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  return (
    <header className="px-4 lg:px-6 h-16 flex items-center justify-between border-b bg-white shadow-sm dark:bg-blue-950 dark:border-blue-800 sticky top-0 z-50">
      <div className="flex items-center gap-4">
        <Link href="/" className="flex items-center justify-center font-bold text-xl text-gray-900 dark:text-white">
          <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center mr-2">
            <span className="text-white font-bold text-lg">K</span>
          </div>
          KoinFile
        </Link>
      </div>

      {/* Centered Navigation */}
      <nav className="hidden md:flex gap-8 items-center absolute left-1/2 transform -translate-x-1/2">
        {/* Products Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="text-sm font-medium hover:text-purple-600 transition-colors dark:text-gray-200 dark:hover:text-purple-400"
            >
              Products <ChevronDown className="ml-1 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="center" className="w-48">
            <DropdownMenuItem asChild>
              <Link href="/products/individual" className="w-full">
                For Individuals
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/accounting" className="w-full">
                For Enterprises
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Tools Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="text-sm font-medium hover:text-purple-600 transition-colors dark:text-gray-200 dark:hover:text-purple-400"
            >
              Tools <ChevronDown className="ml-1 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="center" className="w-48">
            <DropdownMenuItem asChild>
              <Link href="/tools/crypto-converter" className="w-full">
                Crypto Converter
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/tools/tax-calculator" className="w-full">
                Crypto Tax Calculator
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Resources Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="text-sm font-medium hover:text-purple-600 transition-colors dark:text-gray-200 dark:hover:text-purple-400"
            >
              Resources <ChevronDown className="ml-1 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="center" className="w-48">
            <DropdownMenuItem asChild>
              <Link href="/features" className="w-full">
                Features
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/guides" className="w-full">
                Product Guide
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/blog" className="w-full">
                Blog
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/tax-guides" className="w-full">
                Crypto Guide
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Link
          href="/pricing"
          className="text-sm font-medium hover:text-purple-600 transition-colors dark:text-gray-200 dark:hover:text-purple-400"
        >
          Pricing
        </Link>
      </nav>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
          <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>

        <div className="hidden md:flex items-center gap-2">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span className="max-w-32 truncate">{user.displayName || user.email}</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem asChild>
                  <Link href="/dashboard" className="w-full">
                    Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout} className="text-red-600 dark:text-red-400">
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSignIn}
                className="text-purple-600 hover:text-purple-700 dark:text-purple-400"
                disabled={loading}
              >
                Sign In
              </Button>
              <Button 
                size="sm" 
                onClick={handleGetStarted} 
                className="bg-purple-600 hover:bg-purple-700 text-white"
                disabled={loading}
              >
                Get Started
              </Button>
            </>
          )}
        </div>

        <Button variant="ghost" size="icon" className="md:hidden dark:text-white">
          <MenuIcon className="h-6 w-6" />
          <span className="sr-only">Toggle navigation menu</span>
        </Button>
      </div>

      <AuthModal open={authModalOpen} onOpenChange={setAuthModalOpen} mode={authMode} onModeChange={setAuthMode} />
    </header>
  )
}
