import { PatientList } from "@/features/doctor/components/patients/PatientList"
import { mockPatients } from "@/features/doctor/lib/mock-data"

export default function DoctorPatientsPage() {
  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-6 py-4 md:py-6 px-4 lg:px-6">
          <div>
            <h1 className="h3">My Patients</h1>
            <p className="body-base text-muted-foreground mt-1">
              View your patients and their uploaded records.
            </p>
          </div>
          <PatientList patients={mockPatients} />
        </div>
      </div>
    </div>
  )
}
