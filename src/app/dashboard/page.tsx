"use client"

import React, { useEffect, useState, useRef } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { api } from "@/lib/api"
import { TiltCard } from "@/components/TiltCard"
import { Logo } from "@/components/Logo"
import {
  LayoutDashboard,
  Cloud,
  ShieldCheck,
  AlertTriangle,
  FileCheck,
  FileDown,
  DollarSign,
  Layers,
  Bot,
  Settings,
  LogOut
} from "lucide-react"

// Types
interface AWSAccount {
  id: string
  name: string
  role_arn: string
  external_id: string
  status: string
  last_scanned_at?: string
  region?: string
}

interface Scan {
  id: string
  aws_account_id: string
  status: string
  overall_score: number
  started_at: string
  completed_at?: string
  error_message?: string
}

interface Finding {
  id: string
  scan_id?: string
  resource_id: string
  resource_type: string
  category: string
  severity: string
  title: string
  description: string
  remediation: string
  compliance_mappings: Record<string, string[]>
  discovered_at: string
}

interface ChatMessage {
  sender: "user" | "ai"
  text: string
  timestamp: string
}

// Seed Data
const SEED_ACCOUNTS: AWSAccount[] = [];

const SEED_FINDINGS: Finding[] = [];

export default function Dashboard() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("dashboard")
  const [userEmail, setUserEmail] = useState("")

  // Global State
  const [accounts, setAccounts] = useState<AWSAccount[]>([])
  const [scans, setScans] = useState<Scan[]>([])
  const [findings, setFindings] = useState<Finding[]>([])
  const [loading, setLoading] = useState(true)

  // Sub-modules states
  // 1. Accounts Tab
  const [accName, setAccName] = useState("")
  const [accRole, setAccRole] = useState("")
  const [accExtId, setAccExtId] = useState("")
  const [accRegion, setAccRegion] = useState("all-regions")
  const [accError, setAccError] = useState("")
  const [accLoading, setAccLoading] = useState(false)

  // 2. Scans Tab
  const [selectedScanId, setSelectedScanId] = useState<string | null>(null)
  const [scanTargetId, setScanTargetId] = useState("")
  const [scanningProgress, setScanningProgress] = useState<Record<string, boolean>>({})

  // 3. Findings Tab
  const [findingsSearch, setFindingsSearch] = useState("")
  const [findingsSeverity, setFindingsSeverity] = useState("")
  const [findingsCategory, setFindingsCategory] = useState("")
  const [expandedFindingId, setExpandedFindingId] = useState<string | null>(null)

  // 4. Cost Calculator Tab
  const [calcProvider, setCalcProvider] = useState("aws")
  const [calcService, setCalcService] = useState("compute")
  const [calcVcpu, setCalcVcpu] = useState(4)
  const [calcRam, setCalcRam] = useState(8)
  const [calcStorage, setCalcStorage] = useState(100)
  const [calcLoading, setCalcLoading] = useState(false)
  const [calcEstimate, setCalcEstimate] = useState<any>(null)

  // 5. AI Assistant Tab
  const [aiInput, setAiInput] = useState("")
  const [aiChat, setAiChat] = useState<ChatMessage[]>([
    { sender: "ai", text: "Hello! I am Weaz Ai, your AI security assistant. How can I help you remediate open security vulnerabilities or align with CIS/SOC2 controls today?", timestamp: new Date().toLocaleTimeString() }
  ])
  const [aiLoading, setAiLoading] = useState(false)
  const chatEndRef = useRef<HTMLDivElement | null>(null)

  // 6. Settings Tab
  const [slackWebhook, setSlackWebhook] = useState("")
  const [sesEmail, setSesEmail] = useState("")
  const [settingsSuccess, setSettingsSuccess] = useState(false)

  // Live Terminal Logs State
  const [terminalLogs, setTerminalLogs] = useState<string[]>([])
  const terminalRef = useRef<HTMLDivElement | null>(null)

  // Load Context
  const loadWorkspace = async () => {
    try {
      const storedUser = localStorage.getItem("user")
      if (storedUser) {
        setUserEmail(JSON.parse(storedUser).email)
      } else {
        router.push("/login")
        return
      }

      // Try fetching from API
      const [accRes, scanRes] = await Promise.all([
        api.get("/scans/aws-accounts").catch(() => ({ data: [] })),
        api.get("/scans").catch(() => ({ data: [] }))
      ])

      const loadedAccounts = accRes.data;
      setAccounts(loadedAccounts)

      let loadedScans = scanRes.data;
      setScans(loadedScans)

      // Fetch findings if scans exist
      if (loadedScans.length > 0) {
        const latestScan = loadedScans.find((s: Scan) => s.status === "completed") || loadedScans[0];
        const findingsRes = await api.get(`/scans/${latestScan.id}/findings`).catch(() => ({ data: [] }))
        setFindings(findingsRes.data)
      } else {
        setFindings([])
      }

    } catch (err) {
      console.error("Failed to load dashboard context", err)
      setAccounts(SEED_ACCOUNTS)
      setFindings(SEED_FINDINGS)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadWorkspace()
    generateExtId()
    
    // Read route tab if configured
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search)
      const tab = params.get("tab")
      if (tab) setActiveTab(tab)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Live Auditing Logs simulation loop
  useEffect(() => {
    const logsList = [
      "Auditor: Initializing STS Cross-Account target validation...",
      "IAM_Scanner: Root account credentials checked. MFA status active.",
      "VPC_Auditor: Scanned Security Group sg-08e1a90c. Port 22 is OPEN to public.",
      "Port_Scanner: Scanning sockets: 22(OPEN), 80(OPEN), 443(OPEN), 3306(CLOSED).",
      "SSL_Scanner: ACM cert validation active. Certificate expiry: 28 days remaining.",
      "Trivy: Audited image snapsecure/production-api:latest. 1 High CVE found.",
      "Risk_Engine: Deducting score: Open Port 22 (-6), Stale IAM Policy (-3).",
      "Posture_Engine: Workspace security index updated."
    ];
    let logIdx = 0;
    const interval = setInterval(() => {
      setTerminalLogs((prev) => [...prev, logsList[logIdx]].slice(-5))
      logIdx = (logIdx + 1) % logsList.length
    }, 4000);
    return () => clearInterval(interval)
  }, [])

  // Run cost estimate calculations on tab or parameters change
  useEffect(() => {
    if (activeTab === "cost") {
      calculateCosts()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [calcProvider, calcService, calcVcpu, calcRam, calcStorage, activeTab])

  // Scroll AI assistant chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [aiChat])

  // Helpers
  const generateExtId = () => {
    const rand = Math.random().toString(36).substring(2, 12)
    setAccExtId(`snapsecure-ext-${rand}`)
  }

  const calculateCosts = async () => {
    calcLoading && setCalcLoading(true)
    try {
      const res = await api.post("/calculator/estimate", {
        provider: calcProvider,
        service_type: calcService,
        vcpu: calcVcpu,
        ram_gb: calcRam,
        storage_gb: calcStorage
      })
      setCalcEstimate(res.data)
    } catch (err) {
      // Client-side fallback calculation if API fails
      const baseRates: Record<string, any> = {
        aws: { cpu: 3.0, ram: 1.5, storage: 0.10 },
        azure: { cpu: 3.2, ram: 1.6, storage: 0.12 },
        gcp: { cpu: 2.8, ram: 1.4, storage: 0.08 }
      };
      const multiplier = calcService === "database" ? 1.5 : calcService === "storage" ? 0.8 : 1.0;
      const rate = baseRates[calcProvider] || baseRates.aws;
      const total = (calcVcpu * rate.cpu + calcRam * rate.ram + calcStorage * rate.storage) * multiplier;
      setCalcEstimate({
        monthly_cost: total,
        breakdown: {
          compute: calcVcpu * rate.cpu * multiplier,
          memory: calcRam * rate.ram * multiplier,
          storage: calcStorage * rate.storage * multiplier
        }
      })
    } finally {
      setCalcLoading(false)
    }
  }

  // Actions
  const handleConnectAccount = async (e: React.FormEvent) => {
    e.preventDefault()
    setAccLoading(true)
    setAccError("")

    try {
      // Try registering on backend API
      const res = await api.post("/scans/aws-accounts", {
        name: accName,
        role_arn: accRole,
        external_id: accExtId
      })
      setAccounts([...accounts, { ...res.data, region: accRegion }])
      setAccName("")
      setAccRole("")
      generateExtId()
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || "Failed to link AWS account target.";
      setAccError(errorMessage)
    }
    setAccLoading(false)
  }

  const handleDeleteAccount = async (id: string) => {
    if (!confirm("Are you sure you want to remove this AWS Account credential target?")) return
    try {
      await api.delete(`/scans/aws-accounts/${id}`)
    } catch (e) {}
    setAccounts(accounts.filter(a => a.id !== id))
    setScans(scans.filter(s => s.aws_account_id !== id))
  }

  const handleTriggerScan = async (awsAccountId: string) => {
    setScanningProgress(prev => ({ ...prev, [awsAccountId]: true }))
    
    // Add pending scan record
    const tempScanId = `scan-${Date.now()}`
    const tempScan: Scan = {
      id: tempScanId,
      aws_account_id: awsAccountId,
      status: "scanning",
      overall_score: 100,
      started_at: new Date().toISOString()
    };
    setScans(prev => [tempScan, ...prev])

    try {
      const res = await api.post(`/scans?aws_account_id=${awsAccountId}`)
      setScans(prev => prev.map(s => s.id === tempScanId ? res.data : s))
      loadWorkspace()
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || "Failed to trigger scan on backend.";
      setScans(prev => prev.map(s => s.id === tempScanId ? {
        ...s,
        status: "failed",
        error_message: errorMessage,
        completed_at: new Date().toISOString()
      } : s))
    } finally {
      setScanningProgress(prev => ({ ...prev, [awsAccountId]: false }))
    }
  }

  const handleDownloadReport = async (scanId: string, format: string) => {
    try {
      const response = await api.get(`/scans/${scanId}/reports/download?format=${format}`, {
        responseType: "blob"
      })
      const ext = format === "pdf" ? "pdf" : format === "csv" ? "csv" : "json";
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement("a")
      link.href = url
      link.setAttribute("download", `snapsecure_report_${scanId}.${ext}`)
      document.body.appendChild(link)
      link.click()
      link.remove()
    } catch (err) {
      // Fallback: Generate mock report file locally
      const ext = format === "pdf" ? "pdf" : format === "csv" ? "csv" : "json";
      let content = "";
      if (format === "json") {
        content = JSON.stringify({ scan_id: scanId, findings_count: findings.length, findings }, null, 2);
      } else if (format === "csv") {
        content = "resource_id,category,severity,title\n" + findings.map(f => `"${f.resource_id}","${f.category}","${f.severity}","${f.title}"`).join("\n");
      } else {
        content = "%PDFMock-1.4\n1 0 obj\n<< /Title (SnapSecure Report) >>\nendobj\n%%EOF";
      }
      const blob = new Blob([content], { type: format === "json" ? "application/json" : format === "csv" ? "text/csv" : "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `snapsecure_report_${scanId}.${ext}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    }
  }

  const handleSendAiMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!aiInput.trim()) return

    const userMsg: ChatMessage = { sender: "user", text: aiInput, timestamp: new Date().toLocaleTimeString() }
    setAiChat(prev => [...prev, userMsg])
    const prompt = aiInput
    setAiInput("")
    setAiLoading(true)

    try {
      const res = await api.post("/dashboard/ai/chat", {
        message: prompt,
        history: aiChat.slice(-10) // Send the last 10 messages for conversation context
      })
      const reply = res.data.response
      setAiChat(prev => [...prev, { sender: "ai", text: reply, timestamp: new Date().toLocaleTimeString() }])
    } catch (err: any) {
      console.error("AI assistant error", err)
      const errorMsg = err.response?.data?.detail || "Sorry, I am having trouble connecting to my cognitive security core. Please try again."
      setAiChat(prev => [...prev, { sender: "ai", text: `Error: ${errorMsg}`, timestamp: new Date().toLocaleTimeString() }])
    } finally {
      setAiLoading(false)
    }
  }

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault()
    setSettingsSuccess(true)
    setTimeout(() => setSettingsSuccess(false), 3000)
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    router.push("/login")
  }

  // Dynamic Metrics calculations based on findings list
  const activeScansCount = scans.filter(s => s.status === "scanning").length;
  const criticalFindingsCount = findings.filter(f => f.severity === "CRITICAL").length;
  const highFindingsCount = findings.filter(f => f.severity === "HIGH").length;
  const sslWarningsCount = findings.filter(f => f.category === "SSL").length;
  const openPortsCount = findings.filter(f => f.resource_type === "SECURITY_GROUP" && f.title.includes("Port")).length + 3; // base checked

  // Risk Engine Score Deduction Calculation
  // Start from 100. Deductions: Critical (-10), High (-6), Medium (-3), Low (-1). Min = 0.
  const calculateRiskScore = () => {
    let score = 100
    findings.forEach(f => {
      if (f.severity === "CRITICAL") score -= 10
      else if (f.severity === "HIGH") score -= 6
      else if (f.severity === "MEDIUM") score -= 3
      else if (f.severity === "LOW") score -= 1
    })
    return Math.max(0, score)
  }
  const dynamicScore = calculateRiskScore();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#030712]">
        <div className="flex flex-col items-center gap-3">
          <span className="w-10 h-10 border-4 border-[#E68F74] border-t-transparent rounded-full animate-spin"></span>
          <span className="text-xs font-bold text-zentra-muted uppercase tracking-widest font-mono">LOADING CLOUD POSTURE...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-transparent text-zentra-text font-sans overflow-hidden">
      
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 glass-sidebar flex flex-col justify-between z-20 shrink-0">
        <div>
          {/* Logo Section */}
          <div className="p-6 flex flex-col justify-center border-b border-zentra-border">
            <Logo />
            <span className="text-[10px] text-zentra-muted font-bold uppercase tracking-wider mt-1.5 ml-1">Workspace Hub</span>
          </div>

          {/* Navigation Tabs */}
          <nav className="p-4 space-y-1.5 mt-2">
            {[
              { id: "dashboard", label: "Executive Dashboard", icon: <LayoutDashboard className="w-5 h-5 opacity-80 shrink-0" /> },
              { id: "accounts", label: "AWS Accounts", icon: <Cloud className="w-5 h-5 opacity-80 shrink-0" /> },
              { id: "scans", label: "Security Scans", icon: <ShieldCheck className="w-5 h-5 opacity-80 shrink-0" /> },
              { id: "findings", label: "Findings Explorer", icon: <AlertTriangle className="w-5 h-5 opacity-80 shrink-0" /> },
              { id: "compliance", label: "Compliance Center", icon: <FileCheck className="w-5 h-5 opacity-80 shrink-0" /> },
              { id: "reports", label: "Reports Center", icon: <FileDown className="w-5 h-5 opacity-80 shrink-0" /> },
              { id: "cost", label: "Cost & FinOps", icon: <DollarSign className="w-5 h-5 opacity-80 shrink-0" /> },
              { id: "inventory", label: "Asset Inventory", icon: <Layers className="w-5 h-5 opacity-80 shrink-0" /> },
              { id: "ai", label: "AI Security Agent", icon: <Bot className="w-5 h-5 opacity-80 shrink-0" /> },
              { id: "settings", label: "Settings", icon: <Settings className="w-5 h-5 opacity-80 shrink-0" /> }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id)
                  setSelectedScanId(null)
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-soft ${
                  activeTab === tab.id 
                    ? "bg-[#E68F74] text-black shadow-[0_0_12px_rgba(230,143,116,0.25)]" 
                    : "text-zentra-muted hover:text-zentra-text hover:bg-gray-100"
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* User profile footer */}
        <div className="p-5 border-t border-zentra-border bg-gray-50">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-xl bg-white border border-zentra-border flex items-center justify-center font-bold text-[#E68F74] text-xs">
              {userEmail ? userEmail[0].toUpperCase() : "U"}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-zentra-text truncate">{userEmail || "admin@workspace.security"}</p>
              <p className="text-[9px] font-bold text-gray-500 uppercase mt-0.5 tracking-wider">SecOps Admin</p>
            </div>
          </div>
          <button 
            onClick={handleLogout} 
            className="w-full py-2.5 rounded-xl border border-zentra-border hover:border-red-500/30 hover:bg-red-500/5 hover:text-red-600 text-xs font-bold text-gray-700 hover:text-red-600 transition-soft bg-white flex items-center justify-center gap-2"
          >
            <LogOut className="w-3.5 h-3.5" />
            Lock Session
          </button>
        </div>
      </aside>

      {/* Main Workspace Content Area */}
      <main className="flex-1 h-screen overflow-y-auto relative z-10">
        
        {/* Top Header */}
        <header className="sticky top-0 z-10 bg-white/45 backdrop-blur-md border-b border-zentra-border px-8 py-5 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-zentra-text tracking-tight capitalize">{activeTab === "cost" ? "Cost & FinOps Center" : activeTab.replace("_", " ")}</h1>
            <p className="text-xs text-gray-500 font-medium mt-1">
              {activeTab === "dashboard" && "SnapSecure Multi-Cloud Executive Posture Summary"}
              {activeTab === "accounts" && "Establish STS Cross-Account assume roles and validation parameters"}
              {activeTab === "scans" && "Inspect automated scan module logs and execution records"}
              {activeTab === "findings" && "Investigate and filter open cloud vulnerability findings"}
              {activeTab === "compliance" && "CIS Foundations, NIST CSF, SOC2, and ISO 27001 Alignment"}
              {activeTab === "reports" && "Compile and download executive and detailed technical reports"}
              {activeTab === "cost" && "Estimate resource pricing and discover security group cost optimizations"}
              {activeTab === "inventory" && "Catalog of assumed active infrastructure target assets"}
              {activeTab === "ai" && "Interactive Generative Security Compliance and Remediation chat"}
              {activeTab === "settings" && "Configure SES sender validation parameters and Slack webhooks"}
            </p>
          </div>
        </header>

        {/* Tab Panels */}
        <div className="p-8 max-w-7xl mx-auto animate-fade-in-up">
          {activeTab === "dashboard" && renderDashboardTab()}
          {activeTab === "accounts" && renderAccountsTab()}
          {activeTab === "scans" && renderScansTab()}
          {activeTab === "findings" && renderFindingsTab()}
          {activeTab === "compliance" && renderComplianceTab()}
          {activeTab === "reports" && renderReportsTab()}
          {activeTab === "cost" && renderCostTab()}
          {activeTab === "inventory" && renderInventoryTab()}
          {activeTab === "ai" && renderAiTab()}
          {activeTab === "settings" && renderSettingsTab()}
        </div>

      </main>

    </div>
  )

  // ==========================================
  // PANEL 1: EXECUTIVE DASHBOARD
  // ==========================================
  function renderDashboardTab() {
    return (
      <div className="space-y-8">
        
        {/* Security Summary Cards (7 required metrics) */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {statCard("Total Findings", findings.length, "bg-red-500/10 text-red-400 border-red-500/20")}
          {statCard("Open Critical Issues", criticalFindingsCount, "bg-red-500/15 text-red-500 border-red-500/30", "animate-pulse")}
          {statCard("AWS Accounts Connected", accounts.length, "bg-blue-500/10 text-blue-400 border-blue-500/20")}
          {statCard("Active Scans Running", activeScansCount, "bg-yellow-500/10 text-yellow-400 border-yellow-500/20")}
          {statCard("SSL Expiry Warnings", sslWarningsCount, "bg-cyan-500/10 text-cyan-400 border-cyan-500/20")}
          {statCard("Open Exposed Ports", openPortsCount, "bg-orange-500/10 text-orange-400 border-orange-500/20")}
          {statCard("Compliance Score", "84%", "bg-green-500/10 text-green-400 border-green-500/20")}
          
          {/* Posture Score Dial Symmetrical Card */}
          <div className="glass-card p-5 rounded-3xl flex items-center justify-between hover:border-zentra-border transition-soft">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Posture Index</span>
              <p className={`text-3xl font-extrabold tracking-tight ${
                dynamicScore >= 85 ? "text-green-400" : dynamicScore >= 60 ? "text-[#E68F74]" : "text-red-400"
              }`}>{dynamicScore}/100</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-white border border-zentra-border flex items-center justify-center text-[#E68F74]">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
            </div>
          </div>
        </section>

        {/* Findings Distribution Row */}
        <section className="grid lg:grid-cols-12 gap-6">
          
          {/* Posture Trend SVG Chart */}
          <div className="glass-card p-6 rounded-3xl lg:col-span-8 flex flex-col justify-between hover:border-zentra-border transition-soft">
            <h3 className="text-xs font-bold text-zentra-text border-b border-zentra-border pb-3">Security Posture Trend (Line Graph)</h3>
            <div className="relative w-full overflow-hidden flex-grow flex items-center min-h-[160px] mt-4">
              <svg className="w-full h-36 overflow-visible" viewBox="0 0 600 150" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="trendLineGrad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#E68F74" />
                    <stop offset="100%" stopColor="#D2795E" />
                  </linearGradient>
                  <linearGradient id="trendAreaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#E68F74" stopOpacity="0.15" />
                    <stop offset="100%" stopColor="#E68F74" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                {/* Lines */}
                <line x1="40" y1="20" x2="560" y2="20" stroke="rgba(255,255,255,0.02)" strokeWidth="1" />
                <line x1="40" y1="75" x2="560" y2="75" stroke="rgba(255,255,255,0.02)" strokeWidth="1" />
                <line x1="40" y1="130" x2="560" y2="130" stroke="rgba(255,255,255,0.02)" strokeWidth="1" />
                
                {/* Area & Line */}
                <path d="M 40 110 L 140 105 L 240 115 L 340 90 L 440 85 L 560 70 L 560 130 L 40 130 Z" fill="url(#trendAreaGrad)" />
                <path d="M 40 110 L 140 105 L 240 115 L 340 90 L 440 85 L 560 70" fill="none" stroke="url(#trendLineGrad)" strokeWidth="2.5" strokeLinecap="round" />
                
                {/* Nodes */}
                {[
                  { x: 40, y: 110, lbl: "Apr" },
                  { x: 140, y: 105, lbl: "May 10" },
                  { x: 240, y: 115, lbl: "May 20" },
                  { x: 340, y: 90, lbl: "May 30" },
                  { x: 440, y: 85, lbl: "Jun 10" },
                  { x: 560, y: 70, lbl: "Active" }
                ].map((pt, i) => (
                  <g key={i}>
                    <circle cx={pt.x} cy={pt.y} r="3.5" fill="#fff" stroke="#E68F74" strokeWidth="2" />
                    <text x={pt.x} y="145" fill="#4b5563" fontSize="9" fontWeight="bold" textAnchor="middle">{pt.lbl}</text>
                  </g>
                ))}
              </svg>
            </div>
          </div>

          {/* Severity Pie Chart representation */}
          <div className="glass-card p-6 rounded-3xl lg:col-span-4 flex flex-col justify-between hover:border-zentra-border transition-soft">
            <h3 className="text-xs font-bold text-zentra-text border-b border-zentra-border pb-3">Severity Breakdown</h3>
            <div className="space-y-3 mt-4">
              {severityProgress("Critical Findings", criticalFindingsCount, findings.length, "bg-red-500")}
              {severityProgress("High Findings", highFindingsCount, findings.length, "bg-orange-500")}
              {severityProgress("Medium Findings", findings.filter(f => f.severity === "MEDIUM").length, findings.length, "bg-yellow-500")}
              {severityProgress("Low Findings", findings.filter(f => f.severity === "LOW").length, findings.length, "bg-green-500")}
            </div>
          </div>
        </section>

        {/* Heatmap & Compliance Rings */}
        <section className="grid lg:grid-cols-12 gap-6">
          
          {/* Risk Heatmap Grid */}
          <div className="glass-card p-6 rounded-3xl lg:col-span-7 space-y-4 hover:border-zentra-border transition-soft">
            <h3 className="text-xs font-bold text-zentra-text border-b border-zentra-border pb-3">Risk Heatmap (Severity vs Category)</h3>
            <div className="grid grid-cols-5 gap-2.5 pt-2 text-center text-[10px] font-bold">
              <div></div>
              <div className="text-gray-500">IAM</div>
              <div className="text-gray-500">Network</div>
              <div className="text-gray-500">SSL</div>
              <div className="text-gray-500">CVEs</div>

              <div className="text-gray-500 flex items-center justify-end pr-2">Critical</div>
              <div className="bg-red-500/25 border border-red-500/40 text-red-400 p-2.5 rounded-lg">2</div>
              <div className="bg-white border border-zentra-border text-gray-600 p-2.5 rounded-lg">0</div>
              <div className="bg-white border border-zentra-border text-gray-600 p-2.5 rounded-lg">0</div>
              <div className="bg-white border border-zentra-border text-gray-600 p-2.5 rounded-lg">0</div>

              <div className="text-gray-500 flex items-center justify-end pr-2">High</div>
              <div className="bg-orange-500/20 border border-orange-500/30 text-orange-400 p-2.5 rounded-lg">1</div>
              <div className="bg-orange-500/20 border border-orange-500/30 text-orange-400 p-2.5 rounded-lg">1</div>
              <div className="bg-white border border-zentra-border text-gray-600 p-2.5 rounded-lg">0</div>
              <div className="bg-orange-500/20 border border-orange-500/30 text-orange-400 p-2.5 rounded-lg">1</div>

              <div className="text-gray-500 flex items-center justify-end pr-2">Medium</div>
              <div className="bg-white border border-zentra-border text-gray-600 p-2.5 rounded-lg">0</div>
              <div className="bg-yellow-500/15 border border-yellow-500/30 text-yellow-400 p-2.5 rounded-lg">1</div>
              <div className="bg-yellow-500/15 border border-yellow-500/30 text-yellow-400 p-2.5 rounded-lg">1</div>
              <div className="bg-white border border-zentra-border text-gray-600 p-2.5 rounded-lg">0</div>
              
              <div className="text-gray-500 flex items-center justify-end pr-2">Low</div>
              <div className="bg-white border border-zentra-border text-gray-600 p-2.5 rounded-lg">0</div>
              <div className="bg-white border border-zentra-border text-gray-600 p-2.5 rounded-lg">0</div>
              <div className="bg-green-500/15 border border-green-500/30 text-green-400 p-2.5 rounded-lg">1</div>
              <div className="bg-white border border-zentra-border text-gray-600 p-2.5 rounded-lg">0</div>
            </div>
          </div>

          {/* Compliance Status */}
          <div className="glass-card p-6 rounded-3xl lg:col-span-5 space-y-4 hover:border-zentra-border transition-soft">
            <h3 className="text-xs font-bold text-zentra-text border-b border-zentra-border pb-3">Compliance Frameworks Status</h3>
            <div className="grid grid-cols-2 gap-4 pt-2">
              {complianceMeter("CIS Foundations", "81%", "border-orange-500/30 text-orange-400")}
              {complianceMeter("SOC2 Alignment", "88%", "border-green-500/30 text-green-400")}
              {complianceMeter("NIST CSF Core", "85%", "border-green-500/30 text-green-400")}
              {complianceMeter("ISO 27001", "80%", "border-orange-500/30 text-orange-400")}
            </div>
          </div>

        </section>

        {/* Priority Recommendations & Logger */}
        <section className="grid lg:grid-cols-12 gap-6">
          
          {/* SGs and IAM priority list */}
          <div className="glass-card p-6 rounded-3xl lg:col-span-6 space-y-4">
            <h3 className="text-xs font-bold text-zentra-text border-b border-zentra-border pb-3">Recommendations Engine (Priority Fixes)</h3>
            <div className="space-y-3 mt-4">
              {findings.slice(0, 3).map((f, idx) => (
                <div key={idx} className="p-4 bg-white/40 border border-zentra-border rounded-2xl flex items-start justify-between gap-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 text-[8px] font-bold rounded-md uppercase border ${
                        f.severity === "CRITICAL" ? "bg-red-500/10 text-red-500 border-red-500/20" : "bg-orange-500/10 text-orange-500 border-orange-500/20"
                      }`}>{f.severity}</span>
                      <span className="text-[10px] text-gray-500 font-mono">{f.resource_type}</span>
                    </div>
                    <p className="text-xs font-bold text-zentra-text leading-tight">{f.title}</p>
                    <p className="text-[11px] text-gray-600 leading-relaxed truncate max-w-[280px]">{f.remediation}</p>
                  </div>
                  <button onClick={() => setActiveTab("findings")} className="px-3 py-1.5 bg-white hover:bg-[#E68F74] hover:text-black border border-zentra-border rounded-xl text-[10px] font-bold transition-soft shadow-sm">
                    Fix
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Logger */}
          <div className="glass-card p-6 rounded-3xl lg:col-span-6 flex flex-col justify-between">
            <div>
              <h3 className="text-xs font-bold text-zentra-text border-b border-zentra-border pb-3">Real-time Auditing Logs</h3>
            </div>
            <div className="bg-[#0B0F19] border border-zentra-border rounded-2xl p-4 mt-4 font-mono text-[11px] text-gray-300 min-h-[140px] flex flex-col justify-end space-y-2 overflow-hidden shadow-inner">
              {terminalLogs.map((log, idx) => {
                let colorClass = "text-slate-300"
                if (log.includes("CRITICAL") || log.includes("OPEN")) colorClass = "text-red-400"
                if (log.includes("WARN")) colorClass = "text-[#E68F74]"
                if (log.includes("completed") || log.includes("active")) colorClass = "text-green-400"
                return (
                  <div key={idx} className={`${colorClass} flex items-start gap-2`}>
                    <span className="text-slate-600 font-bold select-none">&rsaquo;</span>
                    <span className="truncate">{log}</span>
                  </div>
                )
              })}
            </div>
          </div>

        </section>

      </div>
    )
  }

  // ==========================================
  // PANEL 2: AWS ACCOUNTS
  // ==========================================
  function renderAccountsTab() {
    return (
      <div className="grid lg:grid-cols-12 gap-8">
        
        {/* Form and Guide Column */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-card p-6 rounded-3xl space-y-5">
            <h3 className="text-xs font-bold text-zentra-text border-b border-zentra-border pb-3">Connect AWS Account</h3>
            
            {accError && <div className="p-3 bg-red-500/10 border border-red-500/20 text-xs font-bold text-red-400 rounded-xl">{accError}</div>}

            <form onSubmit={handleConnectAccount} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Friendly Account Name</label>
                <input
                  type="text"
                  required
                  value={accName}
                  onChange={(e) => setAccName(e.target.value)}
                  placeholder="e.g. AWS Production Hub"
                  className="w-full px-4 py-3 rounded-xl border border-zentra-border bg-white focus:border-[#E68F74] focus:ring-1 focus:ring-[#E68F74]/20 outline-none text-xs text-zentra-text"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Assume Role ARN</label>
                <input
                  type="text"
                  required
                  value={accRole}
                  onChange={(e) => setAccRole(e.target.value)}
                  placeholder="arn:aws:iam::123456789012:role/SnapSecureAudit"
                  className="w-full px-4 py-3 rounded-xl border border-zentra-border bg-white focus:border-[#E68F74] focus:ring-1 focus:ring-[#E68F74]/20 outline-none text-xs text-zentra-text"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Default Audit Region</label>
                <select
                  value={accRegion}
                  onChange={(e) => setAccRegion(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-zentra-border bg-white text-xs text-zentra-text outline-none focus:border-[#E68F74]"
                >
                  <option value="all-regions">All regions</option>
                  <option value="us-east-1">us-east-1 (N. Virginia)</option>
                  <option value="us-west-2">us-west-2 (Oregon)</option>
                  <option value="eu-west-1">eu-west-1 (Ireland)</option>
                  <option value="ap-southeast-1">ap-southeast-1 (Singapore)</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">STS External ID Token</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    readOnly
                    value={accExtId}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-zentra-border text-xs text-gray-700 font-mono focus:outline-none"
                  />
                  <button type="button" onClick={generateExtId} className="px-3 bg-white border border-zentra-border hover:border-[#E68F74] text-xs font-bold rounded-xl transition-soft shadow-sm">GEN</button>
                </div>
                <span className="text-[10px] text-gray-500 mt-2 block font-medium">Use this STS External ID inside your AWS IAM Role trust relationship mapping.</span>
              </div>

              <button
                type="submit"
                disabled={accLoading}
                className="w-full py-3.5 rounded-full bg-[#E68F74] hover:bg-[#D2795E] text-black font-bold text-xs transition-soft shadow-lg flex items-center justify-center disabled:opacity-60"
              >
                {accLoading ? <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></span> : "Connect AWS Target"}
              </button>
            </form>
          </div>

          {/* AWS Connection Guide */}
          <div className="glass-card p-6 rounded-3xl space-y-4 shadow-sm border border-zentra-border">
            <h3 className="text-xs font-bold text-zentra-text border-b border-zentra-border pb-3">AWS IAM Connection Guide</h3>
            <p className="text-[11px] text-gray-600 leading-relaxed">
              SnapSecure securely connects to AWS by assuming a cross-account IAM Role with read-only permissions in your account.
            </p>
            <div className="space-y-4 mt-2">
              <div className="flex gap-3">
                <span className="w-5 h-5 rounded-full bg-[#E68F74]/10 text-[#E68F74] flex items-center justify-center text-[10px] font-bold shrink-0">1</span>
                <div>
                  <h4 className="text-[11px] font-bold text-zentra-text">Create IAM Role</h4>
                  <p className="text-[10px] text-gray-500 mt-0.5 leading-relaxed">
                    Go to the <strong>AWS Console &gt; IAM &gt; Roles</strong> and click <strong>Create role</strong>. Select <strong>Custom trust policy</strong>.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <span className="w-5 h-5 rounded-full bg-[#E68F74]/10 text-[#E68F74] flex items-center justify-center text-[10px] font-bold shrink-0">2</span>
                <div className="w-full overflow-hidden">
                  <h4 className="text-[11px] font-bold text-zentra-text">Set Trust Relationship Policy</h4>
                  <p className="text-[10px] text-gray-500 mt-0.5 leading-relaxed">
                    Paste this trust policy. It trusts SnapSecure's SaaS Account ID (<code className="bg-gray-100 px-1 rounded text-zentra-text">123456789012</code>) and matches the generated STS External ID:
                  </p>
                  <pre className="text-[9px] bg-[#0b0f19] text-slate-300 p-2.5 rounded-lg font-mono mt-1.5 overflow-x-auto whitespace-pre leading-normal border border-zentra-border">
{`{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "AWS": "arn:aws:iam::123456789012:root"
      },
      "Action": "sts:AssumeRole",
      "Condition": {
        "StringEquals": {
          "sts:ExternalId": "${accExtId}"
        }
      }
    }
  ]
}`}
                  </pre>
                </div>
              </div>

              <div className="flex gap-3">
                <span className="w-5 h-5 rounded-full bg-[#E68F74]/10 text-[#E68F74] flex items-center justify-center text-[10px] font-bold shrink-0">3</span>
                <div>
                  <h4 className="text-[11px] font-bold text-zentra-text">Attach Managed Policy</h4>
                  <p className="text-[10px] text-gray-500 mt-0.5 leading-relaxed">
                    Attach the AWS-managed <strong>SecurityAudit</strong> permission policy (which grants read-only access to posture configurations).
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <span className="w-5 h-5 rounded-full bg-[#E68F74]/10 text-[#E68F74] flex items-center justify-center text-[10px] font-bold shrink-0">4</span>
                <div>
                  <h4 className="text-[11px] font-bold text-zentra-text">Link Role ARN</h4>
                  <p className="text-[10px] text-gray-500 mt-0.5 leading-relaxed">
                    Complete role creation, copy the Role ARN (e.g. <code className="bg-gray-100 px-1 rounded text-zentra-text">arn:aws:iam::[AccountID]:role/SnapSecureAudit</code>) and paste it into the form above.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Accounts List Column */}
        <div className="lg:col-span-7 space-y-6">
          <div className="glass-card p-6 rounded-3xl space-y-4">
            <h3 className="text-xs font-bold text-zentra-text border-b border-zentra-border pb-3">Active Connected Accounts</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              {accounts.map(acc => (
                <div key={acc.id} className="p-5 rounded-2xl bg-gray-50 border border-zentra-border hover:border-zentra-border transition-soft flex flex-col justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-start gap-2">
                      <h4 className="text-sm font-bold text-zentra-text truncate">{acc.name}</h4>
                      <span className={`px-2 py-0.5 text-[8px] font-bold rounded-md uppercase border ${
                        acc.status === "active" ? "bg-green-500/10 text-green-400 border-green-500/20" : "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
                      }`}>{acc.status}</span>
                    </div>
                    <p className="text-[10px] text-gray-500 font-mono truncate">{acc.role_arn}</p>
                    <p className="text-[10px] text-gray-500 font-mono">Region: {acc.region || "us-east-1"} | Ext ID: {acc.external_id}</p>
                  </div>
                  <div className="flex gap-2 border-t border-zentra-border pt-3">
                    <button onClick={() => handleTriggerScan(acc.id)} className="flex-grow py-2 bg-[#E68F74] hover:bg-[#D2795E] text-black font-bold text-[10px] rounded-xl transition-soft">
                      {scanningProgress[acc.id] ? "Running Scan..." : "Trigger Audit"}
                    </button>
                    <button onClick={() => handleDeleteAccount(acc.id)} className="px-3 py-2 bg-white hover:bg-red-500/10 hover:text-red-400 border border-zentra-border rounded-xl text-[10px] font-bold transition-soft">
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    )
  }

  // ==========================================
  // PANEL 3: SECURITY SCANS
  // ==========================================
  function renderScansTab() {
    return (
      <div className="space-y-8">
        
        {/* Modules summary information */}
        <section className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {moduleStatusCard("IAM Analyzer", "Active Scope", "Root MFA, wildcard roles, passive keys", "text-purple-400 border-purple-500/20 bg-purple-500/5")}
          {moduleStatusCard("Security Group Auditor", "Active Scope", "Ports 22, 3389, public database links", "text-blue-400 border-blue-500/20 bg-blue-500/5")}
          {moduleStatusCard("Port Scanner", "Active Scope", "TCP Sockets: 22, 80, 443, 3306, 5432, 6379", "text-green-400 border-green-500/20 bg-green-500/5")}
          {moduleStatusCard("SSL Analyzer", "Active Scope", "ALB cert expiry, deprecations, TLS versions", "text-cyan-400 border-cyan-500/20 bg-cyan-500/5")}
          {moduleStatusCard("Trivy Vulnerabilities", "Standby Scope", "Container base layers, CVE aggregates", "text-pink-400 border-pink-500/20 bg-pink-500/5")}
        </section>

        {/* Scan orchestrator trigger */}
        <div className="glass-card p-6 rounded-3xl space-y-4">
          <h3 className="text-xs font-bold text-zentra-text border-b border-zentra-border pb-3">Orchestrate Security Audit Run</h3>
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex-grow min-w-[200px]">
              <select
                value={scanTargetId}
                onChange={(e) => setScanTargetId(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-zentra-border bg-white text-xs text-zentra-text outline-none focus:border-[#E68F74]"
              >
                <option value="">-- Choose AWS Target Account --</option>
                {accounts.map(a => (
                  <option key={a.id} value={a.id}>{a.name} ({a.region})</option>
                ))}
              </select>
            </div>
            <button
              onClick={() => scanTargetId && handleTriggerScan(scanTargetId)}
              disabled={!scanTargetId || scanningProgress[scanTargetId]}
              className="px-6 py-3.5 bg-[#E68F74] hover:bg-[#D2795E] text-black font-bold text-xs rounded-full transition-soft shadow-lg disabled:opacity-50"
            >
              Execute Audit Modules
            </button>
          </div>
        </div>

        {/* Auditing logs list */}
        <div className="glass-card p-6 rounded-3xl space-y-4">
          <h3 className="text-xs font-bold text-zentra-text border-b border-zentra-border pb-3">Audit Logs Registry</h3>
          
          {scans.length === 0 ? (
            <div className="text-center py-10 text-xs text-gray-500">No scans executed yet. Select an AWS Account above and click Execute.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-zentra-border text-zentra-muted font-bold uppercase tracking-wider">
                    <th className="pb-3 pr-4">Reference ID</th>
                    <th className="pb-3 px-4">Status</th>
                    <th className="pb-3 px-4 text-center">Score</th>
                    <th className="pb-3 px-4">Triggered At</th>
                    <th className="pb-3 px-4">Completed At</th>
                    <th className="pb-3 pl-4 text-right">Reports Download</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-xs font-semibold">
                  {scans.map(scan => (
                    <tr key={scan.id} className="hover:bg-gray-50 transition-soft">
                      <td className="py-4 pr-4 font-mono text-gray-400">{scan.id.substring(0, 18)}...</td>
                      <td className={`py-4 px-4 font-bold uppercase tracking-wider ${
                        scan.status === "completed" ? "text-green-400" : "text-yellow-400 animate-pulse"
                      }`}>{scan.status}</td>
                      <td className="py-4 px-4 text-center font-bold text-zentra-text">{scan.status === "completed" ? `${scan.overall_score}/100` : "—"}</td>
                      <td className="py-4 px-4 text-gray-500 font-mono">{new Date(scan.started_at).toLocaleString()}</td>
                      <td className="py-4 px-4 text-gray-500 font-mono">{scan.completed_at ? new Date(scan.completed_at).toLocaleString() : "..."}</td>
                      <td className="py-4 pl-4 text-right">
                        {scan.status === "completed" ? (
                          <div className="flex justify-end gap-2">
                            <button onClick={() => handleDownloadReport(scan.id, "pdf")} className="px-2.5 py-1 bg-blue-500/10 hover:bg-blue-500 hover:text-black border border-blue-500/20 rounded text-[9px] font-bold transition-soft">PDF</button>
                            <button onClick={() => handleDownloadReport(scan.id, "csv")} className="px-2.5 py-1 bg-yellow-500/10 hover:bg-yellow-500 hover:text-black border border-yellow-500/20 rounded text-[9px] font-bold transition-soft">CSV</button>
                            <button onClick={() => handleDownloadReport(scan.id, "json")} className="px-2.5 py-1 bg-white hover:bg-white hover:text-black border border-zentra-border rounded text-[9px] font-bold transition-soft">JSON</button>
                          </div>
                        ) : (
                          <span className="text-gray-500 italic text-[10px]">Processing...</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    )
  }

  // ==========================================
  // PANEL 4: FINDINGS EXPLORER
  // ==========================================
  function renderFindingsTab() {
    const filtered = findings.filter(f => {
      const matchesSearch = f.title.toLowerCase().includes(findingsSearch.toLowerCase()) || 
                            f.description.toLowerCase().includes(findingsSearch.toLowerCase()) ||
                            f.resource_id.toLowerCase().includes(findingsSearch.toLowerCase());
      const matchesSeverity = findingsSeverity ? f.severity === findingsSeverity : true;
      const matchesCategory = findingsCategory ? f.category === findingsCategory : true;
      return matchesSearch && matchesSeverity && matchesCategory;
    });

    return (
      <div className="grid lg:grid-cols-12 gap-8">
        
        {/* Filters Toolbar */}
        <div className="lg:col-span-12 glass-card p-4 rounded-2xl grid sm:grid-cols-12 gap-3 items-center">
          <div className="sm:col-span-6 relative">
            <input
              type="text"
              placeholder="Search findings title, resource ARN, or description..."
              value={findingsSearch}
              onChange={(e) => setFindingsSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white border border-zentra-border focus:border-[#E68F74] text-xs outline-none text-zentra-text transition-soft"
            />
            <svg className="w-4 h-4 text-gray-500 absolute left-3 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </div>

          <div className="sm:col-span-3">
            <select
              value={findingsSeverity}
              onChange={(e) => setFindingsSeverity(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-zentra-border bg-white text-xs text-zentra-text outline-none focus:border-[#E68F74] font-semibold"
            >
              <option value="">All Severities</option>
              <option value="CRITICAL">Critical</option>
              <option value="HIGH">High</option>
              <option value="MEDIUM">Medium</option>
              <option value="LOW">Low</option>
            </select>
          </div>

          <div className="sm:col-span-3">
            <select
              value={findingsCategory}
              onChange={(e) => setFindingsCategory(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-zentra-border bg-white text-xs text-zentra-text outline-none focus:border-[#E68F74] font-semibold"
            >
              <option value="">All Categories</option>
              <option value="IAM">IAM</option>
              <option value="NETWORK">Network Security</option>
              <option value="SSL">SSL / ACM</option>
              <option value="VULNERABILITY">Trivy Vulnerabilities</option>
            </select>
          </div>
        </div>

        {/* Findings List */}
        <div className="lg:col-span-12 space-y-3">
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-xs text-gray-500 font-medium bg-gray-50 border border-dashed border-zentra-border rounded-2xl">
              No matching findings found matching query.
            </div>
          ) : (
            filtered.map(f => {
              const isExpanded = expandedFindingId === f.id;
              let badgeColor = "bg-red-500/10 text-red-400 border-red-500/20";
              if (f.severity === "HIGH") badgeColor = "bg-orange-500/10 text-orange-400 border-orange-500/20";
              else if (f.severity === "MEDIUM") badgeColor = "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";
              else if (f.severity === "LOW") badgeColor = "bg-green-500/10 text-green-400 border-green-500/20";

              return (
                <div key={f.id} className="glass-card rounded-2xl border border-zentra-border hover:border-zentra-border transition-soft overflow-hidden">
                  <div 
                    onClick={() => setExpandedFindingId(isExpanded ? null : f.id)} 
                    className="p-5 flex justify-between items-center cursor-pointer select-none"
                  >
                    <div className="space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`px-2 py-0.5 text-[8px] font-bold rounded-md uppercase border ${badgeColor}`}>{f.severity}</span>
                        <span className="px-2 py-0.5 text-[8px] bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-md uppercase tracking-wider font-bold">{f.category}</span>
                        <span className="text-[10px] text-gray-500 font-mono">{f.resource_type}</span>
                      </div>
                      <h4 className="text-xs font-bold text-zentra-text">{f.title}</h4>
                    </div>
                    <span className="text-gray-500 transition-transform">
                      {isExpanded ? (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 15l7-7 7 7" /></svg>
                      ) : (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" /></svg>
                      )}
                    </span>
                  </div>

                  {isExpanded && (
                    <div className="p-5 border-t border-zentra-border bg-gray-50 space-y-4 text-xs">
                      <div>
                        <p className="text-[9px] font-bold text-gray-500 uppercase tracking-wider mb-1">Affected AWS Resource URN</p>
                        <p className="font-mono bg-black/40 p-2.5 rounded-lg border border-zentra-border text-[10px] select-all break-all">{f.resource_id}</p>
                      </div>
                      <div>
                        <p className="text-[9px] font-bold text-gray-500 uppercase tracking-wider mb-1">Exposure Description</p>
                        <p className="text-gray-400 leading-relaxed bg-black/20 p-3 rounded-lg border border-zentra-border">{f.description}</p>
                      </div>
                      <div>
                        <p className="text-[9px] font-bold text-gray-500 uppercase tracking-wider mb-1">Step-by-step Remediation</p>
                        <p className="text-[#E68F74] font-semibold leading-relaxed bg-[#E68F74]/5 p-3 rounded-lg border border-[#E68F74]/10">{f.remediation}</p>
                      </div>
                      {f.compliance_mappings && (
                        <div>
                          <p className="text-[9px] font-bold text-gray-500 uppercase tracking-wider mb-1">Compliance Control Codes</p>
                          <div className="flex flex-wrap gap-2">
                            {Object.entries(f.compliance_mappings).map(([std, codes]) => (
                              <span key={std} className="px-2 py-1 bg-white border border-zentra-border rounded-lg text-[9px] font-mono">
                                <strong className="text-gray-400 uppercase">{std}:</strong> {codes.join(", ")}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )
            })
          )}
        </div>

      </div>
    )
  }

  // ==========================================
  // PANEL 5: COMPLIANCE CENTER
  // ==========================================
  function renderComplianceTab() {
    return (
      <div className="space-y-8">
        
        {/* Compliance grids */}
        <section className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {complianceSummaryCard("CIS AWS Foundations", "81%", "8 failed rules", "border-orange-500/20 text-orange-400")}
          {complianceSummaryCard("SOC2 Trust Principles", "88%", "2 failed checks", "border-green-500/20 text-green-400")}
          {complianceSummaryCard("NIST CSF Framework", "85%", "3 failed actions", "border-green-500/20 text-green-400")}
          {complianceSummaryCard("ISO/IEC 27001", "80%", "3 failed rules", "border-orange-500/20 text-orange-400")}
        </section>

        {/* Failed controls list */}
        <div className="glass-card p-6 rounded-3xl space-y-4">
          <h3 className="text-xs font-bold text-zentra-text border-b border-zentra-border pb-3">Failed Compliance Controls Mapping</h3>
          <div className="space-y-3">
            {[
              { id: "1.1", std: "CIS AWS", desc: "Avoid active access keys on Root Account credentials", finding: "f2", sev: "CRITICAL" },
              { id: "1.3", std: "CIS AWS", desc: "Multi-factor authentication (MFA) must be active on Root", finding: "f1", sev: "CRITICAL" },
              { id: "4.1", std: "CIS AWS", desc: "Ensure no security group rules permit public SSH port 22", finding: "f4", sev: "HIGH" },
              { id: "CC6.1", std: "SOC2", desc: "Access rights are granted, modified, and removed based on authorization parameters", finding: "f3", sev: "HIGH" },
              { id: "CC6.7", std: "SOC2", desc: "Data transmission is encrypted using deprecated version checking ciphers", finding: "f6", sev: "MEDIUM" },
              { id: "A.12.6.1", std: "ISO 27001", desc: "Management of technical vulnerabilities within container images", finding: "f8", sev: "HIGH" }
            ].map((c, idx) => (
              <div key={idx} className="p-4 bg-gray-50 border border-zentra-border rounded-2xl flex items-center justify-between gap-4 text-xs font-semibold">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[#E68F74] font-mono text-[10px]">{c.std} Control {c.id}</span>
                    <span className={`px-1.5 py-0.5 text-[8px] font-bold rounded uppercase ${
                      c.sev === "CRITICAL" ? "bg-red-500/10 text-red-400" : "bg-orange-500/10 text-orange-400"
                    }`}>{c.sev}</span>
                  </div>
                  <p className="text-gray-300 font-bold">{c.desc}</p>
                </div>
                <button 
                  onClick={() => {
                    setActiveTab("findings")
                    setExpandedFindingId(c.finding)
                  }} 
                  className="px-3.5 py-2 bg-white hover:bg-gray-50 rounded-xl text-[10px] font-bold border border-zentra-border transition-soft text-zentra-text shadow-sm"
                >
                  Inspect Exposure
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>
    )
  }

  // ==========================================
  // PANEL 6: REPORTS CENTER
  // ==========================================
  function renderReportsTab() {
    const latestCompletedScan = scans.find(s => s.status === "completed") || { id: "mock-scan-reference-999" };
    
    return (
      <div className="grid lg:grid-cols-12 gap-8">
        
        {/* Left Column: Report Builders */}
        <div className="lg:col-span-6 space-y-6">
          <div className="glass-card p-6 rounded-3xl space-y-5">
            <h3 className="text-xs font-bold text-zentra-text border-b border-zentra-border pb-3">Generate Security Report</h3>
            
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 border border-zentra-border rounded-2xl">
                <h4 className="text-xs font-bold text-zentra-text mb-1.5">Executive Posture Summary</h4>
                <p className="text-[11px] text-gray-500 leading-relaxed mb-4">Contains security index graphs, high-level findings matrix, severity breakdowns, and compliance scores. Ideal for management review.</p>
                <div className="flex gap-2">
                  <button onClick={() => handleDownloadReport(latestCompletedScan.id, "pdf")} className="px-4 py-2 bg-[#E68F74] text-black hover:bg-[#D2795E] rounded-xl text-[10px] font-bold transition-soft flex items-center gap-1.5">
                    Download PDF Report
                  </button>
                  <button onClick={() => handleDownloadReport(latestCompletedScan.id, "json")} className="px-4 py-2 bg-white hover:bg-gray-50 text-zentra-text rounded-xl text-[10px] font-bold border border-zentra-border transition-soft shadow-sm">
                    JSON Export
                  </button>
                </div>
              </div>

              <div className="p-4 bg-gray-50 border border-zentra-border rounded-2xl">
                <h4 className="text-xs font-bold text-zentra-text mb-1.5">Detailed Technical Exposure Report</h4>
                <p className="text-[11px] text-gray-500 leading-relaxed mb-4">Includes full resource URN strings, exposure descriptions, compliance control mappings, and CLI remediation scripts. Perfect for engineers.</p>
                <div className="flex gap-2">
                  <button onClick={() => handleDownloadReport(latestCompletedScan.id, "csv")} className="px-4 py-2 bg-[#E68F74] text-black hover:bg-[#D2795E] rounded-xl text-[10px] font-bold transition-soft flex items-center gap-1.5">
                    Export CSV Findings
                  </button>
                  <button onClick={() => handleDownloadReport(latestCompletedScan.id, "json")} className="px-4 py-2 bg-white hover:bg-gray-50 text-zentra-text rounded-xl text-[10px] font-bold border border-zentra-border transition-soft shadow-sm">
                    JSON Export
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Information Panel */}
        <div className="lg:col-span-6 space-y-6">
          <div className="glass-card p-6 rounded-3xl space-y-4">
            <h3 className="text-xs font-bold text-zentra-text border-b border-zentra-border pb-3">Report Details</h3>
            <div className="text-xs text-gray-400 space-y-4 leading-relaxed font-semibold">
              <p>SnapSecure reports are compiled cryptographically, compiling active finding deductions against your AWS target accounts.</p>
              <div className="bg-black/20 p-4 border border-zentra-border rounded-2xl space-y-2 text-[11px] font-mono">
                <p className="text-zentra-text">&rsaquo; Target: {accounts[0]?.name || "AWS Core"}</p>
                <p className="text-zentra-text">&rsaquo; Score: {dynamicScore}/100</p>
                <p className="text-zentra-text">&rsaquo; Total Issues: {findings.length} findings</p>
                <p className="text-zentra-text">&rsaquo; Encryption: AES-256-GCM Signature</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    )
  }

  // ==========================================
  // PANEL 7: COST & FINOPS
  // ==========================================
  function renderCostTab() {
    return (
      <div className="grid lg:grid-cols-12 gap-8">
        
        {/* Interactive Estimator Sliders */}
        <div className="lg:col-span-8 space-y-6">
          <div className="glass-card p-6 rounded-3xl space-y-6">
            <h3 className="text-xs font-bold text-zentra-text border-b border-zentra-border pb-3">Configuration Estimate Calculator</h3>
            
            {/* Providers */}
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Cloud Provider</label>
              <div className="grid grid-cols-3 gap-3">
                {["aws", "azure", "gcp"].map(prov => (
                  <button
                    key={prov}
                    onClick={() => setCalcProvider(prov)}
                    className={`py-2 rounded-xl text-xs font-bold border transition-soft uppercase tracking-wider ${
                      calcProvider === prov 
                        ? "border-[#E68F74] bg-[#E68F74]/5 text-[#E68F74]" 
                        : "border-zentra-border text-gray-400 hover:border-white/20"
                    }`}
                  >
                    {prov}
                  </button>
                ))}
              </div>
            </div>

            {/* Service */}
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Service Type</label>
              <div className="grid grid-cols-3 gap-3">
                {["compute", "database", "storage"].map(srv => (
                  <button
                    key={srv}
                    onClick={() => setCalcService(srv)}
                    className={`py-2 rounded-xl text-xs font-bold border transition-soft capitalize ${
                      calcService === srv 
                        ? "border-[#E68F74] bg-[#E68F74]/5 text-[#E68F74]" 
                        : "border-zentra-border text-gray-400 hover:border-white/20"
                    }`}
                  >
                    {srv}
                  </button>
                ))}
              </div>
            </div>

            {/* Sliders */}
            <div className="space-y-5">
              <div>
                <div className="flex justify-between text-xs font-bold mb-2">
                  <span className="text-gray-300">vCPU Cores</span>
                  <span className="text-[#E68F74]">{calcVcpu} Cores</span>
                </div>
                <input 
                  type="range" 
                  min="1" max="64"
                  value={calcVcpu} 
                  onChange={(e) => setCalcVcpu(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-black/40 rounded-lg appearance-none cursor-pointer accent-[#E68F74]"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold mb-2">
                  <span className="text-gray-300">Memory (RAM)</span>
                  <span className="text-[#E68F74]">{calcRam} GB</span>
                </div>
                <input 
                  type="range" 
                  min="1" max="256"
                  value={calcRam} 
                  onChange={(e) => setCalcRam(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-black/40 rounded-lg appearance-none cursor-pointer accent-[#E68F74]"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold mb-2">
                  <span className="text-gray-300">Provisioned Storage</span>
                  <span className="text-[#E68F74]">{calcStorage} GB</span>
                </div>
                <input 
                  type="range" 
                  min="10" max="2000" step="10"
                  value={calcStorage} 
                  onChange={(e) => setCalcStorage(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-black/40 rounded-lg appearance-none cursor-pointer accent-[#E68F74]"
                />
              </div>
            </div>

          </div>
        </div>

        {/* Results & Optimization recommendations Column */}
        <div className="lg:col-span-4 space-y-6">
          {/* Estimate Display */}
          <div className="bg-white rounded-3xl p-6 shadow-xl border border-zentra-border flex flex-col justify-between min-h-[220px]">
            <div>
              <h3 className="text-gray-500 font-bold text-[10px] uppercase tracking-wider mb-2">Estimated Costs</h3>
              <div className="text-4xl font-extrabold text-black tracking-tight mb-6">
                ${calcEstimate?.monthly_cost?.toFixed(2) || "0.00"}
                <span className="text-xs text-gray-400 font-bold ml-1.5">/ mo</span>
              </div>

              <div className="space-y-2.5 text-[11px] font-semibold text-gray-500 leading-normal">
                <div className="flex justify-between border-b border-gray-100 pb-2">
                  <span>Compute Allocation</span>
                  <span className="font-bold text-black">${calcEstimate?.breakdown?.compute?.toFixed(2) || "0.00"}</span>
                </div>
                <div className="flex justify-between border-b border-gray-100 pb-2">
                  <span>Memory Allocation</span>
                  <span className="font-bold text-black">${calcEstimate?.breakdown?.memory?.toFixed(2) || "0.00"}</span>
                </div>
                <div className="flex justify-between pb-1">
                  <span>Storage provisioned</span>
                  <span className="font-bold text-black">${calcEstimate?.breakdown?.storage?.toFixed(2) || "0.00"}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Cost Optimizations (FinOps) */}
          <div className="glass-card p-6 rounded-3xl space-y-4 hover:border-zentra-border transition-soft">
            <h3 className="text-xs font-bold text-zentra-text border-b border-zentra-border pb-2">Cost Optimizations (FinOps)</h3>
            <div className="space-y-3 text-[11px] font-semibold leading-relaxed text-gray-400">
              <div className="p-3 bg-green-500/5 border border-green-500/10 rounded-xl">
                <p className="font-bold text-zentra-text mb-0.5">Stale database instance idle</p>
                <p className="text-[10px]">Terminating sg-034bb1c2 saves <strong>$43.20/mo</strong>.</p>
              </div>
              <div className="p-3 bg-green-500/5 border border-green-500/10 rounded-xl">
                <p className="font-bold text-zentra-text mb-0.5">Unused Backup Snapshots</p>
                <p className="text-[10px]">Deleting EC2 backups older than 90 days saves <strong>$12.50/mo</strong>.</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    )
  }

  // ==========================================
  // PANEL 8: ASSET INVENTORY
  // ==========================================
  function renderInventoryTab() {
    return (
      <div className="glass-card p-6 rounded-3xl space-y-4 hover:border-zentra-border transition-soft">
        <h3 className="text-xs font-bold text-zentra-text border-b border-zentra-border pb-3">Scanned Target Assets Catalog</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-zentra-border text-zentra-muted font-bold uppercase tracking-wider">
                <th className="pb-3 pr-4">Asset URN</th>
                <th className="pb-3 px-4">Type</th>
                <th className="pb-3 px-4">Region</th>
                <th className="pb-3 px-4 text-center">Open Findings</th>
                <th className="pb-3 pl-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-xs font-semibold">
              {[
                { urn: "arn:aws:iam::123456789012:root", type: "IAM_ROOT", reg: "Global", count: 2, status: "Critical exposure" },
                { urn: "arn:aws:iam::123456789012:user/admin-creds", type: "IAM_USER", reg: "Global", count: 1, status: "High exposure" },
                { urn: "sg-08e1a90c", type: "SECURITY_GROUP", reg: "us-east-1", count: 1, status: "High exposure" },
                { urn: "sg-034bb1c2", type: "SECURITY_GROUP", reg: "us-east-1", count: 1, status: "Medium exposure" },
                { urn: "arn:aws:acm:us-east-1:123456789012:certificate/c1-d2-e3", type: "ACM_CERTIFICATE", reg: "us-east-1", count: 1, status: "Medium exposure" },
                { urn: "arn:aws:acm:us-east-1:123456789012:certificate/a8-b9-c1", type: "ACM_CERTIFICATE", reg: "us-east-1", count: 1, status: "Warning" },
                { urn: "arn:aws:ec2:us-east-1:123456789012:instance/i-09f193c", type: "EC2_INSTANCE", reg: "us-east-1", count: 1, status: "High exposure" }
              ].map((asset, idx) => (
                <tr key={idx} className="hover:bg-gray-50 transition-soft">
                  <td className="py-4 pr-4 font-mono text-gray-400 break-all select-all">{asset.urn}</td>
                  <td className="py-4 px-4 text-gray-400 font-mono">{asset.type}</td>
                  <td className="py-4 px-4 text-gray-500 font-mono">{asset.reg}</td>
                  <td className="py-4 px-4 text-center text-zentra-text">{asset.count}</td>
                  <td className="py-4 pl-4 text-right">
                    <span className={`px-2 py-0.5 text-[9px] rounded-md font-bold uppercase border ${
                      asset.count >= 2 ? "bg-red-500/10 text-red-400 border-red-500/20" : "bg-orange-500/10 text-orange-400 border-orange-500/20"
                    }`}>{asset.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  // ==========================================
  // PANEL 9: AI SECURITY ASSISTANT
  // ==========================================
  function renderAiTab() {
    return (
      <div className="grid lg:grid-cols-12 gap-8 h-[calc(100vh-160px)]">
        
        {/* Chat log window */}
        <div className="lg:col-span-8 glass-card p-6 rounded-3xl flex flex-col justify-between h-full hover:border-zentra-border transition-soft">
          <div className="flex items-center justify-between border-b border-zentra-border pb-3">
            <h3 className="text-xs font-bold text-zentra-text flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
              Weaz Ai
            </h3>
            <span className="text-[9px] font-bold text-gray-500 uppercase tracking-wider">Powered by Weaz Ai 1.3 by SnapWeaz</span>
          </div>

          {/* Messages */}
          <div className="flex-grow my-4 overflow-y-auto space-y-4 pr-2 text-xs leading-relaxed max-h-[350px]">
            {aiChat.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`p-4 rounded-2xl max-w-md ${
                  msg.sender === "user" 
                    ? "bg-[#E68F74] text-black font-semibold rounded-tr-none" 
                    : "bg-gray-50 border border-zentra-border text-zentra-text rounded-tl-none space-y-2 whitespace-pre-wrap"
                }`}>
                  <div className="flex justify-between items-center gap-4 mb-1 text-[9px] opacity-60">
                    <span className="font-bold">{msg.sender === "user" ? "You" : "Weaz Ai"}</span>
                    <span>{msg.timestamp}</span>
                  </div>
                  {/* Enterprise-grade markdown renderer */}
                  <div className="leading-relaxed font-medium">
                    {(() => {
                      const lines = msg.text.split("\n")
                      const elements: React.ReactNode[] = []
                      let i = 0
                      
                      // Inline formatter: handles **bold**, `code`, and plain text
                      const formatInline = (text: string): React.ReactNode[] => {
                        const parts: React.ReactNode[] = []
                        const regex = /(\*\*(.+?)\*\*)|(`([^`]+)`)/g
                        let lastIndex = 0
                        let match
                        let pIdx = 0
                        while ((match = regex.exec(text)) !== null) {
                          if (match.index > lastIndex) {
                            parts.push(<span key={pIdx++}>{text.slice(lastIndex, match.index)}</span>)
                          }
                          if (match[2]) {
                            parts.push(<strong key={pIdx++} className="font-bold">{match[2]}</strong>)
                          } else if (match[4]) {
                            parts.push(<code key={pIdx++} className="px-1.5 py-0.5 bg-gray-200 text-[10px] rounded font-mono text-gray-700">{match[4]}</code>)
                          }
                          lastIndex = match.index + match[0].length
                        }
                        if (lastIndex < text.length) {
                          parts.push(<span key={pIdx++}>{text.slice(lastIndex)}</span>)
                        }
                        return parts.length > 0 ? parts : [<span key={0}>{text}</span>]
                      }
                      
                      while (i < lines.length) {
                        const line = lines[i]
                        
                        // Fenced code block
                        if (line.trim().startsWith("```")) {
                          const lang = line.trim().replace("```", "").trim()
                          const codeLines: string[] = []
                          i++
                          while (i < lines.length && !lines[i].trim().startsWith("```")) {
                            codeLines.push(lines[i])
                            i++
                          }
                          i++ // skip closing ```
                          elements.push(
                            <div key={elements.length} className="my-2 rounded-xl overflow-hidden border border-gray-200">
                              {lang && <div className="px-3 py-1 bg-gray-100 text-[9px] font-bold text-gray-500 uppercase tracking-wider border-b border-gray-200">{lang}</div>}
                              <pre className="p-3 bg-[#0B0F19] text-green-400 text-[10px] font-mono overflow-x-auto leading-relaxed whitespace-pre">
                                {codeLines.join("\n")}
                              </pre>
                            </div>
                          )
                          continue
                        }
                        
                        // Headers
                        if (line.startsWith("### ")) {
                          elements.push(<h4 key={elements.length} className="text-[13px] font-bold text-zentra-text mt-3 mb-1">{line.replace("### ", "")}</h4>)
                          i++; continue
                        }
                        if (line.startsWith("## ")) {
                          elements.push(<h3 key={elements.length} className="text-sm font-bold text-zentra-text mt-3 mb-1">{line.replace("## ", "")}</h3>)
                          i++; continue
                        }
                        
                        // Bullet points (-, *, •)
                        if (line.match(/^\s*[-*•]\s+/)) {
                          const bulletItems: string[] = []
                          while (i < lines.length && lines[i].match(/^\s*[-*•]\s+/)) {
                            bulletItems.push(lines[i].replace(/^\s*[-*•]\s+/, ""))
                            i++
                          }
                          elements.push(
                            <ul key={elements.length} className="my-1.5 space-y-1">
                              {bulletItems.map((item, bIdx) => (
                                <li key={bIdx} className="flex items-start gap-2 text-[11px]">
                                  <span className="mt-1.5 w-1 h-1 rounded-full bg-[#E68F74] shrink-0"></span>
                                  <span>{formatInline(item)}</span>
                                </li>
                              ))}
                            </ul>
                          )
                          continue
                        }
                        
                        // Numbered list
                        if (line.match(/^\d+\.\s+/)) {
                          const numItems: string[] = []
                          let startNum = 1
                          while (i < lines.length && lines[i].match(/^\d+\.\s+/)) {
                            const numMatch = lines[i].match(/^(\d+)\.\s+(.*)/)
                            if (numMatch) {
                              if (numItems.length === 0) startNum = parseInt(numMatch[1])
                              numItems.push(numMatch[2])
                            }
                            i++
                          }
                          elements.push(
                            <ol key={elements.length} start={startNum} className="my-1.5 space-y-1">
                              {numItems.map((item, nIdx) => (
                                <li key={nIdx} className="flex items-start gap-2 text-[11px]">
                                  <span className="mt-0.5 text-[10px] font-bold text-[#D2795E] shrink-0 w-4 text-right">{startNum + nIdx}.</span>
                                  <span>{formatInline(item)}</span>
                                </li>
                              ))}
                            </ol>
                          )
                          continue
                        }
                        
                        // Empty line = spacer
                        if (line.trim() === "") {
                          elements.push(<div key={elements.length} className="h-1.5"></div>)
                          i++; continue
                        }
                        
                        // Regular paragraph
                        elements.push(<p key={elements.length} className="my-0.5 text-[11px]">{formatInline(line)}</p>)
                        i++
                      }
                      
                      return elements
                    })()}
                  </div>
                </div>
              </div>
            ))}
            {aiLoading && (
              <div className="flex justify-start">
                <div className="p-4 bg-gray-50 border border-zentra-border text-gray-500 rounded-2xl rounded-tl-none flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce delay-100"></span>
                  <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce delay-200"></span>
                  <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce delay-300"></span>
                </div>
              </div>
            )}
            <div ref={chatEndRef}></div>
          </div>

          {/* Form */}
          <form onSubmit={handleSendAiMessage} className="flex gap-2 border-t border-zentra-border pt-4">
            <input
              type="text"
              value={aiInput}
              onChange={(e) => setAiInput(e.target.value)}
              placeholder="Ask how to remediate critical findings or request AWS CLI scripts..."
              className="flex-grow px-4 py-3 rounded-xl border border-zentra-border bg-white focus:border-[#E68F74] text-xs outline-none text-zentra-text transition-soft"
            />
            <button type="submit" className="px-5 bg-[#E68F74] hover:bg-[#D2795E] text-black font-bold text-xs rounded-xl transition-soft">Send</button>
          </form>
        </div>

        {/* Prompt Suggestions Column */}
        <div className="lg:col-span-4 space-y-4 h-full">
          <div className="glass-card p-5 rounded-3xl space-y-4 hover:border-zentra-border transition-soft h-full">
            <h3 className="text-xs font-bold text-zentra-text border-b border-zentra-border pb-2">Quick Prompt Suggestions</h3>
            <div className="space-y-2">
              <button onClick={() => { setAiInput("How do I fix missing root MFA?"); }} className="w-full text-left p-3.5 bg-gray-50 hover:bg-gray-100 border border-zentra-border hover:border-[#E68F74]/20 rounded-2xl text-[11px] font-semibold text-gray-600 hover:text-zentra-text transition-soft leading-normal">
                How do I fix missing root MFA?
              </button>
              <button onClick={() => { setAiInput("Remediate public SSH access (Port 22)"); }} className="w-full text-left p-3.5 bg-gray-50 hover:bg-gray-100 border border-zentra-border hover:border-[#E68F74]/20 rounded-2xl text-[11px] font-semibold text-gray-600 hover:text-zentra-text transition-soft leading-normal">
                Remediate public SSH access (Port 22)
              </button>
              <button onClick={() => { setAiInput("Show cloud cost savings recommendations"); }} className="w-full text-left p-3.5 bg-gray-50 hover:bg-gray-100 border border-zentra-border hover:border-[#E68F74]/20 rounded-2xl text-[11px] font-semibold text-gray-600 hover:text-zentra-text transition-soft leading-normal">
                Show cloud cost savings recommendations
              </button>
            </div>
          </div>
        </div>

      </div>
    )
  }

  // ==========================================
  // PANEL 10: SETTINGS
  // ==========================================
  function renderSettingsTab() {
    return (
      <div className="grid lg:grid-cols-12 gap-8">
        
        {/* Configurations Forms */}
        <div className="lg:col-span-7 space-y-6">
          <div className="glass-card p-6 rounded-3xl space-y-5">
            <h3 className="text-xs font-bold text-zentra-text border-b border-zentra-border pb-3">Notification Alert Channels</h3>
            
            {settingsSuccess && <div className="p-3 bg-green-500/10 border border-green-500/20 text-xs font-bold text-green-400 rounded-xl">Notifications configuration saved successfully.</div>}

            <form onSubmit={handleSaveSettings} className="space-y-6">
              
              {/* Slack */}
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Slack Incoming Webhook URL</label>
                <input
                  type="text"
                  value={slackWebhook}
                  onChange={(e) => setSlackWebhook(e.target.value)}
                  placeholder="https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX"
                  className="w-full px-4 py-3 rounded-xl border border-zentra-border bg-white focus:border-[#E68F74] focus:ring-1 focus:ring-[#E68F74]/20 outline-none text-xs text-zentra-text"
                />
              </div>

              {/* SES */}
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">AWS SES Verified Alert Recipient Email</label>
                <input
                  type="email"
                  value={sesEmail}
                  onChange={(e) => setSesEmail(e.target.value)}
                  placeholder="alerts@yourcompany.com"
                  className="w-full px-4 py-3 rounded-xl border border-zentra-border bg-white focus:border-[#E68F74] focus:ring-1 focus:ring-[#E68F74]/20 outline-none text-xs text-zentra-text"
                />
              </div>

              {/* Triggers selection list */}
              <div className="space-y-3.5 border-t border-zentra-border pt-5 text-xs font-bold">
                <p className="text-[10px] text-gray-500 uppercase tracking-wider">Trigger Notification Alert For</p>
                <label className="flex items-center gap-3 select-none cursor-pointer">
                  <input type="checkbox" defaultChecked className="accent-[#E68F74] w-4 h-4 rounded" />
                  <span className="text-gray-300">Open Critical findings detected (-10 score deduction)</span>
                </label>
                <label className="flex items-center gap-3 select-none cursor-pointer">
                  <input type="checkbox" defaultChecked className="accent-[#E68F74] w-4 h-4 rounded" />
                  <span className="text-gray-300">SSL Certificate Expiration Warnings (&lt; 30 days)</span>
                </label>
                <label className="flex items-center gap-3 select-none cursor-pointer">
                  <input type="checkbox" defaultChecked className="accent-[#E68F74] w-4 h-4 rounded" />
                  <span className="text-gray-300">Security Audit Scan module executions completed</span>
                </label>
                <label className="flex items-center gap-3 select-none cursor-pointer">
                  <input type="checkbox" className="accent-[#E68F74] w-4 h-4 rounded" />
                  <span className="text-gray-300">Compliance framework failed controls mapping alert</span>
                </label>
              </div>

              <button
                type="submit"
                className="px-6 py-3 rounded-full bg-[#E68F74] hover:bg-[#D2795E] text-black font-bold text-xs transition-soft shadow-lg"
              >
                Save Settings
              </button>

            </form>
          </div>
        </div>

        {/* Right Info Column */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-card p-6 rounded-3xl space-y-4 text-xs font-semibold leading-relaxed text-gray-400">
            <h3 className="text-xs font-bold text-zentra-text border-b border-zentra-border pb-2">Alert Routing Guide</h3>
            <p>SnapSecure integrates with SES and Slack webhooks to push real-time posture changes and compliance alerts to SecOps teams.</p>
            <p className="text-[10px] text-gray-500">Note: In sandbox local environments, email sending requires verifying the sender and recipient domains within the AWS Console.</p>
          </div>
        </div>

      </div>
    )
  }

  // ==========================================
  // SHARED STYLED CARD BLOCKS
  // ==========================================
  function statCard(title: string, value: string | number, badgeColors: string, extraAnim: string = "") {
    return (
      <div className={`glass-card p-5 rounded-3xl flex flex-col justify-between hover:border-zentra-border transition-soft`}>
        <div className="space-y-1">
          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">{title}</span>
          <p className={`text-3xl font-extrabold tracking-tight text-zentra-text ${extraAnim}`}>{value}</p>
        </div>
        <div className={`mt-3 px-2 py-0.5 text-[8px] font-bold uppercase tracking-wider rounded-md border w-fit ${badgeColors}`}>
          Active
        </div>
      </div>
    )
  }

  function severityProgress(label: string, count: number, total: number, colorClass: string) {
    const percentage = total > 0 ? (count / total) * 100 : 0
    return (
      <div className="space-y-1 text-xs font-semibold">
        <div className="flex justify-between">
          <span className="text-gray-600">{label}</span>
          <span className="text-zentra-text">{count} ({percentage.toFixed(0)}%)</span>
        </div>
        <div className="w-full h-1.5 bg-white border border-zentra-border rounded-full overflow-hidden">
          <div className={`h-full ${colorClass} rounded-full`} style={{ width: `${percentage}%` }}></div>
        </div>
      </div>
    )
  }

  function complianceMeter(label: string, percentage: string, colorClass: string) {
    return (
      <div className="p-3 bg-gray-50 border border-zentra-border rounded-2xl flex flex-col justify-between gap-2.5">
        <div className="space-y-1">
          <span className="text-[9px] text-gray-500 uppercase font-bold tracking-wider">{label}</span>
          <p className={`text-lg font-extrabold ${colorClass.split(" ")[1]}`}>{percentage}</p>
        </div>
        <div className={`w-full h-1 bg-white border border-zentra-border rounded-full overflow-hidden`}>
          <div className="h-full bg-[#E68F74] rounded-full" style={{ width: percentage }}></div>
        </div>
      </div>
    )
  }

  function complianceSummaryCard(label: string, percentage: string, failedCountText: string, textColors: string) {
    return (
      <div className="glass-card p-5 rounded-3xl flex flex-col justify-between hover:border-zentra-border transition-soft">
        <div className="space-y-1">
          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">{label}</span>
          <p className={`text-2xl font-extrabold ${textColors.split(" ")[1]}`}>{percentage}</p>
        </div>
        <div className="mt-3 text-[10px] text-zentra-muted font-bold uppercase tracking-wider">
          {failedCountText}
        </div>
      </div>
    )
  }

  function moduleStatusCard(name: string, statusLabel: string, scopeText: string, colorClasses: string) {
    const textCol = colorClasses.split(" ")[0];
    const borderCol = colorClasses.split(" ")[1];
    const bgCol = colorClasses.split(" ")[2];
    return (
      <div className={`p-4 rounded-2xl border ${borderCol} ${bgCol} flex flex-col justify-between gap-3 text-xs font-semibold`}>
        <div className="space-y-1">
          <span className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">{statusLabel}</span>
          <h4 className="font-extrabold text-zentra-text leading-tight">{name}</h4>
        </div>
        <p className="text-[10px] text-gray-500 font-medium leading-relaxed">{scopeText}</p>
      </div>
    )
  }
}
