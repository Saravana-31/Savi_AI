import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await request.json()
    const client = await clientPromise
    const interviews = client.db().collection("interviews")

    // Get job context from request if available
    const jobContext = data.jobContext || null

    const interview = {
      userId: session.user.email,
      type: data.type || "mock",
      startTime: new Date(),
      endTime: data.endTime ? new Date(data.endTime) : new Date(),
      questions: data.questions || [],
      answers: data.answers || [],
      emotions: data.emotions || [],
      eyeContactScores: data.eyeContactScores || [],
      timeTaken: data.timeTaken || [],
      tabSwitches: data.tabSwitches || 0,
      speechUsed: data.speechUsed || false,
      // Store job context with interview
      jobContext: jobContext
        ? {
          jobTitle: jobContext.jobTitle,
          jobDescription: jobContext.jobDescription,
          matchedSkills: jobContext.matchedSkills,
          matchPercentage: jobContext.matchPercentage,
        }
        : null,
      metrics: {
        averageResponseTime: data.metrics?.averageResponseTime || 0,
        averageEyeContact: data.metrics?.averageEyeContact || 0,
        totalDuration: data.metrics?.totalDuration || 0,
        completionRate: data.metrics?.completionRate || 100,
        overallScore: Math.round(
          ((data.emotions?.filter((e: string) => e === "Confident" || e === "Happy").length || 0) /
            (data.emotions?.length || 1)) *
          100,
        ),
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await interviews.insertOne(interview)

    // ── Size guard: log document size, never send full raw arrays back ─────────
    const docSizeKB = Math.round(JSON.stringify(interview).length / 1024)
    console.log(`[Interview] Saved document size: ${docSizeKB} KB`)
    if (docSizeKB > 500) {
      console.warn(`[Interview] Document size ${docSizeKB}KB exceeds 500KB limit — check payload`)
    }

    // Return only a lightweight receipt — NOT the full interview object
    return NextResponse.json({
      success: true,
      interviewId: result.insertedId.toString(),
      summary: {
        type: interview.type,
        questionsCount: (interview.questions as unknown[]).length,
        averageEyeContact: interview.metrics.averageEyeContact,
        overallScore: interview.metrics.overallScore,
        totalDuration: interview.metrics.totalDuration,
        tabSwitches: interview.tabSwitches,
      },
    })
  } catch (error) {
    console.error("Interview API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const interviewId = searchParams.get("id")

    const client = await clientPromise
    const interviews = client.db().collection("interviews")

    if (interviewId) {
      // Get specific interview
      const interview = await interviews.findOne({
        _id: new ObjectId(interviewId),
        userId: session.user.email,
      })

      if (!interview) {
        return NextResponse.json({ error: "Interview not found" }, { status: 404 })
      }

      return NextResponse.json(interview)
    } else {
      // Get all REAL interviews for user (no sample data)
      const userInterviews = await interviews
        .find({
          userId: session.user.email,
        })
        .sort({ createdAt: -1 })
        .toArray()

      return NextResponse.json(userInterviews)
    }
  } catch (error) {
    console.error("Interview GET API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
