import type { Metadata } from "next"
import Script from "next/script"
import "./globals.css"

export const metadata: Metadata = {
  title: "SnapSecure - Cloud Security Posture Monitor",
  description: "Enterprise-grade AWS Cloud Security Assessment and Posture Management Platform",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="light">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-zentra-bg min-h-screen text-zentra-text antialiased font-sans selection:bg-zentra-blue selection:text-zentra-text">
        {children}
        <Script 
          src="https://accounts.google.com/gsi/client" 
          strategy="lazyOnload" 
        />
      </body>
    </html>
  )
}

