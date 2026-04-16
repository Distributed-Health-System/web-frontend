import { AppointmentList } from "@/features/doctor/components/appointments/AppointmentList"
import { mockAppointments } from "@/features/doctor/lib/mock-data"

export default function DoctorAppointmentsPage() {
  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-6 py-4 md:py-6 px-4 lg:px-6">
          <div>
            <h1 className="h3">Appointments</h1>
            <p className="body-base text-muted-foreground mt-1">
              Manage your upcoming, completed, and cancelled appointments.
            </p>
          </div>
          <AppointmentList appointments={mockAppointments} />
        </div>
      </div>
    </div>
  )
}
