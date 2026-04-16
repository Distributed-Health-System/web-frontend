"use client"

import { Card, CardHeader, CardTitle, CardDescription, CardFooter, CardAction } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CalendarIcon, UsersIcon, ClipboardPlusIcon, WalletIcon, TrendingUpIcon } from "lucide-react"
import type { DoctorAppointment, DoctorPatient, Prescription } from "../../types"

interface DoctorStatsCardsProps {
  appointments: DoctorAppointment[]
  patients: DoctorPatient[]
  prescriptions: Prescription[]
  earningsThisMonth?: number
}

export function DoctorStatsCards({
  appointments,
  patients,
  prescriptions,
  earningsThisMonth = 4850,
}: DoctorStatsCardsProps) {
  const today = new Date().toISOString().split("T")[0]
  const todayAppointments = appointments.filter(
    (a) => a.date === today && a.status === "upcoming"
  ).length

  const stats = [
    {
      label: "Today's Appointments",
      value: todayAppointments,
      icon: <CalendarIcon className="size-4 text-muted-foreground" />,
      trend: "+2 from yesterday",
      badge: `${todayAppointments} remaining`,
    },
    {
      label: "Total Patients",
      value: patients.length,
      icon: <UsersIcon className="size-4 text-muted-foreground" />,
      trend: "+3 this week",
      badge: "Active",
    },
    {
      label: "Prescriptions Issued",
      value: prescriptions.length,
      icon: <ClipboardPlusIcon className="size-4 text-muted-foreground" />,
      trend: "This month",
      badge: "Up to date",
    },
    {
      label: "Earnings This Month",
      value: `$${earningsThisMonth.toLocaleString()}`,
      icon: <WalletIcon className="size-4 text-muted-foreground" />,
      trend: "+12% from last month",
      badge: "On track",
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.label} className="@container/card">
          <CardHeader>
            <CardDescription>{stat.label}</CardDescription>
            <CardTitle className="h3 tabular-nums @[250px]/card:text-3xl">
              {stat.value}
            </CardTitle>
            <CardAction>
              <Badge variant="outline">
                <TrendingUpIcon />
                {stat.badge}
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5">
            <div className="label line-clamp-1 flex gap-2">
              {stat.icon}
              {stat.trend}
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
