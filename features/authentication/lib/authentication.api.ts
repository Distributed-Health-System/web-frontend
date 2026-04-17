import { apiClient } from "@/lib/api-base"

export interface LoginPayload {
  email: string
  password: string
}

export interface LoginResponse {
  expiresIn: number
}

export async function loginRequest(payload: LoginPayload): Promise<LoginResponse> {
  const { data } = await apiClient.post<LoginResponse>("/auth/login", payload)
  return data
}

export async function refreshRequest(): Promise<LoginResponse> {
  const { data } = await apiClient.post<LoginResponse>("/auth/refresh")
  return data
}

export async function logoutRequest(): Promise<void> {
  await apiClient.post("/auth/logout")
}
