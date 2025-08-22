"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { motion } from "framer-motion"
import { Download, Calendar, Trophy, Search, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { AnimatedPage } from "@/components/animated-page"
import toast from "react-hot-toast"

interface InterviewSession {
  id: string
  date: string
  score: number
  type: "mock" | "regular"
  duration: number
  emotions: string[]
  tabSwitches: number
  badge: "Gold" | "Silver" | "Bronze"
}

export function InterviewHistoryPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [sessions, setSessions] = useState<InterviewSession[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterScore, setFilterScore] = useState("all")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!session) {
      router.push("/login")
      return
    }

    fetchInterviewHistory()
  }, [session, router])

  const fetchInterviewHistory = async () => {
    try {
      const response = await fetch("/api/interview")
      if (response.ok) {
        const interviews = await response.json()

        // Transform MongoDB data to component format
        const transformedSessions: InterviewSession[] = interviews.map((interview: any) => ({
          id: interview._id,
          date: interview.createdAt,
          score: interview.metrics?.overallScore || 0,
          type: interview.type,
          duration: interview.metrics?.totalDuration || 0,
          emotions: interview.emotions || [],
          tabSwitches: interview.tabSwitches || 0,
          badge: getBadgeFromScore(interview.metrics?.overallScore || 0),
        }))

        setSessions(transformedSessions)
      } else {
        // Fallback to mock data if API fails
        setSessions([])
        toast.error("Failed to load interview history")
      }
    } catch (error) {
      console.error("Error fetching interview history:", error)
      setSessions([])
      toast.error("Error loading interview history")
    } finally {
      setLoading(false)
    }
  }

  const getBadgeFromScore = (score: number): "Gold" | "Silver" | "Bronze" => {
    if (score >= 80) return "Gold"
    if (score >= 60) return "Silver"
    return "Bronze"
  }

  const filteredSessions = sessions.filter((session) => {
    const matchesSearch = session.date.includes(searchTerm) || session.score.toString().includes(searchTerm)
    const matchesFilter =
      filterScore === "all" ||
      (filterScore === "high" && session.score >= 80) ||
      (filterScore === "medium" && session.score >= 60 && session.score < 80) ||
      (filterScore === "low" && session.score < 60)

    return matchesSearch && matchesFilter
  })

  const getBadgeColor = (badge: string) => {
    switch (badge) {
      case "Gold":
        return "bg-yellow-500 text-foreground"
      case "Silver":
        return "bg-gray-400 text-foreground"
      case "Bronze":
        return "bg-amber-600 text-foreground"
      default:
        return "bg-gray-500 text-foreground"
    }
  }

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    return `${mins}m`
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
                  <Button variant="outline" className="glass-button bg-transparent">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Home
                  </Button>
                </motion.div>
              </Link>
              <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100">Interview History 📚</h1>
            </div>
          </motion.div>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <Card className="glass-card">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Trophy className="w-8 h-8 text-foreground" />
                  </div>
                  <div className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">{sessions.length}</div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">Total Sessions</div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <Card className="glass-card">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">🏆</span>
                  </div>
                  <div className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                    {Math.round(sessions.reduce((acc, s) => acc + s.score, 0) / sessions.length) || 0}
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">Average Score</div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <Card className="glass-card">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">🥇</span>
                  </div>
                  <div className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                    {sessions.filter((s) => s.badge === "Gold").length}
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">Gold Badges</div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
              <Card className="glass-card">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Calendar className="w-8 h-8 text-foreground" />
                  </div>
                  <div className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                    {sessions.length > 0 ? new Date(sessions[0].date).toLocaleDateString() : "N/A"}
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">Last Session</div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Sessions Table */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
            <Card className="glass-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                    Interview Sessions
                  </CardTitle>
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                      <Input
                        placeholder="Search by date or score..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 w-64 glass-card border-white/30"
                      />
                    </div>
                    <select
                      value={filterScore}
                      onChange={(e) => setFilterScore(e.target.value)}
                      className="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                    >
                      <option value="all">All Scores</option>
                      <option value="high">High (80+)</option>
                      <option value="medium">Medium (60-79)</option>
                      <option value="low">Low (&lt;60)</option>
                    </select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="font-semibold">Date</TableHead>
                      <TableHead className="font-semibold">Score</TableHead>
                      <TableHead className="font-semibold">Badge</TableHead>
                      <TableHead className="font-semibold">Duration</TableHead>
                      <TableHead className="font-semibold">Tab Switches</TableHead>
                      <TableHead className="font-semibold">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSessions.map((session, index) => (
                      <motion.tr
                        key={session.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 + index * 0.1 }}
                        className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                      >
                        <TableCell className="font-medium">{new Date(session.date).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <span className="text-2xl font-bold">{session.score}%</span>
                            <Badge
                              variant={
                                session.score >= 80 ? "default" : session.score >= 60 ? "secondary" : "destructive"
                              }
                            >
                              {session.score >= 80 ? "Excellent" : session.score >= 60 ? "Good" : "Needs Work"}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getBadgeColor(session.badge)}>
                            {session.badge === "Gold" && "🥇"}
                            {session.badge === "Silver" && "🥈"}
                            {session.badge === "Bronze" && "🥉"}
                            {session.badge}
                          </Badge>
                        </TableCell>
                        <TableCell>{formatDuration(session.duration)}</TableCell>
                        <TableCell>
                          <span className={session.tabSwitches > 0 ? "text-red-600" : "text-green-600"}>
                            {session.tabSwitches}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Link href={`/report?id=${session.id}`}>
                              <Button variant="outline" size="sm" className="glass-button bg-transparent">
                                View Report
                              </Button>
                            </Link>
                            <Button
                              variant="outline"
                              size="sm"
                              className="glass-button bg-transparent"
                              onClick={() => toast.success("PDF downloaded!")}
                            >
                              <Download className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </motion.tr>
                    ))}
                  </TableBody>
                </Table>

                {filteredSessions.length === 0 && (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">📝</div>
                    <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-2">
                      No interviews found
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 mb-6">
                      Start your first mock interview to see your progress here.
                    </p>
                    <Link href="/mock-interview">
                      <Button className="btn-primary">Start Mock Interview</Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </AnimatedPage>
  )
}
