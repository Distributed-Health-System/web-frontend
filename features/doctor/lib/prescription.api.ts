import { apiClient } from "@/lib/api-base"

// ── Types ────────────────────────────────────────────────────────────────────

export interface MedicationLine {
  name: string
  dosage: string
  frequency: string
  duration: string
  instructions?: string
}

export interface PrescriptionArtifact {
  url: string
  mimeType?: string
}

export interface Prescription {
  id: string
  patientId: string
  appointmentId?: string
  items: MedicationLine[]
  diagnosis?: string
  notes?: string
  issuedAt?: string
  validUntil?: string
  artifact?: PrescriptionArtifact
  status: "active" | "amended" | "revoked"
  revokedReason?: string
  createdAt: string
  updatedAt: string
}

export interface CreatePrescriptionPayload {
  patientId: string
  appointmentId?: string
  items: MedicationLine[]
  diagnosis?: string
  notes?: string
  issuedAt?: string
  validUntil?: string
  artifact?: PrescriptionArtifact
}

export interface AmendPrescriptionPayload {
  items?: MedicationLine[]
  diagnosis?: string
  notes?: string
  validUntil?: string
  artifact?: PrescriptionArtifact
}

export interface ListPrescriptionsOptions {
  patientId?: string
  includeHistory?: boolean
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function doctorHeaders(userId: string) {
  return { "x-user-id": userId, "x-user-role": "doctor" }
}

// ── Doctor-facing endpoints (/doctors/me/prescriptions) ──────────────────────

/** Create a new prescription */
export async function createPrescription(
  userId: string,
  payload: CreatePrescriptionPayload,
): Promise<Prescription> {
  const { data } = await apiClient.post<Prescription>(
    "/doctors/me/prescriptions",
    payload,
    { headers: doctorHeaders(userId) },
  )
  return data
}

/** List the doctor's prescriptions, optionally filtered by patient */
export async function listMyPrescriptions(
  userId: string,
  options: ListPrescriptionsOptions = {},
): Promise<Prescription[]> {
  const { data } = await apiClient.get<Prescription[]>(
    "/doctors/me/prescriptions",
    {
      headers: doctorHeaders(userId),
      params: {
        ...(options.patientId ? { patientId: options.patientId } : {}),
        ...(options.includeHistory ? { includeHistory: "true" } : {}),
      },
    },
  )
  return data
}

/** List prescriptions for a specific patient */
export async function listPrescriptionsForPatient(
  userId: string,
  patientId: string,
  includeHistory = false,
): Promise<Prescription[]> {
  const { data } = await apiClient.get<Prescription[]>(
    `/doctors/me/prescriptions/for-patient/${patientId}`,
    {
      headers: doctorHeaders(userId),
      params: includeHistory ? { includeHistory: "true" } : {},
    },
  )
  return data
}

/** Get a single prescription by ID */
export async function getPrescription(
  userId: string,
  prescriptionId: string,
): Promise<Prescription> {
  const { data } = await apiClient.get<Prescription>(
    `/doctors/me/prescriptions/${prescriptionId}`,
    { headers: doctorHeaders(userId) },
  )
  return data
}

/** Amend (partially update) a prescription */
export async function amendPrescription(
  userId: string,
  prescriptionId: string,
  payload: AmendPrescriptionPayload,
): Promise<Prescription> {
  const { data } = await apiClient.patch<Prescription>(
    `/doctors/me/prescriptions/${prescriptionId}/amend`,
    payload,
    { headers: doctorHeaders(userId) },
  )
  return data
}

/** Revoke a prescription */
export async function revokePrescription(
  userId: string,
  prescriptionId: string,
  reason?: string,
): Promise<Prescription> {
  const { data } = await apiClient.patch<Prescription>(
    `/doctors/me/prescriptions/${prescriptionId}/revoke`,
    reason ? { reason } : {},
    { headers: doctorHeaders(userId) },
  )
  return data
}

// ── Integration endpoint (/doctors/integration/patients) ─────────────────────
// Used by patient-facing views to fetch their own prescriptions

/** Get all prescriptions for a patient (patient-service integration) */
export async function getPatientPrescriptions(
  patientId: string,
  includeHistory = false,
): Promise<Prescription[]> {
  const { data } = await apiClient.get<Prescription[]>(
    `/doctors/integration/patients/${patientId}/prescriptions`,
    { params: includeHistory ? { includeHistory: "true" } : {} },
  )
  return data
}
