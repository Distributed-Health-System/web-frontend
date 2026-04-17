import { apiClient } from "@/lib/api-base"

export interface CreateDoctorPayload {
  firstName: string
  lastName: string
  email: string
  password: string
  specialization: string
  licenseNumber: string
  phone?: string
  yearsOfExperience?: number
  bio?: string
}

export interface CreateDoctorResponse {
  id: string
  userId: string
  firstName: string
  lastName: string
  email: string
  specialization: string
  licenseNumber: string
  isApproved: boolean
  createdAt: string
}

export async function registerDoctor(payload: CreateDoctorPayload): Promise<CreateDoctorResponse> {
  const { data } = await apiClient.post<CreateDoctorResponse>("/doctors", payload)
  return data
}
