"use client"

export class SessionManager {
  private static instance: SessionManager
  private inactivityTimer: NodeJS.Timeout | null = null
  private readonly INACTIVITY_TIMEOUT = 15 * 60 * 1000 // 15 minutes
  private readonly WARNING_TIME = 2 * 60 * 1000 // 2 minutes before logout
  private warningShown = false

  private constructor() {
    this.setupEventListeners()
  }

  static getInstance(): SessionManager {
    if (!SessionManager.instance) {
      SessionManager.instance = new SessionManager()
    }
    return SessionManager.instance
  }

  private setupEventListeners() {
    if (typeof window === "undefined") return

    const events = ["mousedown", "mousemove", "keypress", "scroll", "touchstart", "click"]

    events.forEach((event) => {
      document.addEventListener(event, this.resetTimer.bind(this), true)
    })
  }

  private resetTimer() {
    if (this.inactivityTimer) {
      clearTimeout(this.inactivityTimer)
    }

    this.warningShown = false

    this.inactivityTimer = setTimeout(() => {
      this.handleInactivity()
    }, this.INACTIVITY_TIMEOUT - this.WARNING_TIME)
  }

  private handleInactivity() {
    if (!this.warningShown) {
      this.warningShown = true
      const shouldContinue = confirm(
        "You will be logged out in 2 minutes due to inactivity. Click OK to continue your session.",
      )

      if (shouldContinue) {
        this.resetTimer()
      } else {
        this.logout()
      }

      // Set final timeout for logout
      setTimeout(() => {
        if (this.warningShown) {
          this.logout()
        }
      }, this.WARNING_TIME)
    }
  }

  private logout() {
    localStorage.removeItem("proctoai_user")
    sessionStorage.clear()
    window.location.href = "/login"
  }

  startSession() {
    this.resetTimer()
  }

  endSession() {
    if (this.inactivityTimer) {
      clearTimeout(this.inactivityTimer)
    }
    this.logout()
  }
}
