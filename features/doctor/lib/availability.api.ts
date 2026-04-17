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
  windows: TimeWindow[]
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

export interface FreeSlot {
  start: string
  end: string
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function doctorHeaders(userId: string) {
  return { "x-user-id": userId, "x-user-role": "doctor" }
}

// ── Doctor-facing endpoints (/doctors/me/availability) ────────────────────────

/** Get the authenticated doctor's availability schedule */
export async function getMyAvailability(userId: string): Promise<AvailabilitySchedule> {
  const { data } = await apiClient.get<{ schedule: AvailabilitySchedule }>(
    "/doctors/me/availability",
    { headers: doctorHeaders(userId) },
  )
  return data.schedule
}

/** Full replace of the doctor's availability schedule */
export async function putMyAvailability(
  userId: string,
  payload: AvailabilitySchedule,
): Promise<AvailabilitySchedule> {
  const { data } = await apiClient.put<AvailabilitySchedule>(
    "/doctors/me/availability",
    payload,
    { headers: doctorHeaders(userId) },
  )
  return data
}

/** Partial update of the doctor's availability schedule */
export async function patchMyAvailability(
  userId: string,
  payload: PatchAvailabilitySchedule,
): Promise<AvailabilitySchedule> {
  const { data } = await apiClient.patch<AvailabilitySchedule>(
    "/doctors/me/availability",
    payload,
    { headers: doctorHeaders(userId) },
  )
  return data
}

/** Add a date override (day off or custom windows for a specific date) */
export async function addAvailabilityOverride(
  userId: string,
  override: DateOverride,
): Promise<AvailabilitySchedule> {
  const { data } = await apiClient.post<AvailabilitySchedule>(
    "/doctors/me/availability/overrides",
    override,
    { headers: doctorHeaders(userId) },
  )
  return data
}

/** Remove a date override by date string ("YYYY-MM-DD") */
export async function removeAvailabilityOverride(
  userId: string,
  date: string,
): Promise<void> {
  await apiClient.delete(`/doctors/me/availability/overrides/${date}`, {
    headers: doctorHeaders(userId),
  })
}

// ── Integration endpoints (/doctors/integration/availability) ─────────────────
// Used internally — e.g. appointment-service queries free slots

/** Get free slots for a doctor within a date range */
export async function getFreeSlotsForDoctor(
  doctorUserId: string,
  from: string,
  to: string,
): Promise<FreeSlot[]> {
  const { data } = await apiClient.get<FreeSlot[]>(
    `/doctors/integration/availability/${doctorUserId}/free-slots`,
    { params: { from, to } },
  )
  return data
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
