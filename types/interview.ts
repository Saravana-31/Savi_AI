// Shared types for the interview configuration system

export interface InterviewConfig {
    type: "mock" | "formal"
    role: string
    topic: string
}
