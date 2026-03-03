"use client"

import { useState } from "react"
import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { motion } from "framer-motion"
import { User, LogOut, Brain, Code, Trophy, FileText, Video, BarChart3, Menu, X, Zap } from "lucide-react"

export function Navbar() {
  const { data: session } = useSession()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const navItems = [
    { href: "/welcome", label: "Dashboard", icon: BarChart3 },
    { href: "/aptitude", label: "Aptitude", icon: Brain },
    { href: "/coding", label: "Coding", icon: Code },
    { href: "/mock-interview", label: "Interview", icon: Video },
    { href: "/eligibility", label: "Resume", icon: FileText },
    { href: "/history", label: "History", icon: Trophy },
  ]

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50"
      style={{
        background: "rgba(5, 8, 22, 0.85)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(0, 212, 255, 0.15)",
        boxShadow: "0 4px 30px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(0, 212,, 0.05)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
              className="relative w-10 h-10 rounded-xl flex items-center justify-center"
              style={{
                background: "linear-gradient(135deg, #00d4ff 0%, #a855f7 100%)",
                boxShadow: "0 0 20px rgba(0, 212, 255, 0.5), 0 0 40px rgba(168, 85, 247, 0.2)",
              }}
            >
              <Zap className="w-6 h-6 text-white" />
            </motion.div>
            <span
              className="text-xl font-bold"
              style={{
                background: "linear-gradient(135deg, #00d4ff 0%, #a855f7 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              SaviAI
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {session &&
              navItems.map((item) => {
                const Icon = item.icon
                return (
                  <Link key={item.href} href={item.href}>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        variant="ghost"
                        className="flex items-center space-x-2 text-slate-300 hover:text-cyan-400 transition-colors"
                        style={{
                          background: "transparent",
                        }}
                      >
                        <Icon className="w-4 h-4" />
                        <span className="text-sm font-medium">{item.label}</span>
                      </Button>
                    </motion.div>
                  </Link>
                )
              })}
          </div>

          {/* Right Side */}
          <div className="flex items-center space-x-4">
            {session ? (
              <>
                {/* Profile Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="relative h-9 w-9 rounded-full p-0"
                      style={{
                        background: "transparent",
                        border: "1px solid rgba(0, 212, 255, 0.3)",
                        boxShadow: "0 0 10px rgba(0, 212, 255, 0.2)",
                      }}
                    >
                      <Avatar className="h-9 w-9">
                        <AvatarFallback
                          style={{
                            background: "linear-gradient(135deg, #00d4ff 0%, #a855f7 100%)",
                            color: "white",
                            fontWeight: "bold",
                          }}
                        >
                          {session.user?.name?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="w-56"
                    style={{
                      background: "rgba(5, 8, 22, 0.95)",
                      backdropFilter: "blur(20px)",
                      border: "1px solid rgba(0, 212, 255, 0.2)",
                      boxShadow: "0 20px 40px rgba(0, 0, 0, 0.5), 0 0 20px rgba(0, 212, 255, 0.1)",
                    }}
                  >
                    <div className="flex flex-col space-y-1 p-2">
                      <p className="text-sm font-semibold text-white">{session.user?.name}</p>
                      <p className="text-xs text-slate-400">{session.user?.email}</p>
                    </div>
                    <DropdownMenuSeparator style={{ background: "rgba(0, 212, 255, 0.1)" }} />
                    <DropdownMenuItem asChild>
                      <Link href="/profile" className="flex items-center text-slate-300 hover:text-cyan-400 cursor-pointer">
                        <User className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator style={{ background: "rgba(0, 212, 255, 0.1)" }} />
                    <DropdownMenuItem
                      className="text-red-400 hover:text-red-300 cursor-pointer"
                      onClick={() => signOut({ callbackUrl: "/" })}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Mobile Menu Button */}
                <Button
                  variant="ghost"
                  size="sm"
                  className="md:hidden text-slate-300 hover:text-cyan-400"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                  {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </Button>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <Link href="/login">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      variant="ghost"
                      className="text-slate-300 hover:text-cyan-400 border border-transparent hover:border-cyan-400/30 transition-all"
                    >
                      Login
                    </Button>
                  </motion.div>
                </Link>
                <Link href="/register">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      className="font-semibold text-white"
                      style={{
                        background: "linear-gradient(135deg, #00d4ff 0%, #a855f7 100%)",
                        boxShadow: "0 0 20px rgba(0, 212, 255, 0.3)",
                      }}
                    >
                      Get Started
                    </Button>
                  </motion.div>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        {session && isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            style={{ borderTop: "1px solid rgba(0, 212, 255, 0.1)" }}
          >
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon
                return (
                  <Link key={item.href} href={item.href} onClick={() => setIsMobileMenuOpen(false)}>
                    <Button
                      variant="ghost"
                      className="w-full justify-start flex items-center space-x-3 text-slate-300 hover:text-cyan-400"
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </Button>
                  </Link>
                )
              })}
            </div>
          </motion.div>
        )}
      </div>
    </motion.nav>
  )
}
