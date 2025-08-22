export interface CodingTopic {
  id: string
  title: string
  description: string
  icon: string
  concepts: Concept[]
  examples: CodeExample[]
  problems: CodingProblem[]
}

export interface Concept {
  id: string
  title: string
  description: string
  syntax: { [language: string]: string }
}

export interface CodeExample {
  id: string
  title: string
  description: string
  code: { [language: string]: string }
  explanation: string
}

export interface CodingProblem {
  id: string
  topicId: string
  title: string
  description: string
  difficulty: "easy" | "medium" | "hard"
  testCases: TestCase[]
  starterCode: { [language: string]: string }
  solution: { [language: string]: string }
  hints: string[]
}

export interface TestCase {
  input: string
  expectedOutput: string
  explanation?: string
}

export interface UserCodingProgress {
  userId: string
  topic: string
  attempted: number
  correct: number
  lastPracticed: Date
  level: "Beginner" | "Intermediate" | "Advanced" | "Expert"
}

export const CODING_TOPICS: CodingTopic[] = [
  {
    id: "arrays",
    title: "Arrays",
    description: "Linear data structures and array manipulation techniques",
    icon: "📊",
    concepts: [
      {
        id: "array-basics",
        title: "Array Declaration",
        description: "How to declare and initialize arrays in different languages",
        syntax: {
          javascript: "let arr = [1, 2, 3, 4, 5];",
          python: "arr = [1, 2, 3, 4, 5]",
          cpp: "int arr[] = {1, 2, 3, 4, 5};",
        },
      },
      {
        id: "array-access",
        title: "Array Access",
        description: "Accessing elements using index",
        syntax: {
          javascript: "arr[0] // First element",
          python: "arr[0] # First element",
          cpp: "arr[0] // First element",
        },
      },
    ],
    examples: [
      {
        id: "find-max",
        title: "Find Maximum Element",
        description: "Find the largest element in an array",
        code: {
          javascript: `function findMax(arr) {
  let max = arr[0];
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] > max) {
      max = arr[i];
    }
  }
  return max;
}`,
          python: `def find_max(arr):
    max_val = arr[0]
    for i in range(1, len(arr)):
        if arr[i] > max_val:
            max_val = arr[i]
    return max_val`,
          cpp: `int findMax(int arr[], int n) {
    int max = arr[0];
    for (int i = 1; i < n; i++) {
        if (arr[i] > max) {
            max = arr[i];
        }
    }
    return max;
}`,
        },
        explanation: "We iterate through the array and keep track of the maximum value found so far.",
      },
    ],
    problems: [
      {
        id: "two-sum",
        topicId: "arrays",
        title: "Two Sum",
        description:
          "Given an array of integers and a target sum, return indices of two numbers that add up to the target.",
        difficulty: "easy",
        testCases: [
          {
            input: "[2, 7, 11, 15], target = 9",
            expectedOutput: "[0, 1]",
            explanation: "2 + 7 = 9, so indices 0 and 1",
          },
          {
            input: "[3, 2, 4], target = 6",
            expectedOutput: "[1, 2]",
            explanation: "2 + 4 = 6, so indices 1 and 2",
          },
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
        },
        hints: [
          "Use a hash map to store numbers and their indices",
          "For each number, check if its complement exists in the map",
          "The complement is target - current number",
        ],
      },
    ],
  },
  {
    id: "strings",
    title: "Strings",
    description: "String manipulation and pattern matching algorithms",
    icon: "📝",
    concepts: [
      {
        id: "string-basics",
        title: "String Declaration",
        description: "How to declare and work with strings",
        syntax: {
          javascript: "let str = 'Hello World';",
          python: "str = 'Hello World'",
          cpp: 'string str = "Hello World";',
        },
      },
    ],
    examples: [
      {
        id: "reverse-string",
        title: "Reverse String",
        description: "Reverse a string in-place",
        code: {
          javascript: `function reverseString(s) {
  let left = 0, right = s.length - 1;
  while (left < right) {
    [s[left], s[right]] = [s[right], s[left]];
    left++;
    right--;
  }
  return s;
}`,
          python: `def reverse_string(s):
    left, right = 0, len(s) - 1
    while left < right:
        s[left], s[right] = s[right], s[left]
        left += 1
        right -= 1
    return s`,
          cpp: `void reverseString(vector<char>& s) {
    int left = 0, right = s.size() - 1;
    while (left < right) {
        swap(s[left], s[right]);
        left++;
        right--;
    }
}`,
        },
        explanation: "Use two pointers approach to swap characters from both ends moving towards center.",
      },
    ],
    problems: [
      {
        id: "palindrome-check",
        topicId: "strings",
        title: "Valid Palindrome",
        description: "Check if a string is a palindrome, considering only alphanumeric characters and ignoring case.",
        difficulty: "easy",
        testCases: [
          {
            input: '"A man, a plan, a canal: Panama"',
            expectedOutput: "true",
            explanation: "After removing non-alphanumeric: 'amanaplanacanalpanama' is a palindrome",
          },
          {
            input: '"race a car"',
            expectedOutput: "false",
            explanation: "After removing non-alphanumeric: 'raceacar' is not a palindrome",
          },
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
        },
        hints: [
          "First clean the string by removing non-alphanumeric characters",
          "Convert to lowercase for case-insensitive comparison",
          "Use two pointers to check from both ends",
        ],
      },
    ],
  },
  {
    id: "linked-lists",
    title: "Linked Lists",
    description: "Dynamic data structures with pointer-based connections",
    icon: "🔗",
    concepts: [
      {
        id: "node-structure",
        title: "Node Structure",
        description: "Basic structure of a linked list node",
        syntax: {
          javascript: `class ListNode {
    constructor(val, next = null) {
        this.val = val;
        this.next = next;
    }
}`,
          python: `class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next`,
          cpp: `struct ListNode {
    int val;
    ListNode *next;
    ListNode(int x) : val(x), next(nullptr) {}
};`,
        },
      },
    ],
    examples: [
      {
        id: "traverse-list",
        title: "Traverse Linked List",
        description: "Print all elements in a linked list",
        code: {
          javascript: `function printList(head) {
    let current = head;
    while (current) {
        console.log(current.val);
        current = current.next;
    }
}`,
          python: `def print_list(head):
    current = head
    while current:
        print(current.val)
        current = current.next`,
          cpp: `void printList(ListNode* head) {
    ListNode* current = head;
    while (current) {
        cout << current->val << " ";
        current = current->next;
    }
}`,
        },
        explanation: "Start from head and follow next pointers until reaching null.",
      },
    ],
    problems: [
      {
        id: "reverse-linked-list",
        topicId: "linked-lists",
        title: "Reverse Linked List",
        description: "Reverse a singly linked list iteratively.",
        difficulty: "easy",
        testCases: [
          {
            input: "[1,2,3,4,5]",
            expectedOutput: "[5,4,3,2,1]",
            explanation: "Reverse the direction of all pointers",
          },
          {
            input: "[1,2]",
            expectedOutput: "[2,1]",
            explanation: "Simple two-node reversal",
          },
        ],
        starterCode: {
          javascript: `function reverseList(head) {
    // Your code here
    
}`,
          python: `def reverse_list(head):
    # Your code here
    pass`,
          cpp: `ListNode* reverseList(ListNode* head) {
    // Your code here
    
}`,
        },
        solution: {
          javascript: `function reverseList(head) {
    let prev = null;
    let current = head;
    while (current) {
        let next = current.next;
        current.next = prev;
        prev = current;
        current = next;
    }
    return prev;
}`,
          python: `def reverse_list(head):
    prev = None
    current = head
    while current:
        next_node = current.next
        current.next = prev
        prev = current
        current = next_node
    return prev`,
          cpp: `ListNode* reverseList(ListNode* head) {
    ListNode* prev = nullptr;
    ListNode* current = head;
    while (current) {
        ListNode* next = current->next;
        current->next = prev;
        prev = current;
        current = next;
    }
    return prev;
}`,
        },
        hints: [
          "Use three pointers: prev, current, and next",
          "Reverse the link direction in each iteration",
          "Return the new head (which was the last node)",
        ],
      },
    ],
  },
  {
    id: "recursion",
    title: "Recursion",
    description: "Functions that call themselves to solve problems",
    icon: "🔄",
    concepts: [
      {
        id: "base-case",
        title: "Base Case",
        description: "The condition that stops the recursion",
        syntax: {
          javascript: "if (n <= 1) return n; // Base case",
          python: "if n <= 1: return n  # Base case",
          cpp: "if (n <= 1) return n; // Base case",
        },
      },
    ],
    examples: [
      {
        id: "factorial",
        title: "Factorial",
        description: "Calculate factorial using recursion",
        code: {
          javascript: `function factorial(n) {
    if (n <= 1) return 1;
    return n * factorial(n - 1);
}`,
          python: `def factorial(n):
    if n <= 1:
        return 1
    return n * factorial(n - 1)`,
          cpp: `int factorial(int n) {
    if (n <= 1) return 1;
    return n * factorial(n - 1);
}`,
        },
        explanation: "Base case: factorial of 0 or 1 is 1. Recursive case: n! = n × (n-1)!",
      },
    ],
    problems: [
      {
        id: "fibonacci",
        topicId: "recursion",
        title: "Fibonacci Number",
        description: "Calculate the nth Fibonacci number using recursion.",
        difficulty: "easy",
        testCases: [
          {
            input: "n = 2",
            expectedOutput: "1",
            explanation: "F(2) = F(1) + F(0) = 1 + 0 = 1",
          },
          {
            input: "n = 3",
            expectedOutput: "2",
            explanation: "F(3) = F(2) + F(1) = 1 + 1 = 2",
          },
        ],
        starterCode: {
          javascript: `function fib(n) {
    // Your code here
    
}`,
          python: `def fib(n):
    # Your code here
    pass`,
          cpp: `int fib(int n) {
    // Your code here
    
}`,
        },
        solution: {
          javascript: `function fib(n) {
    if (n <= 1) return n;
    return fib(n - 1) + fib(n - 2);
}`,
          python: `def fib(n):
    if n <= 1:
        return n
    return fib(n - 1) + fib(n - 2)`,
          cpp: `int fib(int n) {
    if (n <= 1) return n;
    return fib(n - 1) + fib(n - 2);
}`,
        },
        hints: [
          "Base cases: F(0) = 0, F(1) = 1",
          "Recursive relation: F(n) = F(n-1) + F(n-2)",
          "This is the naive approach - can be optimized with memoization",
        ],
      },
    ],
  },
]

