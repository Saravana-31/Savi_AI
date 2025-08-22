export interface TabSwitchEvent {
  type: "hidden" | "visible"
  timestamp: number
  questionIndex: number
}

class TabDetectionService {
  private isDetecting = false
  private currentQuestion = 0
  private onTabSwitchCallback: ((event: TabSwitchEvent) => void) | null = null
  private lastSwitchTime = 0
  private debounceDelay = 2000 // 2 seconds debounce
  private switchCount = 0

  startDetection(questionIndex = 0) {
    this.currentQuestion = questionIndex
    this.isDetecting = true
    this.switchCount = 0

    if (typeof document !== "undefined") {
      document.addEventListener("visibilitychange", this.handleVisibilityChange)
      console.log("Tab detection started for question", questionIndex)
    }
  }

  stopDetection() {
    this.isDetecting = false
    if (typeof document !== "undefined") {
      document.removeEventListener("visibilitychange", this.handleVisibilityChange)
      console.log("Tab detection stopped")
    }
  }

  setCurrentQuestion(questionIndex: number) {
    this.currentQuestion = questionIndex
  }

  onTabSwitch(callback: (event: TabSwitchEvent) => void) {
    this.onTabSwitchCallback = callback
  }

  private handleVisibilityChange = () => {
    if (!this.isDetecting) return

    const now = Date.now()
    const isHidden = document.hidden

    // Debounce rapid visibility changes
    if (now - this.lastSwitchTime < this.debounceDelay) {
      return
    }

    // Only count when tab becomes hidden (user switches away)
    if (isHidden) {
      this.lastSwitchTime = now
      this.switchCount++

      const event: TabSwitchEvent = {
        type: "hidden",
        timestamp: now,
        questionIndex: this.currentQuestion,
      }

      console.log(`Tab switch detected (${this.switchCount}) at question ${this.currentQuestion}`)
      this.onTabSwitchCallback?.(event)
    }
  }

  getSwitchCount(): number {
    return this.switchCount
  }

  resetSwitchCount() {
    this.switchCount = 0
  }
}

export const tabDetectionService = new TabDetectionService()
