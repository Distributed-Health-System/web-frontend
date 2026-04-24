"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import axios from "axios"
import { loginRequest, logoutRequest, type LoginPayload } from "../lib/authentication.api"
import { clearAuthTokens, getRefreshToken, setAuthTokens } from "@/lib/api-base"

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
      const { accessToken, refreshToken } = await loginRequest(payload)
      setAuthTokens(accessToken, refreshToken)
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
    const refreshToken = getRefreshToken()
    if (refreshToken) {
      await logoutRequest(refreshToken).catch(() => {
        // best-effort — invalidate client session regardless
      })
    }
    clearAuthTokens()
    router.push("/login")
  }

  return { isSubmitting, submitError, login, logout }
}
