"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Eye,
  Mic,
  Shield,
  BarChart3,
  Users,
  Star,
  ArrowRight,
  Play,
  CheckCircle,
  Zap,
  Brain,
  Camera,
} from "lucide-react"
import Link from "next/link"
import { ThemeToggle } from "@/components/theme-toggle"

const features = [
  {
    icon: Eye,
    title: "Eye Contact Tracking",
    description: "Real-time monitoring of candidate attention and engagement levels",
  },
  {
    icon: Mic,
    title: "Voice Analysis",
    description: "Advanced speech pattern analysis for confidence and clarity assessment",
  },
  {
    icon: Shield,
    title: "Behavior Detection",
    description: "AI-powered detection of suspicious activities and tab switching",
  },
  {
    icon: BarChart3,
    title: "Detailed Analytics",
    description: "Comprehensive reports with actionable insights and recommendations",
  },
  {
    icon: Brain,
    title: "Emotion Recognition",
    description: "Real-time emotion detection and sentiment analysis",
  },
  {
    icon: Camera,
    title: "Video Proctoring",
    description: "Secure video monitoring with automated flagging system",
  },
]

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "HR Director at TechCorp",
    content: "SaviAI has revolutionized our remote interview process. The insights are incredibly valuable.",
    rating: 5,
  },
  {
    name: "Michael Chen",
    role: "Recruitment Manager",
    content: "The AI feedback helps us make more informed hiring decisions. Highly recommended!",
    rating: 5,
  },
  {
    name: "Emily Davis",
    role: "Talent Acquisition Lead",
    content: "Seamless integration and powerful analytics. Our interview quality has improved significantly.",
    rating: 5,
  },
]

export function LandingPage() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 glass-card border-0 border-b border-white/20">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Eye className="w-5 h-5 text-foreground" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                SaviAI
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <Link href="/login">
                <Button variant="ghost" className="hover:bg-white/20">
                  Login
                </Button>
              </Link>
              <Link href="/register">
                <Button className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-foreground shadow-lg hover:shadow-xl transition-all duration-300">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 particle-bg">
        <div className="container mx-auto text-center">
          <div className="animate-fade-in">
            <Badge className="mb-6 bg-white/20 text-indigo-700 dark:text-indigo-300 border-white/30 hover:bg-white/30 transition-all duration-300">
              <Zap className="w-4 h-4 mr-2" />
              AI-Powered Interview Intelligence
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 bg-clip-text text-transparent animate-float">
              Next-Gen Interview
              <br />
              Proctoring System
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Transform your remote interviews with AI-powered monitoring, real-time feedback, and comprehensive
              analytics. Ensure fairness, detect behavior patterns, and make data-driven hiring decisions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/interview">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-foreground shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 group"
                >
                  <Play className="w-5 h-5 mr-2 group-hover:animate-pulse" />
                  Start Interview
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/admin">
                <Button
                  size="lg"
                  variant="outline"
                  className="glass-card hover:bg-white/30 dark:hover:bg-gray-800/30 transition-all duration-300 transform hover:scale-105 bg-transparent"
                >
                  <Shield className="w-5 h-5 mr-2" />
                  Admin Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Powerful AI Features
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto">
              Advanced technology stack designed to provide comprehensive interview monitoring and analysis
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="glass-card hover:shadow-2xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 group"
              >
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:rotate-12 transition-transform duration-300">
                    <feature.icon className="w-8 h-8 text-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">{feature.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-gray-800 dark:to-gray-900">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Trusted by Industry Leaders
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-lg">See what our customers say about SaviAI</p>
          </div>
          <div className="max-w-4xl mx-auto">
            <Card className="glass-card p-8 text-center">
              <CardContent className="p-0">
                <div className="flex justify-center mb-4">
                  {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <blockquote className="text-xl text-gray-700 dark:text-gray-300 mb-6 italic">
                  "{testimonials[currentTestimonial].content}"
                </blockquote>
                <div>
                  <p className="font-semibold text-gray-800 dark:text-gray-200">
                    {testimonials[currentTestimonial].name}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">{testimonials[currentTestimonial].role}</p>
                </div>
              </CardContent>
            </Card>
            <div className="flex justify-center mt-6 space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentTestimonial
                      ? "bg-indigo-500 scale-125"
                      : "bg-gray-300 dark:bg-gray-600 hover:bg-indigo-300"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto text-center">
          <Card className="glass-card p-12 max-w-4xl mx-auto">
            <CardContent className="p-0">
              <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Ready to Transform Your Interviews?
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
                Join thousands of companies using SaviAI to conduct fair, efficient, and insightful remote interviews.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/register">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-foreground shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105"
                  >
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Start Free Trial
                  </Button>
                </Link>
                <Button
                  size="lg"
                  variant="outline"
                  className="glass-card hover:bg-white/30 dark:hover:bg-gray-800/30 bg-transparent"
                >
                  <Users className="w-5 h-5 mr-2" />
                  Schedule Demo
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-white/20 glass-card">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Eye className="w-5 h-5 text-foreground" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                SaviAI
              </span>
            </div>
            <p className="text-gray-600 dark:text-gray-400">© 2024 SaviAI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
