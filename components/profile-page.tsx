"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Brain,
  Code,
  Video,
  Trophy,
  Clock,
  Target,
  TrendingUp,
  Award,
  Star,
  Zap,
  Calendar,
  BarChart3,
  PieChart,
  Activity,
  Flame,
  Medal,
  BookOpen,
} from "lucide-react"
import { EnhancedBackground } from "@/components/enhanced-background"
import { ENHANCED_APTITUDE_TOPICS } from "@/lib/enhanced-aptitude-data"
import { ENHANCED_CODING_TOPICS } from "@/lib/enhanced-coding-data"

interface UserStats {
  aptitude: {
    totalAttempted: number
    totalCorrect: number
    overallAccuracy: number
    timeSpent: number
    topicsCompleted: number
    currentStreak: number
    bestStreak: number
  }
  coding: {
    totalAttempted: number
    totalSolved: number
    overallAccuracy: number
    timeSpent: number
    skillPoints: number
    languagesUsed: number
    currentStreak: number
    bestStreak: number
  }
  interviews: {
    totalSessions: number
    averageScore: number
    timeSpent: number
    improvementRate: number
  }
  resume: {
    lastScore: number
    skillsMatched: number
    jobsAnalyzed: number
  }
}

export function ProfilePage() {
  const { data: session } = useSession()
  const [userStats, setUserStats] = useState<UserStats>({
    aptitude: {
      totalAttempted: 0,
      totalCorrect: 0,
      overallAccuracy: 0,
      timeSpent: 0,
      topicsCompleted: 0,
      currentStreak: 0,
      bestStreak: 0,
    },
    coding: {
      totalAttempted: 0,
      totalSolved: 0,
      overallAccuracy: 0,
      timeSpent: 0,
      skillPoints: 0,
      languagesUsed: 0,
      currentStreak: 0,
      bestStreak: 0,
    },
    interviews: {
      totalSessions: 0,
      averageScore: 0,
      timeSpent: 0,
      improvementRate: 0,
    },
    resume: {
      lastScore: 0,
      skillsMatched: 0,
      jobsAnalyzed: 0,
    },
  })
  const [aptitudeProgress, setAptitudeProgress] = useState<any[]>([])
  const [codingProgress, setCodingProgress] = useState<any[]>([])
  const [recentActivity, setRecentActivity] = useState<any[]>([])

  useEffect(() => {
    // Load data from localStorage
    const aptitudeData = JSON.parse(localStorage.getItem("aptitude-progress") || "[]")
    const codingData = JSON.parse(localStorage.getItem("coding-progress") || "[]")
    const interviewData = JSON.parse(localStorage.getItem("interview-history") || "[]")
    const resumeData = JSON.parse(localStorage.getItem("resume-analysis") || "{}")

    setAptitudeProgress(aptitudeData)
    setCodingProgress(codingData)

    // Calculate stats
    const aptitudeStats = {
      totalAttempted: aptitudeData.reduce((sum: number, p: any) => sum + p.attempted, 0),
      totalCorrect: aptitudeData.reduce((sum: number, p: any) => sum + p.correct, 0),
      overallAccuracy:
        aptitudeData.length > 0
          ? Math.round(aptitudeData.reduce((sum: number, p: any) => sum + p.accuracy, 0) / aptitudeData.length)
          : 0,
      timeSpent: aptitudeData.reduce((sum: number, p: any) => sum + p.timeSpent, 0),
      topicsCompleted: aptitudeData.filter((p: any) => p.accuracy >= 70).length,
      currentStreak: Math.max(...aptitudeData.map((p: any) => p.streakCount), 0),
      bestStreak: Math.max(...aptitudeData.map((p: any) => p.bestStreak), 0),
    }

    const codingStats = {
      totalAttempted: codingData.reduce((sum: number, p: any) => sum + p.attempted, 0),
      totalSolved: codingData.reduce((sum: number, p: any) => sum + p.correct, 0),
      overallAccuracy:
        codingData.length > 0
          ? Math.round(codingData.reduce((sum: number, p: any) => sum + p.accuracy, 0) / codingData.length)
          : 0,
      timeSpent: codingData.reduce((sum: number, p: any) => sum + p.timeSpent, 0),
      skillPoints: codingData.reduce((sum: number, p: any) => sum + p.skillPoints, 0),
      languagesUsed: new Set(codingData.map((p: any) => p.language)).size,
      currentStreak: Math.max(...codingData.map((p: any) => p.streakCount), 0),
      bestStreak: Math.max(...codingData.map((p: any) => p.bestStreak), 0),
    }

    const interviewStats = {
      totalSessions: interviewData.length,
      averageScore:
        interviewData.length > 0
          ? Math.round(interviewData.reduce((sum: number, i: any) => sum + (i.score || 0), 0) / interviewData.length)
          : 0,
      timeSpent: interviewData.reduce((sum: number, i: any) => sum + (i.duration || 0), 0),
      improvementRate:
        interviewData.length > 1
          ? Math.round(
            (((interviewData[interviewData.length - 1]?.score || 0) - (interviewData[0]?.score || 0)) /
              (interviewData[0]?.score || 1)) *
            100,
          )
          : 0,
    }

    const resumeStats = {
      lastScore: resumeData.score || 0,
      skillsMatched: resumeData.skillsMatched || 0,
      jobsAnalyzed: resumeData.jobsAnalyzed || 0,
    }

    setUserStats({
      aptitude: aptitudeStats,
      coding: codingStats,
      interviews: interviewStats,
      resume: resumeStats,
    })

    // Generate recent activity
    const activities = [
      ...aptitudeData.map((p: any) => ({
        type: "aptitude",
        topic: p.topic,
        date: new Date(p.lastPracticed),
        score: p.accuracy,
        icon: Brain,
      })),
      ...codingData.map((p: any) => ({
        type: "coding",
        topic: p.topic,
        language: p.language,
        date: new Date(p.lastPracticed),
        score: p.accuracy,
        icon: Code,
      })),
      ...interviewData.map((i: any) => ({
        type: "interview",
        date: new Date(i.date),
        score: i.score,
        icon: Video,
      })),
    ]
      .sort((a, b) => b.date.getTime() - a.date.getTime())
      .slice(0, 10)

    setRecentActivity(activities)
  }, [])

  const getOverallLevel = (): string => {
    const totalScore =
      userStats.aptitude.overallAccuracy + userStats.coding.overallAccuracy + userStats.interviews.averageScore
    const avgScore = totalScore / 3

    if (avgScore >= 85) return "Expert"
    if (avgScore >= 70) return "Advanced"
    if (avgScore >= 50) return "Intermediate"
    return "Beginner"
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
        return <Award className="w-5 h-5" />
      case "Advanced":
        return <Star className="w-5 h-5" />
      case "Intermediate":
        return <TrendingUp className="w-5 h-5" />
      default:
        return <Zap className="w-5 h-5" />
    }
  }

  const getTopicName = (topicId: string, type: "aptitude" | "coding"): string => {
    if (type === "aptitude") {
      const topic = ENHANCED_APTITUDE_TOPICS.find((t) => t.id === topicId)
      return topic ? topic.title : topicId
    } else {
      const topic = ENHANCED_CODING_TOPICS.find((t) => t.id === topicId)
      return topic ? topic.title : topicId
    }
  }

  const overallLevel = getOverallLevel()
  const totalScore =
    userStats.aptitude.overallAccuracy + userStats.coding.overallAccuracy + userStats.interviews.averageScore
  const overallProgress = Math.round(totalScore / 3)

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(180deg, #050816 0%, #0a0a1e 100%)" }}>
      <EnhancedBackground />

      <div className="relative z-10 container mx-auto px-4 py-8 pt-24">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
          {/* Profile Header */}
          <Card className="glass-card">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <Avatar className="w-24 h-24">
                  <AvatarFallback
                    style={{
                      background: "linear-gradient(135deg, #00d4ff 0%, #a855f7 100%)",
                      color: "white",
                      fontWeight: "bold",
                      fontSize: "2rem",
                    }}
                  >
                    {session?.user?.name?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 text-center md:text-left">
                  <h1 className="text-3xl font-bold text-white mb-1">{session?.user?.name}</h1>
                  <p className="text-slate-400 mb-4">{session?.user?.email}</p>

                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                    <Badge
                      variant="secondary"
                      className={`${getLevelColor(overallLevel)} px-3 py-1`}
                      style={{ background: "rgba(0,212,255,0.1)", border: "1px solid rgba(0,212,255,0.3)" }}
                    >
                      <span className="flex items-center gap-2">
                        {getLevelIcon(overallLevel)}
                        {overallLevel} Level
                      </span>
                    </Badge>
                    <div className="flex items-center gap-2 text-slate-400 text-sm">
                      <Calendar className="w-4 h-4" />
                      <span>Active Member</span>
                    </div>
                  </div>
                </div>

                <div className="text-center">
                  <div className="text-3xl font-bold text-foreground mb-1">{overallProgress}%</div>
                  <div className="text-sm text-slate-400 mb-2">Overall Progress</div>
                  <Progress value={overallProgress} className="w-24 h-2" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <motion.div whileHover={{ scale: 1.05 }} className="glass-card p-4 text-center">
              <Brain className="w-8 h-8 text-blue-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-foreground">{userStats.aptitude.totalAttempted}</div>
              <div className="text-xs text-slate-400">Aptitude Questions</div>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} className="glass-card p-4 text-center">
              <Code className="w-8 h-8 text-green-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-foreground">{userStats.coding.totalSolved}</div>
              <div className="text-xs text-slate-400">Problems Solved</div>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} className="glass-card p-4 text-center">
              <Video className="w-8 h-8 text-purple-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-foreground">{userStats.interviews.totalSessions}</div>
              <div className="text-xs text-slate-400">Interview Sessions</div>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} className="glass-card p-4 text-center">
              <Zap className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-foreground">{userStats.coding.skillPoints}</div>
              <div className="text-xs text-slate-400">Skill Points</div>
            </motion.div>
          </div>

          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-5 glass-card">
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="aptitude" className="flex items-center gap-2">
                <Brain className="w-4 h-4" />
                Aptitude
              </TabsTrigger>
              <TabsTrigger value="coding" className="flex items-center gap-2">
                <Code className="w-4 h-4" />
                Coding
              </TabsTrigger>
              <TabsTrigger value="interviews" className="flex items-center gap-2">
                <Video className="w-4 h-4" />
                Interviews
              </TabsTrigger>
              <TabsTrigger value="activity" className="flex items-center gap-2">
                <Activity className="w-4 h-4" />
                Activity
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Performance Summary */}
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-foreground">
                      <PieChart className="w-5 h-5 text-blue-400" />
                      Performance Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-300">Aptitude</span>
                        <div className="flex items-center gap-2">
                          <Progress value={userStats.aptitude.overallAccuracy} className="w-20 h-2" />
                          <span className="text-foreground font-semibold w-12">{userStats.aptitude.overallAccuracy}%</span>
                        </div>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-slate-300">Coding</span>
                        <div className="flex items-center gap-2">
                          <Progress value={userStats.coding.overallAccuracy} className="w-20 h-2" />
                          <span className="text-foreground font-semibold w-12">{userStats.coding.overallAccuracy}%</span>
                        </div>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-slate-300">Interviews</span>
                        <div className="flex items-center gap-2">
                          <Progress value={userStats.interviews.averageScore} className="w-20 h-2" />
                          <span className="text-foreground font-semibold w-12">{userStats.interviews.averageScore}%</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Achievements */}
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-foreground">
                      <Trophy className="w-5 h-5 text-yellow-400" />
                      Achievements
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-slate-800/50 rounded-lg">
                        <Flame className="w-6 h-6 text-orange-400 mx-auto mb-1" />
                        <div className="text-lg font-bold text-foreground">
                          {Math.max(userStats.aptitude.currentStreak, userStats.coding.currentStreak)}
                        </div>
                        <div className="text-xs text-slate-400">Current Streak</div>
                      </div>

                      <div className="text-center p-3 bg-slate-800/50 rounded-lg">
                        <Medal className="w-6 h-6 text-yellow-400 mx-auto mb-1" />
                        <div className="text-lg font-bold text-foreground">
                          {Math.max(userStats.aptitude.bestStreak, userStats.coding.bestStreak)}
                        </div>
                        <div className="text-xs text-slate-400">Best Streak</div>
                      </div>

                      <div className="text-center p-3 bg-slate-800/50 rounded-lg">
                        <BookOpen className="w-6 h-6 text-green-400 mx-auto mb-1" />
                        <div className="text-lg font-bold text-foreground">{userStats.aptitude.topicsCompleted}</div>
                        <div className="text-xs text-slate-400">Topics Mastered</div>
                      </div>

                      <div className="text-center p-3 bg-slate-800/50 rounded-lg">
                        <Code className="w-6 h-6 text-blue-400 mx-auto mb-1" />
                        <div className="text-lg font-bold text-foreground">{userStats.coding.languagesUsed}</div>
                        <div className="text-xs text-slate-400">Languages Used</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Time Spent */}
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-foreground">
                    <Clock className="w-5 h-5 text-purple-400" />
                    Time Investment
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-400 mb-1">{userStats.aptitude.timeSpent}m</div>
                      <div className="text-sm text-slate-400">Aptitude Practice</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-400 mb-1">{userStats.coding.timeSpent}m</div>
                      <div className="text-sm text-slate-400">Coding Practice</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-400 mb-1">{userStats.interviews.timeSpent}m</div>
                      <div className="text-sm text-slate-400">Interview Practice</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Aptitude Tab */}
            <TabsContent value="aptitude" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {aptitudeProgress.map((progress, index) => {
                  const topicName = getTopicName(progress.topic, "aptitude")
                  return (
                    <motion.div
                      key={progress.topic}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="glass-card p-6"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-foreground">{topicName}</h3>
                        <Badge variant="secondary" className={`${getLevelColor(progress.level)} bg-opacity-20`}>
                          {progress.level}
                        </Badge>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-slate-400">Accuracy</span>
                            <span className="text-foreground">{progress.accuracy}%</span>
                          </div>
                          <Progress value={progress.accuracy} className="h-2" />
                        </div>

                        <div className="grid grid-cols-3 gap-4 text-center text-sm">
                          <div>
                            <div className="text-foreground font-semibold">{progress.attempted}</div>
                            <div className="text-slate-400">Attempted</div>
                          </div>
                          <div>
                            <div className="text-green-400 font-semibold">{progress.correct}</div>
                            <div className="text-slate-400">Correct</div>
                          </div>
                          <div>
                            <div className="text-blue-400 font-semibold">{progress.timeSpent}m</div>
                            <div className="text-slate-400">Time</div>
                          </div>
                        </div>

                        <div className="text-xs text-slate-400">
                          Last practiced: {new Date(progress.lastPracticed).toLocaleDateString()}
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>

              {aptitudeProgress.length === 0 && (
                <div className="text-center py-12">
                  <Brain className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-foreground mb-2">No Aptitude Progress Yet</h3>
                  <p className="text-slate-300">Start practicing aptitude questions to see your progress here</p>
                </div>
              )}
            </TabsContent>

            {/* Coding Tab */}
            <TabsContent value="coding" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {codingProgress.map((progress, index) => {
                  const topicName = getTopicName(progress.topic, "coding")
                  return (
                    <motion.div
                      key={`${progress.topic}-${progress.language}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="glass-card p-6"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="font-semibold text-foreground">{topicName}</h3>
                          <p className="text-sm text-slate-400">{progress.language}</p>
                        </div>
                        <Badge variant="secondary" className={`${getLevelColor(progress.level)} bg-opacity-20`}>
                          {progress.level}
                        </Badge>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-slate-400">Success Rate</span>
                            <span className="text-foreground">{progress.accuracy}%</span>
                          </div>
                          <Progress value={progress.accuracy} className="h-2" />
                        </div>

                        <div className="grid grid-cols-4 gap-2 text-center text-sm">
                          <div>
                            <div className="text-foreground font-semibold">{progress.attempted}</div>
                            <div className="text-slate-400 text-xs">Attempted</div>
                          </div>
                          <div>
                            <div className="text-green-400 font-semibold">{progress.correct}</div>
                            <div className="text-slate-400 text-xs">Solved</div>
                          </div>
                          <div>
                            <div className="text-blue-400 font-semibold">{progress.timeSpent}m</div>
                            <div className="text-slate-400 text-xs">Time</div>
                          </div>
                          <div>
                            <div className="text-purple-400 font-semibold">{progress.skillPoints}</div>
                            <div className="text-slate-400 text-xs">Points</div>
                          </div>
                        </div>

                        <div className="text-xs text-slate-400">
                          Last practiced: {new Date(progress.lastPracticed).toLocaleDateString()}
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>

              {codingProgress.length === 0 && (
                <div className="text-center py-12">
                  <Code className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-foreground mb-2">No Coding Progress Yet</h3>
                  <p className="text-slate-300">Start solving coding problems to see your progress here</p>
                </div>
              )}
            </TabsContent>

            {/* Interviews Tab */}
            <TabsContent value="interviews" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="glass-card">
                  <CardContent className="p-6 text-center">
                    <Video className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-foreground">{userStats.interviews.totalSessions}</div>
                    <div className="text-sm text-slate-400">Total Sessions</div>
                  </CardContent>
                </Card>

                <Card className="glass-card">
                  <CardContent className="p-6 text-center">
                    <Target className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-foreground">{userStats.interviews.averageScore}%</div>
                    <div className="text-sm text-slate-400">Average Score</div>
                  </CardContent>
                </Card>

                <Card className="glass-card">
                  <CardContent className="p-6 text-center">
                    <Clock className="w-8 h-8 text-green-400 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-foreground">{userStats.interviews.timeSpent}m</div>
                    <div className="text-sm text-slate-400">Time Practiced</div>
                  </CardContent>
                </Card>

                <Card className="glass-card">
                  <CardContent className="p-6 text-center">
                    <TrendingUp className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-foreground">{userStats.interviews.improvementRate}%</div>
                    <div className="text-sm text-slate-400">Improvement</div>
                  </CardContent>
                </Card>
              </div>

              {userStats.interviews.totalSessions === 0 && (
                <div className="text-center py-12">
                  <Video className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-foreground mb-2">No Interview Sessions Yet</h3>
                  <p className="text-slate-300">Start practicing interviews to see your progress here</p>
                </div>
              )}
            </TabsContent>

            {/* Activity Tab */}
            <TabsContent value="activity" className="space-y-6">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-foreground">
                    <Activity className="w-5 h-5 text-green-400" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {recentActivity.length > 0 ? (
                    <div className="space-y-4">
                      {recentActivity.map((activity, index) => {
                        const Icon = activity.icon
                        return (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-center gap-4 p-3 bg-slate-800/50 rounded-lg"
                          >
                            <Icon className="w-5 h-5 text-blue-400" />
                            <div className="flex-1">
                              <div className="text-foreground font-medium">
                                {activity.type === "aptitude" &&
                                  `Practiced ${getTopicName(activity.topic, "aptitude")}`}
                                {activity.type === "coding" &&
                                  `Solved ${getTopicName(activity.topic, "coding")} problems in ${activity.language}`}
                                {activity.type === "interview" && "Completed interview session"}
                              </div>
                              <div className="text-sm text-slate-400">
                                {activity.date.toLocaleDateString()} • Score: {activity.score}%
                              </div>
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {activity.score}%
                            </Badge>
                          </motion.div>
                        )
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Activity className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-foreground mb-2">No Activity Yet</h3>
                      <p className="text-slate-300">Start practicing to see your activity here</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  )
}
