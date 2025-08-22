"use client"

import { useRef } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { Points, PointMaterial } from "@react-three/drei"
import type * as THREE from "three"

function AnimatedParticles() {
  const ref = useRef<THREE.Points>(null)
  const particlesCount = 1000

  // Generate random positions
  const positions = new Float32Array(particlesCount * 3)
  for (let i = 0; i < particlesCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 20
    positions[i * 3 + 1] = (Math.random() - 0.5) * 20
    positions[i * 3 + 2] = (Math.random() - 0.5) * 20
  }

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.x = state.clock.elapsedTime * 0.05
      ref.current.rotation.y = state.clock.elapsedTime * 0.03
    }
  })

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial transparent color="#38BDF8" size={0.02} sizeAttenuation={true} depthWrite={false} opacity={0.6} />
    </Points>
  )
}

function FloatingMesh() {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.2
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.1
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.5
    }
  })

  return (
    <mesh ref={meshRef} position={[3, 0, -5]}>
      <torusGeometry args={[1, 0.3, 16, 32]} />
      <meshStandardMaterial color="#0F172A" transparent opacity={0.1} wireframe />
    </mesh>
  )
}

export function AnimatedBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
        <ambientLight intensity={0.3} />
        <pointLight position={[10, 10, 10]} intensity={0.5} color="#38BDF8" />

        <AnimatedParticles />
        <FloatingMesh />
      </Canvas>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50/90 via-sky-50/80 to-slate-100/90 dark:from-slate-900/90 dark:via-slate-800/80 dark:to-slate-900/90" />
    </div>
  )
}
