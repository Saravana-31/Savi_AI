"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ChevronRight, ChevronLeft, Play, Briefcase, Brain, Code, Server, Database, BarChart3, Terminal, CheckCircle } from "lucide-react"
import type { InterviewConfig } from "@/types/interview"
import { EnhancedBackground } from "@/components/enhanced-background"

interface InterviewConfigModalProps {
    onConfigComplete: (config: InterviewConfig) => void
}

const INTERVIEW_TYPES = [
    {
        value: "mock" as const,
        label: "Mock Interview",
        description: "Practice with AI feedback. No pressure, learn at your pace.",
        icon: Play,
        color: "#00d4ff",
    },
    {
        value: "formal" as const,
        label: "Formal Interview",
        description: "Full-length assessment with advanced behavioral analysis.",
        icon: Briefcase,
        color: "#a855f7",
    },
]

const JOB_ROLES = [
    { value: "Frontend Developer", icon: Code, color: "#00d4ff" },
    { value: "Backend Developer", icon: Server, color: "#a855f7" },
    { value: "Full Stack Developer", icon: Terminal, color: "#00ff9d" },
    { value: "Data Analyst", icon: BarChart3, color: "#f59e0b" },
    { value: "Machine Learning Engineer", icon: Brain, color: "#ec4899" },
    { value: "DevOps Engineer", icon: Database, color: "#06b6d4" },
]

const TOPICS = [
    { value: "DSA", label: "DSA", description: "Data Structures & Algorithms", color: "#00d4ff" },
    { value: "System Design", label: "System Design", description: "Scalable architecture patterns", color: "#a855f7" },
    { value: "Behavioral", label: "Behavioral", description: "STAR method & soft skills", color: "#00ff9d" },
    { value: "Core Subject", label: "Core Subject", description: "Role-specific technical topics", color: "#f59e0b" },
]

