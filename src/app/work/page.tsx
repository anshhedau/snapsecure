"use client"

import Link from "next/link"
import React, { useState, useEffect } from "react"

function Counter({ target, duration = 2000, suffix = "" }: { target: number; duration?: number; suffix?: string }) {
  const [count, setCount] = useState(0)
  const [ref, setRef] = useState<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!ref) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          let startTimestamp: number | null = null
          const step = (timestamp: number) => {
            if (!startTimestamp) startTimestamp = timestamp
            const progress = Math.min((timestamp - startTimestamp) / duration, 1)
            setCount(progress * target)
            if (progress < 1) {
              window.requestAnimationFrame(step)
            }
          }
          window.requestAnimationFrame(step)
          observer.unobserve(ref)
        }
      },
      { threshold: 0.02 }
    )
    observer.observe(ref)
    return () => observer.disconnect()
  }, [ref, target, duration])

  return (
    <div ref={setRef} className="font-bold">
      {target % 1 === 0 ? count.toFixed(0) : count.toFixed(1)}
      {suffix}
    </div>
  )
}

export default function WorkPage() {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-zentra-bg text-zentra-text font-sans flex flex-col">

      {/* Navigation Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-zentra-border shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 bg-zentra-blue rounded-xl flex items-center justify-center text-zentra-text font-bold text-xl shadow-soft">
              S
            </div>
            <div className="flex flex-col">
              <Link href="/">
                <span className="text-xl font-bold tracking-tight text-zentra-text cursor-pointer">SnapSecure</span>
              </Link>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <Link href="/about" className="text-sm font-semibold text-zentra-muted hover:text-zentra-text transition-soft">About</Link>
            <Link href="/services" className="text-sm font-semibold text-zentra-muted hover:text-zentra-text transition-soft">Services</Link>
            <Link href="/work" className="text-sm font-bold text-zentra-blue transition-soft">Work</Link>
            <Link href="/contact" className="text-sm font-semibold text-zentra-muted hover:text-zentra-text transition-soft">Contact</Link>
          </div>
          <div className="flex gap-4 items-center">
            <Link href="/login" className="px-5 py-2.5 text-sm font-bold text-zentra-text hover:bg-zentra-bg rounded-xl transition-soft">
              Sign In
            </Link>
            <Link href="/register" className="px-6 py-2.5 text-sm font-bold text-zentra-text bg-zentra-blue hover:bg-zentra-accent rounded-full transition-soft shadow-soft">
              Start a project
            </Link>
          </div>
        </div>
      </header>

      {/* Work Content */}
      <main className="max-w-7xl mx-auto px-6 py-24 relative z-10 w-full flex-grow animate-fade-in-up">
        <div className="text-center space-y-4 mb-16">
          <div className="text-xs font-bold uppercase tracking-widest text-zentra-orange">
            Recorded Performances
          </div>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-zentra-text">
            System Security <span className="text-zentra-blue font-normal italic">Metrics</span>
          </h2>
          <p className="text-sm text-zentra-muted font-medium max-w-md mx-auto">
            Audit validation records and active posture benchmarks
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 text-center">
          <div className="bg-white border border-zentra-border p-8 rounded-3xl flex flex-col items-center justify-center gap-3 transition-soft shadow-card hover:-translate-y-1">
            <div className="text-4xl md:text-5xl font-bold text-zentra-text tracking-tight">
              <Counter target={99.9} suffix="%" />
            </div>
            <p className="text-xs font-bold uppercase tracking-widest text-zentra-muted">
              Vulnerability Remediation Rate
            </p>
          </div>

          <div className="bg-white border border-zentra-border p-8 rounded-3xl flex flex-col items-center justify-center gap-3 transition-soft shadow-card hover:-translate-y-1">
            <div className="text-4xl md:text-5xl font-bold text-zentra-blue tracking-tight">
              <Counter target={247} suffix="+" />
            </div>
            <p className="text-xs font-bold uppercase tracking-widest text-zentra-muted">
              Daily AWS Infrastructure Scans
            </p>
          </div>

          <div className="bg-white border border-zentra-border p-8 rounded-3xl flex flex-col items-center justify-center gap-3 transition-soft shadow-card hover:-translate-y-1">
            <div className="text-4xl md:text-5xl font-bold text-zentra-orange tracking-tight">
              <Counter target={0} suffix=" FP" />
            </div>
            <p className="text-xs font-bold uppercase tracking-widest text-zentra-muted">
              Auditor Signal False Positives
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-zentra-border bg-white py-10 text-center text-sm text-zentra-muted font-medium relative z-10 mt-auto">
        <div className="max-w-7xl mx-auto px-6">
          &copy; {new Date().getFullYear()} SnapSecure. All rights reserved. Secure by Default.
        </div>
      </footer>
    </div>
  )
}
