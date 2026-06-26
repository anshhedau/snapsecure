"use client"

import Link from "next/link"
import React, { useState, useEffect } from "react"
import { Logo } from "@/components/Logo"
import { SecurityCore3D } from "@/components/SecurityCore3D"

export default function LandingPage() {
  const [logs, setLogs] = useState<string[]>([])

  useEffect(() => {
    const mockLogs = [
      "SYSTEM: Booting SnapSecure audit engine...",
      "AUTHENTICATOR: External STS Role token assumed.",
      "IAM_ANALYZER: Reviewing root account MFA configuration...",
      "IAM_ANALYZER: CRITICAL - Root MFA is not enabled!",
      "IAM_ANALYZER: WARNING - Wildcard permission '*' found on policy.",
      "SG_AUDITOR: Checking ingress security group rules...",
      "SG_AUDITOR: WARN - Ingress port 22 exposed to 0.0.0.0/0",
      "PORT_SCANNER: Scanning active TCP listening sockets...",
      "PORT_SCANNER: Open database port found: 5432 (PostgreSQL)",
      "SSL_ANALYZER: Checking ACM certificates trust chain...",
      "SSL_ANALYZER: WARNING - Self-signed certificate on internal host.",
      "VULN_SCANNER: Interfacing with Trivy local image scanning...",
      "VULN_SCANNER: 2 High CVSS vulnerabilities found in container base.",
      "POSTURE_ENGINE: Deducting score: 4 Critical/High alerts (-32)",
      "POSTURE_ENGINE: Current Workspace Security Index: 68/100"
    ]

    let currentLogIndex = 0
    const interval = setInterval(() => {
      setLogs((prev) => [...prev, mockLogs[currentLogIndex]].slice(-5))
      currentLogIndex = (currentLogIndex + 1) % mockLogs.length
    }, 2000)
    
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative min-h-screen bg-transparent text-zentra-text flex flex-col font-sans overflow-hidden">
      
      {/* Decorative Blur Backgrounds */}
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-[#E68F74]/5 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-blue-500/5 blur-[150px] pointer-events-none"></div>

      {/* Navigation Header */}
      <header className="sticky top-0 z-50 bg-white/40 backdrop-blur-md border-b border-zentra-border">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/">
              <Logo className="scale-75 origin-left" />
            </Link>
          </div>
          <div className="hidden md:flex items-center gap-8">
          </div>
          <div className="flex gap-3 items-center">
            <Link href="/login" className="px-4 py-2 text-sm font-bold text-zentra-muted hover:text-zentra-text transition-soft">
              Log In
            </Link>
            <Link href="/register" className="px-5 py-2.5 text-sm font-bold text-white bg-[#E68F74] hover:bg-[#D2795E] rounded-full transition-soft shadow-soft">
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-grow flex flex-col py-16 px-6 relative z-10 max-w-7xl mx-auto w-full space-y-24">
        
        <div className="grid lg:grid-cols-12 gap-16 items-center w-full">
          {/* Left Text Column */}
          <div className="lg:col-span-6 text-left space-y-8 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white border border-zentra-border text-[#E68F74] text-xs font-semibold tracking-wide">
              <span className="w-2 h-2 rounded-full bg-[#E68F74] animate-pulse"></span>
              Enterprise Cloud Posture Platform
            </div>
            
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-zentra-text leading-tight font-display">
              Continuous security <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E68F74] to-[#f0a991]">
                monitoring & cost
              </span>
              <br />
              optimization
            </h1>
            
            <p className="text-base text-zentra-muted leading-relaxed max-w-lg">
              Verify compliance, run automated scan modules, track asset inventories, and optimize monthly AWS billing under a single glassmorphic security console.
            </p>
            
            <div className="flex flex-wrap gap-4 pt-2">
              <Link href="/register" className="px-8 py-4 text-sm font-bold text-white bg-zentra-blue hover:bg-zentra-accent rounded-full transition-soft shadow-lg">
                Deploy Console Free
              </Link>
              <Link href="/pricing" className="px-8 py-4 text-sm font-bold text-zentra-muted bg-white border border-zentra-border hover:border-[#E68F74]/30 rounded-full transition-soft hover:bg-gray-50">
                View Pricing Tiers
              </Link>
            </div>
          </div>

          {/* Right Visual Dashboard Mockup Column */}
          <div id="preview" className="lg:col-span-6 relative animate-fade-in-up delay-200">
            <div className="glass-panel p-6 rounded-3xl relative z-10 space-y-6">
              
              <div className="flex items-center justify-between border-b border-zentra-border pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white border border-zentra-border flex items-center justify-center">
                    <svg className="w-5 h-5 text-[#E68F74]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-zentra-text text-sm">Security Posture Core</h3>
                    <p className="text-xs text-zentra-muted">STS Assuming Live Audit Role</p>
                  </div>
                </div>
                <span className="px-3 py-1 bg-[#E68F74]/10 border border-[#E68F74]/20 text-[#E68F74] rounded-full text-xs font-bold animate-pulse">Scanning</span>
              </div>

              {/* Gauge & Metrics visual */}
              <div className="flex items-center justify-between gap-6 py-2">
                <div className="relative w-36 h-36 flex items-center justify-center mx-auto scale-90">
                  <SecurityCore3D />
                </div>

                <div className="space-y-3 flex-1">
                  <div className="bg-white border border-zentra-border p-3.5 rounded-2xl hover:border-white/10 transition-soft">
                    <p className="text-[10px] text-zentra-muted mb-1 font-bold uppercase tracking-wider">AWS Infrastructure Stance</p>
                    <p className="text-2xl font-bold text-zentra-text">68<span className="text-xs text-zentra-muted font-normal"> / 100</span></p>
                  </div>
                  <div className="bg-white border border-zentra-border p-3.5 rounded-2xl hover:border-white/10 transition-soft">
                    <p className="text-[10px] text-zentra-muted mb-1 font-bold uppercase tracking-wider">Open Critical Risks</p>
                    <p className="text-2xl font-bold text-[#E68F74]">2 Alerts</p>
                  </div>
                </div>
              </div>

              {/* Simulated Live Logging Widget */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 font-mono text-[11px] text-slate-300 min-h-[140px] flex flex-col justify-end space-y-2 overflow-hidden relative">
                {logs.map((log, idx) => {
                  let colorClass = "text-slate-400"
                  if (log.includes("CRITICAL")) colorClass = "text-red-400 font-semibold"
                  if (log.includes("WARN")) colorClass = "text-[#E68F74]"
                  if (log.includes("SUCCESS") || log.includes("Index")) colorClass = "text-green-400 font-semibold"
                  return (
                    <div key={idx} className={`${colorClass} flex items-start gap-2 truncate`}>
                      <span className="text-[#E68F74]/50 font-bold select-none">&rsaquo;</span>
                      <span className="truncate">{log}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Security Modules Showcase */}
        <section id="modules" className="space-y-12 pt-12 border-t border-zentra-border">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight font-display text-zentra-text">
              Enterprise security audit modules
            </h2>
            <p className="text-sm text-zentra-muted">
              SnapSecure implements deep inspection routines across credentials, network paths, public endpoints, ciphers, and application layers.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            
            {/* Module 1 */}
            <div className="glass-card p-6 rounded-3xl space-y-4 hover:border-[#E68F74]/50 hover:shadow-card transition-soft">
              <div className="w-12 h-12 bg-purple-50 border border-purple-100 text-purple-600 rounded-2xl flex items-center justify-center">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
              </div>
              <h3 className="text-lg font-bold text-zentra-text">IAM Analyzer</h3>
              <p className="text-xs text-zentra-muted leading-relaxed">
                Checks Root Account MFA enforcement, active API access keys, stale credentials, user MFA configuration, and overly permissive wildcard (*) authorization blocks.
              </p>
            </div>

            {/* Module 2 */}
            <div className="glass-card p-6 rounded-3xl space-y-4 hover:border-[#E68F74]/50 hover:shadow-card transition-soft">
              <div className="w-12 h-12 bg-blue-50 border border-blue-100 text-blue-600 rounded-2xl flex items-center justify-center">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
              </div>
              <h3 className="text-lg font-bold text-zentra-text">Security Group Auditor</h3>
              <p className="text-xs text-zentra-muted leading-relaxed">
                Inspects VPC security groups for open SSH port 22, public RDP port 3389, public database exposures (Postgres/MySQL), and overly broad ingress CIDR configurations.
              </p>
            </div>

            {/* Module 3 */}
            <div className="glass-card p-6 rounded-3xl space-y-4 hover:border-[#E68F74]/50 hover:shadow-card transition-soft">
              <div className="w-12 h-12 bg-green-50 border border-green-100 text-green-600 rounded-2xl flex items-center justify-center">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" /></svg>
              </div>
              <h3 className="text-lg font-bold text-zentra-text">Port Scanner & SSL Analyzer</h3>
              <p className="text-xs text-zentra-muted leading-relaxed">
                Runs TCP port scans (22, 80, 443, 3306, etc.) and validates ACM certificate expirations, self-signed signatures, weak ciphers, and deprecated TLS 1.0/1.1 protocols.
              </p>
            </div>

          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="border-t border-zentra-border bg-white/50 py-8 text-center text-xs text-zentra-muted relative z-10 mt-auto">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between">
          <div className="font-bold text-zentra-text flex items-center gap-2">
             <Logo className="scale-[0.6] origin-left" />
          </div>
          <div className="mt-4 md:mt-0 font-medium">
             &copy; {new Date().getFullYear()} SnapSecure Security Inc. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
