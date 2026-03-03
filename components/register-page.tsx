"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Input } from "@/components/ui/input"
import { Eye, EyeOff, Mail, Lock, User, Users, Sparkles, ArrowRight, Zap, CheckCircle } from "lucide-react"
import { EnhancedBackground } from "@/components/enhanced-background"
import Link from "next/link"
import toast from "react-hot-toast"

export function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedRole, setSelectedRole] = useState<"candidate" | "recruiter">("candidate")
  const router = useRouter()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match!", {
        style: { background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.4)", color: "#fecaca" },
      })
      setIsLoading(false)
      return
    }

    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters!", {
        style: { background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.4)", color: "#fecaca" },
      })
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: selectedRole,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        toast.success(`Welcome to Savi AI, ${formData.name}! 🎉`, {
          duration: 5000,
          style: {
            background: "rgba(0, 212, 255, 0.1)",
            border: "1px solid rgba(0, 212, 255, 0.4)",
            color: "#cffafe",
            fontWeight: "bold",
          },
        })
        setTimeout(() => { router.push("/welcome") }, 1500)
      } else {
        toast.error(data.message || "Registration failed. Please try again.", {
          style: { background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.4)", color: "#fecaca" },
        })
      }
    } catch (error) {
      console.error("Registration error:", error)
      toast.error("Registration failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleGuestAccess = () => {
    toast.success("Continuing as guest! 👋", {
      style: { background: "rgba(168,85,247,0.1)", border: "1px solid rgba(168,85,247,0.4)", color: "#e9d5ff" },
    })
    setTimeout(() => { router.push("/welcome") }, 1000)
  }

  const benefits = [
    "🚀 Get started in under 2 minutes",
    "🎯 Unlimited mock interview practice",
    "📊 Track your improvement over time",
    "🤖 Personalized AI feedback from Savi",
  ]

  return (
    <div className="min-h-screen relative overflow-hidden">
      <EnhancedBackground />

      <div className="relative z-10 min-h-screen flex items-center justify-center p-6 py-12">
        <div className="w-full max-w-5xl grid lg:grid-cols-2 gap-12 items-center">

          {/* Left Side — Branding */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-left"
          >
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
              <span style={{ color: "#f1f5f9" }}>Join the</span>
              <br />
              <span
                style={{
                  background: "linear-gradient(135deg, #00d4ff 0%, #a855f7 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Future of Hiring
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-slate-400 text-lg mb-10 leading-relaxed"
            >
              Start your journey to interview success with AI-powered practice and real-time feedback.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="space-y-3"
            >
              {benefits.map((b, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + i * 0.1 }}
                  className="flex items-center space-x-3"
                >
                  <CheckCircle className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                  <span className="text-slate-300 text-sm">{b}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Side — Register Form */}
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
                boxShadow: "0 25px 60px rgba(0, 0, 0, 0.5), 0 0 40px rgba(168, 85, 247, 0.05)",
              }}
            >
              <div
                className="absolute top-0 left-0 right-0 h-px"
                style={{ background: "linear-gradient(90deg, transparent, #a855f7, #00d4ff, transparent)" }}
              />

              <div className="mb-6">
                <h2 className="text-2xl font-bold text-white mb-1">Create Your Account</h2>
                <p className="text-slate-400 text-sm">Join thousands improving their interview skills</p>
              </div>

              {/* Role Selection */}
              <div className="mb-5">
                <label className="text-sm font-medium text-slate-300 block mb-2">Select Your Role</label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { key: "candidate", label: "Candidate", sub: "Practice interviews", Icon: User, color: "#00d4ff" },
                    { key: "recruiter", label: "Recruiter", sub: "Conduct interviews", Icon: Users, color: "#a855f7" },
                  ].map(({ key, label, sub, Icon, color }) => (
                    <motion.button
                      key={key}
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedRole(key as "candidate" | "recruiter")}
                      className="p-4 rounded-xl text-center transition-all"
                      style={{
                        background: selectedRole === key ? `${color}12` : "rgba(255,255,255,0.02)",
                        border: `1px solid ${selectedRole === key ? `${color}50` : "rgba(255,255,255,0.06)"}`,
                        boxShadow: selectedRole === key ? `0 0 15px ${color}20` : "none",
                      }}
                    >
                      <Icon className="w-5 h-5 mx-auto mb-1" style={{ color: selectedRole === key ? color : "#64748b" }} />
                      <div className="text-sm font-semibold" style={{ color: selectedRole === key ? color : "#94a3b8" }}>{label}</div>
                      <div className="text-xs text-slate-500">{sub}</div>
                    </motion.button>
                  ))}
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name */}
                <div>
                  <label className="text-sm font-medium text-slate-300 block mb-1">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <Input
                      type="text" name="name" value={formData.name} onChange={handleInputChange}
                      placeholder="Enter your full name" required
                      className="pl-10 h-11 rounded-xl text-white placeholder:text-slate-600"
                      style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(0, 212, 255, 0.12)" }}
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="text-sm font-medium text-slate-300 block mb-1">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <Input
                      type="email" name="email" value={formData.email} onChange={handleInputChange}
                      placeholder="Enter your email" required
                      className="pl-10 h-11 rounded-xl text-white placeholder:text-slate-600"
                      style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(0, 212, 255, 0.12)" }}
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="text-sm font-medium text-slate-300 block mb-1">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <Input
                      type={showPassword ? "text" : "password"} name="password"
                      value={formData.password} onChange={handleInputChange}
                      placeholder="Create a password (min 6 chars)" required
                      className="pl-10 pr-10 h-11 rounded-xl text-white placeholder:text-slate-600"
                      style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(0, 212, 255, 0.12)" }}
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-cyan-400 transition-colors">
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="text-sm font-medium text-slate-300 block mb-1">Confirm Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <Input
                      type={showConfirmPassword ? "text" : "password"} name="confirmPassword"
                      value={formData.confirmPassword} onChange={handleInputChange}
                      placeholder="Confirm your password" required
                      className="pl-10 pr-10 h-11 rounded-xl text-white placeholder:text-slate-600"
                      style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(0, 212, 255, 0.12)" }}
                    />
                    <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-cyan-400 transition-colors">
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Create Account Button */}
                <motion.button
                  type="submit" disabled={isLoading}
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  className="w-full h-12 rounded-xl font-semibold text-white flex items-center justify-center space-x-2 transition-all mt-2"
                  style={{
                    background: isLoading ? "rgba(100,116,139,0.3)"
                      : "linear-gradient(135deg, #00d4ff 0%, #a855f7 100%)",
                    boxShadow: isLoading ? "none" : "0 0 25px rgba(0, 212, 255, 0.3)",
                  }}
                >
                  {isLoading ? (
                    <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /><span>Creating Account...</span></>
                  ) : (
                    <><span>Create Account</span><ArrowRight className="w-5 h-5" /></>
                  )}
                </motion.button>
              </form>

              {/* Divider */}
              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }} />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="px-3 text-slate-500" style={{ background: "rgba(5,8,22,0.9)" }}>or</span>
                </div>
              </div>

              <motion.button
                type="button" onClick={handleGuestAccess}
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                className="w-full h-11 rounded-xl font-medium text-slate-300 hover:text-white transition-all flex items-center justify-center space-x-2"
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
              >
                <Sparkles className="w-4 h-4" />
                <span>Continue as Guest</span>
              </motion.button>

              <p className="text-center text-slate-500 text-sm mt-4">
                Already have an account?{" "}
                <Link href="/login" className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors">
                  Sign in here
                </Link>
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
