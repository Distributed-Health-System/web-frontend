"use client"

import Link from "next/link"
import { ArrowRight, CheckCircle2, Eye, EyeOff, Info, Lock, Mail } from "lucide-react"
import { useState } from "react"

import { DistributedHealthLogo } from "@/components/brand/distributed-health-logo"
import { AuthFooter } from "@/components/layout/auth-footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

// Metrics used in the branded hero panel.
const highlights = [
  { value: "99.9%", label: "UPTIME RELIABILITY" },
  { value: "HIPAA", label: "COMPLIANT SECURITY" },
  { value: "256-bit", label: "DATA ENCRYPTION" },
]

// Basic email shape validation for client-side checks.
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

type LoginErrors = {
  email?: string
  password?: string
}

export default function LoginPage() {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [errors, setErrors] = useState<LoginErrors>({})

  // Keep lightweight client validation close to the form for fast feedback.
  const validate = (): LoginErrors => {
    const nextErrors: LoginErrors = {}

    if (!email.trim()) {
      nextErrors.email = "Email address is required."
    } else if (!EMAIL_PATTERN.test(email.trim())) {
      nextErrors.email = "Please enter a valid email address."
    }

    if (!password) {
      nextErrors.password = "Password is required."
    } else if (password.length < 8) {
      nextErrors.password = "Password must be at least 8 characters."
    }

    return nextErrors
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    // Stop submit until all inputs pass local validation rules.
    const nextErrors = validate()
    setErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) {
      return
    }
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900">
      <main className="mx-auto grid w-full max-w-[1440px] grid-cols-1 items-stretch px-4 py-6 md:px-10 md:py-12 lg:grid-cols-[minmax(460px,1fr)_minmax(420px,560px)] lg:gap-0">
        <section className="relative hidden overflow-hidden rounded-2xl p-10 text-white lg:flex lg:flex-col lg:justify-between"
          style={{
            backgroundImage:
              "linear-gradient(135deg, #0b1c30 0%, #0065a1 49%, #0b1c30 100%)",
          }}
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.15),transparent_45%)]" />
          <div className="relative z-10 space-y-10">
            <DistributedHealthLogo dark />
            <div className="max-w-md space-y-4">
              <h1 className="text-[40px] font-bold leading-[1.1] tracking-[-1px]">
                Securing the future of patient care.
              </h1>
              <p className="max-w-sm text-sm text-blue-50/85">
                A unified workspace designed for surgical precision and human empathy.
                Our sanctuary connects those who heal with those who need it most.
              </p>
            </div>
          </div>

          <div className="relative z-10 grid grid-cols-3 gap-5 border-t border-white/20 pt-8">
            {highlights.map((item) => (
              <div key={item.value}>
                <p className="text-3xl font-bold tracking-[-0.8px]">{item.value}</p>
                <p className="mt-1 text-[11px] font-medium tracking-wide text-blue-50/70">
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="flex items-center bg-white px-6 py-10 md:px-10 lg:rounded-r-2xl lg:border lg:border-l-0 lg:border-slate-200 lg:px-14">
          <div className="mx-auto w-full max-w-md">
            <div className="space-y-2">
              <h2 className="text-4xl font-bold tracking-[-0.8px] text-slate-900">Welcome Back</h2>
              <p className="text-slate-600">Sign in to your professional health portal.</p>
            </div>

            <div className="mt-7 flex items-start gap-3 rounded-xl bg-slate-100 p-4 text-sm text-slate-600">
              <Info className="mt-0.5 h-4 w-4 shrink-0 text-sky-600" />
              <p>
                Admins, doctors, and patients all use this centralized portal for secure
                record access and clinical workflows.
              </p>
            </div>

            <form className="mt-8 space-y-5" onSubmit={handleSubmit} noValidate>
              <label className="block space-y-2 text-sm text-slate-800">
                <span>Email Address</span>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <Input
                    type="email"
                    placeholder="name@example.com"
                    className="h-10 rounded-lg border-slate-200 bg-white pl-9"
                    value={email}
                    onChange={(event) => {
                      setEmail(event.target.value)
                      setErrors((current) => ({ ...current, email: undefined }))
                    }}
                    aria-invalid={Boolean(errors.email)}
                  />
                </div>
                {errors.email ? (
                  <p className="text-xs text-red-600">{errors.email}</p>
                ) : null}
              </label>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <label htmlFor="password" className="text-slate-800">
                    Password
                  </label>
                  <Link href="#" className="text-[14px] text-sky-700 hover:text-sky-800">
                    Forgot Password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <Input
                    id="password"
                    type={isPasswordVisible ? "text" : "password"}
                    placeholder="Enter your password"
                    className="h-10 rounded-lg border-slate-200 bg-white px-9"
                    value={password}
                    onChange={(event) => {
                      setPassword(event.target.value)
                      setErrors((current) => ({ ...current, password: undefined }))
                    }}
                    aria-invalid={Boolean(errors.password)}
                  />
                  <button
                    type="button"
                    onClick={() => setIsPasswordVisible((current) => !current)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-600"
                    aria-label={isPasswordVisible ? "Hide password" : "Show password"}
                  >
                    {isPasswordVisible ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {errors.password ? (
                  <p className="text-xs text-red-600">{errors.password}</p>
                ) : null}
              </div>

              <label className="flex items-center gap-3 text-sm text-slate-600">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-slate-300 text-sky-700 focus:ring-sky-700"
                />
                Keep me logged in for 30 days
              </label>

              <Button
                type="submit"
                className="h-12 w-full rounded-xl text-base text-white"
                style={{
                  backgroundImage:
                    "linear-gradient(145deg, #0b1c30 0%, #0065a1 50%, #0b1c30 100%)",
                }}
              >
                Login to Dashboard
                <ArrowRight className="h-4 w-4" />
              </Button>
            </form>

            <div className="mt-10 border-t border-slate-200 pt-8 text-center text-sm text-slate-600">
              Need a medical professional account?{" "}
              <Link href="#" className="font-medium text-sky-700 hover:text-sky-800">
                Contact Administration
              </Link>
            </div>

            <div className="mt-8 flex items-center gap-2 text-sm text-slate-500 lg:hidden">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              Secure sign-in with role-based access for patients, doctors, and admins.
            </div>
          </div>
        </section>
      </main>
      <AuthFooter />
    </div>
  )
}
