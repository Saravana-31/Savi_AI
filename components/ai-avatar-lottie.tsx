"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface AiAvatarLottieProps {
  isVisible?: boolean
  isSpeaking?: boolean
  emotion?: "neutral" | "speaking" | "listening" | "thinking" | "happy" | "greeting"
  onGreeting?: () => void
}

export function AiAvatarLottie({
  isVisible = true,
  isSpeaking = false,
  emotion = "neutral",
  onGreeting,
}: AiAvatarLottieProps) {
  const [hasGreeted, setHasGreeted] = useState(false)
  const [currentEmotion, setCurrentEmotion] = useState(emotion)

  useEffect(() => {
    if (isVisible && !hasGreeted) {
      const timer = setTimeout(() => {
        setHasGreeted(true)
        setCurrentEmotion("greeting")
        onGreeting?.()

        // Call the speech service to greet
        if (typeof window !== "undefined" && window.speechSynthesis) {
          const utterance = new SpeechSynthesisUtterance("Hi, I'm Ava — your AI interview assistant")
          utterance.rate = 0.9
          utterance.pitch = 1.1
          window.speechSynthesis.speak(utterance)
        }

        // Return to neutral after greeting
        setTimeout(() => {
          setCurrentEmotion("neutral")
        }, 3000)
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [isVisible, hasGreeted, onGreeting])

  useEffect(() => {
    if (hasGreeted) {
      setCurrentEmotion(isSpeaking ? "speaking" : emotion)
    }
  }, [isSpeaking, emotion, hasGreeted])

  if (!isVisible) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.8, x: 100, y: 100 }}
        animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
        exit={{ opacity: 0, scale: 0.8, x: 100, y: 100 }}
        className="fixed bottom-6 right-6 z-50"
      >
        <div className="relative">
          {/* Main Avatar Container */}
          <motion.div
            animate={{
              scale: isSpeaking ? [1, 1.05, 1] : [1, 1.02, 1],
              rotate: isSpeaking ? [0, 1, -1, 0] : [0, 0.5, -0.5, 0],
            }}
            transition={{
              duration: isSpeaking ? 0.8 : 3,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
            }}
            className="relative w-28 h-28 rounded-full overflow-hidden shadow-2xl"
            style={{
              background: "linear-gradient(135deg, #4ade80 0%, #38bdf8 50%, #a855f7 100%)",
              boxShadow: isSpeaking
                ? "0 0 40px rgba(74, 222, 128, 0.6), 0 0 80px rgba(56, 189, 248, 0.4)"
                : "0 20px 40px rgba(0, 0, 0, 0.3)",
            }}
          >
            {/* Animated Robot Face */}
            <div className="absolute inset-2 bg-white dark:bg-slate-100 rounded-full flex flex-col items-center justify-center">
              {/* Eyes */}
              <div className="flex space-x-3 mb-2">
                <motion.div
                  animate={
                    isSpeaking
                      ? { scaleY: [1, 0.1, 1], backgroundColor: ["#4ade80", "#38bdf8", "#4ade80"] }
                      : currentEmotion === "greeting"
                        ? { scaleX: [1, 0.1, 1], scaleY: [1, 1.5, 1] }
                        : { scaleY: [1, 0.9, 1] }
                  }
                  transition={{
                    duration: isSpeaking ? 0.3 : currentEmotion === "greeting" ? 0.5 : 2,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatDelay: isSpeaking ? 0 : 1,
                  }}
                  className="w-3 h-3 bg-slate-800 rounded-full"
                />
                <motion.div
                  animate={
                    isSpeaking
                      ? { scaleY: [1, 0.1, 1], backgroundColor: ["#4ade80", "#38bdf8", "#4ade80"] }
                      : currentEmotion === "greeting"
                        ? { scaleX: [1, 0.1, 1], scaleY: [1, 1.5, 1] }
                        : { scaleY: [1, 0.9, 1] }
                  }
                  transition={{
                    duration: isSpeaking ? 0.3 : currentEmotion === "greeting" ? 0.5 : 2,
                    repeat: Number.POSITIVE_INFINITY,
                    delay: 0.1,
                    repeatDelay: isSpeaking ? 0 : 1,
                  }}
                  className="w-3 h-3 bg-slate-800 rounded-full"
                />
              </div>

              {/* Mouth */}
              <motion.div
                animate={
                  isSpeaking
                    ? {
                        scaleX: [1, 1.8, 1],
                        scaleY: [1, 0.3, 1],
                        backgroundColor: ["#ef4444", "#f97316", "#ef4444"],
                      }
                    : currentEmotion === "happy"
                      ? { scaleX: [1, 1.3, 1], backgroundColor: ["#22c55e", "#16a34a", "#22c55e"] }
                      : currentEmotion === "greeting"
                        ? {
                            scaleX: [1, 1.5, 1],
                            scaleY: [1, 0.5, 1],
                            backgroundColor: ["#8b5cf6", "#a855f7", "#8b5cf6"],
                          }
                        : { scaleX: [1, 1.1, 1] }
                }
                transition={{
                  duration: isSpeaking ? 0.4 : 2,
                  repeat: Number.POSITIVE_INFINITY,
                }}
                className="w-4 h-2 bg-slate-600 rounded-full"
              />

              {/* Cheek indicators for emotions */}
              {(currentEmotion === "happy" || currentEmotion === "greeting") && (
                <>
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute top-4 left-3 w-2 h-2 bg-pink-400 rounded-full"
                  />
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute top-4 right-3 w-2 h-2 bg-pink-400 rounded-full"
                  />
                </>
              )}
            </div>

            {/* Speaking Animation Rings */}
            {isSpeaking && (
              <>
                <motion.div
                  animate={{ scale: [1, 1.4, 1], opacity: [0.8, 1, 0.8] }}
                  transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
                  className="absolute inset-0 border-4 border-emerald-400 rounded-full"
                />
                <motion.div
                  animate={{ scale: [1, 1.6, 1], opacity: [0.6, 0.8, 0.6] }}
                  transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, delay: 0.2 }}
                  className="absolute inset-0 border-2 border-sky-400 rounded-full"
                />
              </>
            )}
          </motion.div>

          {/* Greeting Wave Animation */}
          {currentEmotion === "greeting" && (
            <motion.div
              animate={{
                rotate: [0, 20, -20, 20, -20, 0],
                scale: [1, 1.2, 1],
              }}
              transition={{ duration: 2, repeat: 2 }}
              className="absolute -top-3 -right-3 text-2xl"
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
              className="absolute -top-20 -left-16 bg-white dark:bg-slate-800 rounded-2xl px-4 py-3 shadow-xl border border-white/20"
              style={{
                background: "linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.9) 100%)",
                backdropFilter: "blur(10px)",
              }}
            >
              <div className="flex space-x-1">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    animate={{
                      scale: [1, 1.5, 1],
                      backgroundColor: ["#4ade80", "#38bdf8", "#a855f7", "#4ade80"],
                    }}
                    transition={{
                      duration: 0.8,
                      repeat: Number.POSITIVE_INFINITY,
                      delay: i * 0.2,
                    }}
                    className="w-2 h-2 bg-emerald-400 rounded-full"
                  />
                ))}
              </div>
              {/* Speech bubble tail */}
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-6 border-transparent border-t-white dark:border-t-slate-800"></div>
            </motion.div>
          )}

          {/* Floating particles around avatar */}
          {isSpeaking && (
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{
                    opacity: 0,
                    x: Math.cos((i * 60 * Math.PI) / 180) * 40,
                    y: Math.sin((i * 60 * Math.PI) / 180) * 40,
                  }}
                  animate={{
                    opacity: [0, 1, 0],
                    scale: [0.5, 1, 0.5],
                    x: Math.cos((i * 60 * Math.PI) / 180) * 60,
                    y: Math.sin((i * 60 * Math.PI) / 180) * 60,
                  }}
                  transition={{
                    duration: 2,
                    repeat: Number.POSITIVE_INFINITY,
                    delay: i * 0.3,
                  }}
                  className="absolute top-1/2 left-1/2 w-2 h-2 bg-gradient-to-r from-emerald-400 to-sky-400 rounded-full"
                />
              ))}
            </div>
          )}

          {/* Name Label with Glow */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded-full text-xs font-bold text-foreground whitespace-nowrap"
            style={{
              background: "linear-gradient(135deg, #4ade80 0%, #38bdf8 50%, #a855f7 100%)",
              boxShadow: "0 10px 25px rgba(74, 222, 128, 0.3)",
            }}
          >
            Ava - AI Assistant
          </motion.div>

          {/* Ambient glow effect */}
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 3,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
            className="absolute inset-0 rounded-full -z-10"
            style={{
              background:
                "radial-gradient(circle, rgba(74, 222, 128, 0.3) 0%, rgba(56, 189, 248, 0.2) 50%, rgba(168, 85, 247, 0.1) 100%)",
              filter: "blur(20px)",
              transform: "scale(1.5)",
            }}
          />
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
