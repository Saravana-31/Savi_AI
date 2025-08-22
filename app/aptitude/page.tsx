// import { RouteGuard } from "@/components/route-guard"
// import { AptitudePage } from "@/components/aptitude-page"

// export default function Aptitude() {
//   return (
//     <RouteGuard allowedRoles={["candidate", "admin"]}>
//       <AptitudePage />
//     </RouteGuard>
//   )
// }
//..................
import { AptitudePage } from "@/components/aptitude-page"

export default function Aptitude() {
  return <AptitudePage />
}
// "use client"

// import { useState, useEffect } from "react"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Button } from "@/components/ui/button"
// import { ChevronLeft, ChevronRight, CheckCircle, XCircle, Clock } from "lucide-react"
// import { cn } from "@/lib/utils"
// import { motion, AnimatePresence } from "framer-motion"
// import { RouteGuard } from "@/components/route-guard"
// import { ThemeToggle } from "@/components/theme-toggle"
// import { AIService, type AptitudeQuestion } from "@/lib/ai-service"

// const APTITUDE_TOPICS = [
//   {
//     id: "time-work",
//     title: "Time & Work",
//     description: "Problems involving work rates, efficiency, and time calculations",
//     icon: "⏰",
//     difficulty_levels: ["easy", "medium", "hard"],
//     estimatedTime: 45,
//     totalQuestions: 50,
//   },
//   {
//     id: "percentage",
//     title: "Percentage",
//     description: "Calculations involving percentages, percentage change, and applications",
//     icon: "📊",
//     difficulty_levels: ["easy", "medium", "hard"],
//     estimatedTime: 35,
//     totalQuestions: 60,
//   },
//   {
//     id: "profit-loss",
//     title: "Profit & Loss",
//     description: "Commercial mathematics involving buying, selling, profit, and loss calculations",
//     icon: "💰",
//     difficulty_levels: ["easy", "medium", "hard"],
//     estimatedTime: 50,
//     totalQuestions: 55,
//   },
//   {
//     id: "speed-distance",
//     title: "Speed & Distance",
//     description: "Problems involving speed, distance, time, and relative motion",
//     icon: "🏃",
//     difficulty_levels: ["easy", "medium", "hard"],
//     estimatedTime: 45,
//     totalQuestions: 50,
//   },
//   {
//     id: "averages",
//     title: "Averages",
//     description: "Problems involving arithmetic mean, weighted averages, and related concepts",
//     icon: "📈",
//     difficulty_levels: ["easy", "medium", "hard"],
//     estimatedTime: 30,
//     totalQuestions: 40,
//   },
//   {
//     id: "probability",
//     title: "Probability",
//     description: "Basic probability concepts, events, and calculations",
//     icon: "🎲",
//     difficulty_levels: ["easy", "medium", "hard"],
//     estimatedTime: 40,
//     totalQuestions: 45,
//   },
// ]

// export default function AptitudePage() {
//   const [selectedTopic, setSelectedTopic] = useState<any>(null)
//   const [activeTab, setActiveTab] = useState("overview")
//   const [practiceQuestions, setPracticeQuestions] = useState<AptitudeQuestion[]>([])
//   const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
//   const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
//   const [showExplanation, setShowExplanation] = useState(false)
//   const [feedback, setFeedback] = useState<"correct" | "incorrect" | null>(null)
//   const [timeLeft, setTimeLeft] = useState<number>(0)
//   const [isLoading, setIsLoading] = useState(false)

//   useEffect(() => {
//     if (selectedTopic) {
//       setActiveTab("overview")
//       setPracticeQuestions([])
//       setCurrentQuestionIndex(0)
//       setSelectedAnswer(null)
//       setShowExplanation(false)
//       setFeedback(null)
//       setTimeLeft(0)
//     }
//   }, [selectedTopic])

//   useEffect(() => {
//     let timer: NodeJS.Timeout
//     if (timeLeft > 0 && !showExplanation) {
//       timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
//     } else if (timeLeft === 0 && practiceQuestions.length > 0 && !showExplanation) {
//       // Time's up, show explanation
//       handleAnswerSelect(-1) // -1 indicates timeout
//     }
//     return () => clearTimeout(timer)
//   }, [timeLeft, showExplanation, practiceQuestions.length])

//   const handleStartPractice = async (difficulty: "easy" | "medium" | "hard") => {
//     if (selectedTopic) {
//       setIsLoading(true)
//       try {
//         const questions = await AIService.generateAptitudeQuestions(selectedTopic.id, difficulty, 5)
//         setPracticeQuestions(questions)
//         setCurrentQuestionIndex(0)
//         setSelectedAnswer(null)
//         setShowExplanation(false)
//         setFeedback(null)
//         setTimeLeft(questions[0]?.timeLimit || 60)
//         setActiveTab("practice")
//       } catch (error) {
//         console.error("Failed to generate questions:", error)
//       } finally {
//         setIsLoading(false)
//       }
//     }
//   }

//   const handleAnswerSelect = (index: number) => {
//     setSelectedAnswer(index)
//     const currentQuestion = practiceQuestions[currentQuestionIndex]
//     if (currentQuestion) {
//       if (index === currentQuestion.correctAnswer) {
//         setFeedback("correct")
//       } else {
//         setFeedback("incorrect")
//       }
//       setShowExplanation(true)
//       setTimeLeft(0)
//     }
//   }

