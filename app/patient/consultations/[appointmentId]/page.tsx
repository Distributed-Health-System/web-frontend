"use client"

import { useState, useEffect, use } from "react"
import dynamic from "next/dynamic"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { WaitingRoom } from "@/features/telemedicine"
import {
  getAppointmentById,
  getDoctorById,
  getPatientById,
  canJoinCall,
  patients,
} from "@/lib/mock-data"
import type { Appointment, Doctor, Patient } from "@/lib/types"

const VideoCallRoom = dynamic(
  () => import("@/features/telemedicine/components/VideoCallRoom").then((m) => m.VideoCallRoom),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-10 w-10 text-primary animate-spin" />
      </div>
    ),
  }
)

// For demo: patient is always the first mock patient
const CURRENT_PATIENT = patients[0]

export default function PatientConsultationPage({
  params,
}: {
  params: Promise<{ appointmentId: string }>
}) {
  const { appointmentId } = use(params)
  const router = useRouter()

  const [appointment, setAppointment] = useState<Appointment | null>(null)
  const [doctor, setDoctor] = useState<Doctor | undefined>()
  const [patient, setPatient] = useState<Patient | undefined>()
  const [canJoin, setCanJoin] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const apt = getAppointmentById(appointmentId)
    if (apt) {
      setAppointment(apt)
      setDoctor(getDoctorById(apt.doctorId))
      setPatient(getPatientById(apt.patientId))
    }
    setIsLoading(false)
  }, [appointmentId])

  useEffect(() => {
    if (!appointment) return
    const tick = () => setCanJoin(canJoinCall(appointment))
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [appointment])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-primary animate-spin" />
      </div>
    )
  }

  if (!appointment) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Appointment not found.</p>
      </div>
    )
  }

  if (!canJoin) {
    return (
      <WaitingRoom
        appointment={appointment}
        doctor={doctor}
        patient={patient}
        userRole="patient"
        onGoBack={() => router.push("/patient/appointments")}
      />
    )
  }

  return (
    <div className="h-screen w-screen bg-black overflow-hidden">
      <VideoCallRoom
        appointment={appointment}
        doctor={doctor}
        patient={patient}
        currentUserId={CURRENT_PATIENT.id}
        userRole="patient"
      />
    </div>
  )
}
