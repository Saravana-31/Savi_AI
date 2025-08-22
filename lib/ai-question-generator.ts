export interface AptitudeQuestionTemplate {
  id: string
  topic: string
  template: string
  variables: { [key: string]: any }
  solutionTemplate: string
  difficulty: "easy" | "medium" | "hard"
}

export interface GeneratedQuestion {
  id: string
  topic: string
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
  difficulty: "easy" | "medium" | "hard"
  variables: { [key: string]: any }
}

export class AIQuestionGenerator {
  private static templates: AptitudeQuestionTemplate[] = [
    // Time & Work Templates
    {
      id: "tw_basic_1",
      topic: "time-work",
      template:
        "A can complete a work in {a} days and B can complete the same work in {b} days. How long will they take to complete the work together?",
      variables: {
        a: { min: 6, max: 20, step: 2 },
        b: { min: 8, max: 24, step: 2 },
      },
      solutionTemplate:
        "Combined rate = 1/{a} + 1/{b} = ({b} + {a})/({a} × {b}) = {combined_num}/{combined_den}. Time = {result} days.",
      difficulty: "easy",
    },
    {
      id: "tw_efficiency_1",
      topic: "time-work",
      template:
        "A is {ratio} times as efficient as B. If A and B together can complete a work in {together} days, how long will A alone take?",
      variables: {
        ratio: { values: [2, 3, 4] },
        together: { min: 8, max: 16, step: 2 },
      },
      solutionTemplate:
        "If A is {ratio} times efficient, A:B = {ratio}:1. Combined rate = {ratio}x + x = {total_ratio}x = 1/{together}. A's rate = {ratio}/{together × total_ratio} = 1/{a_time}. A takes {a_time} days.",
      difficulty: "medium",
    },

    // Pipes & Cisterns Templates
    {
      id: "pc_basic_1",
      topic: "pipes-cisterns",
      template:
        "Pipe A can fill a tank in {fill_time} hours and pipe B can empty it in {empty_time} hours. If both pipes are opened together, in how much time will the tank be filled?",
      variables: {
        fill_time: { min: 4, max: 12, step: 2 },
        empty_time: { min: 6, max: 18, step: 2 },
      },
      solutionTemplate:
        "Net rate = 1/{fill_time} - 1/{empty_time} = ({empty_time} - {fill_time})/({fill_time} × {empty_time}) = {net_num}/{net_den}. Time = {result} hours.",
      difficulty: "easy",
    },

    // Speed & Distance Templates
    {
      id: "sd_basic_1",
      topic: "speed-distance",
      template: "A train travels {distance} km in {time} hours. What is its speed in km/hr?",
      variables: {
        distance: { min: 120, max: 480, step: 60 },
        time: { min: 2, max: 8, step: 1 },
      },
      solutionTemplate: "Speed = Distance/Time = {distance}/{time} = {result} km/hr",
      difficulty: "easy",
    },
    {
      id: "sd_relative_1",
      topic: "speed-distance",
      template:
        "Two trains of lengths {len1}m and {len2}m are running in opposite directions at speeds {speed1} km/hr and {speed2} km/hr. In how much time will they cross each other?",
      variables: {
        len1: { min: 100, max: 200, step: 50 },
        len2: { min: 150, max: 250, step: 50 },
        speed1: { min: 40, max: 80, step: 20 },
        speed2: { min: 50, max: 90, step: 20 },
      },
      solutionTemplate:
        "Relative speed = {speed1} + {speed2} = {rel_speed} km/hr = {rel_speed_ms} m/s. Total distance = {len1} + {len2} = {total_len}m. Time = {total_len}/{rel_speed_ms} = {result} seconds.",
      difficulty: "hard",
    },

    // Profit & Loss Templates
    {
      id: "pl_basic_1",
      topic: "profit-loss",
      template: "An article is sold for Rs. {sp} at a profit of {profit_percent}%. What was its cost price?",
      variables: {
        sp: { min: 550, max: 1200, step: 50 },
        profit_percent: { min: 10, max: 25, step: 5 },
      },
      solutionTemplate:
        "SP = CP + Profit = CP + ({profit_percent}/100) × CP = CP(1 + {profit_percent}/100) = CP × {multiplier}. CP = {sp}/{multiplier} = Rs. {result}",
      difficulty: "easy",
    },

    // Percentage Templates
    {
      id: "pct_basic_1",
      topic: "percentages",
      template: "If {percent}% of a number is {value}, what is the number?",
      variables: {
        percent: { values: [15, 20, 25, 30, 40] },
        value: { min: 60, max: 200, step: 20 },
      },
      solutionTemplate: "{percent}% of number = {value}. Number = ({value} × 100)/{percent} = {result}",
      difficulty: "easy",
    },

    // Mixtures Templates
    {
      id: "mix_basic_1",
      topic: "mixtures",
      template:
        "In what ratio should rice at Rs. {price1} per kg be mixed with rice at Rs. {price2} per kg to get a mixture worth Rs. {avg_price} per kg?",
      variables: {
        price1: { min: 20, max: 40, step: 5 },
        price2: { min: 50, max: 80, step: 5 },
        avg_price: { min: 35, max: 55, step: 5 },
      },
      solutionTemplate:
        "Using alligation: Ratio = ({price2} - {avg_price}) : ({avg_price} - {price1}) = {diff2} : {diff1} = {ratio_a} : {ratio_b}",
      difficulty: "medium",
    },

    // Simple Interest Templates
    {
      id: "si_basic_1",
      topic: "simple-interest",
      template: "What is the simple interest on Rs. {principal} for {time} years at {rate}% per annum?",
      variables: {
        principal: { min: 1000, max: 5000, step: 500 },
        time: { min: 2, max: 5, step: 1 },
        rate: { min: 8, max: 15, step: 1 },
      },
      solutionTemplate: "SI = (P × R × T)/100 = ({principal} × {rate} × {time})/100 = Rs. {result}",
      difficulty: "easy",
    },

    // Compound Interest Templates
    {
      id: "ci_basic_1",
      topic: "compound-interest",
      template:
        "Find the compound interest on Rs. {principal} for {time} years at {rate}% per annum compounded annually.",
      variables: {
        principal: { min: 1000, max: 4000, step: 500 },
        time: { values: [2, 3] },
        rate: { min: 10, max: 20, step: 5 },
      },
      solutionTemplate:
        "Amount = P(1 + R/100)^T = {principal}(1 + {rate}/100)^{time} = {principal} × {multiplier} = Rs. {amount}. CI = Amount - Principal = {amount} - {principal} = Rs. {result}",
      difficulty: "medium",
    },
  ]

