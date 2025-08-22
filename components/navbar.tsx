// "use client"

// import { Button } from "@/components/ui/button"
// import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
// import { Eye, User, LogOut, Settings, Bot, Calendar } from "lucide-react"
// import Link from "next/link"
// import { useSession, signOut } from "next-auth/react"
// import { ThemeToggle } from "@/components/theme-toggle"
// import { motion } from "framer-motion"
// import toast from "react-hot-toast"

// export function Navbar() {
//   const { data: session, status } = useSession()

//   const handleLogout = async () => {
//     toast.success("Logged out successfully!")
//     await signOut({ callbackUrl: "/welcome" })
//   }

//   return (
//     <motion.nav
//       initial={{ y: -100 }}
//       animate={{ y: 0 }}
//       transition={{ duration: 0.5 }}
//       className="fixed top-0 w-full z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border-b border-slate-200 dark:border-slate-700 shadow-xl"
//     >
//       <div className="container mx-auto px-6 py-4">
//         <div className="flex items-center justify-between">
//           <Link href="/welcome" className="flex items-center space-x-3">
//             <motion.div
//               whileHover={{ rotate: 360 }}
//               transition={{ duration: 0.5 }}
//               className="w-10 h-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg"
//             >
//               <Eye className="w-6 h-6 text-foreground" />
//             </motion.div>
//             <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
//               SaviAI
//             </span>
//           </Link>

//           <div className="flex items-center space-x-4">
//             <ThemeToggle />

//             {session ? (
//               <div className="flex items-center space-x-4">
//                 <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="text-sm">
//                   <span className="font-semibold text-high-contrast">Hi, {session.user?.name}</span>
//                   <br />
//                   <span className="text-xs text-low-contrast">Candidate</span>
//                 </motion.div>

//                 <Link href="/mock-interview">
//                   <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
//                     <Button className="btn-secondary">
//                       <Bot className="w-4 h-4 mr-2" />
//                       Start Interview
//                     </Button>
//                   </motion.div>
//                 </Link>

//                 <Link href="/history">
//                   <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
//                     <Button className="btn-outline">
//                       <Calendar className="w-4 h-4 mr-2" />
//                       History
//                     </Button>
//                   </motion.div>
//                 </Link>

//                 <DropdownMenu>
//                   <DropdownMenuTrigger asChild>
//                     <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
//                       <Button className="btn-outline p-2">
//                         <User className="w-5 h-5" />
//                       </Button>
//                     </motion.div>
//                   </DropdownMenuTrigger>
//                   <DropdownMenuContent align="end" className="glass-card border-slate-200 dark:border-slate-700">
//                     <DropdownMenuItem className="text-high-contrast hover:bg-slate-100 dark:hover:bg-slate-700">
//                       <Settings className="w-4 h-4 mr-2" />
//                       Profile
//                     </DropdownMenuItem>
//                     <DropdownMenuItem
//                       onClick={handleLogout}
//                       className="text-high-contrast hover:bg-slate-100 dark:hover:bg-slate-700"
//                     >
//                       <LogOut className="w-4 h-4 mr-2" />
//                       Logout
//                     </DropdownMenuItem>
//                   </DropdownMenuContent>
//                 </DropdownMenu>
//               </div>
//             ) : (
//               <motion.div
//                 initial={{ opacity: 0, x: 20 }}
//                 animate={{ opacity: 1, x: 0 }}
//                 className="flex items-center space-x-4"
//               >
//                 <Link href="/login">
//                   <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
//                     <Button className="btn-outline">Sign In</Button>
//                   </motion.div>
//                 </Link>
//                 <Link href="/register">
//                   <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
//                     <Button className="btn-primary">Get Started</Button>
//                   </motion.div>
//                 </Link>
//               </motion.div>
//             )}
//           </div>
//         </div>
//       </div>
//     </motion.nav>
//   )
// }
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
import { User, LogOut, Settings, Brain, Code, Trophy, FileText, Video, BarChart3, Menu, X } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

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
      className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-b border-slate-200/20 dark:border-slate-700/20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center"
            >
              <Brain className="w-6 h-6 text-foreground" />
            </motion.div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
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
                    <Button
                      variant="ghost"
                      className="flex items-center space-x-2 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </Button>
                  </Link>
                )
              })}
          </div>

          {/* Right Side */}
          <div className="flex items-center space-x-4">
            <ThemeToggle />

            {session ? (
              <>
                {/* Profile Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-foreground">
                          {session.user?.name?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56 glass-card" align="end" forceMount>
                    <div className="flex flex-col space-y-1 p-2">
                      <p className="text-sm font-medium leading-none">{session.user?.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">{session.user?.email}</p>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/profile" className="flex items-center">
                        <User className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/settings" className="flex items-center">
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Settings</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-red-600 dark:text-red-400"
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
                  className="md:hidden"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                  {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </Button>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <Link href="/login">
                  <Button variant="ghost">Login</Button>
                </Link>
                <Link href="/register">
                  <Button className="btn-primary">Sign Up</Button>
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
            className="md:hidden border-t border-slate-200/20 dark:border-slate-700/20"
          >
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon
                return (
                  <Link key={item.href} href={item.href} onClick={() => setIsMobileMenuOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start flex items-center space-x-2">
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
