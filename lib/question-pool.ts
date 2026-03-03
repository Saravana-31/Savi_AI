export interface Question {
  id: string
  text: string
  category: "general" | "technical" | "behavioral" | "situational"
  difficulty: "easy" | "medium" | "hard"
  skills?: string[]
}

const QUESTION_POOL: Question[] = [
  // General Questions
  {
    id: "gen_1",
    text: "Tell me about yourself and your professional background.",
    category: "general",
    difficulty: "easy",
  },
  {
    id: "gen_2",
    text: "Why are you interested in this position?",
    category: "general",
    difficulty: "easy",
  },
  {
    id: "gen_3",
    text: "What are your greatest strengths?",
    category: "general",
    difficulty: "easy",
  },
  {
    id: "gen_4",
    text: "What is your biggest weakness?",
    category: "general",
    difficulty: "medium",
  },
  {
    id: "gen_5",
    text: "Where do you see yourself in 5 years?",
    category: "general",
    difficulty: "easy",
  },
  {
    id: "gen_6",
    text: "Why do you want to work for our company?",
    category: "general",
    difficulty: "medium",
  },
  {
    id: "gen_7",
    text: "What motivates you in your work?",
    category: "general",
    difficulty: "easy",
  },
  {
    id: "gen_8",
    text: "How do you handle stress and pressure?",
    category: "general",
    difficulty: "medium",
  },

  // Technical Questions
  {
    id: "tech_1",
    text: "Describe your experience with JavaScript and modern frameworks.",
    category: "technical",
    difficulty: "medium",
    skills: ["JavaScript", "React", "Vue.js", "Angular", "Node.js"],
  },
  {
    id: "tech_2",
    text: "How do you ensure code quality and maintainability in your projects?",
    category: "technical",
    difficulty: "medium",
    skills: ["Testing", "Code Review", "Git", "CI/CD"],
  },
  {
    id: "tech_3",
    text: "Explain your approach to database design and optimization.",
    category: "technical",
    difficulty: "hard",
    skills: ["SQL", "MongoDB", "PostgreSQL", "Database Design"],
  },
  {
    id: "tech_4",
    text: "How do you stay current with new technologies and industry trends?",
    category: "technical",
    difficulty: "easy",
  },
  {
    id: "tech_5",
    text: "Describe your experience with cloud platforms and deployment.",
    category: "technical",
    difficulty: "medium",
    skills: ["AWS", "Azure", "GCP", "Docker", "Kubernetes"],
  },
  {
    id: "tech_6",
    text: "How do you approach API design and integration?",
    category: "technical",
    difficulty: "medium",
    skills: ["REST", "GraphQL", "API Design", "Microservices"],
  },
  {
    id: "tech_7",
    text: "What's your experience with version control and collaborative development?",
    category: "technical",
    difficulty: "easy",
    skills: ["Git", "GitHub", "Collaboration"],
  },
  {
    id: "tech_8",
    text: "How do you handle performance optimization in web applications?",
    category: "technical",
    difficulty: "hard",
    skills: ["Performance", "Optimization", "Frontend", "Backend"],
  },

  // Behavioral Questions
  {
    id: "beh_1",
    text: "Tell me about a time you faced a significant challenge at work.",
    category: "behavioral",
    difficulty: "medium",
  },
  {
    id: "beh_2",
    text: "Describe a situation where you had to work with a difficult team member.",
    category: "behavioral",
    difficulty: "medium",
  },
  {
    id: "beh_3",
    text: "Give me an example of when you had to learn something new quickly.",
    category: "behavioral",
    difficulty: "medium",
  },
  {
    id: "beh_4",
    text: "Tell me about a time you failed and what you learned from it.",
    category: "behavioral",
    difficulty: "medium",
  },
  {
    id: "beh_5",
    text: "Describe a project you're particularly proud of.",
    category: "behavioral",
    difficulty: "easy",
  },
  {
    id: "beh_6",
    text: "How do you handle conflicting priorities and tight deadlines?",
    category: "behavioral",
    difficulty: "medium",
  },
  {
    id: "beh_7",
    text: "Tell me about a time you had to give constructive feedback.",
    category: "behavioral",
    difficulty: "hard",
  },
  {
    id: "beh_8",
    text: "Describe a situation where you had to adapt to significant changes.",
    category: "behavioral",
    difficulty: "medium",
  },

  // Situational Questions
  {
    id: "sit_1",
    text: "How would you handle a situation where you disagree with your manager's decision?",
    category: "situational",
    difficulty: "hard",
  },
  {
    id: "sit_2",
    text: "What would you do if you discovered a critical bug in production?",
    category: "situational",
    difficulty: "medium",
  },
  {
    id: "sit_3",
    text: "How would you approach mentoring a junior developer?",
    category: "situational",
    difficulty: "medium",
  },
  {
    id: "sit_4",
    text: "What would you do if you were assigned a project with unclear requirements?",
    category: "situational",
    difficulty: "medium",
  },
  {
    id: "sit_5",
    text: "How would you handle a situation where a project is falling behind schedule?",
    category: "situational",
    difficulty: "medium",
  },
  {
    id: "sit_6",
    text: "What would you do if you had to work with a technology you've never used before?",
    category: "situational",
    difficulty: "easy",
  },
  {
    id: "sit_7",
    text: "How would you approach a situation where stakeholders have conflicting requirements?",
    category: "situational",
    difficulty: "hard",
  },
  {
    id: "sit_8",
    text: "What would you do if you noticed a team member struggling with their workload?",
    category: "situational",
    difficulty: "medium",
  },
]

