export interface Doctor {
  id: string
  name: string
  specialty: string
  avatar: string
  bio: string
  availableSlots: string[]
}

export interface Patient {
  id: string
  name: string
  email: string
  avatar: string
}

export interface Appointment {
  id: string
  doctorId: string
  patientId: string
  scheduledAt: string
  timeSlot: string
  status: "scheduled" | "in-progress" | "completed" | "cancelled"
  createdAt: string
}

export type UserRole = "patient" | "doctor"
