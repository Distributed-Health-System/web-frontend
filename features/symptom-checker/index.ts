// SSR-safe exports only.
// SymptomChat is a client component — import directly or via dynamic() from page level.
export { AnalysisResult } from "./components/AnalysisResult"
export { ChatMessage } from "./components/ChatMessage"
export { useSymptomChat } from "./hooks/useSymptomChat"
export type { SymptomAnalysis, ChatResponse } from "./lib/symptom-checker.api"
