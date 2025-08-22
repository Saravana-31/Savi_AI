// import { type NextRequest, NextResponse } from "next/server"
// import { AIModelManager } from "@/lib/ai-models"
// import type { CodingProblem } from "@/lib/ai-service"

// export async function POST(request: NextRequest) {
//   try {
//     const { topic, difficulty, count } = await request.json()

//     if (!topic || !difficulty || !count) {
//       return NextResponse.json({ error: "Missing required parameters" }, { status: 400 })
//     }

//     const prompt = `Generate ${count} coding problems about ${topic} with ${difficulty} difficulty level.

// For each problem, provide:
// 1. Title and description
// 2. Examples with input/output
// 3. Constraints
// 4. Hints
// 5. Starter code for JavaScript, Python, C++, Java, and C
// 6. Complete solutions for all languages
// 7. Test cases

// Topic: ${topic}
// Difficulty: ${difficulty}
// Number of problems: ${count}

// Format as JSON array with this structure:
// {
//   "title": "Problem Title",
//   "description": "Problem description",
//   "examples": [{"input": "example input", "output": "example output", "explanation": "why this output"}],
//   "constraints": ["constraint 1", "constraint 2"],
//   "hints": ["hint 1", "hint 2"],
//   "starterCode": {
//     "javascript": "function solution() { }",
//     "python": "def solution():\n    pass",
//     "cpp": "class Solution { public: };",
//     "java": "class Solution { }",
//     "c": "int solution() { }"
//   },
//   "solution": {
//     "javascript": "complete solution",
//     "python": "complete solution",
//     "cpp": "complete solution", 
//     "java": "complete solution",
//     "c": "complete solution"
//   },
//   "testCases": [{"input": "test input", "expectedOutput": "expected output"}]
// }

// Generate the problems now:`

//     let generatedText = ""

//     // Try to use AI model first
//     if (AIModelManager.isModelAvailable("codellama")) {
//       try {
//         generatedText = await AIModelManager.generateText("codellama", prompt)
//       } catch (error) {
//         console.error("AI model failed, using fallback:", error)
//       }
//     }

//     // Parse AI response or use fallback
//     let problems: CodingProblem[]

//     if (generatedText) {
//       try {
//         problems = parseAIResponse(generatedText, difficulty)
//       } catch (error) {
//         console.error("Failed to parse AI response:", error)
//         problems = generateFallbackProblems(topic, difficulty, count)
//       }
//     } else {
//       problems = generateFallbackProblems(topic, difficulty, count)
//     }

//     return NextResponse.json({ problems })
//   } catch (error) {
//     console.error("Error in generate-coding API:", error)
//     return NextResponse.json({ error: "Internal server error" }, { status: 500 })
//   }
// }

// function parseAIResponse(text: string, difficulty: string): CodingProblem[] {
//   // Try to extract JSON from AI response
//   const problems: CodingProblem[] = []

//   try {
//     // Look for JSON array or individual JSON objects
//     const jsonMatch = text.match(/\[[\s\S]*\]/) || text.match(/\{[\s\S]*\}/)
//     if (jsonMatch) {
//       const parsed = JSON.parse(jsonMatch[0])
//       const problemsArray = Array.isArray(parsed) ? parsed : [parsed]

//       problemsArray.forEach((problem, index) => {
//         problems.push({
//           id: `ai-${Date.now()}-${index}`,
//           title: problem.title,
//           description: problem.description,
//           difficulty: difficulty as "easy" | "medium" | "hard",
//           examples: problem.examples || [],
//           constraints: problem.constraints || [],
//           hints: problem.hints || [],
//           starterCode: problem.starterCode || {},
//           solution: problem.solution || {},
//           testCases: problem.testCases || [],
//         })
//       })
//     }
//   } catch (error) {
//     console.error("Failed to parse AI response:", error)
//   }

//   return problems
// }

