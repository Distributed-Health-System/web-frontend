import { apiClient } from "@/lib/api-base"

export interface LoginPayload {
  email: string
  password: string
}

export interface AuthTokens {
  accessToken: string
  refreshToken: string
  expiresIn: number
}

export async function loginRequest(payload: LoginPayload): Promise<AuthTokens> {
  const { data } = await apiClient.post<AuthTokens>("/auth/login", payload)
  return data
}

export async function logoutRequest(refreshToken: string): Promise<void> {
  await apiClient.post("/auth/logout", { refreshToken })
}
