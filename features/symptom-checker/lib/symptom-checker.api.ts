import { apiClient } from "@/lib/api-base"

const symptomCheckerClient = apiClient

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

function userHeaders(patientId: string) {
  return {
    "x-user-id": patientId,
    "x-user-role": "patient",
  }
}

export async function sendMessage(
  sessionId: string,
  message: string,
  patientId: string,
): Promise<ChatResponse> {
  const { data } = await symptomCheckerClient.post<ChatResponse>(
    "/symptom-checker/chat",
    { sessionId, message },
    { headers: userHeaders(patientId) },
  )
  return data
}

export async function getPatientSessions(patientId: string): Promise<ChatResponse[]> {
  const { data } = await symptomCheckerClient.get<ChatResponse[]>(
    "/symptom-checker/sessions",
    { headers: userHeaders(patientId) },
  )
  return data
}

export async function getSession(
  sessionId: string,
  patientId: string,
): Promise<ChatResponse> {
  const { data } = await symptomCheckerClient.get<ChatResponse>(
    `/symptom-checker/sessions/${sessionId}`,
    { headers: userHeaders(patientId) },
  )
  return data
}
