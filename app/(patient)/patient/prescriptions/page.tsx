import { PatientPrescriptionsView } from "@/features/patient"

export default function PatientPrescriptionsPage() {
  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-6 px-4 py-4 md:py-6 lg:px-6">
          <div>
            <h1 className="h3">My prescriptions</h1>
            <p className="body-base mt-1 text-muted-foreground">
              Active and past prescriptions from your visits. Download a PDF for your records or
              pharmacy.
            </p>
          </div>

          <PatientPrescriptionsView />
        </div>
      </div>
    </div>
  )
}
