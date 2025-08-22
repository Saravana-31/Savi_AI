// // "use client"

// // import { Moon, Sun } from "lucide-react"
// // import { useTheme } from "next-themes"
// // import { Button } from "@/components/ui/button"
// // import { useEffect, useState } from "react"

// // export function ThemeToggle() {
// //   const { theme, setTheme } = useTheme()
// //   const [mounted, setMounted] = useState(false)

// //   useEffect(() => {
// //     setMounted(true)
// //   }, [])

// //   if (!mounted) {
// //     return (
// //       <Button
// //         variant="outline"
// //         size="sm"
// //         className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-md w-10 h-10"
// //       >
// //         <Sun className="h-5 w-5" />
// //       </Button>
// //     )
// //   }

// //   return (
// //     <Button
// //       variant="outline"
// //       size="sm"
// //       onClick={() => setTheme(theme === "light" ? "dark" : "light")}
// //       className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-md w-10 h-10 transition-all duration-300"
// //     >
// //       <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
// //       <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
// //       <span className="sr-only">Toggle theme</span>
// //     </Button>
// //   )
// // }
// "use client"

// import { Moon, Sun } from "lucide-react"
// import { useTheme } from "next-themes"
// import { Button } from "@/components/ui/button"
// import { useEffect, useState } from "react"

// export function ThemeToggle() {
//   const { theme, setTheme } = useTheme()
//   const [mounted, setMounted] = useState(false)

//   useEffect(() => {
//     setMounted(true)
//   }, [])

//   if (!mounted) {
//     return (
//       <Button
//         variant="outline"
//         size="sm"
//         className="bg-card border-border hover:bg-accent hover:text-accent-foreground text-foreground shadow-md w-10 h-10"
//       >
//         <Sun className="h-5 w-5" />
//       </Button>
//     )
//   }

//   return (
//     <Button
//       variant="outline"
//       size="sm"
//       onClick={() => setTheme(theme === "light" ? "dark" : "light")}
//       className="bg-card border-border hover:bg-accent hover:text-accent-foreground text-foreground shadow-md w-10 h-10 transition-all duration-300"
//     >
//       <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
//       <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
//       <span className="sr-only">Toggle theme</span>
//     </Button>
//   )
// }
"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "@/components/theme-provider"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button
        variant="outline"
        size="sm"
        className="bg-card border-border hover:bg-accent hover:text-accent-foreground text-foreground shadow-md w-10 h-10"
      >
        <Sun className="h-5 w-5" />
      </Button>
    )
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className="bg-card border-border hover:bg-accent hover:text-accent-foreground text-foreground shadow-md w-10 h-10 transition-all duration-300"
    >
      <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
