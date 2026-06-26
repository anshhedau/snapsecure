"use client"

import Link from "next/link"
import React from "react"

export default function AboutPage() {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-zentra-bg text-zentra-text font-sans">

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
            <Link href="/about" className="text-sm font-bold text-zentra-blue transition-soft">About</Link>
            <Link href="/services" className="text-sm font-semibold text-zentra-muted hover:text-zentra-text transition-soft">Services</Link>
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

      {/* About Content */}
      <main className="max-w-7xl mx-auto px-6 py-24 relative z-10 w-full animate-fade-in-up">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <div className="text-xs font-bold uppercase tracking-widest text-zentra-blue">
              Secure Posture Defense
            </div>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-zentra-text leading-tight">
              Multi-layered <br />
              <span className="text-zentra-blue font-normal italic">deputy defense</span> <br />
              for modern workspaces
            </h2>
            <p className="text-base text-zentra-muted leading-relaxed max-w-lg">
              At SnapSecure, we believe that security is not a single gateway, but a continuous, multi-layered posture. Our automated scanner engine inspects cloud environments at every layer, from network routing tables to Identity and Access Management policies, validating security parameters against strict SOC2 and ISO27001 requirements.
            </p>
            <p className="text-base text-zentra-muted leading-relaxed max-w-lg">
              We establish cryptographically verified connection channels to scan target infrastructures without requiring persistent access keys, guaranteeing zero vulnerability footprints.
            </p>
          </div>

          {/* Clean 3D Isometric Stack representing security layers */}
          <div className="relative h-[300px] flex items-center justify-center">
            <div className="isometric-stack w-64 h-64">
              {/* Bottom Layer: VPC Network */}
              <div className="isometric-layer isometric-layer-1 p-5 flex flex-col justify-between bg-white border border-zentra-border rounded-2xl shadow-card">
                <span className="text-[10px] font-bold text-zentra-muted uppercase tracking-widest">LAYER_01 // NETWORK</span>
                <div className="border-2 border-dashed border-zentra-blue/20 rounded p-2 text-xs font-semibold text-zentra-blue text-center bg-zentra-blue/5">
                  VPC ROUTING ACTIVE
                </div>
              </div>

              {/* Middle Layer: IAM Roles */}
              <div className="isometric-layer isometric-layer-2 p-5 flex flex-col justify-between bg-white border border-zentra-border rounded-2xl shadow-card">
                <span className="text-[10px] font-bold text-zentra-orange uppercase tracking-widest">LAYER_02 // ACCESS</span>
                <div className="flex items-center gap-2 text-xs font-bold text-zentra-text">
                  <span className="text-lg">🔐</span> DEPUTY CHECKED
                </div>
              </div>

              {/* Top Layer: Scan Engine */}
              <div className="isometric-layer isometric-layer-3 p-5 flex flex-col justify-between bg-white border border-zentra-border rounded-2xl shadow-card">
                <span className="text-[10px] font-bold text-zentra-green uppercase tracking-widest">LAYER_03 // CSPM SCANNER</span>
                <div className="text-sm font-bold text-zentra-text flex items-center gap-2">
                  <span className="w-2 h-2 bg-zentra-green rounded-full animate-pulse"></span>
                  POSTURE INDEX: 78%
                </div>
              </div>
            </div>
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
