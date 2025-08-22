"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Users,
  FileText,
  AlertTriangle,
  Download,
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  TrendingUp,
  Clock,
  Flag,
  BarChart3,
} from "lucide-react"
import { RouteGuard } from "@/components/route-guard"
import { Navbar } from "@/components/navbar"

const candidateData = [
  {
    id: 1,
    name: "John Smith",
    email: "john.smith@email.com",
    duration: "45 min",
    confidence: 78,
    eyeContact: 85,
    tabSwitches: 2,
    status: "completed",
    flagged: false,
    date: "2024-01-15",
  },
  {
    id: 2,
    name: "Sarah Johnson",
    email: "sarah.j@email.com",
    duration: "52 min",
    confidence: 92,
    eyeContact: 88,
    tabSwitches: 0,
    status: "completed",
    flagged: false,
    date: "2024-01-15",
  },
  {
    id: 3,
    name: "Mike Chen",
    email: "mike.chen@email.com",
    duration: "38 min",
    confidence: 45,
    eyeContact: 32,
    tabSwitches: 8,
    status: "flagged",
    flagged: true,
    date: "2024-01-14",
  },
  {
    id: 4,
    name: "Emily Davis",
    email: "emily.davis@email.com",
    duration: "41 min",
    confidence: 67,
    eyeContact: 72,
    tabSwitches: 1,
    status: "completed",
    flagged: false,
    date: "2024-01-14",
  },
  {
    id: 5,
    name: "Alex Rodriguez",
    email: "alex.r@email.com",
    duration: "29 min",
    confidence: 55,
    eyeContact: 48,
    tabSwitches: 5,
    status: "in-progress",
    flagged: false,
    date: "2024-01-15",
  },
]

