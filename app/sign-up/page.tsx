"use client"

import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"
import {
  AlertTriangle,
  Brain,
  BriefcaseMedical,
  Calendar,
  Eye,
  EyeOff,
  HeartPulse,
  IdCard,
  LockKeyhole,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  Stethoscope,
  UserRound,
} from "lucide-react"

import { DistributedHealthLogo } from "@/components/brand/distributed-health-logo"
import { AuthFooter } from "@/components/layout/auth-footer"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

// Basic email shape validation for client-side checks.
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
// Mirrors patient-service CreatePatientDto phone rules (optional when set).
const PHONE_PATTERN = /^[+()\-.\s0-9]{7,20}$/
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? ""

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"] as const

type SignUpErrors = {
  firstName?: string
  lastName?: string
  email?: string
  password?: string
  confirmPassword?: string
  phone?: string
  dateOfBirth?: string
  gender?: string
  specialization?: string
  licenseNumber?: string
  yearsOfExperience?: string
  bio?: string
  emergencyContactPhone?: string
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
  const router = useRouter()
  const searchParams = useSearchParams()
  const roleParam = searchParams.get("role")
  const [selectedRole, setSelectedRole] = useState<"patient" | "doctor">(
    roleParam === "doctor" ? "doctor" : "patient"
  )
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false)
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [phone, setPhone] = useState("")
  const [dateOfBirth, setDateOfBirth] = useState("")
  const [gender, setGender] = useState<"" | "male" | "female" | "other">("")
  const [address, setAddress] = useState("")
  const [bloodGroup, setBloodGroup] = useState<(typeof BLOOD_GROUPS)[number] | "">("")
  const [allergies, setAllergies] = useState("")
  const [medicalHistory, setMedicalHistory] = useState("")
  const [emergencyContactName, setEmergencyContactName] = useState("")
  const [emergencyContactPhone, setEmergencyContactPhone] = useState("")
  const [specialization, setSpecialization] = useState("")
  const [licenseNumber, setLicenseNumber] = useState("")
  const [yearsOfExperience, setYearsOfExperience] = useState("")
  const [bio, setBio] = useState("")
  const [errors, setErrors] = useState<SignUpErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null)

  // Keep lightweight client validation close to the form for fast feedback.
  const validate = (): SignUpErrors => {
    const nextErrors: SignUpErrors = {}

    if (!firstName.trim()) {
      nextErrors.firstName = "First name is required."
    }
    if (!lastName.trim()) {
      nextErrors.lastName = "Last name is required."
    }

    if (selectedRole === "patient") {
      if (!dateOfBirth) {
        nextErrors.dateOfBirth = "Date of birth is required."
      } else {
        const parsed = new Date(dateOfBirth)
        if (Number.isNaN(parsed.getTime())) {
          nextErrors.dateOfBirth = "Enter a valid date of birth."
        } else {
          const startOfToday = new Date()
          startOfToday.setHours(0, 0, 0, 0)
          if (parsed > startOfToday) {
            nextErrors.dateOfBirth = "Date of birth cannot be in the future."
          }
        }
      }
      if (!gender) {
        nextErrors.gender = "Select a gender."
      }
      if (phone.trim() && !PHONE_PATTERN.test(phone.trim())) {
        nextErrors.phone = "Use 7–20 digits/symbols: + ( ) . - spaces."
      }
      if (emergencyContactPhone.trim() && !PHONE_PATTERN.test(emergencyContactPhone.trim())) {
        nextErrors.emergencyContactPhone = "Use 7–20 digits/symbols: + ( ) . - spaces."
      }
    } else {
      if (!specialization.trim()) {
        nextErrors.specialization = "Specialization is required."
      }
      if (!licenseNumber.trim()) {
        nextErrors.licenseNumber = "License number is required."
      }
      if (yearsOfExperience.trim()) {
        const parsed = Number(yearsOfExperience)
        if (Number.isNaN(parsed) || parsed < 0) {
          nextErrors.yearsOfExperience = "Years of experience must be 0 or greater."
        }
      }
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

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    // Stop submit until all inputs pass local validation rules.
    const nextErrors = validate()
    setErrors(nextErrors)
    setSubmitError(null)
    setSubmitSuccess(null)

    if (Object.keys(nextErrors).length > 0) {
      return
    }

    if (selectedRole === "patient") {
      setSubmitSuccess(
        "Your patient profile details look good. Backend signup will be connected next—you can sign in once it is available."
      )
      return
    }

    if (!API_BASE_URL) {
      setSubmitError("Missing NEXT_PUBLIC_API_URL. Add it in .env.local before signing up.")
      return
    }

    const doctorPayload: Record<string, string | number> = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim(),
      password,
      specialization: specialization.trim(),
      licenseNumber: licenseNumber.trim(),
    }

    if (phone.trim()) doctorPayload.phone = phone.trim()
    if (bio.trim()) doctorPayload.bio = bio.trim()
    if (yearsOfExperience.trim()) doctorPayload.yearsOfExperience = Number(yearsOfExperience)

    try {
      setIsSubmitting(true)
      const response = await fetch(`${API_BASE_URL}/doctors`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(doctorPayload),
      })

      if (!response.ok) {
        let message = "Doctor signup failed. Please try again."
        try {
          const errorBody = await response.json()
          if (typeof errorBody?.message === "string") {
            message = errorBody.message
          } else if (Array.isArray(errorBody?.message)) {
            message = errorBody.message.join(", ")
          }
        } catch {
          // Keep fallback message if body is not JSON.
        }
        setSubmitError(message)
        return
      }

      setSubmitSuccess("Doctor account created. Awaiting admin approval. Redirecting to login...")
      setTimeout(() => {
        router.push("/login")
      }, 1200)
    } catch {
      setSubmitError("Unable to reach signup service. Check API gateway and try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-card/90 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-5">
          <DistributedHealthLogo />

          <div className="flex items-center gap-3 helper-text">
            <span className="hidden sm:inline">Already have an account?</span>
            <Link
              href="/login"
              className="rounded-xl bg-secondary px-5 py-2.5 label text-secondary-foreground transition hover:bg-secondary/80"
            >
              Sign In
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-10 px-6 py-12 lg:grid-cols-[minmax(420px,1fr)_minmax(420px,560px)] lg:items-start lg:gap-12">
        <section className="space-y-8 lg:pr-8">
          <div>
            <Badge className="rounded-full bg-emerald-700 px-4 py-1 text-[11px] tracking-wide text-white hover:bg-emerald-700">
              AI-POWERED PRECISION
            </Badge>

            <h1 className="mt-4 h1 text-[2.75rem] text-foreground">
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

            <p className="mt-5 max-w-lg body-base text-muted-foreground">
              Join the next generation of healthcare. Our AI-enabled platform offers
              instant symptom checking and seamless clinical integration.
            </p>
          </div>

          <div className="space-y-4">
            <article className="rounded-xl border border-border bg-card p-6">
              <div className="flex items-start gap-4">
                <span className="mt-0.5 rounded-lg bg-secondary p-2 text-primary">
                  <Brain className="h-5 w-5" />
                </span>
                <div>
                  <h2 className="h4 text-foreground">AI Symptom Insights</h2>
                  <p className="mt-1 body-base leading-6 text-muted-foreground">
                    Get medically-backed preliminary assessments in seconds using our
                    advanced neural diagnostic engine.
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
                  <h2 className="h4 text-foreground">Privacy First Architecture</h2>
                  <p className="mt-1 body-base leading-6 text-muted-foreground">
                    Your data is encrypted with enterprise-grade security, ensuring complete
                    patient confidentiality.
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
                &quot;The diagnostic precision has improved our patient outcomes by 40%.&quot;
              </p>
              <p className="mt-3 body-sm text-primary-foreground/80">- Dr. Elena Vance, Chief of Medicine</p>
            </div>
          </div>
        </section>

        <section className="rounded-[28px] border border-border bg-card p-8 shadow-sm md:p-10">
          <div className="text-center">
            <h2 className="h2 text-foreground">Create an Account</h2>
            <p className="mt-2 body-sm text-muted-foreground">Select your profile type to begin</p>
          </div>

          <div className="mt-8 grid grid-cols-2 rounded-xl bg-secondary p-1">
            <button
              onClick={() => setSelectedRole("patient")}
              className={`rounded-lg py-2.5 ${
                selectedRole === "patient"
                  ? "bg-card text-primary shadow-xs"
                  : "text-muted-foreground"
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
                  ? "bg-card text-primary shadow-xs"
                  : "text-muted-foreground"
              }`}
              type="button"
              aria-pressed={selectedRole === "doctor"}
            >
              Doctor
            </button>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit} noValidate>
            <div className="grid gap-6 md:grid-cols-2">
              <label className="block space-y-2">
                <LabelWithMarker label="First Name" required />
                <div className="relative">
                  <UserRound className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    className="h-12 rounded-xl border-input bg-card pl-9 placeholder:text-muted-foreground"
                    placeholder="First name"
                    value={firstName}
                    onChange={(event) => {
                      setFirstName(event.target.value)
                      setErrors((current) => ({ ...current, firstName: undefined }))
                    }}
                    aria-invalid={Boolean(errors.firstName)}
                  />
                </div>
                {errors.firstName ? (
                  <p className="helper-text text-destructive">{errors.firstName}</p>
                ) : null}
              </label>

              <label className="block space-y-2">
                <LabelWithMarker label="Last Name" required />
                <div className="relative">
                  <UserRound className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    className="h-12 rounded-xl border-input bg-card pl-9 placeholder:text-muted-foreground"
                    placeholder="Last name"
                    value={lastName}
                    onChange={(event) => {
                      setLastName(event.target.value)
                      setErrors((current) => ({ ...current, lastName: undefined }))
                    }}
                    aria-invalid={Boolean(errors.lastName)}
                  />
                </div>
                {errors.lastName ? (
                  <p className="helper-text text-destructive">{errors.lastName}</p>
                ) : null}
              </label>
            </div>

            <label className="block space-y-2">
              <LabelWithMarker label="Email Address" required />
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="email"
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

            {selectedRole === "patient" ? (
              <>
                <div className="grid gap-6 md:grid-cols-2">
                  <label className="block space-y-2">
                    <LabelWithMarker label="Date of Birth" required />
                    <div className="relative">
                      <Calendar className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="date"
                        className="h-12 rounded-xl border-input bg-card pl-9 placeholder:text-muted-foreground"
                        value={dateOfBirth}
                        max={new Date().toISOString().slice(0, 10)}
                        onChange={(event) => {
                          setDateOfBirth(event.target.value)
                          setErrors((current) => ({ ...current, dateOfBirth: undefined }))
                        }}
                        aria-invalid={Boolean(errors.dateOfBirth)}
                      />
                    </div>
                    {errors.dateOfBirth ? (
                      <p className="helper-text text-destructive">{errors.dateOfBirth}</p>
                    ) : null}
                  </label>
                  <label className="block space-y-2">
                    <LabelWithMarker label="Gender" required />
                    <select
                      className="flex h-12 w-full rounded-xl border border-input bg-card px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      value={gender}
                      onChange={(event) => {
                        const v = event.target.value
                        setGender(
                          v === "" || v === "male" || v === "female" || v === "other" ? v : ""
                        )
                        setErrors((current) => ({ ...current, gender: undefined }))
                      }}
                      aria-invalid={Boolean(errors.gender)}
                    >
                      <option value="">Select gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                    {errors.gender ? (
                      <p className="helper-text text-destructive">{errors.gender}</p>
                    ) : null}
                  </label>
                </div>

                <label className="block space-y-2">
                  <LabelWithMarker label="Phone Number" />
                  <div className="relative">
                    <Phone className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      className="h-12 rounded-xl border-input bg-card pl-9 placeholder:text-muted-foreground"
                      placeholder="+1 555 000 0000"
                      value={phone}
                      onChange={(event) => {
                        setPhone(event.target.value)
                        setErrors((current) => ({ ...current, phone: undefined }))
                      }}
                      aria-invalid={Boolean(errors.phone)}
                    />
                  </div>
                  {errors.phone ? (
                    <p className="helper-text text-destructive">{errors.phone}</p>
                  ) : null}
                </label>

                <label className="block space-y-2">
                  <LabelWithMarker label="Address" />
                  <div className="relative">
                    <MapPin className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      className="h-12 rounded-xl border-input bg-card pl-9 placeholder:text-muted-foreground"
                      placeholder="Street, city, region"
                      value={address}
                      onChange={(event) => setAddress(event.target.value)}
                    />
                  </div>
                </label>

                <label className="block space-y-2">
                  <LabelWithMarker label="Blood group" />
                  <select
                    className="flex h-12 w-full rounded-xl border border-input bg-card px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    value={bloodGroup}
                    onChange={(event) =>
                      setBloodGroup(event.target.value as typeof bloodGroup)
                    }
                  >
                    <option value="">Prefer not to say</option>
                    {BLOOD_GROUPS.map((g) => (
                      <option key={g} value={g}>
                        {g}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="block space-y-2">
                  <LabelWithMarker label="Allergies" />
                  <div className="relative">
                    <AlertTriangle className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                    <textarea
                      className="min-h-[88px] w-full resize-y rounded-xl border border-input bg-card py-3 pl-9 pr-3 text-sm placeholder:text-muted-foreground ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      placeholder="Comma-separated (e.g. peanuts, penicillin)"
                      value={allergies}
                      onChange={(event) => setAllergies(event.target.value)}
                      rows={3}
                    />
                  </div>
                  <p className="helper-text text-muted-foreground">
                    List known allergies; clinicians review this at intake.
                  </p>
                </label>

                <label className="block space-y-2">
                  <LabelWithMarker label="Medical history" />
                  <div className="relative">
                    <HeartPulse className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                    <textarea
                      className="min-h-[88px] w-full resize-y rounded-xl border border-input bg-card py-3 pl-9 pr-3 text-sm placeholder:text-muted-foreground ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      placeholder="Conditions, surgeries, chronic illnesses (optional)"
                      value={medicalHistory}
                      onChange={(event) => setMedicalHistory(event.target.value)}
                      rows={3}
                    />
                  </div>
                </label>

                <div className="grid gap-6 md:grid-cols-2">
                  <label className="block space-y-2">
                    <LabelWithMarker label="Emergency contact name" />
                    <div className="relative">
                      <UserRound className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        className="h-12 rounded-xl border-input bg-card pl-9 placeholder:text-muted-foreground"
                        placeholder="Full name"
                        value={emergencyContactName}
                        onChange={(event) => setEmergencyContactName(event.target.value)}
                      />
                    </div>
                  </label>
                  <label className="block space-y-2">
                    <LabelWithMarker label="Emergency contact phone" />
                    <div className="relative">
                      <Phone className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        className="h-12 rounded-xl border-input bg-card pl-9 placeholder:text-muted-foreground"
                        placeholder="+1 555 000 0000"
                        value={emergencyContactPhone}
                        onChange={(event) => {
                          setEmergencyContactPhone(event.target.value)
                          setErrors((current) => ({ ...current, emergencyContactPhone: undefined }))
                        }}
                        aria-invalid={Boolean(errors.emergencyContactPhone)}
                      />
                    </div>
                    {errors.emergencyContactPhone ? (
                      <p className="helper-text text-destructive">{errors.emergencyContactPhone}</p>
                    ) : null}
                  </label>
                </div>
              </>
            ) : null}

            {selectedRole === "doctor" ? (
              <>
                <label className="block space-y-2">
                  <LabelWithMarker label="Phone Number" />
                  <div className="relative">
                    <Phone className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      className="h-12 rounded-xl border-input bg-card pl-9 placeholder:text-muted-foreground"
                      placeholder="+1 555 000 0000"
                      value={phone}
                      onChange={(event) => {
                        setPhone(event.target.value)
                        setErrors((current) => ({ ...current, phone: undefined }))
                      }}
                      aria-invalid={Boolean(errors.phone)}
                    />
                  </div>
                </label>
                <div className="grid gap-6 md:grid-cols-2">
                  <label className="block space-y-2">
                    <LabelWithMarker label="Specialization" required />
                    <div className="relative">
                      <Stethoscope className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        className="h-12 rounded-xl border-input bg-card pl-9 placeholder:text-muted-foreground"
                        placeholder="Cardiology"
                        value={specialization}
                        onChange={(event) => {
                          setSpecialization(event.target.value)
                          setErrors((current) => ({ ...current, specialization: undefined }))
                        }}
                        aria-invalid={Boolean(errors.specialization)}
                      />
                    </div>
                    {errors.specialization ? (
                      <p className="helper-text text-destructive">{errors.specialization}</p>
                    ) : null}
                  </label>
                  <label className="block space-y-2">
                    <LabelWithMarker label="License Number" required />
                    <div className="relative">
                      <IdCard className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        className="h-12 rounded-xl border-input bg-card pl-9 placeholder:text-muted-foreground"
                        placeholder="LIC-123456"
                        value={licenseNumber}
                        onChange={(event) => {
                          setLicenseNumber(event.target.value)
                          setErrors((current) => ({ ...current, licenseNumber: undefined }))
                        }}
                        aria-invalid={Boolean(errors.licenseNumber)}
                      />
                    </div>
                    {errors.licenseNumber ? (
                      <p className="helper-text text-destructive">{errors.licenseNumber}</p>
                    ) : null}
                  </label>
                </div>
                <div className="grid gap-6 md:grid-cols-2">
                  <label className="block space-y-2">
                    <LabelWithMarker label="Years of Experience" />
                    <div className="relative">
                      <BriefcaseMedical className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="number"
                        min={0}
                        className="h-12 rounded-xl border-input bg-card pl-9 placeholder:text-muted-foreground"
                        placeholder="0"
                        value={yearsOfExperience}
                        onChange={(event) => {
                          setYearsOfExperience(event.target.value)
                          setErrors((current) => ({ ...current, yearsOfExperience: undefined }))
                        }}
                        aria-invalid={Boolean(errors.yearsOfExperience)}
                      />
                    </div>
                    {errors.yearsOfExperience ? (
                      <p className="helper-text text-destructive">{errors.yearsOfExperience}</p>
                    ) : null}
                  </label>
                  <label className="block space-y-2">
                    <LabelWithMarker label="Professional Bio" />
                    <Input
                      className="h-12 rounded-xl border-input bg-card placeholder:text-muted-foreground"
                      placeholder="Short bio (optional)"
                      value={bio}
                      onChange={(event) => {
                        setBio(event.target.value)
                        setErrors((current) => ({ ...current, bio: undefined }))
                      }}
                      aria-invalid={Boolean(errors.bio)}
                    />
                  </label>
                </div>
              </>
            ) : null}

            <label className="block space-y-2">
              <LabelWithMarker label="Password" required />
              <div className="relative">
                <LockKeyhole className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type={isPasswordVisible ? "text" : "password"}
                  className="h-12 rounded-xl border-input bg-card px-9 placeholder:text-muted-foreground"
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
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition hover:text-foreground"
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
                <p className="helper-text text-destructive">{errors.password}</p>
              ) : null}
            </label>

            <label className="block space-y-2">
              <LabelWithMarker label="Confirm Password" required />
              <div className="relative">
                <LockKeyhole className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type={isConfirmPasswordVisible ? "text" : "password"}
                  className="h-12 rounded-xl border-input bg-card px-9 placeholder:text-muted-foreground"
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
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition hover:text-foreground"
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
                <p className="helper-text text-destructive">{errors.confirmPassword}</p>
              ) : null}
            </label>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="mt-1 h-14 w-full rounded-2xl h4 text-primary-foreground"
              style={{
                backgroundImage:
                  "linear-gradient(122deg, #021f3a 0%, #005c92 52%, #021f3a 100%)",
              }}
            >
              {isSubmitting
                ? "Creating Account..."
                : selectedRole === "doctor"
                  ? "Create Doctor Account"
                  : "Create Patient Account"}
            </Button>
            {submitError ? <p className="helper-text text-destructive">{submitError}</p> : null}
            {submitSuccess ? <p className="helper-text text-success">{submitSuccess}</p> : null}
          </form>

          <div className="relative my-8 flex items-center justify-center">
            <span className="absolute h-px w-full bg-border" aria-hidden="true" />
            <span className="relative bg-card px-4 label text-muted-foreground">
              OR CONTINUE WITH
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <button className="flex h-11 items-center justify-center gap-2 rounded-xl bg-secondary label text-foreground transition hover:bg-secondary/80">
              <GoogleIcon />
              Google
            </button>
            <button className="flex h-11 items-center justify-center gap-2 rounded-xl bg-secondary label text-foreground transition hover:bg-secondary/80">
              <AppleIcon />
              Apple
            </button>
          </div>

          <p className="mt-8 text-center helper-text leading-5">
            By signing up, you agree to our{" "}
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
