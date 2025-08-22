"use client"

import { useRef, useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Canvas, useFrame } from "@react-three/fiber"
import { Sphere, Torus } from "@react-three/drei"
import type * as THREE from "three"

interface AiAvatar3DProps {
  isVisible?: boolean
  isSpeaking?: boolean
  emotion?: "neutral" | "speaking" | "listening" | "thinking" | "happy"
  onGreeting?: () => void
}

function AnimatedSphere({ isSpeaking }: { isSpeaking: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const [hovered, setHovered] = useState(false)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.5
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3

      if (isSpeaking) {
        meshRef.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 8) * 0.1)
      } else {
        meshRef.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 2) * 0.05)
      }
    }
  })

  return (
    <Sphere
      ref={meshRef}
      args={[1, 32, 32]}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <meshStandardMaterial
        color={isSpeaking ? "#38BDF8" : hovered ? "#0EA5E9" : "#0F172A"}
        wireframe={isSpeaking}
        transparent
        opacity={0.8}
      />
    </Sphere>
  )
}

function FloatingRings({ isSpeaking }: { isSpeaking: boolean }) {
  const group = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (group.current) {
      group.current.rotation.z = state.clock.elapsedTime * 0.5
      if (isSpeaking) {
        group.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 4) * 0.2)
      }
    }
  })

  return (
    <group ref={group}>
      {[...Array(3)].map((_, i) => (
        <Torus key={i} args={[2 + i * 0.5, 0.1, 8, 32]} position={[0, 0, i * 0.5]}>
          <meshStandardMaterial color="#38BDF8" transparent opacity={0.3 - i * 0.1} />
        </Torus>
      ))}
    </group>
  )
}

export function AiAvatar3D({ isVisible = true, isSpeaking = false, emotion = "neutral", onGreeting }: AiAvatar3DProps) {
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
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.8, x: 100, y: 100 }}
        animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
        exit={{ opacity: 0, scale: 0.8, x: 100, y: 100 }}
        className="fixed bottom-6 right-6 z-50 w-32 h-32"
      >
        <div className="relative w-full h-full">
          {/* 3D Canvas */}
          <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} intensity={1} />
            <pointLight position={[-10, -10, -10]} intensity={0.5} color="#38BDF8" />

            <AnimatedSphere isSpeaking={isSpeaking} />
            {isSpeaking && <FloatingRings isSpeaking={isSpeaking} />}
          </Canvas>

          {/* Overlay UI */}
          <div className="absolute inset-0 pointer-events-none">
            {/* Speaking indicator */}
            {isSpeaking && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="absolute -top-12 -left-8 bg-white dark:bg-slate-800 rounded-lg px-3 py-2 shadow-lg border border-slate-200 dark:border-slate-600"
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
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-white dark:border-t-slate-800"></div>
              </motion.div>
            )}

            {/* Greeting wave */}
            {!hasGreeted && (
              <motion.div
                animate={{ rotate: [0, 20, -20, 0] }}
                transition={{ duration: 0.6, repeat: 3 }}
                className="absolute -top-2 -right-2 text-2xl"
              >
                👋
              </motion.div>
            )}
          </div>

          {/* Name label */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-slate-900 dark:bg-sky-400 text-foreground dark:text-slate-900 px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap shadow-lg"
          >
            Ava - AI Assistant
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
