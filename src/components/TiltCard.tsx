"use client"

import React from "react"

interface TiltCardProps {
  children: React.ReactNode
  className?: string
}

export function TiltCard({ children, className = "" }: TiltCardProps) {
  return (
    <div className={`card-hover-3d preserve-3d ${className}`}>
      {children}
    </div>
  )
}
