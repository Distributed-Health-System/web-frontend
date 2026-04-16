"use client"

import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useState } from "react"
import {
  Brain,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ShieldCheck,
  UserRound,
} from "lucide-react"

import { DistributedHealthLogo } from "@/components/brand/distributed-health-logo"
import { AuthFooter } from "@/components/layout/auth-footer"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

// Basic email shape validation for client-side checks.
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

type SignUpErrors = {
  fullName?: string
  email?: string
  password?: string
  confirmPassword?: string
}

// Inline SVG avoids external icon package dependency for brand marks.
function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
      <path
        fill="#EA4335"
        d="M12 10.2v3.95h5.49c-.24 1.27-.96 2.35-2.04 3.07l3.3 2.56c1.92-1.77 3.03-4.37 3.03-7.45 0-.72-.06-1.42-.19-2.09H12z"
      />
      <path
        fill="#34A853"
        d="M12 22c2.7 0 4.96-.9 6.61-2.44l-3.3-2.56c-.92.62-2.1.99-3.31.99-2.54 0-4.69-1.72-5.46-4.02l-3.4 2.62A9.98 9.98 0 0 0 12 22z"
      />
      <path
        fill="#4A90E2"
        d="M6.54 13.97A6 6 0 0 1 6.24 12c0-.68.11-1.34.3-1.97l-3.4-2.62A10 10 0 0 0 2 12c0 1.6.38 3.11 1.14 4.39l3.4-2.62z"
      />
      <path
        fill="#FBBC05"
        d="M12 5.98c1.46 0 2.77.5 3.8 1.48l2.85-2.85C16.95 3.01 14.69 2 12 2a10 10 0 0 0-8.86 5.41l3.4 2.62C7.31 7.7 9.46 5.98 12 5.98z"
      />
    </svg>
  )
}

function AppleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
      <path
        fill="currentColor"
        d="M16.3 12.52c.03 2.86 2.5 3.82 2.53 3.83-.02.07-.39 1.36-1.29 2.69-.78 1.15-1.6 2.3-2.88 2.33-1.26.02-1.67-.74-3.12-.74s-1.9.72-3.06.76c-1.23.04-2.18-1.24-2.97-2.39C3.9 16.71 2.7 12.6 4.35 9.72c.82-1.43 2.3-2.33 3.91-2.35 1.22-.02 2.37.82 3.12.82.75 0 2.16-1.01 3.63-.86.61.03 2.33.25 3.43 1.86-.09.05-2.05 1.2-2.03 3.33zM14.78 5.64c.65-.8 1.08-1.92.96-3.04-.94.04-2.09.63-2.76 1.43-.6.7-1.13 1.84-.98 2.93 1.05.08 2.13-.53 2.78-1.32z"
      />
    </svg>
  )
}

