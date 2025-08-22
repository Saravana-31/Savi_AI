// import { type NextRequest, NextResponse } from "next/server"
// import { AIModelManager } from "@/lib/ai-models"
// import type { AptitudeQuestion } from "@/lib/ai-service"

// export async function POST(request: NextRequest) {
//   try {
//     const { topic, difficulty, count } = await request.json()

//     if (!topic || !difficulty || !count) {
//       return NextResponse.json({ error: "Missing required parameters" }, { status: 400 })
//     }

//     const prompt = `Generate ${count} multiple choice aptitude questions about ${topic} with ${difficulty} difficulty level.

// Format each question as JSON with the following structure:
// {
//   "question": "The question text",
//   "options": ["Option A", "Option B", "Option C", "Option D"],
//   "correctAnswer": 0,
//   "explanation": "Detailed explanation of the solution",
//   "timeLimit": 60
// }

// Topic: ${topic}
// Difficulty: ${difficulty}
// Number of questions: ${count}

// Requirements:
// - Questions should be practical and test real understanding
// - Include step-by-step explanations
// - Options should be plausible but only one correct
// - Time limit should be appropriate for difficulty (easy: 60s, medium: 90s, hard: 120s)

// Generate the questions now:`

//     let generatedText = ""

//     // Try to use AI model first
//     if (AIModelManager.isModelAvailable("mistral-7b")) {
//       try {
//         generatedText = await AIModelManager.generateText("mistral-7b", prompt)
//       } catch (error) {
//         console.error("AI model failed, using fallback:", error)
//       }
//     }

//     // Parse AI response or use fallback
//     let questions: AptitudeQuestion[]

//     if (generatedText) {
//       try {
//         questions = parseAIResponse(generatedText, topic, difficulty)
//       } catch (error) {
//         console.error("Failed to parse AI response:", error)
//         questions = generateFallbackQuestions(topic, difficulty, count)
//       }
//     } else {
//       questions = generateFallbackQuestions(topic, difficulty, count)
//     }

//     return NextResponse.json({ questions })
//   } catch (error) {
//     console.error("Error in generate-aptitude API:", error)
//     return NextResponse.json({ error: "Internal server error" }, { status: 500 })
//   }
// }

// function parseAIResponse(text: string, topic: string, difficulty: string): AptitudeQuestion[] {
//   // Try to extract JSON from AI response
//   const jsonMatches = text.match(/\{[^}]+\}/g)
//   const questions: AptitudeQuestion[] = []

//   if (jsonMatches) {
//     jsonMatches.forEach((match, index) => {
//       try {
//         const parsed = JSON.parse(match)
//         questions.push({
//           id: `ai-${Date.now()}-${index}`,
//           question: parsed.question,
//           options: parsed.options,
//           correctAnswer: parsed.correctAnswer,
//           explanation: parsed.explanation,
//           difficulty: difficulty as "easy" | "medium" | "hard",
//           topic,
//           timeLimit: parsed.timeLimit || (difficulty === "easy" ? 60 : difficulty === "medium" ? 90 : 120),
//         })
//       } catch (error) {
//         console.error("Failed to parse question JSON:", error)
//       }
//     })
//   }

//   return questions
// }

// function generateFallbackQuestions(topic: string, difficulty: string, count: number): AptitudeQuestion[] {
//   const templates = {
//     "time-work": [
//       {
//         question:
//           "A can complete a work in {x} days and B can complete the same work in {y} days. If they work together, in how many days can they complete the work?",
//         generateOptions: (x: number, y: number) => {
//           const correct = (x * y) / (x + y)
//           return [correct.toFixed(1), ((x + y) / 2).toFixed(1), (x + y).toFixed(1), Math.abs(x - y).toFixed(1)]
//         },
//         explanation: (x: number, y: number) =>
//           `A's rate = 1/${x}, B's rate = 1/${y}. Combined rate = 1/${x} + 1/${y} = ${x + y}/${x * y}. Time = ${((x * y) / (x + y)).toFixed(1)} days.`,
//       },
//     ],
//     percentage: [
//       {
//         question: "If {x}% of a number is {y}, what is the number?",
//         generateOptions: (x: number, y: number) => {
//           const correct = (y * 100) / x
//           return [correct.toString(), ((y * x) / 100).toString(), (y + x).toString(), (y * x).toString()]
//         },
//         explanation: (x: number, y: number) =>
//           `If ${x}% of number = ${y}, then number = ${y} × 100/${x} = ${(y * 100) / x}`,
//       },
//     ],
//   }

//   const topicTemplates = templates[topic as keyof typeof templates] || templates["percentage"]
//   const questions: AptitudeQuestion[] = []

//   for (let i = 0; i < count; i++) {
//     const template = topicTemplates[i % topicTemplates.length]
//     const x = Math.floor(Math.random() * 20) + 5
//     const y = Math.floor(Math.random() * 50) + 10

//     const question = template.question.replace("{x}", x.toString()).replace("{y}", y.toString())
//     const options = template.generateOptions(x, y)
//     const correctAnswer = 0 // First option is always correct in our templates

//     questions.push({
//       id: `fallback-${Date.now()}-${i}`,
//       question,
//       options,
//       correctAnswer,
//       explanation: template.explanation(x, y),
//       difficulty: difficulty as "easy" | "medium" | "hard",
//       topic,
//       timeLimit: difficulty === "easy" ? 60 : difficulty === "medium" ? 90 : 120,
//     })
//   }

//   return questions
// }
