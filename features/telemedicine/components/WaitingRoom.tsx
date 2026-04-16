"use client"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import { Clock, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getTimeUntilJoinable } from "@/lib/mock-data"
import type { Appointment, Doctor, Patient, UserRole } from "@/lib/types"

interface WaitingRoomProps {
  appointment: Appointment
  doctor?: Doctor
  patient?: Patient
  userRole: UserRole
  onGoBack: () => void
}

export function WaitingRoom({ appointment, doctor, patient, userRole, onGoBack }: WaitingRoomProps) {
  const [timeUntil, setTimeUntil] = useState(0)

  useEffect(() => {
    const tick = () => setTimeUntil(getTimeUntilJoinable(appointment))
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [appointment])

  const formatCountdown = (ms: number) => {
    const totalSecs = Math.floor(ms / 1000)
    const h = Math.floor(totalSecs / 3600)
    const m = Math.floor((totalSecs % 3600) / 60)
    const s = totalSecs % 60
    if (h > 0) return `${h}h ${m}m ${s}s`
    if (m > 0) return `${m}m ${s}s`
    return `${s}s`
  }

  const otherPerson = userRole === "patient" ? doctor?.name : patient?.name

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="mx-auto h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
            <Lock className="h-8 w-8 text-muted-foreground" />
          </div>
          <CardTitle>Waiting Room</CardTitle>
          <CardDescription>
            You can join 15 minutes before the scheduled time.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="p-4 bg-muted/30 rounded-lg space-y-3">
            {otherPerson && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  {userRole === "patient" ? "Doctor" : "Patient"}
                </span>
                <span className="font-medium">{otherPerson}</span>
              </div>
            )}
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Date</span>
              <span className="font-medium">
                {format(new Date(appointment.scheduledAt), "PPP")}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Time</span>
              <span className="font-medium">{appointment.timeSlot}</span>
            </div>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center gap-2 text-primary">
              <Clock className="h-5 w-5" />
              <span className="text-2xl font-semibold tabular-nums">
                {formatCountdown(timeUntil)}
              </span>
            </div>
            <p className="text-sm text-muted-foreground mt-1">until you can join</p>
          </div>

          <Button variant="outline" className="w-full" onClick={onGoBack}>
            Go Back
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
