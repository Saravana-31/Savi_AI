"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Mic, MicOff, Loader2 } from "lucide-react"
import toast from "react-hot-toast"

interface MicButtonProps {
    onTranscript: (text: string) => void
    disabled?: boolean
}

type MicState = "idle" | "listening" | "processing" | "unsupported"

// Extend window type for cross-browser SpeechRecognition
declare global {
    interface Window {
        SpeechRecognition: typeof SpeechRecognition
        webkitSpeechRecognition: typeof SpeechRecognition
    }
}

export function MicButton({ onTranscript, disabled = false }: MicButtonProps) {
    const [micState, setMicState] = useState<MicState>("idle")
    const recognitionRef = useRef<SpeechRecognition | null>(null)

    useEffect(() => {
        // Check for browser support
        const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition
        if (!SpeechRecognitionAPI) {
            setMicState("unsupported")
            return
        }

        const recognition = new SpeechRecognitionAPI()
        recognition.continuous = false
        recognition.interimResults = false
        recognition.lang = "en-US"
        recognition.maxAlternatives = 1

        recognition.onstart = () => {
            setMicState("listening")
        }

        recognition.onresult = (event: SpeechRecognitionEvent) => {
            setMicState("processing")
            const transcript = event.results[0][0].transcript
            if (transcript.trim()) {
                onTranscript(transcript)
                toast.success(`🎙️ Captured: "${transcript.slice(0, 50)}${transcript.length > 50 ? "..." : ""}"`, {
                    duration: 3000,
                    style: {
                        background: "rgba(0, 212, 255, 0.1)",
                        border: "1px solid rgba(0, 212, 255, 0.4)",
                        color: "#cffafe",
                    },
                })
            }
            setTimeout(() => setMicState("idle"), 500)
        }

        recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
            console.error("Speech recognition error:", event.error)
            if (event.error === "no-speech") {
                toast("🎙️ No speech detected. Try again.", {
                    duration: 2000,
                    style: { background: "rgba(100,116,139,0.2)", color: "#94a3b8" },
                })
            } else if (event.error !== "aborted") {
                toast.error(`Mic error: ${event.error}`, { duration: 3000 })
            }
            setMicState("idle")
        }

        recognition.onend = () => {
            if (micState === "listening") {
                setMicState("idle")
            }
        }

        recognitionRef.current = recognition

        return () => {
            recognition.abort()
        }
    }, [])

    const handleToggle = () => {
        if (disabled) return

        if (micState === "unsupported") {
            toast.error("Speech recognition is not supported in this browser. Try Chrome or Edge.", { duration: 4000 })
            return
        }

        if (micState === "listening") {
            recognitionRef.current?.stop()
            setMicState("processing")
            return
        }

        if (micState === "idle") {
            try {
                recognitionRef.current?.start()
                toast("🎙️ Listening... Speak now!", {
                    duration: 2000,
                    style: {
                        background: "rgba(239, 68, 68, 0.1)",
                        border: "1px solid rgba(239, 68, 68, 0.4)",
                        color: "#fca5a5",
                    },
                })
            } catch (err) {
                console.error("Mic start error:", err)
                setMicState("idle")
            }
        }
    }

    const isListening = micState === "listening"
    const isProcessing = micState === "processing"
    const isDisabled = disabled || micState === "unsupported" || micState === "processing"

    return (
        <div className="relative flex items-center justify-center">
            {/* Pulsing ring when listening */}
            <AnimatePresence>
                {isListening && (
                    <>
                        <motion.div
                            initial={{ scale: 1, opacity: 0.8 }}
                            animate={{ scale: 2, opacity: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "easeOut" }}
                            className="absolute inset-0 rounded-full"
                            style={{ background: "rgba(239, 68, 68, 0.4)", zIndex: 0 }}
                        />
                        <motion.div
                            initial={{ scale: 1, opacity: 0.6 }}
                            animate={{ scale: 1.5, opacity: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "easeOut", delay: 0.3 }}
                            className="absolute inset-0 rounded-full"
                            style={{ background: "rgba(239, 68, 68, 0.3)", zIndex: 0 }}
                        />
                    </>
                )}
            </AnimatePresence>

            <motion.button
                type="button"
                onClick={handleToggle}
                disabled={isDisabled}
                whileHover={!isDisabled ? { scale: 1.1 } : {}}
                whileTap={!isDisabled ? { scale: 0.9 } : {}}
                className="relative z-10 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 focus:outline-none"
                title={
                    micState === "unsupported"
                        ? "Speech recognition not supported"
                        : isListening
                            ? "Click to stop recording"
                            : "Click to speak your answer"
                }
                style={{
                    background: isListening
                        ? "rgba(239, 68, 68, 0.9)"
                        : isProcessing
                            ? "rgba(100, 116, 139, 0.5)"
                            : isDisabled
                                ? "rgba(51, 65, 85, 0.5)"
                                : "rgba(0, 212, 255, 0.15)",
                    border: isListening
                        ? "2px solid rgba(239, 68, 68, 0.8)"
                        : isDisabled
                            ? "2px solid rgba(51, 65, 85, 0.4)"
                            : "2px solid rgba(0, 212, 255, 0.4)",
                    boxShadow: isListening
                        ? "0 0 20px rgba(239, 68, 68, 0.5)"
                        : !isDisabled
                            ? "0 0 10px rgba(0, 212, 255, 0.2)"
                            : "none",
                    cursor: isDisabled ? "not-allowed" : "pointer",
                }}
            >
                {isProcessing ? (
                    <Loader2 className="w-5 h-5 text-slate-400 animate-spin" />
                ) : isListening ? (
                    <motion.div
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 0.8, repeat: Infinity }}
                    >
                        <MicOff className="w-5 h-5 text-white" />
                    </motion.div>
                ) : micState === "unsupported" ? (
                    <MicOff className="w-5 h-5 text-slate-600" />
                ) : (
                    <Mic className="w-5 h-5 text-cyan-400" />
                )}
            </motion.button>

            {/* State label */}
            <AnimatePresence>
                {isListening && (
                    <motion.span
                        initial={{ opacity: 0, x: 8 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 8 }}
                        className="absolute left-14 text-xs font-medium text-red-400 whitespace-nowrap"
                    >
                        Listening...
                    </motion.span>
                )}
            </AnimatePresence>
        </div>
    )
}
