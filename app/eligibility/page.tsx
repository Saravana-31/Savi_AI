"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight, ArrowLeft, Target } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { AnimatedPage } from "@/components/animated-page"
import { EnhancedBackground } from "@/components/enhanced-background"
import { ResumeChecker } from "@/components/resume-checker"
import { AiAssistantSavi } from "@/components/ai-assistant-savi"
import toast from "react-hot-toast"

interface EligibilityResult {
  isEligible: boolean
  matchPercentage: number
  matchedSkills: any[]
  missingSkills: string[]
  recommendations: string[]
  jobTitle?: string
  jobDescription?: string
}

export default function EligibilityPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [eligibilityResult, setEligibilityResult] = useState<EligibilityResult | null>(null)

  const handleEligibilityResult = (result: EligibilityResult) => {
    setEligibilityResult(result)
  }

  const handleStartJobBasedInterview = () => {
    if (eligibilityResult?.isEligible) {
      toast.success(`🎯 Starting interview for ${eligibilityResult.jobTitle}!`, {
        duration: 4000,
        style: {
          background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
          color: "white",
        },
      })

      // Store job context for the interview
      const jobContext = {
        jobTitle: eligibilityResult.jobTitle,
        jobDescription: eligibilityResult.jobDescription,
        matchedSkills: eligibilityResult.matchedSkills.map((skill) => skill.skill),
        matchPercentage: eligibilityResult.matchPercentage,
      }

      // Store in sessionStorage for the interview
      sessionStorage.setItem("jobContext", JSON.stringify(jobContext))

      setTimeout(() => {
        router.push("/interview")
      }, 1000)
    }
  }

  const handleGoBack = () => {
    router.push("/welcome")
  }

  return (
    <AnimatedPage>
      <EnhancedBackground />
      <Navbar />

      <div className="min-h-screen pt-20 pb-12 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gradient mb-4">Check Your Eligibility</h1>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
              Upload your resume and let Savi determine if you meet the job requirements before proceeding to the
              interview.
            </p>
          </motion.div>

          {/* Resume Checker */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <ResumeChecker onEligibilityResult={handleEligibilityResult} />
          </motion.div>

          {/* Action Buttons */}
          {eligibilityResult && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center mt-12"
            >
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  onClick={handleGoBack}
                  variant="outline"
                  className="px-8 py-4 text-lg font-semibold glass border-white/20 hover:bg-white/10 bg-transparent"
                >
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  Go Back
                </Button>
              </motion.div>

              {eligibilityResult.isEligible && (
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    onClick={handleStartJobBasedInterview}
                    className="px-8 py-4 text-lg font-bold btn-glow"
                    style={{
                      background: "linear-gradient(135deg, #10b981 0%, #3b82f6 100%)",
                      boxShadow: "0 20px 40px rgba(16, 185, 129, 0.3)",
                    }}
                  >
                    <Target className="w-5 h-5 mr-2" />
                    Start Interview Based on This Job
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </motion.div>
              )}
            </motion.div>
          )}
        </div>
      </div>

      {/* AI Assistant */}
      <AiAssistantSavi isVisible={true} emotion="neutral" />
    </AnimatedPage>
  )
}