export class CodingService {
  static getTopicById(id: string): CodingTopic | undefined {
    return CODING_TOPICS.find((topic) => topic.id === id)
  }

  static getProblemsByTopic(topicId: string, difficulty?: string, count?: number): CodingProblem[] {
    const topic = this.getTopicById(topicId)
    if (!topic) return []

    let problems = topic.problems
    if (difficulty) {
      problems = problems.filter((p) => p.difficulty === difficulty)
    }

    if (count) {
      problems = problems.sort(() => Math.random() - 0.5).slice(0, count)
    }

    return problems
  }

  static calculateLevel(accuracy: number): UserCodingProgress["level"] {
    if (accuracy >= 90) return "Expert"
    if (accuracy >= 75) return "Advanced"
    if (accuracy >= 60) return "Intermediate"
    return "Beginner"
  }

  static getLevelColor(level: UserCodingProgress["level"]): string {
    switch (level) {
      case "Expert":
        return "text-purple-500"
      case "Advanced":
        return "text-green-500"
      case "Intermediate":
        return "text-yellow-500"
      default:
        return "text-red-500"
    }
  }

  static getLevelBadge(level: UserCodingProgress["level"]): string {
    switch (level) {
      case "Expert":
        return "🟣"
      case "Advanced":
        return "🟢"
      case "Intermediate":
        return "🟡"
      default:
        return "🔴"
    }
  }

  static executeCode(code: string, language: string, testCases: TestCase[]): { passed: boolean; results: any[] } {
    // This is a mock implementation
    // In a real app, you'd send this to a code execution service
    const results = testCases.map((testCase) => ({
      input: testCase.input,
      expected: testCase.expectedOutput,
      actual: testCase.expectedOutput, // Mock: always pass
      passed: true,
    }))

    return {
      passed: results.every((r) => r.passed),
      results,
    }
  }
}
