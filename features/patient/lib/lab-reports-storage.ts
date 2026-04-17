import type { PatientLabReport } from "../types"
import { mockPatientLabReports } from "./mock-data"

const STORAGE_KEY = "dh_patient_lab_reports_v2"

/** Max image size to embed preview in localStorage (bytes). */
export const MAX_PREVIEW_BYTES = 750 * 1024

export function loadLabReports(): PatientLabReport[] {
  if (typeof window === "undefined") return [...mockPatientLabReports]
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) {
    const initial = [...mockPatientLabReports]
    saveLabReports(initial)
    return initial
  }
  try {
    const parsed = JSON.parse(raw) as Partial<PatientLabReport>[]
    if (!Array.isArray(parsed)) return [...mockPatientLabReports]
    return parsed.map(normalizeReport)
  } catch {
    return [...mockPatientLabReports]
  }
}

export function saveLabReports(reports: PatientLabReport[]): void {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reports))
  } catch {
    // Quota exceeded — caller may surface a message
    throw new Error("STORAGE_FULL")
  }
}

function normalizeReport(r: Partial<PatientLabReport>): PatientLabReport {
  const title = r.title ?? "Report"
  return {
    id: r.id ?? crypto.randomUUID(),
    title,
    uploadedAt: r.uploadedAt ?? new Date().toISOString(),
    category: r.category ?? "other",
    status: r.status ?? "pending",
    fileName: r.fileName ?? `${title.replace(/\s+/g, "_")}.pdf`,
    mimeType: r.mimeType ?? "application/octet-stream",
    fileSizeBytes: typeof r.fileSizeBytes === "number" ? r.fileSizeBytes : 0,
    previewDataUrl: r.previewDataUrl,
  }
}

export function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(file)
  })
}
