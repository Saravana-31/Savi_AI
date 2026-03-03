"use client"

import type React from "react"
import { useState } from "react"
import { signIn, getSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Input } from "@/components/ui/input"
import { Eye, EyeOff, Mail, Lock, Sparkles, ArrowRight, Zap, Brain, BarChart3, Mic } from "lucide-react"
import { EnhancedBackground } from "@/components/enhanced-background"
import Link from "next/link"
import toast from "react-hot-toast"

export function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        toast.error("Invalid credentials. Please try again.", {
          duration: 4000,
          style: {
            background: "rgba(239, 68, 68, 0.1)",
            border: "1px solid rgba(239, 68, 68, 0.4)",
            color: "#fecaca",
          },
        })
      } else {
        const session = await getSession()
        toast.success(`Welcome back${session?.user?.name ? `, ${session.user.name}` : ""}! 🎉`, {
          duration: 4000,
          style: {
            background: "rgba(0, 212, 255, 0.1)",
            border: "1px solid rgba(0, 212, 255, 0.4)",
            color: "#cffafe",
            fontWeight: "bold",
          },
        })
        setTimeout(() => { router.push("/welcome") }, 1000)
      }
    } catch (error) {
      console.error("Login error:", error)
      toast.error("Login failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleGuestAccess = () => {
    toast.success("Continuing as guest! 👋", {
      duration: 3000,
      style: {
        background: "rgba(168, 85, 247, 0.1)",
        border: "1px solid rgba(168, 85, 247, 0.4)",
        color: "#e9d5ff",
      },
    })
    setTimeout(() => { router.push("/welcome") }, 1000)
  }

  const features = [
    { icon: Brain, label: "AI Emotion Analysis", color: "#00d4ff" },
    { icon: Mic, label: "Speech Recognition", color: "#a855f7" },
    { icon: BarChart3, label: "Performance Reports", color: "#00ff9d" },
    { icon: Zap, label: "Real-time Feedback", color: "#f59e0b" },
  ]

  return (
    <div className="min-h-screen relative overflow-hidden">
      <EnhancedBackground />

      <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
        <div className="w-full max-w-5xl grid lg:grid-cols-2 gap-12 items-center">

          {/* Left Side — Branding */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-left"
          >
            {/* Logo */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex items-center space-x-3 justify-center lg:justify-start mb-8"
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{
                  background: "linear-gradient(135deg, #00d4ff 0%, #a855f7 100%)",
                  boxShadow: "0 0 30px rgba(0, 212, 255, 0.5)",
                }}
              >
                <Zap className="w-7 h-7 text-white" />
              </div>
              <span
                className="text-3xl font-bold"
                style={{
                  background: "linear-gradient(135deg, #00d4ff 0%, #a855f7 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                SaviAI
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-5xl lg:text-6xl font-bold mb-4 leading-tight"
            >
              <span style={{ color: "#f1f5f9" }}>Your AI</span>
              <br />
              <span
                style={{
                  background: "linear-gradient(135deg, #00d4ff 0%, #a855f7 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Interview Coach
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-slate-400 text-lg mb-10 leading-relaxed"
            >
              Practice with realistic AI interviews, get instant feedback, and land your dream job.
            </motion.p>

            {/* Feature List */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="grid grid-cols-2 gap-4"
            >
              {features.map((feat, i) => {
                const Icon = feat.icon
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + i * 0.1 }}
                    className="flex items-center space-x-3 p-3 rounded-xl"
                    style={{
                      background: "rgba(255,255,255,0.03)",
                      border: `1px solid ${feat.color}22`,
                    }}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" style={{ color: feat.color }} />
                    <span className="text-sm text-slate-300">{feat.label}</span>
                  </motion.div>
                )
              })}
            </motion.div>
          </motion.div>

          {/* Right Side — Login Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div
              className="p-8 rounded-2xl relative overflow-hidden"
              style={{
                background: "rgba(5, 8, 22, 0.8)",
                backdropFilter: "blur(30px)",
                border: "1px solid rgba(0, 212, 255, 0.2)",
                boxShadow: "0 25px 60px rgba(0, 0, 0, 0.5), 0 0 40px rgba(0, 212, 255, 0.05)",
              }}
            >
              {/* Top glow accent */}
              <div
                className="absolute top-0 left-0 right-0 h-px"
                style={{ background: "linear-gradient(90deg, transparent, #00d4ff, #a855f7, transparent)" }}
              />

              <div className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-1">Welcome Back</h2>
                <p className="text-slate-400 text-sm">Sign in to continue your journey</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Email */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="pl-10 h-12 rounded-xl text-white placeholder:text-slate-600 transition-all"
                      style={{
                        background: "rgba(255,255,255,0.04)",
                        border: "1px solid rgba(0, 212, 255, 0.15)",
                      }}
                      required
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <Input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="pl-10 pr-10 h-12 rounded-xl text-white placeholder:text-slate-600 transition-all"
                      style={{
                        background: "rgba(255,255,255,0.04)",
                        border: "1px solid rgba(0, 212, 255, 0.15)",
                      }}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-cyan-400 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Sign In Button */}
                <motion.button
                  type="submit"
                  disabled={isLoading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full h-12 rounded-xl font-semibold text-white flex items-center justify-center space-x-2 transition-all"
                  style={{
                    background: isLoading
                      ? "rgba(100,116,139,0.3)"
                      : "linear-gradient(135deg, #00d4ff 0%, #a855f7 100%)",
                    boxShadow: isLoading ? "none" : "0 0 25px rgba(0, 212, 255, 0.3), 0 0 50px rgba(168, 85, 247, 0.1)",
                  }}
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Signing In...</span>
                    </>
                  ) : (
                    <>
                      <span>Sign In</span>
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </motion.button>
              </form>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }} />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="px-3 text-slate-500" style={{ background: "rgba(5,8,22,0.9)" }}>or</span>
                </div>
              </div>

              {/* Guest Access */}
              <motion.button
                type="button"
                onClick={handleGuestAccess}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full h-12 rounded-xl font-medium text-slate-300 hover:text-white transition-all flex items-center justify-center space-x-2"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <Sparkles className="w-4 h-4" />
                <span>Continue as Guest</span>
              </motion.button>

              {/* Sign Up Link */}
              <p className="text-center text-slate-500 text-sm mt-6">
                Don&apos;t have an account?{" "}
                <Link href="/register" className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors">
                  Sign up here
                </Link>
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
