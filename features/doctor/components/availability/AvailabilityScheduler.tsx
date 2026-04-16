"use client"

import { useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import {
  buildPutAvailabilityBody,
  hmToMinutes,
  weeklyAvailabilityFromSchedule,
  weeklyRulesFromGrid,
} from "../../lib/availability-map"
import { WEEKDAYS, defaultDoctorAvailabilitySchedule } from "../../lib/mock-data"
import type { DoctorAvailabilitySchedule, Weekday, WeeklyAvailability } from "../../types"

const COMMON_TIMEZONES = [
  "UTC",
  "America/New_York",
  "America/Chicago",
  "America/Denver",
  "America/Los_Angeles",
  "Europe/London",
  "Europe/Paris",
  "Asia/Dubai",
  "Asia/Kolkata",
  "Asia/Tokyo",
  "Australia/Sydney",
]

function formatSlotLabel(time: string): string {
  const [h, mi] = time.split(":").map((x) => parseInt(x, 10))
  const period = h >= 12 ? "PM" : "AM"
  const hr = h % 12 === 0 ? 12 : h % 12
  return `${hr}:${String(mi).padStart(2, "0")} ${period}`
}

function getSessionLabel(time: string): string {
  const m = hmToMinutes(time)
  if (m < 12 * 60) return "Morning"
  if (m < 17 * 60) return "Afternoon"
  return "Evening"
}

interface TimeSlotButtonProps {
  time: string
  available: boolean
  onToggle: () => void
}

function TimeSlotButton({ time, available, onToggle }: TimeSlotButtonProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={cn(
        "rounded-lg border px-3 py-2 label-sm transition-colors",
        available
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border bg-background text-foreground hover:bg-accent/50"
      )}
    >
      {formatSlotLabel(time)}
    </button>
  )
}

