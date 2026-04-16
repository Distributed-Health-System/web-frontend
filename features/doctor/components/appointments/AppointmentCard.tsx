"use client"

import { useRouter } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { VideoIcon, UserIcon, CalendarIcon, ClockIcon } from "lucide-react"
import type { DoctorAppointment } from "../../types"

const statusStyles: Record<DoctorAppointment["status"], string> = {
  upcoming: "bg-primary/10 text-primary border-primary/20",
  completed: "bg-success/10 text-success border-success/20",
  cancelled: "bg-destructive/10 text-destructive border-destructive/20",
}

interface AppointmentCardProps {
  appointment: DoctorAppointment
}

export function AppointmentCard({ appointment: apt }: AppointmentCardProps) {
  const router = useRouter()
  const initials = apt.patientName.split(" ").map((n) => n[0]).join("")

  return (
    <div className="flex items-center justify-between rounded-xl border border-border bg-card p-4">
      <div className="flex items-center gap-4">
        <Avatar className="size-10">
          <AvatarFallback className="bg-secondary text-secondary-foreground body-base font-medium">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col gap-1">
          <span className="label">{apt.patientName}</span>
          {apt.reason && (
            <span className="helper-text">{apt.reason}</span>
          )}
          <div className="flex items-center gap-3 mt-0.5">
            <span className="helper-text flex items-center gap-1">
              <CalendarIcon className="size-3" />
              {apt.date}
            </span>
            <span className="helper-text flex items-center gap-1">
              <ClockIcon className="size-3" />
              {apt.timeSlot}
            </span>
            <Badge variant="outline" className="label-sm gap-1 px-1.5">
              {apt.type === "video" ? (
                <VideoIcon className="size-3" />
              ) : (
                <UserIcon className="size-3" />
              )}
              {apt.type === "video" ? "Video call" : "In-person"}
            </Badge>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <Badge className={`label-sm capitalize border ${statusStyles[apt.status]}`}>
          {apt.status}
        </Badge>
        {apt.status === "upcoming" && apt.type === "video" && apt.sessionId && (
          <Button
            size="sm"
            onClick={() => router.push(`/doctor/consultations/${apt.sessionId}`)}
          >
            Join call
          </Button>
        )}
        {apt.status === "upcoming" && (
          <Button
            size="sm"
            variant="outline"
            onClick={() => router.push(`/doctor/patients/${apt.patientId}`)}
          >
            View patient
          </Button>
        )}
      </div>
    </div>
  )
}
