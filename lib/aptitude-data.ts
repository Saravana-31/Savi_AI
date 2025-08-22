export interface AptitudeTopic {
  id: string
  title: string
  description: string
  icon: string
  formulas: Formula[]
  examples: Example[]
  questions: AptitudeQuestion[]
}

export interface Formula {
  id: string
  title: string
  formula: string
  description: string
}

export interface Example {
  id: string
  problem: string
  solution: string
  explanation: string
}

export interface AptitudeQuestion {
  id: string
  topicId: string
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
  difficulty: "easy" | "medium" | "hard"
}

export interface UserAptitudeProgress {
  userId: string
  topic: string
  attempted: number
  correct: number
  accuracy: number
  level: "Beginner" | "Intermediate" | "Proficient" | "Expert"
  lastPracticed: Date
}

export const APTITUDE_TOPICS: AptitudeTopic[] = [
  {
    id: "time-work",
    title: "Time & Work",
    description: "Problems involving work rates, efficiency, and time calculations",
    icon: "⏰",
    formulas: [
      {
        id: "basic-work",
        title: "Basic Work Formula",
        formula: "Work = Rate × Time",
        description: "Fundamental relationship between work, rate, and time",
      },
      {
        id: "combined-work",
        title: "Combined Work",
        formula: "1/A + 1/B = 1/T",
        description: "When A and B work together, they complete the work in T time",
      },
      {
        id: "efficiency",
        title: "Efficiency Ratio",
        formula: "Efficiency ∝ 1/Time",
        description: "Higher efficiency means less time to complete the same work",
      },
    ],
    examples: [
      {
        id: "example-1",
        problem:
          "A can complete a work in 12 days and B can complete the same work in 18 days. How long will they take to complete the work together?",
        solution: "1/12 + 1/18 = 1/T\n(3 + 2)/36 = 1/T\n5/36 = 1/T\nT = 36/5 = 7.2 days",
        explanation: "We add their work rates and find the combined time",
      },
    ],
    questions: [
      {
        id: "tw-q1",
        topicId: "time-work",
        question:
          "A can finish a work in 10 days and B can finish the same work in 15 days. If they work together, in how many days will they complete the work?",
        options: ["5 days", "6 days", "7 days", "8 days"],
        correctAnswer: 1,
        explanation: "Combined rate = 1/10 + 1/15 = (3+2)/30 = 5/30 = 1/6. So they complete work in 6 days.",
        difficulty: "easy",
      },
      {
        id: "tw-q2",
        topicId: "time-work",
        question:
          "A is twice as efficient as B. If A and B together can complete a work in 12 days, how long will A alone take?",
        options: ["18 days", "20 days", "24 days", "36 days"],
        correctAnswer: 0,
        explanation:
          "If A is twice as efficient as B, then A:B = 2:1. Combined rate = 2x + x = 3x = 1/12. So x = 1/36, and A's rate = 2/36 = 1/18. A alone takes 18 days.",
        difficulty: "medium",
      },
    ],
  },
  {
    id: "pipes-cisterns",
    title: "Pipes & Cisterns",
    description: "Problems involving filling and emptying tanks with multiple pipes",
    icon: "🚰",
    formulas: [
      {
        id: "filling-rate",
        title: "Filling Rate",
        formula: "Rate = 1/Time to fill",
        description: "Rate at which a pipe fills the tank",
      },
      {
        id: "emptying-rate",
        title: "Emptying Rate",
        formula: "Rate = -1/Time to empty",
        description: "Rate at which a pipe empties the tank (negative)",
      },
      {
        id: "net-rate",
        title: "Net Rate",
        formula: "Net Rate = Sum of all rates",
        description: "Combined effect of all pipes working together",
      },
    ],
    examples: [
      {
        id: "pc-example-1",
        problem:
          "Pipe A can fill a tank in 6 hours and pipe B can empty it in 8 hours. If both pipes are opened together, in how much time will the tank be filled?",
        solution:
          "Filling rate of A = 1/6 per hour\nEmptying rate of B = -1/8 per hour\nNet rate = 1/6 - 1/8 = (4-3)/24 = 1/24\nTime = 24 hours",
        explanation: "We subtract the emptying rate from the filling rate to get net rate",
      },
    ],
    questions: [
      {
        id: "pc-q1",
        topicId: "pipes-cisterns",
        question:
          "A pipe can fill a tank in 4 hours and another pipe can empty it in 6 hours. If both pipes are opened, how long will it take to fill the tank?",
        options: ["10 hours", "12 hours", "15 hours", "20 hours"],
        correctAnswer: 1,
        explanation: "Net rate = 1/4 - 1/6 = (3-2)/12 = 1/12. Time = 12 hours.",
        difficulty: "easy",
      },
    ],
  },
  {
    id: "averages",
    title: "Averages",
    description: "Problems involving mean, median, and statistical averages",
    icon: "📊",
    formulas: [
      {
        id: "basic-average",
        title: "Basic Average",
        formula: "Average = Sum of values / Number of values",
        description: "Fundamental formula for calculating average",
      },
      {
        id: "weighted-average",
        title: "Weighted Average",
        formula: "Weighted Avg = Σ(value × weight) / Σ(weight)",
        description: "Average when different values have different importance",
      },
    ],
    examples: [
      {
        id: "avg-example-1",
        problem:
          "The average of 5 numbers is 20. If one number is excluded, the average becomes 15. What is the excluded number?",
        solution: "Sum of 5 numbers = 5 × 20 = 100\nSum of 4 numbers = 4 × 15 = 60\nExcluded number = 100 - 60 = 40",
        explanation: "We find the total sum and subtract the sum of remaining numbers",
      },
    ],
    questions: [
      {
        id: "avg-q1",
        topicId: "averages",
        question:
          "The average age of 10 students is 15 years. If the teacher's age is included, the average becomes 16 years. What is the teacher's age?",
        options: ["25 years", "26 years", "27 years", "28 years"],
        correctAnswer: 1,
        explanation:
          "Sum of 10 students = 10 × 15 = 150. Sum of 11 people = 11 × 16 = 176. Teacher's age = 176 - 150 = 26 years.",
        difficulty: "easy",
      },
    ],
  },
  {
    id: "probability",
    title: "Probability",
    description: "Problems involving chance, combinations, and statistical probability",
    icon: "🎲",
    formulas: [
      {
        id: "basic-probability",
        title: "Basic Probability",
        formula: "P(E) = Favorable outcomes / Total outcomes",
        description: "Probability of an event occurring",
      },
      {
        id: "addition-rule",
        title: "Addition Rule",
        formula: "P(A ∪ B) = P(A) + P(B) - P(A ∩ B)",
        description: "Probability of either event A or B occurring",
      },
      {
        id: "multiplication-rule",
        title: "Multiplication Rule",
        formula: "P(A ∩ B) = P(A) × P(B|A)",
        description: "Probability of both events A and B occurring",
      },
    ],
    examples: [
      {
        id: "prob-example-1",
        problem: "What is the probability of getting a head when a fair coin is tossed?",
        solution: "Favorable outcomes = 1 (Head)\nTotal outcomes = 2 (Head, Tail)\nProbability = 1/2 = 0.5",
        explanation: "Simple probability calculation with equally likely outcomes",
      },
    ],
    questions: [
      {
        id: "prob-q1",
        topicId: "probability",
        question: "What is the probability of drawing a red card from a standard deck of 52 cards?",
        options: ["1/4", "1/3", "1/2", "2/3"],
        correctAnswer: 2,
        explanation:
          "There are 26 red cards (13 hearts + 13 diamonds) out of 52 total cards. Probability = 26/52 = 1/2.",
        difficulty: "easy",
      },
    ],
  },
]