export default function SignUpPage() {
  const searchParams = useSearchParams()
  const roleParam = searchParams.get("role")
  const [selectedRole, setSelectedRole] = useState<"patient" | "doctor">(
    roleParam === "doctor" ? "doctor" : "patient"
  )
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false)
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [errors, setErrors] = useState<SignUpErrors>({})

  // Keep lightweight client validation close to the form for fast feedback.
  const validate = (): SignUpErrors => {
    const nextErrors: SignUpErrors = {}

    if (!fullName.trim()) {
      nextErrors.fullName = "Full name is required."
    } else if (fullName.trim().length < 2) {
      nextErrors.fullName = "Full name must be at least 2 characters."
    }

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

    if (!confirmPassword) {
      nextErrors.confirmPassword = "Please confirm your password."
    } else if (confirmPassword !== password) {
      nextErrors.confirmPassword = "Passwords do not match."
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
      <header className="border-b border-slate-200/80 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-5">
          <DistributedHealthLogo />

          <div className="flex items-center gap-3 text-sm text-slate-500">
            <span className="hidden sm:inline">Already have an account?</span>
            <Link
              href="/login"
              className="rounded-xl bg-sky-100 px-5 py-2.5 font-medium text-sky-700 transition hover:bg-sky-200"
            >
              Sign In
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-10 px-6 py-12 lg:grid-cols-[minmax(420px,1fr)_minmax(420px,560px)] lg:items-center lg:gap-12">
        <section className="space-y-8 lg:pr-8">
          <div>
            <Badge className="rounded-full bg-emerald-700 px-4 py-1 text-[11px] tracking-wide text-white hover:bg-emerald-700">
              AI-POWERED PRECISION
            </Badge>

            <h1 className="mt-4 text-5xl font-bold leading-tight tracking-[-1px] text-slate-900">
              Your health,
              <span
                className="block bg-clip-text text-transparent"
                style={{
                  backgroundImage:
                    "linear-gradient(146deg, #0b1c30 0%, #0065a1 52%, #0b1c30 100%)",
                }}
              >
                reimagined with AI.
              </span>
            </h1>

            <p className="mt-5 max-w-lg text-slate-600">
              Join the next generation of healthcare. Our AI-enabled platform offers
              instant symptom checking and seamless clinical integration.
            </p>
          </div>

          <div className="space-y-4">
            <article className="rounded-xl bg-white p-6 shadow-[0_12px_32px_-4px_rgba(25,28,30,0.06)]">
              <div className="flex items-start gap-4">
                <span className="mt-0.5 rounded-lg bg-sky-50 p-2 text-sky-700">
                  <Brain className="h-5 w-5" />
                </span>
                <div>
                  <h2 className="text-lg text-slate-900">AI Symptom Insights</h2>
                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    Get medically-backed preliminary assessments in seconds using our
                    advanced neural diagnostic engine.
                  </p>
                </div>
              </div>
            </article>

            <article className="rounded-xl bg-white p-6 shadow-[0_12px_32px_-4px_rgba(25,28,30,0.06)]">
              <div className="flex items-start gap-4">
                <span className="mt-0.5 rounded-lg bg-emerald-50 p-2 text-emerald-700">
                  <ShieldCheck className="h-5 w-5" />
                </span>
                <div>
                  <h2 className="text-lg text-slate-900">Privacy First Architecture</h2>
                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    Your data is encrypted with enterprise-grade security, ensuring complete
                    patient confidentiality.
                  </p>
                </div>
              </div>
            </article>
          </div>

          <div
            className="relative min-h-64 overflow-hidden rounded-2xl bg-cover bg-center p-8 text-white shadow-[0_12px_32px_-4px_rgba(25,28,30,0.2)]"
            style={{
              backgroundImage:
                "linear-gradient(180deg, rgba(0,71,141,0) 20%, rgba(0,71,141,0.7) 100%), url('/assets/images/auth/doctor-tablet.svg')",
            }}
          >
            <div className="absolute inset-0 bg-linear-to-tr from-[#0b1c30]/30 via-[#0065a1]/20 to-[#0b1c30]/40" />
            <div className="relative z-10 flex min-h-48 flex-col justify-end">
              <p className="max-w-md text-base leading-6 text-white/90">
                &quot;The diagnostic precision has improved our patient outcomes by 40%.&quot;
              </p>
              <p className="mt-3 text-sm text-white/80">- Dr. Elena Vance, Chief of Medicine</p>
            </div>
          </div>
        </section>

        <section className="rounded-[28px] border border-slate-200 bg-white p-8 shadow-[0_12px_32px_-4px_rgba(25,28,30,0.08)] md:p-10">
          <div className="text-center">
            <h2 className="text-4xl font-bold tracking-[-0.8px] text-slate-900">Create an Account</h2>
            <p className="mt-2 text-sm text-slate-600">Select your profile type to begin</p>
          </div>

          <div className="mt-8 grid grid-cols-2 rounded-xl bg-[#e7edf5] p-1 text-sm">
            <button
              onClick={() => setSelectedRole("patient")}
              className={`rounded-lg py-2.5 ${
                selectedRole === "patient"
                  ? "bg-white text-[#0065a1] shadow-sm"
                  : "text-slate-700"
              }`}
              type="button"
              aria-pressed={selectedRole === "patient"}
            >
              Patient
            </button>
            <button
              onClick={() => setSelectedRole("doctor")}
              className={`rounded-lg py-2.5 ${
                selectedRole === "doctor"
                  ? "bg-white text-[#0065a1] shadow-sm"
                  : "text-slate-700"
              }`}
              type="button"
              aria-pressed={selectedRole === "doctor"}
            >
              Doctor
            </button>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit} noValidate>
            <label className="block space-y-2 text-sm text-slate-800">
              <span>Full Name</span>
              <div className="relative">
                <UserRound className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
                <Input
                  className="h-12 rounded-xl border-slate-200 bg-white pl-9 placeholder:text-slate-500"
                  placeholder="Full Name"
                  value={fullName}
                  onChange={(event) => {
                    setFullName(event.target.value)
                    setErrors((current) => ({ ...current, fullName: undefined }))
                  }}
                  aria-invalid={Boolean(errors.fullName)}
                />
              </div>
              {errors.fullName ? (
                <p className="text-xs text-red-600">{errors.fullName}</p>
              ) : null}
            </label>

            <label className="block space-y-2 text-sm text-slate-800">
              <span>Email Address</span>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
                <Input
                  type="email"
                  className="h-12 rounded-xl border-slate-200 bg-white pl-9 placeholder:text-slate-500"
                  placeholder="mail@gmail.com"
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

            <label className="block space-y-2 text-sm text-slate-800">
              <span>Password</span>
              <div className="relative">
                <LockKeyhole className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
                <Input
                  type={isPasswordVisible ? "text" : "password"}
                  className="h-12 rounded-xl border-slate-200 bg-white px-9 placeholder:text-slate-500"
                  placeholder="Create a strong password"
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
            </label>

            <label className="block space-y-2 text-sm text-slate-800">
              <span>Confirm Password</span>
              <div className="relative">
                <LockKeyhole className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
                <Input
                  type={isConfirmPasswordVisible ? "text" : "password"}
                  className="h-12 rounded-xl border-slate-200 bg-white px-9 placeholder:text-slate-500"
                  placeholder="Re-enter password"
                  value={confirmPassword}
                  onChange={(event) => {
                    setConfirmPassword(event.target.value)
                    setErrors((current) => ({ ...current, confirmPassword: undefined }))
                  }}
                  aria-invalid={Boolean(errors.confirmPassword)}
                />
                <button
                  type="button"
                  onClick={() => setIsConfirmPasswordVisible((current) => !current)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-600"
                  aria-label={
                    isConfirmPasswordVisible ? "Hide confirm password" : "Show confirm password"
                  }
                >
                  {isConfirmPasswordVisible ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.confirmPassword ? (
                <p className="text-xs text-red-600">{errors.confirmPassword}</p>
              ) : null}
            </label>

            <Button
              type="submit"
              className="mt-1 h-14 w-full rounded-2xl text-lg font-semibold text-white"
              style={{
                backgroundImage:
                  "linear-gradient(122deg, #021f3a 0%, #005c92 52%, #021f3a 100%)",
              }}
            >
              Create Account
            </Button>
          </form>

          <div className="relative my-8 flex items-center justify-center">
            <span className="absolute h-px w-full bg-slate-200" aria-hidden="true" />
            <span className="relative bg-white px-4 text-sm font-medium tracking-wide text-slate-600">
              OR CONTINUE WITH
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <button className="flex h-11 items-center justify-center gap-2 rounded-xl bg-[#edf1f6] text-sm text-slate-800 transition hover:bg-[#e6ebf2]">
              <GoogleIcon />
              Google
            </button>
            <button className="flex h-11 items-center justify-center gap-2 rounded-xl bg-[#edf1f6] text-sm text-slate-800 transition hover:bg-[#e6ebf2]">
              <AppleIcon />
              Apple
            </button>
          </div>

          <p className="mt-8 text-center text-xs leading-5 text-slate-600">
            By signing up, you agree to our{" "}
            <Link href="#" className="font-medium text-sky-700 hover:text-sky-800">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="#" className="font-medium text-sky-700 hover:text-sky-800">
              Privacy Policy
            </Link>
            .
          </p>
        </section>
      </main>

      <AuthFooter />
    </div>
  )
}
