import React from "react"

export function SecurityCore3D() {
  return (
    <div className="relative w-36 h-36 flex items-center justify-center perspective-1000">
      {/* Decorative background aura */}
      <div className="absolute w-24 h-24 rounded-full bg-[#f0a991]/5 blur-[25px] pointer-events-none animate-pulse"></div>
      
      <div className="cube-container">
        {/* Outer faces */}
        <div className="cube-face cube-face-front flex items-center justify-center">
          <span className="text-[7px] text-[#f0a991]/30 font-mono tracking-widest uppercase select-none">SHIELD</span>
        </div>
        <div className="cube-face cube-face-back flex items-center justify-center">
          <span className="text-[7px] text-[#f0a991]/30 font-mono tracking-widest uppercase select-none">SYS</span>
        </div>
        <div className="cube-face cube-face-left flex items-center justify-center">
          <span className="text-[7px] text-[#f0a991]/30 font-mono tracking-widest uppercase select-none">PORT</span>
        </div>
        <div className="cube-face cube-face-right flex items-center justify-center">
          <span className="text-[7px] text-[#f0a991]/30 font-mono tracking-widest uppercase select-none">IAM</span>
        </div>
        <div className="cube-face cube-face-top flex items-center justify-center">
          <span className="text-[7px] text-[#f0a991]/30 font-mono tracking-widest uppercase select-none">VPC</span>
        </div>
        <div className="cube-face cube-face-bottom flex items-center justify-center">
          <span className="text-[7px] text-[#f0a991]/30 font-mono tracking-widest uppercase select-none">SSL</span>
        </div>

        {/* Inner reverse-spinning core */}
        <div className="inner-cube-container">
          <div className="inner-cube-face inner-face-front"></div>
          <div className="inner-cube-face inner-face-back"></div>
          <div className="inner-cube-face inner-face-left"></div>
          <div className="inner-cube-face inner-face-right"></div>
          <div className="inner-cube-face inner-face-top"></div>
          <div className="inner-cube-face inner-face-bottom"></div>
        </div>
      </div>
    </div>
  )
}
