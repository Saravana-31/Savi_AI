"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MessageCircle } from "lucide-react"

interface AiAssistantSaviProps {
  isVisible?: boolean
  isSpeaking?: boolean
  emotion?: "neutral" | "speaking" | "listening" | "thinking" | "happy" | "greeting" | "encouraging"
  onGreeting?: () => void
  message?: string
  showMessage?: boolean
}

export function AiAssistantSavi({
  isVisible = true,
  isSpeaking = false,
  emotion = "neutral",
  onGreeting,
  message,
  showMessage = false,
}: AiAssistantSaviProps) {
  const [hasGreeted, setHasGreeted] = useState(false)
  const [currentEmotion, setCurrentEmotion] = useState(emotion)
  const [isMinimized, setIsMinimized] = useState(false)

  useEffect(() => {
    if (isVisible && !hasGreeted) {
      const timer = setTimeout(() => {
        setHasGreeted(true)
        setCurrentEmotion("greeting")
        onGreeting?.()

        // Savi's greeting with TTS
        if (typeof window !== "undefined" && window.speechSynthesis) {
          const utterance = new SpeechSynthesisUtterance(
            "Hi, I'm Savi — your AI Interview Assistant! I'm here to help you succeed. 😊",
          )
          utterance.rate = 0.9
          utterance.pitch = 1.1
          utterance.volume = 0.8
          window.speechSynthesis.speak(utterance)
        }

        // Return to neutral after greeting
        setTimeout(() => {
          setCurrentEmotion("neutral")
        }, 4000)
      }, 1500)
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
          {/* Main Savi Container */}
          <motion.div
            animate={{
              scale: isSpeaking ? [1, 1.05, 1] : [1, 1.02, 1],
              y: [0, -5, 0],
            }}
            transition={{
              scale: { duration: isSpeaking ? 0.8 : 3, repeat: Number.POSITIVE_INFINITY },
              y: { duration: 4, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" },
            }}
            className="relative w-24 h-32 cursor-pointer"
            onClick={() => setIsMinimized(!isMinimized)}
          >
            {/* Savi's Body */}
            <div className="relative w-full h-full">
              {/* Head */}
              <motion.div
                animate={{
                  rotate: isSpeaking ? [-2, 2, -2] : [0, 1, 0],
                }}
                transition={{
                  duration: isSpeaking ? 0.5 : 3,
                  repeat: Number.POSITIVE_INFINITY,
                }}
                className="absolute top-0 left-1/2 transform -translate-x-1/2 w-16 h-16 rounded-full overflow-hidden shadow-xl"
                style={{
                  background: "linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)",
                  border: "3px solid #f59e0b",
                }}
              >
                {/* Face */}
                <div className="absolute inset-2 bg-gradient-to-b from-pink-100 to-pink-50 rounded-full flex flex-col items-center justify-center">
                  {/* Antenna */}
                  <motion.div
                    animate={{
                      rotate: [0, 10, -10, 0],
                      scale: isSpeaking ? [1, 1.2, 1] : 1,
                    }}
                    transition={{
                      duration: 2,
                      repeat: Number.POSITIVE_INFINITY,
                    }}
                    className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-1 h-4 bg-gradient-to-t from-purple-400 to-purple-600 rounded-full"
                  >
                    <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-purple-500 rounded-full shadow-lg">
                      <motion.div
                        animate={{
                          scale: [1, 1.5, 1],
                          opacity: [0.7, 1, 0.7],
                        }}
                        transition={{
                          duration: 1,
                          repeat: Number.POSITIVE_INFINITY,
                        }}
                        className="w-full h-full bg-purple-300 rounded-full"
                      />
                    </div>
                  </motion.div>

                  {/* Eyes */}
                  <div className="flex space-x-2 mb-1 mt-1">
                    <motion.div
                      animate={
                        isSpeaking
                          ? { scaleY: [1, 0.1, 1], backgroundColor: ["#1f2937", "#3b82f6", "#1f2937"] }
                          : currentEmotion === "greeting"
                            ? { scaleX: [1, 0.1, 1], scaleY: [1, 1.5, 1] }
                            : currentEmotion === "happy" || currentEmotion === "encouraging"
                              ? { scaleY: [1, 0.7, 1] }
                              : { scaleY: [1, 0.9, 1] }
                      }
                      transition={{
                        duration: isSpeaking ? 0.3 : currentEmotion === "greeting" ? 0.5 : 2,
                        repeat: Number.POSITIVE_INFINITY,
                        repeatDelay: isSpeaking ? 0 : 1,
                      }}
                      className="w-2 h-2 bg-slate-800 rounded-full"
                    />
                    <motion.div
                      animate={
                        isSpeaking
                          ? { scaleY: [1, 0.1, 1], backgroundColor: ["#1f2937", "#3b82f6", "#1f2937"] }
                          : currentEmotion === "greeting"
                            ? { scaleX: [1, 0.1, 1], scaleY: [1, 1.5, 1] }
                            : currentEmotion === "happy" || currentEmotion === "encouraging"
                              ? { scaleY: [1, 0.7, 1] }
                              : { scaleY: [1, 0.9, 1] }
                      }
                      transition={{
                        duration: isSpeaking ? 0.3 : currentEmotion === "greeting" ? 0.5 : 2,
                        repeat: Number.POSITIVE_INFINITY,
                        delay: 0.1,
                        repeatDelay: isSpeaking ? 0 : 1,
                      }}
                      className="w-2 h-2 bg-slate-800 rounded-full"
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
                        : currentEmotion === "happy" || currentEmotion === "encouraging"
                          ? {
                              scaleX: [1, 1.3, 1],
                              backgroundColor: ["#22c55e", "#16a34a", "#22c55e"],
                              borderRadius: ["50%", "50% 50% 50% 50%", "50%"],
                            }
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
                    className="w-3 h-1.5 bg-slate-600 rounded-full"
                  />

                  {/* Cheek indicators for happy emotions */}
                  {(currentEmotion === "happy" ||
                    currentEmotion === "greeting" ||
                    currentEmotion === "encouraging") && (
                    <>
                      <motion.div
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="absolute top-3 left-1 w-1.5 h-1.5 bg-pink-400 rounded-full"
                      />
                      <motion.div
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="absolute top-3 right-1 w-1.5 h-1.5 bg-pink-400 rounded-full"
                      />
                    </>
                  )}
                </div>
              </motion.div>

              {/* Body */}
              <motion.div
                animate={{
                  scaleY: isSpeaking ? [1, 1.05, 1] : 1,
                }}
                transition={{
                  duration: 0.8,
                  repeat: Number.POSITIVE_INFINITY,
                }}
                className="absolute top-12 left-1/2 transform -translate-x-1/2 w-12 h-16 rounded-2xl shadow-lg"
                style={{
                  background: "linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)",
                  border: "2px solid #6366f1",
                }}
              >
                {/* Chest panel */}
                <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-8 h-6 bg-gradient-to-b from-blue-100 to-blue-200 rounded-lg border border-blue-300">
                  <motion.div
                    animate={{
                      opacity: [0.5, 1, 0.5],
                      scale: [1, 1.1, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Number.POSITIVE_INFINITY,
                    }}
                    className="absolute top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-emerald-400 rounded-full"
                  />
                </div>

                {/* Arms */}
                <motion.div
                  animate={{
                    rotate: isSpeaking ? [-10, 10, -10] : [0, 5, 0],
                  }}
                  transition={{
                    duration: isSpeaking ? 0.6 : 3,
                    repeat: Number.POSITIVE_INFINITY,
                  }}
                  className="absolute top-1 -left-2 w-3 h-8 bg-gradient-to-b from-purple-200 to-purple-300 rounded-full border border-purple-400"
                />
                <motion.div
                  animate={{
                    rotate: isSpeaking ? [10, -10, 10] : [0, -5, 0],
                  }}
                  transition={{
                    duration: isSpeaking ? 0.6 : 3,
                    repeat: Number.POSITIVE_INFINITY,
                  }}
                  className="absolute top-1 -right-2 w-3 h-8 bg-gradient-to-b from-purple-200 to-purple-300 rounded-full border border-purple-400"
                />
              </motion.div>

              {/* Legs */}
              <motion.div
                animate={{
                  scaleY: [1, 0.95, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                }}
                className="absolute bottom-0 left-1/2 transform -translate-x-1/2 flex space-x-1"
              >
                <div className="w-2 h-6 bg-gradient-to-b from-indigo-200 to-indigo-300 rounded-full border border-indigo-400" />
                <div className="w-2 h-6 bg-gradient-to-b from-indigo-200 to-indigo-300 rounded-full border border-indigo-400" />
              </motion.div>
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
              transition={{ duration: 2, repeat: 3 }}
              className="absolute -top-2 -right-2 text-xl"
            >
              👋
            </motion.div>
          )}

          {/* Encouraging thumbs up */}
          {currentEmotion === "encouraging" && (
            <motion.div
              animate={{
                y: [0, -5, 0],
                scale: [1, 1.2, 1],
              }}
              transition={{ duration: 1, repeat: 2 }}
              className="absolute -top-2 -right-2 text-xl"
            >
              👍
            </motion.div>
          )}

          {/* Speech Bubble */}
          {(isSpeaking || showMessage) && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 10 }}
              className="absolute -top-20 -left-16 bg-white dark:bg-slate-800 rounded-2xl px-4 py-3 shadow-xl border border-white/20 max-w-xs"
              style={{
                background: "linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.9) 100%)",
                backdropFilter: "blur(10px)",
              }}
            >
              {isSpeaking && !message && (
                <div className="flex space-x-1">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      animate={{
                        scale: [1, 1.5, 1],
                        backgroundColor: ["#10b981", "#3b82f6", "#a855f7", "#10b981"],
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
              )}

              {message && <div className="text-sm text-slate-800 dark:text-slate-200 font-medium">{message}</div>}

              {/* Speech bubble tail */}
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-6 border-transparent border-t-white dark:border-t-slate-800"></div>
            </motion.div>
          )}

          {/* Floating particles around Savi */}
          {(isSpeaking || currentEmotion === "greeting") && (
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{
                    opacity: 0,
                    x: Math.cos((i * 60 * Math.PI) / 180) * 30,
                    y: Math.sin((i * 60 * Math.PI) / 180) * 30,
                  }}
                  animate={{
                    opacity: [0, 1, 0],
                    scale: [0.5, 1, 0.5],
                    x: Math.cos((i * 60 * Math.PI) / 180) * 50,
                    y: Math.sin((i * 60 * Math.PI) / 180) * 50,
                  }}
                  transition={{
                    duration: 2,
                    repeat: Number.POSITIVE_INFINITY,
                    delay: i * 0.3,
                  }}
                  className="absolute top-1/2 left-1/2 w-1.5 h-1.5 bg-gradient-to-r from-emerald-400 to-sky-400 rounded-full"
                />
              ))}
            </div>
          )}

          {/* Name Label with Glow */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 px-3 py-1 rounded-full text-xs font-bold text-foreground whitespace-nowrap"
            style={{
              background: "linear-gradient(135deg, #10b981 0%, #3b82f6 50%, #a855f7 100%)",
              boxShadow: "0 10px 25px rgba(16, 185, 129, 0.3)",
            }}
          >
            Savi - AI Assistant
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
                "radial-gradient(circle, rgba(16, 185, 129, 0.3) 0%, rgba(59, 130, 246, 0.2) 50%, rgba(168, 85, 247, 0.1) 100%)",
              filter: "blur(20px)",
              transform: "scale(1.5)",
            }}
          />

          {/* Chat bubble indicator */}
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
            className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-emerald-400 to-blue-400 rounded-full flex items-center justify-center"
          >
            <MessageCircle className="w-2 h-2 text-foreground" />
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
