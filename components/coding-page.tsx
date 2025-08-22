"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import {
  Code,
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
  Terminal,
  FileCode,
  Cpu,
  Eye,
  EyeOff,
} from "lucide-react"
import {
  EnhancedCodingService,
  ENHANCED_CODING_TOPICS,
  type EnhancedCodingTopic,
  type UserCodingProgress,
} from "@/lib/enhanced-coding-data"
import type { CodingQuestionTemplate } from "@/lib/ai-question-generator"
import { EnhancedBackground } from "@/components/enhanced-background"

interface CodingSession {
  questions: CodingQuestionTemplate[]
  currentQuestionIndex: number
  submissions: (string | null)[]
  results: (boolean | null)[]
  startTime: Date
  timePerQuestion: number[]
  isActive: boolean
  topic: string
  difficulty: "easy" | "medium" | "hard"
  language: string
}

const LANGUAGE_CONFIGS = {
  javascript: {
    name: "JavaScript",
    icon: "🟨",
    extension: "js",
    template:
      "// Your solution here\nfunction solution() {\n    \n}\n\n// Test your solution\nconsole.log(solution());",
  },
  python: {
    name: "Python",
    icon: "🐍",
    extension: "py",
    template: "# Your solution here\ndef solution():\n    pass\n\n# Test your solution\nprint(solution())",
  },
  cpp: {
    name: "C++",
    icon: "⚡",
    extension: "cpp",
    template:
      "#include <iostream>\n#include <vector>\nusing namespace std;\n\n// Your solution here\nint main() {\n    \n    return 0;\n}",
  },
  java: {
    name: "Java",
    icon: "☕",
    extension: "java",
    template:
      "public class Solution {\n    // Your solution here\n    public static void main(String[] args) {\n        \n    }\n}",
  },
}

