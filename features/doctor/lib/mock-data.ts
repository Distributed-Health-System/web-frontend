import type {
  DoctorAppointment,
  DoctorPatient,
  Prescription,
  WeeklyAvailability,
} from "../types"

export const mockAppointments: DoctorAppointment[] = [
  {
    id: "apt-1",
    patientId: "p-1",
    patientName: "Sarah Johnson",
    date: "2026-04-17",
    timeSlot: "09:00 AM",
    type: "video",
    status: "upcoming",
    sessionId: "session-001",
    reason: "Follow-up consultation",
  },
  {
    id: "apt-2",
    patientId: "p-2",
    patientName: "Michael Chen",
    date: "2026-04-17",
    timeSlot: "10:30 AM",
    type: "video",
    status: "upcoming",
    sessionId: "session-002",
    reason: "Initial consultation",
  },
  {
    id: "apt-3",
    patientId: "p-3",
    patientName: "Emily Rodriguez",
    date: "2026-04-17",
    timeSlot: "02:00 PM",
    type: "in-person",
    status: "upcoming",
    reason: "Lab results review",
  },
  {
    id: "apt-4",
    patientId: "p-1",
    patientName: "Sarah Johnson",
    date: "2026-04-10",
    timeSlot: "11:00 AM",
    type: "video",
    status: "completed",
    reason: "General checkup",
  },
  {
    id: "apt-5",
    patientId: "p-4",
    patientName: "David Park",
    date: "2026-04-09",
    timeSlot: "03:00 PM",
    type: "video",
    status: "cancelled",
    reason: "Headache consultation",
  },
  {
    id: "apt-6",
    patientId: "p-5",
    patientName: "Linda Torres",
    date: "2026-04-18",
    timeSlot: "09:30 AM",
    type: "video",
    status: "upcoming",
    sessionId: "session-003",
    reason: "Blood pressure check",
  },
]

export const mockPatients: DoctorPatient[] = [
  {
    id: "p-1",
    name: "Sarah Johnson",
    age: 34,
    gender: "female",
    phone: "+1 (555) 012-3456",
    email: "sarah.j@example.com",
    lastVisit: "2026-04-10",
    totalVisits: 5,
    conditions: ["Hypertension", "Type 2 Diabetes"],
    records: [
      { id: "r-1", fileName: "Blood_Panel_Apr2026.pdf", fileType: "lab", uploadedAt: "2026-04-09", notes: "Fasting blood work" },
      { id: "r-2", fileName: "Chest_XRay_Mar2026.pdf", fileType: "scan", uploadedAt: "2026-03-15" },
    ],
  },
  {
    id: "p-2",
    name: "Michael Chen",
    age: 28,
    gender: "male",
    phone: "+1 (555) 234-5678",
    email: "m.chen@example.com",
    lastVisit: "2026-04-17",
    totalVisits: 1,
    conditions: [],
    records: [],
  },
  {
    id: "p-3",
    name: "Emily Rodriguez",
    age: 45,
    gender: "female",
    phone: "+1 (555) 345-6789",
    email: "emily.r@example.com",
    lastVisit: "2026-04-17",
    totalVisits: 8,
    conditions: ["Asthma"],
    records: [
      { id: "r-3", fileName: "Allergy_Test_Results.pdf", fileType: "lab", uploadedAt: "2026-04-01" },
      { id: "r-4", fileName: "Pulmonary_Function_Test.pdf", fileType: "report", uploadedAt: "2026-03-20", notes: "Annual spirometry" },
    ],
  },
  {
    id: "p-4",
    name: "David Park",
    age: 52,
    gender: "male",
    phone: "+1 (555) 456-7890",
    email: "d.park@example.com",
    lastVisit: "2026-04-09",
    totalVisits: 3,
    conditions: ["Migraine"],
    records: [
      { id: "r-5", fileName: "MRI_Brain_Apr2026.pdf", fileType: "scan", uploadedAt: "2026-04-05" },
    ],
  },
  {
    id: "p-5",
    name: "Linda Torres",
    age: 61,
    gender: "female",
    phone: "+1 (555) 567-8901",
    email: "l.torres@example.com",
    lastVisit: "2026-03-28",
    totalVisits: 12,
    conditions: ["Hypertension", "Arthritis"],
    records: [
      { id: "r-6", fileName: "ECG_Mar2026.pdf", fileType: "report", uploadedAt: "2026-03-28" },
      { id: "r-7", fileName: "Lipid_Panel.pdf", fileType: "lab", uploadedAt: "2026-03-28" },
    ],
  },
]

export const mockPrescriptions: Prescription[] = [
  {
    id: "rx-1",
    patientId: "p-1",
    patientName: "Sarah Johnson",
    issuedAt: "2026-04-10",
    appointmentId: "apt-4",
    medications: [
      { id: "m-1", name: "Metformin", dosage: "500mg", frequency: "Twice daily", duration: "30 days", instructions: "Take with meals" },
      { id: "m-2", name: "Lisinopril", dosage: "10mg", frequency: "Once daily", duration: "30 days", instructions: "Take in the morning" },
    ],
    notes: "Monitor blood pressure weekly. Return in 30 days.",
  },
  {
    id: "rx-2",
    patientId: "p-3",
    patientName: "Emily Rodriguez",
    issuedAt: "2026-03-20",
    medications: [
      { id: "m-3", name: "Albuterol Inhaler", dosage: "90mcg", frequency: "As needed", duration: "60 days", instructions: "2 puffs during asthma attack" },
      { id: "m-4", name: "Fluticasone", dosage: "110mcg", frequency: "Twice daily", duration: "60 days", instructions: "Rinse mouth after use" },
    ],
    notes: "Avoid triggers. Use peak flow meter daily.",
  },
]

export const WEEKDAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"] as const

const generateTimeSlots = (start: number, end: number, available: boolean[]): { time: string; available: boolean }[] =>
  Array.from({ length: end - start }, (_, i) => ({
    time: `${String(start + i).padStart(2, "0")}:00`,
    available: available[i] ?? false,
  }))

export const mockAvailability: WeeklyAvailability = {
  Monday:    generateTimeSlots(8, 18, [true, true, true, false, true, true, false, true, true, false]),
  Tuesday:   generateTimeSlots(8, 18, [true, true, false, false, true, true, true, true, false, false]),
  Wednesday: generateTimeSlots(8, 18, [false, false, false, false, true, true, true, false, false, false]),
  Thursday:  generateTimeSlots(8, 18, [true, true, true, false, true, true, false, false, false, false]),
  Friday:    generateTimeSlots(8, 18, [true, true, false, false, false, true, true, true, false, false]),
  Saturday:  generateTimeSlots(8, 18, [false, false, false, false, false, false, false, false, false, false]),
  Sunday:    generateTimeSlots(8, 18, [false, false, false, false, false, false, false, false, false, false]),
}
