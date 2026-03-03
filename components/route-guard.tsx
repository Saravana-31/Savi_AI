"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import type React from "react"

interface UserData {
  email: string
  name: string
  role: "candidate" | "organization"
  isLoggedIn: boolean
}

interface RouteGuardProps {
  children: React.ReactNode
  requiredRole?: "candidate" | "organization"
  requireAuth?: boolean
}

export function RouteGuard({ children, requiredRole, requireAuth = true }: RouteGuardProps) {
  const [user, setUser] = useState<UserData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    if (typeof window !== "undefined") {
      const userData = localStorage.getItem("saviai_user")
      if (userData) {
        const parsedUser = JSON.parse(userData)
        setUser(parsedUser)
      }
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!isLoading) {
      if (requireAuth && !user) {
        router.replace("/login") // Use replace instead of push to prevent back loop
        return
      }

      if (requiredRole && user?.role !== requiredRole) {
        router.replace("/unauthorized")
        return
      }
    }
  }, [user, isLoading, requireAuth, requiredRole, router])

  if (isLoading || (requireAuth && !user)) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-background text-foreground">
        <p>Checking login...</p>
      </div>
    )
  }

  return <>{children}</>
}
