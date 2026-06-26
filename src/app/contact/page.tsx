"use client"

import Link from "next/link"
import React, { useState } from "react"

export default function ContactPage() {
  const [nameInput, setNameInput] = useState("")
  const [emailInput, setEmailInput] = useState("")
  const [msgInput, setMsgInput] = useState("")
  const [sendingState, setSendingState] = useState<"idle" | "encrypting" | "sent">("idle")
  const [encryptLogs, setEncryptLogs] = useState<string[]>([])

  const handleSendSecureMessage = (e: React.FormEvent) => {
    e.preventDefault()
    setSendingState("encrypting")
    setEncryptLogs([])
    
    const logsList = [
      "CIPHER: Initializing entropy pool and key integrity...",
      "CIPHER: Generating transient RSA-4096 session parameters...",
      "CIPHER: Encrypting message envelope with AES-256-GCM...",
      "NETWORK: Opening secure SSH tunnel socket to snapweaz.com...",
      "NETWORK: Handshaking with Secure Key exchange gateway...",
      "NETWORK: Transmitting encrypted payload stream (SHA-256 verified)...",
      "SYSTEM: Transmission completed. Connection closed securely."
    ]
    
    let currentIdx = 0
    const timer = setInterval(() => {
      if (currentIdx < logsList.length) {
        setEncryptLogs(prev => [...prev, logsList[currentIdx]])
        currentIdx++
      } else {
        clearInterval(timer)
        setSendingState("sent")
        setNameInput("")
        setEmailInput("")
        setMsgInput("")
      }
    }, 500)
  }

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
            <Link href="/work" className="text-sm font-semibold text-zentra-muted hover:text-zentra-text transition-soft">Work</Link>
            <Link href="/contact" className="text-sm font-bold text-zentra-blue transition-soft">Contact</Link>
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

      {/* Contact Content */}
      <main className="max-w-7xl mx-auto px-6 py-24 relative z-10 w-full flex-grow animate-fade-in-up">
        <div className="grid lg:grid-cols-12 gap-12 items-start">
          
          <div className="lg:col-span-5 space-y-6">
            <div className="text-xs font-bold uppercase tracking-widest text-zentra-blue">
              Secure Node Handshake
            </div>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-zentra-text">
              Establish a <br />
              <span className="text-zentra-blue font-normal italic">secure channel</span>
            </h2>
            <p className="text-sm text-zentra-muted leading-relaxed font-medium">
              Have security requirements or want to set up an enterprise SnapSecure CSPM dashboard for your AWS architecture? Send an encrypted transmission to our ops console.
            </p>

            <div className="space-y-3 font-medium text-sm text-zentra-muted pt-4">
              <p className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-zentra-blue"></span>
                EMAIL: secure-ops@snapsecure.com
              </p>
              <p className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-zentra-blue"></span>
                PGP KEY: F3A1 9D7C C850 E1E2 4E7A
              </p>
              <p className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-zentra-green"></span>
                SYS STATE: DECRYPTOR AGENTS ONLINE
              </p>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="bg-white border border-zentra-border p-8 rounded-3xl shadow-card relative overflow-hidden">

              <div className="flex justify-between items-center border-b border-zentra-border pb-4 mb-6 z-10 relative">
                <span className="text-xs font-bold text-zentra-muted uppercase tracking-widest">SECURE_COMMUNICATION_VAULT</span>
                <span className="px-3 py-1 bg-zentra-green/10 text-[10px] font-bold text-zentra-green rounded-full uppercase tracking-widest flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-zentra-green rounded-full animate-pulse"></span>
                  Tunnel Open
                </span>
              </div>

              {sendingState === "idle" && (
                <form onSubmit={handleSendSecureMessage} className="space-y-4 z-10 relative">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-zentra-text uppercase tracking-widest mb-2">Agent Identity</label>
                      <input 
                        type="text" 
                        required
                        value={nameInput}
                        onChange={(e) => setNameInput(e.target.value)}
                        placeholder="e.g. John Doe" 
                        className="w-full px-4 py-3 rounded-xl border border-zentra-border focus:border-zentra-blue focus:ring-2 focus:ring-zentra-blue/20 outline-none transition-soft text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-zentra-text uppercase tracking-widest mb-2">Secure Email Node</label>
                      <input 
                        type="email" 
                        required
                        value={emailInput}
                        onChange={(e) => setEmailInput(e.target.value)}
                        placeholder="e.g. agent@domain.com" 
                        className="w-full px-4 py-3 rounded-xl border border-zentra-border focus:border-zentra-blue focus:ring-2 focus:ring-zentra-blue/20 outline-none transition-soft text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zentra-text uppercase tracking-widest mb-2">Payload message</label>
                    <textarea 
                      rows={4}
                      required
                      value={msgInput}
                      onChange={(e) => setMsgInput(e.target.value)}
                      placeholder="Input message data to encrypt..."
                      className="w-full px-4 py-3 rounded-xl border border-zentra-border focus:border-zentra-blue focus:ring-2 focus:ring-zentra-blue/20 outline-none transition-soft text-sm font-mono"
                    ></textarea>
                  </div>

                  <button 
                    type="submit" 
                    className="w-full py-3.5 mt-2 rounded-full bg-zentra-blue hover:bg-zentra-accent text-zentra-text font-bold text-sm transition-soft shadow-soft flex items-center justify-center"
                  >
                    Transmit Encrypted Payload
                  </button>
                </form>
              )}

              {sendingState === "encrypting" && (
                <div className="bg-zentra-bg border border-zentra-border rounded-2xl p-5 font-mono text-xs text-zentra-muted min-h-[200px] flex flex-col justify-end space-y-2 z-10 relative">
                  {encryptLogs.map((log, idx) => {
                    let colorClass = "text-zentra-muted"
                    if (log.includes("completed")) colorClass = "text-zentra-green font-bold"
                    else if (log.includes("CIPHER")) colorClass = "text-zentra-blue"
                    return (
                      <div key={idx} className={`${colorClass} flex items-start gap-2`}>
                        <span className="text-zentra-muted font-bold select-none">&gt;</span>
                        <span>{log}</span>
                      </div>
                    )
                  })}
                  <div className="flex items-center gap-2 text-zentra-blue font-bold">
                    <span>&gt;</span>
                    <span className="w-1.5 h-3.5 bg-zentra-blue animate-pulse"></span>
                  </div>
                </div>
              )}

              {sendingState === "sent" && (
                <div className="text-center py-12 space-y-4 z-10 relative animate-fade-in-up">
                  <div className="w-16 h-16 bg-zentra-green/10 text-zentra-green rounded-full flex items-center justify-center text-2xl mx-auto shadow-soft mb-6">
                    ✔
                  </div>
                  <h4 className="text-xl font-bold text-zentra-text">Transmission Completed</h4>
                  <p className="text-sm text-zentra-muted max-w-sm mx-auto leading-relaxed">
                    Your payload was successfully encrypted and transmitted to the secure ops channel. We will establish direct contact shortly.
                  </p>
                  <button 
                    onClick={() => setSendingState("idle")} 
                    className="px-6 py-2.5 mt-4 rounded-full border border-zentra-border hover:border-zentra-blue hover:text-zentra-blue text-sm text-zentra-text font-bold transition-soft"
                  >
                    Open New Session
                  </button>
                </div>
              )}
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
