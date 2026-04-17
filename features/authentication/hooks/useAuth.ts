"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import axios from "axios"
import { loginRequest, logoutRequest, type LoginPayload } from "../lib/authentication.api"
import { scheduleTokenRefresh, cancelTokenRefresh } from "@/lib/api-base"

interface UseAuthReturn {
  isSubmitting: boolean
  submitError: string | null
  login: (payload: LoginPayload) => Promise<void>
  logout: () => Promise<void>
}

export function useAuth(): UseAuthReturn {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const router = useRouter()

  const login = async (payload: LoginPayload) => {
    setIsSubmitting(true)
    setSubmitError(null)

    try {
      const { expiresIn } = await loginRequest(payload)
      scheduleTokenRefresh(expiresIn)
      // TODO: decode role from accessToken cookie (via /auth/me endpoint) and route accordingly
      router.push("/patient/dashboard")
    } catch (err) {
      const message = axios.isAxiosError(err)
        ? (err.response?.data as { message?: string })?.message ?? "Unable to reach the server."
        : "Unable to reach the server."
      setSubmitError(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const logout = async () => {
    cancelTokenRefresh()
    await logoutRequest().catch(() => {
      // best-effort — cookies cleared server-side
    })
    router.push("/login")
  }

  return { isSubmitting, submitError, login, logout }
}
