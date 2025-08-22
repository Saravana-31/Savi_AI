import { CodingQuestionGenerator, type CodingQuestionTemplate } from "./ai-question-generator"

export interface EnhancedCodingTopic {
  id: string
  title: string
  description: string
  icon: string
  concepts: Concept[]
  difficulty_levels: string[]
  languages: string[]
  tags: string[]
  prerequisites: string[]
}

export interface Concept {
  id: string
  title: string
  description: string
  explanation: string
  codeExamples: { [language: string]: CodeExample }
  timeComplexity?: string
  spaceComplexity?: string
  applications: string[]
}

export interface CodeExample {
  code: string
  explanation: string
  output?: string
}

export interface UserCodingProgress {
  userId: string
  topic: string
  language: string
  attempted: number
  correct: number
  accuracy: number
  level: "Beginner" | "Intermediate" | "Advanced" | "Expert"
  lastPracticed: Date
  timeSpent: number // in minutes
  difficultyBreakdown: {
    easy: { attempted: number; correct: number }
    medium: { attempted: number; correct: number }
    hard: { attempted: number; correct: number }
  }
  averageTimePerProblem: number // in minutes
  streakCount: number
  bestStreak: number
  skillPoints: number
}

export const ENHANCED_CODING_TOPICS: EnhancedCodingTopic[] = [
  {
    id: "arrays",
    title: "Arrays",
    description: "Master array manipulation, searching, sorting, and advanced array algorithms",
    icon: "📊",
    difficulty_levels: ["easy", "medium", "hard"],
    languages: ["javascript", "python", "cpp", "java"],
    tags: ["data-structures", "indexing", "iteration", "searching", "sorting"],
    prerequisites: [],
    concepts: [
      {
        id: "array-basics",
        title: "Array Fundamentals",
        description: "Understanding array structure, indexing, and basic operations",
        explanation:
          "Arrays are collections of elements stored in contiguous memory locations. Each element can be accessed using its index, starting from 0.",
        timeComplexity: "O(1) for access, O(n) for search",
        spaceComplexity: "O(n)",
        applications: ["Data storage", "Lookup tables", "Mathematical computations"],
        codeExamples: {
          javascript: {
            code: `// Array creation and basic operations
const numbers = [1, 2, 3, 4, 5];
console.log(numbers[0]); // Access first element: 1
console.log(numbers.length); // Array length: 5

// Adding elements
numbers.push(6); // Add to end
numbers.unshift(0); // Add to beginning

// Removing elements
const last = numbers.pop(); // Remove from end
const first = numbers.shift(); // Remove from beginning

// Iteration
numbers.forEach((num, index) => {
    console.log(\`Index \${index}: \${num}\`);
});`,
            explanation: "JavaScript arrays are dynamic and provide built-in methods for manipulation",
            output: "Index 0: 1\nIndex 1: 2\nIndex 2: 3\nIndex 3: 4\nIndex 4: 5",
          },
          python: {
            code: `# Array (list) creation and basic operations
numbers = [1, 2, 3, 4, 5]
print(numbers[0])  # Access first element: 1
print(len(numbers))  # Array length: 5

# Adding elements
numbers.append(6)  # Add to end
numbers.insert(0, 0)  # Add to beginning

# Removing elements
last = numbers.pop()  # Remove from end
first = numbers.pop(0)  # Remove from beginning

# Iteration
for index, num in enumerate(numbers):
    print(f"Index {index}: {num}")`,
            explanation: "Python lists are dynamic arrays with powerful built-in methods",
            output: "Index 0: 1\nIndex 1: 2\nIndex 2: 3\nIndex 3: 4\nIndex 4: 5",
          },
          cpp: {
            code: `#include <vector>
#include <iostream>
using namespace std;

int main() {
    // Vector (dynamic array) creation
    vector<int> numbers = {1, 2, 3, 4, 5};
    cout << numbers[0] << endl; // Access first element: 1
    cout << numbers.size() << endl; // Array size: 5
    
    // Adding elements
    numbers.push_back(6); // Add to end
    numbers.insert(numbers.begin(), 0); // Add to beginning
    
    // Removing elements
    numbers.pop_back(); // Remove from end
    numbers.erase(numbers.begin()); // Remove from beginning
    
    // Iteration
    for (int i = 0; i < numbers.size(); i++) {
        cout << "Index " << i << ": " << numbers[i] << endl;
    }
    return 0;
}`,
            explanation: "C++ vectors provide dynamic array functionality with STL methods",
            output: "Index 0: 1\nIndex 1: 2\nIndex 2: 3\nIndex 3: 4\nIndex 4: 5",
          },
          java: {
            code: `import java.util.ArrayList;

public class ArrayExample {
    public static void main(String[] args) {
        // ArrayList creation
        ArrayList<Integer> numbers = new ArrayList<>();
        numbers.add(1); numbers.add(2); numbers.add(3);
        numbers.add(4); numbers.add(5);
        
        System.out.println(numbers.get(0)); // Access first element: 1
        System.out.println(numbers.size()); // Array size: 5
        
        // Adding elements
        numbers.add(6); // Add to end
        numbers.add(0, 0); // Add to beginning
        
        // Removing elements
        numbers.remove(numbers.size() - 1); // Remove from end
        numbers.remove(0); // Remove from beginning
        
        // Iteration
        for (int i = 0; i < numbers.size(); i++) {
            System.out.println("Index " + i + ": " + numbers.get(i));
        }
    }
}`,
            explanation: "Java ArrayList provides dynamic array functionality with type safety",
            output: "Index 0: 1\nIndex 1: 2\nIndex 2: 3\nIndex 3: 4\nIndex 4: 5",
          },
        },
      },
      {
        id: "array-searching",
        title: "Array Searching",
        description: "Linear search, binary search, and advanced searching techniques",
        explanation:
          "Searching algorithms help find specific elements in arrays. Linear search checks each element, while binary search works on sorted arrays.",
        timeComplexity: "O(n) for linear, O(log n) for binary",
        spaceComplexity: "O(1)",
        applications: ["Database queries", "Finding records", "Data validation"],
        codeExamples: {
          javascript: {
            code: `// Linear Search
function linearSearch(arr, target) {
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] === target) {
            return i; // Return index if found
        }
    }
    return -1; // Not found
}

// Binary Search (for sorted arrays)
function binarySearch(arr, target) {
    let left = 0, right = arr.length - 1;
    
    while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        
        if (arr[mid] === target) {
            return mid;
        } else if (arr[mid] < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }
    return -1;
}

// Example usage
const numbers = [1, 3, 5, 7, 9, 11, 13];
console.log(linearSearch(numbers, 7)); // Output: 3
console.log(binarySearch(numbers, 7)); // Output: 3`,
            explanation: "Linear search works on any array, binary search requires sorted array but is much faster",
            output: "3\n3",
          },
          python: {
            code: `# Linear Search
def linear_search(arr, target):
    for i in range(len(arr)):
        if arr[i] == target:
            return i  # Return index if found
    return -1  # Not found

# Binary Search (for sorted arrays)
def binary_search(arr, target):
    left, right = 0, len(arr) - 1
    
    while left <= right:
        mid = (left + right) // 2
        
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    
    return -1

# Example usage
numbers = [1, 3, 5, 7, 9, 11, 13]
print(linear_search(numbers, 7))  # Output: 3
print(binary_search(numbers, 7))  # Output: 3`,
            explanation: "Python's clean syntax makes searching algorithms easy to implement and understand",
            output: "3\n3",
          },
        },
      },
    ],
  },
  {
    id: "strings",
    title: "Strings",
    description: "String manipulation, pattern matching, and text processing algorithms",
    icon: "📝",
    difficulty_levels: ["easy", "medium", "hard"],
    languages: ["javascript", "python", "cpp", "java"],
    tags: ["text-processing", "pattern-matching", "manipulation"],
    prerequisites: [],
    concepts: [
      {
        id: "string-basics",
        title: "String Fundamentals",
        description: "Understanding string structure, indexing, and basic operations",
        explanation:
          "Strings are sequences of characters. They can be manipulated using various methods for searching, replacing, and transforming text.",
        timeComplexity: "O(n) for most operations",
        spaceComplexity: "O(n)",
        applications: ["Text processing", "Data validation", "User input handling"],
        codeExamples: {
          javascript: {
            code: `// String creation and basic operations
const text = "Hello, World!";
console.log(text.length); // String length: 13
console.log(text[0]); // Access first character: H
console.log(text.charAt(7)); // Access character at index 7: W

// String methods
console.log(text.toLowerCase()); // "hello, world!"
console.log(text.toUpperCase()); // "HELLO, WORLD!"
console.log(text.substring(0, 5)); // "Hello"
console.log(text.indexOf("World")); // 7
console.log(text.replace("World", "JavaScript")); // "Hello, JavaScript!"

// String splitting and joining
const words = text.split(" ");
console.log(words); // ["Hello,", "World!"]
console.log(words.join("-")); // "Hello,-World!"`,
            explanation: "JavaScript strings are immutable and provide many built-in methods for manipulation",
            output:
              '13\nH\nW\nhello, world!\nHELLO, WORLD!\nHello\n7\nHello, JavaScript!\n["Hello,", "World!"]\nHello,-World!',
          },
          python: {
            code: `# String creation and basic operations
text = "Hello, World!"
print(len(text))  # String length: 13
print(text[0])  # Access first character: H
print(text[7])  # Access character at index 7: W

# String methods
print(text.lower())  # "hello, world!"
print(text.upper())  # "HELLO, WORLD!"
print(text[0:5])  # "Hello"
print(text.find("World"))  # 7
print(text.replace("World", "Python"))  # "Hello, Python!"

# String splitting and joining
words = text.split(" ")
print(words)  # ["Hello,", "World!"]
print("-".join(words))  # "Hello,-World!"`,
            explanation: "Python strings are immutable with powerful built-in methods and slicing capabilities",
            output:
              "13\nH\nW\nhello, world!\nHELLO, WORLD!\nHello\n7\nHello, Python!\n['Hello,', 'World!']\nHello,-World!",
          },
        },
      },
    ],
  },
  {
    id: "linked-lists",
    title: "Linked Lists",
    description: "Singly linked lists, doubly linked lists, and circular linked lists",
    icon: "🔗",
    difficulty_levels: ["medium", "hard"],
    languages: ["javascript", "python", "cpp", "java"],
    tags: ["data-structures", "pointers", "dynamic-memory"],
    prerequisites: ["arrays"],
    concepts: [
      {
        id: "singly-linked-list",
        title: "Singly Linked List",
        description: "Linear data structure where elements point to the next element",
        explanation:
          "A linked list consists of nodes, where each node contains data and a reference to the next node. Unlike arrays, linked lists don't require contiguous memory.",
        timeComplexity: "O(1) for insertion/deletion at head, O(n) for search",
        spaceComplexity: "O(n)",
        applications: ["Dynamic memory allocation", "Undo functionality", "Music playlists"],
        codeExamples: {
          javascript: {
            code: `// Node class
class ListNode {
    constructor(val = 0, next = null) {
        this.val = val;
        this.next = next;
    }
}

// Linked List class
class LinkedList {
    constructor() {
        this.head = null;
        this.size = 0;
    }
    
    // Add element to beginning
    prepend(val) {
        const newNode = new ListNode(val);
        newNode.next = this.head;
        this.head = newNode;
        this.size++;
    }
    
    // Add element to end
    append(val) {
        const newNode = new ListNode(val);
        if (!this.head) {
            this.head = newNode;
        } else {
            let current = this.head;
            while (current.next) {
                current = current.next;
            }
            current.next = newNode;
        }
        this.size++;
    }
    
    // Display list
    display() {
        const result = [];
        let current = this.head;
        while (current) {
            result.push(current.val);
            current = current.next;
        }
        return result.join(" -> ");
    }
}

// Example usage
const list = new LinkedList();
list.append(1);
list.append(2);
list.append(3);
console.log(list.display()); // "1 -> 2 -> 3"`,
            explanation: "JavaScript implementation using classes for clean, object-oriented design",
            output: "1 -> 2 -> 3",
          },
        },
      },
    ],
  },
  {
    id: "recursion",
    title: "Recursion",
    description: "Recursive algorithms, divide and conquer, and recursive data structures",
    icon: "🔄",
    difficulty_levels: ["medium", "hard"],
    languages: ["javascript", "python", "cpp", "java"],
    tags: ["algorithms", "divide-conquer", "mathematical"],
    prerequisites: ["arrays"],
    concepts: [
      {
        id: "recursion-basics",
        title: "Recursion Fundamentals",
        description: "Understanding recursive function calls and base cases",
        explanation:
          "Recursion is a programming technique where a function calls itself to solve smaller instances of the same problem.",
        timeComplexity: "Varies by problem (often O(2^n) or O(n))",
        spaceComplexity: "O(n) for call stack",
        applications: ["Tree traversal", "Mathematical computations", "Divide and conquer algorithms"],
        codeExamples: {
          javascript: {
            code: `// Factorial calculation
function factorial(n) {
    // Base case
    if (n <= 1) {
        return 1;
    }
    // Recursive case
    return n * factorial(n - 1);
}

// Fibonacci sequence
function fibonacci(n) {
    // Base cases
    if (n <= 1) {
        return n;
    }
    // Recursive case
    return fibonacci(n - 1) + fibonacci(n - 2);
}

// Array sum using recursion
function arraySum(arr, index = 0) {
    // Base case
    if (index >= arr.length) {
        return 0;
    }
    // Recursive case
    return arr[index] + arraySum(arr, index + 1);
}

// Example usage
console.log(factorial(5)); // 120
console.log(fibonacci(6)); // 8
console.log(arraySum([1, 2, 3, 4, 5])); // 15`,
            explanation: "Recursion breaks down complex problems into simpler subproblems",
            output: "120\n8\n15",
          },
        },
      },
    ],
  },
  {
    id: "dynamic-programming",
    title: "Dynamic Programming",
    description: "Memoization, tabulation, and optimization problems",
    icon: "⚡",
    difficulty_levels: ["hard"],
    languages: ["javascript", "python", "cpp", "java"],
    tags: ["optimization", "memoization", "algorithms"],
    prerequisites: ["recursion", "arrays"],
    concepts: [
      {
        id: "dp-basics",
        title: "DP Fundamentals",
        description: "Understanding overlapping subproblems and optimal substructure",
        explanation:
          "Dynamic Programming optimizes recursive solutions by storing results of subproblems to avoid redundant calculations.",
        timeComplexity: "Often reduces from O(2^n) to O(n) or O(n²)",
        spaceComplexity: "O(n) or O(n²) for memoization table",
        applications: ["Optimization problems", "Pathfinding", "Resource allocation"],
        codeExamples: {
          javascript: {
            code: `// Fibonacci with memoization
function fibonacciMemo(n, memo = {}) {
    if (n in memo) {
        return memo[n];
    }
    if (n <= 1) {
        return n;
    }
    memo[n] = fibonacciMemo(n - 1, memo) + fibonacciMemo(n - 2, memo);
    return memo[n];
}

// Fibonacci with tabulation (bottom-up)
function fibonacciTab(n) {
    if (n <= 1) return n;
    
    const dp = new Array(n + 1);
    dp[0] = 0;
    dp[1] = 1;
    
    for (let i = 2; i <= n; i++) {
        dp[i] = dp[i - 1] + dp[i - 2];
    }
    
    return dp[n];
}

// Example usage
console.log(fibonacciMemo(10)); // 55
console.log(fibonacciTab(10)); // 55`,
            explanation: "DP dramatically improves efficiency by avoiding redundant calculations",
            output: "55\n55",
          },
        },
      },
    ],
  },
]

