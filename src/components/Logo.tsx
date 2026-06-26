import React from 'react'

export function Logo({ className = "", dotClassName = "" }: { className?: string, dotClassName?: string }) {
  return (
    <div className={`flex items-center ${className}`}>
      <span className="text-[#15231c] font-medium text-3xl tracking-tight">
        SnapSecure<span className={`text-[#d2ae5c] font-bold ${dotClassName}`}>.</span>
      </span>
    </div>
  )
}