export function AdminDashboard() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")

  const filteredCandidates = candidateData.filter((candidate) => {
    const matchesSearch =
      candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === "all" || candidate.status === filterStatus
    return matchesSearch && matchesFilter
  })

  const stats = {
    totalInterviews: candidateData.length,
    completedInterviews: candidateData.filter((c) => c.status === "completed").length,
    flaggedCandidates: candidateData.filter((c) => c.flagged).length,
    averageConfidence: Math.round(candidateData.reduce((acc, c) => acc + c.confidence, 0) / candidateData.length),
  }

  const downloadReport = (candidateId: number) => {
    // Simulate PDF download using jsPDF
    const candidate = candidateData.find((c) => c.id === candidateId)
    if (candidate) {
      // Create a simple text content for demo
      const reportContent = `
SaviAI Interview Report
========================

Candidate: ${candidate.name}
Email: ${candidate.email}
Date: ${candidate.date}
Duration: ${candidate.duration}

Performance Metrics:
- Confidence Level: ${candidate.confidence}%
- Eye Contact Score: ${candidate.eyeContact}%
- Tab Switches: ${candidate.tabSwitches}
- Status: ${candidate.status}

Generated on: ${new Date().toLocaleDateString()}
      `

      // Create and download blob
      const blob = new Blob([reportContent], { type: "text/plain" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${candidate.name.replace(" ", "_")}_Interview_Report.txt`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }
  }

  return (
    <RouteGuard requiredRole="organization">
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-100 dark:from-slate-900 dark:via-indigo-900 dark:to-purple-900">
        <Navbar />

        <div className="pt-24 p-6 animate-fade-in">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-4">
              Admin Dashboard
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-lg">
              Monitor and analyze interview sessions with advanced AI insights
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="glass-card hover-lift">
              <CardContent className="p-8">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-lg font-medium text-slate-600 dark:text-slate-400">Total Interviews</p>
                    <p className="text-4xl font-bold text-slate-900 dark:text-slate-100">{stats.totalInterviews}</p>
                  </div>
                  <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center">
                    <Users className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card hover-lift">
              <CardContent className="p-8">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-lg font-medium text-slate-600 dark:text-slate-400">Completed</p>
                    <p className="text-4xl font-bold text-slate-900 dark:text-slate-100">{stats.completedInterviews}</p>
                  </div>
                  <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-2xl flex items-center justify-center">
                    <Clock className="w-8 h-8 text-green-600 dark:text-green-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card hover-lift">
              <CardContent className="p-8">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-lg font-medium text-slate-600 dark:text-slate-400">Flagged</p>
                    <p className="text-4xl font-bold text-slate-900 dark:text-slate-100">{stats.flaggedCandidates}</p>
                  </div>
                  <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-2xl flex items-center justify-center">
                    <Flag className="w-8 h-8 text-red-600 dark:text-red-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card hover-lift">
              <CardContent className="p-8">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-lg font-medium text-slate-600 dark:text-slate-400">Avg Confidence</p>
                    <p className="text-4xl font-bold text-slate-900 dark:text-slate-100">{stats.averageConfidence}%</p>
                  </div>
                  <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-2xl flex items-center justify-center">
                    <TrendingUp className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Candidates Table */}
          <Card className="glass-card hover-lift">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl font-bold flex items-center space-x-3">
                  <BarChart3 className="w-7 h-7 text-primary" />
                  <span>Interview Sessions</span>
                </CardTitle>
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <Input
                      placeholder="Search candidates..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-12 w-80 glass-card border-white/30 text-slate-900 dark:text-slate-100 text-lg"
                    />
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        className="glass-card hover:bg-white/30 dark:hover:bg-white/10 bg-transparent text-lg px-6 py-3"
                      >
                        <Filter className="w-5 h-5 mr-2" />
                        Filter
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="glass-card border-white/20">
                      <DropdownMenuItem onClick={() => setFilterStatus("all")}>All Status</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setFilterStatus("completed")}>Completed</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setFilterStatus("in-progress")}>In Progress</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setFilterStatus("flagged")}>Flagged</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-lg font-semibold">Candidate</TableHead>
                    <TableHead className="text-lg font-semibold">Duration</TableHead>
                    <TableHead className="text-lg font-semibold">Confidence</TableHead>
                    <TableHead className="text-lg font-semibold">Eye Contact</TableHead>
                    <TableHead className="text-lg font-semibold">Tab Switches</TableHead>
                    <TableHead className="text-lg font-semibold">Status</TableHead>
                    <TableHead className="text-lg font-semibold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCandidates.map((candidate) => (
                    <TableRow key={candidate.id} className="hover:bg-white/50 dark:hover:bg-white/5 transition-colors">
                      <TableCell>
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center text-foreground text-lg font-bold">
                            {candidate.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </div>
                          <div>
                            <p className="font-semibold text-lg text-slate-800 dark:text-slate-200">{candidate.name}</p>
                            <p className="text-slate-500 dark:text-slate-400">{candidate.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-lg font-medium">{candidate.duration}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <span className="font-bold text-lg">{candidate.confidence}%</span>
                          <Badge
                            variant={
                              candidate.confidence > 70
                                ? "default"
                                : candidate.confidence > 50
                                  ? "secondary"
                                  : "destructive"
                            }
                            className="text-sm px-3 py-1"
                          >
                            {candidate.confidence > 70 ? "High" : candidate.confidence > 50 ? "Med" : "Low"}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="text-lg font-medium">{candidate.eyeContact}%</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <span className="text-lg font-medium">{candidate.tabSwitches}</span>
                          {candidate.tabSwitches > 3 && <AlertTriangle className="w-5 h-5 text-red-500" />}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            candidate.status === "completed"
                              ? "default"
                              : candidate.status === "flagged"
                                ? "destructive"
                                : "secondary"
                          }
                          className="text-sm px-3 py-1"
                        >
                          {candidate.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="glass-button hover-glow">
                              <MoreHorizontal className="w-5 h-5" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="glass-card border-white/20">
                            <DropdownMenuItem asChild>
                              <a href={`/report/${candidate.id}`} className="flex items-center">
                                <Eye className="w-4 h-4 mr-2" />
                                View Report
                              </a>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => downloadReport(candidate.id)}>
                              <Download className="w-4 h-4 mr-2" />
                              Download Report
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <FileText className="w-4 h-4 mr-2" />
                              Export Data
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </RouteGuard>
  )
}