export function CodingPage() {
  const [activeTab, setActiveTab] = useState("overview")
  const [selectedTopic, setSelectedTopic] = useState<EnhancedCodingTopic | null>(null)
  const [selectedConcept, setSelectedConcept] = useState<string | null>(null)
  const [codingSession, setCodingSession] = useState<CodingSession | null>(null)
  const [userProgress, setUserProgress] = useState<UserCodingProgress[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [difficultyFilter, setDifficultyFilter] = useState("all")
  const [languageFilter, setLanguageFilter] = useState("all")
  const [sessionTimer, setSessionTimer] = useState(0)
  const [questionTimer, setQuestionTimer] = useState(0)
  const [currentCode, setCurrentCode] = useState("")
  const [selectedLanguage, setSelectedLanguage] = useState("javascript")
  const [showHints, setShowHints] = useState(false)
  const [showSolution, setShowSolution] = useState(false)
  const [testResults, setTestResults] = useState<
    { passed: boolean; input: string; expected: string; actual: string }[]
  >([])
  const [isRunning, setIsRunning] = useState(false)

  // Timer effects
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (codingSession?.isActive) {
      interval = setInterval(() => {
        setSessionTimer((prev) => prev + 1)
        setQuestionTimer((prev) => prev + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [codingSession?.isActive])

  // Load user progress from localStorage
  useEffect(() => {
    const savedProgress = localStorage.getItem("coding-progress")
    if (savedProgress) {
      setUserProgress(JSON.parse(savedProgress))
    }
  }, [])

  // Save progress to localStorage
  const saveProgress = (progress: UserCodingProgress[]) => {
    setUserProgress(progress)
    localStorage.setItem("coding-progress", JSON.stringify(progress))
  }

  // Initialize code when question changes
  useEffect(() => {
    if (codingSession && codingSession.questions && codingSession.questions[codingSession.currentQuestionIndex]) {
      const question = codingSession.questions[codingSession.currentQuestionIndex]
      const starterCode =
        question.starterCode[selectedLanguage] ||
        LANGUAGE_CONFIGS[selectedLanguage as keyof typeof LANGUAGE_CONFIGS].template
      setCurrentCode(starterCode)
      setShowHints(false)
      setShowSolution(false)
      setTestResults([])
    }
  }, [codingSession, codingSession?.currentQuestionIndex, selectedLanguage])

  const filteredTopics = ENHANCED_CODING_TOPICS.filter((topic) => {
    const matchesSearch =
      topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      topic.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesDifficulty = difficultyFilter === "all" || topic.difficulty_levels.includes(difficultyFilter)
    const matchesLanguage = languageFilter === "all" || topic.languages.includes(languageFilter)
    return matchesSearch && matchesDifficulty && matchesLanguage
  })

  const startCodingSession = (
    topic: string,
    difficulty: "easy" | "medium" | "hard",
    questionCount: number,
    language: string,
  ) => {
    try {
      const questions = EnhancedCodingService.generatePracticeSession(topic, difficulty, questionCount)
      if (questions.length === 0) {
        alert("No questions available for this topic and difficulty. Please try a different combination.")
        return
      }

      setCodingSession({
        questions,
        currentQuestionIndex: 0,
        submissions: new Array(questions.length).fill(null),
        results: new Array(questions.length).fill(null),
        startTime: new Date(),
        timePerQuestion: [],
        isActive: true,
        topic,
        difficulty,
        language,
      })
      setSelectedLanguage(language)
      setSessionTimer(0)
      setQuestionTimer(0)
      setActiveTab("practice")
    } catch (error) {
      console.error("Failed to start coding session:", error)
      alert("Failed to generate questions. Please try again.")
    }
  }

  const runCode = async () => {
    if (!codingSession) return

    setIsRunning(true)
    const question = codingSession.questions[codingSession.currentQuestionIndex]

    // Simulate code execution with test cases
    const results = question.testCases.map((testCase) => {
      // This is a mock implementation - in a real app, you'd send code to a backend for execution
      const mockResult = Math.random() > 0.3 // 70% chance of passing for demo
      return {
        passed: mockResult,
        input: testCase.input,
        expected: testCase.expectedOutput,
        actual: mockResult ? testCase.expectedOutput : "Different output",
      }
    })

    // Simulate execution delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setTestResults(results)
    setIsRunning(false)

    // Update session with results
    const allPassed = results.every((r) => r.passed)
    const updatedSubmissions = [...codingSession.submissions]
    const updatedResults = [...codingSession.results]
    const updatedTimePerQuestion = [...codingSession.timePerQuestion]

    updatedSubmissions[codingSession.currentQuestionIndex] = currentCode
    updatedResults[codingSession.currentQuestionIndex] = allPassed
    updatedTimePerQuestion[codingSession.currentQuestionIndex] = questionTimer

    setCodingSession({
      ...codingSession,
      submissions: updatedSubmissions,
      results: updatedResults,
      timePerQuestion: updatedTimePerQuestion,
    })
  }

  const nextQuestion = () => {
    if (!codingSession) return

    if (codingSession.currentQuestionIndex < codingSession.questions.length - 1) {
      setCodingSession({
        ...codingSession,
        currentQuestionIndex: codingSession.currentQuestionIndex + 1,
      })
      setQuestionTimer(0)
    } else {
      finishSession()
    }
  }

  const previousQuestion = () => {
    if (!codingSession) return

    if (codingSession.currentQuestionIndex > 0) {
      setCodingSession({
        ...codingSession,
        currentQuestionIndex: codingSession.currentQuestionIndex - 1,
      })
      setQuestionTimer(0)
    }
  }

  const finishSession = () => {
    if (!codingSession) return

    const correctSolutions = codingSession.results.filter((result) => result === true).length
    const accuracy = Math.round((correctSolutions / codingSession.questions.length) * 100)
    const avgTime = codingSession.timePerQuestion.reduce((a, b) => a + b, 0) / codingSession.questions.length

    // Update user progress
    const progressKey = `${codingSession.topic}-${codingSession.language}`
    const existingProgressIndex = userProgress.findIndex(
      (p) => p.topic === codingSession.topic && p.language === codingSession.language,
    )
    const updatedProgress = [...userProgress]

    if (existingProgressIndex >= 0) {
      const existing = updatedProgress[existingProgressIndex]
      updatedProgress[existingProgressIndex] = {
        ...existing,
        attempted: existing.attempted + codingSession.questions.length,
        correct: existing.correct + correctSolutions,
        accuracy: Math.round(
          ((existing.correct + correctSolutions) / (existing.attempted + codingSession.questions.length)) * 100,
        ),
        lastPracticed: new Date(),
        timeSpent: existing.timeSpent + Math.round(sessionTimer / 60),
        level: EnhancedCodingService.calculateLevel(accuracy, existing.attempted + codingSession.questions.length),
        averageTimePerProblem:
          (existing.averageTimePerProblem * existing.attempted + avgTime * codingSession.questions.length) /
          (existing.attempted + codingSession.questions.length),
        streakCount: accuracy >= 70 ? existing.streakCount + 1 : 0,
        bestStreak: Math.max(existing.bestStreak, accuracy >= 70 ? existing.streakCount + 1 : 0),
        skillPoints:
          existing.skillPoints +
          EnhancedCodingService.calculateSkillPoints(codingSession.difficulty, avgTime / 120, accuracy / 100),
      }
    } else {
      updatedProgress.push({
        userId: "current-user",
        topic: codingSession.topic,
        language: codingSession.language,
        attempted: codingSession.questions.length,
        correct: correctSolutions,
        accuracy,
        level: EnhancedCodingService.calculateLevel(accuracy, codingSession.questions.length),
        lastPracticed: new Date(),
        timeSpent: Math.round(sessionTimer / 60),
        difficultyBreakdown: {
          easy:
            codingSession.difficulty === "easy"
              ? { attempted: codingSession.questions.length, correct: correctSolutions }
              : { attempted: 0, correct: 0 },
          medium:
            codingSession.difficulty === "medium"
              ? { attempted: codingSession.questions.length, correct: correctSolutions }
              : { attempted: 0, correct: 0 },
          hard:
            codingSession.difficulty === "hard"
              ? { attempted: codingSession.questions.length, correct: correctSolutions }
              : { attempted: 0, correct: 0 },
        },
        averageTimePerProblem: avgTime / 60,
        streakCount: accuracy >= 70 ? 1 : 0,
        bestStreak: accuracy >= 70 ? 1 : 0,
        skillPoints: EnhancedCodingService.calculateSkillPoints(
          codingSession.difficulty,
          avgTime / 120,
          accuracy / 100,
        ),
      })
    }

    saveProgress(updatedProgress)
    setCodingSession({ ...codingSession, isActive: false })
    setActiveTab("results")
  }

  const getTopicProgress = (topicId: string, language: string): UserCodingProgress | null => {
    return userProgress.find((p) => p.topic === topicId && p.language === language) || null
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
      case "Advanced":
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
      case "Advanced":
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
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
            Coding Excellence
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Master programming concepts with hands-on coding practice, comprehensive learning materials, and intelligent
            skill assessment
          </p>
        </motion.div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 glass-card mb-8">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <Code className="w-4 h-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="learn" className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Learn
            </TabsTrigger>
            <TabsTrigger value="practice" className="flex items-center gap-2">
              <Terminal className="w-4 h-4" />
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
                <Code className="w-12 h-12 text-green-400 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-foreground mb-2">{ENHANCED_CODING_TOPICS.length}</h3>
                <p className="text-slate-300">Topics Available</p>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05 }} className="glass-card p-6 text-center">
                <Target className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-foreground mb-2">
                  {userProgress.reduce((sum, p) => sum + p.attempted, 0)}
                </h3>
                <p className="text-slate-300">Problems Attempted</p>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05 }} className="glass-card p-6 text-center">
                <Trophy className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-foreground mb-2">
                  {userProgress.reduce((sum, p) => sum + p.correct, 0)}
                </h3>
                <p className="text-slate-300">Problems Solved</p>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05 }} className="glass-card p-6 text-center">
                <Zap className="w-12 h-12 text-purple-400 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-foreground mb-2">
                  {userProgress.reduce((sum, p) => sum + p.skillPoints, 0)}
                </h3>
                <p className="text-slate-300">Skill Points</p>
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
              <Select value={languageFilter} onValueChange={setLanguageFilter}>
                <SelectTrigger className="w-full md:w-48 glass-input">
                  <Code className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Filter by language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Languages</SelectItem>
                  <SelectItem value="javascript">JavaScript</SelectItem>
                  <SelectItem value="python">Python</SelectItem>
                  <SelectItem value="cpp">C++</SelectItem>
                  <SelectItem value="java">Java</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Topics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTopics.map((topic, index) => (
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
                    <div className="flex gap-1">
                      {topic.languages.slice(0, 3).map((lang) => (
                        <Badge key={lang} variant="outline" className="text-xs">
                          {LANGUAGE_CONFIGS[lang as keyof typeof LANGUAGE_CONFIGS]?.icon}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-foreground mb-2">{topic.title}</h3>
                  <p className="text-slate-300 text-sm mb-4">{topic.description}</p>

                  {/* Show progress for each language */}
                  <div className="space-y-2">
                    {topic.languages.slice(0, 2).map((lang) => {
                      const progress = getTopicProgress(topic.id, lang)
                      return progress ? (
                        <div key={lang} className="flex items-center justify-between text-xs">
                          <span className="text-slate-400 flex items-center gap-1">
                            {LANGUAGE_CONFIGS[lang as keyof typeof LANGUAGE_CONFIGS]?.icon}
                            {LANGUAGE_CONFIGS[lang as keyof typeof LANGUAGE_CONFIGS]?.name}
                          </span>
                          <Badge
                            variant="secondary"
                            className={`${getLevelColor(progress.level)} bg-opacity-20 text-xs`}
                          >
                            {progress.level}
                          </Badge>
                        </div>
                      ) : null
                    })}
                  </div>

                  <div className="flex flex-wrap gap-1 mt-4">
                    {topic.difficulty_levels.map((level) => (
                      <Badge key={level} variant="outline" className="text-xs">
                        {level}
                      </Badge>
                    ))}
                  </div>

                  {topic.prerequisites.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-slate-700">
                      <p className="text-xs text-slate-400 mb-1">Prerequisites:</p>
                      <div className="flex flex-wrap gap-1">
                        {topic.prerequisites.map((prereq) => (
                          <Badge key={prereq} variant="secondary" className="text-xs">
                            {prereq}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
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

                {/* Concepts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Concepts List */}
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-foreground mb-4">Concepts</h3>
                    {selectedTopic.concepts.map((concept, index) => (
                      <motion.div
                        key={concept.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`p-4 rounded-lg border cursor-pointer transition-all ${
                          selectedConcept === concept.id
                            ? "bg-blue-500/20 border-blue-500"
                            : "bg-slate-800/50 border-slate-700 hover:bg-slate-700/50"
                        }`}
                        onClick={() => setSelectedConcept(concept.id)}
                      >
                        <h4 className="font-semibold text-foreground mb-2">{concept.title}</h4>
                        <p className="text-slate-300 text-sm">{concept.description}</p>
                        {concept.timeComplexity && (
                          <div className="mt-2 flex gap-2">
                            <Badge variant="outline" className="text-xs">
                              Time: {concept.timeComplexity}
                            </Badge>
                            {concept.spaceComplexity && (
                              <Badge variant="outline" className="text-xs">
                                Space: {concept.spaceComplexity}
                              </Badge>
                            )}
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>

                  {/* Concept Details */}
                  <div className="lg:col-span-2">
                    {selectedConcept ? (
                      <motion.div
                        key={selectedConcept}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6"
                      >
                        {(() => {
                          const concept = selectedTopic.concepts.find((c) => c.id === selectedConcept)
                          if (!concept) return null

                          return (
                            <>
                              <Card className="glass-card">
                                <CardHeader>
                                  <CardTitle className="text-foreground">{concept.title}</CardTitle>
                                  <CardDescription>{concept.description}</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                  <div>
                                    <h5 className="font-semibold text-foreground mb-2">Explanation</h5>
                                    <p className="text-slate-300">{concept.explanation}</p>
                                  </div>

                                  {concept.applications.length > 0 && (
                                    <div>
                                      <h5 className="font-semibold text-foreground mb-2">Applications</h5>
                                      <ul className="list-disc list-inside text-slate-300 space-y-1">
                                        {concept.applications.map((app, index) => (
                                          <li key={index} className="text-sm">
                                            {app}
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}

                                  {(concept.timeComplexity || concept.spaceComplexity) && (
                                    <div className="flex gap-4">
                                      {concept.timeComplexity && (
                                        <div>
                                          <span className="text-sm text-slate-400">Time Complexity: </span>
                                          <Badge variant="outline">{concept.timeComplexity}</Badge>
                                        </div>
                                      )}
                                      {concept.spaceComplexity && (
                                        <div>
                                          <span className="text-sm text-slate-400">Space Complexity: </span>
                                          <Badge variant="outline">{concept.spaceComplexity}</Badge>
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </CardContent>
                              </Card>

                              {/* Code Examples */}
                              <Card className="glass-card">
                                <CardHeader>
                                  <CardTitle className="flex items-center gap-2 text-foreground">
                                    <FileCode className="w-5 h-5 text-green-400" />
                                    Code Examples
                                  </CardTitle>
                                </CardHeader>
                                <CardContent>
                                  <Tabs defaultValue={Object.keys(concept.codeExamples)[0]} className="w-full">
                                    <TabsList className="grid w-full grid-cols-4">
                                      {Object.entries(concept.codeExamples).map(([lang, _]) => (
                                        <TabsTrigger key={lang} value={lang} className="flex items-center gap-2">
                                          <span>{LANGUAGE_CONFIGS[lang as keyof typeof LANGUAGE_CONFIGS]?.icon}</span>
                                          <span className="hidden sm:inline">
                                            {LANGUAGE_CONFIGS[lang as keyof typeof LANGUAGE_CONFIGS]?.name}
                                          </span>
                                        </TabsTrigger>
                                      ))}
                                    </TabsList>
                                    {Object.entries(concept.codeExamples).map(([lang, example]) => (
                                      <TabsContent key={lang} value={lang} className="space-y-4">
                                        <div>
                                          <pre className="bg-slate-900/50 p-4 rounded-lg overflow-x-auto text-sm">
                                            <code className="text-green-300">{example.code}</code>
                                          </pre>
                                        </div>
                                        <div>
                                          <h6 className="font-semibold text-foreground mb-2">Explanation:</h6>
                                          <p className="text-slate-300 text-sm">{example.explanation}</p>
                                        </div>
                                        {example.output && (
                                          <div>
                                            <h6 className="font-semibold text-foreground mb-2">Output:</h6>
                                            <pre className="bg-slate-800/50 p-3 rounded text-sm text-blue-300">
                                              {example.output}
                                            </pre>
                                          </div>
                                        )}
                                      </TabsContent>
                                    ))}
                                  </Tabs>
                                </CardContent>
                              </Card>
                            </>
                          )
                        })()}
                      </motion.div>
                    ) : (
                      <div className="text-center py-12">
                        <BookOpen className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-foreground mb-2">Select a Concept</h3>
                        <p className="text-slate-300">
                          Choose a concept from the left to view detailed explanations and code examples
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Practice Button */}
                <div className="text-center">
                  <Button onClick={() => setActiveTab("practice")} className="btn-primary text-lg px-8 py-3">
                    <Terminal className="w-5 h-5 mr-2" />
                    Start Coding Practice
                  </Button>
                </div>
              </motion.div>
            ) : (
              <div className="text-center py-12">
                <Code className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">Select a Topic to Learn</h3>
                <p className="text-slate-300">Choose a topic from the overview to access learning materials</p>
              </div>
            )}
          </TabsContent>

          {/* Practice Tab */}
          <TabsContent value="practice" className="space-y-6">
            {!codingSession ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle className="text-foreground">Start Coding Session</CardTitle>
                    <CardDescription>Configure your coding practice session</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="topic-select" className="text-foreground">
                          Topic
                        </Label>
                        <Select
                          onValueChange={(value) =>
                            setSelectedTopic(ENHANCED_CODING_TOPICS.find((t) => t.id === value) || null)
                          }
                        >
                          <SelectTrigger id="topic-select" className="glass-input">
                            <SelectValue placeholder="Select a topic" />
                          </SelectTrigger>
                          <SelectContent>
                            {ENHANCED_CODING_TOPICS.map((topic) => (
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
                        <Label htmlFor="language-select" className="text-foreground">
                          Language
                        </Label>
                        <Select defaultValue="javascript">
                          <SelectTrigger id="language-select" className="glass-input">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.entries(LANGUAGE_CONFIGS).map(([key, config]) => (
                              <SelectItem key={key} value={key}>
                                {config.icon} {config.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="question-count" className="text-foreground">
                          Problems
                        </Label>
                        <Select defaultValue="3">
                          <SelectTrigger id="question-count" className="glass-input">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">1 Problem</SelectItem>
                            <SelectItem value="3">3 Problems</SelectItem>
                            <SelectItem value="5">5 Problems</SelectItem>
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
                        const language = (document.getElementById("language-select") as any)?.value || "javascript"
                        const questionCount = Number.parseInt(
                          (document.getElementById("question-count") as any)?.value || "3",
                        )
                        startCodingSession(selectedTopic.id, difficulty, questionCount, language)
                      }}
                      className="btn-primary w-full"
                      disabled={!selectedTopic}
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Start Coding Session
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
                      Problem {codingSession.currentQuestionIndex + 1} of {codingSession.questions.length}
                    </Badge>
                    <Badge variant="outline">{codingSession.difficulty.toUpperCase()}</Badge>
                    <Badge variant="outline">
                      {LANGUAGE_CONFIGS[selectedLanguage as keyof typeof LANGUAGE_CONFIGS]?.icon}{" "}
                      {LANGUAGE_CONFIGS[selectedLanguage as keyof typeof LANGUAGE_CONFIGS]?.name}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-slate-300">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>Session: {formatTime(sessionTimer)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Target className="w-4 h-4" />
                      <span>Problem: {formatTime(questionTimer)}</span>
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="glass-card p-4">
                  <Progress
                    value={((codingSession.currentQuestionIndex + 1) / codingSession.questions.length) * 100}
                    className="h-2"
                  />
                </div>

                {/* Current Problem */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Problem Description */}
                  <Card className="glass-card">
                    <CardHeader>
                      <CardTitle className="text-foreground">
                        {codingSession.questions[codingSession.currentQuestionIndex].title}
                      </CardTitle>
                      <div className="flex gap-2">
                        <Badge
                          variant={
                            codingSession.questions[codingSession.currentQuestionIndex].difficulty === "easy"
                              ? "default"
                              : codingSession.questions[codingSession.currentQuestionIndex].difficulty === "medium"
                                ? "secondary"
                                : "destructive"
                          }
                        >
                          {codingSession.questions[codingSession.currentQuestionIndex].difficulty}
                        </Badge>
                        {codingSession.questions[codingSession.currentQuestionIndex].tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-foreground mb-2">Description</h4>
                        <p className="text-slate-300 text-sm">
                          {codingSession.questions[codingSession.currentQuestionIndex].description}
                        </p>
                      </div>

                      <div>
                        <h4 className="font-semibold text-foreground mb-2">Examples</h4>
                        {codingSession.questions[codingSession.currentQuestionIndex].examples.map((example, index) => (
                          <div key={index} className="bg-slate-800/50 p-3 rounded mb-2">
                            <div className="text-sm">
                              <div className="text-slate-400">
                                Input: <span className="text-blue-300 font-mono">{example.input}</span>
                              </div>
                              <div className="text-slate-400">
                                Output: <span className="text-green-300 font-mono">{example.output}</span>
                              </div>
                              {example.explanation && (
                                <div className="text-slate-400 mt-1">
                                  Explanation: <span className="text-slate-300">{example.explanation}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>

                      <div>
                        <h4 className="font-semibold text-foreground mb-2">Constraints</h4>
                        <ul className="list-disc list-inside text-slate-300 text-sm space-y-1">
                          {codingSession.questions[codingSession.currentQuestionIndex].constraints.map(
                            (constraint, index) => (
                              <li key={index}>{constraint}</li>
                            ),
                          )}
                        </ul>
                      </div>

                      {/* Hints and Solution */}
                      <div className="space-y-2">
                        <div className="flex gap-2">
                          <Button
                            onClick={() => setShowHints(!showHints)}
                            variant="outline"
                            size="sm"
                            className="flex items-center gap-2"
                          >
                            {showHints ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            {showHints ? "Hide" : "Show"} Hints
                          </Button>
                          <Button
                            onClick={() => setShowSolution(!showSolution)}
                            variant="outline"
                            size="sm"
                            className="flex items-center gap-2"
                          >
                            {showSolution ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            {showSolution ? "Hide" : "Show"} Solution
                          </Button>
                        </div>

                        {showHints && (
                          <div className="bg-yellow-500/10 border border-yellow-500/20 p-3 rounded">
                            <h5 className="font-semibold text-yellow-400 mb-2 flex items-center gap-2">
                              <Lightbulb className="w-4 h-4" />
                              Hints
                            </h5>
                            <ul className="list-disc list-inside text-slate-300 text-sm space-y-1">
                              {codingSession.questions[codingSession.currentQuestionIndex].hints.map((hint, index) => (
                                <li key={index}>{hint}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {showSolution && (
                          <div className="bg-green-500/10 border border-green-500/20 p-3 rounded">
                            <h5 className="font-semibold text-green-400 mb-2">Solution</h5>
                            <pre className="bg-slate-900/50 p-3 rounded overflow-x-auto text-sm">
                              <code className="text-green-300">
                                {codingSession.questions[codingSession.currentQuestionIndex].solution[
                                  selectedLanguage
                                ] || "Solution not available for this language"}
                              </code>
                            </pre>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Code Editor */}
                  <Card className="glass-card">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-foreground flex items-center gap-2">
                          <Terminal className="w-5 h-5" />
                          Code Editor
                        </CardTitle>
                        <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                          <SelectTrigger className="w-40 glass-input">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.entries(LANGUAGE_CONFIGS).map(([key, config]) => (
                              <SelectItem key={key} value={key}>
                                {config.icon} {config.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <Textarea
                        value={currentCode}
                        onChange={(e) => setCurrentCode(e.target.value)}
                        className="font-mono text-sm min-h-[300px] bg-slate-900/50 border-slate-600 text-green-300"
                        placeholder="Write your solution here..."
                      />

                      <div className="flex gap-2">
                        <Button onClick={runCode} disabled={isRunning} className="btn-primary flex items-center gap-2">
                          {isRunning ? (
                            <>
                              <Cpu className="w-4 h-4 animate-spin" />
                              Running...
                            </>
                          ) : (
                            <>
                              <Play className="w-4 h-4" />
                              Run Code
                            </>
                          )}
                        </Button>
                      </div>

                      {/* Test Results */}
                      {testResults.length > 0 && (
                        <div className="space-y-2">
                          <h4 className="font-semibold text-foreground">Test Results</h4>
                          {testResults.map((result, index) => (
                            <div
                              key={index}
                              className={`p-3 rounded border ${
                                result.passed
                                  ? "bg-green-500/10 border-green-500/20"
                                  : "bg-red-500/10 border-red-500/20"
                              }`}
                            >
                              <div className="flex items-center gap-2 mb-2">
                                {result.passed ? (
                                  <CheckCircle className="w-4 h-4 text-green-500" />
                                ) : (
                                  <XCircle className="w-4 h-4 text-red-500" />
                                )}
                                <span
                                  className={`text-sm font-semibold ${result.passed ? "text-green-400" : "text-red-400"}`}
                                >
                                  Test Case {index + 1} {result.passed ? "Passed" : "Failed"}
                                </span>
                              </div>
                              <div className="text-xs text-slate-400 space-y-1">
                                <div>
                                  Input: <span className="text-blue-300 font-mono">{result.input}</span>
                                </div>
                                <div>
                                  Expected: <span className="text-green-300 font-mono">{result.expected}</span>
                                </div>
                                {!result.passed && (
                                  <div>
                                    Actual: <span className="text-red-300 font-mono">{result.actual}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Navigation */}
                      <div className="flex justify-between pt-4">
                        <Button
                          onClick={previousQuestion}
                          disabled={codingSession.currentQuestionIndex === 0}
                          variant="outline"
                          className="flex items-center gap-2 bg-transparent"
                        >
                          <ArrowLeft className="w-4 h-4" />
                          Previous
                        </Button>

                        <Button onClick={nextQuestion} className="btn-primary flex items-center gap-2">
                          {codingSession.currentQuestionIndex === codingSession.questions.length - 1
                            ? "Finish"
                            : "Next"}
                          <ArrowRight className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </motion.div>
            )}
          </TabsContent>

          {/* Progress Tab */}
          <TabsContent value="progress" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {userProgress.map((progress, index) => {
                const topic = ENHANCED_CODING_TOPICS.find((t) => t.id === progress.topic)
                const langConfig = LANGUAGE_CONFIGS[progress.language as keyof typeof LANGUAGE_CONFIGS]
                if (!topic || !langConfig) return null

                return (
                  <motion.div
                    key={`${progress.topic}-${progress.language}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="glass-card p-6"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">{topic.icon}</div>
                        <div>
                          <h3 className="font-semibold text-foreground flex items-center gap-2">
                            {topic.title}
                            <span className="text-lg">{langConfig.icon}</span>
                          </h3>
                          <p className="text-sm text-slate-400">
                            {langConfig.name} • Last practiced: {new Date(progress.lastPracticed).toLocaleDateString()}
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
                          <span className="text-slate-400">Success Rate</span>
                          <span className="text-foreground font-semibold">{progress.accuracy}%</span>
                        </div>
                        <Progress value={progress.accuracy} className="h-2" />
                      </div>

                      <div className="grid grid-cols-4 gap-4 text-center">
                        <div>
                          <div className="text-lg font-bold text-foreground">{progress.attempted}</div>
                          <div className="text-xs text-slate-400">Attempted</div>
                        </div>
                        <div>
                          <div className="text-lg font-bold text-green-400">{progress.correct}</div>
                          <div className="text-xs text-slate-400">Solved</div>
                        </div>
                        <div>
                          <div className="text-lg font-bold text-blue-400">{progress.timeSpent}m</div>
                          <div className="text-xs text-slate-400">Time</div>
                        </div>
                        <div>
                          <div className="text-lg font-bold text-purple-400">{progress.skillPoints}</div>
                          <div className="text-xs text-slate-400">Points</div>
                        </div>
                      </div>

                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">
                          Streak: <span className="text-foreground">{progress.streakCount}</span>
                        </span>
                        <span className="text-slate-400">
                          Best: <span className="text-foreground">{progress.bestStreak}</span>
                        </span>
                      </div>

                      <div className="text-sm text-slate-400">
                        Avg time per problem:{" "}
                        <span className="text-foreground">{Math.round(progress.averageTimePerProblem)}m</span>
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
                <p className="text-slate-300 mb-4">Start coding to see your progress here</p>
                <Button onClick={() => setActiveTab("practice")} className="btn-primary">
                  Start Coding
                </Button>
              </div>
            )}
          </TabsContent>

          {/* Results Tab */}
          <TabsContent value="results" className="space-y-6">
            {codingSession && !codingSession.isActive ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <Card className="glass-card">
                  <CardHeader className="text-center">
                    <CardTitle className="text-2xl text-foreground">Coding Session Complete!</CardTitle>
                    <CardDescription>Here's your performance summary</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
                      <div className="space-y-2">
                        <div className="text-3xl font-bold text-green-400">
                          {codingSession.results.filter((result) => result === true).length}
                        </div>
                        <div className="text-sm text-slate-400">Problems Solved</div>
                      </div>
                      <div className="space-y-2">
                        <div className="text-3xl font-bold text-blue-400">
                          {Math.round(
                            (codingSession.results.filter((result) => result === true).length /
                              codingSession.questions.length) *
                              100,
                          )}
                          %
                        </div>
                        <div className="text-sm text-slate-400">Success Rate</div>
                      </div>
                      <div className="space-y-2">
                        <div className="text-3xl font-bold text-purple-400">{formatTime(sessionTimer)}</div>
                        <div className="text-sm text-slate-400">Total Time</div>
                      </div>
                      <div className="space-y-2">
                        <div className="text-3xl font-bold text-yellow-400">
                          {EnhancedCodingService.calculateSkillPoints(
                            codingSession.difficulty,
                            codingSession.timePerQuestion.reduce((a, b) => a + b, 0) /
                              codingSession.questions.length /
                              120,
                            codingSession.results.filter((result) => result === true).length /
                              codingSession.questions.length,
                          )}
                        </div>
                        <div className="text-sm text-slate-400">Skill Points Earned</div>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-foreground">Problem Review</h3>
                      {codingSession.questions.map((question, index) => (
                        <div key={index} className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <span className="text-sm text-slate-400">Problem {index + 1}</span>
                              <h4 className="font-semibold text-foreground">{question.title}</h4>
                            </div>
                            <div className="flex items-center gap-2">
                              {codingSession.results[index] ? (
                                <CheckCircle className="w-4 h-4 text-green-500" />
                              ) : (
                                <XCircle className="w-4 h-4 text-red-500" />
                              )}
                              <span className="text-xs text-slate-400">
                                {formatTime(codingSession.timePerQuestion[index] || 0)}
                              </span>
                            </div>
                          </div>
                          <div className="text-xs text-slate-400">
                            Status:{" "}
                            <span className={codingSession.results[index] ? "text-green-400" : "text-red-400"}>
                              {codingSession.results[index] ? "Solved" : "Not solved"}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex gap-4">
                      <Button
                        onClick={() => {
                          setCodingSession(null)
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
                <Terminal className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">No Results Yet</h3>
                <p className="text-slate-300">Complete a coding session to see your results</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
