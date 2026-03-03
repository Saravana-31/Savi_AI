"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { motion, AnimatePresence } from "framer-motion"
import {
  Play, Brain, Camera, Mic, Eye, TrendingUp, Award, Clock, CheckCircle,
  Star, Sparkles, Zap, Target, Users, BarChart3,
} from "lucide-react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { AnimatedPage } from "@/components/animated-page"
import { AiAssistantSavi } from "@/components/ai-assistant-savi"
import { EnhancedBackground } from "@/components/enhanced-background"
import toast from "react-hot-toast"

export function WelcomePage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [showGreeting, setShowGreeting] = useState(false)
  const [currentFeature, setCurrentFeature] = useState(0)

  const features = [
    { icon: Brain, title: "AI-Powered Analysis", description: "Advanced emotion detection and behavioral analysis", color: "#00d4ff" },
    { icon: Camera, title: "Real-time Monitoring", description: "Live face detection and eye contact tracking", color: "#a855f7" },
    { icon: Mic, title: "Voice Recognition", description: "Natural speech-to-text for seamless interaction", color: "#00ff9d" },
    { icon: BarChart3, title: "Detailed Reports", description: "Comprehensive performance analytics and insights", color: "#f59e0b" },
  ]

  useEffect(() => {
    if (session?.user?.name && !showGreeting) {
      setShowGreeting(true)
      setTimeout(() => {
        toast.success(`Welcome back, ${session?.user?.name || "User"}! Ready to ace your interview? 🚀`, {
          duration: 5000,
          style: {
            background: "rgba(0, 212, 255, 0.1)",
            border: "1px solid rgba(0, 212, 255, 0.4)",
            color: "#cffafe",
            fontWeight: "bold",
          },
        })
      }, 1000)
    }

    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [session, showGreeting])

  const handleStartInterview = (type: "mock" | "formal") => {
    toast.success(`Starting ${type === "mock" ? "Mock" : "Formal"} Interview! 🎯`, {
      duration: 3000,
      style: { background: "rgba(0,212,255,0.1)", border: "1px solid rgba(0,212,255,0.4)", color: "#cffafe" },
    })
    setTimeout(() => { router.push(type === "mock" ? "/mock-interview" : "/interview") }, 1000)
  }

  const handleViewHistory = () => {
    toast("📊 Loading your interview history...", {
      duration: 2000,
      style: { background: "rgba(168,85,247,0.1)", border: "1px solid rgba(168,85,247,0.4)", color: "#e9d5ff" },
    })
    setTimeout(() => { router.push("/history") }, 500)
  }

  return (
    <AnimatedPage>
      <div className="min-h-screen relative">
        <EnhancedBackground />
        <Navbar />
        <AiAssistantSavi
          isVisible={true}
          emotion={showGreeting ? "greeting" : "happy"}
          onGreeting={() => console.log("Savi greeted user")}
        />

        <div className="pt-24 p-6 relative z-10">
          {/* Hero Section */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.2 }} className="mb-8">
              <motion.h1
                className="text-6xl md:text-7xl font-bold mb-6"
                style={{
                  background: "linear-gradient(135deg, #00d4ff 0%, #a855f7 50%, #00d4ff 100%)",
                  backgroundSize: "200% 200%",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
                animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
                transition={{ duration: 5, repeat: Infinity }}
              >
                Welcome to Savi AI ✨
              </motion.h1>

              <motion.p
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
                className="text-xl text-slate-400 mb-8 max-w-3xl mx-auto leading-relaxed"
              >
                Your AI-powered interview assistant — practice, improve, and succeed in your career journey
              </motion.p>

              {session?.user?.name && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.6 }}
                  className="mb-8"
                >
                  <Badge
                    variant="outline"
                    className="text-lg px-6 py-3 font-semibold text-cyan-300"
                    style={{
                      background: "rgba(0, 212, 255, 0.08)",
                      border: "1px solid rgba(0, 212, 255, 0.3)",
                      boxShadow: "0 0 20px rgba(0, 212, 255, 0.1)",
                    }}
                  >
                    👋 Hello, {session.user.name}!
                  </Badge>
                </motion.div>
              )}
            </motion.div>

            {/* Feature Showcase */}
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }} className="mb-12"
            >
              <div
                className="max-w-2xl mx-auto p-8 rounded-2xl"
                style={{
                  background: "rgba(5, 8, 22, 0.7)",
                  border: "1px solid rgba(0, 212, 255, 0.15)",
                  backdropFilter: "blur(20px)",
                  boxShadow: "0 0 40px rgba(0, 212, 255, 0.05)",
                }}
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentFeature}
                    initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.5 }} className="text-center"
                  >
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity }}
                      className="w-20 h-20 mx-auto mb-6 rounded-2xl flex items-center justify-center"
                      style={{
                        background: `linear-gradient(135deg, ${features[currentFeature].color}22 0%, ${features[currentFeature].color}44 100%)`,
                        border: `1px solid ${features[currentFeature].color}33`,
                        boxShadow: `0 0 30px ${features[currentFeature].color}30`,
                      }}
                    >
                      {(() => { const Icon = features[currentFeature].icon; return <Icon className="w-10 h-10" style={{ color: features[currentFeature].color }} /> })()}
                    </motion.div>
                    <h3 className="text-2xl font-bold text-white mb-3">{features[currentFeature].title}</h3>
                    <p className="text-slate-400">{features[currentFeature].description}</p>
                  </motion.div>
                </AnimatePresence>

                <div className="flex justify-center space-x-2 mt-8">
                  {features.map((_, index) => (
                    <motion.div
                      key={index}
                      animate={{ scale: index === currentFeature ? 1.3 : 1, opacity: index === currentFeature ? 1 : 0.3 }}
                      className="w-2 h-2 rounded-full"
                      style={{ background: index === currentFeature ? features[currentFeature].color : "#334155" }}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Action Cards */}
          <motion.div
            initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1 }}
            className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-16"
          >
            {[
              {
                type: "mock" as const,
                title: "Mock Interview",
                sub: "Practice with AI feedback",
                color: "#00d4ff",
                badge: "Recommended for beginners",
                Icon: Target,
                BtnIcon: Play,
                btn: "Start Mock Interview",
                items: ["8 practice questions", "Real-time emotion analysis", "Instant feedback from Savi", "Performance report"],
              },
              {
                type: "formal" as const,
                title: "Formal Interview",
                sub: "Comprehensive assessment",
                color: "#a855f7",
                badge: "Advanced evaluation",
                Icon: Award,
                BtnIcon: Zap,
                btn: "Start Formal Interview",
                items: ["10 comprehensive questions", "Advanced behavioral analysis", "Voice input support", "Detailed analytics report"],
              },
            ].map((card) => (
              <motion.div key={card.type} whileHover={{ scale: 1.02, y: -5 }} transition={{ duration: 0.3 }}>
                <div
                  className="p-8 h-full rounded-2xl cursor-pointer group transition-all duration-300"
                  style={{
                    background: "rgba(5, 8, 22, 0.7)",
                    border: `1px solid ${card.color}20`,
                    backdropFilter: "blur(20px)",
                  }}
                  onClick={() => handleStartInterview(card.type)}
                >
                  <div className="flex items-center space-x-4 mb-4">
                    <motion.div
                      whileHover={{ rotate: 360 }} transition={{ duration: 0.6 }}
                      className="w-14 h-14 rounded-xl flex items-center justify-center"
                      style={{
                        background: `${card.color}15`,
                        border: `1px solid ${card.color}30`,
                        boxShadow: `0 0 20px ${card.color}20`,
                      }}
                    >
                      <card.Icon className="w-7 h-7" style={{ color: card.color }} />
                    </motion.div>
                    <div>
                      <h3 className="text-xl font-bold text-white">{card.title}</h3>
                      <p className="text-slate-400 text-sm">{card.sub}</p>
                    </div>
                  </div>

                  <Badge
                    variant="outline" className="mb-6 text-xs font-medium"
                    style={{ background: `${card.color}10`, border: `1px solid ${card.color}30`, color: card.color }}
                  >
                    {card.badge}
                  </Badge>

                  <ul className="space-y-3 mb-8">
                    {card.items.map((item, i) => (
                      <li key={i} className="flex items-center space-x-3">
                        <CheckCircle className="w-4 h-4 flex-shrink-0" style={{ color: card.color }} />
                        <span className="text-slate-300 text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>

                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      size="lg"
                      className="w-full py-4 text-base font-semibold rounded-xl text-white"
                      style={{
                        background: `linear-gradient(135deg, ${card.color}cc 0%, ${card.color} 100%)`,
                        boxShadow: `0 0 25px ${card.color}30`,
                      }}
                    >
                      <card.BtnIcon className="w-5 h-5 mr-2" />{card.btn}
                    </Button>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2 }}
            className="max-w-4xl mx-auto"
          >
            <div
              className="p-8 rounded-2xl"
              style={{
                background: "rgba(5, 8, 22, 0.7)",
                border: "1px solid rgba(0, 212, 255, 0.1)",
                backdropFilter: "blur(20px)",
              }}
            >
              <h2 className="text-xl font-bold text-white text-center mb-6">Quick Actions</h2>
              <div className="grid md:grid-cols-3 gap-4">
                {[
                  { icon: Clock, label: "View History", action: handleViewHistory, color: "#a855f7" },
                  { icon: Users, label: "Resume Check", action: () => router.push("/eligibility"), color: "#00d4ff" },
                  { icon: TrendingUp, label: "View Reports", action: () => router.push("/report"), color: "#00ff9d" },
                ].map((item, i) => (
                  <motion.div key={i} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      variant="outline" size="lg" onClick={item.action}
                      className="w-full h-24 flex flex-col items-center justify-center space-y-2 rounded-xl border-0 transition-all duration-300"
                      style={{
                        background: `${item.color}08`,
                        border: `1px solid ${item.color}20`,
                      }}
                    >
                      <item.icon className="w-6 h-6" style={{ color: item.color }} />
                      <span className="font-semibold text-slate-300">{item.label}</span>
                    </Button>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.4 }}
            className="mt-16 text-center"
          >
            <h3 className="text-2xl font-bold text-white mb-8">Powered by Advanced AI Technology</h3>
            <div className="grid md:grid-cols-4 gap-4 max-w-4xl mx-auto">
              {[
                { icon: Brain, label: "AI Models", value: "5+", color: "#00d4ff" },
                { icon: Eye, label: "Emotion Detection", value: "99%", color: "#a855f7" },
                { icon: Star, label: "Accuracy Rate", value: "95%", color: "#00ff9d" },
                { icon: Sparkles, label: "Success Stories", value: "1000+", color: "#f59e0b" },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 1.6 + i * 0.1 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="p-6 rounded-2xl transition-all"
                  style={{
                    background: "rgba(5, 8, 22, 0.7)",
                    border: `1px solid ${stat.color}20`,
                    backdropFilter: "blur(20px)",
                  }}
                >
                  <stat.icon className="w-8 h-8 mx-auto mb-3" style={{ color: stat.color }} />
                  <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-xs text-slate-500">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </AnimatedPage>
  )
}
