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
  doctors,
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

// For demo: doctor is always the first mock doctor
const CURRENT_DOCTOR = doctors[0]

export default function DoctorConsultationPage({
  params,
}: {
  // sessionId maps to appointmentId for demo — real auth will derive this from the session
  params: Promise<{ sessionId: string }>
}) {
  const { sessionId } = use(params)
  const router = useRouter()

  const [appointment, setAppointment] = useState<Appointment | null>(null)
  const [doctor, setDoctor] = useState<Doctor | undefined>()
  const [patient, setPatient] = useState<Patient | undefined>()
  const [canJoin, setCanJoin] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const apt = getAppointmentById(sessionId)
    if (apt) {
      setAppointment(apt)
      setDoctor(getDoctorById(apt.doctorId))
      setPatient(getPatientById(apt.patientId))
    }
    setIsLoading(false)
  }, [sessionId])

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
        <p className="text-muted-foreground">Session not found.</p>
      </div>
    )
  }

  if (!canJoin) {
    return (
      <WaitingRoom
        appointment={appointment}
        doctor={doctor}
        patient={patient}
        userRole="doctor"
        onGoBack={() => router.push("/doctor/appointments")}
      />
    )
  }

  return (
    <div className="h-screen w-screen bg-black overflow-hidden">
      <VideoCallRoom
        appointment={appointment}
        doctor={doctor}
        patient={patient}
        currentUserId={CURRENT_DOCTOR.id}
        userRole="doctor"
      />
    </div>
  )
}
