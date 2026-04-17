import { PatientPaymentsView } from "@/features/patient"

export default function PatientPaymentsPage() {
  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-6 px-4 py-4 md:py-6 lg:px-6">
          <div>
            <h1 className="h3">Payments</h1>
            <p className="body-base mt-1 text-muted-foreground">
              Review video visit charges, pay outstanding balances, and download receipts. Live card
              processing will activate when billing is connected.
            </p>
          </div>

          <PatientPaymentsView />
        </div>
      </div>
    </div>
  )
}
