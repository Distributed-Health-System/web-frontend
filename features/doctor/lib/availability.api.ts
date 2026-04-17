import { apiClient } from "@/lib/api-base"

// ── Types ────────────────────────────────────────────────────────────────────

export interface TimeWindow {
  start: string // "HH:MM"
  end: string   // "HH:MM"
}

export interface WeeklyRule {
  dayOfWeek: number // 0 = Sunday … 6 = Saturday
  windows: TimeWindow[]
}

export interface BreakRule {
  dayOfWeek: number
  start: string // "HH:MM"
  end: string   // "HH:MM"
}

export interface DateOverride {
  date: string    // "YYYY-MM-DD"
  isOff: boolean
  windows?: TimeWindow[]
}

export interface AvailabilitySchedule {
  timezone: string
  slotDurationMinutes: 30 | 60
  weeklyRules: WeeklyRule[]
  breakRules?: BreakRule[]
  dateOverrides?: DateOverride[]
  effectiveFrom?: string // "YYYY-MM-DD"
  effectiveTo?: string   // "YYYY-MM-DD"
  isActive?: boolean
}

export type PatchAvailabilitySchedule = Partial<AvailabilitySchedule>

/** ISO datetime string e.g. "2026-04-20T03:30:00.000Z" */
export type FreeSlot = string

// ── Doctor-facing endpoints (/doctors/me/availability) ────────────────────────
// userId is injected by the gateway from the JWT cookie — no manual header needed.

/** Get the authenticated doctor's availability schedule */
export async function getMyAvailability(): Promise<AvailabilitySchedule> {
  const { data } = await apiClient.get<{ schedule: AvailabilitySchedule }>(
    "/doctors/me/availability",
  )
  return data.schedule
}

/** Full replace of the doctor's availability schedule */
export async function putMyAvailability(
  payload: AvailabilitySchedule,
): Promise<AvailabilitySchedule> {
  const { data } = await apiClient.put<AvailabilitySchedule>(
    "/doctors/me/availability",
    payload,
  )
  return data
}

/** Partial update of the doctor's availability schedule */
export async function patchMyAvailability(
  payload: PatchAvailabilitySchedule,
): Promise<AvailabilitySchedule> {
  const { data } = await apiClient.patch<AvailabilitySchedule>(
    "/doctors/me/availability",
    payload,
  )
  return data
}

/** Add a date override (day off or custom windows for a specific date) */
export async function addAvailabilityOverride(
  override: DateOverride,
): Promise<AvailabilitySchedule> {
  const { data } = await apiClient.post<AvailabilitySchedule>(
    "/doctors/me/availability/overrides",
    override,
  )
  return data
}

/** Remove a date override by date string ("YYYY-MM-DD") */
export async function removeAvailabilityOverride(date: string): Promise<void> {
  await apiClient.delete(`/doctors/me/availability/overrides/${date}`)
}

// ── Integration endpoints (/doctors/integration/availability) ─────────────────
// Used internally — e.g. appointment-service queries free slots

/** Get free slots for a doctor within a date range */
export async function getFreeSlotsForDoctor(
  doctorUserId: string,
  from: string,
  to: string,
): Promise<FreeSlot[]> {
  const { data } = await apiClient.get<{ slots: FreeSlot[] }>(
    `/doctors/integration/availability/${doctorUserId}/free-slots`,
    { params: { from, to } },
  )
  return data.slots ?? []
}

/** Validate whether a specific slot is available for a doctor */
export async function validateSlot(
  doctorUserId: string,
  slotStart: string,
): Promise<{ valid: boolean }> {
  const { data } = await apiClient.post<{ valid: boolean }>(
    "/doctors/integration/availability/validate-slot",
    { doctorUserId, slotStart },
  )
  return data
}
