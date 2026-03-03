"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { motion, AnimatePresence } from "framer-motion"
import {
  Send, Volume2, VolumeX, Eye, Clock, CheckCircle, Brain,
  Loader2, HelpCircle, Lightbulb, AlertCircle, TrendingUp, Target,
} from "lucide-react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { AnimatedPage } from "@/components/animated-page"
import { LiveFacePreview } from "@/components/live-face-preview"
import { AiAssistantSavi } from "@/components/ai-assistant-savi"
import { EnhancedBackground } from "@/components/enhanced-background"
import { MicButton } from "@/components/mic-button"
import { InterviewConfigModal } from "@/components/interview-config-modal"
import type { InterviewConfig } from "@/types/interview"
import { speechService } from "@/lib/speech-synthesis"
import { tabDetectionService, type TabSwitchEvent } from "@/lib/tab-detection"
import type { EmotionData } from "@/lib/face-detection"
import toast from "react-hot-toast"
import { QuestionSelector, type Question } from "@/lib/question-pool"

interface QuestionData {
  question: string
  answer: string
  emotionDuringAnswer: string
  eyeContactScore: number
  timeTaken: number
  tabSwitches: number
  startTime: number
  emotionTimeline: EmotionData[]
  evaluation?: EvaluationResult
}

interface EvaluationResult {
  score: number
  strengths: string[]
  improvements: string[]
  overall_feedback: string
  source?: "gemini" | "heuristic"
  quota_exceeded?: boolean
}

// ── Emotion Feedback Helper ──────────────────────────────────────────────────

function getEmotionFeedback(emotion: string): { message: string; color: string; emoji: string } {
  const e = emotion.toLowerCase()
  if (e.includes("nerv") || e.includes("anx") || e.includes("fear")) {
    return {
      message: "Try to slow down and breathe. You're doing fine.",
      color: "rgba(245, 158, 11, 0.15)",
      emoji: "💛",
    }
  }
  if (e.includes("happy") || e.includes("confident") || e.includes("comfort")) {
    return {
      message: "Great energy! Keep it up.",
      color: "rgba(0, 212, 255, 0.12)",
      emoji: "💙",
    }
  }
  if (e.includes("sad") || e.includes("disgust") || e.includes("angry")) {
    return {
      message: "Take a breath — you're more prepared than you think.",
      color: "rgba(168, 85, 247, 0.15)",
      emoji: "💜",
    }
  }
  if (e.includes("focus") || e.includes("neutral") || e.includes("surpris")) {
    return {
      message: "Good focus. Answer clearly and concisely.",
      color: "rgba(0, 212, 255, 0.08)",
      emoji: "🔵",
    }
  }
  return {
    message: "Maintain eye contact and speak with confidence.",
    color: "rgba(0, 212, 255, 0.08)",
    emoji: "✨",
  }
}

// ── Component ────────────────────────────────────────────────────────────────

