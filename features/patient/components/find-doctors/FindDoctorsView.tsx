"use client"

import { useEffect, useMemo, useState } from "react"
import { AlertCircle, Calendar, Loader2, Search, Stethoscope } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { getDoctors, type Doctor } from "@/features/doctor/lib/doctor.api"

function doctorInitials(d: Doctor) {
  return `${d.firstName[0]}${d.lastName[0]}`.toUpperCase()
}

function doctorFullName(d: Doctor) {
  return `Dr. ${d.firstName} ${d.lastName}`
}

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

  useEffect(() => {
    setIsLoading(true)
    getDoctors()
      .then(setDoctors)
      .catch(() => setError("Could not load doctors. Please try again."))
      .finally(() => setIsLoading(false))
  }, [])

  const specialties = useMemo(
    () => Array.from(new Set(doctors.map((d) => d.specialization))).sort(),
    [doctors],
  )

  const filtered = useMemo(() => {
    return doctors.filter((d) => {
      if (specialtyFilter !== "all" && d.specialization !== specialtyFilter) return false
      return matchesSearch(d, query)
    })
  }, [doctors, query, specialtyFilter])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24 gap-3 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin" />
        <span className="body-sm">Loading doctors…</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-24 gap-3 text-destructive">
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
        <div className="flex w-full flex-col gap-1.5 sm:w-56 shrink-0">
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
              <button
                type="button"
                onClick={() => setSelected(doctor)}
                className="h-full w-full text-left rounded-card transition hover:opacity-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <Card className="h-full min-h-[200px] cursor-pointer transition hover:shadow-sm">
                  <CardHeader className="gap-3">
                    <div className="flex items-start gap-3">
                      <Avatar className="size-14 shrink-0">
                        <AvatarFallback className="bg-secondary text-lg text-secondary-foreground">
                          {doctorInitials(doctor)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1 space-y-1">
                        <CardTitle className="text-base leading-snug">
                          {doctorFullName(doctor)}
                        </CardTitle>
                        <div className="flex flex-wrap gap-1.5">
                          <Badge variant="secondary" className="font-normal">
                            <Stethoscope className="mr-1 size-3" aria-hidden />
                            {doctor.specialization}
                          </Badge>
                          {doctor.isAvailable && (
                            <Badge className="bg-success/10 text-success font-normal border-0">
                              Available
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <CardDescription className="line-clamp-2 text-left">
                      {doctor.bio}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="helper-text text-muted-foreground">
                      {doctor.yearsOfExperience} yrs experience
                    </p>
                  </CardContent>
                </Card>
              </button>
            </li>
          ))}
        </ul>
      )}

      <Sheet open={selected !== null} onOpenChange={(open) => !open && setSelected(null)}>
        <SheetContent side="right" className="w-full sm:max-w-md">
          {selected && (
            <>
              <SheetHeader className="space-y-4 border-b border-border pb-6 text-left">
                <div className="flex items-start gap-4">
                  <Avatar className="size-20">
                    <AvatarFallback className="bg-secondary text-xl text-secondary-foreground">
                      {doctorInitials(selected)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1 space-y-2">
                    <SheetTitle className="text-xl leading-tight">
                      {doctorFullName(selected)}
                    </SheetTitle>
                    <div className="flex gap-2 flex-wrap">
                      <Badge variant="secondary" className="font-normal">
                        {selected.specialization}
                      </Badge>
                      {selected.isAvailable && (
                        <Badge className="bg-success/10 text-success font-normal border-0">
                          Available
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                <SheetDescription asChild>
                  <p className="body-base leading-relaxed text-muted-foreground">{selected.bio}</p>
                </SheetDescription>
              </SheetHeader>

              <div className="flex flex-1 flex-col gap-6 overflow-y-auto px-6 py-6">
                <section className="space-y-2">
                  <h3 className="label flex items-center gap-2 text-foreground">
                    <Stethoscope className="size-4" />
                    Details
                  </h3>
                  <dl className="space-y-1 body-sm text-muted-foreground">
                    <div className="flex justify-between">
                      <dt>Experience</dt>
                      <dd className="text-foreground">{selected.yearsOfExperience} years</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt>License</dt>
                      <dd className="text-foreground font-mono text-xs">{selected.licenseNumber}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt>Contact</dt>
                      <dd className="text-foreground">{selected.phone || selected.email}</dd>
                    </div>
                  </dl>
                </section>

                <section>
                  <h3 className="label mb-2 flex items-center gap-2 text-foreground">
                    <Calendar className="size-4" />
                    Next steps
                  </h3>
                  <p className="body-sm text-muted-foreground">
                    You can book a video consultation with this provider once appointments are
                    connected.
                  </p>
                </section>
              </div>

              <SheetFooter className="border-t border-border sm:flex-col sm:space-x-0">
                <Button type="button" className="w-full" disabled={!selected.isAvailable}>
                  {selected.isAvailable ? "Request appointment" : "Not available"}
                </Button>
                <p className="helper-text text-center text-muted-foreground">
                  Appointment booking will activate when the service is wired.
                </p>
              </SheetFooter>
            </>
          )}
        </SheetContent>
      </Sheet>
    </>
  )
}
