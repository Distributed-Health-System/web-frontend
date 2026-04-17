import { apiClient } from "@/lib/api-base"

// ── Types ────────────────────────────────────────────────────────────────────

export interface Doctor {
  id: string
  userId: string
  firstName: string
  lastName: string
  email: string
  phone: string
  specialization: string
  licenseNumber: string
  yearsOfExperience: number
  bio: string
  isAvailable: boolean
  isApproved: boolean
  createdAt: string
  updatedAt: string
}

export interface CreateDoctorPayload {
  firstName: string
  lastName: string
  email: string
  password: string
  phone?: string
  specialization: string
  licenseNumber: string
  yearsOfExperience?: number
  bio?: string
  isAvailable?: boolean
}

export type UpdateDoctorPayload = Partial<Omit<CreateDoctorPayload, "password">>

function doctorHeaders(userId: string, role: "doctor" | "admin" | "patient" = "doctor") {
  return {
    "x-user-id": userId,
    "x-user-role": role,
  }
}

// ── Endpoints ─────────────────────────────────────────────────────────────────

/** Public — register a new doctor */
export async function createDoctor(payload: CreateDoctorPayload): Promise<Doctor> {
  const { data } = await apiClient.post<Doctor>("/doctors", payload)
  return data
}

/** Public — list all approved doctors, optionally filtered by specialization */
export async function getDoctors(specialization?: string): Promise<Doctor[]> {
  const { data } = await apiClient.get<Doctor[]>("/doctors", {
    params: specialization ? { specialization } : undefined,
  })
  return data
}

/** Authenticated — get a single doctor profile */
export async function getDoctor(doctorId: string, userId: string): Promise<Doctor> {
  const { data } = await apiClient.get<Doctor>(`/doctors/${doctorId}`, {
    headers: doctorHeaders(userId),
  })
  return data
}

/** Doctor edits own profile */
export async function updateDoctor(
  doctorId: string,
  payload: UpdateDoctorPayload,
  userId: string,
): Promise<Doctor> {
  const { data } = await apiClient.patch<Doctor>(`/doctors/${doctorId}`, payload, {
    headers: doctorHeaders(userId),
  })
  return data
}

/** Admin — approve a doctor registration */
export async function approveDoctor(doctorId: string, adminId: string): Promise<Doctor> {
  const { data } = await apiClient.patch<Doctor>(
    `/doctors/${doctorId}/approve`,
    {},
    { headers: doctorHeaders(adminId, "admin") },
  )
  return data
}

/** Admin — reject a doctor registration */
export async function rejectDoctor(doctorId: string, adminId: string): Promise<void> {
  await apiClient.patch(`/doctors/${doctorId}/reject`, {}, {
    headers: doctorHeaders(adminId, "admin"),
  })
}

/** Admin — permanently delete a doctor */
export async function deleteDoctor(doctorId: string, adminId: string): Promise<void> {
  await apiClient.delete(`/doctors/${doctorId}`, {
    headers: doctorHeaders(adminId, "admin"),
  })
}
