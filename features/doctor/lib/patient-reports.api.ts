import { apiClient } from "@/lib/api-base"

// ── Types ────────────────────────────────────────────────────────────────────

export type ReportCategory = "lab" | "scan" | "discharge" | "other"

export interface PatientReport {
  id: string
  patientId: string
  category: ReportCategory
  fileName: string
  fileUrl: string
  uploadedAt: string
  notes?: string
}

export interface GetPatientReportsOptions {
  category?: ReportCategory
  limit?: number
  offset?: number
  sort?: string
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function doctorHeaders(userId: string) {
  return { "x-user-id": userId, "x-user-role": "doctor" }
}

// ── Endpoints ─────────────────────────────────────────────────────────────────

/** Get lab/scan/discharge reports uploaded by a patient, viewed by the doctor */
export async function getPatientReports(
  doctorUserId: string,
  patientId: string,
  options: GetPatientReportsOptions = {},
): Promise<PatientReport[]> {
  const { data } = await apiClient.get<PatientReport[]>(
    `/doctors/me/patients/${patientId}/reports`,
    {
      headers: doctorHeaders(doctorUserId),
      params: {
        ...(options.category ? { category: options.category } : {}),
        ...(options.limit !== undefined ? { limit: options.limit } : {}),
        ...(options.offset !== undefined ? { offset: options.offset } : {}),
        ...(options.sort ? { sort: options.sort } : {}),
      },
    },
  )
  return data
}
