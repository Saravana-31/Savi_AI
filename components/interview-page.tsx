"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { motion, AnimatePresence } from "framer-motion"
import {
  Send,
  Volume2,
  VolumeX,
  Eye,
  Clock,
  CheckCircle,
  Brain,
  Loader2,
  HelpCircle,
  Lightbulb,
  Target,
} from "lucide-react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { AnimatedPage } from "@/components/animated-page"
import { LiveFacePreview } from "@/components/live-face-preview"
import { AiAssistantSavi } from "@/components/ai-assistant-savi"
import { EnhancedBackground } from "@/components/enhanced-background"
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
}

interface JobContext {
  jobTitle: string
  jobDescription: string
  matchedSkills: string[]
  matchPercentage: number
}

export function InterviewPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [userAnswer, setUserAnswer] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [speechEnabled, setSpeechEnabled] = useState(true)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [questionStartTime, setQuestionStartTime] = useState(Date.now())
  const [speechVoice, setSpeechVoice] = useState("en-US")
  const [questions, setQuestions] = useState<Question[]>([])
  const [questionsLoaded, setQuestionsLoaded] = useState(false)
  const [cameraReady, setCameraReady] = useState(false)
  const [showHelp, setShowHelp] = useState(false)
  const [hasShownInitialTips, setHasShownInitialTips] = useState(false)
  const [jobContext, setJobContext] = useState<JobContext | null>(null)

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

  useEffect(() => {
    if (!session) {
      router.push("/login")
      return
    }

    // Load job context from sessionStorage
    const storedJobContext = sessionStorage.getItem("jobContext")
    if (storedJobContext) {
      try {
        const parsedContext = JSON.parse(storedJobContext)
        setJobContext(parsedContext)
        console.log("Loaded job context:", parsedContext)
      } catch (error) {
        console.error("Error parsing job context:", error)
      }
    }

    // Show initial tips only once to prevent duplicates
    if (!hasShownInitialTips) {
      setHasShownInitialTips(true)

      // Single welcome message
      setTimeout(() => {
        toast.success("🎯 Real Interview Starting with Savi!", {
          duration: 4000,
          style: {
            background: "linear-gradient(135deg, #10b981 0%, #3b82f6 100%)",
            color: "white",
            fontWeight: "bold",
          },
        })
      }, 1000)

      // Single tip message
      setTimeout(() => {
        toast("💡 Answer naturally. We're analyzing your eye contact & tone.", {
          duration: 6000,
          icon: "💡",
        })
      }, 3000)
    }

    initializeInterview()

    return () => {
      tabDetectionService.stopDetection()
      speechService.stop()
    }
  }, [session, router])

  useEffect(() => {
    if (
      questionsLoaded &&
      questions.length > 0 &&
      speechEnabled &&
      currentQuestion === 0 &&
      cameraReady &&
      !isSpeaking
    ) {
      setTimeout(() => {
        const welcomeMessage = jobContext
          ? `Hi there! I'm Savi, your AI Interview Assistant. This is your real interview for the ${jobContext.jobTitle} position. Let's begin with our first question: ${questions[0].text}`
          : `Hi there! I'm Savi, your AI Interview Assistant. Real interview is starting now. Let's begin with our first question: ${questions[0].text}`

        speakQuestion(welcomeMessage)
      }, 2000)
    }
  }, [questionsLoaded, questions, speechEnabled, currentQuestion, cameraReady, jobContext])

  const initializeInterview = async () => {
    setQuestionStartTime(Date.now())

    // Load job-specific questions if job context is available
    try {
      let interviewQuestions: Question[]

      if (jobContext) {
        // Generate job-specific questions based on matched skills and job description
        interviewQuestions = await QuestionSelector.getJobSpecificQuestions(
          jobContext.jobTitle,
          jobContext.matchedSkills,
          session?.user?.email || "anonymous",
          8,
        )
        console.log("Loaded job-specific questions for:", jobContext.jobTitle)
      } else {
        // Fallback to general questions
        interviewQuestions = await QuestionSelector.getUniqueQuestions(session?.user?.email || "anonymous", 8)
        console.log("Loaded general interview questions")
      }

      setQuestions(interviewQuestions)
      setQuestionsLoaded(true)
    } catch (error) {
      console.error("Error loading questions:", error)
      // Enhanced fallback questions
      const fallbackQuestions: Question[] = [
        {
          id: "real_1",
          text: "Tell me about yourself and why you're interested in this position.",
          category: "general",
          difficulty: "easy",
        },
        {
          id: "real_2",
          text: "What specific skills and experience make you a good fit for this role?",
          category: "technical",
          difficulty: "medium",
        },
        {
          id: "real_3",
          text: "How do you stay current with industry trends and technologies?",
          category: "technical",
          difficulty: "medium",
        },
        {
          id: "real_4",
          text: "Describe a challenging project you've worked on and how you approached it.",
          category: "behavioral",
          difficulty: "medium",
        },
        {
          id: "real_5",
          text: "How do you handle working under pressure and tight deadlines?",
          category: "behavioral",
          difficulty: "medium",
        },
        {
          id: "real_6",
          text: "What are your salary expectations for this position?",
          category: "general",
          difficulty: "hard",
        },
        {
          id: "real_7",
          text: "Why do you want to work for our company specifically?",
          category: "general",
          difficulty: "medium",
        },
        {
          id: "real_8",
          text: "Do you have any questions about the role or our company?",
          category: "general",
          difficulty: "easy",
        },
      ]
      setQuestions(fallbackQuestions)
      setQuestionsLoaded(true)
    }

    // Initialize tab detection
    tabDetectionService.startDetection(0)
    tabDetectionService.onTabSwitch(handleTabSwitch)
  }

  const handleTabSwitch = (event: TabSwitchEvent) => {
    if (event.type === "hidden") {
      setSessionData((prev) => ({
        ...prev,
        totalTabSwitches: prev.totalTabSwitches + 1,
      }))

      toast.error(`🚨 Tab switch detected! Stay focused on the interview.`, {
        duration: 5000,
        style: {
          background: "linear-gradient(135deg, #ef4444 0%, #f97316 100%)",
          color: "white",
        },
      })
    }
  }

  const handleEmotionDetected = (emotion: EmotionData) => {
    setCurrentEmotionData(emotion)

    // Add to timeline if emotion is detected with good confidence
    if (emotion.isDetected && emotion.confidence > 60) {
      setEmotionTimeline((prev) => [...prev.slice(-19), emotion]) // Keep last 20 emotions
    }
  }

  const speakQuestion = async (question: string) => {
    if (!speechEnabled || isSpeaking) return

    setIsSpeaking(true)
    toast("🗣️ Savi is speaking...", {
      style: {
        background: "linear-gradient(135deg, #a855f7 0%, #3b82f6 100%)",
        color: "white",
      },
    })

    try {
      await speechService.speak(question, {
        rate: 0.85,
        pitch: 1.15,
        volume: 0.9,
        voice: speechVoice,
        onStart: () => {
          console.log("Speech started")
        },
        onEnd: () => {
          console.log("Speech ended")
          setIsSpeaking(false)
          toast.success("✨ Your turn to answer!", { duration: 2000 })
        },
        onError: (error) => {
          console.error("Speech error:", error)
          toast.error("Speech synthesis error. Please check your browser settings.")
          setIsSpeaking(false)
        },
      })

      setSessionData((prev) => ({ ...prev, speechUsed: true }))
    } catch (error) {
      console.error("Speech error:", error)
      toast.error("Speech synthesis failed")
      setIsSpeaking(false)
    }
  }

  const handleSubmitAnswer = async () => {
    if (!userAnswer.trim()) {
      toast.error("Please provide an answer before submitting", {
        style: { background: "#fbbf24", color: "#92400e" },
      })
      return
    }

    toast.success("✅ Answer submitted successfully!", {
      style: {
        background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
        color: "white",
      },
    })

    const timeTaken = Date.now() - questionStartTime
    const questionTabSwitches = tabDetectionService.getSwitchCount()

    const questionData: QuestionData = {
      question: questions[currentQuestion].text,
      answer: userAnswer,
      emotionDuringAnswer: currentEmotionData?.emotion || "Neutral",
      eyeContactScore: currentEmotionData?.eyeContactScore || 75,
      timeTaken,
      tabSwitches: questionTabSwitches,
      startTime: questionStartTime,
      emotionTimeline: [...emotionTimeline],
    }

    setSessionData((prev) => ({
      ...prev,
      questions: [...prev.questions, questionData],
    }))

    setIsTyping(true)

    // Simulate bot processing time with enhanced feedback
    setTimeout(async () => {
      setIsTyping(false)

      if (currentQuestion < questions.length - 1) {
        const nextQuestion = currentQuestion + 1
        setCurrentQuestion(nextQuestion)
        setUserAnswer("")
        setQuestionStartTime(Date.now())
        setEmotionTimeline([]) // Reset timeline for new question

        // Update tab detection for new question
        tabDetectionService.setCurrentQuestion(nextQuestion)

        toast(`📝 Loading question ${nextQuestion + 1} of ${questions.length}`, {
          duration: 3000,
          style: {
            background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
            color: "white",
          },
        })

        // Speak next question
        setTimeout(() => {
          if (speechEnabled) {
            speakQuestion(`Great answer! Now for question ${nextQuestion + 1}: ${questions[nextQuestion].text}`)
          }
        }, 1500)
      } else {
        // Interview completed
        finishInterview()
      }
    }, 2500)
  }

  const finishInterview = async () => {
    try {
      const endTime = new Date()
      const totalDuration = endTime.getTime() - sessionData.startTime.getTime()

      // Calculate metrics
      const averageResponseTime =
        sessionData.questions.reduce((sum, q) => sum + q.timeTaken, 0) / sessionData.questions.length
      const averageEyeContact =
        sessionData.questions.reduce((sum, q) => sum + q.eyeContactScore, 0) / sessionData.questions.length

      const interviewData = {
        type: "real",
        endTime: endTime.toISOString(),
        questions: sessionData.questions.map((q) => q.question),
        answers: sessionData.questions.map((q) => q.answer),
        emotions: sessionData.questions.map((q) => q.emotionDuringAnswer),
        eyeContactScores: sessionData.questions.map((q) => q.eyeContactScore),
        timeTaken: sessionData.questions.map((q) => q.timeTaken),
        tabSwitches: sessionData.totalTabSwitches,
        speechUsed: sessionData.speechUsed,
        // Include job context in the interview data
        jobContext: jobContext,
        metrics: {
          averageResponseTime: Math.round(averageResponseTime / 1000), // Convert to seconds
          averageEyeContact: Math.round(averageEyeContact),
          totalDuration: Math.round(totalDuration / 1000), // Convert to seconds
          completionRate: 100,
        },
      }

      const response = await fetch("/api/interview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(interviewData),
      })

      if (response.ok) {
        const result = await response.json()

        const successMessage = jobContext
          ? `🎉 Interview for ${jobContext.jobTitle} completed! Generating your report...`
          : "🎉 Interview completed! Generating your report..."

        toast.success(successMessage, {
          duration: 4000,
          style: {
            background: "linear-gradient(135deg, #10b981 0%, #3b82f6 100%)",
            color: "white",
            fontWeight: "bold",
          },
        })

        // Clear job context from sessionStorage
        sessionStorage.removeItem("jobContext")

        setTimeout(() => {
          router.push(`/report/${result.interviewId}`)
        }, 2000)
      } else {
        throw new Error("Failed to save interview")
      }
    } catch (error) {
      console.error("Error finishing interview:", error)
      toast.error("❌ Error saving interview. Please try again.")
    }
  }

  const toggleSpeech = () => {
    setSpeechEnabled(!speechEnabled)
    if (speechEnabled) {
      speechService.stop()
      setIsSpeaking(false)
    }
    toast(speechEnabled ? "🔇 Speech disabled" : "🔊 Speech enabled", {
      duration: 2000,
    })
  }

  const handleCameraReady = (ready: boolean) => {
    setCameraReady(ready)
  }

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
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              className="w-16 h-16 mx-auto mb-4"
            >
              <Brain className="w-full h-full text-cyan-400" />
            </motion.div>
            <h2 className="text-2xl font-bold text-white mb-2">Savi is preparing your interview...</h2>
            <p className="text-slate-400">
              {jobContext ? `Loading questions for ${jobContext.jobTitle}` : "Loading personalized questions"}
            </p>
          </div>
        </div>
      </AnimatedPage>
    )
  }

  return (
    <AnimatedPage>
      <EnhancedBackground />
      <Navbar />

      <div className="min-h-screen pt-20 pb-8 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gradient mb-4">
              {jobContext ? `Interview for ${jobContext.jobTitle}` : "Real Interview with Savi"}
            </h1>
            <div className="flex items-center justify-center space-x-6 text-sm">
              <Badge variant="outline" className="px-4 py-2">
                Question {currentQuestion + 1} of {questions.length}
              </Badge>
              <Badge variant="outline" className="px-4 py-2">
                <Clock className="w-4 h-4 mr-2" />
                {Math.floor((Date.now() - sessionData.startTime.getTime()) / 60000)}m
              </Badge>
              <Badge variant="outline" className="px-4 py-2">
                <Eye className="w-4 h-4 mr-2" />
                {currentEmotionData?.eyeContactScore || 0}%
              </Badge>
              {jobContext && (
                <Badge variant="outline" className="px-4 py-2 bg-emerald-50 text-emerald-700 border-emerald-300">
                  <Target className="w-4 h-4 mr-2" />
                  {jobContext.matchPercentage}% Match
                </Badge>
              )}
            </div>
          </motion.div>

          {/* Progress Bar */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-8">
            <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400 mb-2">
              <span>Interview Progress</span>
              <span>{Math.round(((currentQuestion + 1) / questions.length) * 100)}%</span>
            </div>
            <Progress value={((currentQuestion + 1) / questions.length) * 100} className="h-3" />
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Interview Area */}
            <div className="lg:col-span-2 space-y-6">
              {/* Question Card */}
              <motion.div
                key={currentQuestion}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Card
                  className="border-0 shadow-2xl"
                  style={{
                    background: "rgba(5, 8, 22, 0.85)",
                    border: "1px solid rgba(0, 212, 255, 0.15)",
                    backdropFilter: "blur(20px)",
                  }}
                >
                  <CardContent className="p-8">
                    <div className="flex items-start space-x-4 mb-6">
                      <motion.div
                        animate={{
                          scale: isSpeaking ? [1, 1.1, 1] : 1,
                          rotate: isSpeaking ? [0, 5, -5, 0] : 0,
                        }}
                        transition={{ duration: 0.5, repeat: isSpeaking ? Number.POSITIVE_INFINITY : 0 }}
                        className="w-12 h-12 bg-gradient-to-r from-emerald-400 to-blue-500 rounded-full flex items-center justify-center text-foreground font-bold text-xl"
                      >
                        S
                      </motion.div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="font-bold text-slate-800 dark:text-slate-200">Savi AI</h3>
                          {isSpeaking && (
                            <motion.div
                              animate={{ scale: [1, 1.2, 1] }}
                              transition={{ duration: 0.5, repeat: Number.POSITIVE_INFINITY }}
                            >
                              <Volume2 className="w-4 h-4 text-emerald-500" />
                            </motion.div>
                          )}
                        </div>
                        <div className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed">
                          {questions[currentQuestion]?.text}
                        </div>
                      </div>
                    </div>

                    {/* Controls */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center space-x-4">
                        <Button
                          onClick={toggleSpeech}
                          variant="outline"
                          size="sm"
                          className="flex items-center space-x-2 bg-transparent"
                        >
                          {speechEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                          <span>{speechEnabled ? "Mute" : "Unmute"}</span>
                        </Button>

                        <Button
                          onClick={() => setShowHelp(!showHelp)}
                          variant="outline"
                          size="sm"
                          className="flex items-center space-x-2"
                        >
                          <HelpCircle className="w-4 h-4" />
                          <span>Help</span>
                        </Button>
                      </div>

                      <Badge
                        className={`px-3 py-1 ${currentEmotionData?.isDetected
                            ? "bg-green-100 text-green-700 border-green-300"
                            : "bg-gray-100 text-gray-700 border-gray-300"
                          }`}
                      >
                        {currentEmotionData?.isDetected ? "Face Detected" : "Searching..."}
                      </Badge>
                    </div>

                    {/* Help Panel */}
                    <AnimatePresence>
                      {showHelp && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800"
                        >
                          <div className="flex items-start space-x-3">
                            <Lightbulb className="w-5 h-5 text-blue-500 mt-0.5" />
                            <div className="space-y-2 text-sm">
                              <p className="font-semibold text-blue-800 dark:text-blue-200">Interview Tips:</p>
                              <ul className="space-y-1 text-blue-700 dark:text-blue-300">
                                <li>• Look directly at the camera for better eye contact scores</li>
                                <li>• Speak clearly and at a moderate pace</li>
                                <li>• Stay focused - tab switches are being monitored</li>
                                <li>• Take your time to think before answering</li>
                                <li>• Use specific examples to support your answers</li>
                                {jobContext && (
                                  <li>
                                    • Highlight your experience with: {jobContext.matchedSkills.slice(0, 3).join(", ")}
                                  </li>
                                )}
                              </ul>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Answer Input */}
                    <div className="space-y-4">
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                        Your Answer:
                      </label>
                      <textarea
                        ref={textareaRef}
                        value={userAnswer}
                        onChange={(e) => setUserAnswer(e.target.value)}
                        placeholder="Type your answer here... Be specific and provide examples when possible."
                        className="w-full h-32 p-4 border border-slate-300 dark:border-slate-600 rounded-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm resize-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all"
                        disabled={isTyping}
                      />

                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Button
                          onClick={handleSubmitAnswer}
                          disabled={!userAnswer.trim() || isTyping || isSpeaking}
                          className="w-full py-4 text-lg font-semibold btn-glow"
                          style={{
                            background:
                              userAnswer.trim() && !isTyping && !isSpeaking
                                ? "linear-gradient(135deg, #10b981 0%, #3b82f6 100%)"
                                : "linear-gradient(135deg, #6b7280 0%, #9ca3af 100%)",
                            boxShadow:
                              userAnswer.trim() && !isTyping && !isSpeaking
                                ? "0 20px 40px rgba(16, 185, 129, 0.3)"
                                : "none",
                          }}
                        >
                          {isTyping ? (
                            <div className="flex items-center space-x-2">
                              <Loader2 className="w-5 h-5 animate-spin" />
                              <span>Processing Answer...</span>
                            </div>
                          ) : (
                            <div className="flex items-center space-x-2">
                              <Send className="w-5 h-5" />
                              <span>
                                {currentQuestion === questions.length - 1 ? "Finish Interview" : "Submit Answer"}
                              </span>
                            </div>
                          )}
                        </Button>
                      </motion.div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Job Context */}
              {jobContext && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                  <Card className="glass border-0">
                    <CardContent className="p-6">
                      <h3 className="font-bold mb-4 flex items-center space-x-2">
                        <Target className="w-5 h-5 text-emerald-500" />
                        <span>Job Context</span>
                      </h3>
                      <div className="space-y-3 text-sm">
                        <div>
                          <span className="font-semibold">Position:</span>
                          <p className="text-slate-600 dark:text-slate-400">{jobContext.jobTitle}</p>
                        </div>
                        <div>
                          <span className="font-semibold">Match:</span>
                          <p className="text-emerald-600 font-bold">{jobContext.matchPercentage}%</p>
                        </div>
                        <div>
                          <span className="font-semibold">Key Skills:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {jobContext.matchedSkills.slice(0, 4).map((skill, index) => (
                              <Badge key={index} className="text-xs bg-emerald-100 text-emerald-700 border-emerald-300">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* Current Emotion */}
              {currentEmotionData && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                  <Card className="glass border-0">
                    <CardContent className="p-6">
                      <h3 className="font-bold mb-4 flex items-center space-x-2">
                        <Brain className="w-5 h-5 text-purple-500" />
                        <span>Current Analysis</span>
                      </h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm">Emotion:</span>
                          <Badge className="bg-purple-100 text-purple-700 border-purple-300">
                            {currentEmotionData.emotion}
                          </Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Confidence:</span>
                          <span className="text-sm font-semibold">{currentEmotionData.confidence}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Eye Contact:</span>
                          <span className="text-sm font-semibold">{currentEmotionData.eyeContactScore}%</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* Session Stats */}
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
                <Card className="glass border-0">
                  <CardContent className="p-6">
                    <h3 className="font-bold mb-4 flex items-center space-x-2">
                      <CheckCircle className="w-5 h-5 text-emerald-500" />
                      <span>Session Stats</span>
                    </h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span>Questions Answered:</span>
                        <span className="font-semibold">{sessionData.questions.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Tab Switches:</span>
                        <span className="font-semibold text-red-600">{sessionData.totalTabSwitches}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Speech Used:</span>
                        <span className="font-semibold">{sessionData.speechUsed ? "Yes" : "No"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Duration:</span>
                        <span className="font-semibold">
                          {Math.floor((Date.now() - sessionData.startTime.getTime()) / 60000)}m
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Live Camera Preview */}
      <LiveFacePreview isVisible={true} onEmotionDetected={handleEmotionDetected} onCameraReady={handleCameraReady} />

      {/* AI Assistant */}
      <AiAssistantSavi
        isVisible={true}
        isSpeaking={isSpeaking}
        emotion={isTyping ? "thinking" : isSpeaking ? "speaking" : "neutral"}
      />
    </AnimatedPage>
  )
}
