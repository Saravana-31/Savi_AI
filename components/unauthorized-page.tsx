"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Shield, ArrowLeft } from "lucide-react"
import Link from "next/link"

export function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-100 dark:from-slate-900 dark:via-indigo-900 dark:to-purple-900 flex items-center justify-center p-6">
      <Card className="glass-card shadow-2xl max-w-md w-full text-center">
        <CardContent className="p-12">
          <div className="w-20 h-20 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <Shield className="w-10 h-10 text-foreground" />
          </div>

          <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-200 mb-4">Access Denied</h1>

          <p className="text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
            You don't have permission to access this page. Please check your account role or contact support.
          </p>

          <div className="space-y-4">
            <Link href="/welcome">
              <Button className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-foreground shadow-lg hover-lift">
                <ArrowLeft className="w-5 h-5 mr-2" />
                Go to Home
              </Button>
            </Link>

            <Link href="/login">
              <Button
                variant="outline"
                className="w-full glass-card hover:bg-white/30 dark:hover:bg-white/10 bg-transparent"
              >
                Login with Different Account
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
