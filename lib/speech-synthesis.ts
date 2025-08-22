interface SpeechOptions {
  rate?: number
  pitch?: number
  volume?: number
  voice?: string
  onStart?: () => void
  onEnd?: () => void
  onError?: (error: any) => void
}

class SpeechSynthesisService {
  private synthesis: SpeechSynthesis | null = null
  private currentUtterance: SpeechSynthesisUtterance | null = null
  private voices: SpeechSynthesisVoice[] = []

  constructor() {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      this.synthesis = window.speechSynthesis
      this.loadVoices()
    }
  }

  private loadVoices() {
    if (!this.synthesis) return

    const updateVoices = () => {
      this.voices = this.synthesis!.getVoices()
      console.log("Available voices:", this.voices.length)
    }

    updateVoices()

    // Some browsers load voices asynchronously
    if (this.synthesis.onvoiceschanged !== undefined) {
      this.synthesis.onvoiceschanged = updateVoices
    }
  }

  private getVoice(voicePreference?: string): SpeechSynthesisVoice | null {
    if (!this.voices.length) return null

    // Try to find preferred voice
    if (voicePreference) {
      const preferredVoice = this.voices.find(
        (voice) => voice.lang.includes(voicePreference) || voice.name.includes(voicePreference),
      )
      if (preferredVoice) return preferredVoice
    }

    // Find a good English voice for Savi
    const englishVoices = this.voices.filter((voice) => voice.lang.startsWith("en") && !voice.name.includes("Google"))

    // Prefer female voices for Savi
    const femaleVoices = englishVoices.filter(
      (voice) =>
        voice.name.toLowerCase().includes("female") ||
        voice.name.toLowerCase().includes("samantha") ||
        voice.name.toLowerCase().includes("karen") ||
        voice.name.toLowerCase().includes("victoria") ||
        voice.name.toLowerCase().includes("zira"),
    )

    if (femaleVoices.length > 0) {
      return femaleVoices[0]
    }

    // Fallback to any English voice
    return englishVoices[0] || this.voices[0] || null
  }

  async speak(text: string, options: SpeechOptions = {}): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.synthesis) {
        const error = new Error("Speech synthesis not supported")
        options.onError?.(error)
        reject(error)
        return
      }

      // Stop any current speech
      this.stop()

      const utterance = new SpeechSynthesisUtterance(text)
      this.currentUtterance = utterance

      // Set voice
      const voice = this.getVoice(options.voice)
      if (voice) {
        utterance.voice = voice
        console.log("Using voice:", voice.name)
      }

      // Set speech parameters with Savi-optimized defaults
      utterance.rate = options.rate ?? 0.9
      utterance.pitch = options.pitch ?? 1.1
      utterance.volume = options.volume ?? 0.8

      // Event handlers
      utterance.onstart = () => {
        console.log("Speech started")
        options.onStart?.()
      }

      utterance.onend = () => {
        console.log("Speech ended")
        this.currentUtterance = null
        options.onEnd?.()
        resolve()
      }

      utterance.onerror = (event) => {
        console.error("Speech error:", event)
        this.currentUtterance = null
        options.onError?.(event)
        reject(event)
      }

      utterance.onpause = () => {
        console.log("Speech paused")
      }

      utterance.onresume = () => {
        console.log("Speech resumed")
      }

      // Start speaking
      try {
        this.synthesis.speak(utterance)
      } catch (error) {
        console.error("Failed to start speech:", error)
        options.onError?.(error)
        reject(error)
      }
    })
  }

  stop() {
    if (this.synthesis) {
      this.synthesis.cancel()
      this.currentUtterance = null
      console.log("Speech stopped")
    }
  }

  pause() {
    if (this.synthesis && this.synthesis.speaking) {
      this.synthesis.pause()
      console.log("Speech paused")
    }
  }

  resume() {
    if (this.synthesis && this.synthesis.paused) {
      this.synthesis.resume()
      console.log("Speech resumed")
    }
  }

  isSpeaking(): boolean {
    return this.synthesis ? this.synthesis.speaking : false
  }

  isPaused(): boolean {
    return this.synthesis ? this.synthesis.paused : false
  }

  getAvailableVoices(): SpeechSynthesisVoice[] {
    return this.voices
  }

  // Savi-specific greeting methods
  async greetUser(userName?: string): Promise<void> {
    const greetings = [
      `Hi there! I'm Savi, your AI Interview Assistant. ${userName ? `Nice to meet you, ${userName}!` : "Nice to meet you!"} I'm here to help you succeed in your interviews.`,
      `Hello! I'm Savi, and I'm excited to be your interview coach today. ${userName ? `Welcome, ${userName}!` : "Welcome!"} Let's work together to boost your confidence.`,
      `Hey! Savi here, your friendly AI interview assistant. ${userName ? `Great to see you, ${userName}!` : "Great to see you!"} Ready to practice and improve your interview skills?`,
    ]

    const randomGreeting = greetings[Math.floor(Math.random() * greetings.length)]

    return this.speak(randomGreeting, {
      rate: 0.85,
      pitch: 1.15,
      volume: 0.9,
    })
  }

  async encourageUser(): Promise<void> {
    const encouragements = [
      "You're doing great! Keep up the excellent work.",
      "That was a fantastic answer! Your confidence is really showing.",
      "Excellent response! You're demonstrating strong communication skills.",
      "Well done! I can see you're really thinking through your answers carefully.",
      "Great job! Your preparation is definitely paying off.",
    ]

    const randomEncouragement = encouragements[Math.floor(Math.random() * encouragements.length)]

    return this.speak(randomEncouragement, {
      rate: 0.9,
      pitch: 1.2,
      volume: 0.8,
    })
  }

  async provideTip(tip: string): Promise<void> {
    const intro = "Here's a quick tip for you: "

    return this.speak(intro + tip, {
      rate: 0.8,
      pitch: 1.0,
      volume: 0.9,
    })
  }
}

// Export singleton instance
export const speechService = new SpeechSynthesisService()
