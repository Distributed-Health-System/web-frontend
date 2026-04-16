/**
 * Patient-area types (portal, appointments view, records).
 * Align naming with `features/doctor/types` where concepts overlap.
 */

export type PatientAppointmentStatus = "upcoming" | "completed" | "cancelled"

/** Patient-facing view of an upcoming or past visit */
export interface PatientAppointment {
  id: string
  doctorName: string
  specialty?: string
  date: string
  timeSlot: string
  type: "video" | "in-person"
  status: PatientAppointmentStatus
  sessionId?: string
}

export interface PatientLabReport {
  id: string
  title: string
  /** ISO timestamp */
  uploadedAt: string
  category: "lab" | "scan" | "other"
  status: "pending" | "reviewed"
  /** Original file name from upload or placeholder for seeded rows */
  fileName: string
  mimeType: string
  fileSizeBytes: number
  /** Stored only for smaller images to keep within browser storage limits */
  previewDataUrl?: string
}

export interface PatientPrescriptionMedication {
  name: string
  dosage: string
  frequency: string
  duration: string
  instructions?: string
}

export interface PatientPrescription {
  id: string
  /** ISO date */
  issuedAt: string
  prescriberName: string
  specialty?: string
  status: "active" | "past"
  medications: PatientPrescriptionMedication[]
  notes?: string
}

export type PatientInvoiceStatus = "due" | "paid" | "processing" | "refunded"

export interface PatientInvoice {
  id: string
  description: string
  providerName: string
  /** Date of service (ISO date) */
  serviceDate: string
  /** When the invoice was created (ISO) */
  issuedAt: string
  amountCents: number
  currency: "USD"
  status: PatientInvoiceStatus
  /** Card last 4 when paid */
  last4?: string
  /** When payment settled (ISO) */
  paidAt?: string
}
