export type AppointmentStatus = "upcoming" | "completed" | "cancelled"
export type AppointmentType = "video" | "in-person"

export interface DoctorAppointment {
  id: string
  patientId: string
  patientName: string
  patientAvatar?: string
  date: string
  timeSlot: string
  type: AppointmentType
  status: AppointmentStatus
  sessionId?: string
  reason?: string
}

export interface PatientRecord {
  id: string
  fileName: string
  fileType: "lab" | "scan" | "report" | "other"
  uploadedAt: string
  notes?: string
}

export interface DoctorPatient {
  id: string
  name: string
  age: number
  gender: "male" | "female" | "other"
  phone: string
  email: string
  lastVisit: string
  totalVisits: number
  records: PatientRecord[]
  conditions?: string[]
}

export type PrescriptionStatus = "ACTIVE" | "AMENDED" | "REVOKED"

export interface MedicationLine {
  name: string
  dosage: string
  frequency: string
  duration: string
  instructions?: string
}

export interface PrescriptionArtifact {
  blobKey?: string
  fileUrl?: string
  mimeType?: string
}

/** Serialized prescription record (dates as ISO strings). */
export interface DoctorPrescription {
  id: string
  doctorUserId: string
  doctorProfileId: string
  patientId: string
  appointmentId?: string
  version: number
  status: PrescriptionStatus
  previousPrescriptionId?: string
  items: MedicationLine[]
  diagnosis?: string
  notes?: string
  issuedAt: string
  validUntil?: string
  artifact?: PrescriptionArtifact
  revocationReason?: string
  revokedAt?: string
  createdAt?: string
  updatedAt?: string
}

/** Medication line with a client-side row id for editing. */
export interface PrescriptionMedication extends MedicationLine {
  id: string
}

export type Weekday = "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday"

export interface TimeSlot {
  time: string
  available: boolean
}

export type WeeklyAvailability = Record<Weekday, TimeSlot[]>

/** Aligns with doctor-service `PutAvailabilityScheduleDto` / schedule document. */
export interface DoctorTimeWindow {
  start: string
  end: string
}

export interface DoctorWeeklyRule {
  dayOfWeek: number
  windows: DoctorTimeWindow[]
}

export interface DoctorBreakRule {
  dayOfWeek: number
  start: string
  end: string
}

export interface DoctorDateOverride {
  date: string
  isOff: boolean
  windows?: DoctorTimeWindow[]
}

export interface DoctorAvailabilitySchedule {
  timezone: string
  slotDurationMinutes: 30 | 60
  weeklyRules: DoctorWeeklyRule[]
  breakRules: DoctorBreakRule[]
  dateOverrides: DoctorDateOverride[]
  effectiveFrom?: string
  effectiveTo?: string
  isActive: boolean
}
