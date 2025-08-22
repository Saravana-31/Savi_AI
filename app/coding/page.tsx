// import { RouteGuard } from "@/components/route-guard"
// import { CodingPage } from "@/components/coding-page"

// export default function Coding() {
//   return (
//     <RouteGuard allowedRoles={["candidate", "admin"]}>
//       <CodingPage />
//     </RouteGuard>
//   )
// }
import { CodingPage } from "@/components/coding-page"

export default function Coding() {
  return <CodingPage />
}
// "use client"

// import { useState, useEffect } from "react"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Button } from "@/components/ui/button"
// import { Badge } from "@/components/ui/badge"
// import { ChevronLeft, ChevronRight } from "lucide-react"
// import { AnimatePresence, motion } from "framer-motion"
// import SyntaxHighlighter from "react-syntax-highlighter"
// import { atomOneDark } from "react-syntax-highlighter/dist/esm/styles/hljs"
// import { RouteGuard } from "@/components/route-guard"
// import { ThemeToggle } from "@/components/theme-toggle"
// import { AIService, type CodingProblem } from "@/lib/ai-service"

// const CODING_TOPICS = [
//   {
//     id: "arrays",
//     title: "Arrays",
//     description: "Linear data structures and array manipulation techniques",
//     icon: "📊",
//     difficulty_levels: ["easy", "medium", "hard"],
//     languages: ["javascript", "python", "cpp", "java", "c"],
//     estimatedTime: 60,
//     totalProblems: 50,
//   },
//   {
//     id: "strings",
//     title: "Strings",
//     description: "String manipulation, parsing, and pattern matching",
//     icon: "📝",
//     difficulty_levels: ["easy", "medium", "hard"],
//     languages: ["javascript", "python", "cpp", "java", "c"],
//     estimatedTime: 55,
//     totalProblems: 45,
//   },
//   {
//     id: "linked-lists",
//     title: "Linked Lists",
//     description: "Dynamic data structures composed of nodes",
//     icon: "🔗",
//     difficulty_levels: ["easy", "medium", "hard"],
//     languages: ["javascript", "python", "cpp", "java", "c"],
//     estimatedTime: 70,
//     totalProblems: 40,
//   },
//   {
//     id: "trees",
//     title: "Trees",
//     description: "Hierarchical data structures with root and child nodes",
//     icon: "🌳",
//     difficulty_levels: ["easy", "medium", "hard"],
//     languages: ["javascript", "python", "cpp", "java", "c"],
//     estimatedTime: 80,
//     totalProblems: 35,
//   },
//   {
//     id: "sorting",
//     title: "Sorting Algorithms",
//     description: "Algorithms to arrange elements in specific order",
//     icon: "↕️",
//     difficulty_levels: ["easy", "medium", "hard"],
//     languages: ["javascript", "python", "cpp", "java", "c"],
//     estimatedTime: 75,
//     totalProblems: 30,
//   },
//   {
//     id: "hashing",
//     title: "Hashing",
//     description: "Techniques for mapping data to fixed-size values",
//     icon: "🔑",
//     difficulty_levels: ["easy", "medium", "hard"],
//     languages: ["javascript", "python", "cpp", "java", "c"],
//     estimatedTime: 65,
//     totalProblems: 30,
//   },
// ]

// export default function CodingPage() {
//   const [selectedTopic, setSelectedTopic] = useState<any>(null)
//   const [activeTab, setActiveTab] = useState("overview")
//   const [practiceProblems, setPracticeProblems] = useState<CodingProblem[]>([])
//   const [currentProblemIndex, setCurrentProblemIndex] = useState(0)
//   const [selectedLanguage, setSelectedLanguage] = useState<string>("javascript")
//   const [showSolution, setShowSolution] = useState(false)
//   const [isLoading, setIsLoading] = useState(false)

//   useEffect(() => {
//     if (selectedTopic) {
//       setActiveTab("overview")
//       setPracticeProblems([])
//       setCurrentProblemIndex(0)
//       setShowSolution(false)
//       if (selectedTopic.languages.includes("javascript")) {
//         setSelectedLanguage("javascript")
//       } else if (selectedTopic.languages.length > 0) {
//         setSelectedLanguage(selectedTopic.languages[0])
//       }
//     }
//   }, [selectedTopic])