export class AptitudeService {
  static getTopicById(id: string): AptitudeTopic | undefined {
    return APTITUDE_TOPICS.find((topic) => topic.id === id)
  }

  static getQuestionsByTopic(topicId: string, difficulty?: string, count?: number): AptitudeQuestion[] {
    const topic = this.getTopicById(topicId)
    if (!topic) return []

    let questions = topic.questions
    if (difficulty) {
      questions = questions.filter((q) => q.difficulty === difficulty)
    }

    if (count) {
      questions = questions.sort(() => Math.random() - 0.5).slice(0, count)
    }

    return questions
  }

  static calculateLevel(accuracy: number): UserAptitudeProgress["level"] {
    if (accuracy >= 90) return "Expert"
    if (accuracy >= 75) return "Proficient"
    if (accuracy >= 60) return "Intermediate"
    return "Beginner"
  }

  static getLevelColor(level: UserAptitudeProgress["level"]): string {
    switch (level) {
      case "Expert":
        return "text-purple-500"
      case "Proficient":
        return "text-green-500"
      case "Intermediate":
        return "text-yellow-500"
      default:
        return "text-red-500"
    }
  }

  static getLevelBadge(level: UserAptitudeProgress["level"]): string {
    switch (level) {
      case "Expert":
        return "🟣"
      case "Proficient":
        return "🟢"
      case "Intermediate":
        return "🟡"
      default:
        return "🔴"
    }
  }
}
