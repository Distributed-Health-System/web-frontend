import { SymptomChat } from "@/features/symptom-checker/components/SymptomChat"

export const metadata = {
  title: "AI Symptom Checker · Distributed Health",
  description: "Describe your symptoms and receive a preliminary AI health assessment.",
}

export default function SymptomCheckerPage() {
  return (
    <div className="flex flex-1 flex-col h-[calc(100vh-var(--header-height))] overflow-hidden">
      <SymptomChat />
    </div>
  )
}
