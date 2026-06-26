"use client"

import Link from "next/link"
import React from "react"
import { Logo } from "@/components/Logo"

export default function PricingPage() {
  return (
    <div className="relative min-h-screen bg-transparent text-zentra-text flex flex-col font-sans overflow-hidden">
      
      {/* Mesh Glow Backgrounds */}
      <div className="absolute top-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-[#E68F74]/5 blur-[130px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-blue-500/5 blur-[150px] pointer-events-none"></div>

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

      {/* Core Pricing Plans */}
      <main className="flex-grow flex flex-col py-16 px-6 relative z-10 max-w-6xl mx-auto w-full space-y-16">
        
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white border border-zentra-border text-[#E68F74] text-xs font-semibold tracking-wide">
            Flexible Deployment Options
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight font-display text-zentra-text">
            Clear, transparent pricing
          </h1>
          <p className="text-sm text-zentra-muted max-w-lg mx-auto">
            Choose the subscription tier that matches your cloud infrastructure footprint. Scale security audits up dynamically.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 items-stretch pt-6">
          
          {/* Developer Plan */}
          <div className="glass-card p-8 rounded-3xl flex flex-col justify-between space-y-8 hover:border-[#E68F74]/50 hover:shadow-card transition-soft">
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-zentra-text">Developer</h2>
              <p className="text-xs text-zentra-muted leading-relaxed">
                Ideal for individuals, research labs, or early-stage startups validating their initial AWS network credentials.
              </p>
              <div className="pt-2">
                <span className="text-4xl font-extrabold text-zentra-text">$0</span>
                <span className="text-xs text-zentra-muted font-medium"> / month</span>
              </div>
              <ul className="space-y-3 pt-6 border-t border-zentra-border text-xs text-zentra-text font-semibold leading-relaxed">
                <li className="flex items-center gap-2.5">
                  <svg className="w-4 h-4 text-green-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" /></svg>
                  1 AWS Account Target
                </li>
                <li className="flex items-center gap-2.5">
                  <svg className="w-4 h-4 text-green-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" /></svg>
                  Manual Security Scanning
                </li>
                <li className="flex items-center gap-2.5">
                  <svg className="w-4 h-4 text-green-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" /></svg>
                  Basic Port Scans (22, 80, 443)
                </li>
                <li className="flex items-center gap-2.5 text-zentra-muted/40 line-through">
                  Compliance Framework Mappings
                </li>
                <li className="flex items-center gap-2.5 text-zentra-muted/40 line-through">
                  Slack Webhook Notifications
                </li>
              </ul>
            </div>
            <Link href="/register" className="w-full py-3.5 text-center text-xs font-bold text-zentra-muted bg-white hover:bg-gray-50 rounded-full border border-zentra-border transition-soft">
              Deploy Free Tier
            </Link>
          </div>

          {/* Scale Plan (Popular) */}
          <div className="glass-card p-8 rounded-3xl flex flex-col justify-between space-y-8 border-[#E68F74]/40 relative shadow-soft hover:border-[#E68F74]/60 transition-soft">
            <div className="absolute top-4 right-4 px-2.5 py-0.5 bg-[#E68F74]/15 border border-[#E68F74]/30 rounded-lg text-[9px] text-[#E68F74] font-bold uppercase tracking-wider">
              Popular
            </div>
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-zentra-text">Scale (Pro)</h2>
              <p className="text-xs text-zentra-muted leading-relaxed">
                Best for growing engineering teams requiring continuous automated audits and Slack alerting across workspaces.
              </p>
              <div className="pt-2">
                <span className="text-4xl font-extrabold text-zentra-text">$79</span>
                <span className="text-xs text-zentra-muted font-medium"> / month</span>
              </div>
              <ul className="space-y-3 pt-6 border-t border-zentra-border text-xs text-zentra-text font-semibold leading-relaxed">
                <li className="flex items-center gap-2.5">
                  <svg className="w-4 h-4 text-[#E68F74] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" /></svg>
                  5 AWS Accounts Connected
                </li>
                <li className="flex items-center gap-2.5">
                  <svg className="w-4 h-4 text-[#E68F74] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" /></svg>
                  Daily Automated Auditing
                </li>
                <li className="flex items-center gap-2.5">
                  <svg className="w-4 h-4 text-[#E68F74] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" /></svg>
                  Full Scan Suite (IAM, SGs, Ports, SSL)
                </li>
                <li className="flex items-center gap-2.5">
                  <svg className="w-4 h-4 text-[#E68F74] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" /></svg>
                  CIS & SOC2 Compliance Maps
                </li>
                <li className="flex items-center gap-2.5">
                  <svg className="w-4 h-4 text-[#E68F74] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" /></svg>
                  SES Email & Slack Webhook integration
                </li>
              </ul>
            </div>
            <Link href="/register" className="w-full py-3.5 text-center text-xs font-bold text-white bg-[#E68F74] hover:bg-[#D2795E] rounded-full transition-soft shadow-soft">
              Start 14-Day Free Trial
            </Link>
          </div>

          {/* Enterprise Plan */}
          <div className="glass-card p-8 rounded-3xl flex flex-col justify-between space-y-8 hover:border-[#E68F74]/50 hover:shadow-card transition-soft">
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-zentra-text">Enterprise</h2>
              <p className="text-xs text-zentra-muted leading-relaxed">
                For organizations managing large-scale, multi-region AWS environments needing Trivy scans and custom compliance.
              </p>
              <div className="pt-2">
                <span className="text-4xl font-extrabold text-zentra-text">Custom</span>
                <span className="text-xs text-zentra-muted font-medium"> / contact us</span>
              </div>
              <ul className="space-y-3 pt-6 border-t border-zentra-border text-xs text-zentra-text font-semibold leading-relaxed">
                <li className="flex items-center gap-2.5">
                  <svg className="w-4 h-4 text-green-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" /></svg>
                  Unlimited AWS Account Targets
                </li>
                <li className="flex items-center gap-2.5">
                  <svg className="w-4 h-4 text-green-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" /></svg>
                  Hourly Scan Capability
                </li>
                <li className="flex items-center gap-2.5">
                  <svg className="w-4 h-4 text-green-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" /></svg>
                  All Scanners + Trivy container images
                </li>
                <li className="flex items-center gap-2.5">
                  <svg className="w-4 h-4 text-green-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" /></svg>
                  NIST, ISO, SOC2, CIS Frameworks
                </li>
                <li className="flex items-center gap-2.5">
                  <svg className="w-4 h-4 text-green-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" /></svg>
                  Dedicated compliance support engineer
                </li>
              </ul>
            </div>
            <Link href="/register?plan=enterprise" className="w-full py-3.5 text-center text-xs font-bold text-zentra-muted bg-white hover:bg-gray-50 rounded-full border border-zentra-border transition-soft">
              Talk to Sales
            </Link>
          </div>

        </div>
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
