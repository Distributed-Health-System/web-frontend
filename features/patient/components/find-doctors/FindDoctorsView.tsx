"use client"

import { useMemo, useState } from "react"
import { Calendar, Clock, Search, Stethoscope } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
import { doctors, getDoctorSpecialties } from "@/lib/mock-data"
import type { Doctor } from "@/lib/types"

function matchesSearch(doctor: Doctor, query: string): boolean {
  if (!query.trim()) return true
  const q = query.trim().toLowerCase()
  return (
    doctor.name.toLowerCase().includes(q) ||
    doctor.specialty.toLowerCase().includes(q) ||
    doctor.bio.toLowerCase().includes(q)
  )
}

export function FindDoctorsView() {
  const specialties = useMemo(() => getDoctorSpecialties(), [])
  const [query, setQuery] = useState("")
  const [specialtyFilter, setSpecialtyFilter] = useState<string>("all")
  const [selected, setSelected] = useState<Doctor | null>(null)

  const filtered = useMemo(() => {
    return doctors.filter((d) => {
      if (specialtyFilter !== "all" && d.specialty !== specialtyFilter) return false
      return matchesSearch(d, query)
    })
  }, [query, specialtyFilter])

  return (
    <>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between sm:gap-6">
        <div className="relative min-w-0 flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name, specialty, or keywords…"
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
              <option key={s} value={s}>
                {s}
              </option>
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
          No doctors match your search. Try a different keyword or clear the specialization filter.
        </div>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((doctor) => (
            <li key={doctor.id}>
              <button
                type="button"
                onClick={() => setSelected(doctor)}
                className="h-full w-full text-left transition hover:opacity-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-4xl"
              >
                <Card className="h-full min-h-[200px] cursor-pointer shadow-sm transition hover:shadow-md hover:ring-2 hover:ring-primary/15">
                  <CardHeader className="gap-3">
                    <div className="flex items-start gap-3">
                      <Avatar className="size-14 shrink-0">
                        <AvatarImage src={doctor.avatar} alt="" />
                        <AvatarFallback className="bg-secondary text-lg text-secondary-foreground">
                          {doctor.name
                            .replace("Dr. ", "")
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1 space-y-1">
                        <CardTitle className="text-base leading-snug">{doctor.name}</CardTitle>
                        <div className="flex flex-wrap gap-1.5">
                          <Badge variant="secondary" className="font-normal">
                            <Stethoscope className="mr-1 size-3" aria-hidden />
                            {doctor.specialty}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <CardDescription className="line-clamp-2 text-left">{doctor.bio}</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="helper-text flex items-center gap-1.5 text-muted-foreground">
                      <Clock className="size-3.5 shrink-0" aria-hidden />
                      {doctor.availableSlots.length} video slots this week
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
          {selected ? (
            <>
              <SheetHeader className="space-y-4 border-b border-border pb-6 text-left">
                <div className="flex items-start gap-4">
                  <Avatar className="size-20">
                    <AvatarImage src={selected.avatar} alt="" />
                    <AvatarFallback className="bg-secondary text-xl text-secondary-foreground">
                      {selected.name
                        .replace("Dr. ", "")
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1 space-y-2">
                    <SheetTitle className="text-xl leading-tight">{selected.name}</SheetTitle>
                    <Badge variant="secondary" className="font-normal">
                      {selected.specialty}
                    </Badge>
                  </div>
                </div>
                <SheetDescription asChild>
                  <p className="body-base leading-relaxed text-muted-foreground">{selected.bio}</p>
                </SheetDescription>
              </SheetHeader>

              <div className="flex flex-1 flex-col gap-6 overflow-y-auto px-6 py-6">
                <section>
                  <h3 className="label mb-2 flex items-center gap-2 text-foreground">
                    <Clock className="size-4" aria-hidden />
                    Sample video visit times
                  </h3>
                  <ul className="flex flex-wrap gap-2">
                    {selected.availableSlots.map((slot) => (
                      <li key={slot}>
                        <span className="inline-flex rounded-lg border border-border bg-muted/50 px-2.5 py-1 font-mono text-xs text-foreground">
                          {slot}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <p className="helper-text mt-2 text-muted-foreground">
                    Live scheduling will show video visit slots from your booking API.
                  </p>
                </section>

                <section>
                  <h3 className="label mb-2 flex items-center gap-2 text-foreground">
                    <Calendar className="size-4" aria-hidden />
                    Next steps
                  </h3>
                  <p className="body-sm text-muted-foreground">
                    You can book a video consultation with this provider once appointments are
                    connected—we currently support video visits only.
                  </p>
                </section>
              </div>

              <SheetFooter className="border-t border-border sm:flex-col sm:space-x-0">
                <Button type="button" className="w-full" disabled>
                  Request video appointment
                </Button>
                <p className="helper-text text-center text-muted-foreground">
                  Video visit booking will activate when your appointments service is wired.
                </p>
              </SheetFooter>
            </>
          ) : null}
        </SheetContent>
      </Sheet>
    </>
  )
}
