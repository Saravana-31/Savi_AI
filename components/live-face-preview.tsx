"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import { Camera, CameraOff, Eye, AlertTriangle, CheckCircle, Loader2, GripVertical } from "lucide-react"
import { faceDetectionService, type EmotionData } from "@/lib/face-detection"
import toast from "react-hot-toast"

interface LiveFacePreviewProps {
  isVisible: boolean
  onEmotionDetected: (emotion: EmotionData) => void
  onCameraReady: (ready: boolean) => void
}

export function LiveFacePreview({ isVisible, onEmotionDetected, onCameraReady }: LiveFacePreviewProps) {
  const [isCameraActive, setIsCameraActive] = useState(false)
  const [isInitializing, setIsInitializing] = useState(false)
  const [currentEmotion, setCurrentEmotion] = useState<EmotionData | null>(null)
  const [cameraError, setCameraError] = useState<string | null>(null)
  const [retryCount, setRetryCount] = useState(0)

  // Drag state
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const dragStartRef = useRef({ mouseX: 0, mouseY: 0, posX: 0, posY: 0 })
  const panelRef = useRef<HTMLDivElement>(null)

  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  // Track when we last got a real face detection — for stale-state guard
  const lastDetectedRef = useRef<number>(0)
  const stalenessTimerRef = useRef<NodeJS.Timeout | null>(null)

  // Initialize position: top-right of viewport
  useEffect(() => {
    const right = 24
    const top = 88 // below navbar
    setPosition({ x: window.innerWidth - 320 - right, y: top })
  }, [])

  useEffect(() => {
    if (isVisible) {
      initializeFaceDetection()
    }
    return () => { cleanup() }
  }, [isVisible])

  const initializeFaceDetection = async () => {
    try {
      await faceDetectionService.initialize()
    } catch (error) {
      console.error("Face detection initialization error:", error)
    }
  }

  // ── Drag Logic (mouse) ──────────────────────────────────────────────────────
  const onMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    setIsDragging(true)
    dragStartRef.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      posX: position.x,
      posY: position.y,
    }
  }, [position])

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return
      const dx = e.clientX - dragStartRef.current.mouseX
      const dy = e.clientY - dragStartRef.current.mouseY
      const newX = dragStartRef.current.posX + dx
      const newY = dragStartRef.current.posY + dy
      const panelW = panelRef.current?.offsetWidth ?? 320
      const panelH = panelRef.current?.offsetHeight ?? 400
      setPosition({
        x: Math.max(0, Math.min(window.innerWidth - panelW, newX)),
        y: Math.max(0, Math.min(window.innerHeight - panelH, newY)),
      })
    }
    const onMouseUp = () => setIsDragging(false)

    if (isDragging) {
      window.addEventListener("mousemove", onMouseMove)
      window.addEventListener("mouseup", onMouseUp)
    }
    return () => {
      window.removeEventListener("mousemove", onMouseMove)
      window.removeEventListener("mouseup", onMouseUp)
    }
  }, [isDragging])

  // ── Drag Logic (touch) ──────────────────────────────────────────────────────
  const onTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0]
    setIsDragging(true)
    dragStartRef.current = {
      mouseX: touch.clientX,
      mouseY: touch.clientY,
      posX: position.x,
      posY: position.y,
    }
  }, [position])

  useEffect(() => {
    const onTouchMove = (e: TouchEvent) => {
      if (!isDragging) return
      e.preventDefault()
      const touch = e.touches[0]
      const dx = touch.clientX - dragStartRef.current.mouseX
      const dy = touch.clientY - dragStartRef.current.mouseY
      const newX = dragStartRef.current.posX + dx
      const newY = dragStartRef.current.posY + dy
      const panelW = panelRef.current?.offsetWidth ?? 320
      const panelH = panelRef.current?.offsetHeight ?? 400
      setPosition({
        x: Math.max(0, Math.min(window.innerWidth - panelW, newX)),
        y: Math.max(0, Math.min(window.innerHeight - panelH, newY)),
      })
    }
    const onTouchEnd = () => setIsDragging(false)

    if (isDragging) {
      window.addEventListener("touchmove", onTouchMove, { passive: false })
      window.addEventListener("touchend", onTouchEnd)
    }
    return () => {
      window.removeEventListener("touchmove", onTouchMove)
      window.removeEventListener("touchend", onTouchEnd)
    }
  }, [isDragging])

  // ── Camera Logic ───────────────────────────────────────────────────────────
  const handleStartCamera = async () => {
    setIsInitializing(true)
    setCameraError(null)

    try {
      if (!videoRef.current) throw new Error("Video element not found")

      // Stop any existing stream
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop())
        streamRef.current = null
      }

      // Acquire camera stream (single acquisition — no double getUserMedia)
      const streamPromise = navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: "user" },
        audio: false,
      })
      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("Camera access timeout")), 10000)
      )

      const stream = (await Promise.race([streamPromise, timeoutPromise])) as MediaStream
      streamRef.current = stream
      videoRef.current.srcObject = stream
      videoRef.current.style.transform = "scaleX(-1)"

      // Wait for video to be ready and playing
      await new Promise<void>((resolve, reject) => {
        const video = videoRef.current!
        const onReady = () => { video.play().then(resolve).catch(reject) }
        if (video.readyState >= 2) {
          onReady()
        } else {
          video.onloadedmetadata = onReady
          video.onerror = () => reject(new Error("Video loading failed"))
          setTimeout(() => reject(new Error("Video metadata timeout")), 8000)
        }
      })

      // ── Key fix: directly wire the already-playing video element to the service ──
      // Do NOT call faceDetectionService.initializeWebcam() here — that would
      // call getUserMedia again, stop our stream, and break the metadata event chain.
      faceDetectionService.setVideoElement(videoRef.current)

      setIsCameraActive(true)
      onCameraReady(true)
      lastDetectedRef.current = Date.now()

      faceDetectionService.startDetection((emotion) => {
        setCurrentEmotion(emotion)
        onEmotionDetected(emotion)
        if (emotion.isDetected) {
          lastDetectedRef.current = Date.now()
        }
      })

      // Staleness guard — reset after >5s with no detected face
      stalenessTimerRef.current = setInterval(() => {
        const msSinceLastDetection = Date.now() - lastDetectedRef.current
        if (msSinceLastDetection > 5000) {
          const resetPayload = {
            emotion: "No face detected",
            confidence: 0,
            eyeContactScore: 0,
            timestamp: Date.now(),
            isDetected: false,
          }
          setCurrentEmotion(resetPayload)
          onEmotionDetected(resetPayload)
        }
      }, 2000)

      toast.success("📹 Camera ready! Face detection active", {
        duration: 3000,
        style: { background: "rgba(0,212,255,0.1)", border: "1px solid rgba(0,212,255,0.4)", color: "#cffafe" },
      })
      setRetryCount(0)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown camera error"
      setCameraError(errorMessage)
      if (retryCount < 2) {
        toast.error(`Camera error: ${errorMessage}. Retrying...`, { duration: 4000 })
        setRetryCount((p) => p + 1)
        setTimeout(handleStartCamera, 2000)
      } else {
        toast.error("❌ Camera access failed. Please check permissions.", { duration: 6000 })
      }
    } finally {
      setIsInitializing(false)
    }
  }


  const handleStopCamera = () => {
    cleanup()
    setIsCameraActive(false)
    onCameraReady(false)
    setCameraError(null)
    setRetryCount(0)
    toast("📹 Camera stopped", { duration: 2000 })
  }

  const cleanup = () => {
    faceDetectionService.stopDetection()
    if (stalenessTimerRef.current) {
      clearInterval(stalenessTimerRef.current)
      stalenessTimerRef.current = null
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop())
      streamRef.current = null
    }
    if (videoRef.current) videoRef.current.srcObject = null
  }

  const getEmotionEmoji = (emotion: string) => {
    const map: Record<string, string> = {
      Happy: "😊", Sad: "😢", Angry: "😠", Surprised: "😲",
      Fearful: "😨", Disgusted: "🤢", Neutral: "😐",
      Confident: "😎", Nervous: "😰", Focused: "🤔",
      Anxious: "😟", Comfortable: "😌",
    }
    return map[emotion] || "😐"
  }

  if (!isVisible) return null

  return (
    <div
      ref={panelRef}
      className="fixed z-40"
      style={{
        left: position.x,
        top: position.y,
        width: 300,
        cursor: isDragging ? "grabbing" : "default",
        userSelect: "none",
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.85 }}
        className="rounded-2xl overflow-hidden"
        style={{
          background: "rgba(5, 8, 22, 0.92)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(0, 212, 255, 0.2)",
          boxShadow: "0 20px 50px rgba(0,0,0,0.6), 0 0 20px rgba(0,212,255,0.1)",
        }}
      >
        {/* Drag Handle */}
        <div
          onMouseDown={onMouseDown}
          onTouchStart={onTouchStart}
          className="flex items-center justify-between px-4 py-2.5 border-b select-none"
          style={{
            borderColor: "rgba(0, 212, 255, 0.12)",
            cursor: isDragging ? "grabbing" : "grab",
            background: "rgba(0, 212, 255, 0.04)",
          }}
        >
          <div className="flex items-center space-x-2">
            <GripVertical className="w-4 h-4 text-slate-600" />
            <span className="text-sm font-semibold text-white">Live Camera</span>
          </div>
          <div
            className="flex items-center space-x-1 px-2 py-0.5 rounded-full text-xs font-medium"
            style={
              isCameraActive
                ? { background: "rgba(0,212,255,0.15)", border: "1px solid rgba(0,212,255,0.3)", color: "#00d4ff" }
                : { background: "rgba(100,116,139,0.2)", border: "1px solid rgba(100,116,139,0.3)", color: "#64748b" }
            }
          >
            <CheckCircle className="w-3 h-3" />
            <span>{isCameraActive ? "Active" : "Inactive"}</span>
          </div>
        </div>

        {/* Content */}
        <div className="p-3">
          {/* Video */}
          <div className="relative mb-3 aspect-video rounded-xl overflow-hidden bg-slate-950">
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              playsInline
              muted
              style={{ transform: "scaleX(-1)" }}
            />

            {!isCameraActive && (
              <div className="absolute inset-0 flex items-center justify-center"
                style={{ background: "rgba(5,8,22,0.85)" }}>
                <div className="text-center">
                  <Camera className="w-10 h-10 mx-auto mb-2 text-slate-600" />
                  <p className="text-xs text-slate-500">Camera Preview</p>
                </div>
              </div>
            )}

            {currentEmotion?.isDetected && (
              <>
                <motion.div
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  className="absolute top-2 left-2 flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs text-white"
                  style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(4px)" }}
                >
                  <span>{getEmotionEmoji(currentEmotion.emotion)}</span>
                  <span>{currentEmotion.emotion}</span>
                  <span className="text-slate-400">({currentEmotion.confidence}%)</span>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="absolute top-2 right-2 flex items-center space-x-1 px-2 py-1 rounded-full text-xs text-white"
                  style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(4px)" }}
                >
                  <Eye className="w-3 h-3 text-cyan-400" />
                  <span>{currentEmotion.eyeContactScore}%</span>
                </motion.div>
              </>
            )}
          </div>

          {/* Camera Error */}
          {cameraError && (
            <div className="mb-3 p-2 rounded-lg flex items-start space-x-2"
              style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)" }}>
              <AlertTriangle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs font-medium text-red-300">Camera Error</p>
                <p className="text-xs text-red-400/70">{cameraError}</p>
              </div>
            </div>
          )}

          {/* Controls */}
          {!isCameraActive ? (
            <button
              onClick={handleStartCamera}
              disabled={isInitializing}
              className="w-full py-2.5 rounded-xl text-sm font-semibold text-white flex items-center justify-center space-x-2 transition-all"
              style={{
                background: isInitializing ? "rgba(100,116,139,0.3)" : "linear-gradient(135deg, #00d4ff 0%, #0ea5e9 100%)",
                boxShadow: isInitializing ? "none" : "0 0 15px rgba(0,212,255,0.3)",
              }}
            >
              {isInitializing
                ? <><Loader2 className="w-4 h-4 animate-spin" /><span>Starting...</span></>
                : <><Camera className="w-4 h-4" /><span>Start Camera</span></>
              }
            </button>
          ) : (
            <button
              onClick={handleStopCamera}
              className="w-full py-2.5 rounded-xl text-sm font-semibold text-red-300 flex items-center justify-center space-x-2 transition-all"
              style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)" }}
            >
              <CameraOff className="w-4 h-4" />
              <span>Stop Camera</span>
            </button>
          )}

          {/* Status */}
          <div className="mt-2 flex items-center justify-between text-xs text-slate-500 px-1">
            <span>Face Detection:</span>
            <span className={currentEmotion?.isDetected ? "text-cyan-400" : "text-slate-600"}>
              {currentEmotion?.isDetected ? "Active" : "Searching..."}
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
