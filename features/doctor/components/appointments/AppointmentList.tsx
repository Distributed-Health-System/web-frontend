"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AppointmentCard } from "./AppointmentCard"
import type { DoctorAppointment } from "../../types"

interface AppointmentListProps {
  appointments: DoctorAppointment[]
}

export function AppointmentList({ appointments }: AppointmentListProps) {
  const byStatus = (status: DoctorAppointment["status"]) =>
    appointments.filter((a) => a.status === status)

  const tabs: { value: DoctorAppointment["status"]; label: string }[] = [
    { value: "upcoming", label: "Upcoming" },
    { value: "completed", label: "Completed" },
    { value: "cancelled", label: "Cancelled" },
  ]

  return (
    <Tabs defaultValue="upcoming" className="w-full flex flex-col gap-4">
      <TabsList className="w-fit">
        {tabs.map((tab) => (
          <TabsTrigger key={tab.value} value={tab.value}>
            {tab.label}
            <span className="ml-1.5 label-sm text-muted-foreground">
              ({byStatus(tab.value).length})
            </span>
          </TabsTrigger>
        ))}
      </TabsList>
      {tabs.map((tab) => (
        <TabsContent key={tab.value} value={tab.value} className="flex flex-col gap-3">
          {byStatus(tab.value).length === 0 ? (
            <p className="helper-text py-8 text-center">No {tab.label.toLowerCase()} appointments.</p>
          ) : (
            byStatus(tab.value).map((apt) => (
              <AppointmentCard key={apt.id} appointment={apt} />
            ))
          )}
        </TabsContent>
      ))}
    </Tabs>
  )
}
