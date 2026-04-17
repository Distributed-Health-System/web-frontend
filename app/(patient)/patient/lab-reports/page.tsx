import { PatientLabReportsView } from "@/features/patient"

export default function PatientLabReportsPage() {
  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-6 px-4 py-4 md:py-6 lg:px-6">
          <div>
            <h1 className="h3">Lab reports</h1>
            <p className="body-base mt-1 text-muted-foreground">
              Upload PDFs or images for your care team. Reports are saved in this browser until your
              backend storage is connected.
            </p>
          </div>

          <PatientLabReportsView />
        </div>
      </div>
    </div>
  )
}
