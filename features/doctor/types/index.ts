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

export interface PrescriptionMedication {
  id: string
  name: string
  dosage: string
  frequency: string
  duration: string
  instructions?: string
}

export interface Prescription {
  id: string
  patientId: string
  patientName: string
  issuedAt: string
  medications: PrescriptionMedication[]
  notes?: string
  appointmentId?: string
}

export type Weekday = "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday"

export interface TimeSlot {
  time: string
  available: boolean
}

export type WeeklyAvailability = Record<Weekday, TimeSlot[]>
