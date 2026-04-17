"use client"

import { useEffect, useState } from "react"
import { AlertCircle, Loader2, Plus, Save, Trash2 } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { getMyAvailability, putMyAvailability, type AvailabilitySchedule } from "../../lib/availability.api"

// ── Types ─────────────────────────────────────────────────────────────────────

interface TimeWindow {
  start: string
  end: string
}

interface DaySchedule {
  windows: TimeWindow[]
  breaks: TimeWindow[]
}

interface ScheduleState {
  timezone: string
  slotDurationMinutes: 30 | 60
  effectiveFrom: string
  effectiveTo: string
  isActive: boolean
  days: Record<number, DaySchedule> // keyed by dayOfWeek: 0=Sun … 6=Sat
}

// ── Constants ─────────────────────────────────────────────────────────────────

const DAYS: { label: string; short: string; dow: number }[] = [
  { label: "Monday", short: "Mon", dow: 1 },
  { label: "Tuesday", short: "Tue", dow: 2 },
  { label: "Wednesday", short: "Wed", dow: 3 },
  { label: "Thursday", short: "Thu", dow: 4 },
  { label: "Friday", short: "Fri", dow: 5 },
  { label: "Saturday", short: "Sat", dow: 6 },
  { label: "Sunday", short: "Sun", dow: 0 },
]

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
  "Asia/Colombo",
  "Asia/Tokyo",
  "Australia/Sydney",
]

// ── Helpers ───────────────────────────────────────────────────────────────────

function emptyDays(): Record<number, DaySchedule> {
  const d: Record<number, DaySchedule> = {}
  for (let i = 0; i <= 6; i++) d[i] = { windows: [], breaks: [] }
  return d
}

function fromApiSchedule(api: AvailabilitySchedule): ScheduleState {
  const days = emptyDays()
  for (const rule of api.weeklyRules) {
    days[rule.dayOfWeek].windows = rule.windows.map((w) => ({ start: w.start, end: w.end }))
  }
  for (const b of api.breakRules ?? []) {
    days[b.dayOfWeek].breaks.push({ start: b.start, end: b.end })
  }
  return {
    timezone: api.timezone,
    slotDurationMinutes: api.slotDurationMinutes,
    effectiveFrom: api.effectiveFrom ?? "",
    effectiveTo: api.effectiveTo ?? "",
    isActive: api.isActive ?? true,
    days,
  }
}

function toApiPayload(state: ScheduleState): AvailabilitySchedule {
  const weeklyRules = Object.entries(state.days)
    .filter(([, d]) => d.windows.length > 0)
    .map(([dow, d]) => ({
      dayOfWeek: Number(dow),
      windows: d.windows,
    }))

  const breakRules = Object.entries(state.days).flatMap(([dow, d]) =>
    d.breaks.map((b) => ({ dayOfWeek: Number(dow), start: b.start, end: b.end })),
  )

  return {
    timezone: state.timezone,
    slotDurationMinutes: state.slotDurationMinutes,
    weeklyRules,
    breakRules,
    dateOverrides: [],
    ...(state.effectiveFrom ? { effectiveFrom: state.effectiveFrom } : {}),
    ...(state.effectiveTo ? { effectiveTo: state.effectiveTo } : {}),
    isActive: state.isActive,
  }
}

// ── Sub-components ────────────────────────────────────────────────────────────

interface WindowRowProps {
  window: TimeWindow
  label: string
  onChange: (updated: TimeWindow) => void
  onRemove: () => void
}

function WindowRow({ window, label, onChange, onRemove }: WindowRowProps) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-border bg-muted/30 px-4 py-3">
      <span className="label-sm w-14 shrink-0 text-muted-foreground">{label}</span>
      <div className="flex flex-1 flex-wrap items-center gap-2">
        <div className="flex items-center gap-2">
          <Label htmlFor={`${label}-start`} className="sr-only">Start</Label>
          <Input
            id={`${label}-start`}
            type="time"
            value={window.start}
            onChange={(e) => onChange({ ...window, start: e.target.value })}
            className="h-9 w-32 font-mono text-sm"
          />
        </div>
        <span className="label-sm text-muted-foreground">to</span>
        <div className="flex items-center gap-2">
          <Label htmlFor={`${label}-end`} className="sr-only">End</Label>
          <Input
            id={`${label}-end`}
            type="time"
            value={window.end}
            onChange={(e) => onChange({ ...window, end: e.target.value })}
            className="h-9 w-32 font-mono text-sm"
          />
        </div>
      </div>
      <button
        type="button"
        onClick={onRemove}
        className="text-muted-foreground transition hover:text-destructive"
        aria-label="Remove"
      >
        <Trash2 className="size-4" />
      </button>
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