// Job-specific question templates
const JOB_SPECIFIC_QUESTIONS: { [key: string]: Question[] } = {
  frontend: [
    {
      id: "frontend_1",
      text: "How do you ensure cross-browser compatibility in your applications?",
      category: "technical",
      difficulty: "medium",
      skills: ["HTML", "CSS", "JavaScript", "Browser Testing"],
    },
    {
      id: "frontend_2",
      text: "Describe your approach to responsive design and mobile-first development.",
      category: "technical",
      difficulty: "medium",
      skills: ["CSS", "Responsive Design", "Mobile Development"],
    },
    {
      id: "frontend_3",
      text: "How do you optimize web applications for performance and accessibility?",
      category: "technical",
      difficulty: "hard",
      skills: ["Performance", "Accessibility", "Web Standards"],
    },
  ],
  backend: [
    {
      id: "backend_1",
      text: "How do you design scalable and maintainable API architectures?",
      category: "technical",
      difficulty: "hard",
      skills: ["API Design", "Scalability", "Architecture"],
    },
    {
      id: "backend_2",
      text: "Describe your experience with database optimization and query performance.",
      category: "technical",
      difficulty: "hard",
      skills: ["Database", "SQL", "Performance", "Optimization"],
    },
    {
      id: "backend_3",
      text: "How do you handle security considerations in backend development?",
      category: "technical",
      difficulty: "hard",
      skills: ["Security", "Authentication", "Authorization"],
    },
  ],
  fullstack: [
    {
      id: "fullstack_1",
      text: "How do you balance frontend and backend responsibilities in a project?",
      category: "technical",
      difficulty: "medium",
      skills: ["Frontend", "Backend", "Project Management"],
    },
    {
      id: "fullstack_2",
      text: "Describe your approach to end-to-end application development.",
      category: "technical",
      difficulty: "hard",
      skills: ["Full Stack", "Architecture", "Development"],
    },
  ],
  data: [
    {
      id: "data_1",
      text: "How do you approach data cleaning and preprocessing for analysis?",
      category: "technical",
      difficulty: "medium",
      skills: ["Data Analysis", "Python", "Data Cleaning"],
    },
    {
      id: "data_2",
      text: "Describe your experience with machine learning model deployment.",
      category: "technical",
      difficulty: "hard",
      skills: ["Machine Learning", "Model Deployment", "MLOps"],
    },
  ],
}

export class QuestionSelector {
  private static usedQuestions: Map<string, Set<string>> = new Map()

  /**
   * Load questions from the JSON question bank filtered by role and topic.
   * Falls back to getUniqueQuestions on fetch error.
   */
  static async getQuestionsForConfig(role: string, topic: string, count = 8): Promise<Question[]> {
    try {
      // fetch from the static JSON served in /public/data/
      const res = await fetch("/data/question-bank.json")
      if (!res.ok) throw new Error(`Failed to fetch question bank: ${res.status}`)

      const bank: Record<string, Record<string, Array<{ id: string; question: string; difficulty: string; tags: string[] }>>> =
        await res.json()

      const roleData = bank[role]
      if (!roleData) {
        console.warn(`Role "${role}" not found in question bank, falling back`)
        return QuestionSelector.getUniqueQuestions("anon", count)
      }

      const topicQuestions = roleData[topic] || []
      if (topicQuestions.length === 0) {
        console.warn(`Topic "${topic}" not found for role "${role}", falling back`)
        return QuestionSelector.getUniqueQuestions("anon", count)
      }

      // Convert to Question shape
      const converted: Question[] = topicQuestions.map((q) => ({
        id: q.id,
        text: q.question,
        category: (topic === "Behavioral" ? "behavioral" : topic === "DSA" ? "technical" : "situational") as Question["category"],
        difficulty: (q.difficulty as Question["difficulty"]) || "medium",
        skills: q.tags,
      }))

      // Shuffle and return up to count
      const shuffled = [...converted].sort(() => Math.random() - 0.5)
      return shuffled.slice(0, Math.min(count, shuffled.length))
    } catch (error) {
      console.error("getQuestionsForConfig error, using fallback:", error)
      return QuestionSelector.getUniqueQuestions("anon", count)
    }
  }

