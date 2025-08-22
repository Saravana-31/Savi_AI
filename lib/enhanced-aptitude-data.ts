import { AIQuestionGenerator, type GeneratedQuestion } from "./ai-question-generator"

export interface EnhancedAptitudeTopic {
  id: string
  title: string
  description: string
  icon: string
  formulas: Formula[]
  examples: Example[]
  difficulty_levels: string[]
  tags: string[]
}

export interface Formula {
  id: string
  title: string
  formula: string
  latex?: string
  description: string
  variables: { [key: string]: string }
}

export interface Example {
  id: string
  problem: string
  solution: string
  explanation: string
  difficulty: "easy" | "medium" | "hard"
  steps: string[]
}

export interface UserAptitudeProgress {
  userId: string
  topic: string
  attempted: number
  correct: number
  accuracy: number
  level: "Beginner" | "Intermediate" | "Proficient" | "Expert"
  lastPracticed: Date
  timeSpent: number // in minutes
  difficultyBreakdown: {
    easy: { attempted: number; correct: number }
    medium: { attempted: number; correct: number }
    hard: { attempted: number; correct: number }
  }
  confidenceLevel: number // 0-100
  streakCount: number
  bestStreak: number
}

export const ENHANCED_APTITUDE_TOPICS: EnhancedAptitudeTopic[] = [
  {
    id: "time-work",
    title: "Time & Work",
    description: "Master problems involving work rates, efficiency, and collaborative work scenarios",
    icon: "⏰",
    difficulty_levels: ["easy", "medium", "hard"],
    tags: ["rates", "efficiency", "collaboration", "productivity"],
    formulas: [
      {
        id: "basic-work",
        title: "Basic Work Formula",
        formula: "Work = Rate × Time",
        latex: "W = R \\times T",
        description: "Fundamental relationship between work, rate, and time",
        variables: {
          W: "Total work done",
          R: "Rate of work (work per unit time)",
          T: "Time taken",
        },
      },
      {
        id: "combined-work",
        title: "Combined Work Rate",
        formula: "1/A + 1/B = 1/T",
        latex: "\\frac{1}{A} + \\frac{1}{B} = \\frac{1}{T}",
        description: "When A and B work together, they complete work in T time",
        variables: {
          A: "Time for person A to complete work alone",
          B: "Time for person B to complete work alone",
          T: "Time to complete work together",
        },
      },
      {
        id: "efficiency-ratio",
        title: "Efficiency Relationship",
        formula: "Efficiency ∝ 1/Time",
        latex: "E \\propto \\frac{1}{T}",
        description: "Efficiency is inversely proportional to time",
        variables: {
          E: "Efficiency of worker",
          T: "Time to complete work",
        },
      },
    ],
    examples: [
      {
        id: "tw-example-1",
        problem:
          "A can complete a work in 12 days and B can complete the same work in 18 days. How long will they take to complete the work together?",
        solution: "Combined rate = 1/12 + 1/18 = (3+2)/36 = 5/36 per day. Time = 36/5 = 7.2 days",
        explanation: "We add their individual work rates to find the combined rate, then take reciprocal for time",
        difficulty: "easy",
        steps: [
          "Find A's work rate: 1/12 work per day",
          "Find B's work rate: 1/18 work per day",
          "Add rates: 1/12 + 1/18 = 5/36 work per day",
          "Time together = 1 ÷ (5/36) = 36/5 = 7.2 days",
        ],
      },
      {
        id: "tw-example-2",
        problem:
          "A is twice as efficient as B. If they together complete a work in 12 days, how long will A take alone?",
        solution:
          "If A is twice efficient, A:B = 2:1. Combined rate = 2x + x = 3x = 1/12. A's rate = 2x = 2/36 = 1/18. A takes 18 days.",
        explanation: "Use efficiency ratios to find individual rates from combined rate",
        difficulty: "medium",
        steps: [
          "Set efficiency ratio A:B = 2:1",
          "Let B's rate = x, then A's rate = 2x",
          "Combined rate = 2x + x = 3x = 1/12",
          "Solve: x = 1/36, so A's rate = 2/36 = 1/18",
          "A alone takes 18 days",
        ],
      },
    ],
  },
  {
    id: "pipes-cisterns",
    title: "Pipes & Cisterns",
    description: "Solve complex problems involving multiple pipes filling and emptying tanks",
    icon: "🚰",
    difficulty_levels: ["easy", "medium", "hard"],
    tags: ["flow-rates", "filling", "emptying", "simultaneous-operations"],
    formulas: [
      {
        id: "filling-rate",
        title: "Filling Rate",
        formula: "Filling Rate = 1/Time to fill",
        latex: "R_f = \\frac{1}{T_f}",
        description: "Rate at which a pipe fills the tank",
        variables: {
          R_f: "Filling rate (fraction of tank per unit time)",
          T_f: "Time to fill the tank completely",
        },
      },
      {
        id: "emptying-rate",
        title: "Emptying Rate",
        formula: "Emptying Rate = -1/Time to empty",
        latex: "R_e = -\\frac{1}{T_e}",
        description: "Rate at which a pipe empties the tank (negative value)",
        variables: {
          R_e: "Emptying rate (negative fraction)",
          T_e: "Time to empty the tank completely",
        },
      },
      {
        id: "net-rate",
        title: "Net Rate",
        formula: "Net Rate = Σ(Filling Rates) - Σ(Emptying Rates)",
        latex: "R_{net} = \\sum R_f - \\sum R_e",
        description: "Combined effect of all pipes working together",
        variables: {
          R_net: "Net rate of change in tank level",
          R_f: "Individual filling rates",
          R_e: "Individual emptying rates",
        },
      },
    ],
    examples: [
      {
        id: "pc-example-1",
        problem:
          "Pipe A can fill a tank in 6 hours and pipe B can empty it in 8 hours. If both pipes are opened together, in how much time will the tank be filled?",
        solution: "Net rate = 1/6 - 1/8 = (4-3)/24 = 1/24 per hour. Time = 24 hours.",
        explanation: "Subtract emptying rate from filling rate to get net filling rate",
        difficulty: "easy",
        steps: [
          "A's filling rate = 1/6 tank per hour",
          "B's emptying rate = 1/8 tank per hour",
          "Net rate = 1/6 - 1/8 = 4/24 - 3/24 = 1/24 tank per hour",
          "Time to fill = 1 ÷ (1/24) = 24 hours",
        ],
      },
    ],
  },
  {
    id: "speed-distance",
    title: "Speed & Distance",
    description: "Master motion problems including relative speed, trains, and time-distance relationships",
    icon: "🚄",
    difficulty_levels: ["easy", "medium", "hard"],
    tags: ["motion", "relative-speed", "trains", "time-distance"],
    formulas: [
      {
        id: "basic-speed",
        title: "Basic Speed Formula",
        formula: "Speed = Distance / Time",
        latex: "S = \\frac{D}{T}",
        description: "Fundamental relationship between speed, distance, and time",
        variables: {
          S: "Speed (distance per unit time)",
          D: "Distance traveled",
          T: "Time taken",
        },
      },
      {
        id: "relative-speed-same",
        title: "Relative Speed (Same Direction)",
        formula: "Relative Speed = |S₁ - S₂|",
        latex: "S_{rel} = |S_1 - S_2|",
        description: "When objects move in the same direction",
        variables: {
          S_rel: "Relative speed",
          "S₁": "Speed of first object",
          "S₂": "Speed of second object",
        },
      },
      {
        id: "relative-speed-opposite",
        title: "Relative Speed (Opposite Direction)",
        formula: "Relative Speed = S₁ + S₂",
        latex: "S_{rel} = S_1 + S_2",
        description: "When objects move in opposite directions",
        variables: {
          S_rel: "Relative speed",
          "S₁": "Speed of first object",
          "S₂": "Speed of second object",
        },
      },
    ],
    examples: [
      {
        id: "sd-example-1",
        problem: "A train travels 240 km in 4 hours. What is its speed?",
        solution: "Speed = Distance/Time = 240/4 = 60 km/hr",
        explanation: "Direct application of the basic speed formula",
        difficulty: "easy",
        steps: [
          "Given: Distance = 240 km, Time = 4 hours",
          "Apply formula: Speed = Distance ÷ Time",
          "Speed = 240 ÷ 4 = 60 km/hr",
        ],
      },
    ],
  },
  {
    id: "profit-loss",
    title: "Profit & Loss",
    description: "Calculate profit, loss, cost price, selling price, and percentage calculations in business scenarios",
    icon: "💰",
    difficulty_levels: ["easy", "medium", "hard"],
    tags: ["business", "percentage", "cost-price", "selling-price"],
    formulas: [
      {
        id: "profit-formula",
        title: "Profit Formula",
        formula: "Profit = Selling Price - Cost Price",
        latex: "P = SP - CP",
        description: "Basic profit calculation",
        variables: {
          P: "Profit amount",
          SP: "Selling Price",
          CP: "Cost Price",
        },
      },
      {
        id: "profit-percentage",
        title: "Profit Percentage",
        formula: "Profit% = (Profit/Cost Price) × 100",
        latex: "P\\% = \\frac{P}{CP} \\times 100",
        description: "Profit as a percentage of cost price",
        variables: {
          "P%": "Profit percentage",
          P: "Profit amount",
          CP: "Cost Price",
        },
      },
      {
        id: "selling-price-formula",
        title: "Selling Price from Profit%",
        formula: "SP = CP × (1 + Profit%/100)",
        latex: "SP = CP \\times (1 + \\frac{P\\%}{100})",
        description: "Calculate selling price when profit percentage is known",
        variables: {
          SP: "Selling Price",
          CP: "Cost Price",
          "P%": "Profit percentage",
        },
      },
    ],
    examples: [
      {
        id: "pl-example-1",
        problem: "An article is sold for Rs. 550 at a profit of 10%. What was its cost price?",
        solution: "SP = CP × (1 + 10/100) = CP × 1.1. So CP = 550/1.1 = Rs. 500",
        explanation: "Use the relationship between selling price, cost price, and profit percentage",
        difficulty: "easy",
        steps: [
          "Given: SP = Rs. 550, Profit% = 10%",
          "Formula: SP = CP × (1 + Profit%/100)",
          "550 = CP × (1 + 10/100) = CP × 1.1",
          "CP = 550 ÷ 1.1 = Rs. 500",
        ],
      },
    ],
  },
  {
    id: "percentages",
    title: "Percentages",
    description: "Master percentage calculations, percentage increase/decrease, and applications",
    icon: "📊",
    difficulty_levels: ["easy", "medium", "hard"],
    tags: ["percentage", "increase", "decrease", "applications"],
    formulas: [
      {
        id: "basic-percentage",
        title: "Basic Percentage",
        formula: "x% of N = (x/100) × N",
        latex: "x\\% \\text{ of } N = \\frac{x}{100} \\times N",
        description: "Calculate percentage of a number",
        variables: {
          x: "Percentage value",
          N: "Base number",
        },
      },
      {
        id: "percentage-increase",
        title: "Percentage Increase",
        formula: "New Value = Original × (1 + increase%/100)",
        latex: "V_{new} = V_{orig} \\times (1 + \\frac{\\text{inc}\\%}{100})",
        description: "Calculate value after percentage increase",
        variables: {
          V_new: "New value after increase",
          V_orig: "Original value",
          "inc%": "Percentage increase",
        },
      },
    ],
    examples: [
      {
        id: "pct-example-1",
        problem: "If 25% of a number is 60, what is the number?",
        solution: "25% of number = 60, so number = (60 × 100)/25 = 240",
        explanation: "Use inverse calculation to find the original number",
        difficulty: "easy",
        steps: [
          "Given: 25% of number = 60",
          "Let the number be x",
          "25% of x = 60",
          "(25/100) × x = 60",
          "x = 60 × (100/25) = 240",
        ],
      },
    ],
  },
  {
    id: "mixtures",
    title: "Mixtures & Alligation",
    description: "Solve mixture problems using alligation method and ratio calculations",
    icon: "🧪",
    difficulty_levels: ["easy", "medium", "hard"],
    tags: ["alligation", "mixtures", "ratios", "weighted-average"],
    formulas: [
      {
        id: "alligation-rule",
        title: "Alligation Rule",
        formula: "Ratio = (Higher Price - Mean Price) : (Mean Price - Lower Price)",
        latex: "\\text{Ratio} = (P_h - P_m) : (P_m - P_l)",
        description: "Find mixing ratio using alligation method",
        variables: {
          P_h: "Higher price per unit",
          P_m: "Mean/desired price per unit",
          P_l: "Lower price per unit",
        },
      },
    ],
    examples: [
      {
        id: "mix-example-1",
        problem:
          "In what ratio should rice at Rs. 25 per kg be mixed with rice at Rs. 35 per kg to get a mixture worth Rs. 30 per kg?",
        solution: "Using alligation: Ratio = (35-30):(30-25) = 5:5 = 1:1",
        explanation: "Apply alligation rule to find the mixing ratio",
        difficulty: "medium",
        steps: [
          "Given: Lower price = Rs. 25, Higher price = Rs. 35, Mean price = Rs. 30",
          "Apply alligation: Ratio = (Higher - Mean) : (Mean - Lower)",
          "Ratio = (35 - 30) : (30 - 25) = 5 : 5 = 1 : 1",
        ],
      },
    ],
  },
  {
    id: "simple-interest",
    title: "Simple Interest",
    description: "Calculate simple interest, principal, rate, and time using various formulas",
    icon: "🏦",
    difficulty_levels: ["easy", "medium", "hard"],
    tags: ["interest", "principal", "rate", "time"],
    formulas: [
      {
        id: "simple-interest-formula",
        title: "Simple Interest",
        formula: "SI = (P × R × T) / 100",
        latex: "SI = \\frac{P \\times R \\times T}{100}",
        description: "Calculate simple interest",
        variables: {
          SI: "Simple Interest",
          P: "Principal amount",
          R: "Rate of interest per annum",
          T: "Time in years",
        },
      },
      {
        id: "amount-formula",
        title: "Amount Formula",
        formula: "Amount = Principal + Simple Interest",
        latex: "A = P + SI",
        description: "Total amount after adding interest",
        variables: {
          A: "Total amount",
          P: "Principal",
          SI: "Simple Interest",
        },
      },
    ],
    examples: [
      {
        id: "si-example-1",
        problem: "Find the simple interest on Rs. 2000 for 3 years at 10% per annum.",
        solution: "SI = (P × R × T)/100 = (2000 × 10 × 3)/100 = Rs. 600",
        explanation: "Direct application of simple interest formula",
        difficulty: "easy",
        steps: [
          "Given: P = Rs. 2000, R = 10%, T = 3 years",
          "Apply formula: SI = (P × R × T)/100",
          "SI = (2000 × 10 × 3)/100 = 60000/100 = Rs. 600",
        ],
      },
    ],
  },
  {
    id: "compound-interest",
    title: "Compound Interest",
    description: "Master compound interest calculations with different compounding frequencies",
    icon: "📈",
    difficulty_levels: ["easy", "medium", "hard"],
    tags: ["compound-interest", "compounding", "growth"],
    formulas: [
      {
        id: "compound-interest-annual",
        title: "Compound Interest (Annual)",
        formula: "A = P(1 + R/100)^T",
        latex: "A = P(1 + \\frac{R}{100})^T",
        description: "Amount with annual compounding",
        variables: {
          A: "Final amount",
          P: "Principal",
          R: "Annual interest rate",
          T: "Time in years",
        },
      },
      {
        id: "ci-formula",
        title: "Compound Interest",
        formula: "CI = A - P",
        latex: "CI = A - P",
        description: "Compound interest is the difference between amount and principal",
        variables: {
          CI: "Compound Interest",
          A: "Final amount",
          P: "Principal",
        },
      },
    ],
    examples: [
      {
        id: "ci-example-1",
        problem: "Find the compound interest on Rs. 1000 for 2 years at 10% per annum.",
        solution: "A = 1000(1 + 10/100)² = 1000 × 1.1² = 1000 × 1.21 = Rs. 1210. CI = 1210 - 1000 = Rs. 210",
        explanation: "Calculate amount first, then subtract principal to get compound interest",
        difficulty: "easy",
        steps: [
          "Given: P = Rs. 1000, R = 10%, T = 2 years",
          "Calculate amount: A = P(1 + R/100)^T",
          "A = 1000(1 + 10/100)² = 1000 × (1.1)² = 1000 × 1.21 = Rs. 1210",
          "CI = A - P = 1210 - 1000 = Rs. 210",
        ],
      },
    ],
  },
  {
    id: "boats-streams",
    title: "Boats & Streams",
    description: "Solve problems involving boats moving in rivers with current",
    icon: "🚤",
    difficulty_levels: ["easy", "medium", "hard"],
    tags: ["relative-motion", "current", "upstream", "downstream"],
    formulas: [
      {
        id: "downstream-speed",
        title: "Downstream Speed",
        formula: "Downstream Speed = Boat Speed + Stream Speed",
        latex: "S_d = S_b + S_s",
        description: "Speed when moving with the current",
        variables: {
          S_d: "Downstream speed",
          S_b: "Boat speed in still water",
          S_s: "Stream speed",
        },
      },
      {
        id: "upstream-speed",
        title: "Upstream Speed",
        formula: "Upstream Speed = Boat Speed - Stream Speed",
        latex: "S_u = S_b - S_s",
        description: "Speed when moving against the current",
        variables: {
          S_u: "Upstream speed",
          S_b: "Boat speed in still water",
          S_s: "Stream speed",
        },
      },
    ],
    examples: [
      {
        id: "bs-example-1",
        problem:
          "A boat travels 20 km downstream in 2 hours and 12 km upstream in 3 hours. Find the speed of the boat in still water.",
        solution:
          "Downstream speed = 20/2 = 10 km/hr, Upstream speed = 12/3 = 4 km/hr. Boat speed = (10+4)/2 = 7 km/hr",
        explanation: "Use the relationship between downstream, upstream, and boat speeds",
        difficulty: "medium",
        steps: [
          "Calculate downstream speed: 20 km ÷ 2 hr = 10 km/hr",
          "Calculate upstream speed: 12 km ÷ 3 hr = 4 km/hr",
          "Boat speed = (Downstream + Upstream)/2 = (10 + 4)/2 = 7 km/hr",
          "Stream speed = (Downstream - Upstream)/2 = (10 - 4)/2 = 3 km/hr",
        ],
      },
    ],
  },
  {
    id: "mensuration",
    title: "Mensuration",
    description: "Calculate areas, volumes, and perimeters of geometric shapes",
    icon: "📐",
    difficulty_levels: ["easy", "medium", "hard"],
    tags: ["geometry", "area", "volume", "perimeter"],
    formulas: [
      {
        id: "rectangle-area",
        title: "Rectangle Area",
        formula: "Area = Length × Width",
        latex: "A = l \\times w",
        description: "Area of a rectangle",
        variables: {
          A: "Area",
          l: "Length",
          w: "Width",
        },
      },
      {
        id: "circle-area",
        title: "Circle Area",
        formula: "Area = π × r²",
        latex: "A = \\pi r^2",
        description: "Area of a circle",
        variables: {
          A: "Area",
          r: "Radius",
          π: "Pi (≈ 3.14159)",
        },
      },
    ],
    examples: [
      {
        id: "mens-example-1",
        problem: "Find the area of a rectangle with length 12 cm and width 8 cm.",
        solution: "Area = Length × Width = 12 × 8 = 96 cm²",
        explanation: "Direct application of rectangle area formula",
        difficulty: "easy",
        steps: [
          "Given: Length = 12 cm, Width = 8 cm",
          "Apply formula: Area = Length × Width",
          "Area = 12 × 8 = 96 cm²",
        ],
      },
    ],
  },
  {
    id: "lcm-hcf",
    title: "LCM & HCF",
    description: "Find Least Common Multiple and Highest Common Factor using various methods",
    icon: "🔢",
    difficulty_levels: ["easy", "medium", "hard"],
    tags: ["number-theory", "factors", "multiples"],
    formulas: [
      {
        id: "lcm-hcf-relation",
        title: "LCM-HCF Relationship",
        formula: "LCM × HCF = Product of numbers",
        latex: "\\text{LCM} \\times \\text{HCF} = a \\times b",
        description: "Fundamental relationship for two numbers",
        variables: {
          LCM: "Least Common Multiple",
          HCF: "Highest Common Factor",
          "a, b": "The two numbers",
        },
      },
    ],
    examples: [
      {
        id: "lcm-example-1",
        problem: "Find the LCM of 12 and 18.",
        solution: "Prime factorization: 12 = 2² × 3, 18 = 2 × 3². LCM = 2² × 3² = 4 × 9 = 36",
        explanation: "Use prime factorization method to find LCM",
        difficulty: "easy",
        steps: [
          "Find prime factorization of 12: 12 = 2² × 3",
          "Find prime factorization of 18: 18 = 2 × 3²",
          "LCM = Product of highest powers of all prime factors",
          "LCM = 2² × 3² = 4 × 9 = 36",
        ],
      },
    ],
  },
  {
    id: "number-series",
    title: "Number Series",
    description: "Identify patterns and find missing terms in arithmetic, geometric, and other series",
    icon: "🔄",
    difficulty_levels: ["easy", "medium", "hard"],
    tags: ["patterns", "sequences", "arithmetic", "geometric"],
    formulas: [
      {
        id: "arithmetic-series",
        title: "Arithmetic Series nth term",
        formula: "aₙ = a₁ + (n-1)d",
        latex: "a_n = a_1 + (n-1)d",
        description: "nth term of arithmetic series",
        variables: {
          aₙ: "nth term",
          "a₁": "First term",
          n: "Position of term",
          d: "Common difference",
        },
      },
    ],
    examples: [
      {
        id: "ns-example-1",
        problem: "Find the next term in the series: 2, 5, 8, 11, ?",
        solution: "Common difference = 3. Next term = 11 + 3 = 14",
        explanation: "This is an arithmetic series with common difference 3",
        difficulty: "easy",
        steps: [
          "Identify the pattern: 5-2=3, 8-5=3, 11-8=3",
          "Common difference d = 3",
          "Next term = Last term + d = 11 + 3 = 14",
        ],
      },
    ],
  },
  {
    id: "permutation-combination",
    title: "Permutation & Combination",
    description: "Solve counting problems using permutation and combination formulas",
    icon: "🎲",
    difficulty_levels: ["easy", "medium", "hard"],
    tags: ["counting", "arrangements", "selections"],
    formulas: [
      {
        id: "permutation-formula",
        title: "Permutation Formula",
        formula: "ⁿPᵣ = n!/(n-r)!",
        latex: "^nP_r = \\frac{n!}{(n-r)!}",
        description: "Number of ways to arrange r objects from n objects",
        variables: {
          n: "Total number of objects",
          r: "Number of objects to arrange",
          "!": "Factorial",
        },
      },
      {
        id: "combination-formula",
        title: "Combination Formula",
        formula: "ⁿCᵣ = n!/(r!(n-r)!)",
        latex: "^nC_r = \\frac{n!}{r!(n-r)!}",
        description: "Number of ways to select r objects from n objects",
        variables: {
          n: "Total number of objects",
          r: "Number of objects to select",
          "!": "Factorial",
        },
      },
    ],
    examples: [
      {
        id: "pc-example-1",
        problem: "In how many ways can 5 people be arranged in a row?",
        solution: "Number of arrangements = 5! = 5 × 4 × 3 × 2 × 1 = 120",
        explanation: "This is a permutation problem where all objects are arranged",
        difficulty: "easy",
        steps: [
          "We need to arrange all 5 people",
          "This is a permutation: ⁵P₅ = 5!",
          "5! = 5 × 4 × 3 × 2 × 1 = 120 ways",
        ],
      },
    ],
  },
  {
    id: "ratio-proportion",
    title: "Ratio & Proportion",
    description: "Solve problems involving ratios, proportions, and their applications",
    icon: "⚖️",
    difficulty_levels: ["easy", "medium", "hard"],
    tags: ["ratios", "proportions", "scaling"],
    formulas: [
      {
        id: "ratio-formula",
        title: "Ratio",
        formula: "a : b = a/b",
        latex: "a : b = \\frac{a}{b}",
        description: "Ratio expresses relative sizes of quantities",
        variables: {
          a: "First quantity",
          b: "Second quantity",
        },
      },
      {
        id: "proportion-formula",
        title: "Proportion",
        formula: "a : b :: c : d ⟹ a/b = c/d",
        latex: "a : b :: c : d \\Rightarrow \\frac{a}{b} = \\frac{c}{d}",
        description: "Four quantities are in proportion if ratios are equal",
        variables: {
          "a, b, c, d": "Four quantities in proportion",
        },
      },
    ],
    examples: [
      {
        id: "rp-example-1",
        problem: "If A:B = 2:3 and B:C = 4:5, find A:B:C.",
        solution: "A:B = 2:3, B:C = 4:5. To combine, make B equal: A:B = 8:12, B:C = 12:15. So A:B:C = 8:12:15",
        explanation: "Combine ratios by making the common term equal",
        difficulty: "medium",
        steps: [
          "Given: A:B = 2:3 and B:C = 4:5",
          "Make B coefficient same: LCM of 3 and 4 is 12",
          "A:B = 2:3 = 8:12 (multiply by 4)",
          "B:C = 4:5 = 12:15 (multiply by 3)",
          "Therefore, A:B:C = 8:12:15",
        ],
      },
    ],
  },
  {
    id: "averages",
    title: "Averages",
    description: "Calculate averages, weighted averages, and solve related problems",
    icon: "📊",
    difficulty_levels: ["easy", "medium", "hard"],
    tags: ["mean", "weighted-average", "statistics"],
    formulas: [
      {
        id: "average-formula",
        title: "Average Formula",
        formula: "Average = Sum of all values / Number of values",
        latex: "\\bar{x} = \\frac{\\sum x_i}{n}",
        description: "Arithmetic mean of a set of numbers",
        variables: {
          x̄: "Average (mean)",
          Σxᵢ: "Sum of all values",
          n: "Number of values",
        },
      },
      {
        id: "weighted-average",
        title: "Weighted Average",
        formula: "Weighted Average = Σ(value × weight) / Σ(weights)",
        latex: "\\bar{x}_w = \\frac{\\sum (x_i \\times w_i)}{\\sum w_i}",
        description: "Average when different values have different importance",
        variables: {
          x̄w: "Weighted average",
          xᵢ: "Individual values",
          wᵢ: "Corresponding weights",
        },
      },
    ],
    examples: [
      {
        id: "avg-example-1",
        problem: "The average of 5 numbers is 20. If one number is 25, what is the average of the remaining 4 numbers?",
        solution: "Sum of 5 numbers = 5 × 20 = 100. Sum of remaining 4 = 100 - 25 = 75. Average = 75/4 = 18.75",
        explanation: "Use the relationship between average, sum, and count",
        difficulty: "easy",
        steps: [
          "Given: Average of 5 numbers = 20, One number = 25",
          "Sum of all 5 numbers = 5 × 20 = 100",
          "Sum of remaining 4 numbers = 100 - 25 = 75",
          "Average of remaining 4 = 75 ÷ 4 = 18.75",
        ],
      },
    ],
  },
  {
    id: "probability",
    title: "Probability",
    description: "Calculate probabilities for simple and compound events",
    icon: "🎯",
    difficulty_levels: ["easy", "medium", "hard"],
    tags: ["chance", "events", "outcomes"],
    formulas: [
      {
        id: "basic-probability",
        title: "Basic Probability",
        formula: "P(E) = Number of favorable outcomes / Total number of outcomes",
        latex: "P(E) = \\frac{\\text{Favorable outcomes}}{\\text{Total outcomes}}",
        description: "Probability of an event occurring",
        variables: {
          "P(E)": "Probability of event E",
          E: "The event",
        },
      },
      {
        id: "complement-probability",
        title: "Complement Rule",
        formula: "P(E') = 1 - P(E)",
        latex: "P(E') = 1 - P(E)",
        description: "Probability of an event not occurring",
        variables: {
          "P(E')": "Probability of complement of E",
          "P(E)": "Probability of event E",
        },
      },
    ],
    examples: [
      {
        id: "prob-example-1",
        problem: "What is the probability of getting a head when a fair coin is tossed?",
        solution: "Favorable outcomes = 1 (Head), Total outcomes = 2 (Head, Tail). P(Head) = 1/2 = 0.5",
        explanation: "Apply basic probability formula",
        difficulty: "easy",
        steps: [
          "Identify favorable outcomes: Getting a head = 1 way",
          "Identify total outcomes: Head or Tail = 2 ways",
          "Apply formula: P(Head) = 1/2 = 0.5 or 50%",
        ],
      },
    ],
  },
]

