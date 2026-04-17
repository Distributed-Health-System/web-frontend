"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { loginRequest, logoutRequest, type LoginPayload } from "../lib/authentication.api"

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
      const tokens = await loginRequest(payload)
      sessionStorage.setItem("accessToken", tokens.accessToken)
      sessionStorage.setItem("refreshToken", tokens.refreshToken)
      // TODO: decode role from accessToken JWT and route accordingly
      router.push("/patient/dashboard")
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Unable to reach the server.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const logout = async () => {
    const refreshToken = sessionStorage.getItem("refreshToken")
    sessionStorage.removeItem("accessToken")
    sessionStorage.removeItem("refreshToken")

    if (refreshToken) {
      await logoutRequest(refreshToken).catch(() => {
        // best-effort — session is already cleared locally
      })
    }

    router.push("/login")
  }

  return { isSubmitting, submitError, login, logout }
}
