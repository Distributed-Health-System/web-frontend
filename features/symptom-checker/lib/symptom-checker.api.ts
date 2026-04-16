const AI_SERVICE_URL = process.env.NEXT_PUBLIC_AI_SERVICE_URL ?? "http://localhost:3008"

export interface PossibleCondition {
  name: string
  likelihood: "high" | "medium" | "low"
  description: string
}

export interface SymptomAnalysis {
  possibleConditions: PossibleCondition[]
  recommendedSpecialties: string[]
  urgencyLevel: "emergency" | "urgent" | "routine" | "self-care"
  generalAdvice: string
  disclaimer: string
}

export interface ChatMessage {
  role: "user" | "assistant"
  content: string
}

export interface ChatResponse {
  sessionId?: string
  response: string
  conversation: ChatMessage[]
  analysis?: SymptomAnalysis
}

function headers(patientId: string) {
  return {
    "Content-Type": "application/json",
    "x-user-id": patientId,
    "x-user-role": "patient",
  }
}

export async function sendMessage(
  sessionId: string,
  message: string,
  patientId: string,
): Promise<ChatResponse> {
  const res = await fetch(`${AI_SERVICE_URL}/symptom-checker/chat`, {
    method: "POST",
    headers: headers(patientId),
    body: JSON.stringify({ sessionId, message }),
  })
  if (!res.ok) throw new Error("Failed to send message")
  return res.json()
}

export async function getPatientSessions(patientId: string): Promise<ChatResponse[]> {
  const res = await fetch(`${AI_SERVICE_URL}/symptom-checker/sessions`, {
    headers: headers(patientId),
  })
  if (!res.ok) throw new Error("Failed to fetch sessions")
  return res.json()
}

export async function getSession(
  sessionId: string,
  patientId: string,
): Promise<ChatResponse> {
  const res = await fetch(`${AI_SERVICE_URL}/symptom-checker/sessions/${sessionId}`, {
    headers: headers(patientId),
  })
  if (!res.ok) throw new Error("Failed to fetch session")
  return res.json()
}
