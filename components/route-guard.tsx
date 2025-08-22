// "use client"

// import type React from "react"

// import { useEffect, useState } from "react"
// import { useRouter } from "next/navigation"

// interface UserData {
//   email: string
//   name: string
//   role: "candidate" | "organization"
//   isLoggedIn: boolean
// }

// interface RouteGuardProps {
//   children: React.ReactNode
//   requiredRole?: "candidate" | "organization"
//   requireAuth?: boolean
// }

// export function RouteGuard({ children, requiredRole, requireAuth = true }: RouteGuardProps) {
//   const [user, setUser] = useState<UserData | null>(null)
//   const [isLoading, setIsLoading] = useState(true)
//   const router = useRouter()

//   useEffect(() => {
//     const userData = localStorage.getItem("saviai_user")

//     if (userData) {
//       const parsedUser = JSON.parse(userData)
//       setUser(parsedUser)
//     }

//     setIsLoading(false)
//   }, [])

//   useEffect(() => {
//     if (!isLoading) {
//       if (requireAuth && !user) {
//         router.push("/login")
//         return
//       }

//       if (requiredRole && user && user.role !== requiredRole) {
//         router.push("/unauthorized")
//         return
//       }
//     }
//   }, [user, isLoading, requireAuth, requiredRole, router])

//   if (isLoading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-100 dark:from-slate-900 dark:via-indigo-900 dark:to-purple-900 flex items-center justify-center">
//         <div className="text-center">
//           <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4" />
//           <p className="text-slate-600 dark:text-slate-400">Loading...</p>
//         </div>
//       </div>
//     )
//   }

//   if (requireAuth && !user) {
//     return null
//   }

//   if (requiredRole && user && user.role !== requiredRole) {
//     return null
//   }

//   return <>{children}</>
// }
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
