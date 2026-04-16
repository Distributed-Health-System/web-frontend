import { AvailabilityScheduler } from "@/features/doctor/components/availability/AvailabilityScheduler"

export default function DoctorSchedulePage() {
  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-6 py-4 md:py-6 px-4 lg:px-6">
          <div>
            <h1 className="h3">Set Availability</h1>
            <p className="body-base text-muted-foreground mt-1">
              Choose which time slots you're available for patient consultations each week.
            </p>
          </div>
          <AvailabilityScheduler />
        </div>
      </div>
    </div>
  )
}
