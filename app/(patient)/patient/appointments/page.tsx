import { PatientAppointmentsView } from "@/features/patient"

export default function PatientAppointmentsPage() {
  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-6 px-4 py-4 md:py-6 lg:px-6">
          <div>
            <h1 className="h3">My appointments</h1>
            <p className="body-base mt-1 text-muted-foreground">
              Video visits only—filter by upcoming or past, search your providers, and join when it is
              time.
            </p>
          </div>

          <PatientAppointmentsView />
        </div>
      </div>
    </div>
  )
}