  static async getUniqueQuestions(userId: string, count = 8): Promise<Question[]> {
    const userUsedQuestions = this.usedQuestions.get(userId) || new Set()

    // Filter out already used questions
    const availableQuestions = QUESTION_POOL.filter((q) => !userUsedQuestions.has(q.id))

    // If we don't have enough unused questions, reset and use all questions
    if (availableQuestions.length < count) {
      this.usedQuestions.set(userId, new Set())
      return this.selectRandomQuestions(QUESTION_POOL, count)
    }

    const selectedQuestions = this.selectRandomQuestions(availableQuestions, count)

    // Mark selected questions as used
    const updatedUsedQuestions = this.usedQuestions.get(userId) || new Set()
    selectedQuestions.forEach((q) => updatedUsedQuestions.add(q.id))
    this.usedQuestions.set(userId, updatedUsedQuestions)

    return selectedQuestions
  }

  static async getJobSpecificQuestions(
    jobTitle: string,
    matchedSkills: string[],
    userId: string,
    count = 8,
  ): Promise<Question[]> {
    const userUsedQuestions = this.usedQuestions.get(userId) || new Set()

    // Determine job category from title
    const jobCategory = this.categorizeJob(jobTitle)

    // Get job-specific questions
    const jobSpecificQuestions = JOB_SPECIFIC_QUESTIONS[jobCategory] || []

    // Get skill-relevant questions
    const skillRelevantQuestions = QUESTION_POOL.filter(
      (q) =>
        q.skills &&
        q.skills.some((skill) =>
          matchedSkills.some(
            (matchedSkill) =>
              skill.toLowerCase().includes(matchedSkill.toLowerCase()) ||
              matchedSkill.toLowerCase().includes(skill.toLowerCase()),
          ),
        ),
    )

    // Combine and prioritize questions
    const prioritizedQuestions = [
      ...jobSpecificQuestions,
      ...skillRelevantQuestions,
      ...QUESTION_POOL.filter((q) => q.category === "general" || q.category === "behavioral"),
    ]

    // Remove duplicates and filter out used questions
    const uniqueQuestions = Array.from(new Map(prioritizedQuestions.map((q) => [q.id, q])).values()).filter(
      (q) => !userUsedQuestions.has(q.id),
    )

    // If we don't have enough questions, include some used ones
    if (uniqueQuestions.length < count) {
      const additionalQuestions = QUESTION_POOL.filter((q) => !uniqueQuestions.some((uq) => uq.id === q.id))
      uniqueQuestions.push(...additionalQuestions)
    }

    const selectedQuestions = this.selectRandomQuestions(uniqueQuestions, count)

    // Mark selected questions as used
    const updatedUsedQuestions = this.usedQuestions.get(userId) || new Set()
    selectedQuestions.forEach((q) => updatedUsedQuestions.add(q.id))
    this.usedQuestions.set(userId, updatedUsedQuestions)

    return selectedQuestions
  }

  private static categorizeJob(jobTitle: string): string {
    const title = jobTitle.toLowerCase()

    if (
      title.includes("frontend") ||
      title.includes("front-end") ||
      title.includes("ui") ||
      title.includes("react") ||
      title.includes("vue") ||
      title.includes("angular")
    ) {
      return "frontend"
    }

    if (title.includes("backend") || title.includes("back-end") || title.includes("api") || title.includes("server")) {
      return "backend"
    }

    if (title.includes("fullstack") || title.includes("full-stack") || title.includes("full stack")) {
      return "fullstack"
    }

    if (
      title.includes("data") ||
      title.includes("analyst") ||
      title.includes("scientist") ||
      title.includes("ml") ||
      title.includes("machine learning")
    ) {
      return "data"
    }

    return "general"
  }

  private static selectRandomQuestions(questions: Question[], count: number): Question[] {
    const shuffled = [...questions].sort(() => Math.random() - 0.5)

    // Ensure variety in categories and difficulty
    const selected: Question[] = []
    const categories = new Set<string>()
    const difficulties = new Set<string>()

    // First pass: try to get variety
    for (const question of shuffled) {
      if (selected.length >= count) break

      const categoryCount = Array.from(categories).filter((c) => c === question.category).length
      const difficultyCount = Array.from(difficulties).filter((d) => d === question.difficulty).length

      // Prefer questions that add variety
      if (categoryCount < 3 && difficultyCount < 4) {
        selected.push(question)
        categories.add(question.category)
        difficulties.add(question.difficulty)
      }
    }

    // Second pass: fill remaining slots
    for (const question of shuffled) {
      if (selected.length >= count) break
      if (!selected.some((q) => q.id === question.id)) {
        selected.push(question)
      }
    }

    return selected.slice(0, count)
  }

  static resetUserQuestions(userId: string): void {
    this.usedQuestions.delete(userId)
  }

  static getUserQuestionStats(userId: string): { used: number; total: number } {
    const usedCount = this.usedQuestions.get(userId)?.size || 0
    return {
      used: usedCount,
      total: QUESTION_POOL.length,
    }
  }
}
