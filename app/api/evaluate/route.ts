import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

interface EvaluateRequest {
    question: string
    answer: string
    role: string
    topic: string
}

interface EvaluationResult {
    score: number
    strengths: string[]
    improvements: string[]
    overall_feedback: string
    source: "gemini" | "heuristic"
}

// ── Heuristic Fallback Evaluator ───────────────────────────────────────────────
function heuristicEvaluation(question: string, answer: string, role: string, topic: string): EvaluationResult {
    const wordCount = answer.trim().split(/\s+/).filter(Boolean).length
    const sentences = answer.split(/[.!?]+/).filter((s) => s.trim().length > 0)
    const hasExamples = /for example|for instance|such as|like when|in my (past|previous|current)|at my (previous|current|last)/i.test(answer)
    const usesStructure = /first|second|third|next|finally|additionally|however|therefore|in conclusion/i.test(answer)
    const hasNumbers = /\d+/.test(answer)
    const answerLower = answer.toLowerCase()

    // Role/topic-specific keyword scoring
    const ROLE_KEYWORDS: Record<string, string[]> = {
        "Frontend Developer": ["react", "vue", "angular", "css", "html", "javascript", "typescript", "component", "dom", "ui", "ux", "responsive"],
        "Backend Developer": ["api", "database", "server", "node", "python", "java", "rest", "graphql", "sql", "nosql", "authentication", "scalability"],
        "Full Stack Developer": ["frontend", "backend", "deployment", "api", "database", "react", "node", "integration"],
        "Data Analyst": ["data", "analysis", "sql", "python", "visualization", "metrics", "insights", "report", "dashboard", "excel", "statistics"],
        "Machine Learning Engineer": ["model", "training", "inference", "accuracy", "dataset", "neural", "algorithm", "feature", "prediction", "python", "tensorflow", "pytorch"],
        "DevOps Engineer": ["docker", "kubernetes", "ci/cd", "pipeline", "deployment", "terraform", "aws", "monitoring", "automation", "infrastructure"],
    }

    const TOPIC_KEYWORDS: Record<string, string[]> = {
        DSA: ["algorithm", "complexity", "time", "space", "data structure", "array", "tree", "graph", "sort", "search", "recursion"],
        "System Design": ["scalability", "architecture", "database", "cache", "load balancer", "microservice", "api gateway", "message queue"],
        Behavioral: ["situation", "task", "action", "result", "team", "learned", "challenge", "conflict", "collaboration"],
        "Core Subject": ["concept", "principle", "pattern", "design pattern", "protocol", "specification", "standard"],
    }

    const roleKeywords = ROLE_KEYWORDS[role] || []
    const topicKeywords = TOPIC_KEYWORDS[topic] || []
    const allKeywords = [...roleKeywords, ...topicKeywords]
    const keywordsFound = allKeywords.filter((kw) => answerLower.includes(kw.toLowerCase()))
    const keywordScore = Math.min(keywordsFound.length / Math.max(allKeywords.length * 0.3, 1), 1)

    // Score components
    let score = 4 // base
    if (wordCount >= 80) score += 1
    if (wordCount >= 150) score += 0.5
    if (sentences.length >= 3) score += 0.5
    if (hasExamples) score += 1
    if (usesStructure) score += 0.5
    if (hasNumbers) score += 0.3
    score += keywordScore * 2.5
    score = Math.max(1, Math.min(10, Math.round(score)))

    // Build feedback
    const strengths: string[] = []
    const improvements: string[] = []

    if (wordCount >= 100) strengths.push("Detailed and comprehensive answer")
    if (hasExamples) strengths.push("Good use of concrete examples")
    if (usesStructure) strengths.push("Well-structured response with clear flow")
    if (keywordsFound.length > 0) strengths.push(`Demonstrates knowledge of ${keywordsFound.slice(0, 3).join(", ")}`)
    if (sentences.length >= 4) strengths.push("Covered multiple aspects of the question")

    if (wordCount < 60) improvements.push("Provide a more detailed explanation with at least 3-4 sentences")
    if (!hasExamples) improvements.push("Include specific examples from your experience to strengthen your answer")
    if (!usesStructure) improvements.push("Organise your answer with a clearer structure (e.g., STAR method for behavioral questions)")
    if (keywordsFound.length < 2 && allKeywords.length > 0) improvements.push(`Include more ${topic}-specific terminology for this ${role} role`)
    if (score < 5) improvements.push("Try to demonstrate deeper understanding of the core concept")

    // Default if needed
    if (strengths.length === 0) strengths.push("Attempted to answer the question")
    if (improvements.length === 0) improvements.push("Continue to add more specific examples and technical depth")

    const overallMessages: Record<number, string> = {
        9: "Excellent answer! Thoroughly covered the topic with strong examples and domain expertise.",
        8: "Strong response with good depth. Minor additions could make it even more compelling.",
        7: "Good answer that addresses the key points. Adding more specifics would strengthen it.",
        6: "Decent answer but could benefit from more examples and technical depth.",
        5: "Covers the basics but needs more elaboration and role-specific details.",
        4: "Partial answer — consider the full scope of the question and use the STAR method.",
        3: "Needs significant improvement. Focus on structure and relevant examples.",
        2: "Very limited response. Study the topic more and practice delivering structured answers.",
        1: "Answer doesn't address the question adequately. Review the fundamentals.",
    }

    const overall_feedback = overallMessages[score] || overallMessages[5]

    return { score, strengths: strengths.slice(0, 3), improvements: improvements.slice(0, 3), overall_feedback, source: "heuristic" as const }
}

