"use client"

import { useState, useCallback } from "react"
import {
  sendMessage,
  getPatientSessions,
  type ChatMessage,
  type ChatResponse,
  type SymptomAnalysis,
} from "../lib/symptom-checker.api"

// Demo patient ID — same pattern as telemedicine mock
const DEMO_PATIENT_ID = "patient-demo-001"

function generateSessionId(): string {
  return `session-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

export interface SessionSummary {
  sessionId: string
  lastMessage: string
  analysis?: SymptomAnalysis
}

interface State {
  sessionId: string
  messages: ChatMessage[]
  analysis: SymptomAnalysis | undefined
  isLoading: boolean
  error: string | null
  sessions: SessionSummary[]
  sessionsLoading: boolean
}

export function useSymptomChat() {
  const [state, setState] = useState<State>({
    sessionId: generateSessionId(),
    messages: [],
    analysis: undefined,
    isLoading: false,
    error: null,
    sessions: [],
    sessionsLoading: false,
  })

  const send = useCallback(async (message: string) => {
    if (!message.trim()) return

    setState((s) => ({
      ...s,
      isLoading: true,
      error: null,
      messages: [...s.messages, { role: "user", content: message }],
    }))

    try {
      const data: ChatResponse = await sendMessage(state.sessionId, message, DEMO_PATIENT_ID)

      setState((s) => ({
        ...s,
        isLoading: false,
        messages: data.conversation,
        analysis: data.analysis,
      }))
    } catch {
      setState((s) => ({
        ...s,
        isLoading: false,
        error: "Failed to reach the AI service. Please try again.",
      }))
    }
  }, [state.sessionId])

  const startNewSession = useCallback(() => {
    setState((s) => ({
      ...s,
      sessionId: generateSessionId(),
      messages: [],
      analysis: undefined,
      error: null,
    }))
  }, [])

  const loadSessions = useCallback(async () => {
    setState((s) => ({ ...s, sessionsLoading: true }))
    try {
      const data: ChatResponse[] = await getPatientSessions(DEMO_PATIENT_ID)
      const summaries: SessionSummary[] = data
        .filter((d) => d.sessionId)
        .map((d) => ({
          sessionId: d.sessionId!,
          lastMessage:
            d.conversation.findLast((m) => m.role === "assistant")?.content ??
            "No messages yet",
          analysis: d.analysis,
        }))
      setState((s) => ({ ...s, sessions: summaries, sessionsLoading: false }))
    } catch {
      setState((s) => ({ ...s, sessionsLoading: false }))
    }
  }, [])

  const loadSession = useCallback(async (sessionId: string, conversation: ChatMessage[], analysis?: SymptomAnalysis) => {
    setState((s) => ({
      ...s,
      sessionId,
      messages: conversation,
      analysis,
      error: null,
    }))
  }, [])

  return {
    sessionId: state.sessionId,
    messages: state.messages,
    analysis: state.analysis,
    isLoading: state.isLoading,
    error: state.error,
    sessions: state.sessions,
    sessionsLoading: state.sessionsLoading,
    send,
    startNewSession,
    loadSessions,
    loadSession,
  }
}
