"use client"

import { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Camera, CameraOff, Eye, AlertTriangle, CheckCircle, Loader2 } from "lucide-react"
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
  const [userInteracted, setUserInteracted] = useState(false)
  const [currentEmotion, setCurrentEmotion] = useState<EmotionData | null>(null)
  const [cameraError, setCameraError] = useState<string | null>(null)
  const [retryCount, setRetryCount] = useState(0)
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  useEffect(() => {
    if (isVisible) {
      initializeFaceDetection()
    }

    return () => {
      cleanup()
    }
  }, [isVisible])

  const initializeFaceDetection = async () => {
    try {
      await faceDetectionService.initialize()
      console.log("Face detection service initialized")
    } catch (error) {
      console.error("Face detection initialization error:", error)
    }
  }

  const handleStartCamera = async () => {
    if (!userInteracted) {
      setUserInteracted(true)
    }

    setIsInitializing(true)
    setCameraError(null)

    try {
      console.log("Starting camera initialization...")

      if (!videoRef.current) {
        throw new Error("Video element not found")
      }

      // Stop existing stream if any
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop())
        streamRef.current = null
      }

      // Request camera access with timeout
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error("Camera access timeout")), 10000)
      })

      const streamPromise = navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: "user",
        },
        audio: false,
      })

      const stream = (await Promise.race([streamPromise, timeoutPromise])) as MediaStream
      streamRef.current = stream

      // Attach stream to video element
      videoRef.current.srcObject = stream
      videoRef.current.style.background = "#000"
      videoRef.current.style.transform = "scaleX(-1)" // Mirror effect

      // Wait for metadata to load
      await new Promise<void>((resolve, reject) => {
        if (!videoRef.current) {
          reject(new Error("Video element lost"))
          return
        }

        const video = videoRef.current

        video.onloadedmetadata = () => {
          console.log("Video metadata loaded")
          video
            .play()
            .then(() => {
              console.log("Video playing successfully")
              resolve()
            })
            .catch(reject)
        }

        video.onerror = () => {
          reject(new Error("Video loading failed"))
        }

        // Fallback timeout
        setTimeout(() => {
          if (video.readyState >= 2) {
            video.play().then(resolve).catch(reject)
          } else {
            reject(new Error("Video metadata timeout"))
          }
        }, 5000)
      })

      // Initialize face detection
      const success = await faceDetectionService.initializeWebcam(videoRef.current)

      if (success) {
        setIsCameraActive(true)
        onCameraReady(true)

        // Start emotion detection
        faceDetectionService.startDetection((emotion) => {
          setCurrentEmotion(emotion)
          onEmotionDetected(emotion)
        })

        toast.success("📹 Camera ready! Face detection active", {
          duration: 3000,
          style: {
            background: "linear-gradient(135deg, #10b981 0%, #3b82f6 100%)",
            color: "white",
          },
        })

        setRetryCount(0)
      } else {
        throw new Error("Face detection initialization failed")
      }
    } catch (error) {
      console.error("Camera initialization error:", error)

      const errorMessage = error instanceof Error ? error.message : "Unknown camera error"
      setCameraError(errorMessage)

      if (retryCount < 2) {
        toast.error(`Camera error: ${errorMessage}. Retrying...`, {
          duration: 4000,
        })
        setRetryCount((prev) => prev + 1)

        // Retry after delay
        setTimeout(() => {
          handleStartCamera()
        }, 2000)
      } else {
        toast.error("❌ Camera access failed. Please check permissions and try again.", {
          duration: 6000,
          style: {
            background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
            color: "white",
          },
        })
      }
    } finally {
      setIsInitializing(false)
    }
  }

  const handleStopCamera = () => {
    cleanup()
    setIsCameraActive(false)
    onCameraReady(false)
    setUserInteracted(false)
    setCameraError(null)
    setRetryCount(0)

    toast("📹 Camera stopped", {
      duration: 2000,
    })
  }

  const cleanup = () => {
    faceDetectionService.stopDetection()

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null
    }
  }

  const getEmotionColor = (emotion: string) => {
    const colors: { [key: string]: string } = {
      Happy: "text-green-500",
      Confident: "text-blue-500",
      Neutral: "text-gray-500",
      Nervous: "text-yellow-500",
      Anxious: "text-orange-500",
      Focused: "text-purple-500",
    }
    return colors[emotion] || "text-gray-500"
  }

  const getEmotionEmoji = (emotion: string) => {
    const emojiMap: { [key: string]: string } = {
      Happy: "😊",
      Sad: "😢",
      Angry: "😠",
      Surprised: "😲",
      Fearful: "😨",
      Disgusted: "🤢",
      Neutral: "😐",
      Confident: "😎",
      Nervous: "😰",
      Focused: "🤔",
      Anxious: "😟",
      Comfortable: "😌",
    }
    return emojiMap[emotion] || "😐"
  }

  if (!isVisible) return null

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className="fixed top-24 right-6 z-40"
    >
      <Card
        className="w-80 shadow-2xl border-0 overflow-hidden"
        style={{
          background: "rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
        }}
      >
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-900 dark:text-slate-100">Live Camera</h3>
            <Badge
              variant="outline"
              className={`${isCameraActive ? "border-green-300 text-green-700 bg-green-50" : "border-gray-300 text-gray-700 bg-gray-50"}`}
            >
              {isCameraActive ? (
                <>
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Active
                </>
              ) : (
                <>
                  <CameraOff className="w-4 h-4 mr-1" />
                  Inactive
                </>
              )}
            </Badge>
          </div>

          {/* Video Preview */}
          <div className="relative mb-4">
            <div className="aspect-video bg-slate-900 rounded-xl overflow-hidden relative">
              <video
                ref={videoRef}
                className="w-full h-full object-cover"
                playsInline
                muted
                style={{
                  transform: "scaleX(-1)",
                  background: "#000",
                }}
              />

              {!isCameraActive && (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-800/80">
                  <div className="text-center text-foreground">
                    <Camera className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Camera Preview</p>
                  </div>
                </div>
              )}

              {/* Emotion Overlay */}
              {currentEmotion && currentEmotion.isDetected && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute top-2 left-2 bg-black/70 text-foreground px-3 py-1 rounded-full text-sm flex items-center space-x-2"
                >
                  <span>{getEmotionEmoji(currentEmotion.emotion)}</span>
                  <span>{currentEmotion.emotion}</span>
                  <span className="text-xs opacity-75">({currentEmotion.confidence}%)</span>
                </motion.div>
              )}

              {/* Eye Contact Indicator */}
              {currentEmotion && currentEmotion.isDetected && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute top-2 right-2 bg-black/70 text-foreground px-2 py-1 rounded-full text-xs flex items-center space-x-1"
                >
                  <Eye className="w-3 h-3" />
                  <span>{currentEmotion.eyeContactScore}%</span>
                </motion.div>
              )}
            </div>
          </div>

          {/* Error Display */}
          {cameraError && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl"
            >
              <div className="flex items-start space-x-2">
                <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-red-800">Camera Error</p>
                  <p className="text-xs text-red-600">{cameraError}</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Controls */}
          <div className="space-y-3">
            {!isCameraActive ? (
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  onClick={handleStartCamera}
                  disabled={isInitializing}
                  className="w-full py-3 font-semibold rounded-xl transition-all duration-300"
                  style={{
                    background: isInitializing
                      ? "rgba(156, 163, 175, 0.5)"
                      : "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                    boxShadow: isInitializing ? "none" : "0 10px 25px rgba(16, 185, 129, 0.3)",
                  }}
                >
                  {isInitializing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Starting Camera...
                    </>
                  ) : (
                    <>
                      <Camera className="w-4 h-4 mr-2" />
                      Start Camera
                    </>
                  )}
                </Button>
              </motion.div>
            ) : (
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  onClick={handleStopCamera}
                  variant="outline"
                  className="w-full py-3 font-semibold rounded-xl bg-red-50 border-red-200 text-red-700 hover:bg-red-100"
                >
                  <CameraOff className="w-4 h-4 mr-2" />
                  Stop Camera
                </Button>
              </motion.div>
            )}

            {/* Status Info */}
            <div className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
              <div className="flex items-center justify-between">
                <span>Face Detection:</span>
                <span className={currentEmotion?.isDetected ? "text-green-600" : "text-gray-500"}>
                  {currentEmotion?.isDetected ? "Active" : "Searching..."}
                </span>
              </div>
              {currentEmotion?.isDetected && (
                <div className="flex items-center justify-between">
                  <span>Eye Contact:</span>
                  <span className={`${currentEmotion.eyeContactScore > 70 ? "text-green-600" : "text-yellow-600"}`}>
                    {currentEmotion.eyeContactScore}%
                  </span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
