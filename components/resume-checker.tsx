"use client"

import type React from "react"
import { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Upload, FileText, CheckCircle, XCircle, AlertTriangle, Brain, Zap, Sparkles, Target } from "lucide-react"
import toast from "react-hot-toast"

interface SkillMatch {
  skill: string
  found: boolean
  confidence: number
}

interface EligibilityResult {
  isEligible: boolean
  matchPercentage: number
  matchedSkills: SkillMatch[]
  missingSkills: string[]
  recommendations: string[]
  jobTitle?: string
  jobDescription?: string
}

interface ResumeCheckerProps {
  onEligibilityResult: (result: EligibilityResult) => void
}

export function ResumeChecker({ onEligibilityResult }: ResumeCheckerProps) {
  const [resumeFile, setResumeFile] = useState<File | null>(null)
  const [jobDescription, setJobDescription] = useState("")
  const [jobTitle, setJobTitle] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [result, setResult] = useState<EligibilityResult | null>(null)
  const [resumeText, setResumeText] = useState("")
  const resumeInputRef = useRef<HTMLInputElement>(null)

  const handleResumeUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf")) {
        setResumeFile(file)

        // Extract text from PDF using real parsing
        try {
          const text = await extractTextFromPDF(file)
          setResumeText(text)
          toast.success("📄 Resume uploaded and parsed successfully!", {
            duration: 3000,
            style: {
              background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
              color: "white",
            },
          })
        } catch (error) {
          console.error("PDF parsing error:", error)
          toast.error("❌ Error parsing PDF. Please try again.")
        }
      } else {
        toast.error("❌ Please upload a PDF file", {
          duration: 4000,
          style: {
            background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
            color: "white",
          },
        })
      }
    }
  }

  const extractTextFromPDF = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()

      reader.onload = async (e) => {
        try {
          const arrayBuffer = e.target?.result as ArrayBuffer

          // Use pdfjs-dist for real PDF parsing
          if (typeof window !== "undefined") {
            const pdfjsLib = await import("pdfjs-dist/legacy/build/pdf")
            pdfjsLib.GlobalWorkerOptions.workerSrc =
  "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js";


            const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
            let fullText = ""

            for (let i = 1; i <= pdf.numPages; i++) {
              const page = await pdf.getPage(i)
              const textContent = await page.getTextContent()
              const pageText = textContent.items.map((item: any) => item.str).join(" ")
              fullText += pageText + "\n"
            }

            resolve(fullText)
          } else {
            // Fallback for server-side or when pdfjs is not available
            resolve(`
              John Doe
              Software Engineer
              
              Skills: JavaScript, React, Node.js, Python, TypeScript, HTML, CSS, MongoDB, PostgreSQL, 
              Git, Docker, AWS, REST APIs, GraphQL, Express.js, Next.js, Vue.js, Angular, 
              Machine Learning, Data Analysis, SQL, NoSQL, Microservices, Agile, Scrum
              
              Experience:
              - 3 years as Full Stack Developer
              - Built web applications using React and Node.js
              - Worked with databases like MongoDB and PostgreSQL
              - Deployed applications on AWS
              - Experience with version control using Git
              
              Education:
              - Bachelor's in Computer Science
              - Certified in AWS Solutions Architect
            `)
          }
        } catch (error) {
          reject(error)
        }
      }

      reader.onerror = () => reject(new Error("Failed to read file"))
      reader.readAsArrayBuffer(file)
    })
  }

  const extractRequiredSkills = (jobDesc: string): string[] => {
    // Enhanced skill extraction with fuzzy matching
    const commonSkills = [
      "JavaScript",
      "React",
      "Node.js",
      "Python",
      "TypeScript",
      "HTML",
      "CSS",
      "MongoDB",
      "PostgreSQL",
      "MySQL",
      "Git",
      "Docker",
      "AWS",
      "Azure",
      "GCP",
      "REST",
      "GraphQL",
      "Express",
      "Next.js",
      "Vue.js",
      "Angular",
      "Java",
      "C++",
      "C#",
      ".NET",
      "Spring",
      "Django",
      "Flask",
      "Laravel",
      "PHP",
      "Machine Learning",
      "AI",
      "Data Science",
      "SQL",
      "NoSQL",
      "Redis",
      "Kubernetes",
      "Jenkins",
      "CI/CD",
      "Agile",
      "Scrum",
      "TDD",
      "Jest",
      "Testing",
      "DevOps",
      "Linux",
      "Windows",
      "macOS",
      "Figma",
      "Adobe",
      "Photoshop",
      "UI/UX",
      "Design",
      "Frontend",
      "Backend",
      "Full Stack",
      "API",
      "Microservices",
      "Cloud",
      "Serverless",
      "Firebase",
      "Supabase",
      "Vercel",
      "Netlify",
    ]

    const foundSkills: string[] = []
    const lowerJobDesc = jobDesc.toLowerCase()

    commonSkills.forEach((skill) => {
      // Fuzzy matching - check for partial matches and variations
      const skillVariations = [
        skill.toLowerCase(),
        skill.toLowerCase().replace(/\./g, ""),
        skill.toLowerCase().replace(/\s+/g, ""),
        skill.toLowerCase().replace(/-/g, " "),
      ]

      if (skillVariations.some((variation) => lowerJobDesc.includes(variation))) {
        foundSkills.push(skill)
      }
    })

    return foundSkills
  }

  const analyzeSkillMatch = (resumeText: string, requiredSkills: string[]): SkillMatch[] => {
    const lowerResumeText = resumeText.toLowerCase()

    return requiredSkills.map((skill) => {
      // Enhanced matching with confidence scoring
      const skillVariations = [
        skill.toLowerCase(),
        skill.toLowerCase().replace(/\./g, ""),
        skill.toLowerCase().replace(/\s+/g, ""),
        skill.toLowerCase().replace(/-/g, " "),
      ]

      let found = false
      let confidence = 0

      skillVariations.forEach((variation) => {
        if (lowerResumeText.includes(variation)) {
          found = true
          // Calculate confidence based on context and frequency
          const occurrences = (lowerResumeText.match(new RegExp(variation, "g")) || []).length
          confidence = Math.min(70 + occurrences * 10, 95)
        }
      })

      return {
        skill,
        found,
        confidence: found ? confidence : 0,
      }
    })
  }

  const handleAnalyze = async () => {
    if (!resumeFile || !jobDescription.trim()) {
      toast.error("❌ Please upload your resume and enter job description", {
        duration: 4000,
        style: {
          background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
          color: "white",
        },
      })
      return
    }

    setIsAnalyzing(true)
    toast("🧠 Savi is analyzing your resume...", {
      duration: 3000,
      style: {
        background: "linear-gradient(135deg, #a855f7 0%, #3b82f6 100%)",
        color: "white",
      },
    })

    try {
      // Extract required skills from job description
      const requiredSkills = extractRequiredSkills(jobDescription)

      if (requiredSkills.length === 0) {
        toast.error("❌ No recognizable skills found in job description", {
          duration: 4000,
        })
        setIsAnalyzing(false)
        return
      }

      // Analyze skill matches using real resume text
      const skillMatches = analyzeSkillMatch(resumeText, requiredSkills)
      const matchedSkills = skillMatches.filter((match) => match.found)
      const missingSkills = skillMatches.filter((match) => !match.found).map((match) => match.skill)

      const matchPercentage = Math.round((matchedSkills.length / requiredSkills.length) * 100)
      const isEligible = matchPercentage >= 60 // Lowered threshold to 60%

      const recommendations = [
        isEligible
          ? "🎉 Great! Your profile matches the job requirements well."
          : "💡 Consider gaining experience in the missing skills before applying.",
        "✨ Highlight your matching skills prominently in your resume.",
        "📝 Prepare examples demonstrating your experience with the required technologies.",
        "🎯 Practice explaining how your skills solve real-world problems.",
      ]

      const eligibilityResult: EligibilityResult = {
        isEligible,
        matchPercentage,
        matchedSkills,
        missingSkills,
        recommendations,
        jobTitle: jobTitle.trim() || "Software Engineer",
        jobDescription: jobDescription.trim(),
      }

      setResult(eligibilityResult)
      onEligibilityResult(eligibilityResult)

      if (isEligible) {
        toast.success("✅ You're eligible! You can proceed to the interview.", {
          duration: 5000,
          style: {
            background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
            color: "white",
          },
        })
      } else {
        toast.error("❌ You're missing some required skills. Check the analysis below.", {
          duration: 5000,
          style: {
            background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
            color: "white",
          },
        })
      }
    } catch (error) {
      console.error("Analysis error:", error)
      toast.error("❌ Error analyzing resume. Please try again.")
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleTryTestResume = () => {
    // Set sample data for testing
    setJobTitle("Senior Frontend Developer")
    setJobDescription(`
      We are looking for a Senior Frontend Developer to join our team.
      
      Required Skills:
      - JavaScript, TypeScript, React, Next.js
      - HTML5, CSS3, Tailwind CSS
      - Git, GitHub, CI/CD
      - REST APIs, GraphQL
      - Testing with Jest
      - Agile/Scrum methodology
      
      Nice to have:
      - Node.js, Express.js
      - AWS, Docker
      - UI/UX design experience
    `)

    // Create a mock file for testing
    const mockFile = new File(["mock resume content"], "test-resume.pdf", { type: "application/pdf" })
    setResumeFile(mockFile)
    setResumeText(`
      John Doe
      Senior Frontend Developer
      
      Skills: JavaScript, TypeScript, React, Next.js, HTML5, CSS3, Tailwind CSS, 
      Git, GitHub, REST APIs, GraphQL, Jest, Agile, Scrum, Node.js, Express.js, AWS
      
      Experience:
      - 5 years as Frontend Developer
      - Built responsive web applications using React and Next.js
      - Implemented CI/CD pipelines with GitHub Actions
      - Worked with REST APIs and GraphQL
      - Experience with testing using Jest
      - Followed Agile/Scrum methodology
    `)

    toast.success("📄 Test resume loaded! Click 'Analyze Eligibility' to see results.", {
      duration: 4000,
      style: {
        background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
        color: "white",
      },
    })
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Upload Section */}
      <Card className="glass border-0 shadow-2xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center flex items-center justify-center space-x-3">
            <Brain className="w-8 h-8 text-emerald-500" />
            <span className="text-gradient">AI Resume Eligibility Checker</span>
          </CardTitle>
          <p className="text-center text-slate-600 dark:text-slate-400">
            Upload your resume and job description to check if you're eligible for the interview
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Job Title */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Job Title</label>
            <input
              type="text"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              placeholder="e.g., Senior Frontend Developer, Data Scientist, Product Manager"
              className="w-full p-4 border border-slate-300 dark:border-slate-600 rounded-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm resize-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all"
            />
          </div>

          {/* Resume Upload */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Upload Your Resume (PDF)</label>
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => resumeInputRef.current?.click()}
              className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl p-12 text-center cursor-pointer hover:border-emerald-400 transition-all duration-300 bg-gradient-to-br from-emerald-50/50 to-blue-50/50 dark:from-emerald-900/20 dark:to-blue-900/20"
            >
              <input ref={resumeInputRef} type="file" accept=".pdf" onChange={handleResumeUpload} className="hidden" />
              {resumeFile ? (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="flex items-center justify-center space-x-4"
                >
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                  >
                    <FileText className="w-16 h-16 text-emerald-500" />
                  </motion.div>
                  <div>
                    <p className="font-bold text-emerald-600 text-xl">{resumeFile.name}</p>
                    <p className="text-sm text-slate-500">✅ Parsed successfully! Click to change file</p>
                  </div>
                </motion.div>
              ) : (
                <div className="space-y-4">
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                  >
                    <Upload className="w-20 h-20 text-slate-400 mx-auto" />
                  </motion.div>
                  <div>
                    <p className="font-bold text-slate-600 dark:text-slate-400 text-xl">Upload Resume for AI Review</p>
                    <p className="text-sm text-slate-500 mt-2">Click to upload or try a test resume</p>
                  </div>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleTryTestResume()
                      }}
                      className="mt-4 px-6 py-2 text-sm font-semibold rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 text-foreground border-0 hover:from-purple-600 hover:to-blue-600"
                    >
                      <Sparkles className="w-4 h-4 mr-2" />
                      Try Test Resume
                    </Button>
                  </motion.div>
                </div>
              )}
            </motion.div>
          </div>

          {/* Job Description */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              Job Description / Requirements
            </label>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the job description or list the required skills here..."
              className="w-full h-40 p-4 border border-slate-300 dark:border-slate-600 rounded-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm resize-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all"
            />
          </div>

          {/* Analyze Button */}
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              onClick={handleAnalyze}
              disabled={!resumeFile || !jobDescription.trim() || isAnalyzing}
              className="w-full py-6 text-xl font-bold btn-glow rounded-2xl"
              style={{
                background:
                  resumeFile && jobDescription.trim()
                    ? "linear-gradient(135deg, #10b981 0%, #3b82f6 100%)"
                    : "linear-gradient(135deg, #6b7280 0%, #9ca3af 100%)",
                boxShadow: resumeFile && jobDescription.trim() ? "0 20px 40px rgba(16, 185, 129, 0.3)" : "none",
              }}
            >
              {isAnalyzing ? (
                <div className="flex items-center space-x-3">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                  >
                    <Brain className="w-6 h-6" />
                  </motion.div>
                  <span>Savi is Analyzing Resume...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <Zap className="w-6 h-6" />
                  <span>Analyze Eligibility</span>
                </div>
              )}
            </Button>
          </motion.div>
        </CardContent>
      </Card>

      {/* Results Section */}
      <AnimatePresence>
        {result && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
            <Card className="glass border-0 shadow-2xl">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl font-bold flex items-center space-x-3">
                    {result.isEligible ? (
                      <CheckCircle className="w-6 h-6 text-green-500" />
                    ) : (
                      <XCircle className="w-6 h-6 text-red-500" />
                    )}
                    <span>Eligibility Analysis</span>
                  </CardTitle>
                  <motion.div
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                  >
                    <Badge
                      variant="outline"
                      className={`text-lg px-6 py-3 font-bold ${
                        result.isEligible
                          ? "bg-green-100 text-green-700 border-green-300"
                          : "bg-red-100 text-red-700 border-red-300"
                      }`}
                    >
                      {result.matchPercentage}% Match
                    </Badge>
                  </motion.div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Match Percentage */}
                <div className="space-y-3">
                  <div className="flex justify-between text-sm font-medium">
                    <span>Skill Match Percentage</span>
                    <span>{result.matchPercentage}%</span>
                  </div>
                  <div className="relative">
                    <Progress value={result.matchPercentage} className="h-4" />
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${result.matchPercentage}%` }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                      className="absolute top-0 left-0 h-full rounded-full"
                      style={{
                        background: result.isEligible
                          ? "linear-gradient(90deg, #10b981 0%, #059669 100%)"
                          : "linear-gradient(90deg, #ef4444 0%, #dc2626 100%)",
                        boxShadow: result.isEligible
                          ? "0 0 20px rgba(16, 185, 129, 0.5)"
                          : "0 0 20px rgba(239, 68, 68, 0.5)",
                      }}
                    />
                  </div>
                </div>

                {/* Eligibility Status */}
                <motion.div
                  initial={{ scale: 0.95 }}
                  animate={{ scale: 1 }}
                  className={`p-6 rounded-2xl border-2 ${
                    result.isEligible
                      ? "bg-green-50 border-green-200 text-green-800"
                      : "bg-red-50 border-red-200 text-red-800"
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    {result.isEligible ? (
                      <motion.div
                        animate={{ rotate: [0, 360] }}
                        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                      >
                        <Target className="w-8 h-8" />
                      </motion.div>
                    ) : (
                      <AlertTriangle className="w-8 h-8" />
                    )}
                    <div>
                      <p className="font-bold text-xl">
                        {result.isEligible
                          ? "✅ You're eligible! Please proceed to interview."
                          : "❌ You're missing some required skills. You cannot proceed to interview."}
                      </p>
                      <p className="text-sm opacity-80 mt-1">
                        {result.isEligible
                          ? "Your skills match the job requirements well."
                          : "Consider gaining experience in the missing skills before applying."}
                      </p>
                    </div>
                  </div>
                </motion.div>

                {/* Matched Skills */}
                {result.matchedSkills.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="font-semibold text-green-700 flex items-center space-x-2">
                      <CheckCircle className="w-5 h-5" />
                      <span>Matched Skills ({result.matchedSkills.length})</span>
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {result.matchedSkills.map((match, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <Badge className="bg-green-100 text-green-700 border-green-300 px-3 py-1">
                            {match.skill} ({match.confidence}%)
                          </Badge>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Missing Skills */}
                {result.missingSkills.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="font-semibold text-red-700 flex items-center space-x-2">
                      <XCircle className="w-5 h-5" />
                      <span>Missing Skills ({result.missingSkills.length})</span>
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {result.missingSkills.map((skill, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <Badge className="bg-red-100 text-red-700 border-red-300 px-3 py-1">{skill}</Badge>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Recommendations */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-blue-700 flex items-center space-x-2">
                    <Brain className="w-5 h-5" />
                    <span>Savi's Recommendations</span>
                  </h4>
                  <ul className="space-y-2">
                    {result.recommendations.map((rec, index) => (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.2 }}
                        className="flex items-start space-x-2 text-sm"
                      >
                        <span className="text-blue-500 mt-1">•</span>
                        <span>{rec}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