//   const handleStartPractice = async (difficulty: "easy" | "medium" | "hard") => {
//     if (selectedTopic) {
//       setIsLoading(true)
//       try {
//         const problems = await AIService.generateCodingProblems(selectedTopic.id, difficulty, 3)
//         setPracticeProblems(problems)
//         setCurrentProblemIndex(0)
//         setShowSolution(false)
//         setActiveTab("practice")
//       } catch (error) {
//         console.error("Failed to generate problems:", error)
//       } finally {
//         setIsLoading(false)
//       }
//     }
//   }

//   const handleNextProblem = () => {
//     if (currentProblemIndex < practiceProblems.length - 1) {
//       setCurrentProblemIndex((prev) => prev + 1)
//       setShowSolution(false)
//     } else {
//       alert("Practice session completed!")
//       setPracticeProblems([])
//       setActiveTab("overview")
//     }
//   }

//   const handlePreviousProblem = () => {
//     if (currentProblemIndex > 0) {
//       setCurrentProblemIndex((prev) => prev - 1)
//       setShowSolution(false)
//     }
//   }

//   const currentProblem = practiceProblems[currentProblemIndex]

//   const getLanguageDisplayName = (lang: string) => {
//     const names: { [key: string]: string } = {
//       javascript: "JavaScript",
//       python: "Python",
//       cpp: "C++",
//       java: "Java",
//       c: "C",
//     }
//     return names[lang] || lang
//   }

//   return (
//     // <RouteGuard requiredRole="candidate">
//       <div className="min-h-screen bg-background">
//         <div className="container mx-auto p-4 md:p-8 pt-24">
//           <div className="flex justify-between items-center mb-6">
//             <h1 className="text-3xl font-bold text-foreground">Coding Practice</h1>
//             <ThemeToggle />
//           </div>

//           {!selectedTopic ? (
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//               {CODING_TOPICS.map((topic) => (
//                 <Card
//                   key={topic.id}
//                   className="cursor-pointer hover:shadow-lg transition-shadow duration-300 bg-card border-border"
//                   onClick={() => setSelectedTopic(topic)}
//                 >
//                   <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//                     <CardTitle className="text-2xl font-bold text-foreground">{topic.title}</CardTitle>
//                     <span className="text-4xl">{topic.icon}</span>
//                   </CardHeader>
//                   <CardContent>
//                     <p className="text-muted-foreground mb-4">{topic.description}</p>
//                     <div className="flex justify-between items-center text-sm text-muted-foreground mb-2">
//                       <span>{topic.totalProblems} Problems</span>
//                       <span>~{topic.estimatedTime} min</span>
//                     </div>
//                     <div className="flex flex-wrap gap-1">
//                       {topic.languages.map((lang) => (
//                         <Badge key={lang} variant="secondary" className="text-xs">
//                           {getLanguageDisplayName(lang)}
//                         </Badge>
//                       ))}
//                     </div>
//                   </CardContent>
//                 </Card>
//               ))}
//             </div>
//           ) : (
//             <>
//               <Button onClick={() => setSelectedTopic(null)} className="mb-6 flex items-center gap-2">
//                 <ChevronLeft className="h-4 w-4" /> Back to Topics
//               </Button>

//               <h2 className="text-2xl font-bold mb-6 text-center text-foreground">
//                 {selectedTopic.title} Coding Practice
//               </h2>

//               <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
//                 <TabsList className="grid w-full grid-cols-2 bg-card border-border">
//                   <TabsTrigger value="overview" className="text-foreground">
//                     Overview
//                   </TabsTrigger>
//                   <TabsTrigger value="practice" className="text-foreground">
//                     Practice Problems
//                   </TabsTrigger>
//                 </TabsList>

