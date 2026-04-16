"use client"

import Link from "next/link"
import { BriefcaseMedical, CheckCircle2, Stethoscope, UserRound } from "lucide-react"
import type { ReactNode } from "react"
import { useState } from "react"

import { DistributedHealthLogo } from "@/components/brand/distributed-health-logo"
import { AuthFooter } from "@/components/layout/auth-footer"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

// Role-specific feature bullets shown inside each selection card.
const patientFeatures = ["Book Appointments", "AI Symptom Checker", "Secure Medical Records"]
const doctorFeatures = ["Manage Availability", "Digital Prescriptions", "Patient Telehealth"]

// Reusable card used by both role choices.
function RoleCard({
  onSelect,
  icon,
  title,
  description,
  items,
  selected = false,
}: {
  onSelect: () => void
  icon: ReactNode
  title: string
  description: string
  items: string[]
  selected?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className="block w-full text-left"
    >
      <Card
        className={`rounded-4xl border p-8 transition hover:-translate-y-0.5 ${
          selected
            ? "border-[#0065a1]/20 bg-white shadow-[0_14px_34px_-8px_rgba(0,101,161,0.25)]"
            : "border-slate-100 bg-[#f7f9fb] shadow-[0_12px_32px_-4px_rgba(25,28,30,0.06)] hover:border-slate-200"
        }`}
      >
        <div
          className={`mb-6 flex h-16 w-16 items-center justify-center rounded-2xl ${
            selected ? "bg-[#0065a1]" : "bg-[#e9eff5]"
          }`}
        >
          <span className={selected ? "text-white" : "text-[#006d73]"}>{icon}</span>
        </div>

        <h3 className="text-4xl font-bold tracking-[-0.8px] text-slate-900">{title}</h3>
        <p className="mt-3 text-sm leading-6 text-slate-600">{description}</p>

        <ul className="mt-8 space-y-4">
          {items.map((item) => (
            <li key={item} className="flex items-center gap-3 text-sm text-slate-800">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              {item}
            </li>
          ))}
        </ul>
      </Card>
    </button>
  )
}

export default function RoleSelectionPage() {
  const [selectedRole, setSelectedRole] = useState<"patient" | "doctor">("patient")

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900">
      <header className="border-b border-slate-200/80 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-center px-6 py-5">
          <DistributedHealthLogo />
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-6xl flex-col items-center px-6 py-12 md:py-16">
        <div className="flex items-center gap-4 pb-10">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0065a1] text-sm font-semibold text-white">
              1
            </span>
            <span className="text-sm text-[#0065a1]">Role Selection</span>
          </div>
          <span className="h-px w-10 bg-slate-300" aria-hidden="true" />
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-sky-100 text-sm font-semibold text-slate-600">
              2
            </span>
            <span className="text-sm text-slate-600">Verification</span>
          </div>
        </div>

        <div className="max-w-2xl text-center">
          <h1 className="text-4xl font-bold tracking-[-0.8px] text-slate-900">Choose your journey</h1>
          <p className="mt-3 text-slate-600">
            Welcome to your Clinical Sanctuary. Please select the profile type that best
            describes your needs so we can tailor the experience for you.
          </p>
        </div>

        <div className="mt-12 grid w-full grid-cols-1 gap-8 lg:grid-cols-2">
          <RoleCard
            onSelect={() => setSelectedRole("patient")}
            icon={<UserRound className="h-6 w-6" />}
            title="I am a Patient"
            description="Access world-class healthcare from the comfort of your digital sanctuary."
            items={patientFeatures}
            selected={selectedRole === "patient"}
          />

          <RoleCard
            onSelect={() => setSelectedRole("doctor")}
            icon={<BriefcaseMedical className="h-6 w-6" />}
            title="I am a Doctor"
            description="Manage your practice with precision tools and ethical clarity."
            items={doctorFeatures}
            selected={selectedRole === "doctor"}
          />
        </div>

        <div className="mt-14 w-full max-w-md">
          <Button
            asChild
            className="h-12 w-full rounded-xl text-base text-white"
            style={{
              backgroundImage:
                "linear-gradient(147deg, #0b1c30 0%, #0065a1 50%, #0b1c30 100%)",
            }}
          >
            <Link href={`/sign-up?role=${selectedRole}`}>Continue</Link>
          </Button>

          <p className="mt-5 text-center text-sm text-slate-600">
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-sky-700 hover:text-sky-800">
              Log in here
            </Link>
          </p>

          <div className="mt-4 flex items-center justify-center gap-2 text-sm text-slate-500 lg:hidden">
            <Stethoscope className="h-4 w-4 text-sky-700" />
            Profile selection tailors your clinical workflow.
          </div>
        </div>
      </main>

      <AuthFooter />
    </div>
  )
}
