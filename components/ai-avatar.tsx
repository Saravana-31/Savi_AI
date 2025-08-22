"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"

interface AiAvatarProps {
  isVisible?: boolean
  isSpeaking?: boolean
  emotion?: "neutral" | "speaking" | "listening" | "thinking" | "happy"
  onGreeting?: () => void
}

export function AiAvatar({ isVisible = true, isSpeaking = false, emotion = "neutral", onGreeting }: AiAvatarProps) {
  const [hasGreeted, setHasGreeted] = useState(false)

  useEffect(() => {
    if (isVisible && !hasGreeted) {
      const timer = setTimeout(() => {
        setHasGreeted(true)
        onGreeting?.()
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [isVisible, hasGreeted, onGreeting])

  if (!isVisible) return null

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, x: 100, y: 100 }}
      animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
      exit={{ opacity: 0, scale: 0.8, x: 100, y: 100 }}
      className="fixed bottom-6 right-6 z-50"
    >
      <div className="relative">
        {/* Avatar Container */}
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
          className="w-24 h-24 bg-gradient-to-br from-slate-900 via-sky-400 to-slate-900 rounded-full flex items-center justify-center shadow-2xl border-4 border-white dark:border-slate-700"
        >
          {/* Robot Face */}
          <div className="relative w-16 h-16 bg-white dark:bg-slate-100 rounded-full flex flex-col items-center justify-center">
            {/* Eyes */}
            <div className="flex space-x-2 mb-1">
              <motion.div
                animate={isSpeaking ? { scaleY: [1, 0.1, 1] } : { scaleY: [1, 0.9, 1] }}
                transition={{
                  duration: isSpeaking ? 0.3 : 2,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatDelay: isSpeaking ? 0 : 1,
                }}
                className="w-2 h-2 bg-slate-900 rounded-full"
              />
              <motion.div
                animate={isSpeaking ? { scaleY: [1, 0.1, 1] } : { scaleY: [1, 0.9, 1] }}
                transition={{
                  duration: isSpeaking ? 0.3 : 2,
                  repeat: Number.POSITIVE_INFINITY,
                  delay: 0.1,
                  repeatDelay: isSpeaking ? 0 : 1,
                }}
                className="w-2 h-2 bg-slate-900 rounded-full"
              />
            </div>

            {/* Mouth */}
            <motion.div
              animate={
                isSpeaking
                  ? { scaleX: [1, 1.5, 1], scaleY: [1, 0.5, 1] }
                  : emotion === "happy"
                    ? { scaleX: [1, 1.2, 1] }
                    : { scaleX: [1, 1.1, 1] }
              }
              transition={{
                duration: isSpeaking ? 0.4 : 2,
                repeat: Number.POSITIVE_INFINITY,
              }}
              className={`w-3 h-1.5 rounded-full ${
                isSpeaking ? "bg-red-400" : emotion === "happy" ? "bg-green-400" : "bg-slate-400"
              }`}
            />
          </div>

          {/* Speaking Animation Ring */}
          {isSpeaking && (
            <motion.div
              animate={{ scale: [1, 1.3, 1], opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
              className="absolute inset-0 border-2 border-sky-400 rounded-full"
            />
          )}
        </motion.div>

        {/* Greeting Wave Animation */}
        {!hasGreeted && (
          <motion.div
            animate={{ rotate: [0, 20, -20, 0] }}
            transition={{ duration: 0.6, repeat: 3 }}
            className="absolute -top-2 -right-2 text-xl"
          >
            👋
          </motion.div>
        )}

        {/* Speech Bubble */}
        {isSpeaking && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute -top-16 -left-20 bg-white dark:bg-slate-800 rounded-lg px-3 py-2 shadow-lg border border-slate-200 dark:border-slate-600"
          >
            <div className="flex space-x-1">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  animate={{ scale: [1, 1.5, 1] }}
                  transition={{
                    duration: 0.6,
                    repeat: Number.POSITIVE_INFINITY,
                    delay: i * 0.2,
                  }}
                  className="w-1 h-1 bg-sky-400 rounded-full"
                />
              ))}
            </div>
            {/* Speech bubble tail */}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-white dark:border-t-slate-800"></div>
          </motion.div>
        )}

        {/* Name Label */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-slate-900 dark:bg-sky-400 text-foreground dark:text-slate-900 px-2 py-1 rounded text-xs font-semibold whitespace-nowrap"
        >
          Ava - AI Assistant
        </motion.div>
      </div>
    </motion.div>
  )
}
