export interface AptitudeQuestion {
  id: string
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
  difficulty: "easy" | "medium" | "hard"
  topic: string
  timeLimit: number
}

export interface CodingProblem {
  id: string
  title: string
  description: string
  difficulty: "easy" | "medium" | "hard"
  examples: Array<{
    input: string
    output: string
    explanation?: string
  }>
  constraints: string[]
  hints: string[]
  starterCode: Record<string, string>
  solution: Record<string, string>
  testCases: Array<{
    input: string
    expectedOutput: string
    hidden?: boolean
  }>
}

export class AIService {
  private static baseUrl = "/api/ai"

  static async generateAptitudeQuestions(
    topic: string,
    difficulty: "easy" | "medium" | "hard",
    count = 5,
  ): Promise<AptitudeQuestion[]> {
    try {
      const response = await fetch(`${this.baseUrl}/generate-aptitude`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ topic, difficulty, count }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return data.questions
    } catch (error) {
      console.error("Error generating aptitude questions:", error)
      // Fallback to basic questions if AI service fails
      return this.getFallbackAptitudeQuestions(topic, difficulty, count)
    }
  }

  static async generateCodingProblems(
    topic: string,
    difficulty: "easy" | "medium" | "hard",
    count = 3,
  ): Promise<CodingProblem[]> {
    try {
      const response = await fetch(`${this.baseUrl}/generate-coding`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ topic, difficulty, count }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return data.problems
    } catch (error) {
      console.error("Error generating coding problems:", error)
      // Fallback to basic problems if AI service fails
      return this.getFallbackCodingProblems(topic, difficulty, count)
    }
  }

  private static getFallbackAptitudeQuestions(topic: string, difficulty: string, count: number): AptitudeQuestion[] {
    // Basic fallback questions when AI service is unavailable
    const fallbackQuestions: AptitudeQuestion[] = [
      {
        id: `fallback-${Date.now()}`,
        question: `What is 15% of 200?`,
        options: ["25", "30", "35", "40"],
        correctAnswer: 1,
        explanation: "15% of 200 = (15/100) × 200 = 30",
        difficulty: difficulty as "easy" | "medium" | "hard",
        topic,
        timeLimit: 60,
      },
    ]

    return Array(count)
      .fill(null)
      .map((_, index) => ({
        ...fallbackQuestions[0],
        id: `fallback-${Date.now()}-${index}`,
      }))
  }

  private static getFallbackCodingProblems(topic: string, difficulty: string, count: number): CodingProblem[] {
    const fallbackProblem: CodingProblem = {
      id: `fallback-${Date.now()}`,
      title: "Two Sum",
      description:
        "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
      difficulty: difficulty as "easy" | "medium" | "hard",
      examples: [
        {
          input: "nums = [2,7,11,15], target = 9",
          output: "[0,1]",
          explanation: "Because nums[0] + nums[1] == 9, we return [0, 1].",
        },
      ],
      constraints: ["2 <= nums.length <= 10^4"],
      hints: ["Use a hash map to store numbers and their indices"],
      starterCode: {
        javascript: "function twoSum(nums, target) {\n    // Your code here\n}",
        python: "def two_sum(nums, target):\n    # Your code here\n    pass",
        cpp: "vector<int> twoSum(vector<int>& nums, int target) {\n    // Your code here\n}",
        java: "public int[] twoSum(int[] nums, int target) {\n    // Your code here\n}",
        c: "int* twoSum(int* nums, int numsSize, int target, int* returnSize) {\n    // Your code here\n}",
      },
      solution: {
        javascript:
          "function twoSum(nums, target) {\n    const map = new Map();\n    for (let i = 0; i < nums.length; i++) {\n        const complement = target - nums[i];\n        if (map.has(complement)) {\n            return [map.get(complement), i];\n        }\n        map.set(nums[i], i);\n    }\n    return [];\n}",
        python:
          "def two_sum(nums, target):\n    num_map = {}\n    for i, num in enumerate(nums):\n        complement = target - num\n        if complement in num_map:\n            return [num_map[complement], i]\n        num_map[num] = i\n    return []",
        cpp: "vector<int> twoSum(vector<int>& nums, int target) {\n    unordered_map<int, int> map;\n    for (int i = 0; i < nums.size(); i++) {\n        int complement = target - nums[i];\n        if (map.find(complement) != map.end()) {\n            return {map[complement], i};\n        }\n        map[nums[i]] = i;\n    }\n    return {};\n}",
        java: "public int[] twoSum(int[] nums, int target) {\n    Map<Integer, Integer> map = new HashMap<>();\n    for (int i = 0; i < nums.length; i++) {\n        int complement = target - nums[i];\n        if (map.containsKey(complement)) {\n            return new int[] { map.get(complement), i };\n        }\n        map.put(nums[i], i);\n    }\n    return new int[0];\n}",
        c: "int* twoSum(int* nums, int numsSize, int target, int* returnSize) {\n    *returnSize = 2;\n    int* result = (int*)malloc(2 * sizeof(int));\n    for (int i = 0; i < numsSize - 1; i++) {\n        for (int j = i + 1; j < numsSize; j++) {\n            if (nums[i] + nums[j] == target) {\n                result[0] = i;\n                result[1] = j;\n                return result;\n            }\n        }\n    }\n    *returnSize = 0;\n    return result;\n}",
      },
      testCases: [
        { input: "[2,7,11,15], 9", expectedOutput: "[0,1]" },
        { input: "[3,2,4], 6", expectedOutput: "[1,2]" },
      ],
    }

    return Array(count)
      .fill(null)
      .map((_, index) => ({
        ...fallbackProblem,
        id: `fallback-${Date.now()}-${index}`,
      }))
  }
}

