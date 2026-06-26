"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { api } from "@/lib/api"
import { Logo } from "@/components/Logo"

declare global {
  interface Window {
    google?: any;
  }
}

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [googleClientId, setGoogleClientId] = useState("")
  const [showGoogleModal, setShowGoogleModal] = useState(false)
  const [customEmail, setCustomEmail] = useState("")

  useEffect(() => {
    const fetchConfig = async () => {
      const envClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
      if (envClientId) {
        setGoogleClientId(envClientId)
        return
      }
      try {
        const res = await api.get("/auth/config")
        if (res.data && res.data.google_client_id) {
          setGoogleClientId(res.data.google_client_id)
        }
      } catch (err) {
        console.error("Failed to fetch Google auth config", err)
      }
    }
    fetchConfig()
  }, [])

  useEffect(() => {
    const initGoogle = () => {
      const btnContainer = document.getElementById("google-signin-btn");
      if (typeof window !== "undefined" && window.google && googleClientId && btnContainer) {
        window.google.accounts.id.initialize({
          client_id: googleClientId,
          callback: handleGoogleSubmit,
        });
        window.google.accounts.id.renderButton(
          btnContainer,
          { 
            theme: "outline", 
            size: "large", 
            width: 380, 
            shape: "pill",
            text: "continue_with"
          }
        );
      }
    };

    if (googleClientId) {
      initGoogle();
      const interval = setInterval(() => {
        if (typeof window !== "undefined" && window.google) {
          initGoogle();
          clearInterval(interval);
        }
      }, 500);
      return () => clearInterval(interval);
    }
  }, [googleClientId]);

  const handleGoogleSubmit = async (credentialResponse: any) => {
    setLoading(true);
    setError("");
    try {
      const res = await api.post("/auth/google", {
        id_token: credentialResponse.credential,
      });

      const { access_token } = res.data;
      
      // Decode user email from Google ID token safely
      let email = "mockuser@example.com";
      if (credentialResponse.credential.startsWith("mock-google-token-")) {
        email = credentialResponse.credential.substring(18);
      } else if (credentialResponse.credential !== "mock-google-token-12345") {
        try {
          const payloadBase64 = credentialResponse.credential.split(".")[1];
          const decodedPayload = JSON.parse(atob(payloadBase64));
          email = decodedPayload.email;
        } catch (e) {
          console.error("Failed to parse Google ID token", e);
        }
      }

      localStorage.setItem("token", access_token);
      localStorage.setItem("user", JSON.stringify({ email }));

      router.push("/dashboard");
    } catch (err: any) {
      const detail = err.response?.data?.detail;
      const errorMessage = typeof detail === 'string' 
        ? detail 
        : "Failed to authenticate with Google.";
      setError(errorMessage);
      setLoading(false);
    }
  };

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const formData = new URLSearchParams()
      formData.append("username", email)
      formData.append("password", password)

      const res = await api.post("/auth/login", formData, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" }
      })

      const { access_token } = res.data
      localStorage.setItem("token", access_token)
      localStorage.setItem("user", JSON.stringify({ email }))

      router.push("/dashboard")
    } catch (err: any) {
      const detail = err.response?.data?.detail;
      const errorMessage = typeof detail === 'string' 
        ? detail 
        : Array.isArray(detail) 
          ? detail.map((d: any) => d.msg).join(', ') 
          : "Authentication failed. Please verify credentials.";
      setError(errorMessage);
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12 bg-zentra-bg font-sans">
      <div className="w-full max-w-md bg-white border border-zentra-border shadow-card p-8 rounded-3xl animate-fade-in-up">
        
        {/* Logo and Headings */}
        <div className="flex flex-col items-center mb-8">
          <Logo className="mb-6 scale-110" />
          <h2 className="text-2xl font-bold text-zentra-text tracking-tight">
            Welcome back
          </h2>
          <p className="text-sm text-zentra-muted mt-2">
            Sign in to your SnapSecure dashboard
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-zentra-red/10 border border-zentra-red/20 rounded-xl text-sm font-medium text-zentra-red">
            {error}
          </div>
        )}

        {/* Google OAuth Login */}
        <div className="mb-6 flex flex-col items-center justify-center w-full">
          {googleClientId ? (
            <div id="google-signin-btn" className="w-full flex justify-center min-h-[44px]"></div>
          ) : (
            <button
              type="button"
              onClick={() => setShowGoogleModal(true)}
              className="w-full py-3 px-4 rounded-xl border border-zentra-border hover:bg-gray-50 text-zentra-text font-bold text-sm transition-soft flex items-center justify-center gap-3 bg-white shadow-soft"
            >
              <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              Sign in with Google (Dev Bypass)
            </button>
          )}
          
          <div className="relative w-full my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-zentra-border"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-3 text-zentra-muted font-bold tracking-wider">Or email login</span>
            </div>
          </div>
        </div>


        <form onSubmit={handleCredentialsSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-zentra-text mb-1.5">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              className="w-full px-4 py-3 rounded-xl border border-zentra-border focus:border-zentra-blue focus:ring-2 focus:ring-zentra-blue/20 outline-none transition-soft text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-zentra-text mb-1.5">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-xl border border-zentra-border focus:border-zentra-blue focus:ring-2 focus:ring-zentra-blue/20 outline-none transition-soft text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 mt-2 rounded-full bg-zentra-blue hover:bg-zentra-accent text-zentra-text font-bold text-sm transition-soft shadow-soft flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-zentra-text border-t-transparent rounded-full animate-spin"></span>
            ) : (
              "Continue"
            )}
          </button>
        </form>

        <p className="text-center text-sm font-medium text-zentra-muted mt-8">
          Don't have an account?{" "}
          <Link href="/register" className="text-zentra-blue hover:underline font-bold">
            Sign up
          </Link>
        </p>
      </div>

      {showGoogleModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl border border-zentra-border p-6 max-w-sm w-full mx-4 shadow-xl">
            <div className="flex flex-col items-center mb-6">
              <div className="w-12 h-12 bg-gray-50 border border-zentra-border rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-zentra-text">Sign in with Google</h3>
              <p className="text-xs text-zentra-muted text-center mt-1">
                Select a developer profile to bypass OAuth
              </p>
            </div>

            <div className="space-y-2 mb-6">
              {[
                { name: "Sarah Jenkins", email: "sarah.ops@snapsecure.com", role: "DevOps Engineer" },
                { name: "Alex Posture", email: "alex.posture@snapsecure.com", role: "Compliance Lead" },
                { name: "Auditor Secops", email: "auditor.secops@snapsecure.com", role: "Security Auditor" }
              ].map((account) => (
                <button
                  key={account.email}
                  type="button"
                  onClick={() => {
                    setShowGoogleModal(false);
                    handleGoogleSubmit({ credential: `mock-google-token-${account.email}` });
                  }}
                  className="w-full p-3 rounded-xl border border-zentra-border hover:bg-gray-50 transition-soft flex items-center gap-3 text-left"
                >
                  <div className="w-8 h-8 rounded-full bg-zentra-blue/10 flex items-center justify-center text-xs font-bold text-zentra-blue">
                    {account.name[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-zentra-text truncate">{account.name}</p>
                    <p className="text-xs text-zentra-muted truncate">{account.email}</p>
                  </div>
                </button>
              ))}
            </div>

            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-zentra-border"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-zentra-muted font-bold">Or use custom email</span>
              </div>
            </div>

            <div className="mb-6">
              <input
                type="email"
                value={customEmail}
                onChange={(e) => setCustomEmail(e.target.value)}
                placeholder="custom@email.com"
                className="w-full px-4 py-2.5 rounded-xl border border-zentra-border focus:border-zentra-blue focus:ring-2 focus:ring-zentra-blue/20 outline-none text-sm"
              />
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowGoogleModal(false)}
                className="flex-1 py-2.5 rounded-xl border border-zentra-border hover:bg-gray-50 text-zentra-text font-bold text-sm transition-soft"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={!customEmail || !customEmail.includes("@")}
                onClick={() => {
                  setShowGoogleModal(false);
                  handleGoogleSubmit({ credential: `mock-google-token-${customEmail}` });
                }}
                className="flex-1 py-2.5 rounded-xl bg-zentra-blue hover:bg-zentra-accent text-zentra-text font-bold text-sm transition-soft disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
