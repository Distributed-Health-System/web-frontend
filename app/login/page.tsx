"use client"

import Link from "next/link"
import { useState } from "react"
import { ArrowRight, Brain, Eye, EyeOff, LockKeyhole, Mail, ShieldCheck } from "lucide-react"
import { useAuth } from "@/features/authentication/hooks/useAuth"

import { DistributedHealthLogo } from "@/components/brand/distributed-health-logo"
import { AuthFooter } from "@/components/layout/auth-footer"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

type LoginErrors = {
  email?: string
  password?: string
}

type LabelWithMarkerProps = {
  label: string
  required?: boolean
}

function LabelWithMarker({ label, required = false }: LabelWithMarkerProps) {
  return (
    <span className="label flex items-center justify-between gap-2">
      <span>{label}</span>
      {required ? (
        <span className="label-sm text-destructive" aria-label="Required field">
          *
        </span>
      ) : (
        <span className="label-sm text-muted-foreground">Optional</span>
      )}
    </span>
  )
}

export default function LoginPage() {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberDevice, setRememberDevice] = useState(false)
  const [errors, setErrors] = useState<LoginErrors>({})
  const { isSubmitting, submitError, login } = useAuth()

  const validate = (): LoginErrors => {
    const nextErrors: LoginErrors = {}

    if (!email.trim()) {
      nextErrors.email = "Email address is required."
    } else if (!EMAIL_PATTERN.test(email.trim())) {
      nextErrors.email = "Please enter a valid email address."
    }

    if (!password) {
      nextErrors.password = "Password is required."
    }

    return nextErrors
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const nextErrors = validate()
    setErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) return

    await login({ email, password })
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-card/90 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-5">
          <DistributedHealthLogo />

          <div className="flex items-center gap-3 helper-text">
            <span className="hidden sm:inline">New to Distributed Health?</span>
            <Link
              href="/sign-up"
              className="rounded-xl bg-secondary px-5 py-2.5 label text-secondary-foreground transition hover:bg-secondary/80"
            >
              Create Account
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-10 px-6 py-12 lg:grid-cols-[minmax(420px,1fr)_minmax(420px,560px)] lg:items-start lg:gap-12">
        <section className="space-y-8 lg:pr-8">
          <div>
            <Badge className="rounded-full bg-emerald-700 px-4 py-1 text-[11px] tracking-wide text-white hover:bg-emerald-700">
              SECURE CLINICAL ACCESS
            </Badge>

            <h1 className="mt-4 h1 text-[2.75rem] text-foreground">
              Welcome back to
              <span
                className="block bg-clip-text text-transparent"
                style={{
                  backgroundImage:
                    "linear-gradient(146deg, #0b1c30 0%, #0065a1 52%, #0b1c30 100%)",
                }}
              >
                precision care.
              </span>
            </h1>

            <p className="mt-5 max-w-lg body-base text-muted-foreground">
              Patients and clinicians use the same secure sign-in. After you authenticate, you are
              routed to the workspace that matches your account.
            </p>
          </div>

          <div className="space-y-4">
            <article className="rounded-xl border border-border bg-card p-6">
              <div className="flex items-start gap-4">
                <span className="mt-0.5 rounded-lg bg-secondary p-2 text-primary">
                  <Brain className="h-5 w-5" />
                </span>
                <div>
                  <h2 className="h4 text-foreground">Unified health workspace</h2>
                  <p className="mt-1 body-base leading-6 text-muted-foreground">
                    AI-assisted tools and clinical workflows in one place—whether you are managing
                    care or receiving it.
                  </p>
                </div>
              </div>
            </article>

            <article className="rounded-xl border border-border bg-card p-6">
              <div className="flex items-start gap-4">
                <span className="mt-0.5 rounded-lg bg-secondary p-2 text-success">
                  <ShieldCheck className="h-5 w-5" />
                </span>
                <div>
                  <h2 className="h4 text-foreground">Privacy-first by design</h2>
                  <p className="mt-1 body-base leading-6 text-muted-foreground">
                    Enterprise-grade encryption and role-based access keep sensitive health data
                    protected at every step.
                  </p>
                </div>
              </div>
            </article>
          </div>

          <div
            className="relative min-h-64 overflow-hidden rounded-2xl bg-cover bg-center p-8 text-primary-foreground"
            style={{
              backgroundImage:
                "linear-gradient(180deg, rgba(0,71,141,0) 20%, rgba(0,71,141,0.7) 100%), url('/assets/images/auth/doctor-tablet.svg')",
            }}
          >
            <div className="absolute inset-0 bg-linear-to-tr from-[#0b1c30]/30 via-[#0065a1]/20 to-[#0b1c30]/40" />
            <div className="relative z-10 flex min-h-48 flex-col justify-end">
              <p className="max-w-md body-lg leading-6 text-primary-foreground/90">
                &quot;One login for patients and clinicians keeps every encounter connected.&quot;
              </p>
              <p className="mt-3 body-sm text-primary-foreground/80">
                — Distributed Health Platform
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-[28px] border border-border bg-card p-8 shadow-sm md:p-10">
          <div className="text-center">
            <h2 className="h2 text-foreground">Sign In</h2>
            <p className="mt-2 body-sm text-muted-foreground">
              Enter your email and password to continue
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit} noValidate>
            <label className="block space-y-2">
              <LabelWithMarker label="Email Address" required />
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="email"
                  autoComplete="email"
                  className="h-12 rounded-xl border-input bg-card pl-9 placeholder:text-muted-foreground"
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
                <p className="helper-text text-destructive">{errors.email}</p>
              ) : null}
            </label>

            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <LabelWithMarker label="Password" required />
                <Link
                  href="#"
                  className="label-sm text-primary underline-offset-4 hover:underline"
                  onClick={(e) => e.preventDefault()}
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <LockKeyhole className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type={isPasswordVisible ? "text" : "password"}
                  autoComplete="current-password"
                  className="h-12 rounded-xl border-input bg-card px-9 placeholder:text-muted-foreground"
                  placeholder="Enter your password"
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
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition hover:text-foreground"
                  aria-label={isPasswordVisible ? "Hide password" : "Show password"}
                >
                  {isPasswordVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password ? (
                <p className="helper-text text-destructive">{errors.password}</p>
              ) : null}
            </div>

            <label className="flex cursor-pointer items-center gap-3 body-sm text-muted-foreground">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-input text-primary focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                checked={rememberDevice}
                onChange={(event) => setRememberDevice(event.target.checked)}
              />
              Keep me signed in on this device
            </label>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="mt-1 h-14 w-full gap-2 rounded-2xl h4 text-primary-foreground"
              style={{
                backgroundImage:
                  "linear-gradient(122deg, #021f3a 0%, #005c92 52%, #021f3a 100%)",
              }}
            >
              {isSubmitting ? (
                "Signing in..."
              ) : (
                <>
                  Sign in
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>

            {submitError ? <p className="helper-text text-destructive">{submitError}</p> : null}
          </form>

          <p className="mt-8 text-center body-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link href="/sign-up" className="label text-primary hover:text-secondary-foreground">
              Create an account
            </Link>
          </p>

          <p className="mt-6 text-center helper-text leading-5">
            By signing in, you agree to our{" "}
            <Link href="#" className="label text-primary hover:text-secondary-foreground">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="#" className="label text-primary hover:text-secondary-foreground">
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
