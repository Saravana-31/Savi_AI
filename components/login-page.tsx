"use client"

import type React from "react"

import { useState } from "react"
import { signIn, getSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Eye, EyeOff, Mail, Lock, User, Users, Sparkles, ArrowRight } from "lucide-react"
import { AiAssistantSavi } from "@/components/ai-assistant-savi"
import { EnhancedBackground } from "@/components/enhanced-background"
import Link from "next/link"
import toast from "react-hot-toast"

export function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedRole, setSelectedRole] = useState<"candidate" | "recruiter">("candidate")
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
            background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
            color: "white",
          },
        })
      } else {
        // Get session to check user data
        const session = await getSession()

        toast.success(`Welcome back${session?.user?.name ? `, ${session.user.name}` : ""}! 🎉`, {
          duration: 4000,
          style: {
            background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
            color: "white",
            fontWeight: "bold",
          },
        })

        // Redirect to welcome page (not auto-start interview)
        setTimeout(() => {
          router.push("/welcome")
        }, 1000)
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
        background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
        color: "white",
      },
    })

    setTimeout(() => {
      router.push("/welcome")
    }, 1000)
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      <EnhancedBackground />
      <AiAssistantSavi isVisible={true} emotion="greeting" />

      {/* Animated blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 20,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
          className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-r from-emerald-400/20 to-blue-400/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, -80, 0],
            y: [0, 60, 0],
            scale: [1, 0.8, 1],
          }}
          transition={{
            duration: 15,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: 5,
          }}
          className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-3xl"
        />
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
        <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Branding */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-left"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="mb-8"
            >
              <h1 className="text-6xl lg:text-7xl font-bold mb-6">
                <span
                  style={{
                    background: "linear-gradient(135deg, #10b981 0%, #3b82f6 50%, #a855f7 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  Savi AI
                </span>
              </h1>
              <p className="text-2xl text-slate-600 dark:text-slate-300 mb-8 leading-relaxed">
                Your AI-powered interview assistant that helps you practice, improve, and succeed
              </p>

              <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
                <Badge
                  variant="outline"
                  className="px-4 py-2 text-sm font-semibold"
                  style={{
                    background: "rgba(16, 185, 129, 0.1)",
                    border: "1px solid rgba(16, 185, 129, 0.3)",
                    color: "#059669",
                  }}
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  AI-Powered
                </Badge>
                <Badge
                  variant="outline"
                  className="px-4 py-2 text-sm font-semibold"
                  style={{
                    background: "rgba(59, 130, 246, 0.1)",
                    border: "1px solid rgba(59, 130, 246, 0.3)",
                    color: "#1d4ed8",
                  }}
                >
                  Real-time Analysis
                </Badge>
                <Badge
                  variant="outline"
                  className="px-4 py-2 text-sm font-semibold"
                  style={{
                    background: "rgba(168, 85, 247, 0.1)",
                    border: "1px solid rgba(168, 85, 247, 0.3)",
                    color: "#7c3aed",
                  }}
                >
                  Instant Feedback
                </Badge>
              </div>
            </motion.div>

            {/* Features */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="space-y-4"
            >
              {[
                "🎯 Practice with realistic interview scenarios",
                "🧠 Get AI-powered feedback on your performance",
                "📊 Track your progress with detailed analytics",
                "🎤 Voice recognition and emotion analysis",
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                  className="flex items-center space-x-3 text-slate-600 dark:text-slate-300"
                >
                  <span className="text-lg">{feature}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Side - Login Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Card
              className="shadow-2xl border-0 backdrop-blur-xl"
              style={{
                background: "rgba(255, 255, 255, 0.1)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
              }}
            >
              <CardHeader className="text-center pb-6">
                <CardTitle className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                  Welcome Back! 👋
                </CardTitle>
                <p className="text-slate-600 dark:text-slate-400">
                  Sign in to continue your interview journey with Savi
                </p>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Role Selection */}
                <div className="space-y-3">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Select Your Role</label>
                  <div className="grid grid-cols-2 gap-3">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedRole("candidate")}
                      className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                        selectedRole === "candidate"
                          ? "border-emerald-400 bg-emerald-50 dark:bg-emerald-900/20"
                          : "border-slate-200 dark:border-slate-700 hover:border-slate-300"
                      }`}
                    >
                      <User className="w-6 h-6 mx-auto mb-2 text-emerald-600" />
                      <div className="text-sm font-semibold">Candidate</div>
                      <div className="text-xs text-slate-500">Practice interviews</div>
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedRole("recruiter")}
                      className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                        selectedRole === "recruiter"
                          ? "border-blue-400 bg-blue-50 dark:bg-blue-900/20"
                          : "border-slate-200 dark:border-slate-700 hover:border-slate-300"
                      }`}
                    >
                      <Users className="w-6 h-6 mx-auto mb-2 text-blue-600" />
                      <div className="text-sm font-semibold">Recruiter</div>
                      <div className="text-xs text-slate-500">Conduct interviews</div>
                    </motion.button>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Email */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <Input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        className="pl-10 h-12 rounded-xl border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm"
                        required
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <Input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        className="pl-10 pr-10 h-12 rounded-xl border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  {/* Login Button */}
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full h-12 text-lg font-semibold rounded-xl shadow-lg transition-all duration-300"
                      style={{
                        background: isLoading
                          ? "rgba(156, 163, 175, 0.5)"
                          : "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                        boxShadow: isLoading ? "none" : "0 10px 25px rgba(16, 185, 129, 0.3)",
                      }}
                    >
                      {isLoading ? (
                        <div className="flex items-center space-x-2">
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Signing In...</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <span>Sign In</span>
                          <ArrowRight className="w-5 h-5" />
                        </div>
                      )}
                    </Button>
                  </motion.div>
                </form>

                {/* Guest Access */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-200 dark:border-slate-700" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white dark:bg-slate-800 text-slate-500">or</span>
                  </div>
                </div>

                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleGuestAccess}
                    className="w-full h-12 text-lg font-semibold rounded-xl bg-transparent border-2 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all duration-300"
                  >
                    Continue as Guest
                  </Button>
                </motion.div>

                {/* Sign Up Link */}
                <div className="text-center">
                  <p className="text-slate-600 dark:text-slate-400">
                    Don't have an account?{" "}
                    <Link
                      href="/register"
                      className="font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
                    >
                      Sign up here
                    </Link>
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
