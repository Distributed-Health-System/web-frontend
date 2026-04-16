import { DoctorStatsCards } from "@/features/doctor/components/dashboard/DoctorStatsCards"
import { UpcomingAppointments } from "@/features/doctor/components/dashboard/UpcomingAppointments"
import { mockAppointments, mockPatients, mockPrescriptions } from "@/features/doctor/lib/mock-data"

export default function DoctorDashboardPage() {
  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-6 py-4 md:py-6">
          <div className="px-4 lg:px-6">
            <h1 className="h3">Good morning, Dr. Smith</h1>
            <p className="body-base text-muted-foreground mt-1">
              Here's what's happening today.
            </p>
          </div>
          <DoctorStatsCards
            appointments={mockAppointments}
            patients={mockPatients}
            prescriptions={mockPrescriptions}
          />
          <div className="px-4 lg:px-6">
            <UpcomingAppointments appointments={mockAppointments} />
          </div>
        </div>
      </div>
    </div>
  )
}