export function AvailabilityScheduler() {
  const [schedule, setSchedule] = useState<DoctorAvailabilitySchedule>(() => ({
    ...defaultDoctorAvailabilitySchedule,
  }))

  const grid = useMemo(() => weeklyAvailabilityFromSchedule(schedule), [schedule])

  const toggleSlot = (day: Weekday, time: string) => {
    setSchedule((prev) => {
      const g = weeklyAvailabilityFromSchedule(prev)
      const newGrid: WeeklyAvailability = {
        ...g,
        [day]: g[day].map((s) => (s.time === time ? { ...s, available: !s.available } : s)),
      }
      return { ...prev, weeklyRules: weeklyRulesFromGrid(newGrid, prev.slotDurationMinutes) }
    })
  }

  const clearDay = (day: Weekday) => {
    setSchedule((prev) => {
      const g = weeklyAvailabilityFromSchedule(prev)
      const newGrid: WeeklyAvailability = {
        ...g,
        [day]: g[day].map((s) => ({ ...s, available: false })),
      }
      return { ...prev, weeklyRules: weeklyRulesFromGrid(newGrid, prev.slotDurationMinutes) }
    })
  }

  const handleSave = () => {
    const body = buildPutAvailabilityBody(grid, schedule)
    const rules = body.weeklyRules as unknown[]
    if (!rules?.length) {
      toast.error("Add at least one available window (doctor-service requires weeklyRules).")
      return
    }
    toast.success(
      "Schedule matches doctor-service PUT /doctors/me/availability. Send this JSON from your authenticated client when wiring the gateway."
    )
    // eslint-disable-next-line no-console -- dev aid until API client exists
    console.log("[availability PUT body]", JSON.stringify(body, null, 2))
  }

  const groupBySession = (slots: { time: string; available: boolean }[]) => ({
    Morning: slots.filter((s) => getSessionLabel(s.time) === "Morning"),
    Afternoon: slots.filter((s) => getSessionLabel(s.time) === "Afternoon"),
    Evening: slots.filter((s) => getSessionLabel(s.time) === "Evening"),
  })

  return (
    <Card>
      <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <CardTitle className="h4">Set availability</CardTitle>
          <p className="helper-text mt-1 text-muted-foreground">
            Weekly template uses <span className="font-medium">dayOfWeek</span> 0–6 (Sun–Sat),{" "}
            <span className="font-medium">HH:mm</span> windows, optional breaks, and{" "}
            <span className="font-medium">slotDurationMinutes</span> 30 or 60 — same as doctor-service.
          </p>
        </div>
        <Button type="button" onClick={handleSave}>
          Preview save (console)
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-2">
            <Label htmlFor="tz">IANA timezone</Label>
            <select
              id="tz"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              value={schedule.timezone}
              onChange={(e) => setSchedule((s) => ({ ...s, timezone: e.target.value }))}
            >
              {COMMON_TIMEZONES.map((tz) => (
                <option key={tz} value={tz}>
                  {tz}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="slot">Slot length (minutes)</Label>
            <select
              id="slot"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              value={schedule.slotDurationMinutes}
              onChange={(e) =>
                setSchedule((s) => ({
                  ...s,
                  slotDurationMinutes: Number(e.target.value) === 60 ? 60 : 30,
                }))
              }
            >
              <option value={30}>30</option>
              <option value={60}>60</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="eff-from">effectiveFrom (optional)</Label>
            <Input
              id="eff-from"
              type="date"
              value={schedule.effectiveFrom ?? ""}
              onChange={(e) =>
                setSchedule((s) => ({ ...s, effectiveFrom: e.target.value || undefined }))
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="eff-to">effectiveTo (optional)</Label>
            <Input
              id="eff-to"
              type="date"
              value={schedule.effectiveTo ?? ""}
              onChange={(e) =>
                setSchedule((s) => ({ ...s, effectiveTo: e.target.value || undefined }))
              }
            />
          </div>
        </div>

        <p className="helper-text text-muted-foreground">
          Breaks from the loaded template (e.g. lunch) stay in <code className="text-xs">breakRules</code> until you
          edit them in your full editor; toggles respect them on the grid.
        </p>

        <Tabs defaultValue="Monday">
          <TabsList className="mb-6 flex h-auto flex-wrap gap-1">
            {WEEKDAYS.map((day) => {
              const count = grid[day].filter((s) => s.available).length
              return (
                <TabsTrigger key={day} value={day} className="gap-1.5">
                  {day.slice(0, 3)}
                  {count > 0 ? (
                    <span
                      className="flex h-4 w-4 items-center justify-center rounded-full bg-primary text-primary-foreground"
                      style={{ fontSize: "10px" }}
                    >
                      {count}
                    </span>
                  ) : null}
                </TabsTrigger>
              )
            })}
          </TabsList>

          {WEEKDAYS.map((day) => {
            const sessions = groupBySession(grid[day])
            return (
              <TabsContent key={day} value={day} className="flex flex-col gap-6">
                {(Object.entries(sessions) as [string, { time: string; available: boolean }[]][]).map(
                  ([session, slots]) => (
                    <div key={session} className="flex flex-col gap-3">
                      <span className="label text-muted-foreground">{session}</span>
                      <div className="flex flex-wrap gap-2">
                        {slots.map((slot) => (
                          <TimeSlotButton
                            key={slot.time}
                            time={slot.time}
                            available={slot.available}
                            onToggle={() => toggleSlot(day, slot.time)}
                          />
                        ))}
                      </div>
                    </div>
                  )
                )}
                <div className="mt-2 flex items-center gap-4 border-t border-border pt-3">
                  <span className="helper-text">
                    {grid[day].filter((s) => s.available).length} slots selected
                  </span>
                  <button
                    type="button"
                    className="helper-text text-primary hover:underline"
                    onClick={() => clearDay(day)}
                  >
                    Clear day
                  </button>
                </div>
              </TabsContent>
            )
          })}
        </Tabs>
      </CardContent>
    </Card>
  )
}