//                 <TabsContent value="overview" className="mt-6">
//                   <Card className="bg-card border-border">
//                     <CardHeader>
//                       <CardTitle className="text-foreground">Topic Overview</CardTitle>
//                     </CardHeader>
//                     <CardContent className="space-y-4">
//                       <p className="text-muted-foreground">{selectedTopic.description}</p>
//                       <p className="text-muted-foreground">
//                         <span className="font-semibold text-foreground">Estimated Time:</span>{" "}
//                         {selectedTopic.estimatedTime} minutes
//                       </p>
//                       <p className="text-muted-foreground">
//                         <span className="font-semibold text-foreground">Total Problems:</span>{" "}
//                         {selectedTopic.totalProblems}
//                       </p>
//                       <p className="text-muted-foreground">
//                         <span className="font-semibold text-foreground">Supported Languages:</span>{" "}
//                         {selectedTopic.languages.map((lang: string) => getLanguageDisplayName(lang)).join(", ")}
//                       </p>
//                       <div className="pt-4">
//                         <h3 className="text-xl font-semibold mb-3 text-foreground">Start Practice Session</h3>
//                         <div className="flex gap-4">
//                           {selectedTopic.difficulty_levels.map((level: string) => (
//                             <Button
//                               key={level}
//                               onClick={() => handleStartPractice(level as "easy" | "medium" | "hard")}
//                               disabled={isLoading}
//                             >
//                               {isLoading ? "Generating..." : `Start ${level.charAt(0).toUpperCase() + level.slice(1)}`}
//                             </Button>
//                           ))}
//                         </div>
//                       </div>
//                     </CardContent>
//                   </Card>
//                 </TabsContent>

//                 <TabsContent value="practice" className="mt-6">
//                   {practiceProblems.length === 0 ? (
//                     <Card className="bg-card border-border p-6 text-center">
//                       <CardTitle className="mb-4 text-foreground">No Practice Session Active</CardTitle>
//                       <p className="text-muted-foreground mb-6">
//                         Go to the Overview tab to start a new practice session.
//                       </p>
//                       <Button onClick={() => setActiveTab("overview")}>Start Practice</Button>
//                     </Card>
//                   ) : (
//                     <Card className="bg-card border-border overflow-y-auto max-h-[80vh]">
//                       <CardHeader>
//                         <CardTitle className="flex justify-between items-center text-foreground">
//                           <span>
//                             Problem {currentProblemIndex + 1} / {practiceProblems.length}
//                           </span>
//                           <span className="text-sm text-muted-foreground capitalize">{currentProblem?.difficulty}</span>
//                         </CardTitle>
//                       </CardHeader>
//                       <CardContent className="space-y-4">
//                         <h3 className="text-xl font-semibold text-foreground">{currentProblem?.title}</h3>
//                         <p className="text-muted-foreground">{currentProblem?.description}</p>

//                         {currentProblem?.examples && currentProblem.examples.length > 0 && (
//                           <div className="space-y-2">
//                             <h4 className="font-semibold text-foreground">Examples:</h4>
//                             {currentProblem.examples.map((example, idx) => (
//                               <div key={idx} className="bg-secondary/30 p-3 rounded-md text-sm font-mono">
//                                 <p className="text-foreground">
//                                   <span className="font-semibold">Input:</span> {example.input}
//                                 </p>
//                                 <p className="text-foreground">
//                                   <span className="font-semibold">Output:</span> {example.output}
//                                 </p>
//                                 {example.explanation && (
//                                   <p className="text-muted-foreground mt-1">{example.explanation}</p>
//                                 )}
//                               </div>
//                             ))}
//                           </div>
//                         )}

//                         {currentProblem?.constraints && currentProblem.constraints.length > 0 && (
//                           <div className="space-y-2">
//                             <h4 className="font-semibold text-foreground">Constraints:</h4>
//                             <ul className="list-disc list-inside text-muted-foreground text-sm">
//                               {currentProblem.constraints.map((constraint, idx) => (
//                                 <li key={idx}>{constraint}</li>
//                               ))}
//                             </ul>
//                           </div>
//                         )}

//                         {currentProblem?.hints && currentProblem.hints.length > 0 && (
//                           <div className="space-y-2">
//                             <h4 className="font-semibold text-foreground">Hints:</h4>
//                             <ul className="list-disc list-inside text-muted-foreground text-sm">
//                               {currentProblem.hints.map((hint, idx) => (
//                                 <li key={idx}>{hint}</li>
//                               ))}
//                             </ul>
//                           </div>
//                         )}

