import { apiClient } from "@/lib/api-base"

export interface CreatePatientPayload {
  firstName: string
  lastName: string
  email: string
  password: string
  dateOfBirth: string // ISO date string "YYYY-MM-DD"
  gender: "male" | "female" | "other"
  phone?: string
  address?: string
  bloodGroup?: "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-"
  allergies?: string[]
  medicalHistory?: string
  emergencyContactName?: string
  emergencyContactPhone?: string
}

export interface CreatePatientResponse {
  id: string
  userId: string
  firstName: string
  lastName: string
  email: string
  gender: string
  dateOfBirth: string
  createdAt: string
}

export async function registerPatient(payload: CreatePatientPayload): Promise<CreatePatientResponse> {
  const { data } = await apiClient.post<CreatePatientResponse>("/patients", payload)
  return data
}