export function InterviewConfigModal({ onConfigComplete }: InterviewConfigModalProps) {
    const [step, setStep] = useState(0)
    const [selectedType, setSelectedType] = useState<"mock" | "formal" | null>(null)
    const [selectedRole, setSelectedRole] = useState<string | null>(null)
    const [selectedTopic, setSelectedTopic] = useState<string | null>(null)

    const canProceed = [
        !!selectedType,
        !!selectedRole,
        !!selectedTopic,
    ][step]

    const handleNext = () => {
        if (step < 2) setStep(step + 1)
    }

    const handleBack = () => {
        if (step > 0) setStep(step - 1)
    }

    const handleStart = () => {
        if (selectedType && selectedRole && selectedTopic) {
            onConfigComplete({ type: selectedType, role: selectedRole, topic: selectedTopic })
        }
    }

    const steps = ["Interview Type", "Job Role", "Topic"]

    return (
        <div className="min-h-screen relative flex items-center justify-center p-4">
            <EnhancedBackground />

            <motion.div
                initial={{ opacity: 0, scale: 0.92, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="relative z-10 w-full max-w-2xl"
            >
                {/* Card */}
                <div
                    className="rounded-3xl overflow-hidden"
                    style={{
                        background: "rgba(5, 8, 22, 0.92)",
                        border: "1px solid rgba(0, 212, 255, 0.2)",
                        backdropFilter: "blur(30px)",
                        boxShadow: "0 40px 80px rgba(0,0,0,0.6), 0 0 40px rgba(0,212,255,0.08)",
                    }}
                >
                    {/* Top accent */}
                    <div className="h-0.5 w-full" style={{ background: "linear-gradient(90deg, transparent, #00d4ff, #a855f7, transparent)" }} />

                    {/* Header */}
                    <div className="px-8 pt-8 pb-6 text-center border-b" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                        <motion.div
                            className="w-14 h-14 mx-auto mb-4 rounded-2xl flex items-center justify-center"
                            style={{ background: "linear-gradient(135deg, rgba(0,212,255,0.2) 0%, rgba(168,85,247,0.2) 100%)", border: "1px solid rgba(0,212,255,0.3)" }}
                            animate={{ scale: [1, 1.05, 1] }}
                            transition={{ duration: 3, repeat: Infinity }}
                        >
                            <Brain className="w-7 h-7 text-cyan-400" />
                        </motion.div>
                        <h1 className="text-2xl font-bold text-white mb-1">Configure Your Interview</h1>
                        <p className="text-slate-400 text-sm">Select your preferences to get personalized questions</p>

                        {/* Step indicators */}
                        <div className="flex items-center justify-center space-x-3 mt-5">
                            {steps.map((s, i) => (
                                <div key={i} className="flex items-center">
                                    <div
                                        className="flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-medium transition-all duration-300"
                                        style={
                                            i === step
                                                ? { background: "rgba(0,212,255,0.15)", border: "1px solid rgba(0,212,255,0.4)", color: "#00d4ff" }
                                                : i < step
                                                    ? { background: "rgba(0,255,157,0.1)", border: "1px solid rgba(0,255,157,0.3)", color: "#00ff9d" }
                                                    : { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "#475569" }
                                        }
                                    >
                                        {i < step ? <CheckCircle className="w-3 h-3" /> : <span>{i + 1}</span>}
                                        <span>{s}</span>
                                    </div>
                                    {i < steps.length - 1 && (
                                        <div className="w-6 h-px mx-1" style={{ background: i < step ? "rgba(0,255,157,0.4)" : "rgba(255,255,255,0.08)" }} />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Step Content */}
                    <div className="px-8 py-7">
                        <AnimatePresence mode="wait">

                            {/* Step 0 — Interview Type */}
                            {step === 0 && (
                                <motion.div
                                    key="step0"
                                    initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                                    className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                                >
                                    {INTERVIEW_TYPES.map((t) => (
                                        <motion.button
                                            key={t.value}
                                            onClick={() => setSelectedType(t.value)}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            className="p-6 rounded-2xl text-left transition-all duration-200 focus:outline-none"
                                            style={{
                                                background: selectedType === t.value ? `${t.color}10` : "rgba(255,255,255,0.03)",
                                                border: selectedType === t.value ? `2px solid ${t.color}` : "2px solid rgba(255,255,255,0.08)",
                                                boxShadow: selectedType === t.value ? `0 0 25px ${t.color}25` : "none",
                                            }}
                                        >
                                            <div
                                                className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                                                style={{ background: `${t.color}18`, border: `1px solid ${t.color}30` }}
                                            >
                                                <t.icon className="w-6 h-6" style={{ color: t.color }} />
                                            </div>
                                            <h3 className="font-bold text-white mb-1">{t.label}</h3>
                                            <p className="text-sm text-slate-400 leading-relaxed">{t.description}</p>
                                            {selectedType === t.value && (
                                                <div className="mt-3 flex items-center space-x-1" style={{ color: t.color }}>
                                                    <CheckCircle className="w-4 h-4" />
                                                    <span className="text-xs font-semibold">Selected</span>
                                                </div>
                                            )}
                                        </motion.button>
                                    ))}
                                </motion.div>
                            )}

                            {/* Step 1 — Job Role */}
                            {step === 1 && (
                                <motion.div
                                    key="step1"
                                    initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                                    className="grid grid-cols-2 sm:grid-cols-3 gap-3"
                                >
                                    {JOB_ROLES.map((r) => (
                                        <motion.button
                                            key={r.value}
                                            onClick={() => setSelectedRole(r.value)}
                                            whileHover={{ scale: 1.03 }}
                                            whileTap={{ scale: 0.97 }}
                                            className="p-4 rounded-xl text-center transition-all duration-200 focus:outline-none"
                                            style={{
                                                background: selectedRole === r.value ? `${r.color}12` : "rgba(255,255,255,0.03)",
                                                border: selectedRole === r.value ? `2px solid ${r.color}` : "2px solid rgba(255,255,255,0.08)",
                                                boxShadow: selectedRole === r.value ? `0 0 20px ${r.color}20` : "none",
                                            }}
                                        >
                                            <div
                                                className="w-9 h-9 rounded-xl flex items-center justify-center mx-auto mb-2"
                                                style={{ background: `${r.color}15`, border: `1px solid ${r.color}25` }}
                                            >
                                                <r.icon className="w-5 h-5" style={{ color: r.color }} />
                                            </div>
                                            <p className="text-xs font-semibold text-white leading-tight">{r.value}</p>
                                            {selectedRole === r.value && (
                                                <CheckCircle className="w-3.5 h-3.5 mx-auto mt-1.5" style={{ color: r.color }} />
                                            )}
                                        </motion.button>
                                    ))}
                                </motion.div>
                            )}

                            {/* Step 2 — Topic */}
                            {step === 2 && (
                                <motion.div
                                    key="step2"
                                    initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                                    className="grid grid-cols-2 gap-4"
                                >
                                    {TOPICS.map((t) => (
                                        <motion.button
                                            key={t.value}
                                            onClick={() => setSelectedTopic(t.value)}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            className="p-5 rounded-2xl text-left transition-all duration-200 focus:outline-none"
                                            style={{
                                                background: selectedTopic === t.value ? `${t.color}10` : "rgba(255,255,255,0.03)",
                                                border: selectedTopic === t.value ? `2px solid ${t.color}` : "2px solid rgba(255,255,255,0.08)",
                                                boxShadow: selectedTopic === t.value ? `0 0 20px ${t.color}20` : "none",
                                            }}
                                        >
                                            <p className="font-bold text-white mb-1">{t.label}</p>
                                            <p className="text-xs text-slate-400">{t.description}</p>
                                            {selectedTopic === t.value && (
                                                <div className="mt-2 flex items-center space-x-1" style={{ color: t.color }}>
                                                    <CheckCircle className="w-3.5 h-3.5" />
                                                    <span className="text-xs font-semibold">Selected</span>
                                                </div>
                                            )}
                                        </motion.button>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Footer */}
                    <div className="px-8 pb-8 flex items-center justify-between">
                        <Button
                            onClick={handleBack}
                            disabled={step === 0}
                            variant="outline"
                            className="flex items-center space-x-2 text-slate-300 border-0 bg-transparent hover:text-white"
                            style={{ background: step === 0 ? "transparent" : "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
                        >
                            <ChevronLeft className="w-4 h-4" />
                            <span>Back</span>
                        </Button>

                        {step < 2 ? (
                            <Button
                                onClick={handleNext}
                                disabled={!canProceed}
                                className="flex items-center space-x-2 text-white font-semibold px-6"
                                style={{
                                    background: canProceed ? "linear-gradient(135deg, #00d4ff 0%, #a855f7 100%)" : "rgba(100,116,139,0.3)",
                                    boxShadow: canProceed ? "0 0 20px rgba(0,212,255,0.3)" : "none",
                                }}
                            >
                                <span>Next</span>
                                <ChevronRight className="w-4 h-4" />
                            </Button>
                        ) : (
                            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                                <Button
                                    onClick={handleStart}
                                    disabled={!canProceed}
                                    className="flex items-center space-x-2 text-white font-semibold px-8 py-3"
                                    style={{
                                        background: canProceed ? "linear-gradient(135deg, #00d4ff 0%, #a855f7 100%)" : "rgba(100,116,139,0.3)",
                                        boxShadow: canProceed ? "0 0 25px rgba(0,212,255,0.4)" : "none",
                                    }}
                                >
                                    <Play className="w-5 h-5" />
                                    <span>Start Interview</span>
                                </Button>
                            </motion.div>
                        )}
                    </div>
                </div>
            </motion.div>
        </div>
    )
}