//                         <div className="space-y-2">
//                           <h4 className="font-semibold text-foreground">Starter Code:</h4>
//                           <Tabs value={selectedLanguage} onValueChange={setSelectedLanguage} className="w-full">
//                             <TabsList className="grid w-full grid-cols-2 md:grid-cols-3 lg:grid-cols-5 bg-secondary/30">
//                               {selectedTopic.languages.map((lang: string) => (
//                                 <TabsTrigger key={lang} value={lang} className="text-foreground">
//                                   {getLanguageDisplayName(lang)}
//                                 </TabsTrigger>
//                               ))}
//                             </TabsList>
//                             <AnimatePresence mode="wait">
//                               {currentProblem?.starterCode &&
//                                 Object.entries(currentProblem.starterCode).map(([lang, code]) => (
//                                   <TabsContent key={lang} value={lang} className="mt-4">
//                                     <motion.div
//                                       initial={{ opacity: 0, y: 10 }}
//                                       animate={{ opacity: 1, y: 0 }}
//                                       exit={{ opacity: 0, y: -10 }}
//                                       transition={{ duration: 0.2 }}
//                                     >
//                                       <Card className="bg-background border-border overflow-hidden">
//                                         <CardContent className="p-0">
//                                           <SyntaxHighlighter
//                                             language={lang === "cpp" ? "cpp" : lang}
//                                             style={atomOneDark}
//                                             customStyle={{
//                                               padding: "1.5rem",
//                                               borderRadius: "0.5rem",
//                                               fontSize: "0.9rem",
//                                               lineHeight: "1.4",
//                                             }}
//                                           >
//                                             {code}
//                                           </SyntaxHighlighter>
//                                         </CardContent>
//                                       </Card>
//                                     </motion.div>
//                                   </TabsContent>
//                                 ))}
//                             </AnimatePresence>
//                           </Tabs>
//                         </div>

//                         <Button onClick={() => setShowSolution((prev) => !prev)} className="w-full">
//                           {showSolution ? "Hide Solution" : "Show Solution"}
//                         </Button>

//                         <AnimatePresence>
//                           {showSolution && currentProblem?.solution && (
//                             <motion.div
//                               initial={{ opacity: 0, height: 0 }}
//                               animate={{ opacity: 1, height: "auto" }}
//                               exit={{ opacity: 0, height: 0 }}
//                               transition={{ duration: 0.3 }}
//                               className="overflow-hidden"
//                             >
//                               <h4 className="font-semibold text-foreground mb-2">Solution:</h4>
//                               <Tabs value={selectedLanguage} onValueChange={setSelectedLanguage} className="w-full">
//                                 <TabsList className="grid w-full grid-cols-2 md:grid-cols-3 lg:grid-cols-5 bg-secondary/30">
//                                   {selectedTopic.languages.map((lang: string) => (
//                                     <TabsTrigger key={lang} value={lang} className="text-foreground">
//                                       {getLanguageDisplayName(lang)}
//                                     </TabsTrigger>
//                                   ))}
//                                 </TabsList>
//                                 <AnimatePresence mode="wait">
//                                   {Object.entries(currentProblem.solution).map(([lang, code]) => (
//                                     <TabsContent key={lang} value={lang} className="mt-4">
//                                       <motion.div
//                                         initial={{ opacity: 0, y: 10 }}
//                                         animate={{ opacity: 1, y: 0 }}
//                                         exit={{ opacity: 0, y: -10 }}
//                                         transition={{ duration: 0.2 }}
//                                       >
//                                         <Card className="bg-background border-border overflow-hidden">
//                                           <CardContent className="p-0">
//                                             <SyntaxHighlighter
//                                               language={lang === "cpp" ? "cpp" : lang}
//                                               style={atomOneDark}
//                                               customStyle={{
//                                                 padding: "1.5rem",
//                                                 borderRadius: "0.5rem",
//                                                 fontSize: "0.9rem",
//                                                 lineHeight: "1.4",
//                                               }}
//                                             >
//                                               {code}
//                                             </SyntaxHighlighter>
//                                           </CardContent>
//                                         </Card>
//                                       </motion.div>
//                                     </TabsContent>
//                                   ))}
//                                 </AnimatePresence>
//                               </Tabs>
//                             </motion.div>
//                           )}
//                         </AnimatePresence>

//                         <div className="flex justify-between mt-4">
//                           <Button onClick={handlePreviousProblem} disabled={currentProblemIndex === 0}>
//                             <ChevronLeft className="h-4 w-4 mr-2" /> Previous
//                           </Button>
//                           <Button onClick={handleNextProblem}>
//                             {currentProblemIndex === practiceProblems.length - 1 ? "Finish Session" : "Next Problem"}{" "}
//                             <ChevronRight className="h-4 w-4 ml-2" />
//                           </Button>
//                         </div>
//                       </CardContent>
//                     </Card>
//                   )}
//                 </TabsContent>
//               </Tabs>
//             </>
//           )}
//         </div>
//       </div>
//     // </RouteGuard>
//   )
// }
