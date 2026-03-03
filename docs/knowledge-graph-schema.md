# Knowledge Graph Schema Design

> **Status**: Architecture only — not yet implemented in DB. Designed for future migration to a graph-capable store (Neo4j, DGraph, or MongoDB graph-like using references).

---

## Purpose

This schema enables:
- Linking multiple roles to shared questions
- User-contributed questions with admin moderation
- Topic clustering and tag-based filtering
- Scalable question retrieval by role, topic, difficulty, and tags

---

## Data Models

### 1. Question

```typescript
interface Question {
  id: string                       // Unique identifier, e.g. "fe_dsa_1"
  text: string                     // The interview question text
  roles: string[]                  // e.g. ["Frontend Developer", "Full Stack Developer"]
  topic: "DSA" | "System Design" | "Behavioral" | "Core Subject"
  tags: string[]                   // e.g. ["react", "performance", "algorithms"]
  difficulty: "easy" | "medium" | "hard"
  source: "system" | "user"        // Who created this question
  contributedBy?: string           // userId if source === "user"
  status: "approved" | "pending" | "rejected"
  createdAt: Date
  updatedAt: Date
  usageCount: number               // How many times this question has been served
}
```

### 2. Role

```typescript
interface Role {
  id: string                       // e.g. "frontend-developer"
  label: string                    // e.g. "Frontend Developer"
  description: string
  relatedRoles: string[]           // Role IDs that share question overlap
  topics: string[]                 // Topics covered for this role
  iconName: string                 // Lucide icon name for UI
  color: string                    // Hex color for UI theming
}
```

### 3. Topic

```typescript
interface Topic {
  id: string                       // e.g. "dsa"
  label: string                    // e.g. "DSA"
  description: string
  parentTopic?: string             // Optional parent for sub-topics
  questionIds: string[]            // Question IDs belonging to this topic
  applicableRoles: string[]        // Which roles this topic applies to
}
```

### 4. Tag

```typescript
interface Tag {
  id: string                       // e.g. "react"
  label: string
  questionIds: string[]            // Questions tagged with this tag
  relatedTags: string[]            // Semantically related tags
  frequency: number                // How often this tag appears
}
```

### 5. UserContribution

```typescript
interface UserContribution {
  id: string
  userId: string                   // Who submitted the question
  questionDraft: Omit<Question, "id" | "status" | "usageCount" | "createdAt" | "updatedAt">
  submittedAt: Date
  status: "pending" | "approved" | "rejected"
  reviewedBy?: string              // Admin userId who reviewed
  reviewedAt?: Date
  rejectionReason?: string
}
```

### 6. UserQuestionHistory

```typescript
interface UserQuestionHistory {
  userId: string
  questionId: string
  servedAt: Date
  role: string
  topic: string
  answered: boolean
  evaluationScore?: number
}
```

---

## Graph Relationships

```
Role ──── has many ──── Topic
Topic ─── has many ──── Question
Question ─ has many ─── Tag
Question ─ used by ──── Role (many-to-many)
Tag ────── links ──────► related Tag

User ───── contributed ─► UserContribution ─► Question (pending approval)
User ───── history ─────► UserQuestionHistory
```

---

## Current Implementation

Until graph DB is adopted, this is implemented as:
- **Static JSON** in `/public/data/question-bank.json` (role → topic → question[])
- **QuestionSelector.getQuestionsForConfig()** loads and filters from JSON
- **Tags** stored as arrays on each question (non-indexed)

---

## Migration Path

1. Load `question-bank.json` into MongoDB as Question documents
2. Create Role and Topic collections with cross-references
3. Add `UserQuestionHistory` collection to avoid repeat questions per user
4. Add `UserContribution` collection with admin approval workflow
5. Add compound indexes: `{ role: 1, topic: 1, difficulty: 1 }` and `{ tags: 1 }`
6. Eventually migrate to Neo4j or DGraph for graph traversal (related roles, tag clusters)
