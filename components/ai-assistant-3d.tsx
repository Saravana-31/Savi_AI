"use client"

import { useEffect, useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Volume2 } from "lucide-react"

interface AiAssistant3DProps {
  isVisible?: boolean
  isSpeaking?: boolean
  emotion?: "neutral" | "speaking" | "listening" | "thinking" | "happy" | "greeting"
  onGreeting?: () => void
}

export function AiAssistant3D({
  isVisible = true,
  isSpeaking = false,
  emotion = "neutral",
  onGreeting,
}: AiAssistant3DProps) {
  const [hasGreeted, setHasGreeted] = useState(false)
  const [currentEmotion, setCurrentEmotion] = useState(emotion)
  const [isInitialized, setIsInitialized] = useState(false)
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null)

  useEffect(() => {
    if (isVisible && !isInitialized) {
      setIsInitialized(true)

      // Delay greeting to ensure everything is loaded
      const timer = setTimeout(() => {
        if (!hasGreeted) {
          performGreeting()
        }
      }, 2000)

      return () => clearTimeout(timer)
    }
  }, [isVisible, isInitialized, hasGreeted])

  useEffect(() => {
    if (hasGreeted) {
      setCurrentEmotion(isSpeaking ? "speaking" : emotion)
    }
  }, [isSpeaking, emotion, hasGreeted])

  const performGreeting = () => {
    if (hasGreeted) return

    setHasGreeted(true)
    setCurrentEmotion("greeting")
    onGreeting?.()

    // Speak greeting with enhanced voice
    if (typeof window !== "undefined" && window.speechSynthesis) {
      // Cancel any existing speech
      window.speechSynthesis.cancel()

      const utterance = new SpeechSynthesisUtterance("Hello! I'm Ava, your AI Interview Assistant. Let's get started.")
      utterance.rate = 0.9
      utterance.pitch = 1.2
      utterance.volume = 0.8

      // Try to use a female voice if available
      const voices = window.speechSynthesis.getVoices()
      const femaleVoice = voices.find(
        (voice) =>
          voice.name.toLowerCase().includes("female") ||
          voice.name.toLowerCase().includes("woman") ||
          voice.name.toLowerCase().includes("samantha") ||
          voice.name.toLowerCase().includes("karen"),
      )

      if (femaleVoice) {
        utterance.voice = femaleVoice
      }

      speechRef.current = utterance
      window.speechSynthesis.speak(utterance)
    }

    // Return to neutral after greeting
    setTimeout(() => {
      setCurrentEmotion("neutral")
    }, 4000)
  }

  if (!isVisible) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 100 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8, y: 100 }}
        className="fixed bottom-6 right-6 z-50"
      >
        <div className="relative">
          {/* Main 3D Avatar Container */}
          <motion.div
            animate={{
              y: isSpeaking ? [0, -8, 0] : [0, -4, 0],
              scale: isSpeaking ? [1, 1.05, 1] : [1, 1.02, 1],
            }}
            transition={{
              duration: isSpeaking ? 1.2 : 2.5,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
            className="relative"
          >
            {/* 3D Body */}
            <div className="relative">
              {/* Torso */}
              <motion.div
                className="w-20 h-32 rounded-2xl relative overflow-hidden"
                style={{
                  background: "linear-gradient(135deg, #1e293b 0%, #334155 50%, #475569 100%)",
                  boxShadow: "0 20px 40px rgba(0, 0, 0, 0.3), inset 0 2px 4px rgba(255, 255, 255, 0.1)",
                }}
              >
                {/* Chest Panel */}
                <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-12 h-16 rounded-lg bg-gradient-to-b from-sky-400/20 to-emerald-400/20 border border-white/10">
                  {/* Heart/Core Light */}
                  <motion.div
                    animate={{
                      scale: isSpeaking ? [1, 1.3, 1] : [1, 1.1, 1],
                      opacity: [0.6, 1, 0.6],
                    }}
                    transition={{
                      duration: isSpeaking ? 0.8 : 2,
                      repeat: Number.POSITIVE_INFINITY,
                    }}
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-gradient-to-r from-emerald-400 to-sky-400"
                    style={{
                      boxShadow: "0 0 20px rgba(74, 222, 128, 0.6)",
                    }}
                  />
                </div>

                {/* Arms */}
                <motion.div
                  animate={{
                    rotate: isSpeaking ? [0, 5, -5, 0] : [0, 2, -2, 0],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Number.POSITIVE_INFINITY,
                  }}
                  className="absolute -left-3 top-6 w-6 h-16 rounded-full bg-gradient-to-b from-slate-600 to-slate-700"
                  style={{
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
                  }}
                />
                <motion.div
                  animate={{
                    rotate: isSpeaking ? [0, -5, 5, 0] : [0, -2, 2, 0],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Number.POSITIVE_INFINITY,
                    delay: 0.5,
                  }}
                  className="absolute -right-3 top-6 w-6 h-16 rounded-full bg-gradient-to-b from-slate-600 to-slate-700"
                  style={{
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
                  }}
                />
              </motion.div>

              {/* Head */}
              <motion.div
                animate={{
                  rotate: isSpeaking ? [0, 3, -3, 0] : [0, 1, -1, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Number.POSITIVE_INFINITY,
                }}
                className="absolute -top-8 left-1/2 transform -translate-x-1/2 w-16 h-16 rounded-full relative overflow-hidden"
                style={{
                  background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
                  boxShadow: "0 10px 25px rgba(0, 0, 0, 0.2), inset 0 2px 4px rgba(255, 255, 255, 0.8)",
                }}
              >
                {/* Face Features */}
                <div className="absolute inset-2 flex flex-col items-center justify-center">
                  {/* Eyes */}
                  <div className="flex space-x-2 mb-1">
                    <motion.div
                      animate={
                        isSpeaking
                          ? {
                              scaleY: [1, 0.1, 1],
                              backgroundColor: ["#3b82f6", "#10b981", "#3b82f6"],
                            }
                          : currentEmotion === "greeting"
                            ? { scaleX: [1, 0.1, 1], scaleY: [1, 1.5, 1] }
                            : { scaleY: [1, 0.8, 1] }
                      }
                      transition={{
                        duration: isSpeaking ? 0.4 : currentEmotion === "greeting" ? 0.6 : 3,
                        repeat: Number.POSITIVE_INFINITY,
                        repeatDelay: isSpeaking ? 0 : 2,
                      }}
                      className="w-2 h-2 bg-blue-500 rounded-full"
                    />
                    <motion.div
                      animate={
                        isSpeaking
                          ? {
                              scaleY: [1, 0.1, 1],
                              backgroundColor: ["#3b82f6", "#10b981", "#3b82f6"],
                            }
                          : currentEmotion === "greeting"
                            ? { scaleX: [1, 0.1, 1], scaleY: [1, 1.5, 1] }
                            : { scaleY: [1, 0.8, 1] }
                      }
                      transition={{
                        duration: isSpeaking ? 0.4 : currentEmotion === "greeting" ? 0.6 : 3,
                        repeat: Number.POSITIVE_INFINITY,
                        delay: 0.1,
                        repeatDelay: isSpeaking ? 0 : 2,
                      }}
                      className="w-2 h-2 bg-blue-500 rounded-full"
                    />
                  </div>

                  {/* Mouth */}
                  <motion.div
                    animate={
                      isSpeaking
                        ? {
                            scaleX: [1, 1.5, 1],
                            scaleY: [1, 0.5, 1],
                            backgroundColor: ["#ef4444", "#f97316", "#ef4444"],
                          }
                        : currentEmotion === "happy" || currentEmotion === "greeting"
                          ? {
                              scaleX: [1, 1.2, 1],
                              backgroundColor: ["#10b981", "#059669", "#10b981"],
                            }
                          : { scaleX: [1, 1.05, 1] }
                    }
                    transition={{
                      duration: isSpeaking ? 0.5 : 2.5,
                      repeat: Number.POSITIVE_INFINITY,
                    }}
                    className="w-3 h-1 bg-slate-600 rounded-full"
                  />
                </div>

                {/* Head Glow */}
                <motion.div
                  animate={{
                    opacity: isSpeaking ? [0.3, 0.8, 0.3] : [0.2, 0.4, 0.2],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Number.POSITIVE_INFINITY,
                  }}
                  className="absolute inset-0 rounded-full bg-gradient-to-r from-emerald-400/20 to-sky-400/20"
                />
              </motion.div>

              {/* Legs */}
              <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                <motion.div
                  animate={{
                    scaleY: isSpeaking ? [1, 1.1, 1] : [1, 1.05, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Number.POSITIVE_INFINITY,
                  }}
                  className="w-4 h-8 rounded-full bg-gradient-to-b from-slate-600 to-slate-800"
                  style={{
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
                  }}
                />
                <motion.div
                  animate={{
                    scaleY: isSpeaking ? [1, 1.1, 1] : [1, 1.05, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Number.POSITIVE_INFINITY,
                    delay: 0.3,
                  }}
                  className="w-4 h-8 rounded-full bg-gradient-to-b from-slate-600 to-slate-800"
                  style={{
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
                  }}
                />
              </div>
            </div>
          </motion.div>

          {/* Greeting Wave Animation */}
          {currentEmotion === "greeting" && (
            <motion.div
              animate={{
                rotate: [0, 25, -25, 25, -25, 0],
                scale: [1, 1.3, 1],
              }}
              transition={{ duration: 2.5, repeat: 3 }}
              className="absolute -top-12 -right-4 text-3xl"
            >
              👋
            </motion.div>
          )}

          {/* Speech Bubble */}
          {isSpeaking && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 10 }}
              className="absolute -top-24 -left-20 rounded-2xl px-6 py-4 shadow-xl border border-white/20 min-w-[200px]"
              style={{
                background: "linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.9) 100%)",
                backdropFilter: "blur(15px)",
              }}
            >
              <div className="flex items-center space-x-3">
                <Volume2 className="w-4 h-4 text-emerald-500" />
                <div className="flex space-x-1">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      animate={{
                        scale: [1, 1.8, 1],
                        backgroundColor: ["#10b981", "#3b82f6", "#a855f7", "#10b981"],
                      }}
                      transition={{
                        duration: 1,
                        repeat: Number.POSITIVE_INFINITY,
                        delay: i * 0.2,
                      }}
                      className="w-2 h-2 bg-emerald-500 rounded-full"
                    />
                  ))}
                </div>
                <span className="text-sm font-medium text-slate-700">Speaking...</span>
              </div>
              {/* Speech bubble tail */}
              <div className="absolute top-full left-8 w-0 h-0 border-l-4 border-r-4 border-t-6 border-transparent border-t-white/90"></div>
            </motion.div>
          )}

          {/* Floating Energy Particles */}
          {isSpeaking && (
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{
                    opacity: 0,
                    x: Math.cos((i * 45 * Math.PI) / 180) * 30,
                    y: Math.sin((i * 45 * Math.PI) / 180) * 30,
                  }}
                  animate={{
                    opacity: [0, 1, 0],
                    scale: [0.5, 1.2, 0.5],
                    x: Math.cos((i * 45 * Math.PI) / 180) * 50,
                    y: Math.sin((i * 45 * Math.PI) / 180) * 50,
                  }}
                  transition={{
                    duration: 2.5,
                    repeat: Number.POSITIVE_INFINITY,
                    delay: i * 0.3,
                  }}
                  className="absolute top-1/2 left-1/2 w-2 h-2 rounded-full"
                  style={{
                    background: `linear-gradient(45deg, ${
                      i % 3 === 0 ? "#10b981" : i % 3 === 1 ? "#3b82f6" : "#a855f7"
                    }, ${i % 3 === 0 ? "#059669" : i % 3 === 1 ? "#1d4ed8" : "#7c3aed"})`,
                    boxShadow: `0 0 10px ${
                      i % 3 === 0
                        ? "rgba(16, 185, 129, 0.6)"
                        : i % 3 === 1
                          ? "rgba(59, 130, 246, 0.6)"
                          : "rgba(168, 85, 247, 0.6)"
                    }`,
                  }}
                />
              ))}
            </div>
          )}

          {/* Name Label */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded-full text-xs font-bold text-foreground whitespace-nowrap"
            style={{
              background: "linear-gradient(135deg, #10b981 0%, #3b82f6 50%, #a855f7 100%)",
              boxShadow: "0 10px 25px rgba(16, 185, 129, 0.3)",
            }}
          >
            Ava - AI Assistant
          </motion.div>

          {/* Ambient Glow */}
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: 4,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
            className="absolute inset-0 rounded-full -z-10"
            style={{
              background:
                "radial-gradient(circle, rgba(16, 185, 129, 0.3) 0%, rgba(59, 130, 246, 0.2) 50%, rgba(168, 85, 247, 0.1) 100%)",
              filter: "blur(25px)",
              transform: "scale(2)",
            }}
          />
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
