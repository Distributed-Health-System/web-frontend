"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { format, parseISO } from "date-fns"
import { CalendarDays, Search, Video } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { mockPatientAppointments } from "../../lib/mock-data"
import type { PatientAppointment, PatientAppointmentStatus } from "../../types"
import { cn } from "@/lib/utils"

type FilterKey = "all" | "upcoming" | "past"

function isPastAppointment(status: PatientAppointmentStatus): boolean {
  return status === "completed" || status === "cancelled"
}

function statusBadgeClass(status: PatientAppointmentStatus): string {
  switch (status) {
    case "upcoming":
      return "bg-primary/15 text-primary border-primary/20"
    case "completed":
      return "bg-muted text-muted-foreground border-border"
    case "cancelled":
      return "bg-destructive/10 text-destructive border-destructive/20"
    default:
      return ""
  }
}

function sortAppointments(list: PatientAppointment[]): PatientAppointment[] {
  return [...list].sort((a, b) => {
    const da = parseISO(a.date).getTime()
    const db = parseISO(b.date).getTime()
    if (a.status === "upcoming" && b.status !== "upcoming") return -1
    if (a.status !== "upcoming" && b.status === "upcoming") return 1
    if (a.status === "upcoming" && b.status === "upcoming") return da - db
    return db - da
  })
}

export function PatientAppointmentsView() {
  const [filter, setFilter] = useState<FilterKey>("all")
  const [query, setQuery] = useState("")

  const filtered = useMemo(() => {
    let list = mockPatientAppointments

    if (filter === "upcoming") {
      list = list.filter((a) => a.status === "upcoming")
    } else if (filter === "past") {
      list = list.filter((a) => isPastAppointment(a.status))
    }

    const q = query.trim().toLowerCase()
    if (q) {
      list = list.filter(
        (a) =>
          a.doctorName.toLowerCase().includes(q) ||
          (a.specialty?.toLowerCase().includes(q) ?? false)
      )
    }

    return sortAppointments(list)
  }, [filter, query])

  const counts = useMemo(() => {
    const all = mockPatientAppointments.length
    const upcoming = mockPatientAppointments.filter((a) => a.status === "upcoming").length
    const past = mockPatientAppointments.filter((a) => isPastAppointment(a.status)).length
    return { all, upcoming, past }
  }, [])

  const filters: { key: FilterKey; label: string; count: number }[] = [
    { key: "all", label: "All", count: counts.all },
    { key: "upcoming", label: "Upcoming", count: counts.upcoming },
    { key: "past", label: "Past", count: counts.past },
  ]

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-2" role="tablist" aria-label="Filter appointments">
          {filters.map(({ key, label, count }) => (
            <button
              key={key}
              type="button"
              role="tab"
              aria-selected={filter === key}
              onClick={() => setFilter(key)}
              className={cn(
                "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                filter === key
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border bg-card text-muted-foreground hover:bg-muted/50"
              )}
            >
              {label}
              <span
                className={cn(
                  "rounded-full px-2 py-0.5 text-xs tabular-nums",
                  filter === key ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
                )}
              >
                {count}
              </span>
            </button>
          ))}
        </div>

        <div className="relative w-full lg:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by doctor or specialty…"
            className="h-10 pl-9"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search appointments"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center gap-4 py-16 text-center">
            <div className="rounded-full bg-muted p-4">
              <CalendarDays className="size-8 text-muted-foreground" aria-hidden />
            </div>
            <div className="max-w-sm space-y-1">
              <p className="font-medium text-foreground">No appointments here</p>
              <p className="text-sm text-muted-foreground">
                {filter === "upcoming"
                  ? "You have no upcoming video visits. Book a provider to get started."
                  : filter === "past"
                    ? "No past visits match your search."
                    : "Try another search or filter."}
              </p>
            </div>
            {filter === "upcoming" || filter === "all" ? (
              <Button asChild variant="default" className="rounded-xl">
                <Link href="/patient/find-doctors">Find a doctor</Link>
              </Button>
            ) : null}
          </CardContent>
        </Card>
      ) : (
        <ul className="flex flex-col gap-4">
          {filtered.map((a) => {
            const dateLabel = format(parseISO(a.date), "EEEE, MMM d, yyyy")
            const joinHref =
              a.status === "upcoming" && a.type === "video" && (a.sessionId ?? a.id)
                ? `/patient/consultations/${a.sessionId ?? a.id}`
                : null

            return (
              <li key={a.id}>
                <Card className="overflow-hidden shadow-sm transition-shadow hover:shadow-md">
                  <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex min-w-0 flex-1 gap-4">
                      <div
                        className={cn(
                          "flex size-12 shrink-0 items-center justify-center rounded-2xl",
                          a.status === "upcoming" ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground"
                        )}
                      >
                        <Video className="size-5" aria-hidden />
                      </div>
                      <div className="min-w-0 space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="font-medium text-foreground">{a.doctorName}</p>
                          <Badge
                            variant="outline"
                            className={cn("capitalize", statusBadgeClass(a.status))}
                          >
                            {a.status}
                          </Badge>
                          <Badge variant="secondary" className="font-normal">
                            Video visit
                          </Badge>
                        </div>
                        {a.specialty ? (
                          <p className="text-sm text-muted-foreground">{a.specialty}</p>
                        ) : null}
                        <p className="flex flex-wrap items-center gap-x-2 text-sm text-muted-foreground">
                          <span className="inline-flex items-center gap-1">
                            <CalendarDays className="size-3.5 shrink-0 opacity-70" aria-hidden />
                            {dateLabel}
                          </span>
                          <span aria-hidden className="text-border">
                            ·
                          </span>
                          <span>{a.timeSlot}</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex shrink-0 flex-col gap-2 sm:items-end">
                      {joinHref ? (
                        <Button asChild className="w-full rounded-xl sm:w-auto">
                          <Link href={joinHref}>Join video visit</Link>
                        </Button>
                      ) : null}
                      {a.status === "completed" ? (
                        <p className="text-xs text-muted-foreground">Completed video visit</p>
                      ) : null}
                      {a.status === "cancelled" ? (
                        <p className="text-xs text-muted-foreground">This visit was cancelled</p>
                      ) : null}
                    </div>
                  </CardContent>
                </Card>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