export function AvailabilityScheduler() {
  const [state, setState] = useState<ScheduleState | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    getMyAvailability()
      .then((api) => setState(fromApiSchedule(api)))
      .catch(() => setLoadError("Could not load your availability. Please refresh."))
      .finally(() => setIsLoading(false))
  }, [])

  const updateDay = (dow: number, patch: Partial<DaySchedule>) => {
    setState((prev) =>
      prev
        ? { ...prev, days: { ...prev.days, [dow]: { ...prev.days[dow], ...patch } } }
        : prev,
    )
  }

  const addWindow = (dow: number) =>
    updateDay(dow, { windows: [...state!.days[dow].windows, { start: "09:00", end: "17:00" }] })

  const updateWindow = (dow: number, idx: number, updated: TimeWindow) => {
    const windows = state!.days[dow].windows.map((w, i) => (i === idx ? updated : w))
    updateDay(dow, { windows })
  }

  const removeWindow = (dow: number, idx: number) => {
    const windows = state!.days[dow].windows.filter((_, i) => i !== idx)
    updateDay(dow, { windows })
  }

  const addBreak = (dow: number) =>
    updateDay(dow, { breaks: [...state!.days[dow].breaks, { start: "12:00", end: "13:00" }] })

  const updateBreak = (dow: number, idx: number, updated: TimeWindow) => {
    const breaks = state!.days[dow].breaks.map((b, i) => (i === idx ? updated : b))
    updateDay(dow, { breaks })
  }

  const removeBreak = (dow: number, idx: number) => {
    const breaks = state!.days[dow].breaks.filter((_, i) => i !== idx)
    updateDay(dow, { breaks })
  }

  const handleSave = async () => {
    if (!state) return
    const payload = toApiPayload(state)
    if (payload.weeklyRules.length === 0) {
      toast.error("Add at least one availability window before saving.")
      return
    }
    setIsSaving(true)
    try {
      await putMyAvailability(payload)
      toast.success("Availability saved.")
    } catch {
      toast.error("Failed to save availability. Please try again.")
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center gap-3 py-24 text-muted-foreground">
          <Loader2 className="size-5 animate-spin" />
          <span className="body-sm">Loading your schedule…</span>
        </CardContent>
      </Card>
    )
  }

  if (loadError || !state) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center gap-3 py-24 text-destructive">
          <AlertCircle className="size-5 shrink-0" />
          <span className="body-sm">{loadError ?? "Something went wrong."}</span>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <CardTitle className="h4">Weekly availability</CardTitle>
          <p className="helper-text mt-1 text-muted-foreground">
            Define the time windows you are available each day. Add breaks within those windows as needed.
          </p>
        </div>
        <Button type="button" onClick={handleSave} disabled={isSaving} className="shrink-0 gap-2">
          {isSaving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
          {isSaving ? "Saving…" : "Save schedule"}
        </Button>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Settings row */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-2">
            <Label htmlFor="tz">Timezone</Label>
            <select
              id="tz"
              value={state.timezone}
              onChange={(e) => setState((s) => s ? { ...s, timezone: e.target.value } : s)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {COMMON_TIMEZONES.map((tz) => (
                <option key={tz} value={tz}>{tz}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="slot">Slot length (min)</Label>
            <select
              id="slot"
              value={state.slotDurationMinutes}
              onChange={(e) =>
                setState((s) =>
                  s ? { ...s, slotDurationMinutes: Number(e.target.value) === 60 ? 60 : 30 } : s,
                )
              }
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value={30}>30</option>
              <option value={60}>60</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="eff-from">Effective from</Label>
            <Input
              id="eff-from"
              type="date"
              value={state.effectiveFrom}
              onChange={(e) => setState((s) => s ? { ...s, effectiveFrom: e.target.value } : s)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="eff-to">Effective to</Label>
            <Input
              id="eff-to"
              type="date"
              value={state.effectiveTo}
              onChange={(e) => setState((s) => s ? { ...s, effectiveTo: e.target.value } : s)}
            />
          </div>
        </div>

        {/* Day tabs */}
        <Tabs defaultValue="1">
          <TabsList className="mb-4 flex h-auto flex-wrap gap-1">
            {DAYS.map(({ short, dow }) => {
              const hasWindows = state.days[dow].windows.length > 0
              return (
                <TabsTrigger key={dow} value={String(dow)} className="gap-1.5">
                  {short}
                  {hasWindows && (
                    <span
                      className="flex h-4 w-4 items-center justify-center rounded-full bg-primary text-primary-foreground"
                      style={{ fontSize: "10px" }}
                    >
                      {state.days[dow].windows.length}
                    </span>
                  )}
                </TabsTrigger>
              )
            })}
          </TabsList>

          {DAYS.map(({ label, dow }) => {
            const day = state.days[dow]
            return (
              <TabsContent key={dow} value={String(dow)} className="space-y-6">
                {/* Availability windows */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="label text-foreground">Availability windows</h4>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="gap-1.5"
                      onClick={() => addWindow(dow)}
                    >
                      <Plus className="size-3.5" />
                      Add window
                    </Button>
                  </div>

                  {day.windows.length === 0 ? (
                    <p className="rounded-lg border border-dashed border-border py-6 text-center body-sm text-muted-foreground">
                      No windows set — {label} is off.
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {day.windows.map((w, i) => (
                        <WindowRow
                          key={i}
                          label={`Window ${i + 1}`}
                          window={w}
                          onChange={(updated) => updateWindow(dow, i, updated)}
                          onRemove={() => removeWindow(dow, i)}
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* Break rules */}
                <div className="space-y-3 border-t border-border pt-5">
                  <div className="flex items-center justify-between">
                    <h4 className="label text-foreground">Breaks</h4>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="gap-1.5"
                      onClick={() => addBreak(dow)}
                      disabled={day.windows.length === 0}
                    >
                      <Plus className="size-3.5" />
                      Add break
                    </Button>
                  </div>

                  {day.breaks.length === 0 ? (
                    <p className="body-sm text-muted-foreground">No breaks configured.</p>
                  ) : (
                    <div className="space-y-2">
                      {day.breaks.map((b, i) => (
                        <WindowRow
                          key={i}
                          label={`Break ${i + 1}`}
                          window={b}
                          onChange={(updated) => updateBreak(dow, i, updated)}
                          onRemove={() => removeBreak(dow, i)}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </TabsContent>
            )
          })}
        </Tabs>
      </CardContent>
    </Card>
  )
}
