import { DoctorPrescriptionsSection } from "@/features/doctor/components/prescriptions/DoctorPrescriptionsSection"

export default function DoctorPrescriptionsPage() {
  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-6 px-4 py-4 md:py-6 lg:px-6">
          <div>
            <h1 className="h3">Prescriptions</h1>
            <p className="body-base text-muted-foreground mt-1">
              Write new prescriptions and view past ones.
            </p>
          </div>
          <DoctorPrescriptionsSection />
        </div>
      </div>
    </div>
  )
}
