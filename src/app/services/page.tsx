"use client"

import Link from "next/link"
import React from "react"

export default function ServicesPage() {
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
            <Link href="/services" className="text-sm font-bold text-zentra-blue transition-soft">Services</Link>
            <Link href="/work" className="text-sm font-semibold text-zentra-muted hover:text-zentra-text transition-soft">Work</Link>
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

      {/* Services Content */}
      <main className="max-w-7xl mx-auto px-6 py-24 relative z-10 w-full flex-grow animate-fade-in-up">
        <div className="text-center space-y-4 mb-16">
          <div className="text-xs font-bold uppercase tracking-widest text-zentra-orange">
            Engine Scanners
          </div>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-zentra-text">
            Advanced Posture <span className="text-zentra-blue font-normal italic">Auditing</span>
          </h2>
          <p className="text-sm text-zentra-muted font-medium max-w-md mx-auto">
            Modular cloud auditing systems operating continuously
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Card 1 */}
          <div className="bg-white border border-zentra-border p-8 rounded-3xl relative overflow-hidden flex flex-col justify-between h-72 hover:border-zentra-blue/30 transition-soft shadow-card hover:-translate-y-1">
            <div className="z-10 space-y-4">
              <span className="text-xs font-bold text-zentra-blue uppercase tracking-widest">CSPM 01</span>
              <h3 className="text-lg font-bold text-zentra-text">IAM Wildcard Audit</h3>
              <p className="text-sm text-zentra-muted leading-relaxed font-medium">
                Flags wildcard access policies (Action: "*") and validates role permissions boundaries to eliminate privilege escalation.
              </p>
            </div>
            <span className="text-xs font-bold text-zentra-green z-10 flex items-center gap-2">
              <span className="w-2 h-2 bg-zentra-green rounded-full animate-pulse"></span> SYSTEM READY
            </span>
          </div>

          {/* Card 2 */}
          <div className="bg-white border border-zentra-border p-8 rounded-3xl relative overflow-hidden flex flex-col justify-between h-72 hover:border-zentra-blue/30 transition-soft shadow-card hover:-translate-y-1">
            <div className="z-10 space-y-4">
              <span className="text-xs font-bold text-zentra-blue uppercase tracking-widest">CSPM 02</span>
              <h3 className="text-lg font-bold text-zentra-text">Security Group Monitor</h3>
              <p className="text-sm text-zentra-muted leading-relaxed font-medium">
                Checks VPC ingress configurations to detect open database channels, exposed port 22 SSH keys, and weak gateway definitions.
              </p>
            </div>
            <span className="text-xs font-bold text-zentra-green z-10 flex items-center gap-2">
              <span className="w-2 h-2 bg-zentra-green rounded-full animate-pulse"></span> SYSTEM READY
            </span>
          </div>

          {/* Card 3 */}
          <div className="bg-white border border-zentra-border p-8 rounded-3xl relative overflow-hidden flex flex-col justify-between h-72 hover:border-zentra-orange/30 transition-soft shadow-card hover:-translate-y-1">
            <div className="z-10 space-y-4">
              <span className="text-xs font-bold text-zentra-orange uppercase tracking-widest">CSPM 03</span>
              <h3 className="text-lg font-bold text-zentra-text">SSL Trust Audits</h3>
              <p className="text-sm text-zentra-muted leading-relaxed font-medium">
                Audits secure socket connection chains, expiration offsets, certificate trust, and flags deprecated TLS cypher blocks.
              </p>
            </div>
            <span className="text-xs font-bold text-zentra-green z-10 flex items-center gap-2">
              <span className="w-2 h-2 bg-zentra-green rounded-full animate-pulse"></span> SYSTEM READY
            </span>
          </div>

          {/* Card 4 */}
          <div className="bg-white border border-zentra-border p-8 rounded-3xl relative overflow-hidden flex flex-col justify-between h-72 hover:border-zentra-blue/30 transition-soft shadow-card hover:-translate-y-1">
            <div className="z-10 space-y-4">
              <span className="text-xs font-bold text-zentra-blue uppercase tracking-widest">CSPM 04</span>
              <h3 className="text-lg font-bold text-zentra-text">Trivy Vulnerabilities</h3>
              <p className="text-sm text-zentra-muted leading-relaxed font-medium">
                Inspects underlying OS package versions, scanning container environments and Docker libraries against global CVE definitions.
              </p>
            </div>
            <span className="text-xs font-bold text-zentra-green z-10 flex items-center gap-2">
              <span className="w-2 h-2 bg-zentra-green rounded-full animate-pulse"></span> SYSTEM READY
            </span>
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