// function generateFallbackProblems(topic: string, difficulty: string, count: number): CodingProblem[] {
//   const problemTemplates = {
//     arrays: {
//       easy: [
//         {
//           title: "Find Maximum Element",
//           description: "Given an array of integers, find and return the maximum element.",
//           examples: [{ input: "[1, 3, 2, 8, 5]", output: "8", explanation: "8 is the largest number in the array" }],
//           constraints: ["1 <= array.length <= 1000", "-1000 <= array[i] <= 1000"],
//           hints: ["Iterate through the array and keep track of the maximum value seen so far"],
//           starterCode: {
//             javascript: "function findMax(arr) {\n    // Your code here\n}",
//             python: "def find_max(arr):\n    # Your code here\n    pass",
//             cpp: "int findMax(vector<int>& arr) {\n    // Your code here\n}",
//             java: "public int findMax(int[] arr) {\n    // Your code here\n}",
//             c: "int findMax(int* arr, int size) {\n    // Your code here\n}",
//           },
//           solution: {
//             javascript:
//               "function findMax(arr) {\n    let max = arr[0];\n    for (let i = 1; i < arr.length; i++) {\n        if (arr[i] > max) {\n            max = arr[i];\n        }\n    }\n    return max;\n}",
//             python:
//               "def find_maxfallback(arr):\n    max_val = arr[0]\n    for i in range(1, len(arr)):\n        if arr[i] > max_val:\n            max_val = arr[i]\n    return max_val",
//             cpp: "int findMax(vector<int>& arr) {\n    int max = arr[0];\n    for (int i = 1; i < arr.size(); i++) {\n        if (arr[i] > max) {\n            max = arr[i];\n        }\n    }\n    return max;\n}",
//             java: "public int findMax(int[] arr) {\n    int max = arr[0];\n    for (int i = 1; i < arr.length; i++) {\n        if (arr[i] > max) {\n            max = arr[i];\n        }\n    }\n    return max;\n}",
//             c: "int findMax(int* arr, int size) {\n    int max = arr[0];\n    for (int i = 1; i < size; i++) {\n        if (arr[i] > max) {\n            max = arr[i];\n        }\n    }\n    return max;\n}",
//           },
//           testCases: [
//             { input: "[1, 3, 2, 8, 5]", expectedOutput: "8" },
//             { input: "[-1, -3, -2]", expectedOutput: "-1" },
//           ],
//         },
//       ],
//     },
//     strings: {
//       easy: [
//         {
//           title: "Reverse String",
//           description: "Write a function that reverses a string.",
//           examples: [
//             { input: '"hello"', output: '"olleh"', explanation: "The string is reversed character by character" },
//           ],
//           constraints: ["1 <= s.length <= 1000"],
//           hints: ["Use two pointers approach", "Swap characters from both ends moving towards center"],
//           starterCode: {
//             javascript: "function reverseString(s) {\n    // Your code here\n}",
//             python: "def reverse_string(s):\n    # Your code here\n    pass",
//             cpp: "string reverseString(string s) {\n    // Your code here\n}",
//             java: "public String reverseString(String s) {\n    // Your code here\n}",
//             c: "char* reverseString(char* s) {\n    // Your code here\n}",
//           },
//           solution: {
//             javascript: "function reverseString(s) {\n    return s.split('').reverse().join('');\n}",
//             python: "def reverse_string(s):\n    return s[::-1]",
//             cpp: "string reverseString(string s) {\n    reverse(s.begin(), s.end());\n    return s;\n}",
//             java: "public String reverseString(String s) {\n    return new StringBuilder(s).reverse().toString();\n}",
//             c: "char* reverseString(char* s) {\n    int len = strlen(s);\n    for (int i = 0; i < len / 2; i++) {\n        char temp = s[i];\n        s[i] = s[len - 1 - i];\n        s[len - 1 - i] = temp;\n    }\n    return s;\n}",
//           },
//           testCases: [
//             { input: '"hello"', expectedOutput: '"olleh"' },
//             { input: '"world"', expectedOutput: '"dlrow"' },
//           ],
//         },
//       ],
//     },
//   }

//   const topicProblems = problemTemplates[topic as keyof typeof problemTemplates]?.easy || problemTemplates.arrays.easy
//   const problems: CodingProblem[] = []

//   for (let i = 0; i < count; i++) {
//     const template = topicProblems[i % topicProblems.length]
//     problems.push({
//       id: `fallback-${Date.now()}-${i}`,
//       ...template,
//       difficulty: difficulty as "easy" | "medium" | "hard",
//     })
//   }

//   return problems
// }
