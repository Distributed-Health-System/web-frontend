"use client"

import { useMemo, useState } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { PrescriptionForm } from "./PrescriptionForm"
import { PrescriptionList } from "./PrescriptionList"
import { mockPatients, mockPrescriptions } from "../../lib/mock-data"

export function DoctorPrescriptionsSection() {
  const [includeHistory, setIncludeHistory] = useState(false)

  const visiblePrescriptions = useMemo(() => {
    if (includeHistory) return mockPrescriptions
    return mockPrescriptions.filter((p) => p.status === "ACTIVE")
  }, [includeHistory])

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/30 px-3 py-2">
        <Checkbox
          id="rx-history"
          checked={includeHistory}
          onCheckedChange={(v) => setIncludeHistory(v === true)}
        />
        <Label htmlFor="rx-history" className="body-sm cursor-pointer font-normal leading-none">
          Show amended and revoked prescriptions
        </Label>
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <PrescriptionForm patients={mockPatients} />
        <PrescriptionList prescriptions={visiblePrescriptions} patients={mockPatients} />
      </div>
    </div>
  )
}