//   const handleNextQuestion = () => {
//     if (currentQuestionIndex < practiceQuestions.length - 1) {
//       setCurrentQuestionIndex((prev) => prev + 1)
//       setSelectedAnswer(null)
//       setShowExplanation(false)
//       setFeedback(null)
//       const nextQuestion = practiceQuestions[currentQuestionIndex + 1]
//       setTimeLeft(nextQuestion?.timeLimit || 60)
//     } else {
//       // End of practice session
//       alert("Practice session completed!")
//       setPracticeQuestions([])
//       setActiveTab("overview")
//     }
//   }

//   const handlePreviousQuestion = () => {
//     if (currentQuestionIndex > 0) {
//       setCurrentQuestionIndex((prev) => prev - 1)
//       setSelectedAnswer(null)
//       setShowExplanation(false)
//       setFeedback(null)
//       const prevQuestion = practiceQuestions[currentQuestionIndex - 1]
//       setTimeLeft(prevQuestion?.timeLimit || 60)
//     }
//   }

//   const currentQuestion = practiceQuestions[currentQuestionIndex]

//   return (
// // {/* <RouteGuard requiredRole="candidate"> */}
//       <div className="min-h-screen bg-background">
//         <div className="container mx-auto p-4 md:p-8 pt-24">
//           <div className="flex justify-between items-center mb-6">
//             <h1 className="text-3xl font-bold text-foreground">Aptitude Practice</h1>
//             <ThemeToggle />
//           </div>

//           {!selectedTopic ? (
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//               {APTITUDE_TOPICS.map((topic) => (
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
//                     <div className="flex justify-between items-center text-sm text-muted-foreground">
//                       <span>{topic.totalQuestions} Questions</span>
//                       <span>~{topic.estimatedTime} min</span>
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

//               <h2 className="text-2xl font-bold mb-6 text-center text-foreground">{selectedTopic.title} Practice</h2>

//               <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
//                 <TabsList className="grid w-full grid-cols-2 bg-card border-border">
//                   <TabsTrigger value="overview" className="text-foreground">
//                     Overview
//                   </TabsTrigger>
//                   <TabsTrigger value="practice" className="text-foreground">
//                     Practice
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
//                         <span className="font-semibold text-foreground">Total Questions:</span>{" "}
//                         {selectedTopic.totalQuestions}
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
//                   {practiceQuestions.length === 0 ? (
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
//                             Question {currentQuestionIndex + 1} / {practiceQuestions.length}
//                           </span>
//                           <div className="flex items-center gap-4">
//                             <span className="text-sm text-muted-foreground capitalize">
//                               {currentQuestion?.difficulty}
//                             </span>
//                             <div className="flex items-center gap-2">
//                               <Clock className="h-4 w-4 text-muted-foreground" />
//                               <span
//                                 className={cn(
//                                   "text-sm font-mono",
//                                   timeLeft <= 10 ? "text-red-500" : "text-muted-foreground",
//                                 )}
//                               >
//                                 {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, "0")}
//                               </span>
//                             </div>
//                           </div>
//                         </CardTitle>
//                       </CardHeader>
//                       <CardContent className="space-y-4">
//                         <p className="text-lg font-medium text-foreground">{currentQuestion?.question}</p>
//                         <div className="grid gap-2">
//                           {currentQuestion?.options.map((option, index) => (
//                             <Button
//                               key={index}
//                               variant="outline"
//                               className={cn(
//                                 "justify-start text-left h-auto py-3 text-foreground",
//                                 selectedAnswer === index &&
//                                   feedback === "correct" &&
//                                   "bg-green-500/20 border-green-500",
//                                 selectedAnswer === index && feedback === "incorrect" && "bg-red-500/20 border-red-500",
//                                 selectedAnswer !== null &&
//                                   index === currentQuestion.correctAnswer &&
//                                   "border-green-500 bg-green-500/10",
//                                 selectedAnswer !== null && selectedAnswer !== index && "opacity-70",
//                               )}
//                               onClick={() => !showExplanation && handleAnswerSelect(index)}
//                               disabled={showExplanation}
//                             >
//                               {String.fromCharCode(65 + index)}. {option}
//                             </Button>
//                           ))}
//                         </div>

//                         <AnimatePresence>
//                           {showExplanation && (
//                             <motion.div
//                               initial={{ opacity: 0, y: 20 }}
//                               animate={{ opacity: 1, y: 0 }}
//                               exit={{ opacity: 0, y: -20 }}
//                               transition={{ duration: 0.3 }}
//                               className="mt-4 p-4 rounded-md bg-secondary/30 border border-secondary space-y-2"
//                             >
//                               <h3 className="font-semibold text-foreground flex items-center gap-2">
//                                 {feedback === "correct" ? (
//                                   <CheckCircle className="h-5 w-5 text-green-500" />
//                                 ) : (
//                                   <XCircle className="h-5 w-5 text-red-500" />
//                                 )}
//                                 {feedback === "correct"
//                                   ? "Correct!"
//                                   : selectedAnswer === -1
//                                     ? "Time's Up!"
//                                     : "Incorrect."}
//                               </h3>
//                               <p className="text-muted-foreground">{currentQuestion?.explanation}</p>
//                             </motion.div>
//                           )}
//                         </AnimatePresence>

//                         <div className="flex justify-between mt-4">
//                           <Button onClick={handlePreviousQuestion} disabled={currentQuestionIndex === 0}>
//                             <ChevronLeft className="h-4 w-4 mr-2" /> Previous
//                           </Button>
//                           <Button onClick={handleNextQuestion} disabled={!showExplanation}>
//                             {currentQuestionIndex === practiceQuestions.length - 1 ? "Finish Session" : "Next Question"}{" "}
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

