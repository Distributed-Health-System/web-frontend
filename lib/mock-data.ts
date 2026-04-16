import type { Doctor, Patient, Appointment } from "./types"

export const doctors: Doctor[] = [
  {
    id: "dr-1",
    name: "Dr. Sarah Mitchell",
    specialty: "General Practitioner",
    avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face",
    bio: "15 years of experience in family medicine and preventive care for all ages.",
    availableSlots: ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"],
  },
  {
    id: "dr-2",
    name: "Dr. James Chen",
    specialty: "Cardiologist",
    avatar: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop&crop=face",
    bio: "Board-certified cardiologist focused on heart failure, hypertension, and preventive cardiology.",
    availableSlots: ["08:00", "09:00", "10:00", "13:00", "14:00"],
  },
  {
    id: "dr-3",
    name: "Dr. Emily Rodriguez",
    specialty: "Dermatologist",
    avatar: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=150&h=150&fit=crop&crop=face",
    bio: "Specialises in skin conditions, acne, and teledermatology consultations.",
    availableSlots: ["10:00", "11:00", "12:00", "15:00", "16:00", "17:00"],
  },
  {
    id: "dr-4",
    name: "Dr. Aisha Okonkwo",
    specialty: "Pediatrician",
    avatar: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=150&h=150&fit=crop&crop=face",
    bio: "Child and adolescent health, developmental checks, and immunisation guidance.",
    availableSlots: ["08:30", "09:30", "14:00", "15:30"],
  },
  {
    id: "dr-5",
    name: "Dr. Robert Lindqvist",
    specialty: "Neurologist",
    avatar: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&h=150&fit=crop&crop=face",
    bio: "Headaches, migraine, epilepsy, and neurodegenerative conditions.",
    availableSlots: ["09:00", "11:00", "13:00", "16:00"],
  },
  {
    id: "dr-6",
    name: "Dr. Priya Nair",
    specialty: "Orthopedics",
    avatar: "https://images.unsplash.com/photo-1651008376812-bbe2f4478bdb?w=150&h=150&fit=crop&crop=face",
    bio: "Sports injuries, joint pain, and post-surgical rehabilitation planning.",
    availableSlots: ["07:30", "10:30", "12:00", "15:00"],
  },
  {
    id: "dr-7",
    name: "Dr. Daniel Foster",
    specialty: "Psychiatry",
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face",
    bio: "Adult psychiatry, anxiety, depression, and medication management via telehealth.",
    availableSlots: ["09:00", "10:00", "13:00", "14:00", "17:00"],
  },
  {
    id: "dr-8",
    name: "Dr. Maria Santos",
    specialty: "General Practitioner",
    avatar: "https://images.unsplash.com/photo-1527613426441-4da17449b3d7?w=150&h=150&fit=crop&crop=face",
    bio: "Same-day appointments for acute issues and ongoing chronic disease care.",
    availableSlots: ["08:00", "09:00", "11:00", "15:00", "16:30"],
  },
]

/** Distinct specialties for directory filters (sorted). */
export function getDoctorSpecialties(): string[] {
  const set = new Set(doctors.map((d) => d.specialty))
  return Array.from(set).sort((a, b) => a.localeCompare(b))
}

export const patients: Patient[] = [
  {
    id: "patient-1",
    name: "John Doe",
    email: "john.doe@example.com",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
  },
  {
    id: "patient-2",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face",
  },
]

// ---------------------------------------------------------------------------
// localStorage helpers
// ---------------------------------------------------------------------------

const APPOINTMENTS_KEY = "mediconnect_appointments"

export function getAppointments(): Appointment[] {
  if (typeof window === "undefined") return []
  const stored = localStorage.getItem(APPOINTMENTS_KEY)
  return stored ? (JSON.parse(stored) as Appointment[]) : []
}

export function saveAppointments(appointments: Appointment[]): void {
  if (typeof window === "undefined") return
  localStorage.setItem(APPOINTMENTS_KEY, JSON.stringify(appointments))
}

export function getAppointmentById(id: string): Appointment | undefined {
  return getAppointments().find((a) => a.id === id)
}

export function getDoctorById(id: string): Doctor | undefined {
  return doctors.find((d) => d.id === id)
}

export function getPatientById(id: string): Patient | undefined {
  return patients.find((p) => p.id === id)
}

export function getPatientAppointments(patientId: string): Appointment[] {
  return getAppointments().filter((a) => a.patientId === patientId)
}

export function getDoctorAppointments(doctorId: string): Appointment[] {
  return getAppointments().filter((a) => a.doctorId === doctorId)
}

/** Creates a test appointment scheduled for right now and persists it. */
export function createTestAppointment(doctorId: string, patientId: string): Appointment {
  const now = new Date()
  const timeSlot = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`

  const appointment: Appointment = {
    id: `apt-test-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    doctorId,
    patientId,
    scheduledAt: now.toISOString(),
    timeSlot,
    status: "scheduled",
    createdAt: now.toISOString(),
  }

  const all = getAppointments()
  all.push(appointment)
  saveAppointments(all)
  return appointment
}

// ---------------------------------------------------------------------------
// Join-window logic  (joinable 15 min before → 30 min after scheduled time)
// ---------------------------------------------------------------------------

export function canJoinCall(appointment: Appointment): boolean {
  const now = new Date()
  const scheduled = new Date(appointment.scheduledAt)
  const windowStart = new Date(scheduled.getTime() - 15 * 60 * 1000)
  const windowEnd = new Date(scheduled.getTime() + 30 * 60 * 1000)
  return now >= windowStart && now <= windowEnd && appointment.status !== "cancelled"
}

export function getTimeUntilJoinable(appointment: Appointment): number {
  const windowStart = new Date(new Date(appointment.scheduledAt).getTime() - 15 * 60 * 1000)
  return Math.max(0, windowStart.getTime() - Date.now())
}
