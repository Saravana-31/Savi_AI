"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import {
  Brain,
  BookOpen,
  Target,
  Trophy,
  Clock,
  CheckCircle,
  XCircle,
  Lightbulb,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Play,
  Search,
  Filter,
  TrendingUp,
  Award,
  Zap,
  Star,
} from "lucide-react"
import {
  EnhancedAptitudeService,
  ENHANCED_APTITUDE_TOPICS,
  type EnhancedAptitudeTopic,
  type UserAptitudeProgress,
} from "@/lib/enhanced-aptitude-data"
import type { GeneratedQuestion } from "@/lib/ai-question-generator"
import { EnhancedBackground } from "@/components/enhanced-background"

interface PracticeSession {
  questions: GeneratedQuestion[]
  currentQuestionIndex: number
  answers: (number | null)[]
  startTime: Date
  timePerQuestion: number[]
  isActive: boolean
  topic: string
  difficulty: "easy" | "medium" | "hard"
}

export function AptitudePage() {
  const [activeTab, setActiveTab] = useState("overview")
  const [selectedTopic, setSelectedTopic] = useState<EnhancedAptitudeTopic | null>(null)
  const [practiceSession, setPracticeSession] = useState<PracticeSession | null>(null)
  const [userProgress, setUserProgress] = useState<UserAptitudeProgress[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [difficultyFilter, setDifficultyFilter] = useState("all")
  const [sessionTimer, setSessionTimer] = useState(0)
  const [questionTimer, setQuestionTimer] = useState(0)
  const [showExplanation, setShowExplanation] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)

  // Timer effects
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (practiceSession?.isActive) {
      interval = setInterval(() => {
        setSessionTimer((prev) => prev + 1)
        setQuestionTimer((prev) => prev + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [practiceSession?.isActive])

  // Load user progress from localStorage
  useEffect(() => {
    const savedProgress = localStorage.getItem("aptitude-progress")
    if (savedProgress) {
      setUserProgress(JSON.parse(savedProgress))
    }
  }, [])

  // Save progress to localStorage
  const saveProgress = (progress: UserAptitudeProgress[]) => {
    setUserProgress(progress)
    localStorage.setItem("aptitude-progress", JSON.stringify(progress))
  }

  const filteredTopics = ENHANCED_APTITUDE_TOPICS.filter((topic) => {
    const matchesSearch =
      topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      topic.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesDifficulty = difficultyFilter === "all" || topic.difficulty_levels.includes(difficultyFilter)
    return matchesSearch && matchesDifficulty
  })

  const startPracticeSession = (topic: string, difficulty: "easy" | "medium" | "hard", questionCount: number) => {
    try {
      const questions = EnhancedAptitudeService.generatePracticeSession(topic, difficulty, questionCount)
      if (questions.length === 0) {
        alert("No questions available for this topic and difficulty. Please try a different combination.")
        return
      }

      setPracticeSession({
        questions,
        currentQuestionIndex: 0,
        answers: new Array(questions.length).fill(null),
        startTime: new Date(),
        timePerQuestion: [],
        isActive: true,
        topic,
        difficulty,
      })
      setSessionTimer(0)
      setQuestionTimer(0)
      setShowExplanation(false)
      setSelectedAnswer(null)
      setActiveTab("practice")
    } catch (error) {
      console.error("Failed to start practice session:", error)
      alert("Failed to generate questions. Please try again.")
    }
  }

  const submitAnswer = (answerIndex: number) => {
    if (!practiceSession) return

    const updatedAnswers = [...practiceSession.answers]
    updatedAnswers[practiceSession.currentQuestionIndex] = answerIndex

    const updatedTimePerQuestion = [...practiceSession.timePerQuestion]
    updatedTimePerQuestion[practiceSession.currentQuestionIndex] = questionTimer

    setPracticeSession({
      ...practiceSession,
      answers: updatedAnswers,
      timePerQuestion: updatedTimePerQuestion,
    })

    setSelectedAnswer(answerIndex)
    setShowExplanation(true)
  }

  const nextQuestion = () => {
    if (!practiceSession) return

    if (practiceSession.currentQuestionIndex < practiceSession.questions.length - 1) {
      setPracticeSession({
        ...practiceSession,
        currentQuestionIndex: practiceSession.currentQuestionIndex + 1,
      })
      setQuestionTimer(0)
      setShowExplanation(false)
      setSelectedAnswer(null)
    } else {
      finishSession()
    }
  }

  const previousQuestion = () => {
    if (!practiceSession) return

    if (practiceSession.currentQuestionIndex > 0) {
      setPracticeSession({
        ...practiceSession,
        currentQuestionIndex: practiceSession.currentQuestionIndex - 1,
      })
      setQuestionTimer(0)
      setShowExplanation(false)
      setSelectedAnswer(practiceSession.answers[practiceSession.currentQuestionIndex - 1])
    }
  }

  const finishSession = () => {
    if (!practiceSession) return

    const correctAnswers = practiceSession.answers.filter(
      (answer, index) => answer === practiceSession.questions[index].correctAnswer,
    ).length

    const accuracy = Math.round((correctAnswers / practiceSession.questions.length) * 100)
    const avgTime = practiceSession.timePerQuestion.reduce((a, b) => a + b, 0) / practiceSession.questions.length

    // Update user progress
    const existingProgressIndex = userProgress.findIndex((p) => p.topic === practiceSession.topic)
    const updatedProgress = [...userProgress]

    if (existingProgressIndex >= 0) {
      const existing = updatedProgress[existingProgressIndex]
      updatedProgress[existingProgressIndex] = {
        ...existing,
        attempted: existing.attempted + practiceSession.questions.length,
        correct: existing.correct + correctAnswers,
        accuracy: Math.round(
          ((existing.correct + correctAnswers) / (existing.attempted + practiceSession.questions.length)) * 100,
        ),
        lastPracticed: new Date(),
        timeSpent: existing.timeSpent + Math.round(sessionTimer / 60),
        level: EnhancedAptitudeService.calculateLevel(accuracy, avgTime / 60),
        streakCount: accuracy >= 70 ? existing.streakCount + 1 : 0,
        bestStreak: Math.max(existing.bestStreak, accuracy >= 70 ? existing.streakCount + 1 : 0),
        confidenceLevel: Math.min(100, existing.confidenceLevel + (accuracy >= 70 ? 5 : -2)),
      }
    } else {
      updatedProgress.push({
        userId: "current-user",
        topic: practiceSession.topic,
        attempted: practiceSession.questions.length,
        correct: correctAnswers,
        accuracy,
        level: EnhancedAptitudeService.calculateLevel(accuracy, avgTime / 60),
        lastPracticed: new Date(),
        timeSpent: Math.round(sessionTimer / 60),
        difficultyBreakdown: {
          easy:
            practiceSession.difficulty === "easy"
              ? { attempted: practiceSession.questions.length, correct: correctAnswers }
              : { attempted: 0, correct: 0 },
          medium:
            practiceSession.difficulty === "medium"
              ? { attempted: practiceSession.questions.length, correct: correctAnswers }
              : { attempted: 0, correct: 0 },
          hard:
            practiceSession.difficulty === "hard"
              ? { attempted: practiceSession.questions.length, correct: correctAnswers }
              : { attempted: 0, correct: 0 },
        },
        confidenceLevel: accuracy,
        streakCount: accuracy >= 70 ? 1 : 0,
        bestStreak: accuracy >= 70 ? 1 : 0,
      })
    }

    saveProgress(updatedProgress)
    setPracticeSession({ ...practiceSession, isActive: false })
    setActiveTab("results")
  }

  const getTopicProgress = (topicId: string): UserAptitudeProgress | null => {
    return userProgress.find((p) => p.topic === topicId) || null
  }

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const getLevelColor = (level: string): string => {
    switch (level) {
      case "Expert":
        return "text-purple-500"
      case "Proficient":
        return "text-blue-500"
      case "Intermediate":
        return "text-green-500"
      default:
        return "text-gray-500"
    }
  }

  const getLevelIcon = (level: string) => {
    switch (level) {
      case "Expert":
        return <Award className="w-4 h-4" />
      case "Proficient":
        return <Star className="w-4 h-4" />
      case "Intermediate":
        return <TrendingUp className="w-4 h-4" />
      default:
        return <Zap className="w-4 h-4" />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <EnhancedBackground />

      <div className="relative z-10 container mx-auto px-4 py-8 pt-24">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
            Aptitude Mastery
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Master quantitative aptitude with AI-powered practice sessions, comprehensive learning materials, and
            intelligent progress tracking
          </p>
        </motion.div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 glass-card mb-8">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <Brain className="w-4 h-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="learn" className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Learn
            </TabsTrigger>
            <TabsTrigger value="practice" className="flex items-center gap-2">
              <Target className="w-4 h-4" />
              Practice
            </TabsTrigger>
            <TabsTrigger value="progress" className="flex items-center gap-2">
              <Trophy className="w-4 h-4" />
              Progress
            </TabsTrigger>
            <TabsTrigger value="results" className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Results
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <motion.div whileHover={{ scale: 1.05 }} className="glass-card p-6 text-center">
                <Brain className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-foreground mb-2">{ENHANCED_APTITUDE_TOPICS.length}</h3>
                <p className="text-slate-300">Topics Available</p>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05 }} className="glass-card p-6 text-center">
                <Target className="w-12 h-12 text-green-400 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-foreground mb-2">
                  {userProgress.reduce((sum, p) => sum + p.attempted, 0)}
                </h3>
                <p className="text-slate-300">Questions Attempted</p>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05 }} className="glass-card p-6 text-center">
                <Trophy className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-foreground mb-2">
                  {userProgress.reduce((sum, p) => sum + p.correct, 0)}
                </h3>
                <p className="text-slate-300">Correct Answers</p>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05 }} className="glass-card p-6 text-center">
                <Clock className="w-12 h-12 text-purple-400 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-foreground mb-2">
                  {userProgress.reduce((sum, p) => sum + p.timeSpent, 0)}m
                </h3>
                <p className="text-slate-300">Time Spent</p>
              </motion.div>
            </div>

            {/* Search and Filter */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <Input
                  placeholder="Search topics..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 glass-input"
                />
              </div>
              <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
                <SelectTrigger className="w-full md:w-48 glass-input">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Filter by difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Difficulties</SelectItem>
                  <SelectItem value="easy">Easy</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="hard">Hard</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Topics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTopics.map((topic, index) => {
                const progress = getTopicProgress(topic.id)
                return (
                  <motion.div
                    key={topic.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    className="glass-card p-6 cursor-pointer"
                    onClick={() => {
                      setSelectedTopic(topic)
                      setActiveTab("learn")
                    }}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="text-3xl">{topic.icon}</div>
                      {progress && (
                        <Badge variant="secondary" className={`${getLevelColor(progress.level)} bg-opacity-20`}>
                          <span className="flex items-center gap-1">
                            {getLevelIcon(progress.level)}
                            {progress.level}
                          </span>
                        </Badge>
                      )}
                    </div>

                    <h3 className="text-xl font-bold text-foreground mb-2">{topic.title}</h3>
                    <p className="text-slate-300 text-sm mb-4">{topic.description}</p>

                    {progress && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-400">Accuracy</span>
                          <span className="text-foreground">{progress.accuracy}%</span>
                        </div>
                        <Progress value={progress.accuracy} className="h-2" />
                        <div className="flex justify-between text-xs text-slate-400">
                          <span>{progress.attempted} attempted</span>
                          <span>{progress.correct} correct</span>
                        </div>
                      </div>
                    )}

                    <div className="flex flex-wrap gap-1 mt-4">
                      {topic.difficulty_levels.map((level) => (
                        <Badge key={level} variant="outline" className="text-xs">
                          {level}
                        </Badge>
                      ))}
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </TabsContent>

          {/* Learn Tab */}
          <TabsContent value="learn" className="space-y-6">
            {selectedTopic ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <div className="flex items-center gap-4 mb-6">
                  <Button
                    variant="ghost"
                    onClick={() => setSelectedTopic(null)}
                    className="text-slate-300 hover:text-foreground"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Topics
                  </Button>
                  <div className="text-3xl">{selectedTopic.icon}</div>
                  <div>
                    <h2 className="text-3xl font-bold text-foreground">{selectedTopic.title}</h2>
                    <p className="text-slate-300">{selectedTopic.description}</p>
                  </div>
                </div>

                {/* Formulas Section */}
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-foreground">
                      <Lightbulb className="w-5 h-5 text-yellow-400" />
                      Key Formulas
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {selectedTopic.formulas.map((formula, index) => (
                      <motion.div
                        key={formula.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-4 bg-slate-800/50 rounded-lg border border-slate-700"
                      >
                        <h4 className="font-semibold text-foreground mb-2">{formula.title}</h4>
                        <div className="bg-slate-900/50 p-3 rounded font-mono text-blue-300 mb-2">
                          {formula.formula}
                        </div>
                        <p className="text-slate-300 text-sm mb-3">{formula.description}</p>
                        <div className="space-y-1">
                          <p className="text-xs text-slate-400 font-semibold">Variables:</p>
                          {Object.entries(formula.variables).map(([variable, description]) => (
                            <div key={variable} className="text-xs text-slate-400 flex gap-2">
                              <span className="font-mono text-blue-300 min-w-8">{variable}:</span>
                              <span>{description}</span>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    ))}
                  </CardContent>
                </Card>

                {/* Examples Section */}
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-foreground">
                      <BookOpen className="w-5 h-5 text-green-400" />
                      Worked Examples
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {selectedTopic.examples.map((example, index) => (
                      <motion.div
                        key={example.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-4 bg-slate-800/50 rounded-lg border border-slate-700"
                      >
                        <div className="flex items-center gap-2 mb-3">
                          <Badge
                            variant={
                              example.difficulty === "easy"
                                ? "default"
                                : example.difficulty === "medium"
                                  ? "secondary"
                                  : "destructive"
                            }
                          >
                            {example.difficulty}
                          </Badge>
                        </div>

                        <div className="space-y-4">
                          <div>
                            <h5 className="font-semibold text-foreground mb-2">Problem:</h5>
                            <p className="text-slate-300 bg-slate-900/50 p-3 rounded">{example.problem}</p>
                          </div>

                          <div>
                            <h5 className="font-semibold text-foreground mb-2">Solution Steps:</h5>
                            <ol className="list-decimal list-inside space-y-1 text-slate-300">
                              {example.steps.map((step, stepIndex) => (
                                <li key={stepIndex} className="text-sm">
                                  {step}
                                </li>
                              ))}
                            </ol>
                          </div>

                          <div>
                            <h5 className="font-semibold text-foreground mb-2">Final Answer:</h5>
                            <p className="text-green-300 bg-slate-900/50 p-3 rounded font-mono">{example.solution}</p>
                          </div>

                          <div>
                            <h5 className="font-semibold text-foreground mb-2">Explanation:</h5>
                            <p className="text-slate-300 text-sm">{example.explanation}</p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </CardContent>
                </Card>

                {/* Practice Button */}
                <div className="text-center">
                  <Button onClick={() => setActiveTab("practice")} className="btn-primary text-lg px-8 py-3">
                    <Target className="w-5 h-5 mr-2" />
                    Start Practice Session
                  </Button>
                </div>
              </motion.div>
            ) : (
              <div className="text-center py-12">
                <Brain className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">Select a Topic to Learn</h3>
                <p className="text-slate-300">Choose a topic from the overview to access learning materials</p>
              </div>
            )}
          </TabsContent>

          {/* Practice Tab */}
          <TabsContent value="practice" className="space-y-6">
            {!practiceSession ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle className="text-foreground">Start Practice Session</CardTitle>
                    <CardDescription>Configure your practice session parameters</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="topic-select" className="text-foreground">
                          Topic
                        </Label>
                        <Select
                          onValueChange={(value) =>
                            setSelectedTopic(ENHANCED_APTITUDE_TOPICS.find((t) => t.id === value) || null)
                          }
                        >
                          <SelectTrigger id="topic-select" className="glass-input">
                            <SelectValue placeholder="Select a topic" />
                          </SelectTrigger>
                          <SelectContent>
                            {ENHANCED_APTITUDE_TOPICS.map((topic) => (
                              <SelectItem key={topic.id} value={topic.id}>
                                {topic.icon} {topic.title}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="difficulty-select" className="text-foreground">
                          Difficulty
                        </Label>
                        <Select defaultValue="easy">
                          <SelectTrigger id="difficulty-select" className="glass-input">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="easy">Easy</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="hard">Hard</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="question-count" className="text-foreground">
                          Questions
                        </Label>
                        <Select defaultValue="10">
                          <SelectTrigger id="question-count" className="glass-input">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="5">5 Questions</SelectItem>
                            <SelectItem value="10">10 Questions</SelectItem>
                            <SelectItem value="15">15 Questions</SelectItem>
                            <SelectItem value="20">20 Questions</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <Button
                      onClick={() => {
                        if (!selectedTopic) {
                          alert("Please select a topic first")
                          return
                        }
                        const difficulty = (document.getElementById("difficulty-select") as any)?.value || "easy"
                        const questionCount = Number.parseInt(
                          (document.getElementById("question-count") as any)?.value || "10",
                        )
                        startPracticeSession(selectedTopic.id, difficulty, questionCount)
                      }}
                      className="btn-primary w-full"
                      disabled={!selectedTopic}
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Start Practice Session
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ) : (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                {/* Session Header */}
                <div className="flex items-center justify-between glass-card p-4">
                  <div className="flex items-center gap-4">
                    <Badge variant="secondary">
                      Question {practiceSession.currentQuestionIndex + 1} of {practiceSession.questions.length}
                    </Badge>
                    <Badge variant="outline">{practiceSession.difficulty.toUpperCase()}</Badge>
                  </div>
                  <div className="flex items-center gap-4 text-slate-300">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>Session: {formatTime(sessionTimer)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Target className="w-4 h-4" />
                      <span>Question: {formatTime(questionTimer)}</span>
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="glass-card p-4">
                  <Progress
                    value={((practiceSession.currentQuestionIndex + 1) / practiceSession.questions.length) * 100}
                    className="h-2"
                  />
                </div>

                {/* Current Question */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={practiceSession.currentQuestionIndex}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="glass-card p-6"
                  >
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-xl font-semibold text-foreground mb-4">
                          {practiceSession.questions[practiceSession.currentQuestionIndex].question}
                        </h3>
                      </div>

                      <div className="grid grid-cols-1 gap-3">
                        {practiceSession.questions[practiceSession.currentQuestionIndex].options.map(
                          (option, index) => (
                            <motion.button
                              key={index}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => !showExplanation && submitAnswer(index)}
                              disabled={showExplanation}
                              className={`p-4 text-left rounded-lg border transition-all ${
                                selectedAnswer === index
                                  ? index ===
                                    practiceSession.questions[practiceSession.currentQuestionIndex].correctAnswer
                                    ? "bg-green-500/20 border-green-500 text-green-300"
                                    : "bg-red-500/20 border-red-500 text-red-300"
                                  : showExplanation &&
                                      index ===
                                        practiceSession.questions[practiceSession.currentQuestionIndex].correctAnswer
                                    ? "bg-green-500/20 border-green-500 text-green-300"
                                    : "bg-slate-800/50 border-slate-600 text-slate-300 hover:bg-slate-700/50"
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <div
                                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-sm font-semibold ${
                                    selectedAnswer === index
                                      ? index ===
                                        practiceSession.questions[practiceSession.currentQuestionIndex].correctAnswer
                                        ? "border-green-500 bg-green-500 text-foreground"
                                        : "border-red-500 bg-red-500 text-foreground"
                                      : showExplanation &&
                                          index ===
                                            practiceSession.questions[practiceSession.currentQuestionIndex]
                                              .correctAnswer
                                        ? "border-green-500 bg-green-500 text-foreground"
                                        : "border-slate-400"
                                  }`}
                                >
                                  {String.fromCharCode(65 + index)}
                                </div>
                                <span>{option}</span>
                                {selectedAnswer === index &&
                                  index ===
                                    practiceSession.questions[practiceSession.currentQuestionIndex].correctAnswer && (
                                    <CheckCircle className="w-5 h-5 text-green-500 ml-auto" />
                                  )}
                                {selectedAnswer === index &&
                                  index !==
                                    practiceSession.questions[practiceSession.currentQuestionIndex].correctAnswer && (
                                    <XCircle className="w-5 h-5 text-red-500 ml-auto" />
                                  )}
                              </div>
                            </motion.button>
                          ),
                        )}
                      </div>

                      {showExplanation && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="bg-slate-800/50 p-4 rounded-lg border border-slate-600"
                        >
                          <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                            <Lightbulb className="w-4 h-4 text-yellow-400" />
                            Explanation
                          </h4>
                          <p className="text-slate-300">
                            {practiceSession.questions[practiceSession.currentQuestionIndex].explanation}
                          </p>
                        </motion.div>
                      )}

                      <div className="flex justify-between">
                        <Button
                          onClick={previousQuestion}
                          disabled={practiceSession.currentQuestionIndex === 0}
                          variant="outline"
                          className="flex items-center gap-2 bg-transparent"
                        >
                          <ArrowLeft className="w-4 h-4" />
                          Previous
                        </Button>

                        <Button
                          onClick={nextQuestion}
                          disabled={!showExplanation}
                          className="btn-primary flex items-center gap-2"
                        >
                          {practiceSession.currentQuestionIndex === practiceSession.questions.length - 1
                            ? "Finish"
                            : "Next"}
                          <ArrowRight className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </motion.div>
            )}
          </TabsContent>

          {/* Progress Tab */}
          <TabsContent value="progress" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {userProgress.map((progress, index) => {
                const topic = ENHANCED_APTITUDE_TOPICS.find((t) => t.id === progress.topic)
                if (!topic) return null

                return (
                  <motion.div
                    key={progress.topic}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="glass-card p-6"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">{topic.icon}</div>
                        <div>
                          <h3 className="font-semibold text-foreground">{topic.title}</h3>
                          <p className="text-sm text-slate-400">
                            Last practiced: {new Date(progress.lastPracticed).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <Badge variant="secondary" className={`${getLevelColor(progress.level)} bg-opacity-20`}>
                        <span className="flex items-center gap-1">
                          {getLevelIcon(progress.level)}
                          {progress.level}
                        </span>
                      </Badge>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-slate-400">Overall Accuracy</span>
                          <span className="text-foreground font-semibold">{progress.accuracy}%</span>
                        </div>
                        <Progress value={progress.accuracy} className="h-2" />
                      </div>

                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <div className="text-lg font-bold text-foreground">{progress.attempted}</div>
                          <div className="text-xs text-slate-400">Attempted</div>
                        </div>
                        <div>
                          <div className="text-lg font-bold text-green-400">{progress.correct}</div>
                          <div className="text-xs text-slate-400">Correct</div>
                        </div>
                        <div>
                          <div className="text-lg font-bold text-blue-400">{progress.timeSpent}m</div>
                          <div className="text-xs text-slate-400">Time Spent</div>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-slate-400">Confidence Level</span>
                          <span className="text-foreground">{progress.confidenceLevel}%</span>
                        </div>
                        <Progress value={progress.confidenceLevel} className="h-2" />
                      </div>

                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">
                          Current Streak: <span className="text-foreground">{progress.streakCount}</span>
                        </span>
                        <span className="text-slate-400">
                          Best Streak: <span className="text-foreground">{progress.bestStreak}</span>
                        </span>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>

            {userProgress.length === 0 && (
              <div className="text-center py-12">
                <Trophy className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">No Progress Yet</h3>
                <p className="text-slate-300 mb-4">Start practicing to see your progress here</p>
                <Button onClick={() => setActiveTab("practice")} className="btn-primary">
                  Start Practicing
                </Button>
              </div>
            )}
          </TabsContent>

          {/* Results Tab */}
          <TabsContent value="results" className="space-y-6">
            {practiceSession && !practiceSession.isActive ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <Card className="glass-card">
                  <CardHeader className="text-center">
                    <CardTitle className="text-2xl text-foreground">Session Complete!</CardTitle>
                    <CardDescription>Here's how you performed</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
                      <div className="space-y-2">
                        <div className="text-3xl font-bold text-green-400">
                          {
                            practiceSession.answers.filter(
                              (answer, index) => answer === practiceSession.questions[index].correctAnswer,
                            ).length
                          }
                        </div>
                        <div className="text-sm text-slate-400">Correct Answers</div>
                      </div>
                      <div className="space-y-2">
                        <div className="text-3xl font-bold text-blue-400">
                          {Math.round(
                            (practiceSession.answers.filter(
                              (answer, index) => answer === practiceSession.questions[index].correctAnswer,
                            ).length /
                              practiceSession.questions.length) *
                              100,
                          )}
                          %
                        </div>
                        <div className="text-sm text-slate-400">Accuracy</div>
                      </div>
                      <div className="space-y-2">
                        <div className="text-3xl font-bold text-purple-400">{formatTime(sessionTimer)}</div>
                        <div className="text-sm text-slate-400">Total Time</div>
                      </div>
                      <div className="space-y-2">
                        <div className="text-3xl font-bold text-yellow-400">
                          {formatTime(
                            Math.round(
                              practiceSession.timePerQuestion.reduce((a, b) => a + b, 0) /
                                practiceSession.questions.length,
                            ),
                          )}
                        </div>
                        <div className="text-sm text-slate-400">Avg Time/Question</div>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-foreground">Question Review</h3>
                      {practiceSession.questions.map((question, index) => (
                        <div key={index} className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                          <div className="flex items-start justify-between mb-2">
                            <span className="text-sm text-slate-400">Question {index + 1}</span>
                            <div className="flex items-center gap-2">
                              {practiceSession.answers[index] === question.correctAnswer ? (
                                <CheckCircle className="w-4 h-4 text-green-500" />
                              ) : (
                                <XCircle className="w-4 h-4 text-red-500" />
                              )}
                              <span className="text-xs text-slate-400">
                                {formatTime(practiceSession.timePerQuestion[index] || 0)}
                              </span>
                            </div>
                          </div>
                          <p className="text-foreground text-sm mb-2">{question.question}</p>
                          <div className="text-xs text-slate-400">
                            Your answer:{" "}
                            <span
                              className={
                                practiceSession.answers[index] === question.correctAnswer
                                  ? "text-green-400"
                                  : "text-red-400"
                              }
                            >
                              {practiceSession.answers[index] !== null
                                ? question.options[practiceSession.answers[index]]
                                : "Not answered"}
                            </span>
                          </div>
                          {practiceSession.answers[index] !== question.correctAnswer && (
                            <div className="text-xs text-green-400">
                              Correct answer: {question.options[question.correctAnswer]}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    <div className="flex gap-4">
                      <Button
                        onClick={() => {
                          setPracticeSession(null)
                          setActiveTab("practice")
                        }}
                        className="btn-primary flex-1"
                      >
                        <RotateCcw className="w-4 h-4 mr-2" />
                        Practice Again
                      </Button>
                      <Button onClick={() => setActiveTab("overview")} variant="outline" className="flex-1">
                        Back to Overview
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ) : (
              <div className="text-center py-12">
                <Target className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">No Results Yet</h3>
                <p className="text-slate-300">Complete a practice session to see your results</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
