import { FindDoctorsView } from "@/features/patient"

export default function PatientFindDoctorsPage() {
  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-6 px-4 py-4 md:py-6 lg:px-6">
          <div>
            <h1 className="h3">Find doctors</h1>
            <p className="body-base mt-1 text-muted-foreground">
              Search and filter by specialization, then open a profile for full details and sample
              availability.
            </p>
          </div>

          <FindDoctorsView />
        </div>
      </div>
    </div>
  )
}
