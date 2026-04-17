"use client"

import { Stethoscope } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { Doctor } from "@/features/doctor/lib/doctor.api"

function doctorInitials(d: Doctor) {
  return `${d.firstName[0]}${d.lastName[0]}`.toUpperCase()
}

export function doctorFullName(d: Doctor) {
  return `Dr. ${d.firstName} ${d.lastName}`
}

interface DoctorCardProps {
  doctor: Doctor
  onClick: () => void
}

export function DoctorCard({ doctor, onClick }: DoctorCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="h-full w-full text-left rounded-card transition hover:opacity-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
    >
      <Card className="h-full min-h-[200px] cursor-pointer transition hover:shadow-sm">
        <CardHeader className="gap-3">
          <div className="flex items-start gap-3">
            <Avatar className="size-14 shrink-0">
              <AvatarFallback className="bg-secondary text-lg text-secondary-foreground">
                {doctorInitials(doctor)}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1 space-y-1">
              <CardTitle className="text-base leading-snug">{doctorFullName(doctor)}</CardTitle>
              <div className="flex flex-wrap gap-1.5">
                <Badge variant="secondary" className="font-normal">
                  <Stethoscope className="mr-1 size-3" aria-hidden />
                  {doctor.specialization}
                </Badge>
                {doctor.isAvailable && (
                  <Badge className="bg-success/10 text-success font-normal border-0">
                    Available
                  </Badge>
                )}
              </div>
            </div>
          </div>
          <CardDescription className="line-clamp-2 text-left">{doctor.bio}</CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <p className="helper-text text-muted-foreground">
            {doctor.yearsOfExperience} yrs experience
          </p>
        </CardContent>
      </Card>
    </button>
  )
}