// ── Route Handler ─────────────────────────────────────────────────────────────
export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const body: EvaluateRequest = await request.json()
        const { question, answer, role, topic } = body

        if (!question || !answer) {
            return NextResponse.json({ error: "Question and answer are required" }, { status: 400 })
        }

        // Try Gemini API if GEMINI_API_KEY is set
        const geminiKey = process.env.GEMINI_API_KEY
        console.log("[Evaluate] GEMINI_API_KEY present:", !!geminiKey)
        if (geminiKey) {
            console.log("[Evaluate] Using Gemini evaluator")
            try {
                const prompt = `You are an expert ${role} interviewer evaluating a candidate's interview answer.

Question: ${question}
Role: ${role}
Topic: ${topic}
Candidate's Answer: ${answer}

Evaluate this answer and respond with ONLY valid JSON in this exact format:
{
  "score": <integer 1-10>,
  "strengths": ["<strength 1>", "<strength 2>"],
  "improvements": ["<improvement 1>", "<improvement 2>"],
  "overall_feedback": "<1-2 sentence overall assessment>"
}

Be constructive, specific, and encouraging. Score 1-4 is poor, 5-6 is average, 7-8 is good, 9-10 is excellent.`

                const response = await fetch(
                    `https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key=${geminiKey}`,
                    {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            contents: [{ parts: [{ text: prompt }] }],
                            generationConfig: { temperature: 0.3, maxOutputTokens: 512 },
                        }),
                        signal: AbortSignal.timeout(8000),
                    }
                )

                if (response.ok) {
                    const data = await response.json()
                    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || ""
                    console.log("[Evaluate] Gemini raw response length:", text.length)
                    // Extract JSON from response
                    const jsonMatch = text.match(/\{[\s\S]*\}/)
                    if (jsonMatch) {
                        const evaluation: EvaluationResult = JSON.parse(jsonMatch[0])
                        if (evaluation.score && evaluation.strengths && evaluation.improvements && evaluation.overall_feedback) {
                            console.log("[Evaluate] Gemini evaluation SUCCESS, score:", evaluation.score)
                            return NextResponse.json({ ...evaluation, source: "gemini" })
                        }
                        console.warn("[Evaluate] Gemini JSON parsed but missing required fields:", evaluation)
                    } else {
                        console.warn("[Evaluate] Gemini returned non-JSON text:", text.slice(0, 200))
                    }
                } else {
                    const errBody = await response.text()
                    console.error(`[Evaluate] Gemini HTTP error: ${response.status} ${response.statusText} — ${errBody.slice(0, 300)}`)
                    if (response.status === 429) {
                        // Quota exceeded — fall back to heuristic but flag it
                        const result = heuristicEvaluation(question, answer, role, topic)
                        console.log("[Evaluate] Using heuristic evaluator (Gemini quota exceeded)")
                        return NextResponse.json({ ...result, quota_exceeded: true })
                    }
                }
            } catch (geminiError) {
                console.error("[Evaluate] Gemini call failed, reason:", geminiError)
                console.log("[Evaluate] Falling back to heuristic evaluator")
            }
        } else {
            console.log("[Evaluate] No GEMINI_API_KEY — using heuristic evaluator")
        }

        // Fallback: heuristic evaluation
        console.log("[Evaluate] Using heuristic evaluator")
        const result = heuristicEvaluation(question, answer, role, topic)
        return NextResponse.json(result)
    } catch (error) {
        console.error("Evaluate API error:", error)
        return NextResponse.json({ error: "Evaluation failed" }, { status: 500 })
    }
}