  static generateQuestion(topic: string, difficulty: "easy" | "medium" | "hard"): GeneratedQuestion {
    const availableTemplates = this.templates.filter((t) => t.topic === topic && t.difficulty === difficulty)

    if (availableTemplates.length === 0) {
      throw new Error(`No templates found for topic: ${topic}, difficulty: ${difficulty}`)
    }

    const template = availableTemplates[Math.floor(Math.random() * availableTemplates.length)]
    return this.generateFromTemplate(template)
  }

  private static generateFromTemplate(template: AptitudeQuestionTemplate): GeneratedQuestion {
    const variables: { [key: string]: any } = {}

    // Generate variable values
    for (const [key, config] of Object.entries(template.variables)) {
      if ("values" in config) {
        variables[key] = config.values[Math.floor(Math.random() * config.values.length)]
      } else if ("min" in config && "max" in config) {
        const range = Math.floor((config.max - config.min) / (config.step || 1)) + 1
        variables[key] = config.min + Math.floor(Math.random() * range) * (config.step || 1)
      }
    }

    // Calculate derived values based on topic
    const derivedVars = this.calculateDerivedValues(template.topic, variables)
    Object.assign(variables, derivedVars)

    // Generate question text
    let questionText = template.template
    let solutionText = template.solutionTemplate

    for (const [key, value] of Object.entries(variables)) {
      const regex = new RegExp(`\\{${key}\\}`, "g")
      questionText = questionText.replace(regex, value.toString())
      solutionText = solutionText.replace(regex, value.toString())
    }

    // Generate options
    const correctAnswer = variables.result
    const options = this.generateOptions(correctAnswer, template.topic)
    const correctIndex = Math.floor(Math.random() * 4)

    // Insert correct answer at random position
    options[correctIndex] = this.formatAnswer(correctAnswer, template.topic)

    return {
      id: `${template.id}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      topic: template.topic,
      question: questionText,
      options,
      correctAnswer: correctIndex,
      explanation: solutionText,
      difficulty: template.difficulty,
      variables,
    }
  }

  private static calculateDerivedValues(topic: string, vars: any): any {
    const derived: any = {}

    switch (topic) {
      case "time-work":
        if (vars.a && vars.b) {
          const gcd = this.gcd(vars.a + vars.b, vars.a * vars.b)
          derived.combined_num = (vars.a + vars.b) / gcd
          derived.combined_den = (vars.a * vars.b) / gcd
          derived.result = Math.round(((vars.a * vars.b) / (vars.a + vars.b)) * 100) / 100
        }
        if (vars.ratio && vars.together) {
          derived.total_ratio = vars.ratio + 1
          derived.a_time = (vars.together * derived.total_ratio) / vars.ratio
          derived.result = derived.a_time
        }
        break

      case "pipes-cisterns":
        if (vars.fill_time && vars.empty_time) {
          const gcd = this.gcd(Math.abs(vars.empty_time - vars.fill_time), vars.fill_time * vars.empty_time)
          derived.net_num = Math.abs(vars.empty_time - vars.fill_time) / gcd
          derived.net_den = (vars.fill_time * vars.empty_time) / gcd
          derived.result =
            Math.round(((vars.fill_time * vars.empty_time) / Math.abs(vars.empty_time - vars.fill_time)) * 100) / 100
        }
        break

      case "speed-distance":
        if (vars.distance && vars.time) {
          derived.result = vars.distance / vars.time
        }
        if (vars.len1 && vars.len2 && vars.speed1 && vars.speed2) {
          derived.rel_speed = vars.speed1 + vars.speed2
          derived.rel_speed_ms = Math.round(((derived.rel_speed * 5) / 18) * 100) / 100
          derived.total_len = vars.len1 + vars.len2
          derived.result = Math.round((derived.total_len / derived.rel_speed_ms) * 100) / 100
        }
        break

      case "profit-loss":
        if (vars.sp && vars.profit_percent) {
          derived.multiplier = 1 + vars.profit_percent / 100
          derived.result = Math.round(vars.sp / derived.multiplier)
        }
        break

      case "percentages":
        if (vars.percent && vars.value) {
          derived.result = (vars.value * 100) / vars.percent
        }
        break

      case "mixtures":
        if (vars.price1 && vars.price2 && vars.avg_price) {
          derived.diff1 = vars.avg_price - vars.price1
          derived.diff2 = vars.price2 - vars.avg_price
          const gcd = this.gcd(derived.diff1, derived.diff2)
          derived.ratio_a = derived.diff2 / gcd
          derived.ratio_b = derived.diff1 / gcd
          derived.result = `${derived.ratio_a}:${derived.ratio_b}`
        }
        break

      case "simple-interest":
        if (vars.principal && vars.rate && vars.time) {
          derived.result = (vars.principal * vars.rate * vars.time) / 100
        }
        break

      case "compound-interest":
        if (vars.principal && vars.rate && vars.time) {
          derived.multiplier = Math.pow(1 + vars.rate / 100, vars.time)
          derived.amount = Math.round(vars.principal * derived.multiplier)
          derived.result = derived.amount - vars.principal
        }
        break
    }

    return derived
  }

  private static generateOptions(correctAnswer: any, topic: string): string[] {
    const options: string[] = ["", "", "", ""]
    const formatted = this.formatAnswer(correctAnswer, topic)

    // Generate 3 distractors
    for (let i = 0; i < 4; i++) {
      if (options[i] === "") {
        let distractor
        if (typeof correctAnswer === "number") {
          const variation = 0.1 + Math.random() * 0.4 // 10-50% variation
          const sign = Math.random() > 0.5 ? 1 : -1
          distractor = Math.round(correctAnswer * (1 + sign * variation))

          // Ensure positive and different from correct answer
          if (distractor <= 0 || distractor === correctAnswer) {
            distractor = Math.round(correctAnswer * (1 + 0.2))
          }
        } else {
          distractor = correctAnswer // For non-numeric answers, we'll need specific logic
        }

        const formattedDistractor = this.formatAnswer(distractor, topic)
        if (!options.includes(formattedDistractor)) {
          options[i] = formattedDistractor
        }
      }
    }

    return options
  }

  private static formatAnswer(answer: any, topic: string): string {
    if (typeof answer === "number") {
      if (topic === "simple-interest" || topic === "compound-interest" || topic === "profit-loss") {
        return `Rs. ${answer}`
      } else if (topic === "speed-distance") {
        return `${answer} km/hr`
      } else if (topic === "time-work" || topic === "pipes-cisterns") {
        return `${answer} days`
      } else if (topic === "percentages") {
        return `${answer}`
      }
      return answer.toString()
    }
    return answer.toString()
  }

  private static gcd(a: number, b: number): number {
    return b === 0 ? a : this.gcd(b, a % b)
  }

  static getAvailableTopics(): string[] {
    return [...new Set(this.templates.map((t) => t.topic))]
  }

  static getTopicDifficulties(topic: string): string[] {
    return [...new Set(this.templates.filter((t) => t.topic === topic).map((t) => t.difficulty))]
  }
}

// Coding Question Generator
export interface CodingQuestionTemplate {
  id: string
  topic: string
  title: string
  description: string
  difficulty: "easy" | "medium" | "hard"
  constraints: string[]
  examples: { input: string; output: string; explanation?: string }[]
  testCases: { input: string; expectedOutput: string; hidden?: boolean }[]
  starterCode: { [language: string]: string }
  solution: { [language: string]: string }
  hints: string[]
  tags: string[]
}

export class CodingQuestionGenerator {
  private static templates: CodingQuestionTemplate[] = [
    {
      id: "array_two_sum",
      topic: "arrays",
      title: "Two Sum",
      description:
        "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
      difficulty: "easy",
      constraints: [
        "2 ≤ nums.length ≤ 10^4",
        "-10^9 ≤ nums[i] ≤ 10^9",
        "-10^9 ≤ target ≤ 10^9",
        "Only one valid answer exists.",
      ],
      examples: [
        {
          input: "nums = [2,7,11,15], target = 9",
          output: "[0,1]",
          explanation: "Because nums[0] + nums[1] == 9, we return [0, 1].",
        },
        {
          input: "nums = [3,2,4], target = 6",
          output: "[1,2]",
        },
      ],
      testCases: [
        { input: "[2,7,11,15]\n9", expectedOutput: "[0,1]" },
        { input: "[3,2,4]\n6", expectedOutput: "[1,2]" },
        { input: "[3,3]\n6", expectedOutput: "[0,1]" },
        { input: "[-1,-2,-3,-4,-5]\n-8", expectedOutput: "[2,4]", hidden: true },
      ],
      starterCode: {
        javascript: `function twoSum(nums, target) {
    // Your code here
    
}`,
        python: `def two_sum(nums, target):
    # Your code here
    pass`,
        cpp: `vector<int> twoSum(vector<int>& nums, int target) {
    // Your code here
    
}`,
        java: `public int[] twoSum(int[] nums, int target) {
    // Your code here
    
}`,
      },
      solution: {
        javascript: `function twoSum(nums, target) {
    const map = new Map();
    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        if (map.has(complement)) {
            return [map.get(complement), i];
        }
        map.set(nums[i], i);
    }
    return [];
}`,
        python: `def two_sum(nums, target):
    num_map = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in num_map:
            return [num_map[complement], i]
        num_map[num] = i
    return []`,
        cpp: `vector<int> twoSum(vector<int>& nums, int target) {
    unordered_map<int, int> map;
    for (int i = 0; i < nums.size(); i++) {
        int complement = target - nums[i];
        if (map.find(complement) != map.end()) {
            return {map[complement], i};
        }
        map[nums[i]] = i;
    }
    return {};
}`,
        java: `public int[] twoSum(int[] nums, int target) {
    Map<Integer, Integer> map = new HashMap<>();
    for (int i = 0; i < nums.length; i++) {
        int complement = target - nums[i];
        if (map.containsKey(complement)) {
            return new int[] { map.get(complement), i };
        }
        map.put(nums[i], i);
    }
    return new int[0];
}`,
      },
      hints: [
        "Think about what you've seen so far when you're looking at each element",
        "Use a hash map to store numbers you've seen and their indices",
        "For each number, check if its complement (target - number) exists in the map",
      ],
      tags: ["array", "hash-table"],
    },
    {
      id: "string_valid_palindrome",
      topic: "strings",
      title: "Valid Palindrome",
      description:
        "A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward.",
      difficulty: "easy",
      constraints: ["1 ≤ s.length ≤ 2 * 10^5", "s consists only of printable ASCII characters."],
      examples: [
        {
          input: 's = "A man, a plan, a canal: Panama"',
          output: "true",
          explanation: '"amanaplanacanalpanama" is a palindrome.',
        },
        {
          input: 's = "race a car"',
          output: "false",
          explanation: '"raceacar" is not a palindrome.',
        },
      ],
      testCases: [
        { input: '"A man, a plan, a canal: Panama"', expectedOutput: "true" },
        { input: '"race a car"', expectedOutput: "false" },
        { input: '" "', expectedOutput: "true" },
        { input: '"Madam"', expectedOutput: "true", hidden: true },
      ],
      starterCode: {
        javascript: `function isPalindrome(s) {
    // Your code here
    
}`,
        python: `def is_palindrome(s):
    # Your code here
    pass`,
        cpp: `bool isPalindrome(string s) {
    // Your code here
    
}`,
        java: `public boolean isPalindrome(String s) {
    // Your code here
    
}`,
      },
      solution: {
        javascript: `function isPalindrome(s) {
    const cleaned = s.toLowerCase().replace(/[^a-z0-9]/g, '');
    let left = 0, right = cleaned.length - 1;
    while (left < right) {
        if (cleaned[left] !== cleaned[right]) {
            return false;
        }
        left++;
        right--;
    }
    return true;
}`,
        python: `def is_palindrome(s):
    cleaned = ''.join(c.lower() for c in s if c.isalnum())
    left, right = 0, len(cleaned) - 1
    while left < right:
        if cleaned[left] != cleaned[right]:
            return False
        left += 1
        right -= 1
    return True`,
        cpp: `bool isPalindrome(string s) {
    string cleaned;
    for (char c : s) {
        if (isalnum(c)) {
            cleaned += tolower(c);
        }
    }
    int left = 0, right = cleaned.length() - 1;
    while (left < right) {
        if (cleaned[left] != cleaned[right]) {
            return false;
        }
        left++;
        right--;
    }
    return true;
}`,
        java: `public boolean isPalindrome(String s) {
    StringBuilder cleaned = new StringBuilder();
    for (char c : s.toCharArray()) {
        if (Character.isLetterOrDigit(c)) {
            cleaned.append(Character.toLowerCase(c));
        }
    }
    int left = 0, right = cleaned.length() - 1;
    while (left < right) {
        if (cleaned.charAt(left) != cleaned.charAt(right)) {
            return false;
        }
        left++;
        right--;
    }
    return true;
}`,
      },
      hints: [
        "First, clean the string by removing non-alphanumeric characters and converting to lowercase",
        "Use two pointers approach - one from start, one from end",
        "Compare characters and move pointers towards center",
      ],
      tags: ["string", "two-pointers"],
    },
  ]

  static generateQuestion(topic: string, difficulty: "easy" | "medium" | "hard"): CodingQuestionTemplate {
    const availableTemplates = this.templates.filter((t) => t.topic === topic && t.difficulty === difficulty)

    if (availableTemplates.length === 0) {
      throw new Error(`No coding templates found for topic: ${topic}, difficulty: ${difficulty}`)
    }

    const template = availableTemplates[Math.floor(Math.random() * availableTemplates.length)]

    // Generate variations by modifying constraints or test cases
    return this.generateVariation(template)
  }

  private static generateVariation(template: CodingQuestionTemplate): CodingQuestionTemplate {
    // Create a variation by modifying test cases or constraints
    const variation = { ...template }
    variation.id = `${template.id}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    // Add some randomized test cases
    if (template.topic === "arrays" && template.id.includes("two_sum")) {
      const newTestCase = this.generateTwoSumTestCase()
      variation.testCases = [...template.testCases, newTestCase]
    }

    return variation
  }

  private static generateTwoSumTestCase(): { input: string; expectedOutput: string; hidden?: boolean } {
    const length = 3 + Math.floor(Math.random() * 5) // 3-7 elements
    const nums: number[] = []

    for (let i = 0; i < length; i++) {
      nums.push(Math.floor(Math.random() * 20) - 10) // -10 to 9
    }

    // Pick two random indices
    const idx1 = Math.floor(Math.random() * length)
    let idx2 = Math.floor(Math.random() * length)
    while (idx2 === idx1) {
      idx2 = Math.floor(Math.random() * length)
    }

    const target = nums[idx1] + nums[idx2]
    const expectedOutput = idx1 < idx2 ? `[${idx1},${idx2}]` : `[${idx2},${idx1}]`

    return {
      input: `[${nums.join(",")}]\n${target}`,
      expectedOutput,
      hidden: true,
    }
  }

  static getAvailableTopics(): string[] {
    return [...new Set(this.templates.map((t) => t.topic))]
  }

  static getTopicDifficulties(topic: string): string[] {
    return [...new Set(this.templates.filter((t) => t.topic === topic).map((t) => t.difficulty))]
  }
}
