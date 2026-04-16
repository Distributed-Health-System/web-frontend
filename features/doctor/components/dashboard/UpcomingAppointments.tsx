"use client"

import { useRouter } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { VideoIcon, UserIcon, ArrowRightIcon } from "lucide-react"
import type { DoctorAppointment } from "../../types"

interface UpcomingAppointmentsProps {
  appointments: DoctorAppointment[]
}

export function UpcomingAppointments({ appointments }: UpcomingAppointmentsProps) {
  const router = useRouter()
  const upcoming = appointments
    .filter((a) => a.status === "upcoming")
    .slice(0, 5)

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="h4">Upcoming Appointments</CardTitle>
        <Button
          variant="ghost"
          size="sm"
          className="label gap-1"
          onClick={() => router.push("/doctor/appointments")}
        >
          View all <ArrowRightIcon className="size-3" />
        </Button>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {upcoming.length === 0 ? (
          <p className="helper-text py-4 text-center">No upcoming appointments today.</p>
        ) : (
          upcoming.map((apt) => (
            <div
              key={apt.id}
              className="flex items-center justify-between rounded-lg border border-border p-3"
            >
              <div className="flex items-center gap-3">
                <Avatar className="size-9">
                  <AvatarFallback className="bg-secondary text-secondary-foreground body-sm">
                    {apt.patientName.split(" ").map((n) => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col gap-0.5">
                  <span className="label">{apt.patientName}</span>
                  <span className="helper-text">{apt.timeSlot} · {apt.reason}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="gap-1 label-sm">
                  {apt.type === "video" ? (
                    <VideoIcon className="size-3" />
                  ) : (
                    <UserIcon className="size-3" />
                  )}
                  {apt.type === "video" ? "Video" : "In-person"}
                </Badge>
                {apt.type === "video" && apt.sessionId && (
                  <Button
                    size="sm"
                    onClick={() => router.push(`/doctor/consultations/${apt.sessionId}`)}
                  >
                    Join
                  </Button>
                )}
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}
