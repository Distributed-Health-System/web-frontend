"use client"

import { useState, useEffect } from "react"
import { AGORA_APP_ID } from "../lib/agora"

interface TokenState {
  token: string | null
  isLoading: boolean
  error: string | null
}

export function useAgoraToken(channelName: string, uid: number): TokenState {
  const [state, setState] = useState<TokenState>({
    token: null,
    isLoading: true,
    error: null,
  })

  useEffect(() => {
    if (!AGORA_APP_ID) {
      setState({ token: null, isLoading: false, error: "Agora App ID is not configured" })
      return
    }

    let cancelled = false

    async function fetchToken() {
      try {
        const res = await fetch("/api/agora-token", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ channelName, uid, role: "publisher" }),
        })

        if (!res.ok) {
          const data = await res.json()
          throw new Error(data.error ?? "Failed to get token")
        }

        const data = await res.json()
        if (!cancelled) setState({ token: data.token, isLoading: false, error: null })
      } catch (err) {
        if (!cancelled)
          setState({
            token: null,
            isLoading: false,
            error: err instanceof Error ? err.message : "Failed to get token",
          })
      }
    }

    fetchToken()
    return () => { cancelled = true }
  }, [channelName, uid])

  return state
}