export class EnhancedAptitudeService {
  static generatePracticeSession(
    topic: string,
    difficulty: "easy" | "medium" | "hard",
    questionCount: number,
  ): GeneratedQuestion[] {
    const questions: GeneratedQuestion[] = []

    for (let i = 0; i < questionCount; i++) {
      try {
        const question = AIQuestionGenerator.generateQuestion(topic, difficulty)
        questions.push(question)
      } catch (error) {
        console.warn(`Failed to generate question ${i + 1}:`, error)
        // Continue with other questions
      }
    }

    return questions
  }

  static calculateLevel(
    accuracy: number,
    timeEfficiency: number,
  ): "Beginner" | "Intermediate" | "Proficient" | "Expert" {
    const score = accuracy * 0.7 + timeEfficiency * 0.3

    if (score >= 85) return "Expert"
    if (score >= 70) return "Proficient"
    if (score >= 50) return "Intermediate"
    return "Beginner"
  }

  static calculateConfidence(recentSessions: any[]): number {
    if (recentSessions.length === 0) return 0

    const weights = [0.4, 0.3, 0.2, 0.1] // Recent sessions have higher weight
    let weightedSum = 0
    let totalWeight = 0

    recentSessions.slice(0, 4).forEach((session, index) => {
      const weight = weights[index] || 0.05
      weightedSum += session.accuracy * weight
      totalWeight += weight
    })

    return Math.round(weightedSum / totalWeight)
  }

  static getTopicById(topicId: string): EnhancedAptitudeTopic | undefined {
    return ENHANCED_APTITUDE_TOPICS.find((topic) => topic.id === topicId)
  }

  static getAllTopics(): EnhancedAptitudeTopic[] {
    return ENHANCED_APTITUDE_TOPICS
  }

  static getTopicsByDifficulty(difficulty: string): EnhancedAptitudeTopic[] {
    return ENHANCED_APTITUDE_TOPICS.filter((topic) => topic.difficulty_levels.includes(difficulty))
  }

  static searchTopics(query: string): EnhancedAptitudeTopic[] {
    const lowercaseQuery = query.toLowerCase()
    return ENHANCED_APTITUDE_TOPICS.filter(
      (topic) =>
        topic.title.toLowerCase().includes(lowercaseQuery) ||
        topic.description.toLowerCase().includes(lowercaseQuery) ||
        topic.tags.some((tag) => tag.toLowerCase().includes(lowercaseQuery)),
    )
  }
}