export function MockInterviewPage() {
  const { data: session } = useSession()
  const router = useRouter()

  // Config step
  const [configComplete, setConfigComplete] = useState(false)
  const [interviewConfig, setInterviewConfig] = useState<InterviewConfig | null>(null)

  // Interview state
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [userAnswer, setUserAnswer] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [speechEnabled, setSpeechEnabled] = useState(true)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [questionStartTime, setQuestionStartTime] = useState(Date.now())
  const [questions, setQuestions] = useState<Question[]>([])
  const [questionsLoaded, setQuestionsLoaded] = useState(false)
  const [cameraReady, setCameraReady] = useState(false)
  const [showHelp, setShowHelp] = useState(false)
  const [hasShownInitialTips, setHasShownInitialTips] = useState(false)

  // Evaluation state
  const [evaluating, setEvaluating] = useState(false)
  const [lastEvaluation, setLastEvaluation] = useState<EvaluationResult | null>(null)

  const [sessionData, setSessionData] = useState<{
    startTime: Date
    questions: QuestionData[]
    totalTabSwitches: number
    speechUsed: boolean
  }>({
    startTime: new Date(),
    questions: [],
    totalTabSwitches: 0,
    speechUsed: false,
  })

  const [currentEmotionData, setCurrentEmotionData] = useState<EmotionData | null>(null)
  const [emotionTimeline, setEmotionTimeline] = useState<EmotionData[]>([])
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // ── Auth guard ──────────────────────────────────────────────────────────────
  useEffect(() => {
    if (session === null) {
      router.replace("/login")
    }
  }, [session, router])

  // ── Init after config ────────────────────────────────────────────────────────
  useEffect(() => {
    if (!configComplete || !interviewConfig) return

    if (!hasShownInitialTips) {
      setHasShownInitialTips(true)
      setTimeout(() => {
        toast.success(`🎯 ${interviewConfig.type === "mock" ? "Mock" : "Formal"} Interview Starting!`, {
          duration: 4000,
          style: { background: "rgba(0,212,255,0.1)", border: "1px solid rgba(0,212,255,0.4)", color: "#cffafe", fontWeight: "bold" },
        })
      }, 500)
      setTimeout(() => {
        toast(`💡 Answer naturally. We're analyzing your eye contact & tone.`, {
          duration: 5000,
          icon: "💡",
        })
      }, 2500)
    }

    initializeInterview(interviewConfig)

    return () => {
      tabDetectionService.stopDetection()
      speechService.stop()
    }
  }, [configComplete, interviewConfig])

  // ── Speak first question when ready ────────────────────────────────────────
  useEffect(() => {
    if (questionsLoaded && questions.length > 0 && speechEnabled && currentQuestion === 0 && cameraReady && !isSpeaking) {
      setTimeout(() => {
        speakQuestion(
          `Hi there! I'm Savi, your AI Interview Assistant. ${interviewConfig?.type === "mock" ? "Mock" : "Formal"} interview is starting now. Let's begin: ` +
          questions[0].text
        )
      }, 2000)
    }
  }, [questionsLoaded, questions, speechEnabled, cameraReady])

  // ── Interview Initialization ────────────────────────────────────────────────
  const initializeInterview = async (config: InterviewConfig) => {
    setQuestionStartTime(Date.now())

    try {
      const loaded = await QuestionSelector.getQuestionsForConfig(config.role, config.topic, 8)
      setQuestions(loaded)
      setQuestionsLoaded(true)
    } catch (error) {
      console.error("Error loading questions:", error)
      const fallback: Question[] = [
        { id: "f1", text: "Tell me about yourself and your professional background.", category: "general", difficulty: "easy" },
        { id: "f2", text: "What are your greatest strengths?", category: "general", difficulty: "easy" },
        { id: "f3", text: "Describe a challenging project you've worked on.", category: "technical", difficulty: "medium" },
        { id: "f4", text: "Where do you see yourself in 5 years?", category: "general", difficulty: "easy" },
        { id: "f5", text: "How do you handle stress and pressure?", category: "behavioral", difficulty: "medium" },
        { id: "f6", text: "Tell me about a time you failed and what you learned.", category: "behavioral", difficulty: "medium" },
        { id: "f7", text: "Why are you interested in this role?", category: "general", difficulty: "easy" },
        { id: "f8", text: "How do you stay current with industry trends?", category: "technical", difficulty: "easy" },
      ]
      setQuestions(fallback)
      setQuestionsLoaded(true)
    }

    tabDetectionService.startDetection(0)
    tabDetectionService.onTabSwitch(handleTabSwitch)
  }

  const handleTabSwitch = (event: TabSwitchEvent) => {
    if (event.type === "hidden") {
      setSessionData((prev) => ({ ...prev, totalTabSwitches: prev.totalTabSwitches + 1 }))
      toast.error(`🚨 Tab switch detected! Stay focused.`, {
        duration: 5000,
        style: { background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.4)", color: "#fca5a5" },
      })
    }
  }

  const handleEmotionDetected = (emotion: EmotionData) => {
    setCurrentEmotionData(emotion)
    if (emotion.isDetected && emotion.confidence > 60) {
      setEmotionTimeline((prev) => [...prev.slice(-19), emotion])
    }
  }

  const speakQuestion = async (question: string) => {
    if (!speechEnabled || isSpeaking) return
    setIsSpeaking(true)
    try {
      await speechService.speak(question, {
        rate: 0.85, pitch: 1.15, volume: 0.9,
        onEnd: () => {
          setIsSpeaking(false)
          toast.success("✨ Your turn to answer!", { duration: 2000 })
        },
        onError: (error) => {
          console.error("Speech error:", error)
          setIsSpeaking(false)
        },
      })
      setSessionData((prev) => ({ ...prev, speechUsed: true }))
    } catch {
      setIsSpeaking(false)
    }
  }

  // ── Evaluation ───────────────────────────────────────────────────────────────
  const evaluateAnswer = async (question: string, answer: string) => {
    setEvaluating(true)
    setLastEvaluation(null)
    try {
      const res = await fetch("/api/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question,
          answer,
          role: interviewConfig?.role || "General",
          topic: interviewConfig?.topic || "Behavioral",
        }),
      })
      if (res.ok) {
        const data: EvaluationResult = await res.json()
        setLastEvaluation(data)
      }
    } catch (err) {
      console.error("Evaluation error:", err)
    } finally {
      setEvaluating(false)
    }
  }

  // ── Submit Answer ────────────────────────────────────────────────────────────
  const handleSubmitAnswer = async () => {
    if (!userAnswer.trim()) {
      toast.error("Please provide an answer before submitting.", {
        style: { background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.4)", color: "#fca5a5" },
      })
      return
    }

    toast.success("✅ Answer submitted!", {
      style: { background: "rgba(0,212,255,0.1)", border: "1px solid rgba(0,212,255,0.4)", color: "#cffafe" },
    })

    const timeTaken = Date.now() - questionStartTime
    const questionData: QuestionData = {
      question: questions[currentQuestion].text,
      answer: userAnswer,
      emotionDuringAnswer: currentEmotionData?.emotion || "Neutral",
      eyeContactScore: currentEmotionData?.eyeContactScore || 75,
      timeTaken,
      tabSwitches: tabDetectionService.getSwitchCount(),
      startTime: questionStartTime,
      emotionTimeline: [...emotionTimeline],
    }

    setSessionData((prev) => ({ ...prev, questions: [...prev.questions, questionData] }))

    // Evaluate async (non-blocking)
    evaluateAnswer(questions[currentQuestion].text, userAnswer)

    setIsTyping(true)
    setTimeout(async () => {
      setIsTyping(false)

      if (currentQuestion < questions.length - 1) {
        const next = currentQuestion + 1
        setCurrentQuestion(next)
        setUserAnswer("")
        setQuestionStartTime(Date.now())
        setEmotionTimeline([])
        tabDetectionService.setCurrentQuestion(next)
        toast(`📝 Question ${next + 1} of ${questions.length}`, {
          duration: 3000,
          style: { background: "rgba(168,85,247,0.1)", border: "1px solid rgba(168,85,247,0.4)", color: "#e9d5ff" },
        })
        setTimeout(() => {
          if (speechEnabled) speakQuestion(`Question ${next + 1}: ${questions[next].text}`)
        }, 1500)
      } else {
        finishInterview()
      }
    }, 2500)
  }

  // ── Finish Interview ─────────────────────────────────────────────────────────
  const finishInterview = async () => {
    try {
      const endTime = new Date()
      const totalDuration = endTime.getTime() - sessionData.startTime.getTime()
      const avgResponseTime = sessionData.questions.reduce((s, q) => s + q.timeTaken, 0) / sessionData.questions.length
      const avgEyeContact = sessionData.questions.reduce((s, q) => s + q.eyeContactScore, 0) / sessionData.questions.length

      const interviewData = {
        type: interviewConfig?.type || "mock",
        endTime: endTime.toISOString(),
        questions: sessionData.questions.map((q) => q.question),
        answers: sessionData.questions.map((q) => q.answer),
        emotions: sessionData.questions.map((q) => q.emotionDuringAnswer),
        eyeContactScores: sessionData.questions.map((q) => q.eyeContactScore),
        timeTaken: sessionData.questions.map((q) => q.timeTaken),
        tabSwitches: sessionData.totalTabSwitches,
        speechUsed: sessionData.speechUsed,
        interviewConfig,
        metrics: {
          averageResponseTime: Math.round(avgResponseTime / 1000),
          averageEyeContact: Math.round(avgEyeContact),
          totalDuration: Math.round(totalDuration / 1000),
          completionRate: 100,
        },
      }

      const res = await fetch("/api/interview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(interviewData),
      })

      if (res.ok) {
        const result = await res.json()
        toast.success("🎉 Interview complete! Generating your report...", {
          duration: 4000,
          style: { background: "rgba(0,212,255,0.1)", border: "1px solid rgba(0,212,255,0.4)", color: "#cffafe", fontWeight: "bold" },
        })
        setTimeout(() => router.push(`/report/${result.interviewId}`), 2000)
      } else {
        throw new Error("Failed to save")
      }
    } catch (error) {
      console.error("Error finishing interview:", error)
      toast.error("❌ Error saving interview. Please try again.")
    }
  }

  const toggleSpeech = () => {
    setSpeechEnabled(!speechEnabled)
    if (speechEnabled) { speechService.stop(); setIsSpeaking(false) }
    toast(speechEnabled ? "🔇 Speech disabled" : "🔊 Speech enabled", { duration: 2000 })
  }

  const handleMicTranscript = (text: string) => {
    setUserAnswer((prev) => prev ? `${prev} ${text}` : text)
    setTimeout(() => textareaRef.current?.focus(), 100)
  }

  // ── Config Modal ─────────────────────────────────────────────────────────────
  if (!configComplete) {
    return (
      <InterviewConfigModal
        onConfigComplete={(cfg: InterviewConfig) => {
          setInterviewConfig(cfg)
          setConfigComplete(true)
        }}
      />
    )
  }

  // ── Loading State ─────────────────────────────────────────────────────────────
  if (!questionsLoaded) {
    return (
      <AnimatedPage>
        <EnhancedBackground />
        <div className="min-h-screen flex items-center justify-center">
          <div
            className="p-10 text-center rounded-2xl"
            style={{
              background: "rgba(5, 8, 22, 0.85)",
              border: "1px solid rgba(0, 212, 255, 0.2)",
              backdropFilter: "blur(20px)",
              boxShadow: "0 0 40px rgba(0, 212, 255, 0.1)",
            }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 mx-auto mb-4"
            >
              <Brain className="w-full h-full text-cyan-400" />
            </motion.div>
            <h2 className="text-2xl font-bold text-white mb-2">Savi is preparing your interview...</h2>
            <p className="text-slate-400">
              Loading {interviewConfig?.role} · {interviewConfig?.topic} questions
            </p>
          </div>
        </div>
      </AnimatedPage>
    )
  }

  // ── Emotion feedback data ─────────────────────────────────────────────────────
  const emotionFeedback = currentEmotionData?.isDetected && currentEmotionData.emotion
    ? getEmotionFeedback(currentEmotionData.emotion)
    : null

  // ── Main UI ───────────────────────────────────────────────────────────────────
  return (
    <AnimatedPage>
      <EnhancedBackground />
      <Navbar />

      <div className="min-h-screen pt-20 pb-8 px-4">
        <div className="max-w-5xl mx-auto">

          {/* Header */}
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-6">
            <h1
              className="text-4xl font-bold mb-3"
              style={{
                background: "linear-gradient(135deg, #00d4ff 0%, #a855f7 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {interviewConfig?.type === "mock" ? "Mock" : "Formal"} Interview with Savi
            </h1>
            <div className="flex items-center justify-center space-x-3 flex-wrap gap-y-2">
              <Badge
                className="px-3 py-1 text-white"
                style={{ background: "rgba(0,212,255,0.12)", border: "1px solid rgba(0,212,255,0.25)" }}
              >
                Q {currentQuestion + 1} / {questions.length}
              </Badge>
              <Badge
                className="px-3 py-1 text-white"
                style={{ background: "rgba(168,85,247,0.12)", border: "1px solid rgba(168,85,247,0.25)" }}
              >
                {interviewConfig?.role}
              </Badge>
              <Badge
                className="px-3 py-1 text-white"
                style={{ background: "rgba(0,255,157,0.08)", border: "1px solid rgba(0,255,157,0.2)" }}
              >
                {interviewConfig?.topic}
              </Badge>
              <Badge
                className="px-3 py-1 text-slate-300"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)" }}
              >
                <Clock className="w-3.5 h-3.5 mr-1.5 inline" />
                {Math.floor((Date.now() - sessionData.startTime.getTime()) / 60000)}m
              </Badge>
              <Badge
                className="px-3 py-1 text-slate-300"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)" }}
              >
                <Eye className="w-3.5 h-3.5 mr-1.5 inline" />
                {currentEmotionData?.eyeContactScore || 0}%
              </Badge>
            </div>
          </motion.div>

          {/* Progress Bar */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-6">
            <div className="flex justify-between text-xs text-slate-400 mb-2">
              <span>Interview Progress</span>
              <span className="text-cyan-400 font-semibold">
                {Math.round(((currentQuestion + 1) / questions.length) * 100)}%
              </span>
            </div>
            <div className="h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
              <motion.div
                className="h-full rounded-full"
                style={{ background: "linear-gradient(90deg, #00d4ff, #a855f7)" }}
                initial={{ width: 0 }}
                animate={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </motion.div>

          {/* Main Layout */}
          <div className="grid lg:grid-cols-3 gap-6">

            {/* ── Main Interview Area ── */}
            <div className="lg:col-span-2 space-y-5">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentQuestion}
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -40 }}
                  transition={{ duration: 0.4 }}
                >
                  <div
                    className="rounded-2xl overflow-hidden"
                    style={{
                      background: "rgba(5, 8, 22, 0.85)",
                      border: "1px solid rgba(0, 212, 255, 0.15)",
                      backdropFilter: "blur(20px)",
                      boxShadow: "0 20px 50px rgba(0,0,0,0.4), 0 0 0 1px rgba(0,212,255,0.05)",
                    }}
                  >
                    {/* Top accent bar */}
                    <div className="h-px w-full" style={{ background: "linear-gradient(90deg, transparent, #00d4ff, #a855f7, transparent)" }} />

                    <div className="p-7">
                      {/* Savi header */}
                      <div className="flex items-start space-x-4 mb-6">
                        <motion.div
                          animate={isSpeaking ? { scale: [1, 1.08, 1], rotate: [0, 3, -3, 0] } : {}}
                          transition={{ duration: 0.6, repeat: isSpeaking ? Infinity : 0 }}
                          className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold text-lg"
                          style={{ background: "linear-gradient(135deg, #00d4ff 0%, #a855f7 100%)", boxShadow: "0 0 20px rgba(0,212,255,0.3)" }}
                        >
                          S
                        </motion.div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <span className="font-bold text-white text-sm">Savi AI</span>
                            {isSpeaking && (
                              <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 0.5, repeat: Infinity }}>
                                <Volume2 className="w-4 h-4 text-cyan-400" />
                              </motion.div>
                            )}
                            <Badge
                              className="text-xs ml-auto"
                              style={{
                                background: currentEmotionData?.isDetected ? "rgba(0,212,255,0.1)" : "rgba(100,116,139,0.15)",
                                border: `1px solid ${currentEmotionData?.isDetected ? "rgba(0,212,255,0.3)" : "rgba(100,116,139,0.3)"}`,
                                color: currentEmotionData?.isDetected ? "#00d4ff" : "#64748b",
                              }}
                            >
                              {currentEmotionData?.isDetected ? "Face Detected ✓" : "Searching..."}
                            </Badge>
                          </div>
                          <p className="text-white text-lg font-medium leading-relaxed">
                            {questions[currentQuestion]?.text}
                          </p>
                        </div>
                      </div>

                      {/* Controls row */}
                      <div className="flex items-center space-x-3 mb-5">
                        <button
                          onClick={toggleSpeech}
                          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-sm text-slate-300 hover:text-white transition-all"
                          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
                        >
                          {speechEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                          <span>{speechEnabled ? "Mute Savi" : "Unmute"}</span>
                        </button>
                        <button
                          onClick={() => setShowHelp(!showHelp)}
                          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-sm text-slate-300 hover:text-white transition-all"
                          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
                        >
                          <HelpCircle className="w-4 h-4" />
                          <span>Tips</span>
                        </button>
                      </div>

                      {/* Tips Panel */}
                      <AnimatePresence>
                        {showHelp && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mb-5 p-4 rounded-xl overflow-hidden"
                            style={{ background: "rgba(0,212,255,0.05)", border: "1px solid rgba(0,212,255,0.15)" }}
                          >
                            <div className="flex items-start space-x-3">
                              <Lightbulb className="w-5 h-5 text-cyan-400 mt-0.5 flex-shrink-0" />
                              <div className="space-y-1 text-sm">
                                <p className="font-semibold text-cyan-300">Interview Tips</p>
                                <ul className="space-y-1 text-slate-300">
                                  <li>• Look directly at the camera for better eye contact scores</li>
                                  <li>• Speak clearly — use the mic button or type your answer</li>
                                  <li>• Stay focused — tab switches are monitored</li>
                                  <li>• Use the STAR method: Situation, Task, Action, Result</li>
                                  <li>• Take your time to think before answering</li>
                                </ul>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Answer Area */}
                      <div className="space-y-3">
                        <label className="block text-sm font-semibold text-slate-200">
                          Your Answer:
                        </label>
                        <div className="relative">
                          <textarea
                            ref={textareaRef}
                            value={userAnswer}
                            onChange={(e) => setUserAnswer(e.target.value)}
                            placeholder="Type your answer here, or click the mic button to speak..."
                            className="w-full h-36 p-4 pr-16 resize-none rounded-xl text-white placeholder:text-slate-600 transition-all focus:outline-none"
                            style={{
                              background: "rgba(255,255,255,0.04)",
                              border: "1px solid rgba(0,212,255,0.2)",
                              lineHeight: "1.7",
                            }}
                            disabled={isTyping}
                          />
                          {/* Mic button — inside/beside textarea */}
                          <div className="absolute bottom-3 right-3">
                            <MicButton
                              onTranscript={handleMicTranscript}
                              disabled={isTyping || isSpeaking}
                            />
                          </div>
                        </div>

                        {/* Submit Button */}
                        <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                          <Button
                            onClick={handleSubmitAnswer}
                            disabled={!userAnswer.trim() || isTyping || isSpeaking}
                            className="w-full py-4 text-base font-semibold rounded-xl text-white"
                            style={{
                              background:
                                userAnswer.trim() && !isTyping && !isSpeaking
                                  ? "linear-gradient(135deg, #00d4ff 0%, #a855f7 100%)"
                                  : "rgba(100,116,139,0.3)",
                              boxShadow:
                                userAnswer.trim() && !isTyping && !isSpeaking
                                  ? "0 0 25px rgba(0,212,255,0.3)"
                                  : "none",
                            }}
                          >
                            {isTyping ? (
                              <div className="flex items-center justify-center space-x-2">
                                <Loader2 className="w-5 h-5 animate-spin" />
                                <span>Processing...</span>
                              </div>
                            ) : (
                              <div className="flex items-center justify-center space-x-2">
                                <Send className="w-5 h-5" />
                                <span>{currentQuestion === questions.length - 1 ? "Finish Interview" : "Submit Answer"}</span>
                              </div>
                            )}
                          </Button>
                        </motion.div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Evaluation Panel */}
              <AnimatePresence>
                {(evaluating || lastEvaluation) && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="rounded-2xl overflow-hidden"
                    style={{
                      background: "rgba(5, 8, 22, 0.85)",
                      border: "1px solid rgba(168, 85, 247, 0.2)",
                      backdropFilter: "blur(20px)",
                    }}
                  >
                    <div className="h-px w-full" style={{ background: "linear-gradient(90deg, transparent, #a855f7, #00d4ff, transparent)" }} />
                    <div className="p-5">
                      <div className="flex items-center space-x-2 mb-4">
                        <Target className="w-5 h-5 text-purple-400" />
                        <span className="font-bold text-white">AI Evaluation</span>
                        {/* Source badge */}
                        {lastEvaluation && (
                          <span
                            className="ml-auto text-xs font-semibold px-2 py-0.5 rounded-full"
                            style={
                              lastEvaluation.source === "gemini"
                                ? { background: "rgba(0,212,255,0.15)", border: "1px solid rgba(0,212,255,0.35)", color: "#00d4ff" }
                                : lastEvaluation.quota_exceeded
                                  ? { background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.35)", color: "#f87171" }
                                  : { background: "rgba(100,116,139,0.2)", border: "1px solid rgba(100,116,139,0.35)", color: "#94a3b8" }
                            }
                            title={lastEvaluation.quota_exceeded ? "Gemini quota exceeded — upgrade at ai.google.dev" : undefined}
                          >
                            {lastEvaluation.source === "gemini"
                              ? "✦ Gemini 2.0"
                              : lastEvaluation.quota_exceeded
                                ? "⚠ Quota Exceeded"
                                : "⚙ Heuristic"}
                          </span>
                        )}
                        {evaluating && <Loader2 className="w-4 h-4 text-slate-400 animate-spin ml-auto" />}
                      </div>

                      {evaluating && (
                        <div className="text-slate-400 text-sm text-center py-4">
                          Analyzing your answer...
                        </div>
                      )}

                      {lastEvaluation && !evaluating && (
                        <div className="space-y-4">
                          {/* Score */}
                          <div className="flex items-center justify-between">
                            <span className="text-slate-300 text-sm font-medium">Score</span>
                            <div className="flex items-center space-x-2">
                              <div className="h-2 w-32 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
                                <motion.div
                                  className="h-full rounded-full"
                                  style={{ background: "linear-gradient(90deg, #00d4ff, #a855f7)" }}
                                  initial={{ width: 0 }}
                                  animate={{ width: `${lastEvaluation.score * 10}%` }}
                                  transition={{ duration: 0.8 }}
                                />
                              </div>
                              <span className="text-white font-bold">{lastEvaluation.score}/10</span>
                            </div>
                          </div>

                          {/* Strengths */}
                          {lastEvaluation.strengths.length > 0 && (
                            <div>
                              <p className="text-xs font-semibold text-cyan-400 mb-2 flex items-center">
                                <CheckCircle className="w-3.5 h-3.5 mr-1.5" /> Strengths
                              </p>
                              <ul className="space-y-1">
                                {lastEvaluation.strengths.map((s, i) => (
                                  <li key={i} className="text-sm text-slate-300 flex items-start space-x-2">
                                    <span className="text-cyan-500 mt-0.5">•</span><span>{s}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {/* Improvements */}
                          {lastEvaluation.improvements.length > 0 && (
                            <div>
                              <p className="text-xs font-semibold text-amber-400 mb-2 flex items-center">
                                <TrendingUp className="w-3.5 h-3.5 mr-1.5" /> To Improve
                              </p>
                              <ul className="space-y-1">
                                {lastEvaluation.improvements.map((imp, i) => (
                                  <li key={i} className="text-sm text-slate-300 flex items-start space-x-2">
                                    <span className="text-amber-500 mt-0.5">•</span><span>{imp}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {/* Overall */}
                          <div className="p-3 rounded-xl text-sm text-slate-300" style={{ background: "rgba(168,85,247,0.08)", border: "1px solid rgba(168,85,247,0.15)" }}>
                            {lastEvaluation.overall_feedback}
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* ── Sidebar ── */}
            <div className="space-y-5">

              {/* Current Emotion Analysis */}
              {currentEmotionData && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                  <div
                    className="rounded-2xl overflow-hidden"
                    style={{
                      background: "rgba(5, 8, 22, 0.85)",
                      border: "1px solid rgba(168, 85, 247, 0.15)",
                      backdropFilter: "blur(20px)",
                    }}
                  >
                    <div className="p-5">
                      <h3 className="font-bold text-white mb-4 flex items-center space-x-2">
                        <Brain className="w-5 h-5 text-purple-400" />
                        <span>Live Analysis</span>
                      </h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-slate-400">Emotion</span>
                          <Badge
                            className="text-xs font-semibold"
                            style={{ background: "rgba(168,85,247,0.15)", border: "1px solid rgba(168,85,247,0.3)", color: "#c084fc" }}
                          >
                            {currentEmotionData.emotion}
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-slate-400">Confidence</span>
                          <span className="text-sm font-bold text-white">{currentEmotionData.confidence}%</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-slate-400">Eye Contact</span>
                          <span className={`text-sm font-bold ${currentEmotionData.eyeContactScore > 70 ? "text-cyan-400" : "text-amber-400"}`}>
                            {currentEmotionData.eyeContactScore}%
                          </span>
                        </div>

                        {/* PHASE 2: Emotion Feedback Panel */}
                        {emotionFeedback && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            className="mt-3 p-3 rounded-xl text-sm text-white"
                            style={{ background: emotionFeedback.color, border: "1px solid rgba(255,255,255,0.08)" }}
                          >
                            <div className="flex items-start space-x-2">
                              <span className="text-base flex-shrink-0">{emotionFeedback.emoji}</span>
                              <span className="text-slate-200 leading-relaxed">{emotionFeedback.message}</span>
                            </div>
                          </motion.div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Session Stats */}
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}>
                <div
                  className="rounded-2xl overflow-hidden"
                  style={{
                    background: "rgba(5, 8, 22, 0.85)",
                    border: "1px solid rgba(0, 212, 255, 0.12)",
                    backdropFilter: "blur(20px)",
                  }}
                >
                  <div className="p-5">
                    <h3 className="font-bold text-white mb-4 flex items-center space-x-2">
                      <CheckCircle className="w-5 h-5 text-cyan-400" />
                      <span>Session Stats</span>
                    </h3>
                    <div className="space-y-3 text-sm">
                      {[
                        { label: "Questions Answered", value: sessionData.questions.length, color: "text-white" },
                        { label: "Tab Switches", value: sessionData.totalTabSwitches, color: sessionData.totalTabSwitches > 0 ? "text-red-400" : "text-white" },
                        { label: "Speech Used", value: sessionData.speechUsed ? "Yes" : "No", color: "text-white" },
                        {
                          label: "Duration",
                          value: `${Math.floor((Date.now() - sessionData.startTime.getTime()) / 60000)}m`,
                          color: "text-white",
                        },
                      ].map(({ label, value, color }) => (
                        <div key={label} className="flex justify-between items-center">
                          <span className="text-slate-400">{label}:</span>
                          <span className={`font-bold ${color}`}>{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Interview Context */}
              {interviewConfig && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
                  <div
                    className="rounded-2xl overflow-hidden"
                    style={{
                      background: "rgba(5, 8, 22, 0.85)",
                      border: "1px solid rgba(0, 255, 157, 0.1)",
                      backdropFilter: "blur(20px)",
                    }}
                  >
                    <div className="p-5">
                      <h3 className="font-bold text-white mb-3 flex items-center space-x-2">
                        <AlertCircle className="w-4 h-4 text-emerald-400" />
                        <span>Interview Config</span>
                      </h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between items-center">
                          <span className="text-slate-400">Type</span>
                          <span className="text-white font-semibold capitalize">{interviewConfig.type}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-400">Role</span>
                          <span className="text-emerald-400 font-semibold text-xs text-right max-w-[60%]">{interviewConfig.role}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-400">Topic</span>
                          <span className="text-cyan-400 font-semibold">{interviewConfig.topic}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Draggable Camera - outside main layout */}
      <LiveFacePreview isVisible={true} onEmotionDetected={handleEmotionDetected} onCameraReady={(r) => setCameraReady(r)} />

      {/* AI Assistant */}
      <AiAssistantSavi
        isVisible={true}
        isSpeaking={isSpeaking}
        emotion={isTyping ? "thinking" : isSpeaking ? "speaking" : "neutral"}
      />
    </AnimatedPage>
  )
}