export class EnhancedCodingService {
  static generatePracticeSession(
    topic: string,
    difficulty: "easy" | "medium" | "hard",
    questionCount: number,
  ): CodingQuestionTemplate[] {
    const questions: CodingQuestionTemplate[] = []

    for (let i = 0; i < questionCount; i++) {
      try {
        const question = CodingQuestionGenerator.generateQuestion(topic, difficulty)
        questions.push(question)
      } catch (error) {
        console.warn(`Failed to generate coding question ${i + 1}:`, error)
      }
    }

    return questions
  }

  static calculateLevel(accuracy: number, problemsSolved: number): "Beginner" | "Intermediate" | "Advanced" | "Expert" {
    const score = accuracy * 0.6 + Math.min(problemsSolved / 50, 1) * 0.4 * 100

    if (score >= 85) return "Expert"
    if (score >= 70) return "Advanced"
    if (score >= 50) return "Intermediate"
    return "Beginner"
  }

  static calculateSkillPoints(
    difficulty: "easy" | "medium" | "hard",
    timeEfficiency: number,
    accuracy: number,
  ): number {
    const basePoints = { easy: 10, medium: 25, hard: 50 }
    const multiplier = timeEfficiency * 0.3 + accuracy * 0.7
    return Math.round(basePoints[difficulty] * multiplier)
  }

  static getTopicById(topicId: string): EnhancedCodingTopic | undefined {
    return ENHANCED_CODING_TOPICS.find((topic) => topic.id === topicId)
  }

  static getAllTopics(): EnhancedCodingTopic[] {
    return ENHANCED_CODING_TOPICS
  }

  static getTopicsByDifficulty(difficulty: string): EnhancedCodingTopic[] {
    return ENHANCED_CODING_TOPICS.filter((topic) => topic.difficulty_levels.includes(difficulty))
  }

  static searchTopics(query: string): EnhancedCodingTopic[] {
    const lowercaseQuery = query.toLowerCase()
    return ENHANCED_CODING_TOPICS.filter(
      (topic) =>
        topic.title.toLowerCase().includes(lowercaseQuery) ||
        topic.description.toLowerCase().includes(lowercaseQuery) ||
        topic.tags.some((tag) => tag.toLowerCase().includes(lowercaseQuery)),
    )
  }

  static getPrerequisites(topicId: string): EnhancedCodingTopic[] {
    const topic = this.getTopicById(topicId)
    if (!topic) return []

    return topic.prerequisites.map((prereqId) => this.getTopicById(prereqId)).filter(Boolean) as EnhancedCodingTopic[]
  }
}
