import type {
  DoctorAvailabilitySchedule,
  DoctorBreakRule,
  DoctorWeeklyRule,
  TimeSlot,
  Weekday,
  WeeklyAvailability,
} from "../types"

const WEEKDAYS: Weekday[] = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
]

/** JS weekday: Sunday = 0 … Saturday = 6 (same as doctor-service). */
export const WEEKDAY_TO_JS: Record<Weekday, number> = {
  Monday: 1,
  Tuesday: 2,
  Wednesday: 3,
  Thursday: 4,
  Friday: 5,
  Saturday: 6,
  Sunday: 0,
}

export function hmToMinutes(hm: string): number {
  const [h, m] = hm.split(":").map((x) => parseInt(x, 10))
  if (Number.isNaN(h) || Number.isNaN(m)) return 0
  return h * 60 + m
}

export function minutesToHm(total: number): string {
  const h = Math.floor(total / 60)
  const m = total % 60
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`
}

/** Editable grid range (local same-day times). */
const GRID_START_MIN = 7 * 60
const GRID_END_MIN = 22 * 60

function slotTimesForStep(step: 30 | 60): string[] {
  const out: string[] = []
  for (let m = GRID_START_MIN; m < GRID_END_MIN; m += step) {
    out.push(minutesToHm(m))
  }
  return out
}

function ruleForDay(rules: DoctorWeeklyRule[], dayOfWeek: number): DoctorWeeklyRule | undefined {
  return rules.find((r) => r.dayOfWeek === dayOfWeek)
}

function isInsideBreak(jsDay: number, minute: number, breaks: DoctorBreakRule[]): boolean {
  return breaks.some((b) => {
    if (b.dayOfWeek !== jsDay) return false
    const a = hmToMinutes(b.start)
    const z = hmToMinutes(b.end)
    return minute >= a && minute < z
  })
}

/** Turn doctor-service weekly windows (+ breaks) into per-day toggle slots. */
export function weeklyAvailabilityFromSchedule(
  schedule: DoctorAvailabilitySchedule
): WeeklyAvailability {
  const step = schedule.slotDurationMinutes
  const times = slotTimesForStep(step)
  const breaks = schedule.breakRules ?? []
  const next: WeeklyAvailability = {} as WeeklyAvailability

  for (const day of WEEKDAYS) {
    const jsDay = WEEKDAY_TO_JS[day]
    const rule = ruleForDay(schedule.weeklyRules, jsDay)
    const slots: TimeSlot[] = times.map((time) => {
      const minute = hmToMinutes(time)
      let available = false
      if (rule) {
        for (const w of rule.windows) {
          const a = hmToMinutes(w.start)
          const z = hmToMinutes(w.end)
          if (minute >= a && minute < z) {
            available = true
            break
          }
        }
      }
      if (available && isInsideBreak(jsDay, minute, breaks)) {
        available = false
      }
      return { time, available }
    })
    next[day] = slots
  }
  return next
}

function windowsFromDaySlots(daySlots: TimeSlot[], step: 30 | 60): DoctorWeeklyRule["windows"] {
  const starts = daySlots
    .filter((s) => s.available)
    .map((s) => hmToMinutes(s.time))
    .sort((a, b) => a - b)
  if (starts.length === 0) return []

  const windows: DoctorWeeklyRule["windows"] = []
  let runStart = starts[0]
  let runEnd = starts[0] + step

  for (let i = 1; i < starts.length; i++) {
    if (starts[i] === runEnd) {
      runEnd += step
    } else {
      windows.push({ start: minutesToHm(runStart), end: minutesToHm(runEnd) })
      runStart = starts[i]
      runEnd = starts[i] + step
    }
  }
  windows.push({ start: minutesToHm(runStart), end: minutesToHm(runEnd) })
  return windows
}

export function weeklyRulesFromGrid(
  grid: WeeklyAvailability,
  slotDurationMinutes: 30 | 60
): DoctorWeeklyRule[] {
  const weeklyRules: DoctorWeeklyRule[] = []
  for (const day of WEEKDAYS) {
    const jsDay = WEEKDAY_TO_JS[day]
    const wins = windowsFromDaySlots(grid[day], slotDurationMinutes)
    if (wins.length > 0) {
      weeklyRules.push({ dayOfWeek: jsDay, windows: wins })
    }
  }
  return weeklyRules
}

/** JSON body shape expected by doctor-service `PUT /doctors/me/availability`. */
export function buildPutAvailabilityBody(
  grid: WeeklyAvailability,
  schedule: DoctorAvailabilitySchedule
): Record<string, unknown> {
  return {
    timezone: schedule.timezone,
    slotDurationMinutes: schedule.slotDurationMinutes,
    weeklyRules: weeklyRulesFromGrid(grid, schedule.slotDurationMinutes),
    breakRules: schedule.breakRules ?? [],
    dateOverrides: schedule.dateOverrides ?? [],
    effectiveFrom: schedule.effectiveFrom,
    effectiveTo: schedule.effectiveTo,
    isActive: schedule.isActive,
  }
}
