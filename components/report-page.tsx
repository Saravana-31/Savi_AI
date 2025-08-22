"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
import { Download, ArrowLeft, Clock, Target, Brain, AlertTriangle, Volume2, VolumeX, Eye, Bot } from "lucide-react"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { AnimatedPage } from "@/components/animated-page"
import toast from "react-hot-toast"
import jsPDF from "jspdf"
import html2canvas from "html2canvas"

export function ReportPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  const interviewId = searchParams.get("id")

  const [reportData, setReportData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!session) {
      router.push("/login")
      return
    }

    fetchReportData()
  }, [session, interviewId])

  const fetchReportData = async () => {
    try {
      const response = await fetch(`/api/interview?id=${interviewId}`)
      if (response.ok) {
        const data = await response.json()
        setReportData(data)
      } else {
        // Enhanced mock data for demo
        setReportData({
          type: "mock",
          questions: [
            "Tell me about yourself and your background.",
            "What are your greatest strengths and weaknesses?",
            "Why do you want to work for our company?",
            "Describe a challenging project you've worked on.",
            "Where do you see yourself in 5 years?",
            "How do you handle stress and pressure?",
            "What motivates you in your work?",
            "Tell me about a time you failed and how you handled it.",
          ],
          answers: [
            "I'm a software developer with 3 years of experience in full-stack development...",
            "My strength is problem-solving and attention to detail, my weakness is public speaking...",
            "I'm passionate about your company's mission to innovate in the tech space...",
            "I worked on a complex e-commerce platform that required real-time data processing...",
            "I see myself as a senior developer leading a team and mentoring junior developers...",
            "I handle stress by breaking down problems into smaller tasks and prioritizing...",
            "I'm motivated by solving challenging problems and creating impactful solutions...",
            "I once failed to meet a project deadline, but I learned to communicate earlier...",
          ],
          emotions: ["Confident", "Nervous", "Focused", "Confident", "Focused", "Nervous", "Confident", "Focused"],
          eyeContactScores: [85, 72, 88, 90, 78, 65, 92, 80],
          timeTaken: [45000, 60000, 30000, 90000, 55000, 40000, 35000, 70000],
          tabSwitches: 2,
          speechUsed: true,
          metrics: {
            averageResponseTime: 53125,
            averageEyeContact: 81.25,
            totalDuration: 425000,
            completionRate: 100,
          },
          createdAt: new Date().toISOString(),
        })
      }
    } catch (error) {
      console.error("Error fetching report:", error)
      toast.error("Error loading report data")
    } finally {
      setLoading(false)
    }
  }

  const downloadPDF = async () => {
    try {
      toast.loading("Generating professional PDF report...")

      const element = document.getElementById("report-content")
      if (!element) return

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
        width: element.scrollWidth,
        height: element.scrollHeight,
      })

      const imgData = canvas.toDataURL("image/png")
      const pdf = new jsPDF("p", "mm", "a4")

      // Add watermark
      pdf.setGState(new pdf.GState({ opacity: 0.1 }))
      pdf.setFontSize(50)
      pdf.setTextColor(200, 200, 200)
      pdf.text("SaviAI | Confidential", 105, 150, {
        angle: 45,
        align: "center",
      })
      pdf.setGState(new pdf.GState({ opacity: 1 }))

      // Add header with branding
      pdf.setFontSize(24)
      pdf.setTextColor(15, 23, 42) // Navy
      pdf.text("SaviAI Interview Report", 20, 25)

      pdf.setFontSize(12)
      pdf.setTextColor(100, 116, 139) // Gray
      pdf.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 35)
      pdf.text(`Candidate: ${session?.user?.name || "Anonymous"}`, 20, 42)
      pdf.text(`Overall Score: ${overallScore}%`, 20, 49)

      // Add the main content
      const imgWidth = 170
      const imgHeight = (canvas.height * imgWidth) / canvas.width

      pdf.addImage(imgData, "PNG", 20, 60, imgWidth, imgHeight)

      // Add footer to all pages
      const pageCount = pdf.getNumberOfPages()
      for (let i = 1; i <= pageCount; i++) {
        pdf.setPage(i)
        pdf.setFontSize(10)
        pdf.setTextColor(100, 116, 139)
        pdf.text(`Page ${i} of ${pageCount} | SaviAI © 2024 | Confidential`, 20, 285)
      }

      pdf.save(
        `SaviAI_Interview_Report_${session?.user?.name?.replace(/\s+/g, "_")}_${new Date().toISOString().split("T")[0]}.pdf`,
      )
      toast.success("📄 Professional report downloaded successfully!")
    } catch (error) {
      console.error("Error generating PDF:", error)
      toast.error("❌ Error generating PDF report")
    }
  }

  if (loading) {
    return (
      <AnimatedPage>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-100 dark:from-slate-900 dark:via-indigo-900 dark:to-purple-900 flex items-center justify-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full"
          />
        </div>
      </AnimatedPage>
    )
  }

  if (!reportData) {
    return (
      <AnimatedPage>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-100 dark:from-slate-900 dark:via-indigo-900 dark:to-purple-900 flex items-center justify-center">
          <Card className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-lg p-8 text-center">
            <AlertTriangle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-4">Report Not Found</h2>
            <p className="text-slate-600 dark:text-slate-400 mb-6">The interview report could not be loaded.</p>
            <Link href="/welcome">
              <Button>Go Home</Button>
            </Link>
          </Card>
        </div>
      </AnimatedPage>
    )
  }

  const overallScore = Math.round(
    (reportData.emotions.filter((e: string) => e === "Confident").length / reportData.emotions.length) * 100,
  )

  const emotionCounts = {
    confident: reportData.emotions.filter((e: string) => e === "Confident").length,
    nervous: reportData.emotions.filter((e: string) => e === "Nervous").length,
    focused: reportData.emotions.filter((e: string) => e === "Focused").length,
  }

  const getEmotionEmoji = (emotion: string) => {
    const emojiMap: { [key: string]: string } = {
      Confident: "😊",
      Nervous: "😰",
      Focused: "🤔",
      Anxious: "😟",
      Comfortable: "😌",
    }
    return emojiMap[emotion] || "😐"
  }

  return (
    <AnimatedPage>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-100 dark:from-slate-900 dark:via-indigo-900 dark:to-purple-900">
        <Navbar />

        <div className="pt-24 p-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between mb-8"
          >
            <div className="flex items-center space-x-4">
              <Link href="/welcome">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button variant="outline" className="bg-white/80 dark:bg-slate-800/80">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Home
                  </Button>
                </motion.div>
              </Link>
              <Link href="/mock-interview">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button variant="outline" className="glass-button bg-transparent">
                    <Bot className="w-4 h-4 mr-2" />
                    Restart Interview
                  </Button>
                </motion.div>
              </Link>
              <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100">Mock Interview Report 📊</h1>
            </div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={downloadPDF}
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-foreground shadow-lg"
              >
                <Download className="w-4 h-4 mr-2" />
                Download PDF
              </Button>
            </motion.div>
          </motion.div>

          <div id="report-content" className="max-w-7xl mx-auto space-y-8">
            {/* Overview Cards */}
            <div className="grid md:grid-cols-5 gap-6">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                <Card className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-lg border border-white/20 shadow-xl">
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Target className="w-8 h-8 text-foreground" />
                    </div>
                    <div className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">{overallScore}%</div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">Overall Score</div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <Card className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-lg border border-white/20 shadow-xl">
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Clock className="w-8 h-8 text-foreground" />
                    </div>
                    <div className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                      {Math.round(reportData.metrics.averageResponseTime / 1000)}s
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">Avg Response Time</div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                <Card className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-lg border border-white/20 shadow-xl">
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Eye className="w-8 h-8 text-foreground" />
                    </div>
                    <div className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                      {Math.round(reportData.metrics.averageEyeContact)}%
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">Avg Eye Contact</div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                <Card className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-lg border border-white/20 shadow-xl">
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <AlertTriangle className="w-8 h-8 text-foreground" />
                    </div>
                    <div className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                      {reportData.tabSwitches}
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">Tab Switches</div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
                <Card className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-lg border border-white/20 shadow-xl">
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      {reportData.speechUsed ? (
                        <Volume2 className="w-8 h-8 text-foreground" />
                      ) : (
                        <VolumeX className="w-8 h-8 text-foreground" />
                      )}
                    </div>
                    <div className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                      {reportData.speechUsed ? "Yes" : "No"}
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">Speech Used</div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Emotion Timeline */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
              <Card className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-lg border border-white/20 shadow-xl">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center">
                    <Brain className="w-6 h-6 mr-2 text-purple-600" />
                    Emotion Timeline
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm text-slate-600 dark:text-slate-400 mb-4">
                      <span>Question Progress</span>
                      <span>Emotion During Answer</span>
                    </div>

                    <div className="grid gap-3">
                      {reportData.emotions.map((emotion: string, index: number) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.7 + index * 0.1 }}
                          className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg"
                        >
                          <div className="flex items-center space-x-4">
                            <div className="w-8 h-8 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center text-sm font-bold text-indigo-600 dark:text-indigo-400">
                              {index + 1}
                            </div>
                            <div className="text-sm text-slate-600 dark:text-slate-400">Question {index + 1}</div>
                          </div>

                          <div className="flex items-center space-x-4">
                            <div className="text-2xl">{getEmotionEmoji(emotion)}</div>
                            <Badge
                              variant={
                                emotion === "Confident"
                                  ? "default"
                                  : emotion === "Focused"
                                    ? "secondary"
                                    : "destructive"
                              }
                              className="text-sm"
                            >
                              {emotion}
                            </Badge>
                            <div className="text-sm text-slate-500">
                              {Math.round(reportData.timeTaken[index] / 1000)}s
                            </div>
                            <div className="text-sm text-slate-500">👁️ {reportData.eyeContactScores[index]}%</div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Performance Breakdown */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}>
              <Card className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-lg border border-white/20 shadow-xl">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                    Performance Breakdown
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid md:grid-cols-3 gap-8">
                    <div className="text-center">
                      <div className="relative w-32 h-32 mx-auto mb-4">
                        <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 36 36">
                          <path
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            className="text-slate-200 dark:text-slate-700"
                          />
                          <motion.path
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeDasharray={`${(emotionCounts.confident / reportData.emotions.length) * 100}, 100`}
                            className="text-green-500"
                            initial={{ strokeDasharray: "0, 100" }}
                            animate={{
                              strokeDasharray: `${(emotionCounts.confident / reportData.emotions.length) * 100}, 100`,
                            }}
                            transition={{ duration: 2, delay: 0.8 }}
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-4xl">😊</span>
                        </div>
                      </div>
                      <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">Confident</h3>
                      <p className="text-2xl font-bold text-green-600">{emotionCounts.confident}</p>
                    </div>

                    <div className="text-center">
                      <div className="relative w-32 h-32 mx-auto mb-4">
                        <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 36 36">
                          <path
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            className="text-slate-200 dark:text-slate-700"
                          />
                          <motion.path
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeDasharray={`${(emotionCounts.focused / reportData.emotions.length) * 100}, 100`}
                            className="text-blue-500"
                            initial={{ strokeDasharray: "0, 100" }}
                            animate={{
                              strokeDasharray: `${(emotionCounts.focused / reportData.emotions.length) * 100}, 100`,
                            }}
                            transition={{ duration: 2, delay: 1.0 }}
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-4xl">🤔</span>
                        </div>
                      </div>
                      <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">Focused</h3>
                      <p className="text-2xl font-bold text-blue-600">{emotionCounts.focused}</p>
                    </div>

                    <div className="text-center">
                      <div className="relative w-32 h-32 mx-auto mb-4">
                        <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 36 36">
                          <path
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            className="text-slate-200 dark:text-slate-700"
                          />
                          <motion.path
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeDasharray={`${(emotionCounts.nervous / reportData.emotions.length) * 100}, 100`}
                            className="text-orange-500"
                            initial={{ strokeDasharray: "0, 100" }}
                            animate={{
                              strokeDasharray: `${(emotionCounts.nervous / reportData.emotions.length) * 100}, 100`,
                            }}
                            transition={{ duration: 2, delay: 1.2 }}
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-4xl">😰</span>
                        </div>
                      </div>
                      <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">Nervous</h3>
                      <p className="text-2xl font-bold text-orange-600">{emotionCounts.nervous}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Question Details */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.0 }}>
              <Card className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-lg border border-white/20 shadow-xl">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                    Question-by-Question Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-6">
                    {reportData.questions.map((question: string, index: number) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 1.1 + index * 0.1 }}
                        className="border-l-4 border-indigo-500 pl-6 py-4 bg-slate-50 dark:bg-slate-800/50 rounded-r-lg"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-semibold text-slate-800 dark:text-slate-200">Question {index + 1}</h4>
                          <div className="flex items-center space-x-3">
                            <Badge variant="outline" className="text-xs">
                              {Math.round(reportData.timeTaken[index] / 1000)}s
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              👁️ {reportData.eyeContactScores[index]}%
                            </Badge>
                            <Badge
                              variant={
                                reportData.emotions[index] === "Confident"
                                  ? "default"
                                  : reportData.emotions[index] === "Focused"
                                    ? "secondary"
                                    : "destructive"
                              }
                              className="text-xs"
                            >
                              {getEmotionEmoji(reportData.emotions[index])} {reportData.emotions[index]}
                            </Badge>
                          </div>
                        </div>
                        <p className="text-slate-600 dark:text-slate-400 mb-3 font-medium">{question}</p>
                        <div className="bg-white dark:bg-slate-700 p-4 rounded-lg border border-slate-200 dark:border-slate-600">
                          <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                            {reportData.answers[index]}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* AI Summary */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.5 }}>
              <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border border-indigo-200 dark:border-indigo-700 shadow-xl">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center">
                    <Brain className="w-6 h-6 mr-2 text-indigo-600" />
                    AI Analysis & Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-6">
                    <div className="bg-white dark:bg-slate-800 p-6 rounded-lg border border-indigo-200 dark:border-indigo-700">
                      <h4 className="font-semibold text-slate-800 dark:text-slate-200 mb-3 flex items-center">
                        🎯 Overall Performance
                      </h4>
                      <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                        Excellent work! You demonstrated confidence in {emotionCounts.confident} out of{" "}
                        {reportData.emotions.length} responses (
                        {Math.round((emotionCounts.confident / reportData.emotions.length) * 100)}%). Your average
                        response time of {Math.round(reportData.metrics.averageResponseTime / 1000)} seconds shows good
                        preparation, and your {Math.round(reportData.metrics.averageEyeContact)}% average eye contact
                        indicates strong engagement.
                        {reportData.speechUsed &&
                          " Using the speech feature shows you're comfortable with audio feedback."}
                      </p>
                    </div>

                    <div className="bg-white dark:bg-slate-800 p-6 rounded-lg border border-indigo-200 dark:border-indigo-700">
                      <h4 className="font-semibold text-slate-800 dark:text-slate-200 mb-3 flex items-center">
                        💡 Areas for Improvement
                      </h4>
                      <ul className="text-slate-600 dark:text-slate-400 space-y-2 leading-relaxed">
                        {reportData.tabSwitches > 0 && (
                          <li className="flex items-start space-x-2">
                            <span className="text-orange-500 mt-1">•</span>
                            <span>
                              Minimize distractions - you switched tabs {reportData.tabSwitches} times during the
                              interview
                            </span>
                          </li>
                        )}
                        {emotionCounts.nervous > 0 && (
                          <li className="flex items-start space-x-2">
                            <span className="text-orange-500 mt-1">•</span>
                            <span>
                              Practice relaxation techniques to reduce nervousness in {emotionCounts.nervous} responses
                            </span>
                          </li>
                        )}
                        {reportData.metrics.averageEyeContact < 80 && (
                          <li className="flex items-start space-x-2">
                            <span className="text-orange-500 mt-1">•</span>
                            <span>
                              Work on maintaining consistent eye contact with the camera throughout your responses
                            </span>
                          </li>
                        )}
                        <li className="flex items-start space-x-2">
                          <span className="text-orange-500 mt-1">•</span>
                          <span>
                            Consider practicing the STAR method (Situation, Task, Action, Result) for behavioral
                            questions
                          </span>
                        </li>
                      </ul>
                    </div>

                    <div className="bg-white dark:bg-slate-800 p-6 rounded-lg border border-indigo-200 dark:border-indigo-700">
                      <h4 className="font-semibold text-slate-800 dark:text-slate-200 mb-3 flex items-center">
                        🚀 Next Steps
                      </h4>
                      <ul className="text-slate-600 dark:text-slate-400 space-y-2 leading-relaxed">
                        <li className="flex items-start space-x-2">
                          <span className="text-green-500 mt-1">•</span>
                          <span>Take another mock interview to track your improvement over time</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <span className="text-green-500 mt-1">•</span>
                          <span>Practice storytelling techniques to make your answers more engaging</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <span className="text-green-500 mt-1">•</span>
                          <span>Record yourself answering questions to improve body language and delivery</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <span className="text-green-500 mt-1">•</span>
                          <span>Research common questions for your specific industry and role</span>
                        </li>
                      </ul>
                    </div>

                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-6 rounded-lg border border-green-200 dark:border-green-700">
                      <h4 className="font-semibold text-green-800 dark:text-green-200 mb-3 flex items-center">
                        ⭐ Strengths to Leverage
                      </h4>
                      <ul className="text-green-700 dark:text-green-300 space-y-2 leading-relaxed">
                        <li className="flex items-start space-x-2">
                          <span className="text-green-500 mt-1">•</span>
                          <span>Strong confidence levels in most responses</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <span className="text-green-500 mt-1">•</span>
                          <span>Good time management with consistent response times</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <span className="text-green-500 mt-1">•</span>
                          <span>Maintained focus throughout the entire interview</span>
                        </li>
                        {reportData.speechUsed && (
                          <li className="flex items-start space-x-2">
                            <span className="text-green-500 mt-1">•</span>
                            <span>Comfortable with technology and audio feedback</span>
                          </li>
                        )}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </AnimatedPage>
  )
}
