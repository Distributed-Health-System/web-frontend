"use client"

import { useEffect, useMemo, useState } from "react"
import { AlertCircle, Loader2, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { getDoctors, type Doctor } from "@/features/doctor/lib/doctor.api"
import { getFreeSlotsForDoctor, type FreeSlot } from "@/features/doctor/lib/availability.api"
import { DoctorCard } from "./DoctorCard"
import { DoctorSheet } from "./DoctorSheet"

function matchesSearch(d: Doctor, query: string): boolean {
  if (!query.trim()) return true
  const q = query.trim().toLowerCase()
  return (
    d.firstName.toLowerCase().includes(q) ||
    d.lastName.toLowerCase().includes(q) ||
    d.specialization.toLowerCase().includes(q) ||
    d.bio.toLowerCase().includes(q)
  )
}

export function FindDoctorsView() {
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [query, setQuery] = useState("")
  const [specialtyFilter, setSpecialtyFilter] = useState("all")
  const [selected, setSelected] = useState<Doctor | null>(null)
  const [freeSlots, setFreeSlots] = useState<FreeSlot[]>([])
  const [slotsLoading, setSlotsLoading] = useState(false)

  useEffect(() => {
    getDoctors()
      .then(setDoctors)
      .catch(() => setError("Could not load doctors. Please try again."))
      .finally(() => setIsLoading(false))
  }, [])

  useEffect(() => {
    if (!selected) { setFreeSlots([]); return }
    const from = new Date()
    const to = new Date(from)
    to.setDate(to.getDate() + 7)
    const fmt = (d: Date) => d.toISOString().split("T")[0]
    setSlotsLoading(true)
    getFreeSlotsForDoctor(selected.userId, fmt(from), fmt(to))
      .then(setFreeSlots)
      .catch(() => setFreeSlots([]))
      .finally(() => setSlotsLoading(false))
  }, [selected])

  const specialties = useMemo(
    () => Array.from(new Set(doctors.map((d) => d.specialization))).sort(),
    [doctors],
  )

  const filtered = useMemo(
    () =>
      doctors.filter((d) => {
        if (specialtyFilter !== "all" && d.specialization !== specialtyFilter) return false
        return matchesSearch(d, query)
      }),
    [doctors, query, specialtyFilter],
  )

  if (isLoading) {
    return (
      <div className="flex items-center justify-center gap-3 py-24 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin" />
        <span className="body-sm">Loading doctors…</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center gap-3 py-24 text-destructive">
        <AlertCircle className="h-5 w-5 shrink-0" />
        <span className="body-sm">{error}</span>
      </div>
    )
  }

  return (
    <>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between sm:gap-6">
        <div className="relative min-w-0 flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name, specialization, or keywords…"
            className="h-11 pl-9"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search doctors"
          />
        </div>
        <div className="flex w-full flex-col gap-1.5 shrink-0 sm:w-56">
          <label htmlFor="specialty-filter" className="label text-muted-foreground">
            Specialization
          </label>
          <select
            id="specialty-filter"
            value={specialtyFilter}
            onChange={(e) => setSpecialtyFilter(e.target.value)}
            className="flex h-11 w-full rounded-xl border border-input bg-card px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <option value="all">All specializations</option>
            {specialties.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      <p className="helper-text text-muted-foreground">
        Showing {filtered.length} of {doctors.length} providers
        {specialtyFilter !== "all" ? ` · ${specialtyFilter}` : ""}
      </p>

      {filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-muted/30 py-16 text-center body-sm text-muted-foreground">
          No doctors match your search. Try a different keyword or clear the filter.
        </div>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((doctor) => (
            <li key={doctor.id}>
              <DoctorCard doctor={doctor} onClick={() => setSelected(doctor)} />
            </li>
          ))}
        </ul>
      )}

      <DoctorSheet
        doctor={selected}
        freeSlots={freeSlots}
        slotsLoading={slotsLoading}
        onClose={() => setSelected(null)}
      />
    </>
  )
}
