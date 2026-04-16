import { PrescriptionForm } from "@/features/doctor/components/prescriptions/PrescriptionForm"
import { PrescriptionList } from "@/features/doctor/components/prescriptions/PrescriptionList"
import { mockPatients, mockPrescriptions } from "@/features/doctor/lib/mock-data"

export default function DoctorPrescriptionsPage() {
  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-6 py-4 md:py-6 px-4 lg:px-6">
          <div>
            <h1 className="h3">Prescriptions</h1>
            <p className="body-base text-muted-foreground mt-1">
              Write new prescriptions and view past ones.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <PrescriptionForm patients={mockPatients} />
            <PrescriptionList prescriptions={mockPrescriptions} />
          </div>
        </div>
      </div>
    </div>
  )
}
