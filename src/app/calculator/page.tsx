"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function CalculatorRedirect() {
  const router = useRouter()
  
  useEffect(() => {
    router.push("/dashboard?tab=cost")
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#030712]">
      <div className="flex flex-col items-center gap-3">
        <span className="w-10 h-10 border-4 border-[#E68F74] border-t-transparent rounded-full animate-spin"></span>
        <span className="text-xs font-bold text-gray-500 uppercase tracking-widest font-mono">LOADING COST WORKSPACE...</span>
      </div>
    </div>
  )
}
