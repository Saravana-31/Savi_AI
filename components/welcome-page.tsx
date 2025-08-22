"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { motion, AnimatePresence } from "framer-motion"
import {
  Play,
  Brain,
  Camera,
  Mic,
  Eye,
  TrendingUp,
  Award,
  Clock,
  CheckCircle,
  Star,
  Sparkles,
  Zap,
  Target,
  Users,
  BarChart3,
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
    {
      icon: Brain,
      title: "AI-Powered Analysis",
      description: "Advanced emotion detection and behavioral analysis",
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: Camera,
      title: "Real-time Monitoring",
      description: "Live face detection and eye contact tracking",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: Mic,
      title: "Voice Recognition",
      description: "Natural speech-to-text for seamless interaction",
      color: "from-green-500 to-emerald-500",
    },
    {
      icon: BarChart3,
      title: "Detailed Reports",
      description: "Comprehensive performance analytics and insights",
      color: "from-orange-500 to-red-500",
    },
  ]

  useEffect(() => {
    if (session?.user?.name && !showGreeting) {
      setShowGreeting(true)

      // Welcome toast with user's name
      setTimeout(() => {
        toast.success(`Welcome back, ${session?.user?.name || "User"}! Ready for your next interview? 🚀`, {
          duration: 5000,
          style: {
            background: "linear-gradient(135deg, #10b981 0%, #3b82f6 100%)",
            color: "white",
            fontWeight: "bold",
            fontSize: "16px",
          },
        })
      }, 1000)
    }

    // Cycle through features
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length)
    }, 3000)

    return () => clearInterval(interval)
  }, [session, showGreeting])

  const handleStartInterview = (type: "mock" | "formal") => {
    toast.success(`Starting ${type === "mock" ? "Mock" : "Formal"} Interview! 🎯`, {
      duration: 3000,
      style: {
        background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
        color: "white",
      },
    })

    setTimeout(() => {
      router.push(type === "mock" ? "/mock-interview" : "/interview")
    }, 1000)
  }

  const handleViewHistory = () => {
    toast("📊 Loading your interview history...", {
      duration: 2000,
      style: {
        background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
        color: "white",
      },
    })

    setTimeout(() => {
      router.push("/history")
    }, 500)
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
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mb-8"
            >
              <motion.h1
                className="text-6xl md:text-7xl font-bold mb-6"
                style={{
                  background: "linear-gradient(135deg, #10b981 0%, #3b82f6 50%, #a855f7 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Welcome to Savi AI ✨
              </motion.h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-2xl text-slate-600 dark:text-slate-300 mb-8 max-w-3xl mx-auto leading-relaxed"
              >
                Your AI-powered interview assistant that helps you practice, improve, and succeed in your career journey
              </motion.p>

              {session?.user?.name && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6 }}
                  className="mb-8"
                >
                  <Badge
                    variant="outline"
                    className="text-xl px-8 py-4 font-semibold"
                    style={{
                      background: "rgba(255, 255, 255, 0.1)",
                      backdropFilter: "blur(10px)",
                      border: "1px solid rgba(255, 255, 255, 0.2)",
                    }}
                  >
                    👋 Hello, {session.user.name}!
                  </Badge>
                </motion.div>
              )}
            </motion.div>

            {/* Feature Showcase */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="mb-12"
            >
              <Card
                className="max-w-2xl mx-auto p-8 shadow-2xl border-0"
                style={{
                  background: "rgba(255, 255, 255, 0.1)",
                  backdropFilter: "blur(20px)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                }}
              >
                <CardContent className="p-0">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentFeature}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.5 }}
                      className="text-center"
                    >
                      <motion.div
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                        className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center"
                        style={{
                          // Safely parse Tailwind color classes like "from-purple-500 to-pink-500"
                          ...(() => {
                            const colorString = features[currentFeature].color || "from-purple-500 to-pink-500";
                            const [from, , to] = colorString.split(" ");
                            // Provide fallback hex values if parsing fails
                            const fromColor = from ? from.replace("from-", "#") : "#a855f7";
                            const toColor = to ? to.replace("to-", "#") : "#ec4899";
                            // If the result is not a valid hex, fallback to default
                            const validHex = /^#[0-9a-fA-F]{3,6}$/;
                            return {
                              background: `linear-gradient(135deg, ${validHex.test(fromColor) ? fromColor : "#a855f7"} 0%, ${validHex.test(toColor) ? toColor : "#ec4899"} 100%)`,
                              boxShadow: "0 20px 40px rgba(0, 0, 0, 0.2)",
                            };
                          })(),
                        }}
                      >
                        \
                        {(() => {
                          const Icon = features[currentFeature].icon;
                          return Icon ? <Icon className="w-10 h-10 text-foreground" /> : null;
                        })()}
                      </motion.div>
                      <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-3">
                        {features[currentFeature].title}
                      </h3>
                      <p className="text-lg text-slate-600 dark:text-slate-400">
                        {features[currentFeature].description}
                      </p>
                    </motion.div>
                  </AnimatePresence>

                  {/* Feature indicators */}
                  <div className="flex justify-center space-x-2 mt-8">
                    {features.map((_, index) => (
                      <motion.div
                        key={index}
                        animate={{
                          scale: index === currentFeature ? 1.2 : 1,
                          opacity: index === currentFeature ? 1 : 0.5,
                        }}
                        className="w-3 h-3 rounded-full"
                        style={{
                          background:
                            index === currentFeature ? "linear-gradient(135deg, #10b981 0%, #3b82f6 100%)" : "#94a3b8",
                        }}
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>

          {/* Action Cards */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto mb-16"
          >
            {/* Mock Interview Card */}
            <motion.div whileHover={{ scale: 1.02, y: -5 }} transition={{ duration: 0.3 }}>
              <Card
                className="p-8 h-full shadow-2xl border-0 cursor-pointer group"
                style={{
                  background: "rgba(255, 255, 255, 0.1)",
                  backdropFilter: "blur(20px)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                }}
                onClick={() => handleStartInterview("mock")}
              >
                <CardHeader className="p-0 mb-6">
                  <div className="flex items-center space-x-4 mb-4">
                    <motion.div
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                      className="w-16 h-16 rounded-full flex items-center justify-center"
                      style={{
                        background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                        boxShadow: "0 10px 25px rgba(16, 185, 129, 0.3)",
                      }}
                    >
                      <Target className="w-8 h-8 text-foreground" />
                    </motion.div>
                    <div>
                      <CardTitle className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                        Mock Interview
                      </CardTitle>
                      <p className="text-slate-600 dark:text-slate-400">Practice with AI feedback</p>
                    </div>
                  </div>
                  <Badge
                    variant="outline"
                    className="w-fit"
                    style={{
                      background: "rgba(16, 185, 129, 0.1)",
                      border: "1px solid rgba(16, 185, 129, 0.3)",
                      color: "#059669",
                    }}
                  >
                    Recommended for beginners
                  </Badge>
                </CardHeader>
                <CardContent className="p-0">
                  <ul className="space-y-3 mb-8">
                    <li className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-emerald-500" />
                      <span className="text-slate-700 dark:text-slate-300">8 practice questions</span>
                    </li>
                    <li className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-emerald-500" />
                      <span className="text-slate-700 dark:text-slate-300">Real-time emotion analysis</span>
                    </li>
                    <li className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-emerald-500" />
                      <span className="text-slate-700 dark:text-slate-300">Instant feedback from Savi</span>
                    </li>
                    <li className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-emerald-500" />
                      <span className="text-slate-700 dark:text-slate-300">Performance report</span>
                    </li>
                  </ul>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      size="lg"
                      className="w-full py-4 text-lg font-semibold rounded-2xl shadow-lg transition-all duration-300"
                      style={{
                        background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                        boxShadow: "0 10px 25px rgba(16, 185, 129, 0.3)",
                      }}
                    >
                      <Play className="w-5 h-5 mr-2" />
                      Start Mock Interview
                    </Button>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Formal Interview Card */}
            <motion.div whileHover={{ scale: 1.02, y: -5 }} transition={{ duration: 0.3 }}>
              <Card
                className="p-8 h-full shadow-2xl border-0 cursor-pointer group"
                style={{
                  background: "rgba(255, 255, 255, 0.1)",
                  backdropFilter: "blur(20px)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                }}
                onClick={() => handleStartInterview("formal")}
              >
                <CardHeader className="p-0 mb-6">
                  <div className="flex items-center space-x-4 mb-4">
                    <motion.div
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                      className="w-16 h-16 rounded-full flex items-center justify-center"
                      style={{
                        background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
                        boxShadow: "0 10px 25px rgba(59, 130, 246, 0.3)",
                      }}
                    >
                      <Award className="w-8 h-8 text-foreground" />
                    </motion.div>
                    <div>
                      <CardTitle className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                        Formal Interview
                      </CardTitle>
                      <p className="text-slate-600 dark:text-slate-400">Comprehensive assessment</p>
                    </div>
                  </div>
                  <Badge
                    variant="outline"
                    className="w-fit"
                    style={{
                      background: "rgba(59, 130, 246, 0.1)",
                      border: "1px solid rgba(59, 130, 246, 0.3)",
                      color: "#1d4ed8",
                    }}
                  >
                    Advanced evaluation
                  </Badge>
                </CardHeader>
                <CardContent className="p-0">
                  <ul className="space-y-3 mb-8">
                    <li className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-blue-500" />
                      <span className="text-slate-700 dark:text-slate-300">10 comprehensive questions</span>
                    </li>
                    <li className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-blue-500" />
                      <span className="text-slate-700 dark:text-slate-300">Advanced behavioral analysis</span>
                    </li>
                    <li className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-blue-500" />
                      <span className="text-slate-700 dark:text-slate-300">Voice input support</span>
                    </li>
                    <li className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-blue-500" />
                      <span className="text-slate-700 dark:text-slate-300">Detailed analytics report</span>
                    </li>
                  </ul>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      size="lg"
                      className="w-full py-4 text-lg font-semibold rounded-2xl shadow-lg transition-all duration-300"
                      style={{
                        background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
                        boxShadow: "0 10px 25px rgba(59, 130, 246, 0.3)",
                      }}
                    >
                      <Zap className="w-5 h-5 mr-2" />
                      Start Formal Interview
                    </Button>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            className="max-w-4xl mx-auto"
          >
            <Card
              className="p-8 shadow-2xl border-0"
              style={{
                background: "rgba(255, 255, 255, 0.1)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
              }}
            >
              <CardHeader className="p-0 mb-6">
                <CardTitle className="text-2xl font-bold text-slate-900 dark:text-slate-100 text-center">
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="grid md:grid-cols-3 gap-6">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={handleViewHistory}
                      className="w-full h-24 flex flex-col items-center justify-center space-y-2 rounded-2xl transition-all duration-300 bg-transparent"
                      style={{
                        background: "rgba(255, 255, 255, 0.05)",
                        border: "1px solid rgba(255, 255, 255, 0.2)",
                        backdropFilter: "blur(10px)",
                      }}
                    >
                      <Clock className="w-6 h-6" />
                      <span className="font-semibold">View History</span>
                    </Button>
                  </motion.div>

                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={() => router.push("/eligibility")}
                      className="w-full h-24 flex flex-col items-center justify-center space-y-2 rounded-2xl transition-all duration-300"
                      style={{
                        background: "rgba(255, 255, 255, 0.05)",
                        border: "1px solid rgba(255, 255, 255, 0.2)",
                        backdropFilter: "blur(10px)",
                      }}
                    >
                      <Users className="w-6 h-6" />
                      <span className="font-semibold">Resume Check</span>
                    </Button>
                  </motion.div>

                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={() => router.push("/report")}
                      className="w-full h-24 flex flex-col items-center justify-center space-y-2 rounded-2xl transition-all duration-300"
                      style={{
                        background: "rgba(255, 255, 255, 0.05)",
                        border: "1px solid rgba(255, 255, 255, 0.2)",
                        backdropFilter: "blur(10px)",
                      }}
                    >
                      <TrendingUp className="w-6 h-6" />
                      <span className="font-semibold">View Reports</span>
                    </Button>
                  </motion.div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Stats Section */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4 }}
            className="mt-16 text-center"
          >
            <h3 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-8">
              Powered by Advanced AI Technology
            </h3>
            <div className="grid md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              {[
                { icon: Brain, label: "AI Models", value: "5+" },
                { icon: Eye, label: "Emotion Detection", value: "99%" },
                { icon: Star, label: "Accuracy Rate", value: "95%" },
                { icon: Sparkles, label: "Success Stories", value: "1000+" },
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.6 + index * 0.1 }}
                  className="p-6 rounded-2xl"
                  style={{
                    background: "rgba(255, 255, 255, 0.1)",
                    backdropFilter: "blur(20px)",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                  }}
                >
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, delay: index * 0.5 }}
                  >
                    {stat.icon && <stat.icon className="w-8 h-8 mx-auto mb-3 text-emerald-500" />}
                  </motion.div>
                  <div className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-1">{stat.value}</div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </AnimatedPage>
  )
}
