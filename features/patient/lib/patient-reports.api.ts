import { apiClient } from "@/lib/api-base"
import axios from "axios"

export type PatientReportCategory = "lab" | "scan" | "discharge" | "other"

export interface PatientReport {
  id: string
  title: string
  blobKey: string
  fileUrl: string
  mimeType: string
  uploadedBy: "patient"
  uploadedById: string
  uploadedAt: string
  category?: PatientReportCategory
  sourceService?: string
  createdAt: string
  updatedAt: string
}

interface PatientMeResponse {
  id: string
}

interface UploadIntentRequest {
  title: string
  filename: string
  mimeType: string
  sizeBytes: number
  category?: PatientReportCategory
}

interface UploadIntentResponse {
  reportId: string
  blobKey: string
  uploadUrl: string
  expiresAt: string
  requiredHeaders: {
    "Content-Type": string
  }
}

interface FinalizeUploadRequest {
  reportId: string
  title: string
  blobKey: string
  mimeType: string
  uploadedAt: string
  category?: PatientReportCategory
}

interface DownloadUrlResponse {
  reportId: string
  blobKey: string
  downloadUrl: string
  expiresAt: string
}

export class MissingPatientProfileError extends Error {
  constructor() {
    super("Missing patient profile")
    this.name = "MissingPatientProfileError"
  }
}

export async function getMyPatientId(): Promise<string> {
  try {
    const { data } = await apiClient.get<PatientMeResponse>("/patients/me")
    return data.id
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      throw new MissingPatientProfileError()
    }
    throw error
  }
}

export async function getMyReports(patientId: string): Promise<PatientReport[]> {
  const { data } = await apiClient.get<PatientReport[]>(`/patients/${patientId}/reports`, {
    params: { sort: "uploadedAt:desc" },
  })
  return data
}

export async function createReportUploadIntent(
  patientId: string,
  payload: UploadIntentRequest,
): Promise<UploadIntentResponse> {
  const { data } = await apiClient.post<UploadIntentResponse>(
    `/patients/${patientId}/reports/upload-intent`,
    payload,
  )
  return data
}

export async function finalizeReportUpload(
  patientId: string,
  payload: FinalizeUploadRequest,
): Promise<void> {
  await apiClient.post(`/patients/${patientId}/reports/finalize`, payload)
}

export async function deleteReport(patientId: string, reportId: string): Promise<void> {
  await apiClient.delete(`/patients/${patientId}/reports/${reportId}`)
}

export async function getReportDownloadUrl(
  patientId: string,
  reportId: string,
): Promise<DownloadUrlResponse> {
  const { data } = await apiClient.get<DownloadUrlResponse>(
    `/patients/${patientId}/reports/${reportId}/download-url`,
  )
  return data
}
